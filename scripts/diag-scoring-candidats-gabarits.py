#!/usr/bin/env python3
"""
diag-scoring-candidats-gabarits.py — Volumes de requêtes génériques (gabarits
de pages hubs) pour l'audit audits/scoring-candidats-2026-09-27, section B.

Pour chaque graine (secteur ou motif temporel/géographique), appelle
keywords_data/google_ads/keywords_for_keywords/live (un seed par appel, pour
garder l'attribution graine -> idée), location 2250 (France), langue fr.

Écrit/complète au fur et à mesure :
  audits/scoring-candidats-2026-09-27/gabarits-raw.jsonl
    (une ligne par graine : {"seed": ..., "results": [...], "cost": ...})
  audits/scoring-candidats-2026-09-27/dfs-cost-gabarits.txt (une ligne par appel)

Reprise : les graines déjà présentes dans gabarits-raw.jsonl sont sautées.

python3 scripts/diag-scoring-candidats-gabarits.py --seed "salon agricole"
python3 scripts/diag-scoring-candidats-gabarits.py --all
python3 scripts/diag-scoring-candidats-gabarits.py --finalize
  -> filtre (volume >= 20, pertinence salons pro), classe par famille,
     écrit gabarits-volumes.csv
"""

import argparse
import csv
import json
import os
import re
import sys

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "audits", "scoring-candidats-2026-09-27")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")
RAW_PATH = os.path.join(OUT_DIR, "gabarits-raw.jsonl")
COST_PATH = os.path.join(OUT_DIR, "dfs-cost-gabarits.txt")

SEEDS_SECTEUR = [
    "salon agricole", "salon élevage", "salon agroalimentaire", "salon industrie",
    "salon btp", "salon du bâtiment", "salon logistique", "salon santé",
    "salon tourisme", "salon énergie", "salon environnement", "salon numérique",
    "salon franchise", "salon cosmétique", "salon vin professionnel",
    "salon forêt bois", "salon maritime", "salon défense",
]

SEEDS_TEMPOREL_GEO = [
    "salon professionnel 2027", "salons professionnels paris 2027",
    "salon professionnel lyon", "salons professionnels bretagne",
    "salon agricole 2027", "salon agricole septembre", "salon élevage 2027",
    "calendrier salons professionnels", "agenda salons 2027",
]

ALL_SEEDS = [("secteur", s) for s in SEEDS_SECTEUR] + [("temporel_geo", s) for s in SEEDS_TEMPOREL_GEO]

# Exclusions : foires grand public, emploi, mariage, auto grand public, etc.
EXCLUDE_PATTERNS = [
    r"\bemploi\b", r"\brecrutement\b", r"\bjob\b", r"\balternance\b", r"\bstage\b",
    r"\bmariage\b", r"\bmarier\b", r"\bmarié",
    r"\bauto\b", r"\bvoiture\b", r"\bvéhicule\b", r"\bmotos?\b", r"\bcaravaning\b",
    r"\bimmobilier\b", r"\bmaison\b", r"\bhabitat\b(?!.*pro)",
    r"\bchien\b", r"\bchat\b", r"\banimaux de compagnie\b",
    r"\betudiant\b", r"\bétudiant\b", r"\borientation\b",
    r"\bloisir\b", r"\bvacances\b", r"\bcamping-?car\b",
    r"\bmode d.emploi\b",
    r"\bfoire\b",  # "foire" (vs "salon professionnel") signale une foire grand public en France
    r"bien.?[êe]tre",  # salons bien-être / nature et bien-être : grand public
]
EXCLUDE_RE = re.compile("|".join(EXCLUDE_PATTERNS), re.IGNORECASE)

# "salon" désigne aussi bien un salon professionnel qu'un salon de coiffure / de
# thé (business) : la graine "salon franchise" ramène surtout des requêtes sur
# des franchises de coiffure/thé/beauté, sans rapport avec un salon pro.
HAIRDRESSER_FRANCHISE_RE = re.compile(
    r"coiff|dessange|tchip|jean louis david|pascal coste|camille albane|"
    r"franck provost|salon de th[ée]|franchise beaut[ée]",
    re.IGNORECASE,
)

