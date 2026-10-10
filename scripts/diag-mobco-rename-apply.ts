/**
 * Mobco (todo E5bis, 2026-10-10) : la fiche transports-publics-paris décrit
 * Mobco (fusion European Mobility Expo + RNTP), salon itinérant Paris / régions.
 * RR39 : slug sans ville -> `mobco` (301 FR/EN dans next.config.ts). L'édition
 * 2027 change de ville et de lieu (Saint-Étienne), donc hors du roll
 * automatique (roll-guards rejette tout changement de ville) : application ici,
 * après le process writer + 2 reviewers + correcteur-traducteur
 * (handoff/edito-mobco/BRIEF.md).
 *
 * Écrit : slug, champs factuels de final/mobco.meta.json, venue_id, MDX FR/EN,
 * SEO. Coordonnées remises à null (celles de Paris Expo ne valent plus, le lieu
 * de Saint-Étienne n'en a pas en base). Réécrit aussi les liens internes
 * /salons/transports-publics-paris des autres fiches publiées.
 *
 * Contrôles : MDX compilable, composants en liste blanche, pas de table pipe ni
 * de tiret cadratin, liens internes publiés, année présente, verrou optimiste
 * sur le dump d'entrée.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-mobco-rename-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const DIR = join(process.cwd(), "handoff/edito-mobco");
const OLD_SLUG = "transports-publics-paris";
const NEW_SLUG = "mobco";
const VENUE_SLUG = "parc-expo-saint-etienne";
const FIELDS = ["city", "venue", "start_date", "end_date", "edition_year", "dates_confirmed", "frequency", "estimated_exhibitors", "estimated_visitors", "organizer_name", "website_url", "description", "description_en"] as const;
const SEO_FIELDS = ["seo_title", "seo_description", "seo_title_en", "seo_description_en"] as const;

const published: { salons: string[]; lieux: string[]; secteurs: string[] } = JSON.parse(readFileSync(join(DIR, "published-slugs.json"), "utf8"));

async function checkMdx(label: string, mdx: string, year: number): Promise<string[]> {
  const issues: string[] = [];
  if (mdx.includes("—")) issues.push(`${label} : tiret cadratin`);
  for (const m of mdx.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!["HistoryTable", "BudgetTable", "DataMissing"].includes(m[1])) issues.push(`${label} : balise ou composant non fourni <${m[1]}>`);
  }
  if (/^\s*\|.*\|\s*$/m.test(mdx)) issues.push(`${label} : table en syntaxe pipe`);
  if (!mdx.includes(String(year))) issues.push(`${label} : année ${year} absente`);
  for (const m of mdx.matchAll(/\]\((?:\/en)?\/(salons|lieux|secteurs)\/([a-z0-9-]+)[)#?]/g)) {
    const list = published[m[1] as "salons" | "lieux" | "secteurs"];
    if (!list.includes(m[2])) issues.push(`${label} : lien interne cassé /${m[1]}/${m[2]}`);
  }
  try {
    const { compile } = await import("@mdx-js/mdx");
    await compile(mdx, { outputFormat: "function-body" });
  } catch (e) {
    issues.push(`${label} : MDX non compilable (${(e as Error).message.slice(0, 120)})`);
  }
  return issues;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const input = JSON.parse(readFileSync(join(DIR, "input/fiche.json"), "utf8"));
  const meta = JSON.parse(readFileSync(join(DIR, "final/mobco.meta.json"), "utf8"));
  const fr = readFileSync(join(DIR, "final/mobco.fr.mdx"), "utf8").trim();
  const en = readFileSync(join(DIR, "final/mobco.en.mdx"), "utf8").trim();
  const f = meta.fields;

  const issues = [...(await checkMdx("FR", fr, f.edition_year)), ...(await checkMdx("EN", en, f.edition_year))];
  for (const k of FIELDS) if (!(k in f)) issues.push(`champ ${k} absent de meta.fields`);
  if (!["annuel", "bisannuel", "ponctuel"].includes(f.frequency)) issues.push(`frequency "${f.frequency}" hors enum`);
  for (const k of SEO_FIELDS) {
    if (!meta[k]) issues.push(`${k} absent`);
    else if (String(meta[k]).includes("—")) issues.push(`${k} : tiret cadratin`);
    else if (!String(meta[k]).includes(String(f.edition_year))) issues.push(`${k} sans l'année ${f.edition_year}`);
  }
  if (f.city !== "Saint-Étienne") issues.push(`ville inattendue "${f.city}" : venue_id ${VENUE_SLUG} non applicable`);

  const { data: done } = await sb.from("salons").select("id,editorial_mdx").eq("slug", NEW_SLUG).maybeSingle();
  if (done && done.editorial_mdx === fr) {
    console.log(`DÉJÀ APPLIQUÉ ${NEW_SLUG}`);
  } else {
    const { data: live, error } = await sb.from("salons").select("id,editorial_mdx,start_date").eq("slug", OLD_SLUG).single();
    if (error) throw new Error(`${OLD_SLUG}: ${error.message}`);
    if (live.id !== input.id) issues.push("id différent du dump d'entrée");
    if (live.editorial_mdx !== input.editorial_mdx) issues.push("MDX modifié en base depuis le dump d'entrée");
    if (live.start_date !== input.start_date) issues.push("dates modifiées en base depuis le dump d'entrée");
    const { data: venue } = await sb.from("venues").select("id").eq("slug", VENUE_SLUG).single();
    if (!venue) issues.push(`lieu ${VENUE_SLUG} absent`);

    if (issues.length) {
      console.log(`REJET :\n  - ${issues.join("\n  - ")}`);
      process.exit(1);
    }
    const patch: Record<string, unknown> = { slug: NEW_SLUG, venue_id: venue!.id, venue_lat: null, venue_lng: null, editorial_mdx: fr, editorial_mdx_en: en, editorial_updated_at: new Date().toISOString() };
    for (const k of FIELDS) patch[k] = f[k];
    for (const k of SEO_FIELDS) patch[k] = meta[k];
    for (const k of [...FIELDS, "slug"]) console.log(`  ${k}: ${JSON.stringify(input[k])} -> ${JSON.stringify(patch[k])}`);
    console.log(`  MDX FR ${input.editorial_mdx.length}c -> ${fr.length}c | EN ${input.editorial_mdx_en.length}c -> ${en.length}c`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("id", input.id).eq("slug", OLD_SLUG);
      if (upErr) throw new Error(upErr.message);
    }
  }

  // Liens internes des autres fiches vers l'ancien slug.
  for (const col of ["editorial_mdx", "editorial_mdx_en"] as const) {
    const { data: rows, error } = await sb.from("salons").select(`id,slug,${col}`).ilike(col, `%/salons/${OLD_SLUG}%`);
    if (error) throw new Error(error.message);
    for (const r of (rows ?? []) as Record<string, string>[]) {
      // Flotauto cite encore l'ancien nom comme ancre du lien.
      const next = r[col]
        .replace(`[Transports Publics](/salons/${OLD_SLUG})`, `[Mobco](/salons/${OLD_SLUG})`)
        .replace(new RegExp(`/salons/${OLD_SLUG}(?=[)#?])`, "g"), `/salons/${NEW_SLUG}`);
      if (next === r[col] || next.includes(`/salons/${OLD_SLUG}`)) {
        console.log(`  LIEN ${r.slug}.${col} : occurrence non réécrite, à vérifier à la main`);
        continue;
      }
      console.log(`  LIEN ${r.slug}.${col} : /salons/${OLD_SLUG} -> /salons/${NEW_SLUG}`);
      if (APPLY) {
        const { error: lErr } = await sb.from("salons").update({ [col]: next } as never).eq("id", r.id);
        if (lErr) throw new Error(`${r.slug}: ${lErr.message}`);
      }
    }
  }
  console.log(APPLY ? "Appliqué." : "Dry-run terminé.");
}

main().catch((e) => { console.error(e); process.exit(1); });
