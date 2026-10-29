// Mesure du trafic venant des assistants IA (GA4 + GSC), lecture seule.
//
// Usage : ./node_modules/.bin/tsx scripts/diag-trafic-ia.ts [--from 2026-08-01] [--to AAAA-MM-JJ]
// Défaut : du 2026-08-01 à hier. Sortie : audits/trafic-ia-<to>/*.csv + résumé stdout.
// Accès : jeton OAuth GA4+GSC et client dans ~/Projects/glyphe/.secrets (GSC_SECRETS_DIR pour changer).
// GA4 : Data API v1beta uniquement (l'API Admin n'est pas fiable). Propriété 530912583.

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ?? path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8"));
const tok = JSON.parse(readFileSync(path.join(SECRETS_DIR, "google-oauth-token-gsc-ga4.json"), "utf-8"));
const PROPERTY = "properties/530912583";
const GSC_SITE = "sc-domain:agoris.io";

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const yesterday = isoDay(new Date(Date.now() - 86400000));
const FROM = arg("from") ?? "2026-08-01";
const TO = arg("to") ?? yesterday;
const OUT = `audits/trafic-ia-${TO}`;

// Source IA = medium ai-assistant OU source qui ressemble à un assistant connu.
const AI_SOURCE_RE =
  /chatgpt|openai|gemini|bard\.google|perplexity|claude|copilot|you\.com|mistral|deepseek|grok|meta\.ai|poe\.com|phind|kagi|qwen|kimi|doubao|ernie|manus/i;
const isAi = (source: string, medium: string) => medium === "ai-assistant" || AI_SOURCE_RE.test(source);
const REFERRER_REGEX = AI_SOURCE_RE.source;

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

type Rec = { dims: string[]; m: number[] };
async function ga4(dimensions: string[], metrics: string[], extra: Record<string, unknown> = {}): Promise<Rec[]> {
  const out: Rec[] = [];
  for (let offset = 0; ; offset += 100000) {
    const data = await api<{
      rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
      rowCount?: number;
    }>(`https://analyticsdata.googleapis.com/v1beta/${PROPERTY}:runReport`, {
      dateRanges: [{ startDate: FROM, endDate: TO }],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit: 100000,
      offset,
      ...extra,
    });
    for (const r of data.rows ?? [])
      out.push({ dims: r.dimensionValues.map((v) => v.value), m: r.metricValues.map((v) => Number(v.value)) });
    if (offset + 100000 >= (data.rowCount ?? 0)) break;
  }
  return out;
}

type GscRow = { keys: string[]; clicks: number; impressions: number; position: number };
async function gscPages(start: string, end: string): Promise<GscRow[]> {
  const data = await api<{ rows?: GscRow[] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    { startDate: start, endDate: end, dimensions: ["page"], rowLimit: 25000 }
  );
  return data.rows ?? [];
}