# Le SIA (Salon International de l'Agriculture, Porte de Versailles) est une
# foire grand public (familles, animaux) : la graine "salon agricole" ne
# ramène presque que des requêtes SIA (billets, dates, adresse...), à écarter
# selon la consigne "écarte foires grand public". Seule la frange machinisme
# agricole professionnel (SIMA, matériel/machines agricoles, Innov-Agri) est
# conservée sous ce seed.
SIA_RE = re.compile(r"agricultur|agriculteur", re.IGNORECASE)
AGRI_PRO_WHITELIST_RE = re.compile(
    r"sima|machinisme|materiel agricole|mat[ée]riel agricole|machine[s]? agricole|innov agri|exposition materiel",
    re.IGNORECASE,
)

# Autres foires/évènements grand public isolés repérés manuellement dans les résultats bruts
EXTRA_EXCLUDE_KEYWORDS = {
    "salon sante bien etre", "salon santé et bien être", "salon foire",
    "salon miniature agricole",
}


def is_grand_public_noise(keyword: str) -> bool:
    kw = keyword.lower()
    if kw in EXTRA_EXCLUDE_KEYWORDS:
        return True
    if SIA_RE.search(kw) and not AGRI_PRO_WHITELIST_RE.search(kw):
        return True
    if HAIRDRESSER_FRANCHISE_RE.search(kw):
        return True
    return False

MONTHS = [
    "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre",
]


