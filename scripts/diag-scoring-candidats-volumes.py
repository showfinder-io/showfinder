#!/usr/bin/env python3
"""
diag-scoring-candidats-volumes.py — Volumes Google Ads France (DataForSEO)
pour l'audit audits/scoring-candidats-2026-09-27 (58 candidats : shortlist 3
vagues 1-3 + lots C/D de la shortlist 2).

Pour chaque candidat, génère les variantes de mot-clé :
  - nom_seul : nom d'usage normalisé en minuscules (parenthèses et sous-titres
    longs retirés)
  - nom_annee : "<nom_seul> <année de la prochaine édition>"
  - salon_nom : "salon <nom_seul>" (sauf si nom_seul commence déjà par "salon")
  - disambig : variante désambiguïsée si le candidat est marqué ambigu et
    porte une valeur "disambig" non nulle dans candidates.json

Appelle keywords_data/google_ads/search_volume/live (location 2250 = France,
langue "fr"), un seul call avec tous les mots-clés uniques.

Écrit audits/scoring-candidats-2026-09-27/candidats-volumes.csv
  (name, source, vague, year, keyword, variant, search_volume, competition, cpc)

Usage : python3 scripts/diag-scoring-candidats-volumes.py
"""

import csv
import json
import os
import re
import sys

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "audits", "scoring-candidats-2026-09-27")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")
CANDIDATES_PATH = os.path.join(OUT_DIR, "candidates.json")


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
        raise RuntimeError("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD introuvables dans ~/.claude/skills/seo-geo/.env")
    return login, password


def normalize_name(name: str) -> str:
    """Nom d'usage normalisé : minuscules, parenthèses retirées, ponctuation
    retirée. Retire aussi un sous-titre long après un tiret " - " (ex: "SATIS
    - Salon des Technologies de l'Image et du Son" -> "satis")."""
    s = name
    # coupe un sous-titre long introduit par " - " (garde la partie avant)
    s = re.split(r"\s+-\s+", s, maxsplit=1)[0]
    # retire les suffixes entre parenthèses
    s = re.sub(r"\([^)]*\)", "", s)
    s = s.lower()
    s = re.sub(r"[^\w\s-]+", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_variants(candidate: dict):
    base = normalize_name(candidate.get("short_name") or candidate["name"])
    year = candidate["year"]
    variants = [("nom_seul", base), ("nom_annee", f"{base} {year}")]
    if not base.startswith("salon "):
        variants.append(("salon_nom", f"salon {base}"))
    if candidate.get("ambiguous") and candidate.get("disambig"):
        variants.append(("disambig", candidate["disambig"]))
    return variants


def main():
    login, password = load_dfs_credentials()
    auth = (login, password)

    with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
        candidates = json.load(f)
    print(f"Candidats : {len(candidates)}")

    records = []  # (name, source, vague, year, keyword, variant)
    keyword_set = set()
    for c in candidates:
        for variant, keyword in build_variants(c):
            if not keyword:
                continue
            records.append((c["name"], c["source"], c["vague"], c["year"], keyword, variant))
            keyword_set.add(keyword)

    all_keywords = sorted(keyword_set)
    keywords = [k for k in all_keywords if len(k.split()) <= 10 and len(k) <= 80]
    skipped = sorted(set(all_keywords) - set(keywords))
    print(f"Mots-clés uniques : {len(all_keywords)} (records : {len(records)})")
    if skipped:
        print(f"  -> {len(skipped)} mot(s)-clé(s) exclu(s) (>10 mots ou >80 car.) :")
        for k in skipped:
            print(f"     - {k!r}")
    if len(keywords) > 1000:
        print("ERREUR: plus de 1000 mots-clés.", file=sys.stderr)
        sys.exit(1)

    print("Appel DataForSEO keywords_data/google_ads/search_volume/live...")
    resp = requests.post(
        "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
        auth=auth,
        json=[{
            "keywords": keywords,
            "location_code": 2250,
            "language_code": "fr",
        }],
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("status_code") != 20000:
        print(f"ERREUR DataForSEO: {data.get('status_message')}", file=sys.stderr)
        sys.exit(1)

    task = data["tasks"][0]
    cost = data.get("cost", task.get("cost", 0))
    results = task.get("result") or []
    print(f"Résultats reçus : {len(results)}")

    by_keyword = {}
    for item in results:
        kw = item.get("keyword")
        if kw is None:
            continue
        by_keyword[kw.lower()] = {
            "search_volume": item.get("search_volume"),
            "competition": item.get("competition"),
            "cpc": item.get("cpc"),
        }

    out_path = os.path.join(OUT_DIR, "candidats-volumes.csv")
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "source", "vague", "year", "keyword", "variant", "search_volume", "competition", "cpc"])
        matched = 0
        for name, source, vague, year, keyword, variant in records:
            m = by_keyword.get(keyword.lower())
            if m is None:
                writer.writerow([name, source, vague, year, keyword, variant, "", "", ""])
                continue
            matched += 1
            writer.writerow([
                name, source, vague, year, keyword, variant,
                m["search_volume"] if m["search_volume"] is not None else "",
                m["competition"] if m["competition"] is not None else "",
                m["cpc"] if m["cpc"] is not None else "",
            ])

    print(f"\n-> candidats-volumes.csv écrit ({len(records)} lignes, {matched} avec une réponse API).")
    print(f"Coût DataForSEO (cet appel) : {cost} USD")

    with open(os.path.join(OUT_DIR, "dfs-cost-volumes.txt"), "w", encoding="utf-8") as f:
        f.write(f"{cost}\n")


if __name__ == "__main__":
    main()
