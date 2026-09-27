#!/usr/bin/env python3
"""
diag-scoring-candidats-merge.py — construit la version finale de
candidats-serp-summary.csv attendue par la consigne de l'audit
scoring-candidats-2026-09-27 : une ligne par candidat, avec les volumes
(nom seul / nom+année / salon+nom) ET les métriques SERP (position site
officiel, présence agoris, agrégateurs, résultats "forts") sur les mêmes
colonnes.

Colonnes : nom, source, vague, annee, vol_nom, vol_nom_annee, vol_salon_nom,
ambigu, official_pos, agoris_pos, n_agregateurs_top10, n_forts_top10,
top10_domains.

Ne fait aucun appel API : relit candidats-volumes.csv et
candidats-serp-summary.csv (déjà produits par les deux autres scripts) et les
fusionne sur le nom du candidat. Écrase candidats-serp-summary.csv en place
avec le format final (l'ancien format intermédiaire est aussi gardé sous
candidats-serp-summary-serp-only.csv pour trace).

Usage : python3 scripts/diag-scoring-candidats-merge.py
"""

import csv
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "audits", "scoring-candidats-2026-09-27")


def main():
    volumes_path = os.path.join(OUT_DIR, "candidats-volumes.csv")
    serp_summary_path = os.path.join(OUT_DIR, "candidats-serp-summary.csv")
    backup_path = os.path.join(OUT_DIR, "candidats-serp-summary-serp-only.csv")

    # 1. volumes par candidat : {name: {variant: search_volume}}
    vol_by_name = {}
    with open(volumes_path, "r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            vol_by_name.setdefault(row["name"], {})[row["variant"]] = row["search_volume"]

    # 2. métriques SERP par candidat (format intermédiaire produit par
    #    diag-scoring-candidats-serp.py --finalize)
    serp_rows = {}
    with open(serp_summary_path, "r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            serp_rows[row["name"]] = row

    # garde une copie de l'intermédiaire SERP seul, pour trace
    shutil.copyfile(serp_summary_path, backup_path)

    fieldnames = [
        "nom", "source", "vague", "annee", "vol_nom", "vol_nom_annee", "vol_salon_nom",
        "ambigu", "official_pos", "agoris_pos", "n_agregateurs_top10", "n_forts_top10",
        "top10_domains",
    ]
    out_rows = []
    missing_serp = []
    for name, vols in vol_by_name.items():
        srow = serp_rows.get(name)
        if srow is None:
            missing_serp.append(name)
            continue
        out_rows.append({
            "nom": name,
            "source": srow["source"],
            "vague": srow["vague"],
            "annee": srow["year"],
            "vol_nom": vols.get("nom_seul", ""),
            "vol_nom_annee": vols.get("nom_annee", ""),
            "vol_salon_nom": vols.get("salon_nom", ""),
            "ambigu": "disambig" in vols,
            "official_pos": srow["official_pos"],
            "agoris_pos": srow["agoris_pos"],
            "n_agregateurs_top10": srow["n_agregateurs_top10"],
            "n_forts_top10": srow["n_forts_top10"],
            "top10_domains": srow["top10_domains"],
        })

    with open(serp_summary_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in out_rows:
            writer.writerow(row)

    print(f"candidats-serp-summary.csv (final) : {len(out_rows)} lignes")
    if missing_serp:
        print(f"ATTENTION : {len(missing_serp)} candidat(s) sans ligne SERP correspondante : {missing_serp}")


if __name__ == "__main__":
    main()
