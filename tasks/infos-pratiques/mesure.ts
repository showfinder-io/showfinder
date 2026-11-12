// Test « Infos pratiques » : référence et mesure J+28, lecture seule (GSC + liste des slugs publiés).
// Modes :
//   build   <début> <fin>            : constitue les groupes (graine fixe) et écrit groupes.json et reference.json (OUT_SUFFIX=-seuil5 MIN_LOGI_IMP=5 pour la variante)
//   measure <début> <fin> <sortie>   : relit les mêmes fiches (groupes.json) sur une autre fenêtre, écrit <sortie>/mesure.json (OUT_SUFFIX=-seuil5 pour la variante)
// Usage : ./node_modules/.bin/tsx --env-file=.env.local tasks/infos-pratiques/mesure.ts build 2026-10-13 2026-11-09
//         ./node_modules/.bin/tsx --env-file=.env.local tasks/infos-pratiques/mesure.ts measure <J+1> <J+28> tasks/infos-pratiques/mesure-j28
// Jeton OAuth : ~/Projects/glyphe/.secrets (gsc-oauth-credentials.json + google-oauth-token-gsc-ga4.json).
// Les requêtes anonymisées par Google n'apparaissent pas dans l'export page x requête : les chiffres logistiques sont un plancher.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SEED = "infos-pratiques-2026-11-12";
const SIZE = 44;
const SUF = process.env.OUT_SUFFIX ?? ""; // ex. "-seuil5" pour une variante à seuil abaissé
const MIN_LOGI_IMP = Number(process.env.MIN_LOGI_IMP ?? 20);
const SITE = "sc-domain:agoris.io";
const DIR = path.resolve("tasks/infos-pratiques");
const SECRETS = path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const creds = JSON.parse(readFileSync(path.join(SECRETS, "gsc-oauth-credentials.json"), "utf-8"));
const tok = JSON.parse(readFileSync(path.join(SECRETS, "google-oauth-token-gsc-ga4.json"), "utf-8"));
const c = creds.installed ?? creds.web ?? creds;

// Fiches refaites les 11 et 12 novembre (tasks/todo.md E9 et E9bis : 8 + 3 + 7 + 2)
const REFAITES = [
  "silmo-paris", "medi-nov-connection-lyon", "aerospace-test-development-show", "batimat", "ideobain",
  "natexpo-paris", "tranofiliere-paris", "luxe-pack-monaco",
  "untec-congres", "numeriquest-toulouse", "architect-at-work-lyon",
  "preventica-paris", "cannes-yachting-festival", "tfwa-world-exhibition", "interclima", "produrable-paris",
  "premiere-classe", "ad2s-bordeaux",
  "one-to-one-retail-ecommerce", "tech-for-retail-paris",
];

// Motifs logistiques (appliqués au texte en minuscules, accents retirés, sauf « où » testé avant)
const LOGI_FR = [
  /\bhoraires?\b/, /\bheures?\b/, /\bouverture\b/, /\badresse\b/, /\bacces\b/, /\bplan\b/, /\bparking\b/, /\bmetro\b/,
  /\bbadge\b/, /\bbillets?\b/, /\bbilletterie\b/, /\binvitations?\b/, /\bgratuit(e|s|es)?\b/, /\btarifs?\b/,
  /\bprix\b.*\bentree\b/, /\bprogramme\b/, /\bexposants?\b/, /\blistes?\b/, /\bcomment venir\b/, /\bou se trouve\b/,
  /\bou a lieu\b/, /\bou est\b/,
];
const LOGI_EN = [
  /\bopening (hours|times)\b/, /\bhours\b/, /\baddress\b/, /\bdirections\b/, /\bhow to (get|reach)\b/, /\bfloor ?plan\b/,
  /\bmap\b/, /\bparking\b/, /\bbadge\b/, /\btickets?\b/, /\bregistration\b/, /\bfree\b/, /\bprice\b/, /\bprogram(me)?\b/,
  /\bschedule\b/, /\bexhibitors?\b/, /\bwhere is\b/, /\bwhere is it held\b/,
];
const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
function isLogi(q: string, en: boolean): boolean {
  const lower = q.toLowerCase();
  if (!en && /(^|\s)où(\s|$)/.test(lower)) return true;
  const s = strip(q);
  return (en ? LOGI_EN : LOGI_FR).some((r) => r.test(s));
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
async function accessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token: tok.refresh_token, grant_type: "refresh_token" }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}
async function gsc(t: string, start: string, end: string, dimensions: string[]): Promise<Row[]> {
  const out: Row[] = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: start, endDate: end, dimensions, rowLimit: 25000, startRow, dataState: "final",
        dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "includingRegex", expression: "agoris\\.io/(en/)?salons/[^/]+$" }] }],
      }),
    });
    if (!res.ok) throw new Error(`GSC ${res.status} ${await res.text()}`);
    const rows = ((await res.json()) as { rows?: Row[] }).rows ?? [];
    out.push(...rows);
    if (rows.length < 25000) return out;
  }
}

