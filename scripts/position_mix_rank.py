"""Décomposition de la variation de position pondérée : effet rang vs effet mix (D44, périmètres D45).

Lit pages.csv (page,clicks,impressions,ctr,position) dans deux baselines GSC,
classe chaque page par gabarit (même logique que classifyUrl dans
scripts/gsc-baseline-export.ts, qui produit by-gabarit.csv), puis pour chaque
périmètre calcule la position pondérée par les impressions aux deux dates :
  ΔP = P_new - P_old
  effet rang = Σ sur les pages communes de (part d'impressions moyenne des deux
               dates, au sein du périmètre) x (pos_new - pos_old)
  effet mix  = ΔP - effet rang (entrées, sorties et changement de répartition)
Périmètres (D45) : toute la propriété, hors prestataire-fiche et en-prestataire-fiche,
salon-fiche FR, salon-fiche FR hors 5 fiches saisonnières (EXCLUDED_SLUGS),
secteur-fiche + ville-fiche.

Contrôle aussi la présence de queries-by-page.csv dans chaque baseline
(>= 1000 lignes, colonnes query,page,clicks,impressions,ctr,position).

Usage : python3 scripts/position_mix_rank.py audits/gsc-baseline-2026-09-28 audits/gsc-baseline-2026-10-12
"""
import argparse
import csv
import re
from pathlib import Path

FAMILIES = {
    "salons": "salon",
    "secteurs": "secteur",
    "villes": "ville",
    "lieux": "lieu",
    "prestataires": "prestataire",
    "organisateurs": "organisateur",
    "blog": "blog",
}
QBP_COLUMNS = ["query", "page", "clicks", "impressions", "ctr", "position"]
QBP_MIN_ROWS = 1000

# Fiches salon FR à forte saisonnalité (D45), exclues du périmètre (d)
EXCLUDED_SLUGS = {
    "terres-de-jim", "ad2s-bordeaux", "salon-herbe",
    "sommet-elevage-clermont", "tech-and-bio",
}

# Chaque filtre reçoit la ligne de page : {"gabarit": ..., "slug": ..., ...}
SCOPES = [
    ("(a) toute la propriété", lambda v: True),
    ("(b) hors prestataire-fiche et en-prestataire-fiche",
     lambda v: v["gabarit"] not in ("prestataire-fiche", "en-prestataire-fiche")),
    ("(c) salon-fiche FR", lambda v: v["gabarit"] == "salon-fiche"),
    ("(d) salon-fiche FR hors 5 fiches saisonnières",
     lambda v: v["gabarit"] == "salon-fiche" and v["slug"] not in EXCLUDED_SLUGS),
    ("(e) secteur-fiche + ville-fiche",
     lambda v: v["gabarit"] in ("secteur-fiche", "ville-fiche")),
]


def classify_url(url: str) -> str:
    p = re.sub(r"^https?://[^/]+", "", url).rstrip("/")
    if p in ("", "/"):
        return "home"
    segments = p.lstrip("/").split("/")
    prefix = ""
    if segments[0] == "en":
        prefix = "en-"
        segments = segments[1:]
        if not segments:
            return "en-home"
    family = FAMILIES.get(segments[0])
    if family:
        return f"{prefix}{family}-{'fiche' if len(segments) > 1 else 'index'}"
    return f"{prefix}autre"


def load_pages(baseline_dir: Path) -> dict[str, dict]:
    rows = {}
    with (baseline_dir / "pages.csv").open(encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            path = re.sub(r"^https?://[^/]+", "", r["page"]).rstrip("/")
            rows[r["page"]] = {
                "gabarit": classify_url(r["page"]),
                "slug": path.rsplit("/", 1)[-1],
                "imp": int(r["impressions"]),
                "pos": float(r["position"]),
            }
    return rows


def check_qbp(baseline_dir: Path) -> str:
    path = baseline_dir / "queries-by-page.csv"
    if not path.exists():
        return f"KO : {path} absent"
    with path.open(encoding="utf-8") as fh:
        reader = csv.reader(fh)
        header = next(reader, [])
        n = sum(1 for _ in reader)
    if header != QBP_COLUMNS:
        return f"KO : colonnes {header} (attendu {QBP_COLUMNS}), {n} lignes"
    if n < QBP_MIN_ROWS:
        return f"KO : {n} lignes (< {QBP_MIN_ROWS})"
    return f"OK : {n} lignes, colonnes conformes"


def decompose(old: dict, new: dict, keep) -> dict:
    o = {k: v for k, v in old.items() if keep(v)}
    n = {k: v for k, v in new.items() if keep(v)}
    imp_o = sum(v["imp"] for v in o.values())
    imp_n = sum(v["imp"] for v in n.values())
    pos_o = sum(v["imp"] * v["pos"] for v in o.values()) / imp_o if imp_o else 0.0
    pos_n = sum(v["imp"] * v["pos"] for v in n.values()) / imp_n if imp_n else 0.0
    common = set(o) & set(n)
    rank = 0.0
    for k in common:
        share = (o[k]["imp"] / imp_o + n[k]["imp"] / imp_n) / 2
        rank += share * (n[k]["pos"] - o[k]["pos"])
    delta = pos_n - pos_o
    return {
        "pages_old": len(o), "pages_new": len(n), "common": len(common),
        "imp_old": imp_o, "imp_new": imp_n,
        "pos_old": pos_o, "pos_new": pos_n,
        "delta": delta, "rank": rank, "mix": delta - rank,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("old_dir")
    ap.add_argument("new_dir")
    args = ap.parse_args()
    old_dir, new_dir = Path(args.old_dir), Path(args.new_dir)
    old, new = load_pages(old_dir), load_pages(new_dir)

    print("## Contrôle queries-by-page.csv")
    for d in (old_dir, new_dir):
        print(f"- {d.name} : {check_qbp(d)}")
    print()
    print("## Décomposition de la position pondérée")
    print("| Périmètre | Pages old / new / communes | Imp old / new | Pos old | Pos new | ΔP | Effet rang | Effet mix |")
    print("|---|---|---|---|---|---|---|---|")
    results = {}
    for label, keep in SCOPES:
        r = decompose(old, new, keep)
        results[label] = r
        print(f"| {label} | {r['pages_old']} / {r['pages_new']} / {r['common']} "
              f"| {r['imp_old']} / {r['imp_new']} | {r['pos_old']:.2f} | {r['pos_new']:.2f} "
              f"| {r['delta']:+.2f} | {r['rank']:+.2f} | {r['mix']:+.2f} |")

    rank_b = results[SCOPES[1][0]]["rank"]
    rank_c = results[SCOPES[2][0]]["rank"]
    if rank_b <= -0.2 and rank_c <= 0:
        verdict = "OK"
    elif rank_b >= 0:
        verdict = "KO"
    else:
        verdict = "neutre"
    print()
    print(f"Verdict : {verdict} (effet rang (b) = {rank_b:+.2f} pt, effet rang (c) = {rank_c:+.2f} pt)")


if __name__ == "__main__":
    main()
