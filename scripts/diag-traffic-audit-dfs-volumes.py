#!/usr/bin/env python3
"""
diag-traffic-audit-dfs-volumes.py — Volumes Google Ads France (DataForSEO)
pour l'audit traffic-vs-size-2026-09-27.

Pour chaque salon publié (db-salons.csv), génère 3 variantes de mot-clé :
  - le nom seul, normalisé en minuscules (parenthèses de ville retirées,
    ponctuation inutile retirée)
  - "<nom> 2027"
  - "salon <nom>" si le nom ne commence pas déjà par "salon"

Appelle keywords_data/google_ads/search_volume/live (location 2250 = France,
language "fr"), un seul call avec tous les mots-clés uniques (< 1000).

Écrit audits/traffic-vs-size-2026-09-27/dfs-volumes.csv
  (slug, keyword, variant, search_volume, competition, cpc)
et affiche le coût renvoyé par l'API.

Usage : python3 scripts/diag-traffic-audit-dfs-volumes.py
"""

import csv
import os
import re
import sys

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "audits", "traffic-vs-size-2026-09-27")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")


def load_dfs_credentials():
    login = None
    password = None
    with open(DFS_ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip()
            if key == "DATAFORSEO_LOGIN":
                login = value
            elif key == "DATAFORSEO_PASSWORD":
                password = value
    if not login or not password:
        raise RuntimeError("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD introuvables dans ~/.claude/skills/seo-geo/.env")
    return login, password


def normalize_name(name: str) -> str:
    """Nom seul normalisé : minuscules, parenthèses retirées, ponctuation inutile retirée.

    Garde lettres (accents inclus), chiffres, espaces et tirets ; tout le reste
    (apostrophes, @, &, /, +, guillemets, etc.) est remplacé par un espace.
    Un nom comme "architect@work Lyon" devient "architect work lyon" : DataForSEO
    refuse les symboles (ex: '@') dans les mots-clés.
    """
    s = name
    # retire les suffixes entre parenthèses (souvent une ville : "Salon X (Lyon)")
    s = re.sub(r"\([^)]*\)", "", s)
    s = s.lower()
    s = re.sub(r"[^\w\s-]+", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_variants(name: str):
    base = normalize_name(name)
    variants = [("nom_seul", base)]
    variants.append(("nom_2027", f"{base} 2027"))
    if not base.startswith("salon "):
        variants.append(("salon_nom", f"salon {base}"))
    return variants


def read_published_salons():
    path = os.path.join(OUT_DIR, "db-salons.csv")
    rows = []
    with open(path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["status"] == "published":
                rows.append(row)
    return rows


def main():
    login, password = load_dfs_credentials()
    auth = (login, password)

    salons = read_published_salons()
    print(f"Salons publiés : {len(salons)}")

    # (slug, variant, keyword) pour chaque salon, + dédup des keywords pour l'appel API
    records = []
    keyword_set = set()
    for s in salons:
        for variant, keyword in build_variants(s["name"]):
            if not keyword:
                continue
            records.append((s["slug"], keyword, variant))
            keyword_set.add(keyword)

    # DataForSEO / Google Ads refuse les mots-clés > 10 mots ou > 80 caractères.
    all_keywords = sorted(keyword_set)
    keywords = [k for k in all_keywords if len(k.split()) <= 10 and len(k) <= 80]
    skipped_keywords = sorted(set(all_keywords) - set(keywords))
    print(f"Mots-clés uniques : {len(all_keywords)} (records : {len(records)})")
    if skipped_keywords:
        print(f"  -> {len(skipped_keywords)} mot(s)-clé(s) exclu(s) (>10 mots ou >80 car., refusés par l'API) :")
        for k in skipped_keywords:
            print(f"     - {k!r}")
    if len(keywords) > 1000:
        print("ERREUR: plus de 1000 mots-clés, il faudrait découper en plusieurs tâches.", file=sys.stderr)
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

    out_path = os.path.join(OUT_DIR, "dfs-volumes.csv")
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["slug", "keyword", "variant", "search_volume", "competition", "cpc"])
        matched = 0
        for slug, keyword, variant in records:
            m = by_keyword.get(keyword.lower())
            if m is None:
                writer.writerow([slug, keyword, variant, "", "", ""])
                continue
            matched += 1
            writer.writerow([
                slug,
                keyword,
                variant,
                m["search_volume"] if m["search_volume"] is not None else "",
                m["competition"] if m["competition"] is not None else "",
                m["cpc"] if m["cpc"] is not None else "",
            ])

    print(f"\n-> dfs-volumes.csv écrit ({len(records)} lignes, {matched} avec une réponse API).")
    print(f"Coût DataForSEO (cet appel) : {cost} USD")

    with open(os.path.join(OUT_DIR, "dfs-cost-volumes.txt"), "w", encoding="utf-8") as f:
        f.write(f"{cost}\n")


if __name__ == "__main__":
    main()
