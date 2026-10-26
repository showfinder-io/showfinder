"""CTR des fiches salon FR à title/meta génériques vs enrichies, par bucket de position (D47).

Lecture seule, stdlib uniquement, aucune variable d'environnement.
1. Lit https://www.agoris.io/sitemap.xml (l'apex agoris.io répond 308 vers www) et
   garde les URL salon-fiche FR : https://www.agoris.io/salons/<slug> (pas /en/).
2. Pour chaque fiche, récupère <title> et <meta name="description"> (GET, 0,2 s de pause).
   Classe 'generique' si la meta description contient 'informations pratiques sur Agoris',
   sinon 'enrichie'.
3. Joint à pages.csv (page,clicks,impressions,ctr,position) de chaque baseline GSC passée
   en argument et sort, par classe x bucket de position, pour les pages à imp >= 100 :
   n, impressions, clics, CTR agrégé (Σ clics / Σ imp) et CTR médian (médiane des CTR
   par page), avec une ligne « hors sial-paris et mondial-auto-paris » dès que l'une
   des deux fiches tombe dans la cellule.
Buckets : '4-10' = 4 <= position < 11, '11-20' = 11 <= position < 21 (position moyenne
GSC de la page sur la fenêtre). Les autres positions sont comptées mais non détaillées.

Usage :
  python3 scripts/meta_generique_ctr.py audits/gsc-baseline-2026-10-26 audits/gsc-baseline-2026-10-12
  python3 scripts/meta_generique_ctr.py --save-meta /tmp/meta.csv audits/gsc-baseline-2026-10-26
  python3 scripts/meta_generique_ctr.py --load-meta /tmp/meta.csv audits/gsc-baseline-2026-10-12
"""
import argparse
import csv
import html
import re
import ssl
import statistics
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SITEMAP_URL = "https://www.agoris.io/sitemap.xml"
SALON_RE = re.compile(r"<loc>(https://www\.agoris\.io/salons/([^/<]+))</loc>")
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
META_RE = re.compile(r"<meta\b[^>]*>", re.I)
ATTR_RE = re.compile(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"')
GENERIC_MARKER = "informations pratiques sur Agoris"
MIN_IMPRESSIONS = 100
OUTLIER_SLUGS = ("sial-paris", "mondial-auto-paris")
BUCKETS = (("4-10", 4.0, 11.0), ("11-20", 11.0, 21.0))
PAUSE_S = 0.2
USER_AGENT = "agoris-meta-generique-ctr/1.0 (lecture seule, D47)"
META_COLUMNS = ["slug", "url", "title", "description", "classe", "http"]


def ssl_context() -> ssl.SSLContext:
    """Contexte TLS par défaut ; si Python n'embarque aucun certificat racine
    (cas des builds python.org sur macOS), repli sur le bundle système /etc/ssl/cert.pem."""
    ctx = ssl.create_default_context()
    if not ctx.get_ca_certs() and Path("/etc/ssl/cert.pem").exists():
        ctx.load_verify_locations("/etc/ssl/cert.pem")
    return ctx


SSL_CTX = ssl_context()


def fetch(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, ""
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"  !! {url} : {exc}", file=sys.stderr)
        return 0, ""


def salon_urls_from_sitemap() -> list[tuple[str, str]]:
    status, body = fetch(SITEMAP_URL)
    if status != 200:
        sys.exit(f"sitemap HTTP {status}")
    seen = {}
    for url, slug in SALON_RE.findall(body):
        seen.setdefault(slug, url)
    return sorted(seen.items())


def extract_meta(page_html: str) -> tuple[str, str]:
    title = ""
    m = TITLE_RE.search(page_html)
    if m:
        title = html.unescape(m.group(1)).strip()
    description = ""
    for tag in META_RE.findall(page_html):
        attrs = {k.lower(): v for k, v in ATTR_RE.findall(tag)}
        if attrs.get("name", "").lower() == "description":
            description = html.unescape(attrs.get("content", "")).strip()
            break
    return title, description


def classify(description: str) -> str:
    return "generique" if GENERIC_MARKER in description else "enrichie"


def crawl_meta() -> list[dict]:
    rows = []
    salons = salon_urls_from_sitemap()
    print(f"sitemap : {len(salons)} fiches salon FR", file=sys.stderr)
    for i, (slug, url) in enumerate(salons, 1):
        status, body = fetch(url)
        title, description = extract_meta(body) if status == 200 else ("", "")
        rows.append({
            "slug": slug, "url": url, "title": title, "description": description,
            "classe": classify(description) if status == 200 else "indisponible",
            "http": str(status),
        })
        if i % 50 == 0:
            print(f"  {i}/{len(salons)}", file=sys.stderr)
        time.sleep(PAUSE_S)
    return rows


def save_meta(rows: list[dict], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=META_COLUMNS)
        w.writeheader()
        w.writerows(rows)


def load_meta(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def load_pages(baseline: Path) -> dict[str, dict]:
    pages = {}
    with (baseline / "pages.csv").open(newline="", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            pages[r["page"].rstrip("/")] = {
                "clicks": int(r["clicks"]),
                "impressions": int(r["impressions"]),
                "position": float(r["position"]),
            }
    return pages


def bucket_of(position: float) -> str | None:
    for name, lo, hi in BUCKETS:
        if lo <= position < hi:
            return name
    return None


def cell_stats(items: list[dict]) -> str:
    n = len(items)
    imp = sum(x["impressions"] for x in items)
    clicks = sum(x["clicks"] for x in items)
    ctr = clicks / imp if imp else 0.0
    med = statistics.median(x["clicks"] / x["impressions"] for x in items) if items else 0.0
    return f"n={n:3d}  imp={imp:7d}  clics={clicks:5d}  CTR agrégé={ctr*100:5.2f}%  CTR médian={med*100:5.2f}%"


def report(meta: list[dict], baseline: Path) -> None:
    pages = load_pages(baseline)
    print(f"\n=== {baseline.name} (pages.csv : {len(pages)} pages) ===")
    classes = {"generique": 0, "enrichie": 0, "indisponible": 0}
    for r in meta:
        classes[r["classe"]] = classes.get(r["classe"], 0) + 1
    print("sitemap : " + ", ".join(f"{k}={v}" for k, v in classes.items() if v))

    joined = []
    for r in meta:
        if r["classe"] not in ("generique", "enrichie"):
            continue
        p = pages.get(r["url"].rstrip("/"))
        if p is None:
            continue
        joined.append({**p, "slug": r["slug"], "classe": r["classe"], "bucket": bucket_of(p["position"])})
    print(f"jointes à pages.csv : {len(joined)} ; à imp >= {MIN_IMPRESSIONS} : "
          f"{sum(1 for j in joined if j['impressions'] >= MIN_IMPRESSIONS)}")

    eligible = [j for j in joined if j["impressions"] >= MIN_IMPRESSIONS]
    for bucket, _, _ in BUCKETS:
        print(f"\n-- bucket position {bucket} --")
        for classe in ("generique", "enrichie"):
            cell = [j for j in eligible if j["bucket"] == bucket and j["classe"] == classe]
            print(f"{classe:10s} {cell_stats(cell)}")
            outliers = [j["slug"] for j in cell if j["slug"] in OUTLIER_SLUGS]
            if outliers:
                rest = [j for j in cell if j["slug"] not in OUTLIER_SLUGS]
                print(f"{'  hors ' + '+'.join(outliers):10s} {cell_stats(rest)}")
    others = [j for j in eligible if j["bucket"] is None]
    if others:
        print(f"\nhors buckets (position < 4 ou >= 21), imp >= {MIN_IMPRESSIONS} : "
              f"generique={sum(1 for j in others if j['classe'] == 'generique')}, "
              f"enrichie={sum(1 for j in others if j['classe'] == 'enrichie')}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("baselines", nargs="+", type=Path, help="dossiers audits/gsc-baseline-* contenant pages.csv")
    ap.add_argument("--save-meta", type=Path, help="écrit le CSV title/description/classe par fiche")
    ap.add_argument("--load-meta", type=Path, help="relit un CSV produit par --save-meta au lieu de crawler")
    args = ap.parse_args()

    meta = load_meta(args.load_meta) if args.load_meta else crawl_meta()
    if args.save_meta:
        save_meta(meta, args.save_meta)
    for baseline in args.baselines:
        if not (baseline / "pages.csv").exists():
            sys.exit(f"pages.csv absent dans {baseline}")
        report(meta, baseline)


if __name__ == "__main__":
    main()
