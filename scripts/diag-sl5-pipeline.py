#!/usr/bin/env python3
"""
diag-sl5-pipeline.py : sélection de la shortlist 5 (cohorte trafic, 2026-10-29).

Travaille dans handoff/shortlist-5/ (git-ignoré). Entrée : items.json, liste
consolidée des candidats issus des agents de recherche :
  [{"id", "name", "short_name"?, "city", "venue", "start", "end",
    "date_url", "site", "angle", "ambiguous"?, "disambig"?}]

Étapes (une sous-commande chacune, toutes idempotentes, sorties .jsonl reprises
là où elles se sont arrêtées) :
  dedup    : voisins lexicaux dans le catalogue (catalogue.json, tous statuts),
             puis Jev (Noul) « même salon ? » sur chaque paire -> dedup.jsonl
  capture  : curl de la page officielle des dates, texte brut ->
             sources/<id>.txt (403 et pages vides notés dans capture.jsonl)
  verify   : Jev (Noul) sur le texte capturé : édition à venir dans la fenêtre,
             dates concordantes, exposants, public B2B -> verify.jsonl
  volumes  : DataForSEO Google Ads France (nom, nom + année, salon + nom)
  serp     : DataForSEO SERP « nom année » top 10, chaque résultat classé par
             Jev (Choice, mêmes critères que diag-scoring-candidats-jev.ts)
  score    : score = demande / (1 + concurrents), bonus imminence, -> scoring.csv

Jev pour les décisions typées (règle coût), aucun LLM génératif ici.

Usage : python3 scripts/diag-sl5-pipeline.py <étape>
Clés : TYPESAFE_API_KEY (environnement), DataForSEO dans ~/.claude/skills/seo-geo/.env
"""

import csv
import difflib
import html
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "handoff", "shortlist-5")
SRC = os.path.join(DIR, "sources")
DFS_ENV_PATH = os.path.expanduser("~/.claude/skills/seo-geo/.env")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
WINDOW = ("2026-12-01", "2028-12-31")
PRIORITY = ("2027-01-01", "2027-04-30")


def load(name):
    with open(os.path.join(DIR, name), encoding="utf-8") as f:
        return json.load(f)


def done_ids(name, key="id"):
    path = os.path.join(DIR, name)
    if not os.path.exists(path):
        return set()
    with open(path, encoding="utf-8") as f:
        return {json.loads(l)[key] for l in f if l.strip()}


def append(name, obj):
    with open(os.path.join(DIR, name), "a", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def read_jsonl(name):
    path = os.path.join(DIR, name)
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        return [json.loads(l) for l in f if l.strip()]


def norm(s):
    s = unicodedata.normalize("NFKD", (s or "").lower()).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", s)).strip()


STOP = set("salon salons de du des la le les et l d en au aux pour international france paris 2026 2027 2028 congres expo".split())


def tokens(s):
    return {w for w in norm(s).split() if w not in STOP and len(w) > 2}


# ─── Jev ────────────────────────────────────────────────────────────────

def jev(state, questions, attempt=0):
    key = os.environ.get("TYPESAFE_API_KEY")
    if not key:
        raise RuntimeError("TYPESAFE_API_KEY absent de l'environnement")
    r = requests.post(
        "https://api.typesafe.ai/v1/systemone",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"model": "jev-latest", "state": state, "questions": questions},
        timeout=120,
    )
    if r.status_code in (429, 529, 502, 503) and attempt < 6:
        time.sleep(2 ** attempt)
        return jev(state, questions, attempt + 1)
    r.raise_for_status()
    return r.json()


# ─── dedup ──────────────────────────────────────────────────────────────

def neighbours(item, catalogue, k=5):
    t = tokens(item.get("short_name") or item["name"])
    scored = []
    for c in catalogue:
        ct = tokens(c["name"]) | tokens(c["slug"].replace("-", " "))
        jac = len(t & ct) / max(1, len(t | ct))
        seq = difflib.SequenceMatcher(None, norm(item["name"]), norm(c["name"])).ratio()
        # graphies collées ou séparées (« Innov-Agri » / « Innovagri »)
        compact = difflib.SequenceMatcher(None, norm(item.get("short_name") or item["name"]).replace(" ", ""), norm(c["name"]).replace(" ", "")).ratio()
        scored.append((max(jac, seq, compact), c))
    scored.sort(key=lambda x: -x[0])
    return [c for s, c in scored[:k] if s >= 0.25]


