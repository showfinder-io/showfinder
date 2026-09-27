#!/usr/bin/env python3
"""
diag-traffic-audit-dfs-serp.py — SERP Google France (DataForSEO) pour l'audit
traffic-vs-size-2026-09-27, sur un échantillon de 60 salons publiés (20 plus
gros, 20 médians, 20 plus petits selon estimated_exhibitors).

Requête par salon : "<nom normalisé> 2027" (même normalisation que
diag-traffic-audit-dfs-volumes.py). Endpoint serp/google/organic/live/regular,
location 2250 (France), language fr, depth 20.

Découpé en paquets pour éviter un run trop long en une seule commande :
    python3 scripts/diag-traffic-audit-dfs-serp.py --offset 0  --limit 10
    python3 scripts/diag-traffic-audit-dfs-serp.py --offset 10 --limit 10
    ... jusqu'à offset 50 (60 salons au total)

Chaque paquet ajoute ses résultats à dfs-serp.jsonl (une ligne JSON par salon,
reprise possible : les slugs déjà présents dans le jsonl sont sautés) et son
coût à dfs-cost-serp.txt (une ligne par appel).

python3 scripts/diag-traffic-audit-dfs-serp.py --finalize
  reconstruit dfs-serp.json (array) + dfs-serp-summary.csv depuis le jsonl,
  et affiche le coût total cumulé.

Usage : python3 scripts/diag-traffic-audit-dfs-serp.py --offset 0 --limit 10
"""

import argparse
import csv
import json
import os
import re
import sys
from urllib.parse import urlparse

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "audits", "traffic-vs-size-2026-09-27")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")
JSONL_PATH = os.path.join(OUT_DIR, "dfs-serp.jsonl")
COST_PATH = os.path.join(OUT_DIR, "dfs-cost-serp.txt")