const csv = (rows: (string | number)[][]) =>
  rows.map((r) => r.map((c) => (/[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(",")).join("\n") + "\n";
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)} %` : "n/a");
const ratio = (n: number, d: number) => (d ? (n / d).toFixed(2) : "n/a");

// Lundi de la semaine ISO d'une date AAAA-MM-JJ
function weekStart(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dow);
  return isoDay(d);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  console.log(`Période ${FROM} → ${TO} (propriété ${PROPERTY})\n`);

  // 1. Série journalière par source/medium → semaines, totaux, liste exhaustive des sources IA
  const daily = await ga4(
    ["date", "sessionSource", "sessionMedium"],
    ["sessions", "engagedSessions", "screenPageViews"]
  );
  const toDay = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

  const weekTotal = new Map<string, number>();
  const weekDays = new Map<string, Set<string>>();
  const weekSrc = new Map<string, Map<string, number>>(); // source/medium → semaine → sessions
  const srcAgg = new Map<string, { s: number; e: number; pv: number }>();
  let allSessions = 0;
  for (const r of daily) {
    const [d, source, medium] = [toDay(r.dims[0]), r.dims[1], r.dims[2]];
    const wk = weekStart(d);
    weekTotal.set(wk, (weekTotal.get(wk) ?? 0) + r.m[0]);
    (weekDays.get(wk) ?? weekDays.set(wk, new Set()).get(wk)!).add(d);
    allSessions += r.m[0];
    const key = `${source} / ${medium}`;
    const agg = srcAgg.get(key) ?? { s: 0, e: 0, pv: 0 };
    agg.s += r.m[0]; agg.e += r.m[1]; agg.pv += r.m[2];
    srcAgg.set(key, agg);
    if (isAi(source, medium)) {
      const byWk = weekSrc.get(key) ?? new Map<string, number>();
      byWk.set(wk, (byWk.get(wk) ?? 0) + r.m[0]);
      weekSrc.set(key, byWk);
    }
  }
  const weeks = [...weekTotal.keys()].sort();

  const aiKeys = [...weekSrc.keys()].sort((a, b) => srcAgg.get(b)!.s - srcAgg.get(a)!.s);
  const weeklyRows: (string | number)[][] = [["semaine_lundi", "jours_couverts", "total_sessions", "ia_sessions", "ia_part", ...aiKeys]];
  console.log("== Sessions par semaine (lundi), sources IA ==");
  console.log(["semaine", "jours", "total", "IA", "part", ...aiKeys].join(" | "));
  for (const wk of weeks) {
    const ia = aiKeys.reduce((s, k) => s + (weekSrc.get(k)!.get(wk) ?? 0), 0);
    const cells = aiKeys.map((k) => weekSrc.get(k)!.get(wk) ?? 0);
    const days = weekDays.get(wk)!.size;
    weeklyRows.push([wk, days, weekTotal.get(wk)!, ia, pct(ia, weekTotal.get(wk)!), ...cells]);
    console.log([wk, days, weekTotal.get(wk)!, ia, pct(ia, weekTotal.get(wk)!), ...cells].join(" | "));
  }
  writeFileSync(path.join(OUT, "ia-par-semaine.csv"), csv(weeklyRows));

  // 2. Comparaison engagement : chaque source IA vs google/organic, et IA cumulé
  const cmp: (string | number)[][] = [["source / medium", "sessions", "part_du_total", "taux_engagement", "pages_vues_par_session"]];
  const line = (label: string, a: { s: number; e: number; pv: number }) =>
    cmp.push([label, a.s, pct(a.s, allSessions), pct(a.e, a.s), ratio(a.pv, a.s)]);
  const iaTotal = { s: 0, e: 0, pv: 0 };
  for (const k of aiKeys) {
    const a = srcAgg.get(k)!;
    iaTotal.s += a.s; iaTotal.e += a.e; iaTotal.pv += a.pv;
  }
  line("IA (toutes sources)", iaTotal);
  for (const k of aiKeys) line(k, srcAgg.get(k)!);
  line("google / organic", srcAgg.get("google / organic") ?? { s: 0, e: 0, pv: 0 });
  line("TOTAL site", [...srcAgg.values()].reduce((x, y) => ({ s: x.s + y.s, e: x.e + y.e, pv: x.pv + y.pv })));
  console.log("\n== Engagement (période entière) ==");
  for (const r of cmp) console.log(r.join(" | "));
  writeFileSync(path.join(OUT, "engagement.csv"), csv(cmp));

  // 3. Pages d'entrée du trafic IA + liaison GSC
  const landing = await ga4(
    ["sessionSource", "sessionMedium", "landingPage"],
    ["sessions", "engagedSessions", "screenPageViews"]
  );
  const byPage = new Map<string, { s: number; e: number; pv: number; src: Map<string, number> }>();
  for (const r of landing) {
    if (!isAi(r.dims[0], r.dims[1])) continue;
    const p = byPage.get(r.dims[2]) ?? { s: 0, e: 0, pv: 0, src: new Map() };
    p.s += r.m[0]; p.e += r.m[1]; p.pv += r.m[2];
    p.src.set(r.dims[0], (p.src.get(r.dims[0]) ?? 0) + r.m[0]);
    byPage.set(r.dims[2], p);
  }
  // Sessions sans landing page (aucun page_view) : IA vs reste du site
  const notSet = landing.filter((r) => r.dims[2] === "(not set)");
  const notSetAi = notSet.filter((r) => isAi(r.dims[0], r.dims[1])).reduce((s, r) => s + r.m[0], 0);
  const notSetAll = notSet.reduce((s, r) => s + r.m[0], 0);
  console.log(`\n== Landing "(not set)" : ${notSetAi} sessions IA sur ${iaTotal.s} ; ${notSetAll} sessions sur ${allSessions} tous canaux ==`);
  const gscAll = new Map<string, GscRow>();
  for (const r of await gscPages(FROM, TO)) {
    const k = new URL(r.keys[0]).pathname.replace(/\/$/, "") || "/";
    const prev = gscAll.get(k);
    gscAll.set(k, prev ? { ...prev, clicks: prev.clicks + r.clicks, impressions: prev.impressions + r.impressions } : r);
  }
  const pageRows: (string | number)[][] = [
    ["landing_page", "sessions_ia", "sources", "taux_engagement", "pv_par_session", "gsc_clics", "gsc_impressions", "gsc_position"],
  ];
  const pages = [...byPage.entries()].sort((a, b) => b[1].s - a[1].s);
  for (const [page, p] of pages) {
    const g = gscAll.get(page.replace(/\/$/, "") || "/");
    const srcs = [...p.src.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s}:${n}`).join(" ");
    pageRows.push([
      page, p.s, srcs, pct(p.e, p.s), ratio(p.pv, p.s),
      g ? g.clicks : "absent", g ? g.impressions : "absent", g ? g.position.toFixed(1) : "absent",
    ]);
  }
  writeFileSync(path.join(OUT, "ia-pages-entree.csv"), csv(pageRows));
  console.log(`\n== Pages d'entrée IA (top 25 sur ${pages.length}) ; GSC ${FROM} → ${TO} ==`);
  for (const r of pageRows.slice(0, 26)) console.log(r.join(" | "));

  // 4. Trafic IA caché en direct : sessions (direct) avec utm/référent d'assistant
  const direct = await ga4(["landingPagePlusQueryString"], ["sessions"], {
    dimensionFilter: { filter: { fieldName: "sessionSource", stringFilter: { matchType: "EXACT", value: "(direct)" } } },
  });
  const directUtm = direct.filter((r) => /utm_source=|utm_medium=/i.test(r.dims[0]));
  const directAi = directUtm.filter((r) => AI_SOURCE_RE.test(r.dims[0]));
  console.log(`\n== Sessions (direct) : ${direct.reduce((s, r) => s + r.m[0], 0)} au total ; ${directUtm.reduce((s, r) => s + r.m[0], 0)} avec un utm dans l'URL ; ${directAi.reduce((s, r) => s + r.m[0], 0)} avec un utm d'assistant ==`);
  for (const r of directAi) console.log(`${r.m[0]} | ${r.dims[0]}`);
  writeFileSync(path.join(OUT, "direct-utm.csv"), csv([["landing_page_plus_query", "sessions"], ...directUtm.map((r) => [r.dims[0], r.m[0]])]));

  // 5. Référent d'assistant dans la session mais source non classée IA (ne pas recompter les sources IA)
  const ref = await ga4(["sessionSource", "sessionMedium", "pageReferrer"], ["sessions"], {
    dimensionFilter: {
      filter: { fieldName: "pageReferrer", stringFilter: { matchType: "PARTIAL_REGEXP", value: REFERRER_REGEX, caseSensitive: false } },
    },
  });
  const hidden = ref.filter((r) => !isAi(r.dims[0], r.dims[1]));
  const inAi = ref.filter((r) => isAi(r.dims[0], r.dims[1]));
  console.log(`\n== pageReferrer d'assistant : ${inAi.reduce((s, r) => s + r.m[0], 0)} sessions déjà classées IA ; ${hidden.reduce((s, r) => s + r.m[0], 0)} sessions classées dans une autre source ==`);
  for (const r of hidden.sort((a, b) => b.m[0] - a.m[0]).slice(0, 15)) console.log(`${r.m[0]} | ${r.dims[0]} / ${r.dims[1]} | ${r.dims[2]}`);
  writeFileSync(
    path.join(OUT, "referent-ia-hors-sources-ia.csv"),
    csv([["session_source", "session_medium", "page_referrer", "sessions"], ...hidden.map((r) => [...r.dims, r.m[0]])])
  );

  // 6. Liste de contrôle : sources non classées IA mais proches (pour repérer un assistant oublié)
  const others = [...srcAgg.entries()].filter(([k]) => !aiKeys.includes(k)).sort((a, b) => b[1].s - a[1].s).slice(0, 25);
  console.log("\n== Top 25 sources non classées IA (contrôle visuel d'un assistant oublié) ==");
  for (const [k, a] of others) console.log(`${a.s} | ${k}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
