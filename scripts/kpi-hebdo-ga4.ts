// KPI hebdomadaire GA4 d'Agoris, nettoyé du bruit (diagnostic du 2026-11-18).
//
// Deux sources de bruit sont retirées des sessions brutes :
//   - robots   : sessions Direct venues de Singapour, Chine ou États-Unis
//                (navigateurs automatisés depuis des datacenters : 99 % de
//                nouveaux visiteurs, résolution 1280x1200, ~1 % d'engagement).
//                Les sessions sans page d'entrée en sont exclues pour ne pas
//                être retirées deux fois.
//   - doublons : sessions sans page d'entrée ("" ou "(not set)"). Ce sont de
//                vrais visiteurs revenus sur un onglet resté ouvert plus de
//                30 min : GA4 ouvre une nouvelle session sans page vue.
//
// Sessions propres = brutes - robots - doublons.
// Le KPI de pilotage est la session engagée : le bruit n'y pèse presque rien.
// L'objectif « 10 000 visites / mois » reste mesuré en sessions GA4 sur 28 j
// (décision 2026-09-09) : la ligne 28 j donne les deux lectures.
//
// Semaines du lundi au dimanche. La semaine en cours est signalée.
//
// Usage : ./node_modules/.bin/tsx scripts/kpi-hebdo-ga4.ts [--weeks 8] [--json]
//
// OAuth : jeton GA4 + GSC dans ~/Projects/glyphe/.secrets/
// (google-oauth-token-gsc-ga4.json + gsc-oauth-credentials.json),
// surchargeable par GSC_SECRETS_DIR.

import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const GA4_PROPERTY = "properties/530912583";
const OBJECTIVE_SESSIONS_28D = 10_000;
const BOT_COUNTRIES = ["Singapore", "China", "United States"];

const SECRETS_DIR =
  process.env.GSC_SECRETS_DIR ??
  path.join(os.homedir(), "Projects", "glyphe", ".secrets");

const args = process.argv.slice(2);
const weeksArg = args.indexOf("--weeks");
const WEEKS = weeksArg >= 0 ? Number(args[weeksArg + 1]) : 8;
const AS_JSON = args.includes("--json");
if (!Number.isInteger(WEEKS) || WEEKS < 1) throw new Error("--weeks doit être un entier >= 1");

// ─── OAuth ─────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const creds = JSON.parse(
    readFileSync(path.join(SECRETS_DIR, "gsc-oauth-credentials.json"), "utf-8")
  ).installed;
  const token = JSON.parse(
    readFileSync(path.join(SECRETS_DIR, "google-oauth-token-gsc-ga4.json"), "utf-8")
  );
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
  const json = (await res.json()) as { access_token?: string; error?: string };
  if (!json.access_token) throw new Error(`OAuth refusé : ${json.error ?? res.status}`);
  return json.access_token;
}

// ─── GA4 Data API ──────────────────────────────────────────────────────

type Row = { dims: string[]; mets: number[] };

async function runReport(accessToken: string, body: object): Promise<Row[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, limit: 100000 }),
    }
  );
  const json = (await res.json()) as {
    error?: unknown;
    rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[];
  };
  if (json.error) throw new Error(`GA4 : ${JSON.stringify(json.error)}`);
  return (json.rows ?? []).map((r) => ({
    dims: (r.dimensionValues ?? []).map((d) => d.value),
    mets: r.metricValues.map((m) => Number(m.value)),
  }));
}

const BLANK_LANDING = {
  orGroup: {
    expressions: [
      { filter: { fieldName: "landingPage", stringFilter: { value: "" } } },
      { filter: { fieldName: "landingPage", stringFilter: { value: "(not set)" } } },
    ],
  },
};

const BOTS = {
  andGroup: {
    expressions: [
      { filter: { fieldName: "sessionDefaultChannelGroup", stringFilter: { value: "Direct" } } },
      { filter: { fieldName: "country", inListFilter: { values: BOT_COUNTRIES } } },
      { notExpression: BLANK_LANDING },
    ],
  },
};

// ─── Dates ─────────────────────────────────────────────────────────────

const iso = (d: Date) => d.toISOString().slice(0, 10);
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function mondayOf(d: Date): Date {
  return addDays(d, -((d.getUTCDay() + 6) % 7));
}
const fromGa = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

// ─── Main ──────────────────────────────────────────────────────────────

type Week = {
  week: string;
  days: number;
  complete: boolean;
  raw: number;
  bots: number;
  duplicates: number;
  clean: number;
  engaged: number;
  engagedOrganic: number;
  engagedAi: number;
};

