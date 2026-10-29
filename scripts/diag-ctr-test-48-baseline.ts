// Test CTR 48 : recalcule le périmètre figé (fenêtre 2026-09-30 → 2026-10-27,
// impressions >= 500, position <= 12, CTR < 1 %) et exporte la référence par
// page + les requêtes de chaque page. Usage :
//   ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-ctr-test-48-baseline.ts [start] [end] [outDir]
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SECRETS_DIR = path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8"));
const token = JSON.parse(readFileSync(path.join(SECRETS_DIR, "google-oauth-token-gsc-ga4.json"), "utf-8"));
const SITE = "sc-domain:agoris.io";
const START = process.argv[2] ?? "2026-09-30";
const END = process.argv[3] ?? "2026-10-27";
const OUT = path.resolve(process.argv[4] ?? "tasks/ctr-test-48");

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function accessToken(): Promise<string> {
  const c = creds.installed ?? creds.web;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.client_id,
      client_secret: c.client_secret,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function query(tok: string, body: object): Promise<Row[]> {
  const out: Row[] = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: START, endDate: END, rowLimit: 25000, startRow, dataState: "final", ...body }),
      }
    );
    if (!res.ok) throw new Error(`GSC ${res.status} ${await res.text()}`);
    const rows = ((await res.json()) as { rows?: Row[] }).rows ?? [];
    out.push(...rows);
    if (rows.length < 25000) return out;
  }
}

async function main() {
  const tok = await accessToken();
  const pages = await query(tok, { dimensions: ["page"] });
  const total = pages.reduce((s, r) => ({ c: s.c + r.clicks, i: s.i + r.impressions }), { c: 0, i: 0 });
  console.log(`Fenêtre ${START} → ${END} : ${pages.length} pages, ${total.i} imp, ${total.c} clics`);

  const perimeter = pages
    .filter((r) => r.impressions >= 500 && r.position <= 12 && r.ctr < 0.01)
    .sort((a, b) => b.impressions - a.impressions);

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    path.join(OUT, `baseline-${START}_${END}.json`),
    JSON.stringify(
      perimeter.map((r) => ({
        page: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      null,
      2
    )
  );

  // Requêtes par page (filtre exact par page pour ne pas dépendre du cap global)
  const byPage: Record<string, Row[]> = {};
  for (const r of perimeter) {
    byPage[r.keys[0]] = await query(tok, {
      dimensions: ["query"],
      dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "equals", expression: r.keys[0] }] }],
    });
  }
  writeFileSync(path.join(OUT, `queries-${START}_${END}.json`), JSON.stringify(byPage, null, 2));

  const imp = perimeter.reduce((s, r) => s + r.impressions, 0);
  const clk = perimeter.reduce((s, r) => s + r.clicks, 0);
  console.log(`Périmètre : ${perimeter.length} pages, ${imp} imp, ${clk} clics, CTR ${((clk / imp) * 100).toFixed(2)} %`);
  for (const r of perimeter)
    console.log(`${r.keys[0].replace("https://agoris.io", "")}\t${r.clicks}\t${r.impressions}\t${(r.ctr * 100).toFixed(2)}\t${r.position.toFixed(1)}\t${byPage[r.keys[0]].length}q`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