def step_dedup():
    items, cat = load("items.json"), load("catalogue.json")
    done = done_ids("dedup.jsonl")
    todo = [i for i in items if i["id"] not in done]
    print(f"{len(todo)} candidats à dédoublonner")

    def run(item):
        pairs = []
        for c in neighbours(item, cat):
            j = jev(
                {
                    "candidat": {k: item.get(k) for k in ("name", "city", "venue", "start", "site")},
                    "fiche_existante": {"nom": c["name"], "slug": c["slug"], "ville": c["city"], "date_debut": c["start_date"], "statut": c["status"]},
                },
                {
                    "meme_salon": {
                        "type": "noul",
                        "instructions": "Le salon professionnel `candidat` est-il le même salon (même série d'événements, éventuellement renommée ou à une autre édition) que `fiche_existante` du catalogue ?",
                        "criteria": {
                            "true": "Même salon : même marque ou ancien nom, même filière, même ville ou série itinérante ; seule l'édition ou la graphie change",
                            "false": "Salon distinct : autre marque, autre filière, ou édition régionale de la même marque dans une autre ville avec un autre lieu",
                        },
                    }
                },
            )
            pairs.append({"slug": c["slug"], "name": c["name"], "city": c["city"], "p": j["answers"]["meme_salon"]["noul"]})
        return {"id": item["id"], "name": item["name"], "pairs": pairs, "max_p": max([p["p"] for p in pairs], default=0)}

    with ThreadPoolExecutor(4) as ex:
        for out in ex.map(run, todo):
            append("dedup.jsonl", out)
            print(f"  {out['max_p']:.2f} {out['name']}")


# ─── capture ────────────────────────────────────────────────────────────

def html_to_text(raw):
    raw = re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", raw)
    ld = " ".join(re.findall(r'(?is)<script[^>]+ld\+json[^>]*>(.*?)</script>', raw))
    raw = re.sub(r"(?s)<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip(), ld


def step_capture():
    os.makedirs(SRC, exist_ok=True)
    items = load("items.json")
    done = done_ids("capture.jsonl")
    for item in items:
        if item["id"] in done:
            continue
        urls = [u for u in dict.fromkeys([item.get("date_url"), item.get("site")]) if u]
        text, status, used = "", None, None
        for u in urls:
            p = subprocess.run(["/usr/bin/curl", "-sL", "-m", "30", "-A", UA, "-w", "\n%{http_code}", u], capture_output=True)
            body = p.stdout.decode("utf-8", "replace")
            body, _, code = body.rpartition("\n")
            status = code
            t, ld = html_to_text(body)
            if code == "200" and len(t) > 300:
                text, used = (t + (" JSON-LD: " + ld if ld else "")), u
                break
        if text:
            with open(os.path.join(SRC, f"{item['id']}.txt"), "w", encoding="utf-8") as f:
                f.write(f"URL: {used}\nCAPTURE: curl {time.strftime('%Y-%m-%d')}\n\n{text}")
        append("capture.jsonl", {"id": item["id"], "status": status, "url": used, "chars": len(text), "ok": bool(text)})
        print(f"  {status} {len(text):>6} {item['name']}")


def excerpt(text, limit=9000):
    """Début de page + fenêtres autour des années et mots-clés utiles."""
    head = text[:2500]
    spans = []
    for m in re.finditer(r"2027|2028|exposant|exhibitor|stand", text, re.I):
        spans.append((max(0, m.start() - 300), m.end() + 300))
    merged = []
    for a, b in sorted(spans):
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(b, merged[-1][1]))
        else:
            merged.append((a, b))
    body = " [...] ".join(text[a:b] for a, b in merged)
    return (head + " [...] " + body)[:limit]


# ─── verify ─────────────────────────────────────────────────────────────