async function main() {
  const accessToken = await getAccessToken();
  const todayUtc = new Date(`${iso(new Date())}T00:00:00Z`);
  const yesterday = addDays(todayUtc, -1);
  const start = addDays(mondayOf(yesterday), -7 * (WEEKS - 1));
  const dateRanges = [{ startDate: iso(start), endDate: iso(yesterday) }];
  const byDate = { dimensions: [{ name: "date" }] };
  const M = [{ name: "sessions" }, { name: "engagedSessions" }];

  const [all, bots, blank, channels] = await Promise.all([
    runReport(accessToken, { dateRanges, ...byDate, metrics: M }),
    runReport(accessToken, { dateRanges, ...byDate, metrics: M, dimensionFilter: BOTS }),
    runReport(accessToken, { dateRanges, ...byDate, metrics: M, dimensionFilter: BLANK_LANDING }),
    runReport(accessToken, {
      dateRanges,
      dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "engagedSessions" }],
    }),
  ]);

  const weeks = new Map<string, Week>();
  const weekOf = (gaDate: string): Week => {
    const key = iso(mondayOf(new Date(`${fromGa(gaDate)}T00:00:00Z`)));
    let w = weeks.get(key);
    if (!w) {
      w = { week: key, days: 0, complete: false, raw: 0, bots: 0, duplicates: 0, clean: 0, engaged: 0, engagedOrganic: 0, engagedAi: 0 };
      weeks.set(key, w);
    }
    return w;
  };
  for (const r of all) {
    const w = weekOf(r.dims[0]);
    w.days += 1;
    w.raw += r.mets[0];
    w.engaged += r.mets[1];
  }
  for (const r of bots) weekOf(r.dims[0]).bots += r.mets[0];
  for (const r of blank) weekOf(r.dims[0]).duplicates += r.mets[0];
  for (const r of channels) {
    const w = weekOf(r.dims[0]);
    if (r.dims[1] === "Organic Search") w.engagedOrganic += r.mets[0];
    if (r.dims[1] === "AI Assistant") w.engagedAi += r.mets[0];
  }
  const rows = [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
  for (const w of rows) {
    w.clean = w.raw - w.bots - w.duplicates;
    w.complete = w.days === 7;
  }

  // 28 jours glissants jusqu'à J-1, comparés aux 28 jours précédents
  const r28 = [
    { startDate: iso(addDays(yesterday, -27)), endDate: iso(yesterday) },
    { startDate: iso(addDays(yesterday, -55)), endDate: iso(addDays(yesterday, -28)) },
  ];
  const [t28, b28, d28] = await Promise.all([
    runReport(accessToken, { dateRanges: r28, metrics: M }),
    runReport(accessToken, { dateRanges: r28, metrics: M, dimensionFilter: BOTS }),
    runReport(accessToken, { dateRanges: r28, metrics: M, dimensionFilter: BLANK_LANDING }),
  ]);
  // Avec deux dateRanges, GA4 ajoute la dimension dateRange (date_range_0 / _1)
  const pick = (rs: Row[], i: number) => rs.find((r) => r.dims[0] === `date_range_${i}`)?.mets ?? [0, 0];
  const rolling = [0, 1].map((i) => {
    const raw = pick(t28, i)[0];
    return {
      range: r28[i],
      raw,
      clean: raw - pick(b28, i)[0] - pick(d28, i)[0],
      engaged: pick(t28, i)[1],
    };
  });

  if (AS_JSON) {
    console.log(JSON.stringify({ weeks: rows, rolling28: rolling, objective: OBJECTIVE_SESSIONS_28D }, null, 2));
    return;
  }

  const pct = (a: number, b: number) => (b ? `${a >= b ? "+" : ""}${Math.round(((a - b) / b) * 100)} %` : "");
  const n = (x: number) => x.toLocaleString("fr-FR");
  console.log(`# KPI hebdo GA4 Agoris (jusqu'au ${iso(yesterday)})\n`);
  console.log("| Semaine (lundi) | Brutes | Robots | Doublons | Propres | **Engagées** | dont organique | dont IA | Engagées vs S-1 |");
  console.log("|---|---:|---:|---:|---:|---:|---:|---:|---:|");
  rows.forEach((w, i) => {
    const prev = rows[i - 1];
    const label = w.complete ? w.week : `${w.week} (en cours, ${w.days} j)`;
    const delta = prev && w.complete && prev.complete ? pct(w.engaged, prev.engaged) : "";
    console.log(
      `| ${label} | ${n(w.raw)} | ${n(w.bots)} | ${n(w.duplicates)} | ${n(w.clean)} | **${n(w.engaged)}** | ${n(w.engagedOrganic)} | ${n(w.engagedAi)} | ${delta} |`
    );
  });
  const [cur, prev] = rolling;
  console.log(`\n## 28 jours glissants (${cur.range.startDate} au ${cur.range.endDate})\n`);
  console.log("| | 28 j | 28 j précédents | Évolution |");
  console.log("|---|---:|---:|---:|");
  console.log(`| Sessions brutes (métrique objectif) | ${n(cur.raw)} | ${n(prev.raw)} | ${pct(cur.raw, prev.raw)} |`);
  console.log(`| Sessions propres | ${n(cur.clean)} | ${n(prev.clean)} | ${pct(cur.clean, prev.clean)} |`);
  console.log(`| Sessions engagées | ${n(cur.engaged)} | ${n(prev.engaged)} | ${pct(cur.engaged, prev.engaged)} |`);
  console.log(
    `\nObjectif ${n(OBJECTIVE_SESSIONS_28D)} sessions / 28 j : ${Math.round((cur.raw / OBJECTIVE_SESSIONS_28D) * 100)} % en brut, ${Math.round((cur.clean / OBJECTIVE_SESSIONS_28D) * 100)} % en sessions propres.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