AGGREGATOR_MARKERS = [
    "10times.com",
    "eventseye.com",
    "expodatabase.com",
    "tradefairdates.com",
    "salons-online",
    "auma.de",
    "nfcp",
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


def normalize_name(name: str) -> str:
    s = re.sub(r"\([^)]*\)", "", name)
    s = s.lower()
    s = re.sub(r"[^\w\s-]+", " ", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def domain_of(url: str) -> str:
    try:
        netloc = urlparse(url).netloc.lower()
        return netloc[4:] if netloc.startswith("www.") else netloc
    except Exception:
        return ""


def is_aggregator(domain: str) -> bool:
    return any(marker in domain for marker in AGGREGATOR_MARKERS)


def build_sample():
    """20 plus gros, 20 médians, 20 plus petits salons publiés par estimated_exhibitors."""
    rows = []
    with open(os.path.join(OUT_DIR, "db-salons.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["status"] == "published" and row["estimated_exhibitors"] not in ("", None):
                rows.append(row)
    rows.sort(key=lambda r: int(r["estimated_exhibitors"]), reverse=True)
    n = len(rows)
    top20 = rows[:20]
    bottom20 = rows[-20:]
    mid_start = (n - 20) // 2
    median20 = rows[mid_start:mid_start + 20]

    sample = []
    seen_slugs = set()
    for bucket, group in (("top20", top20), ("median20", median20), ("bottom20", bottom20)):
        for r in group:
            if r["slug"] in seen_slugs:
                continue  # évite un doublon si les tranches se chevauchent
            seen_slugs.add(r["slug"])
            sample.append({
                "slug": r["slug"],
                "name": r["name"],
                "estimated_exhibitors": int(r["estimated_exhibitors"]),
                "website_url": r["website_url"],
                "size_bucket": bucket,
            })
    return sample


def load_done_slugs():
    if not os.path.exists(JSONL_PATH):
        return set()
    done = set()
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            done.add(json.loads(line)["slug"])
    return done


def run_batch(offset: int, limit: int):
    login, password = load_dfs_credentials()
    sample = build_sample()
    print(f"Échantillon total : {len(sample)} salons.")
    done = load_done_slugs()
    batch = sample[offset:offset + limit]
    if not batch:
        print("Rien à traiter à cet offset (échantillon épuisé).")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    for item in batch:
        if item["slug"] in done:
            print(f"[skip] {item['slug']} déjà présent dans dfs-serp.jsonl")
            continue

        keyword = f"{normalize_name(item['name'])} 2027"
        print(f"[{item['size_bucket']}] {item['slug']} -> requête SERP: {keyword!r}", flush=True)

        resp = requests.post(
            "https://api.dataforseo.com/v3/serp/google/organic/live/regular",
            auth=(login, password),
            json=[{
                "keyword": keyword,
                "location_code": 2250,
                "language_code": "fr",
                "depth": 20,
            }],
            timeout=90,
        )
        resp.raise_for_status()
        data = resp.json()

        cost = data.get("cost", 0)
        with open(COST_PATH, "a", encoding="utf-8") as cf:
            cf.write(f"{item['slug']},{cost}\n")

        task = data["tasks"][0]
        if task.get("status_code") != 20000:
            print(f"  ERREUR DataForSEO pour {item['slug']}: {task.get('status_message')}", flush=True)
            record = {**item, "keyword": keyword, "error": task.get("status_message"), "organic_results": [], "item_types": []}
            with open(JSONL_PATH, "a", encoding="utf-8") as jf:
                jf.write(json.dumps(record, ensure_ascii=False) + "\n")
            continue

        result = (task.get("result") or [{}])[0]
        items = result.get("items") or []
        item_types = sorted(set(it.get("type") for it in items if it.get("type")))

        organic = []
        for it in items:
            if it.get("type") != "organic":
                continue
            url = it.get("url") or ""
            organic.append({
                "rank_absolute": it.get("rank_absolute"),
                "rank_group": it.get("rank_group"),
                "domain": domain_of(url),
                "url": url,
                "title": it.get("title"),
            })

        record = {
            **item,
            "keyword": keyword,
            "item_types": item_types,
            "organic_results": organic,
            "cost": cost,
        }
        with open(JSONL_PATH, "a", encoding="utf-8") as jf:
            jf.write(json.dumps(record, ensure_ascii=False) + "\n")

        n_organic = len(organic)
        print(f"  -> {n_organic} résultats organiques, coût {cost} USD", flush=True)


def finalize():
    if not os.path.exists(JSONL_PATH):
        print("dfs-serp.jsonl introuvable, rien à finaliser.", file=sys.stderr)
        sys.exit(1)

    records = []
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))

    with open(os.path.join(OUT_DIR, "dfs-serp.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    summary_rows = []
    for r in records:
        website_domain = domain_of(r.get("website_url") or "")
        organic = r.get("organic_results", [])
        agoris_pos = None
        official_pos = None
        top10 = [o for o in organic if (o.get("rank_group") or 999) <= 10]
        n_aggregators_top10 = 0
        top10_domains = []
        for o in top10:
            top10_domains.append(o["domain"])
            if is_aggregator(o["domain"]):
                n_aggregators_top10 += 1
        for o in organic:
            if o["domain"] == "agoris.io" and agoris_pos is None:
                agoris_pos = o.get("rank_group")
            if website_domain and o["domain"] == website_domain and official_pos is None:
                official_pos = o.get("rank_group")

        summary_rows.append([
            r["slug"],
            r["size_bucket"],
            agoris_pos,
            official_pos,
            n_aggregators_top10,
            "|".join(top10_domains),
        ])

    with open(os.path.join(OUT_DIR, "dfs-serp-summary.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["slug", "size_bucket", "agoris_pos", "official_pos", "n_aggregators_top10", "top10_domains"])
        for row in summary_rows:
            writer.writerow(["" if v is None else v for v in row])

    total_cost = 0.0
    if os.path.exists(COST_PATH):
        with open(COST_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    total_cost += float(line.split(",")[1])
                except (IndexError, ValueError):
                    pass

    print(f"dfs-serp.json : {len(records)} salons")
    print(f"dfs-serp-summary.csv : {len(summary_rows)} lignes")
    print(f"Coût DataForSEO cumulé (SERP) : {total_cost:.4f} USD")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--finalize", action="store_true")
    args = parser.parse_args()

    if args.finalize:
        finalize()
    else:
        run_batch(args.offset, args.limit)


if __name__ == "__main__":
    main()