def step_verify():
    items = {i["id"]: i for i in load("items.json")}
    done = done_ids("verify.jsonl")
    todo = [i for i in items if i not in done and os.path.exists(os.path.join(SRC, f"{i}.txt"))]
    print(f"{len(todo)} pages à vérifier")

    def run(iid):
        item = items[iid]
        with open(os.path.join(SRC, f"{iid}.txt"), encoding="utf-8") as f:
            text = f.read()
        state = {
            "salon": item["name"],
            "aujourd_hui": "2026-10-29",
            "dates_annoncees_par_la_recherche": {"debut": item.get("start"), "fin": item.get("end"), "ville": item.get("city"), "lieu": item.get("venue")},
            "page_officielle_capturee": excerpt(text),
        }
        q = {
            "edition_a_venir": {
                "type": "noul",
                "instructions": f"D'après `page_officielle_capturee` seulement, le salon `salon` est-il un événement réel dont une prochaine édition est annoncée avec des dates entre le {WINDOW[0]} et le {WINDOW[1]} ?",
                "criteria": {"true": "La page annonce explicitement une édition future dans cette période (jour ou mois et année écrits)", "false": "La page ne parle que d'éditions passées, n'annonce aucune date future, ou annonce une date hors période"},
            },
            "dates_concordantes": {
                "type": "noul",
                "instructions": "Les dates `dates_annoncees_par_la_recherche.debut` et `fin` (format AAAA-MM-JJ) sont-elles écrites, au jour près, dans `page_officielle_capturee` pour la prochaine édition ?",
                "criteria": {"true": "Jour, mois et année de début et de fin se retrouvent sur la page pour la même édition", "false": "Dates absentes, différentes, sans année, ou seulement d'une édition passée"},
            },
            "lieu_concordant": {
                "type": "noul",
                "instructions": "La ville et le lieu de `dates_annoncees_par_la_recherche` correspondent-ils à ce que dit `page_officielle_capturee` pour la prochaine édition ?",
            },
            "exposants": {
                "type": "noul",
                "instructions": "`page_officielle_capturee` montre-t-elle que l'événement comporte des exposants avec stands (exposition, liste ou plan d'exposants, devenir exposant) ?",
            },
            "public_pro": {
                "type": "noul",
                "instructions": "D'après `page_officielle_capturee`, l'événement s'adresse-t-il principalement à des professionnels (B2B) plutôt qu'au grand public ?",
            },
        }
        j = jev(state, q)
        return {"id": iid, "name": item["name"], **{k: round(v["noul"], 3) for k, v in j["answers"].items()}}

    with ThreadPoolExecutor(4) as ex:
        for out in ex.map(run, todo):
            append("verify.jsonl", out)
            print(f"  à venir {out['edition_a_venir']:.2f} dates {out['dates_concordantes']:.2f} expo {out['exposants']:.2f} {out['name']}")


# ─── DataForSEO ─────────────────────────────────────────────────────────

