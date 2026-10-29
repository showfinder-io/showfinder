// Test CTR 48 : applique les nouveaux seo_title / seo_description (ou _en) des pages traitées.
// Ne touche que les pages du groupe traité et les deux champs de leur locale.
// Écrit d'abord la migration versionnée (avec rollback = valeurs actuelles), puis applique via REST.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/ctr-test-48-apply.ts [--dry-run]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const DRY = process.argv.includes("--dry-run");
const MIGRATION = "supabase/migrations/20261029000000_ctr_test_48_seo_titles.sql";
const groups = JSON.parse(readFileSync("tasks/ctr-test-48/groupes.json", "utf-8"));
const titres = JSON.parse(readFileSync("tasks/ctr-test-48/titres.json", "utf-8")) as {
  page: string; title: string; description: string;
}[];
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const sql = (v: string | null) => (v === null ? "NULL" : `'${v.replace(/'/g, "''")}'`);

async function main() {
  // Le rollback de la migration capture les valeurs avant le test : ne jamais le régénérer après application.
  if (existsSync(MIGRATION) && !DRY) throw new Error(`${MIGRATION} existe déjà : test déjà appliqué`);
  const treated = new Map<string, { slug: string; locale: string }>(
    groups.treated.map((t: { page: string; slug: string; locale: string }) => [t.page, t])
  );
  if (titres.length !== treated.size) throw new Error(`${titres.length} titres pour ${treated.size} pages traitées`);
  const up: string[] = [], down: string[] = [];
  const plan: { slug: string; patch: Record<string, string> }[] = [];
  for (const t of titres) {
    const g = treated.get(t.page);
    if (!g) throw new Error(`${t.page} n'est pas dans le groupe traité`);
    if (/[—–]/.test(t.title + t.description)) throw new Error(`tiret long dans ${t.page}`);
    const [ft, fd] = g.locale === "en" ? ["seo_title_en", "seo_description_en"] : ["seo_title", "seo_description"];
    const { data: cur, error } = await sb.from("salons").select(`${ft}, ${fd}`).eq("slug", g.slug).single();
    if (error) throw error;
    const old = cur as unknown as Record<string, string | null>;
    up.push(`UPDATE salons SET ${ft} = ${sql(t.title)}, ${fd} = ${sql(t.description)} WHERE slug = '${g.slug}';`);
    down.push(`--   UPDATE salons SET ${ft} = ${sql(old[ft])}, ${fd} = ${sql(old[fd])} WHERE slug = '${g.slug}';`);
    plan.push({ slug: g.slug, patch: { [ft]: t.title, [fd]: t.description } });
  }
  writeFileSync(
    MIGRATION,
    [
      "-- ============================================================",
      "-- Test CTR 48 : nouveaux titres et descriptions SEO des 19 pages traitées",
      "-- ============================================================",
      "-- Plan et mesure : tasks/ctr-test-48/progress.md. Groupe témoin inchangé (groupes.json).",
      "-- Textes passés par 1 writer + 2 reviewers, faits issus de la base et du MDX validé.",
      "-- Appliqué via scripts/ctr-test-48-apply.ts (REST, service role), versionné ici.",
      "--",
      "-- ROLLBACK (valeurs avant le test) :",
      ...down,
      "-- ============================================================",
      "",
      "BEGIN;",
      "",
      ...up,
      "",
      "COMMIT;",
      "",
    ].join("\n")
  );
  console.log(`Migration écrite : ${MIGRATION} (${up.length} UPDATE)`);
  if (DRY) return;
  for (const p of plan) {
    const { data, error } = await sb.from("salons").update(p.patch).eq("slug", p.slug).select("slug");
    if (error || data?.length !== 1) throw new Error(`échec ${p.slug} : ${error?.message ?? data?.length}`);
  }
  // Relecture de contrôle
  for (const p of plan) {
    const cols = Object.keys(p.patch);
    const { data } = await sb.from("salons").select(cols.join(", ")).eq("slug", p.slug).single();
    const row = data as unknown as Record<string, string>;
    for (const c of cols) if (row[c] !== p.patch[c]) throw new Error(`contrôle KO ${p.slug}.${c}`);
  }
  console.log(`${plan.length} fiches mises à jour et relues : OK (${new Date().toISOString()})`);
}
main().catch((e) => { console.error(e); process.exit(1); });
