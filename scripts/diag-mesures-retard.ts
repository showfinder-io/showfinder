// Mesures en retard du todo (2026-09-25), lecture seule :
//   C5    : CTR des 24 fiches retitrées le 2026-08-03, avant/après, avec groupe témoin
//   D5bis : requêtes anciens noms (labour, géront, europain, salon des entrepreneurs)
//   D14   : statut d'indexation (URL Inspection API) de toutes les fiches salons publiées
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-mesures-retard.ts
// OAuth : mêmes credentials que scripts/gsc-baseline-export.ts.
// Sortie : audits/mesures-retard-2026-09-25/*.csv + résumé stdout.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ?? path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8"));
const tok = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-token.json"), "utf-8"));
const SITE = "sc-domain:agoris.io";
const OUT = "audits/mesures-retard-2026-09-25";

let accessToken: string | null = null;
async function token(): Promise<string> {
  if (accessToken) return accessToken;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.installed.client_id,
      client_secret: creds.installed.client_secret,
      refresh_token: tok.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status} ${await res.text()}`);
  accessToken = ((await res.json()) as { access_token: string }).access_token;
  return accessToken;
}

async function api<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${url} ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
async function perf(start: string, end: string, dimensions: string[], filters?: unknown[]): Promise<Row[]> {
  const data = await api<{ rows?: Row[] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      startDate: start, endDate: end, dimensions, rowLimit: 25000,
      ...(filters ? { dimensionFilterGroups: [{ filters }] } : {}),
    }
  );
  return data.rows ?? [];
}

// Fenêtres de 28 jours : avant = juillet (baseline du 2026-07-28), après = dernière fenêtre dispo (lag ~3j)
const BEFORE = { start: "2026-07-01", end: "2026-07-28" };
const AFTER = { start: "2026-08-26", end: "2026-09-22" };

const CTR_SLUGS = [
  "artibat-rennes", "cfia-rennes", "changenow-paris", "equipbaie-metalexpo-paris", "euronaval-paris",
  "europack-euromanut-lyon", "expoprotection", "iftm-top-resa", "japan-expo-paris", "je-m-export-paris",
  "les-thermalies-paris", "mif-expo", "milipol-paris", "paris-design-week", "paris-games-week", "paris-photo",
  "paysalia-lyon", "siae-le-bourget", "sibca-paris", "sival-angers", "smcl", "solutions-rh",
  "sommet-elevage-clermont", "whos-next-paris",
];
// je-m-export-paris a été renommé : on agrège l'ancien et le nouveau slug
const SLUG_ALIAS: Record<string, string> = { "go-entrepreneurs-paris": "je-m-export-paris" };

// Slug FR d'une URL /salons/<slug> (les pages /en/ sont exclues : les seo_title retouchés sont FR)
function frSalonSlug(url: string): string | null {
  const m = url.match(/^https?:\/\/(?:www\.)?agoris\.io\/salons\/([a-z0-9-]+)\/?$/);
  return m ? m[1] : null;
}

type Agg = { clicks: number; impressions: number; posW: number };
const agg = (): Agg => ({ clicks: 0, impressions: 0, posW: 0 });
function add(a: Agg, r: Row) { a.clicks += r.clicks; a.impressions += r.impressions; a.posW += r.position * r.impressions; }
const ctr = (a: Agg) => (a.impressions ? (100 * a.clicks) / a.impressions : 0);
const pos = (a: Agg) => (a.impressions ? a.posW / a.impressions : 0);
const f1 = (n: number) => n.toFixed(1);
const f2 = (n: number) => n.toFixed(2);

async function c5() {
  const per: Record<string, { b: Agg; a: Agg }> = Object.fromEntries(CTR_SLUGS.map((s) => [s, { b: agg(), a: agg() }]));
  const control = { b: agg(), a: agg() };
  const group = { b: agg(), a: agg() };
  for (const [key, w] of [["b", BEFORE], ["a", AFTER]] as const) {
    for (const r of await perf(w.start, w.end, ["page"])) {
      const raw = frSalonSlug(r.keys[0]);
      if (!raw) continue;
      const slug = SLUG_ALIAS[raw] ?? raw;
      if (per[slug]) { add(per[slug][key], r); add(group[key], r); } else add(control[key], r);
    }
  }
  const lines = ["slug,imp_avant,clics_avant,ctr_avant,pos_avant,imp_apres,clics_apres,ctr_apres,pos_apres"];
  for (const s of CTR_SLUGS) {
    const { b, a } = per[s];
    lines.push([s, b.impressions, b.clicks, f2(ctr(b)), f1(pos(b)), a.impressions, a.clicks, f2(ctr(a)), f1(pos(a))].join(","));
  }
  writeFileSync(`${OUT}/c5-ctr-24-fiches.csv`, lines.join("\n") + "\n");
  console.log("\n=== C5 : 24 fiches retitrées (FR) ===");
  console.log(`Fenêtres : avant ${BEFORE.start}..${BEFORE.end} | après ${AFTER.start}..${AFTER.end}`);
  for (const [label, g] of [["24 fiches", group], ["témoin (autres fiches FR)", control]] as const) {
    console.log(`${label.padEnd(26)} avant : ${g.b.impressions} imp, ${g.b.clicks} clics, CTR ${f2(ctr(g.b))}%, pos ${f1(pos(g.b))} | après : ${g.a.impressions} imp, ${g.a.clicks} clics, CTR ${f2(ctr(g.a))}%, pos ${f1(pos(g.a))}`);
  }
  console.log(lines.join("\n"));
}

async function d5bis() {
  const regex = "labour|g[ée]ront|europain|salon des entrepreneurs";
  const filters = [{ dimension: "query", operator: "includingRegex", expression: regex }];
  const lines = ["fenetre,requete,page,imp,clics,pos"];
  console.log("\n=== D5bis : requêtes anciens noms ===");
  for (const [label, w] of [["avant", BEFORE], ["apres", AFTER]] as const) {
    const rows = (await perf(w.start, w.end, ["query", "page"], filters)).sort((x, y) => y.impressions - x.impressions);
    const tot = rows.reduce((s, r) => s + r.impressions, 0);
    const cl = rows.reduce((s, r) => s + r.clicks, 0);
    console.log(`${label} (${w.start}..${w.end}) : ${rows.length} couples requête/page, ${tot} imp, ${cl} clics`);
    for (const r of rows) {
      lines.push([label, JSON.stringify(r.keys[0]), r.keys[1], r.impressions, r.clicks, f1(r.position)].join(","));
      if (label === "apres") console.log(`  ${r.keys[0]} -> ${r.keys[1]} : ${r.impressions} imp, ${r.clicks} clics, pos ${f1(r.position)}`);
    }
  }
  writeFileSync(`${OUT}/d5bis-anciens-noms.csv`, lines.join("\n") + "\n");
}

type Inspection = {
  inspectionResult?: {
    indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string; googleCanonical?: string };
  };
};
async function d14() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await sb.from("salons").select("slug,start_date").eq("status", "published");
  if (error) throw new Error(error.message);
  const slugs = (data as { slug: string; start_date: string | null }[]).sort((x, y) =>
    (x.start_date ?? "9999").localeCompare(y.start_date ?? "9999")
  );
  const results: string[] = [];
  const queue = [...slugs];
  const worker = async () => {
    for (let s = queue.shift(); s; s = queue.shift()) {
      const url = `https://www.agoris.io/salons/${s.slug}`;
      const r = await api<Inspection>("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
        inspectionUrl: url, siteUrl: SITE,
      });
      const st = r.inspectionResult?.indexStatusResult ?? {};
      results.push([s.slug, s.start_date ?? "", st.verdict ?? "", JSON.stringify(st.coverageState ?? ""), st.lastCrawlTime ?? "", st.googleCanonical ?? ""].join(","));
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  results.sort();
  writeFileSync(`${OUT}/d14-indexation.csv`, "slug,start_date,verdict,coverage,last_crawl,google_canonical\n" + results.join("\n") + "\n");
  const byCov: Record<string, string[]> = {};
  for (const line of results) {
    const [slug, , , cov] = line.split(",");
    (byCov[cov] ??= []).push(slug);
  }
  console.log(`\n=== D14 : indexation des ${slugs.length} fiches salons publiées (FR) ===`);
  for (const [cov, list] of Object.entries(byCov).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`${cov} : ${list.length}`);
    if (!cov.includes("Submitted and indexed") && !cov.includes("Indexed")) console.log("  " + list.join(" "));
  }
}

(async () => {
  mkdirSync(OUT, { recursive: true });
  // Argument optionnel : c5 | d5bis | d14 pour ne lancer qu'une mesure
  const only = process.argv[2];
  if (!only || only === "c5") await c5();
  if (!only || only === "d5bis") await d5bis();
  if (!only || only === "d14") await d14();
})();
