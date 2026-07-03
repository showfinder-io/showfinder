// Export baseline GSC Search Console pour Agoris (agoris.io).
//
// Snapshot des 28 derniers jours (avec lag GSC ~3j). Alimente la boucle
// d'analyse SEO hebdomadaire du track agoris-seo (dreaming-orchestrator,
// scripts/weekly_agoris_seo_analysis.sh, mardis 9h).
//
// Output : audits/gsc-baseline-YYYY-MM-DD/
//   ├── summary.txt        totaux + métadonnées
//   ├── daily.csv          clics/impressions/CTR/position par jour
//   ├── queries.csv        top 1500 requêtes
//   ├── pages.csv          top 1500 pages
//   ├── by-gabarit.csv     agrégat par gabarit de page
//   └── countries.csv      top 50 pays
//
// Usage : ./node_modules/.bin/tsx scripts/gsc-baseline-export.ts
//
// OAuth : réutilise les credentials Desktop App de Glyphe (le refresh_token
// du compte jzakoian@gmail.com couvre les 9 propriétés GSC, dont
// sc-domain:agoris.io). Source unique : ~/Projects/glyphe/.secrets/,
// surchargeable via GSC_SECRETS_DIR. Cf glyphe/docs/gsc-oauth-setup.md.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ??
  path.join(os.homedir(), "Projects", "glyphe", ".secrets");

const credsRaw = JSON.parse(
  readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8")
);
const tokenRaw = JSON.parse(
  readFileSync(path.join(SECRETS_DIR, "gsc-oauth-token.json"), "utf-8")
);

const CLIENT_ID: string = credsRaw.installed.client_id;
const CLIENT_SECRET: string = credsRaw.installed.client_secret;
const REFRESH_TOKEN: string = tokenRaw.refresh_token;

// ─── Mini client GSC (porté de glyphe/src/lib/gsc-api.ts) ─────────────

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_API_BASE = "https://www.googleapis.com/webmasters/v3";

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`GSC OAuth refresh failed: ${res.status} ${errBody}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

async function gscFetch<T>(apiPath: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${GSC_API_BASE}${apiPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`GSC API ${apiPath} ${res.status}: ${errBody}`);
  }
  return (await res.json()) as T;
}

interface GscSite {
  siteUrl: string;
  permissionLevel: string;
}

async function listSites(): Promise<GscSite[]> {
  const data = await gscFetch<{ siteEntry?: GscSite[] }>("/sites/");
  return data.siteEntry ?? [];
}

interface GscPerformanceRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function queryPerformance(query: {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: string[];
  rowLimit: number;
}): Promise<GscPerformanceRow[]> {
  const encodedSite = encodeURIComponent(query.siteUrl);
  const data = await gscFetch<{ rows?: GscPerformanceRow[] }>(
    `/sites/${encodedSite}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({
        startDate: query.startDate,
        endDate: query.endDate,
        dimensions: query.dimensions,
        rowLimit: query.rowLimit,
        startRow: 0,
      }),
    }
  );
  return data.rows ?? [];
}

// ─── Dates : fenêtre 28j avec lag GSC ─────────────────────────────────

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const today = new Date();
const endDate = new Date(today);
endDate.setUTCDate(endDate.getUTCDate() - 3); // lag GSC typique
const startDate = new Date(endDate);
startDate.setUTCDate(startDate.getUTCDate() - 27); // 28 jours inclus

const START = toIsoDate(startDate);
const END = toIsoDate(endDate);
const RUN_TAG = toIsoDate(today);

// ─── CSV helper ───────────────────────────────────────────────────────