def load_dfs_credentials():
    login = password = None
    with open(DFS_ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key, value = key.strip(), value.strip()
            if key == "DATAFORSEO_LOGIN":
                login = value
            elif key == "DATAFORSEO_PASSWORD":
                password = value
    if not login or not password:
        raise RuntimeError("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD introuvables.")
    return login, password


def load_done_seeds():
    if not os.path.exists(RAW_PATH):
        return set()
    done = set()
    with open(RAW_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                done.add(json.loads(line)["seed"])
    return done


def fetch_seed(login, password, family, seed):
    print(f"[{family}] {seed!r} -> keywords_for_keywords...", flush=True)
    resp = requests.post(
        "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live",
        auth=(login, password),
        json=[{
            "keywords": [seed],
            "location_code": 2250,
            "language_code": "fr",
            "sort_by": "search_volume",
        }],
        timeout=90,
    )
    resp.raise_for_status()
    data = resp.json()
    cost = data.get("cost", 0)
    with open(COST_PATH, "a", encoding="utf-8") as cf:
        cf.write(f"{seed},{cost}\n")

    task = data["tasks"][0]
    if task.get("status_code") != 20000:
        print(f"  ERREUR DataForSEO: {task.get('status_message')}", flush=True)
        record = {"seed": seed, "family": family, "error": task.get("status_message"), "results": [], "cost": cost}
        with open(RAW_PATH, "a", encoding="utf-8") as jf:
            jf.write(json.dumps(record, ensure_ascii=False) + "\n")
        return

    results = task.get("result") or []
    slim = [{
        "keyword": r.get("keyword"),
        "search_volume": r.get("search_volume"),
        "competition": r.get("competition"),
        "cpc": r.get("cpc"),
    } for r in results]
    record = {"seed": seed, "family": family, "results": slim, "cost": cost}
    with open(RAW_PATH, "a", encoding="utf-8") as jf:
        jf.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"  -> {len(slim)} idées, coût {cost} USD", flush=True)


def run_one(seed):
    login, password = load_dfs_credentials()
    family = "secteur" if seed in SEEDS_SECTEUR else "temporel_geo"
    done = load_done_seeds()
    if seed in done:
        print(f"[skip] {seed!r} déjà présent.")
        return
    os.makedirs(OUT_DIR, exist_ok=True)
    fetch_seed(login, password, family, seed)


def run_all():
    login, password = load_dfs_credentials()
    done = load_done_seeds()
    os.makedirs(OUT_DIR, exist_ok=True)
    for family, seed in ALL_SEEDS:
        if seed in done:
            print(f"[skip] {seed!r} déjà présent.")
            continue
        fetch_seed(login, password, family, seed)


def classify_family(keyword: str, seed_family: str) -> str:
    kw = keyword.lower()
    has_year = bool(re.search(r"\b20(2[6-9]|3[0-9])\b", kw))
    has_month = any(m in kw for m in MONTHS)
    # villes/régions françaises usuelles pouvant apparaître dans les idées
    geo_markers = [
        "paris", "lyon", "marseille", "toulouse", "bordeaux", "lille", "nantes",
        "strasbourg", "rennes", "montpellier", "nice", "grenoble", "rouen",
        "bretagne", "normandie", "occitanie", "aquitaine", "provence", "alsace",
        "picardie", "auvergne", "centre-val", "pays de la loire", "hauts-de-france",
        "ile-de-france", "île-de-france", "grand est", "bourgogne", "franche-comte",
    ]
    has_geo = any(g in kw for g in geo_markers)

    if seed_family == "temporel_geo" and not has_year and not has_month and not has_geo:
        return "generique"
    if has_year and has_geo:
        return "secteur_ville" if any(c in kw for c in geo_markers[:17]) else "secteur_region"
    if has_year:
        return "secteur_annee"
    if has_month:
        return "secteur_mois"
    if has_geo:
        return "secteur_region" if any(g in kw for g in geo_markers[17:]) else "secteur_ville"
    return "secteur" if seed_family == "secteur" else "generique"


def finalize():
    if not os.path.exists(RAW_PATH):
        print("gabarits-raw.jsonl introuvable.", file=sys.stderr)
        sys.exit(1)

    by_keyword = {}  # keyword -> {seed, family, search_volume, competition, cpc}
    with open(RAW_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            if rec.get("error"):
                continue
            for r in rec["results"]:
                kw = (r.get("keyword") or "").strip()
                if not kw:
                    continue
                vol = r.get("search_volume") or 0
                if vol < 20:
                    continue
                if EXCLUDE_RE.search(kw):
                    continue
                if is_grand_public_noise(kw):
                    continue
                if kw in by_keyword:
                    continue  # garde la première graine rencontrée (ordre = ordre d'appel)
                by_keyword[kw] = {
                    "seed": rec["seed"],
                    "seed_family": rec["family"],
                    "search_volume": vol,
                    "competition": r.get("competition"),
                    "cpc": r.get("cpc"),
                }

    rows = []
    for kw, m in by_keyword.items():
        famille = classify_family(kw, m["seed_family"])
        rows.append({
            "requete": kw,
            "graine": m["seed"],
            "volume": m["search_volume"],
            "competition": m["competition"] if m["competition"] is not None else "",
            "cpc": m["cpc"] if m["cpc"] is not None else "",
            "famille": famille,
        })
    rows.sort(key=lambda r: r["volume"], reverse=True)

    out_path = os.path.join(OUT_DIR, "gabarits-volumes.csv")
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["requete", "graine", "volume", "competition", "cpc", "famille"])
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    total_cost = 0.0
    if os.path.exists(COST_PATH):
        with open(COST_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    total_cost += float(line.rsplit(",", 1)[1])
                except (IndexError, ValueError):
                    pass

    print(f"gabarits-volumes.csv : {len(rows)} lignes (après filtre volume>=20 + exclusions grand public)")
    print(f"Coût DataForSEO cumulé (gabarits) : {total_cost:.4f} USD")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=str, default=None)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--finalize", action="store_true")
    args = parser.parse_args()

    if args.finalize:
        finalize()
    elif args.all:
        run_all()
    elif args.seed:
        run_one(args.seed)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
