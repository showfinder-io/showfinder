#!/usr/bin/env python3
"""Extinction des slugs millésimés (H1 migration 301) — série par baseline.

Split des salon-fiche FR entre slugs legacy (finissant en -20XX) et slugs
canoniques edition-agnostiques, agrégats clics/imp et part d'impressions
legacy. À lancer après chaque export GSC pour prolonger la série de
[[lacune-part-pages-vivantes]] et [[slug-edition-agnostique]].

Usage : python3 scripts/analyze_slug_migration.py audits/gsc-baseline-*/
"""
import csv
import re
import sys
from pathlib import Path

LEGACY_RE = re.compile(r"-20\d{2}$")


def analyze(baseline_dir: Path) -> None:
    pages = baseline_dir / "pages.csv"
    if not pages.exists():
        print(f"{baseline_dir.name}: pages.csv absent, ignoré", file=sys.stderr)
        return
    groups = {
        "legacy": {"pages": 0, "clicks": 0, "imp": 0},
        "canonique": {"pages": 0, "clicks": 0, "imp": 0},
    }
    with pages.open() as fh:
        for row in csv.DictReader(fh):
            url = re.sub(r"^https?://[^/]+", "", row["page"]).rstrip("/")
            m = re.fullmatch(r"/salons/([^/]+)", url)
            if not m:
                continue
            g = groups["legacy" if LEGACY_RE.search(m.group(1)) else "canonique"]
            g["pages"] += 1
            g["clicks"] += int(row["clicks"])
            g["imp"] += int(row["impressions"])
    total_imp = groups["legacy"]["imp"] + groups["canonique"]["imp"]
    part = 100 * groups["legacy"]["imp"] / total_imp if total_imp else 0.0
    tag = baseline_dir.name.replace("gsc-baseline-", "")
    print(f"── {tag} ──")
    for name, g in groups.items():
        print(
            f"  {name:10} {g['pages']:4} pages · {g['clicks']:4} clics · "
            f"{g['imp']:6} imp"
        )
    print(f"  part imp legacy : {part:.1f}%")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        args = sorted(str(p) for p in Path("audits").glob("gsc-baseline-*"))
    for d in args:
        analyze(Path(d))