interface Agg { imp: number; clk: number; posW: number }
interface Fiche {
  slug: string;
  total: { imp: number; clk: number; pos: number };
  logi: { imp: number; clk: number; pos: number | null; nq: number };
  top_logi_queries: { q: string; imp: number; clk: number; pos: number }[];
}
function slugOf(url: string): { slug: string; en: boolean } {
  const p = url.replace(/^https?:\/\/[^/]+/, "").replace(/^\/en/, "");
  return { slug: decodeURIComponent(p.replace("/salons/", "").replace(/\/$/, "")), en: /\/en\/salons\//.test(url) };
}

async function collect(start: string, end: string) {
  const t = await accessToken();
  const pages = await gsc(t, start, end, ["page"]);
  const pq = await gsc(t, start, end, ["page", "query"]);
  const fr: Record<string, Fiche> = {}, en: Record<string, Fiche> = {};
  const get = (m: Record<string, Fiche>, slug: string) => (m[slug] ??= { slug, total: { imp: 0, clk: 0, pos: 0 }, logi: { imp: 0, clk: 0, pos: null, nq: 0 }, top_logi_queries: [] });
  for (const r of pages) {
    const { slug, en: isEn } = slugOf(r.keys[0]);
    const f = get(isEn ? en : fr, slug);
    f.total = { imp: r.impressions, clk: r.clicks, pos: r.position };
  }
  const posAcc: Record<string, number> = {};
  for (const r of pq) {
    const { slug, en: isEn } = slugOf(r.keys[0]);
    if (!isLogi(r.keys[1], isEn)) continue;
    const m = isEn ? en : fr;
    const f = get(m, slug);
    f.logi.imp += r.impressions; f.logi.clk += r.clicks; f.logi.nq += 1;
    const k = (isEn ? "en:" : "fr:") + slug;
    posAcc[k] = (posAcc[k] ?? 0) + r.position * r.impressions;
    f.top_logi_queries.push({ q: r.keys[1], imp: r.impressions, clk: r.clicks, pos: +r.position.toFixed(1) });
  }
  for (const [m, pre] of [[fr, "fr:"], [en, "en:"]] as const)
    for (const f of Object.values(m)) {
      f.logi.pos = f.logi.imp ? +(posAcc[pre + f.slug] / f.logi.imp).toFixed(2) : null;
      f.top_logi_queries.sort((a, b) => b.imp - a.imp);
      f.top_logi_queries = f.top_logi_queries.slice(0, 8);
    }
  return { fr, en, nPages: pages.length, nPQ: pq.length };
}

function sumGroup(slugs: string[], m: Record<string, Fiche>) {
  let ti = 0, tc = 0, tp = 0, li = 0, lc = 0, lp = 0;
  for (const s of slugs) {
    const f = m[s] ?? { total: { imp: 0, clk: 0, pos: 0 }, logi: { imp: 0, clk: 0, pos: null } } as Fiche;
    ti += f.total.imp; tc += f.total.clk; tp += f.total.pos * f.total.imp;
    li += f.logi.imp; lc += f.logi.clk; lp += (f.logi.pos ?? 0) * f.logi.imp;
  }
  return {
    n: slugs.length,
    total: { imp: ti, clk: tc, ctr_pct: ti ? +((tc / ti) * 100).toFixed(3) : null, pos: ti ? +(tp / ti).toFixed(2) : null },
    logistique: { imp: li, clk: lc, ctr_pct: li ? +((lc / li) * 100).toFixed(3) : null, pos: li ? +(lp / li).toFixed(2) : null },
  };
}

async function liveSlugs(): Promise<Record<string, { start_date: string | null; end_date: string | null }>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const out: Record<string, { start_date: string | null; end_date: string | null }> = {};
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${url}/rest/v1/salons?select=slug,start_date,end_date&status=eq.published&order=slug`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`REST ${res.status} ${await res.text()}`);
    const rows = (await res.json()) as { slug: string; start_date: string | null; end_date: string | null }[];
    for (const r of rows) out[r.slug] = { start_date: r.start_date, end_date: r.end_date };
    if (rows.length < 1000) return out;
  }
}

function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = (h ^ (h >>> 16)) >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

async function build(start: string, end: string) {
  const { fr, en, nPages, nPQ } = await collect(start, end);
  const live = await liveSlugs();
  const read = (p: string) => { try { return JSON.parse(readFileSync(p, "utf-8")); } catch { return null; } };
  const g48 = read("tasks/ctr-test-48/groupes.json");
  const exTest48 = new Set<string>([...g48.treated, ...g48.control, ...g48.excluded].map((x: { page: string }) => x.page.replace(/^\/(en\/)?salons\//, "")));
  const prio = readFileSync("tasks/page2-page1/priorisation.md", "utf-8");
  const exPage2 = new Set<string>([...prio.matchAll(/^\| \d+ \| \/(?:en\/)?salons\/([^ |]+)/gm)].map((m) => m[1]));
  const exRefaites = new Set(REFAITES);
  const excl: Record<string, string> = {};
  const eligibleAll: Fiche[] = [];
  const reasons = { non_publie: 0, test_ctr_48: 0, page2_page1: 0, refaite_11_12_nov: 0, logi_sous_seuil: 0 };
  const slugsSeen = new Set([...Object.keys(fr)]);
  for (const s of slugsSeen) {
    if (!live[s]) { reasons.non_publie++; continue; }
    if (exTest48.has(s)) { reasons.test_ctr_48++; excl[s] = "test_ctr_48"; continue; }
    if (exPage2.has(s)) { reasons.page2_page1++; excl[s] = "page2_page1"; continue; }
    if (exRefaites.has(s)) { reasons.refaite_11_12_nov++; excl[s] = "refaite_11_12_nov"; continue; }
    if (fr[s].logi.imp < MIN_LOGI_IMP) { reasons.logi_sous_seuil++; continue; }
    eligibleAll.push(fr[s]);
  }
  eligibleAll.sort((a, b) => b.logi.imp - a.logi.imp);
  const pool = eligibleAll.slice(0, SIZE * 2);
  const nPairs = Math.floor(pool.length / 2);
  // Appariement glouton par distance minimale sur (log impressions logistiques, log impressions totales, position totale)
  const feat = (f: Fiche) => [Math.log1p(f.logi.imp), Math.log1p(f.total.imp), f.total.pos / 10];
  const dist = (a: Fiche, b: Fiche) => { const x = feat(a), y = feat(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const cand: [number, number, number][] = [];
  for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) cand.push([dist(pool[i], pool[j]), i, j]);
  cand.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const used = new Set<number>(), pairs: [Fiche, Fiche, number][] = [];
  for (const [d, i, j] of cand) { if (used.has(i) || used.has(j)) continue; used.add(i); used.add(j); pairs.push([pool[i], pool[j], d]); }
  pairs.sort((a, b) => b[0].logi.imp - a[0].logi.imp);
  const rand = rng(SEED);
  const treated: string[] = [], control: string[] = [], pairLog: unknown[] = [];
  pairs.forEach(([a, b, d], idx) => {
    const aTreated = rand() < 0.5;
    treated.push((aTreated ? a : b).slug); control.push((aTreated ? b : a).slug);
    pairLog.push({ pair: idx + 1, treated: (aTreated ? a : b).slug, control: (aTreated ? b : a).slug, distance: +d.toFixed(3) });
  });
  const today = new Date().toISOString().slice(0, 10);
  const passees = [...treated, ...control].filter((s) => (live[s].end_date ?? "9999") < today);
  const sansDates = [...treated, ...control].filter((s) => !live[s].end_date);
  const groupes = {
    seed: SEED, window: { start, end }, size_per_group: treated.length, min_logistic_impressions: MIN_LOGI_IMP,
    eligible_count: eligibleAll.length, pool_size: pool.length,
    exclusion_criteria: {
      non_publie: "fiche absente de la liste des salons publiés",
      test_ctr_48: "tasks/ctr-test-48/groupes.json (treated, control, excluded)",
      page2_page1: "pages de la table tasks/page2-page1/priorisation.md (53)",
      refaite_11_12_nov: REFAITES,
      ctr_prestataires_lieux: "ne touche que /lieux et /prestataires : aucune fiche /salons à exclure",
      seuil: `impressions logistiques FR >= ${MIN_LOGI_IMP} sur la fenêtre`,
    },
    exclusion_counts: reasons,
    appariement: "glouton par distance minimale sur (ln(1+imp logistiques), ln(1+imp totales), position/10) parmi les 88 fiches à plus fortes impressions logistiques ; tirage de la fiche traitée par paire avec mulberry32(hash(graine))",
    treated, control, pairs: pairLog,
    fiches_edition_terminee_a_date: passees, fiches_sans_date_fin: sansDates,
  };
  const perFiche = (slugs: string[]) => slugs.map((s) => ({ slug: s, start_date: live[s].start_date, end_date: live[s].end_date, fr: fr[s], en: en[s] ?? null }));
  const ref = {
    window: { start, end }, generated: today, gsc_rows: { pages: nPages, page_query: nPQ },
    note: "Les requêtes anonymisées par Google n'apparaissent pas : chiffres logistiques = plancher. Motifs dans mesure.ts (LOGI_FR / LOGI_EN).",
    groups: { treated: sumGroup(treated, fr), control: sumGroup(control, fr) },
    groups_en_info: { treated: sumGroup(treated, en), control: sumGroup(control, en) },
    treated: perFiche(treated), control: perFiche(control),
  };
  if (process.env.DRY) { console.log(JSON.stringify({ min: MIN_LOGI_IMP, eligible: eligibleAll.length, pairs: pairs.length, g: ref.groups })); return; }
  mkdirSync(DIR, { recursive: true });
  writeFileSync(path.join(DIR, `groupes${SUF}.json`), JSON.stringify(groupes, null, 2));
  writeFileSync(path.join(DIR, `reference${SUF}.json`), JSON.stringify(ref, null, 2));
  console.log(JSON.stringify({ eligible: eligibleAll.length, pool: pool.length, pairs: pairs.length, reasons, groups: ref.groups, en: ref.groups_en_info, passees: passees.length, sansDates: sansDates.length, nbLogiGe20Fr: Object.values(fr).filter((f) => live[f.slug] && f.logi.imp >= 20).length }, null, 1));
}

async function measure(start: string, end: string, outDir: string) {
  const g = JSON.parse(readFileSync(path.join(DIR, `groupes${SUF}.json`), "utf-8"));
  const { fr, en } = await collect(start, end);
  const res = {
    window: { start, end }, seed: g.seed,
    groups: { treated: sumGroup(g.treated, fr), control: sumGroup(g.control, fr) },
    groups_en_info: { treated: sumGroup(g.treated, en), control: sumGroup(g.control, en) },
    treated: g.treated.map((s: string) => fr[s] ?? { slug: s, total: { imp: 0, clk: 0, pos: 0 }, logi: { imp: 0, clk: 0, pos: null } }),
    control: g.control.map((s: string) => fr[s] ?? { slug: s, total: { imp: 0, clk: 0, pos: 0 }, logi: { imp: 0, clk: 0, pos: null } }),
  };
  mkdirSync(path.resolve(outDir), { recursive: true });
  writeFileSync(path.resolve(outDir, "mesure.json"), JSON.stringify(res, null, 2));
  console.log(JSON.stringify(res.groups, null, 1));
}

const [mode, a, b, o] = process.argv.slice(2);
if (mode === "build") build(a, b).catch((e) => { console.error(e); process.exit(1); });
else if (mode === "measure") measure(a, b, o ?? "tasks/infos-pratiques/mesure-j28").catch((e) => { console.error(e); process.exit(1); });
else console.error("Usage : build <début> <fin> | measure <début> <fin> <sortie>");
