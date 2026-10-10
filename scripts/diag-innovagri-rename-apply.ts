/**
 * Innovagri (todo H8, 2026-10-10) : la fiche innov-agri-ondes décrivait
 * l'édition 2026 d'Ondes. Innovagri (Groupe NGPA) est une marque unique
 * itinérante : 2025 Outarville et Essigny-le-Grand, 2026 Ondes, 2027 Grugies
 * (Aisne), 2028 Bourgogne-Franche-Comté (communiqué NGPA du 30/09/2026).
 * RR39 : slug sans ville -> `innovagri` (301 FR/EN dans next.config.ts), nom
 * aligné sur la graphie unifiée « Innovagri ». Changement de ville refusé par
 * roll-guards : application ici après writer + 2 reviewers +
 * correcteur-traducteur (handoff/edito-innov-agri/BRIEF.md).
 *
 * Écrit : slug, name, champs factuels de final/innov-agri.meta.json, MDX
 * FR/EN, SEO ; coordonnées remises à null (elles pointaient sur Ondes, le site
 * de Grugies n'est pas publié). Réécrit les liens /salons/innov-agri-ondes des
 * autres fiches et des pages secteurs.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-innovagri-rename-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const DIR = join(process.cwd(), "handoff/edito-innov-agri");
const OLD_SLUG = "innov-agri-ondes";
const NEW_SLUG = "innovagri";
const NEW_NAME = "Innovagri";
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
  const meta = JSON.parse(readFileSync(join(DIR, "final/innov-agri.meta.json"), "utf8"));
  const fr = readFileSync(join(DIR, "final/innov-agri.fr.mdx"), "utf8").trim();
  const en = readFileSync(join(DIR, "final/innov-agri.en.mdx"), "utf8").trim();
  const f = meta.fields;

  const issues = [...(await checkMdx("FR", fr, f.edition_year)), ...(await checkMdx("EN", en, f.edition_year))];
  for (const k of FIELDS) if (!(k in f)) issues.push(`champ ${k} absent de meta.fields`);
  if (!["annuel", "bisannuel", "ponctuel"].includes(f.frequency)) issues.push(`frequency "${f.frequency}" hors enum`);
  for (const k of SEO_FIELDS) {
    if (!meta[k]) issues.push(`${k} absent`);
    else if (String(meta[k]).includes("—")) issues.push(`${k} : tiret cadratin`);
    else if (!String(meta[k]).includes(String(f.edition_year))) issues.push(`${k} sans l'année ${f.edition_year}`);
  }

  const { data: done } = await sb.from("salons").select("id,editorial_mdx").eq("slug", NEW_SLUG).maybeSingle();
  if (done && done.editorial_mdx === fr) {
    console.log(`DÉJÀ APPLIQUÉ ${NEW_SLUG}`);
  } else {
    const { data: live, error } = await sb.from("salons").select("id,editorial_mdx,start_date").eq("slug", OLD_SLUG).single();
    if (error) throw new Error(`${OLD_SLUG}: ${error.message}`);
    if (live.id !== input.id) issues.push("id différent du dump d'entrée");
    if (live.editorial_mdx !== input.editorial_mdx) issues.push("MDX modifié en base depuis le dump d'entrée");
    if (live.start_date !== input.start_date) issues.push("dates modifiées en base depuis le dump d'entrée");

    if (issues.length) {
      console.log(`REJET :\n  - ${issues.join("\n  - ")}`);
      process.exit(1);
    }
    const patch: Record<string, unknown> = { slug: NEW_SLUG, name: NEW_NAME, venue_id: null, venue_lat: null, venue_lng: null, editorial_mdx: fr, editorial_mdx_en: en, editorial_updated_at: new Date().toISOString() };
    for (const k of FIELDS) patch[k] = f[k];
    for (const k of SEO_FIELDS) patch[k] = meta[k];
    for (const k of [...FIELDS, "slug", "name"]) console.log(`  ${k}: ${JSON.stringify(input[k])} -> ${JSON.stringify(patch[k])}`);
    console.log(`  MDX FR ${input.editorial_mdx.length}c -> ${fr.length}c | EN ${input.editorial_mdx_en.length}c -> ${en.length}c`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("id", input.id).eq("slug", OLD_SLUG);
      if (upErr) throw new Error(upErr.message);
    }
  }

  // Liens internes des autres fiches et des pages secteurs vers l'ancien slug.
  for (const [table, col] of [["salons", "editorial_mdx"], ["salons", "editorial_mdx_en"], ["sectors", "editorial_mdx"], ["sectors", "editorial_mdx_en"]] as const) {
    const { data: rows, error } = await sb.from(table).select(`id,slug,${col}`).ilike(col, `%/salons/${OLD_SLUG}%`);
    if (error) throw new Error(error.message);
    for (const r of (rows ?? []) as Record<string, string>[]) {
      const next = r[col]
        .replace(new RegExp(`/salons/${OLD_SLUG}(?=[)#?])`, "g"), `/salons/${NEW_SLUG}`);
      if (next === r[col] || next.includes(`/salons/${OLD_SLUG}`)) {
        console.log(`  LIEN ${table}/${r.slug}.${col} : occurrence non réécrite, à vérifier à la main`);
        continue;
      }
      console.log(`  LIEN ${table}/${r.slug}.${col} : /salons/${OLD_SLUG} -> /salons/${NEW_SLUG}`);
      if (APPLY) {
        const { error: lErr } = await sb.from(table).update({ [col]: next } as never).eq("id", r.id);
        if (lErr) throw new Error(`${r.slug}: ${lErr.message}`);
      }
    }
  }
  console.log(APPLY ? "Appliqué." : "Dry-run terminé.");
}

main().catch((e) => { console.error(e); process.exit(1); });
