// Test CTR 48 : dossier d'entrée du writer pour chaque page traitée (données en base + MDX + requêtes classées).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const [groupsFile, intentsFile, outDir] = process.argv.slice(2);
const groups = JSON.parse(readFileSync(groupsFile, "utf-8"));
const intents = JSON.parse(readFileSync(intentsFile, "utf-8"));

async function main() {
  for (const p of groups.treated) {
    const { data: s, error } = await sb
      .from("salons")
      .select("slug, name, edition_year, start_date, end_date, dates_confirmed, city, venue, frequency, category, organizer_name, estimated_exhibitors, estimated_visitors, website_url, seo_title, seo_description, seo_title_en, seo_description_en, editorial_mdx, editorial_mdx_en")
      .eq("slug", p.slug)
      .single();
    if (error) throw error;
    const en = p.locale === "en";
    const { editorial_mdx, editorial_mdx_en, seo_title, seo_description, seo_title_en, seo_description_en, ...facts } = s;
    const doc = [
      `# ${p.page} (locale ${p.locale}, champs à réécrire : ${en ? "seo_title_en, seo_description_en" : "seo_title, seo_description"})`,
      "",
      "## Données en base",
      "```json",
      JSON.stringify(facts, null, 2),
      "```",
      "",
      "## SEO actuel",
      `- title : ${(en ? seo_title_en : seo_title) ?? "(vide, fallback nom + année)"}`,
      `- description : ${(en ? seo_description_en : seo_description) ?? "(vide)"}`,
      "",
      "## Requêtes GSC 2026-09-30 → 2026-10-27 (80 % des impressions), intention classée par Jev",
      "| requête | impr. | clics | pos. | intention |",
      "|---|---:|---:|---:|---|",
      ...intents[p.page].queries.map((q: { query: string; impressions: number; clicks: number; position: number; intent: string }) =>
        `| ${q.query} | ${q.impressions} | ${q.clicks} | ${q.position.toFixed(1)} | ${q.intent} |`),
      "",
      `## MDX éditorial validé (${en ? "EN" : "FR"}) : seule source de faits autorisée avec les données en base`,
      "",
      (en ? editorial_mdx_en : editorial_mdx) ?? "(aucun)",
    ].join("\n");
    writeFileSync(path.join(outDir, `${p.locale}-${p.slug}.md`), doc);
  }
  console.log(`${groups.treated.length} dossiers écrits dans ${outDir}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
