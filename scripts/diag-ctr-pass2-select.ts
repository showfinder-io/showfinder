// Passe CTR n°2 (2026-09-25) : sélection des fiches salons à fort volume et
// CTR anormalement bas pour leur position. Lecture seule.
//
// Référence de CTR : médiane du site par tranche de position (pages salons
// avec >= 50 imp). Candidates : imp >= 200 sur 28 jours, CTR < 60 % de la
// référence de leur tranche. Pour chaque candidate : top requêtes + metas DB.
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-ctr-pass2-select.ts
// Sortie : audits/ctr-pass2-2026-09-25/candidates.json + résumé stdout.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ?? path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8"));
const tok = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-token.json"), "utf-8"));
const SITE = "sc-domain:agoris.io";
const WINDOW = { start: "2026-08-26", end: "2026-09-22" };
const OUT = "audits/ctr-pass2-2026-09-25";

async function token(): Promise<string> {
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
  return ((await res.json()) as { access_token: string }).access_token;
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

(async () => {
  const at = await token();
  const query = async (dimensions: string[], filters?: unknown[]): Promise<Row[]> => {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: WINDOW.start, endDate: WINDOW.end, dimensions, rowLimit: 25000,
          ...(filters ? { dimensionFilterGroups: [{ filters }] } : {}),
        }),
      }
    );
    if (!res.ok) throw new Error(`GSC ${res.status}: ${await res.text()}`);
    return ((await res.json()) as { rows?: Row[] }).rows ?? [];
  };

  const pages = (await query(["page"])).filter((r) => /agoris\.io\/(en\/)?salons\/[a-z0-9-]+\/?$/.test(r.keys[0]));

  // Référence : médiane du CTR par tranche de position
  const bucket = (p: number) => (p < 3 ? "1-3" : p < 5 ? "3-5" : p < 8 ? "5-8" : p < 12 ? "8-12" : p < 20 ? "12-20" : "20+");
  const byBucket: Record<string, number[]> = {};
  for (const r of pages.filter((r) => r.impressions >= 50)) (byBucket[bucket(r.position)] ??= []).push(r.ctr);
  const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] ?? 0; };
  const ref = Object.fromEntries(Object.entries(byBucket).map(([k, v]) => [k, median(v)]));
  console.log("CTR médian par tranche de position :", Object.fromEntries(Object.entries(ref).map(([k, v]) => [k, `${(v * 100).toFixed(2)} % (n=${byBucket[k].length})`])));

  const candidates = pages
    .filter((r) => r.impressions >= 200 && r.ctr < 0.6 * (ref[bucket(r.position)] ?? 0))
    .sort((a, b) => b.impressions * ((ref[bucket(b.position)] ?? 0) - b.ctr) - a.impressions * ((ref[bucket(a.position)] ?? 0) - a.ctr));

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const out = [];
  for (const c of candidates) {
    const url = c.keys[0];
    const locale = url.includes("/en/") ? "en" : "fr";
    const slug = url.split("/salons/")[1].replace(/\/$/, "");
    const { data: s, error } = await sb
      .from("salons")
      .select("slug,name,edition_year,start_date,end_date,city,estimated_exhibitors,estimated_visitors,status,seo_title,seo_description,seo_title_en,seo_description_en,venues(name)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    const queries = (await query(["query"], [{ dimension: "page", operator: "equals", expression: url }]))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 8)
      .map((q) => `${q.keys[0]} (${q.impressions} imp, ${q.clicks} cl, pos ${q.position.toFixed(1)})`);
    const lost = Math.round(c.impressions * (ref[bucket(c.position)] - c.ctr));
    out.push({ url, locale, imp: c.impressions, clicks: c.clicks, ctr: +(c.ctr * 100).toFixed(2), pos: +c.position.toFixed(1), refCtr: +(ref[bucket(c.position)] * 100).toFixed(2), clicsManques: lost, db: s, queries });
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/candidates.json`, JSON.stringify(out, null, 2));
  console.log(`\n${out.length} candidates (imp >= 200, CTR < 60 % de la médiane de leur tranche)\n`);
  for (const o of out) {
    console.log(`${o.locale} ${o.db?.slug ?? o.url} | ${o.imp} imp, ${o.clicks} cl, CTR ${o.ctr} % (réf ${o.refCtr} %), pos ${o.pos}, ~${o.clicsManques} clics manqués`);
    console.log(`   dates ${o.db?.start_date} → ${o.db?.end_date} | status ${o.db?.status}`);
    console.log(`   title : ${locale(o) === "en" ? o.db?.seo_title_en : o.db?.seo_title}`);
    console.log(`   desc  : ${locale(o) === "en" ? o.db?.seo_description_en : o.db?.seo_description}`);
    for (const q of o.queries) console.log(`     - ${q}`);
  }
})();

function locale(o: { locale: string }) { return o.locale; }