function csvEscape(v: string | number): string {
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(rows: GscPerformanceRow[], dimensionNames: string[]): string {
  const header = [...dimensionNames, "clicks", "impressions", "ctr", "position"].join(",");
  const body = rows
    .map((r) => {
      const dims = r.keys.map(csvEscape);
      return [
        ...dims,
        r.clicks,
        r.impressions,
        r.ctr.toFixed(4),
        r.position.toFixed(2),
      ].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}

// ─── Classification des URLs par gabarit ──────────────────────────────
//
// Familles de routes publiques App Router (src/app/) : une URL avec slug
// est une fiche, la racine de famille est un index.

type Gabarit = string;

const FAMILIES: Record<string, string> = {
  salons: "salon",
  secteurs: "secteur",
  villes: "ville",
  lieux: "lieu",
  prestataires: "prestataire",
  organisateurs: "organisateur",
  blog: "blog",
};

function classifyUrl(url: string): Gabarit {
  const p = url.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
  if (p === "" || p === "/") return "home";
  let segments = p.replace(/^\//, "").split("/");
  // Version anglaise (/en/...) : mêmes familles, gabarit préfixé "en-" pour
  // suivre la cohorte EN séparément (149 pages classées "autre" au 2026-07-03).
  let prefix = "";
  if (segments[0] === "en") {
    prefix = "en-";
    segments = segments.slice(1);
    if (segments.length === 0) return "en-home";
  }
  const family = FAMILIES[segments[0]];
  if (family) {
    return `${prefix}${family}-${segments.length > 1 ? "fiche" : "index"}`;
  }
  return `${prefix}autre`;
}

// ─── Pick le bon siteUrl GSC ──────────────────────────────────────────

async function pickAgorisSiteUrl(): Promise<string> {
  const sites = await listSites();
  console.log(`Propriétés GSC accessibles : ${sites.length}`);
  for (const s of sites) {
    console.log(`  - ${s.siteUrl}  (${s.permissionLevel})`);
  }

  const candidates = [
    "sc-domain:agoris.io",
    "https://agoris.io/",
    "https://www.agoris.io/",
  ];
  for (const candidate of candidates) {
    const match = sites.find((s) => s.siteUrl === candidate);
    if (match) {
      console.log(`\nSiteUrl retenu : ${match.siteUrl}\n`);
      return match.siteUrl;
    }
  }
  throw new Error(
    `Aucune propriété 'agoris.io' trouvée dans les sites GSC accessibles. ` +
      `Vérifier que jzakoian@gmail.com a bien accès à la propriété dans GSC.`
  );
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== GSC baseline export · Agoris · ${RUN_TAG} ===\n`);
  console.log(`Fenêtre analyse : ${START} → ${END} (28 jours)\n`);

  const siteUrl = await pickAgorisSiteUrl();

  const outDir = path.resolve(process.cwd(), `audits/gsc-baseline-${RUN_TAG}`);
  mkdirSync(outDir, { recursive: true });
  console.log(`Output : ${outDir}\n`);

  // 1. Daily totals
  console.log("→ Daily totals...");
  const daily = await queryPerformance({
    siteUrl,
    startDate: START,
    endDate: END,
    dimensions: ["date"],
    rowLimit: 1000,
  });
  writeFileSync(path.join(outDir, "daily.csv"), rowsToCsv(daily, ["date"]));
  console.log(`  ${daily.length} lignes\n`);

  // 2. Top queries (cap 1500 : leçon glyphe-seo, le cap 500 rendait la
  // métrique "queries distinctes" inutilisable)
  console.log("→ Top queries (max 1500)...");
  const queries = await queryPerformance({
    siteUrl,
    startDate: START,
    endDate: END,
    dimensions: ["query"],
    rowLimit: 1500,
  });
  writeFileSync(path.join(outDir, "queries.csv"), rowsToCsv(queries, ["query"]));
  console.log(`  ${queries.length} lignes\n`);

  // 3. Top pages
  console.log("→ Top pages (max 1500)...");
  const pages = await queryPerformance({
    siteUrl,
    startDate: START,
    endDate: END,
    dimensions: ["page"],
    rowLimit: 1500,
  });
  writeFileSync(path.join(outDir, "pages.csv"), rowsToCsv(pages, ["page"]));
  console.log(`  ${pages.length} lignes\n`);

  // 4. Agrégation par gabarit
  console.log("→ Agrégation par gabarit...");
  const gabaritMap = new Map<
    Gabarit,
    { clicks: number; impressions: number; n: number; weightedPos: number }
  >();
  for (const row of pages) {
    const g = classifyUrl(row.keys[0]);
    const acc = gabaritMap.get(g) || {
      clicks: 0,
      impressions: 0,
      n: 0,
      weightedPos: 0,
    };
    acc.clicks += row.clicks;
    acc.impressions += row.impressions;
    acc.n += 1;
    acc.weightedPos += row.position * row.impressions;
    gabaritMap.set(g, acc);
  }
  const byGabarit = Array.from(gabaritMap.entries())
    .map(([g, v]) => ({
      gabarit: g,
      pages: v.n,
      clicks: v.clicks,
      impressions: v.impressions,
      ctr: v.impressions > 0 ? v.clicks / v.impressions : 0,
      position: v.impressions > 0 ? v.weightedPos / v.impressions : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  const byGabaritCsv =
    [
      "gabarit,pages,clicks,impressions,ctr,position",
      ...byGabarit.map(
        (r) =>
          `${r.gabarit},${r.pages},${r.clicks},${r.impressions},${r.ctr.toFixed(4)},${r.position.toFixed(2)}`
      ),
    ].join("\n") + "\n";
  writeFileSync(path.join(outDir, "by-gabarit.csv"), byGabaritCsv);
  console.log(`  ${byGabarit.length} gabarits\n`);

  // 5. Countries
  console.log("→ Pays (max 50)...");
  const countries = await queryPerformance({
    siteUrl,
    startDate: START,
    endDate: END,
    dimensions: ["country"],
    rowLimit: 50,
  });
  writeFileSync(
    path.join(outDir, "countries.csv"),
    rowsToCsv(countries, ["country"])
  );
  console.log(`  ${countries.length} lignes\n`);

  // ─── Summary text ───
  const totalClicks = daily.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = daily.reduce((s, r) => s + r.impressions, 0);
  const avgCtr =
    totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgPosition =
    totalImpressions > 0
      ? daily.reduce((s, r) => s + r.position * r.impressions, 0) /
        totalImpressions
      : 0;

  const top10Queries = queries.slice(0, 10);
  const top10Pages = pages.slice(0, 10);

  const summary = [
    `GSC baseline · Agoris (agoris.io)`,
    `Export : ${RUN_TAG}`,
    `Fenêtre : ${START} → ${END} (28 jours)`,
    `Propriété : ${siteUrl}`,
    ``,
    `── Totaux ──`,
    `Clics : ${totalClicks}`,
    `Impressions : ${totalImpressions}`,
    `CTR moyen : ${avgCtr.toFixed(2)}%`,
    `Position moyenne (pondérée impressions) : ${avgPosition.toFixed(2)}`,
    `Requêtes distinctes (cap 1500) : ${queries.length}`,
    `Pages distinctes (cap 1500) : ${pages.length}`,
    ``,
    `── Top 10 requêtes ──`,
    ...top10Queries.map(
      (r, i) =>
        `${(i + 1).toString().padStart(2)}. ${r.keys[0].padEnd(40).slice(0, 40)}  ${r.clicks
          .toString()
          .padStart(4)} clics · ${r.impressions
          .toString()
          .padStart(5)} imp · pos ${r.position.toFixed(1)}`
    ),
    ``,
    `── Top 10 pages ──`,
    ...top10Pages.map(
      (r, i) =>
        `${(i + 1).toString().padStart(2)}. ${r.keys[0]
          .replace(/^https?:\/\/[^/]+/, "")
          .padEnd(50)
          .slice(0, 50)}  ${r.clicks.toString().padStart(4)} clics · ${r.impressions
          .toString()
          .padStart(5)} imp`
    ),
    ``,
    `── Par gabarit (sur les top ${pages.length} pages) ──`,
    ...byGabarit.map(
      (r) =>
        `${r.gabarit.padEnd(18)} ${r.pages
          .toString()
          .padStart(4)} pages · ${r.clicks
          .toString()
          .padStart(4)} clics · ${r.impressions
          .toString()
          .padStart(5)} imp · CTR ${(r.ctr * 100).toFixed(2)}% · pos ${r.position.toFixed(1)}`
    ),
    ``,
    `── Fichiers générés ──`,
    `  ${outDir}/daily.csv          ${daily.length} lignes`,
    `  ${outDir}/queries.csv        ${queries.length} lignes`,
    `  ${outDir}/pages.csv          ${pages.length} lignes`,
    `  ${outDir}/by-gabarit.csv     ${byGabarit.length} lignes`,
    `  ${outDir}/countries.csv      ${countries.length} lignes`,
    ``,
  ].join("\n");

  writeFileSync(path.join(outDir, "summary.txt"), summary);

  console.log("─".repeat(60));
  console.log(summary);
  console.log("─".repeat(60));
  console.log(`\n✅ Baseline exportée : ${outDir}\n`);
}

main().catch((err) => {
  console.error("\n❌ Erreur :", err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
