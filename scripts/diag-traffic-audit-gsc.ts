// Collecte GSC pour l'audit traffic-vs-size-2026-09-27.
//
// Réutilise le mini-client OAuth de scripts/gsc-baseline-export.ts (credentials
// Glyphe, jzakoian@gmail.com, propriété sc-domain:agoris.io, searchType web).
//
// Fenêtre : 2026-06-26 → 2026-09-23 (90 jours).
//
// Produit dans audits/traffic-vs-size-2026-09-27/ :
//   - gsc-pages.csv       dimension [page], toutes pages, pagination 25000
//   - gsc-page-query.csv  dimensions [page,query], filtré sur "/salons/"
//   - gsc-page-age.csv    agrégats par page (first_impression_date, days_with_impr)
//                         calculés depuis dimensions [page,date] filtré "/salons/"
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-traffic-audit-gsc.ts

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

const SITE_URL = "sc-domain:agoris.io";
const START = "2026-06-26";
const END = "2026-09-23";
const OUT_DIR = path.join(process.cwd(), "audits", "traffic-vs-size-2026-09-27");
mkdirSync(OUT_DIR, { recursive: true });

// ─── Mini client GSC ───────────────────────────────────────────────────

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
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
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

interface GscPerformanceRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface FilterGroup {
  filters: { dimension: string; operator: string; expression: string }[];
}

async function queryPage(params: {
  dimensions: string[];
  dimensionFilterGroups?: FilterGroup[];
  startRow: number;
}): Promise<GscPerformanceRow[]> {
  const encodedSite = encodeURIComponent(SITE_URL);
  const data = await gscFetch<{ rows?: GscPerformanceRow[] }>(
    `/sites/${encodedSite}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({
        startDate: START,
        endDate: END,
        dimensions: params.dimensions,
        dimensionFilterGroups: params.dimensionFilterGroups,
        searchType: "web",
        rowLimit: 25000,
        startRow: params.startRow,
      }),
    }
  );
  return data.rows ?? [];
}

async function queryAllPages(params: {
  dimensions: string[];
  dimensionFilterGroups?: FilterGroup[];
  label: string;
}): Promise<GscPerformanceRow[]> {
  const allRows: GscPerformanceRow[] = [];
  let startRow = 0;
  for (;;) {
    const rows = await queryPage({ ...params, startRow });
    allRows.push(...rows);
    process.stderr.write(`  [${params.label}] startRow=${startRow} -> ${rows.length} lignes (total ${allRows.length})\n`);
    if (rows.length < 25000) break;
    startRow += 25000;
  }
  return allRows;
}

function csvEscape(v: string | number): string {
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath: string, header: string[], rows: (string | number)[][]) {
  const lines = [header.join(",")];
  for (const row of rows) lines.push(row.map(csvEscape).join(","));
  writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

async function main() {
  console.log(`Fenêtre GSC : ${START} → ${END}, propriété ${SITE_URL}`);

  // (a) dimension [page], toutes pages
  console.log("\n(a) Export gsc-pages.csv (dimension: page)...");
  const pagesRows = await queryAllPages({ dimensions: ["page"], label: "pages" });
  writeCsv(
    path.join(OUT_DIR, "gsc-pages.csv"),
    ["page", "clicks", "impressions", "ctr", "position"],
    pagesRows.map((r) => [r.keys[0], r.clicks, r.impressions, r.ctr, r.position])
  );
  console.log(`  -> ${pagesRows.length} pages écrites.`);

  // (b) dimensions [page, query], filtré sur /salons/
  console.log("\n(b) Export gsc-page-query.csv (dimensions: page,query, filtre /salons/)...");
  const pageQueryRows = await queryAllPages({
    dimensions: ["page", "query"],
    dimensionFilterGroups: [
      { filters: [{ dimension: "page", operator: "contains", expression: "/salons/" }] },
    ],
    label: "page-query",
  });
  writeCsv(
    path.join(OUT_DIR, "gsc-page-query.csv"),
    ["page", "query", "clicks", "impressions", "ctr", "position"],
    pageQueryRows.map((r) => [r.keys[0], r.keys[1], r.clicks, r.impressions, r.ctr, r.position])
  );
  console.log(`  -> ${pageQueryRows.length} lignes page x query écrites.`);

  // (c) dimensions [page, date], filtré sur /salons/ -> agrégats par page
  console.log("\n(c) Calcul gsc-page-age.csv (dimensions: page,date, filtre /salons/)...");
  const pageDateRows = await queryAllPages({
    dimensions: ["page", "date"],
    dimensionFilterGroups: [
      { filters: [{ dimension: "page", operator: "contains", expression: "/salons/" }] },
    ],
    label: "page-date",
  });

  const perPage = new Map<string, { firstDate: string; daysWithImpr: number }>();
  for (const r of pageDateRows) {
    const [page, date] = r.keys;
    if (r.impressions <= 0) continue; // ne garder que les jours avec impressions
    const existing = perPage.get(page);
    if (!existing) {
      perPage.set(page, { firstDate: date, daysWithImpr: 1 });
    } else {
      existing.daysWithImpr += 1;
      if (date < existing.firstDate) existing.firstDate = date;
    }
  }
  const ageRows = Array.from(perPage.entries()).map(([page, v]) => [page, v.firstDate, v.daysWithImpr]);
  writeCsv(
    path.join(OUT_DIR, "gsc-page-age.csv"),
    ["page", "first_impression_date", "days_with_impr"],
    ageRows
  );
  console.log(`  -> ${ageRows.length} pages avec au moins 1 jour d'impressions (source : ${pageDateRows.length} lignes page x date).`);

  console.log("\nTerminé.");
}

main().catch((err) => {
  console.error("ERREUR:", err);
  process.exit(1);
});
