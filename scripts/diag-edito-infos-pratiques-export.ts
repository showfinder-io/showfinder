// Amélioration éditoriale « Infos pratiques » sur 10 % des fiches salon (décision Julien du
// 2026-11-12, après abandon du test contrôlé : l'échantillon de tasks/infos-pratiques/ montrait
// que les requêtes logistiques ne sont pas un angle mort de clic). Pas de mesure attendue.
//
// Sélection déterministe : fiches publiées dont l'édition est à venir (start_date >= 2026-11-12),
// classées par impressions GSC FR+EN (2026-10-13 au 2026-11-09), en excluant :
//  - les fiches des tests en cours jusqu'à leur mesure (tasks/ctr-test-48/groupes.json,
//    tasks/page2-page1/priorisation.md) ;
//  - les 20 fiches refaites les 11 et 12 novembre ;
//  - les 30 fiches EN les plus vues (relecture EN menée en parallèle, mêmes MDX EN).
// Écrit handoff/edito-infos-pratiques-2026-11-12/input/<slug>.json (format de
// diag-edito-roll-2027-apply.ts) et published-slugs.json, plus tasks/infos-pratiques/selection-edito.json.
//
// Lecture seule. Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-edito-infos-pratiques-export.ts [N=44]

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const N = Number(process.argv[2] ?? 44);
const START = "2026-10-13";
const END = "2026-11-09";
const TODAY = "2026-11-12";
const DIR = "handoff/edito-infos-pratiques-2026-11-12";
const SITE = "sc-domain:agoris.io";
const SECRETS = path.join(os.homedir(), "Projects", "glyphe", ".secrets");
const FIELDS =
  "slug,name,start_date,end_date,edition_year,dates_confirmed,city,venue,venue_id,website_url,organizer_name,frequency,seo_title,seo_description,seo_title_en,seo_description_en,editorial_mdx,editorial_mdx_en";

const REFAITES = [
  "silmo-paris", "medi-nov-connection-lyon", "aerospace-test-development-show", "batimat", "ideobain", "natexpo-paris",
  "tranofiliere-paris", "luxe-pack-monaco", "untec-congres", "numeriquest-toulouse", "architect-at-work-lyon",
  "preventica-paris", "cannes-yachting-festival", "tfwa-world-exhibition", "interclima", "produrable-paris",
  "premiere-classe", "ad2s-bordeaux", "one-to-one-retail-ecommerce", "tech-for-retail-paris",
];

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function token(): Promise<string> {
  const creds = JSON.parse(readFileSync(path.join(SECRETS, "gsc-oauth-credentials.json"), "utf-8"));
  const tok = JSON.parse(readFileSync(path.join(SECRETS, "google-oauth-token-gsc-ga4.json"), "utf-8"));
  const c = creds.installed ?? creds.web ?? creds;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token: tok.refresh_token, grant_type: "refresh_token" }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function pageImpressions(): Promise<{ fr: Record<string, number>; en: Record<string, number> }> {
  const t = await token();
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: START, endDate: END, dimensions: ["page"], rowLimit: 25000, dataState: "final",
      dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "includingRegex", expression: "agoris\\.io/(en/)?salons/[^/]+$" }] }],
    }),
  });
  if (!res.ok) throw new Error(`GSC ${res.status}`);
  const rows = ((await res.json()) as { rows?: { keys: string[]; impressions: number }[] }).rows ?? [];
  const fr: Record<string, number> = {}, en: Record<string, number> = {};
  for (const r of rows) {
    const isEn = /\/en\/salons\//.test(r.keys[0]);
    const slug = decodeURIComponent(r.keys[0].replace(/^https?:\/\/[^/]+/, "").replace(/^\/en/, "").replace("/salons/", ""));
    (isEn ? en : fr)[slug] = (isEn ? en : fr)[slug] ?? 0;
    (isEn ? en : fr)[slug] += r.impressions;
  }
  return { fr, en };
}

(async () => {
  const { fr, en } = await pageImpressions();
  const g48 = JSON.parse(readFileSync("tasks/ctr-test-48/groupes.json", "utf-8"));
  const ex48 = new Set<string>([...g48.treated, ...g48.control, ...g48.excluded].map((x: { page: string }) => x.page.replace(/^\/(en\/)?salons\//, "")));
  const prio = readFileSync("tasks/page2-page1/priorisation.md", "utf-8");
  const exK = new Set<string>([...prio.matchAll(/^\| \d+ \| \/(?:en\/)?salons\/([^ |]+)/gm)].map((m) => m[1]));
  const exRef = new Set(REFAITES);
  const enTop = Object.entries(en).filter(([s]) => !ex48.has(s) && !exRef.has(s)).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([s]) => s);
  const exEn = new Set(enTop);

  const { data: live, error } = await sb.from("salons").select("slug,start_date").eq("status", "published");
  if (error) throw error;
  const upcoming = live!.filter((r) => r.start_date && r.start_date >= TODAY).map((r) => r.slug);
  const why: Record<string, string> = {};
  const pool = upcoming.filter((s) => {
    if (ex48.has(s)) return (why[s] = "test CTR 48"), false;
    if (exK.has(s)) return (why[s] = "volet K"), false;
    if (exRef.has(s)) return (why[s] = "refaite 11-12 nov."), false;
    if (exEn.has(s)) return (why[s] = "relecture EN"), false;
    return true;
  });
  const ranked = pool.map((s) => ({ slug: s, imp_fr: fr[s] ?? 0, imp_en: en[s] ?? 0 })).sort((a, b) => b.imp_fr + b.imp_en - (a.imp_fr + a.imp_en));
  const selected = ranked.slice(0, N);

  mkdirSync("tasks/infos-pratiques", { recursive: true });
  writeFileSync(
    "tasks/infos-pratiques/selection-edito.json",
    JSON.stringify({ window: { start: START, end: END }, today: TODAY, n: selected.length, upcoming: upcoming.length, pool: pool.length, excluded: why, en_top30: enTop, selected }, null, 2),
  );
  for (const d of ["input", "writer", "review", "final", "sources"]) mkdirSync(`${DIR}/${d}`, { recursive: true });
  for (const { slug } of selected) {
    const { data, error: e } = await sb.from("salons").select(FIELDS).eq("slug", slug).single();
    if (e) throw e;
    const { data: v } = await sb.from("venues").select("slug,name,address,postal_code,city").eq("id", data.venue_id).maybeSingle();
    writeFileSync(`${DIR}/input/${slug}.json`, JSON.stringify({ fiche: { ...data, venue_slug: v?.slug ?? null }, venue: v ?? null }, null, 2));
  }
  const [s, vv, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
    sb.from("sectors").select("slug"),
  ]);
  writeFileSync(
    `${DIR}/published-slugs.json`,
    JSON.stringify({ salons: s.data!.map((r) => r.slug).sort(), lieux: vv.data!.map((r) => r.slug).sort(), secteurs: sec.data!.map((r) => r.slug).sort() }, null, 2),
  );
  console.log(`à venir ${upcoming.length} | pool ${pool.length} | sélection ${selected.length}`);
  console.log(selected.map((x) => `${x.slug}(${x.imp_fr}+${x.imp_en})`).join(" "));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