def dfs_auth():
    vals = {}
    with open(DFS_ENV_PATH, encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.strip().startswith("#"):
                k, _, v = line.strip().partition("=")
                vals[k.strip()] = v.strip()
    return vals["DATAFORSEO_LOGIN"], vals["DATAFORSEO_PASSWORD"]


def base_name(item):
    s = re.split(r"\s+-\s+", item.get("short_name") or item["name"], maxsplit=1)[0]
    s = re.sub(r"\([^)]*\)", "", s).lower()
    s = re.sub(r"\b20(2[6-9])\b", "", s)
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s'-]+", " ", s)).strip()


def year(item):
    return (item.get("start") or "2027")[:4]


def variants(item):
    b = base_name(item)
    v = [("nom_annee", f"{b} {year(item)}")]
    if not item.get("ambiguous"):
        v.append(("nom_seul", b))
    if not b.startswith("salon "):
        v.append(("salon_nom", f"salon {b}"))
    if item.get("disambig"):
        v.append(("disambig", item["disambig"]))
    return v


def step_volumes():
    items = load("items.json")
    recs = [(i["id"], var, kw) for i in items for var, kw in variants(i)]
    kws = sorted({kw for _, _, kw in recs if len(kw) <= 80 and len(kw.split()) <= 10})
    r = requests.post(
        "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
        auth=dfs_auth(), json=[{"keywords": kws, "location_code": 2250, "language_code": "fr"}], timeout=180,
    )
    r.raise_for_status()
    data = r.json()
    task = data["tasks"][0]
    by = {x["keyword"].lower(): x.get("search_volume") for x in (task.get("result") or [])}
    with open(os.path.join(DIR, "volumes.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["id", "variant", "keyword", "search_volume"])
        for iid, var, kw in recs:
            w.writerow([iid, var, kw, by.get(kw.lower(), "")])
    print(f"{len(kws)} mots-clés, coût {data.get('cost')} USD")


SERP_CRITERIA = {
    "officiel": "Site officiel de ce salon précis, ou page de son organisateur consacrée à ce salon",
    "agregateur": "Annuaire, calendrier ou base d'événements qui liste ce salon (fiche événement d'un site tiers)",
    "media": "Article de presse, média spécialisé ou blog qui parle de ce salon",
    "institutionnel": "CCI, collectivité, fédération professionnelle, lieu d'accueil (parc des expositions, centre de congrès) ou office de tourisme qui présente ce salon",
    "exposant": "Page d'une entreprise exposante, sponsor ou partenaire qui annonce sa participation à ce salon",
    "social": "Réseau social ou plateforme vidéo (Facebook, LinkedIn, Instagram, YouTube, X, TikTok)",
    "hors_sujet": "Résultat qui ne concerne pas ce salon : homonyme, autre événement, autre sens du mot, page sans rapport",
}


def step_serp():
    items = load("items.json")
    done = done_ids("serp.jsonl")
    auth = dfs_auth()
    cost = 0.0

    def classify(item, kw, res):
        j = jev(
            {"salon": item["name"], "site_officiel_connu": item.get("site"), "requete": kw, "resultat": {"domaine": res["domain"], "url": res["url"], "titre": res.get("title")}},
            {"categorie": {"type": "choice", "instructions": "Le résultat `resultat` est apparu sur Google pour la requête `requete`, qui cherche le salon professionnel `salon`. Quel type de page est ce résultat, par rapport à ce salon ?", "criteria": SERP_CRITERIA}},
        )
        a = j["answers"]["categorie"]
        return {"rank": res["rank_group"], "domain": res["domain"], "title": res.get("title"), "categorie": a["choice"], "confidence": a["confidence"]}

    for item in items:
        if item["id"] in done:
            continue
        kw = f"{base_name(item)} {year(item)}"
        r = requests.post(
            "https://api.dataforseo.com/v3/serp/google/organic/live/regular",
            auth=auth, json=[{"keyword": kw, "location_code": 2250, "language_code": "fr", "depth": 10}], timeout=120,
        )
        r.raise_for_status()
        data = r.json()
        cost += data.get("cost") or 0
        res = [x for x in ((data["tasks"][0].get("result") or [{}])[0].get("items") or []) if x.get("type") == "organic" and x.get("rank_group", 99) <= 10]
        with ThreadPoolExecutor(4) as ex:
            classed = list(ex.map(lambda x: classify(item, kw, x), res))
        append("serp.jsonl", {"id": item["id"], "keyword": kw, "results": classed})
        print(f"  {len(classed)} résultats {kw}")
    print(f"Coût SERP : {cost:.3f} USD")


# ─── score ──────────────────────────────────────────────────────────────

def step_score():
    items = load("items.json")
    vol = {}
    with open(os.path.join(DIR, "volumes.csv"), encoding="utf-8") as f:
        for r in csv.DictReader(f):
            vol.setdefault(r["id"], {})[r["variant"]] = int(r["search_volume"] or 0)
    serp = {s["id"]: s for s in read_jsonl("serp.jsonl")}
    dedup = {d["id"]: d for d in read_jsonl("dedup.jsonl")}
    ver = {v["id"]: v for v in read_jsonl("verify.jsonl")}
    cap = {c["id"]: c for c in read_jsonl("capture.jsonl")}
    rows = []
    for i in items:
        v = vol.get(i["id"], {})
        demand = max(v.get("nom_annee", 0), v.get("nom_seul", 0), v.get("salon_nom", 0), v.get("disambig", 0))
        res = serp.get(i["id"], {}).get("results", [])
        conc = sum(1 for r in res if r["categorie"] in ("agregateur", "media", "institutionnel") and r["confidence"] >= 0.4)
        off = next((r["rank"] for r in res if r["categorie"] == "officiel"), "")
        agoris = next((r["rank"] for r in res if "agoris" in r["domain"]), "")
        imminent = PRIORITY[0] <= (i.get("start") or "") <= PRIORITY[1]
        score = round(demand / (1 + conc) * (1.5 if imminent else 1), 1)
        tier = "A" if demand >= 100 and conc <= 4 else "B" if demand >= 30 else "C"
        vr = ver.get(i["id"], {})
        rows.append({
            "id": i["id"], "name": i["name"], "start": i.get("start"), "city": i.get("city"), "angle": i.get("angle"),
            "demand": demand, "concurrents": conc, "off_pos": off, "agoris_pos": agoris, "imminent": imminent,
            "score": score, "tier": tier,
            "dedup_max_p": round(dedup.get(i["id"], {}).get("max_p", 0), 3),
            "dedup_slug": max(dedup.get(i["id"], {}).get("pairs", []) or [{"slug": ""}], key=lambda p: p.get("p", 0))["slug"],
            "capture": cap.get(i["id"], {}).get("status"),
            **{k: vr.get(k, "") for k in ("edition_a_venir", "dates_concordantes", "lieu_concordant", "exposants", "public_pro")},
        })
    rows.sort(key=lambda r: -r["score"])
    with open(os.path.join(DIR, "scoring.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"scoring.csv : {len(rows)} lignes")


if __name__ == "__main__":
    steps = {"dedup": step_dedup, "capture": step_capture, "verify": step_verify, "volumes": step_volumes, "serp": step_serp, "score": step_score}
    if len(sys.argv) != 2 or sys.argv[1] not in steps:
        sys.exit(f"Usage : {sys.argv[0]} {'|'.join(steps)}")
    steps[sys.argv[1]]()
