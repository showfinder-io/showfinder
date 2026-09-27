#!/usr/bin/env python3
"""
diag-scoring-candidats-serp.py — SERP organique Google France (DataForSEO)
pour l'audit audits/scoring-candidats-2026-09-27 (58 candidats).

Requête par candidat : "<nom_seul ou short_name> <année de la prochaine
édition>" (même normalisation que diag-scoring-candidats-volumes.py).
Endpoint serp/google/organic/live/regular, location 2250 (France), langue fr,
depth 20.

Découpé en paquets pour pouvoir reprendre :
    python3 scripts/diag-scoring-candidats-serp.py --offset 0  --limit 10
    ...
    python3 scripts/diag-scoring-candidats-serp.py --finalize

Chaque paquet ajoute ses résultats à candidats-serp.jsonl (reprise : les noms
déjà présents sont sautés) et son coût à dfs-cost-serp.txt.

--finalize reconstruit candidats-serp.json (array) + candidats-serp-summary.csv
et affiche le coût total cumulé.
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
OUT_DIR = os.path.join(ROOT, "audits", "scoring-candidats-2026-09-27")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")
CANDIDATES_PATH = os.path.join(OUT_DIR, "candidates.json")
JSONL_PATH = os.path.join(OUT_DIR, "candidats-serp.jsonl")
COST_PATH = os.path.join(OUT_DIR, "dfs-cost-serp.txt")

# Agrégateurs connus (annuaires de salons faibles en SEO propre) : liste de la
# consigne + quelques domaines usuels vus dans ce type de SERP.
KNOWN_AGGREGATORS = [
    "eventseye.com",
    "10times.com",
    "exposale.net",
    "salonsenfrance.com",
    "nsalons.com",
    "foiresinfo.fr",
    "jds.fr",
    "tradefairdates.com",
    "auma.de",
    "expodatabase.com",
    "expodatabase.fr",
    "salons-online.com",
    "kompass.com",
    "eventseye.fr",
]

SOCIAL_DOMAINS = [
    "facebook.com",
    "linkedin.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "tiktok.com",
    "pinterest.com",
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
    s = re.split(r"\s+-\s+", name, maxsplit=1)[0]
    s = re.sub(r"\([^)]*\)", "", s)
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
    return any(domain == d or domain.endswith("." + d) for d in KNOWN_AGGREGATORS)


def is_social(domain: str) -> bool:
    return any(domain == d or domain.endswith("." + d) for d in SOCIAL_DOMAINS)


def load_done_keys():
    if not os.path.exists(JSONL_PATH):
        return set()
    done = set()
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            done.add(json.loads(line)["name"])
    return done


def run_batch(offset: int, limit: int):
    login, password = load_dfs_credentials()
    with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
        candidates = json.load(f)
    print(f"Candidats total : {len(candidates)}")
    done = load_done_keys()
    batch = candidates[offset:offset + limit]
    if not batch:
        print("Rien à traiter à cet offset.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    for c in batch:
        if c["name"] in done:
            print(f"[skip] {c['name']!r} déjà présent dans candidats-serp.jsonl")
            continue

        base = normalize_name(c.get("short_name") or c["name"])
        keyword = f"{base} {c['year']}"
        print(f"[{c['source']}/{c['vague']}] {c['name'][:50]!r} -> {keyword!r}", flush=True)

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
            cf.write(f"{c['name']},{cost}\n")

        task = data["tasks"][0]
        if task.get("status_code") != 20000:
            print(f"  ERREUR DataForSEO: {task.get('status_message')}", flush=True)
            record = {
                "name": c["name"], "source": c["source"], "vague": c["vague"], "year": c["year"],
                "website_url": c.get("website_url"), "keyword": keyword,
                "error": task.get("status_message"), "item_types": [], "organic_results": [],
            }
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
            "name": c["name"], "source": c["source"], "vague": c["vague"], "year": c["year"],
            "website_url": c.get("website_url"), "ambiguous": c.get("ambiguous", False),
            "keyword": keyword, "item_types": item_types, "organic_results": organic, "cost": cost,
        }
        with open(JSONL_PATH, "a", encoding="utf-8") as jf:
            jf.write(json.dumps(record, ensure_ascii=False) + "\n")

        print(f"  -> {len(organic)} résultats organiques, types={item_types}, coût {cost} USD", flush=True)


def finalize():
    if not os.path.exists(JSONL_PATH):
        print("candidats-serp.jsonl introuvable.", file=sys.stderr)
        sys.exit(1)

    records = []
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))

    with open(os.path.join(OUT_DIR, "candidats-serp.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    summary_rows = []
    for r in records:
        website_domain = domain_of(r.get("website_url") or "")
        organic = r.get("organic_results", [])
        top10 = [o for o in organic if (o.get("rank_group") or 999) <= 10]

        official_pos = None
        agoris_pos = None
        for o in organic:
            if website_domain and o["domain"] == website_domain and official_pos is None:
                official_pos = o.get("rank_group")
            if o["domain"] == "agoris.io" and agoris_pos is None:
                agoris_pos = o.get("rank_group")

        n_aggregators_top10 = 0
        n_forts_top10 = 0
        aggregators_present = set()
        top10_domains = []
        for o in top10:
            d = o["domain"]
            top10_domains.append(d)
            if is_aggregator(d):
                n_aggregators_top10 += 1
                aggregators_present.add(d)
            elif d == website_domain or d == "agoris.io" or is_social(d):
                pass
            else:
                n_forts_top10 += 1
        # agrégateurs présents sur toute la profondeur récupérée (pas seulement le top 10)
        for o in organic:
            if is_aggregator(o["domain"]):
                aggregators_present.add(o["domain"])

        has_events_block = any(
            t in ("events", "knowledge_graph", "top_stories", "local_pack")
            for t in r.get("item_types", [])
        )

        summary_rows.append({
            "name": r["name"],
            "source": r["source"],
            "vague": r["vague"],
            "year": r["year"],
            "keyword": r.get("keyword", ""),
            "official_pos": official_pos,
            "agoris_pos": agoris_pos,
            "n_forts_top10": n_forts_top10,
            "n_agregateurs_top10": n_aggregators_top10,
            "agregateurs_presents": "|".join(sorted(aggregators_present)),
            "has_events_or_kg_block": has_events_block,
            "item_types": "|".join(r.get("item_types", [])),
            "top10_domains": "|".join(top10_domains),
            "error": r.get("error", ""),
        })

    fieldnames = [
        "name", "source", "vague", "year", "keyword", "official_pos", "agoris_pos",
        "n_forts_top10", "n_agregateurs_top10", "agregateurs_presents",
        "has_events_or_kg_block", "item_types", "top10_domains", "error",
    ]
    with open(os.path.join(OUT_DIR, "candidats-serp-summary.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in summary_rows:
            writer.writerow({k: ("" if v is None else v) for k, v in row.items()})

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

    print(f"candidats-serp.json : {len(records)} candidats")
    print(f"candidats-serp-summary.csv : {len(summary_rows)} lignes")
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
