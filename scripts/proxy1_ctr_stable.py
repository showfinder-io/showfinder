"""Proxy 1 « CTR en baisse à position stable » (piste citations AIO) — D35.

Joint deux exports queries.csv (baseline ancienne vs nouvelle) sur la requête
(jointure exacte, insensible à la casse) et isole les requêtes dont la position
est stable (|Δpos| <= 0.5), qui avaient un volume significatif (imp_old >= 20)
et dont le CTR, non nul au départ, a chuté d'au moins 30 % (ctr_new <= 0.7 * ctr_old). Trié par
impressions nouvelles décroissantes. Sortie : tableau markdown sur stdout.

Usage : python3 scripts/proxy1_ctr_stable.py audits/gsc-baseline-2026-07-28 audits/gsc-baseline-2026-08-31
"""
import csv
import sys
from pathlib import Path

POS_TOL = 0.5
MIN_IMP_OLD = 20
CTR_RATIO = 0.7


def load(baseline_dir: Path) -> dict[str, dict]:
    rows = {}
    with (baseline_dir / "queries.csv").open(encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            key = r["query"].strip().lower()
            rows[key] = {
                "query": r["query"],
                "clicks": int(r["clicks"]),
                "imp": int(r["impressions"]),
                "pos": float(r["position"]),
            }
    return rows


def main(old_dir: str, new_dir: str) -> None:
    old, new = load(Path(old_dir)), load(Path(new_dir))
    tag_old = Path(old_dir).name.replace("gsc-baseline-", "")
    tag_new = Path(new_dir).name.replace("gsc-baseline-", "")
    common = set(old) & set(new)
    hits = []
    for k in common:
        o, n = old[k], new[k]
        if abs(n["pos"] - o["pos"]) > POS_TOL or o["imp"] < MIN_IMP_OLD or n["imp"] == 0:
            continue
        if o["clicks"] == 0:  # un CTR déjà nul ne peut pas "chuter" : exclu (sinon faux positifs 0 -> 0)
            continue
        ctr_o = o["clicks"] / o["imp"]
        ctr_n = n["clicks"] / n["imp"]
        if ctr_n <= CTR_RATIO * ctr_o:
            hits.append((n["imp"], o, n, ctr_o, ctr_n))
    hits.sort(key=lambda h: -h[0])
    print(f"Univers : {len(old)} requêtes {tag_old}, {len(new)} requêtes {tag_new}, {len(common)} communes.")
    print(f"Filtre : |Δpos| <= {POS_TOL}, imp {tag_old} >= {MIN_IMP_OLD}, CTR {tag_new} <= {CTR_RATIO} x CTR {tag_old}.")
    print(f"Candidates : {len(hits)}\n")
    print(f"| requête | pos {tag_old} | pos {tag_new} | imp {tag_old} | imp {tag_new} | clics {tag_old} | clics {tag_new} | CTR {tag_old} | CTR {tag_new} |")
    print("|---|---|---|---|---|---|---|---|---|")
    for _, o, n, co, cn in hits:
        print(f"| {n['query']} | {o['pos']:.2f} | {n['pos']:.2f} | {o['imp']} | {n['imp']} | {o['clicks']} | {n['clicks']} | {co*100:.1f}% | {cn*100:.1f}% |")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
