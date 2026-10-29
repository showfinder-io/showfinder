// Chantier page 2 → page 1 : export GSC page et page×requête sur une fenêtre fixe.
// Sert à figer la référence (fenêtre 2026-09-30 → 2026-10-27) puis à la mesure J+28.
// Usage : ./node_modules/.bin/tsx scripts/diag-page2-page1-export.ts 2026-09-30 2026-10-27 [outDir]
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ??
  path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(
  readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8")
).installed;
const token = JSON.parse(
  readFileSync(path.join(SECRETS_DIR, "google-oauth-token-gsc-ga4.json"), "utf-8")
);

const SITE = "sc-domain:agoris.io";
const [START, END, OUT] = process.argv.slice(2);
if (!START || !END) throw new Error("Usage : <start> <end> [outDir]");
const outDir = path.resolve(OUT ?? `tasks/page2-page1/gsc-${START}_${END}`);

async function accessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

interface Row {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Pagination par startRow : l'API plafonne à 25 000 lignes par appel
async function query(at: string, dimensions: string[]): Promise<Row[]> {
  const all: Row[] = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: START, endDate: END, dimensions, rowLimit: 25000, startRow }),
      }
    );
    if (!res.ok) throw new Error(`GSC ${res.status} ${await res.text()}`);
    const rows = ((await res.json()) as { rows?: Row[] }).rows ?? [];
    all.push(...rows);
    if (rows.length < 25000) return all;
  }
}

async function main() {
  const at = await accessToken();
  mkdirSync(outDir, { recursive: true });
  const pages = await query(at, ["page"]);
  const pageQuery = await query(at, ["page", "query"]);
  writeFileSync(path.join(outDir, "pages.json"), JSON.stringify(pages));
  writeFileSync(path.join(outDir, "page-query.json"), JSON.stringify(pageQuery));
  console.log(`${START} → ${END} : ${pages.length} pages, ${pageQuery.length} lignes page×requête → ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
