/**
 * Migration "slugs sans année" (ÉCRITURE). Idempotent : rejouer = 0 ligne.
 *
 * 1. Calcule les renommages (mêmes règles que diag-slug-migration.ts) :
 *    fiche publiée canonique de sa série -> slug sans suffixe -20XX.
 * 2. Émet redirects-slug-year.json (301 ancien -> nouveau) à la racine,
 *    consommé par next.config.ts. N'écrase PAS le fichier si aucun
 *    renommage à faire (relance post-migration).
 * 3. Renomme les slugs en DB.
 * 4. Réécrit les liens /salons/<ancien> dans les editorial_mdx
 *    (tables salons, venues, sectors).
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-slug-year-apply.ts
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Variables requises dans .env.local : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const YEAR_SUFFIX = /-20\d{2}$/;
const REDIRECTS_FILE = join(process.cwd(), "redirects-slug-year.json");

type SalonRow = {
  slug: string;
  status: string;
  start_date: string | null;
  edition_year: number | null;
};

function baseSlug(slug: string): string {
  return slug.replace(YEAR_SUFFIX, "");
}

async function computeRenames(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("salons")
    .select("slug, status, start_date, edition_year");
  if (error) throw error;
  const salons = (data ?? []) as SalonRow[];
  const allSlugs = new Set(salons.map((s) => s.slug));
  const published = salons.filter((s) => s.status === "published");

  const groups = new Map<string, SalonRow[]>();
  for (const s of published) {
    const base = baseSlug(s.slug);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base)!.push(s);
  }

  const renames = new Map<string, string>();
  for (const [base, members] of groups) {
    const sorted = [...members].sort((a, b) => {
      const da = a.start_date ?? "0000";
      const db = b.start_date ?? "0000";
      if (da !== db) return db.localeCompare(da);
      return (b.edition_year ?? 0) - (a.edition_year ?? 0);
    });
    const canonical = sorted[0];
    if (canonical.slug === base) continue; // déjà migré
    if (allSlugs.has(base)) {
      console.error(`COLLISION : ${base} déjà porté par une autre fiche, skip ${canonical.slug}`);
      continue;
    }
    renames.set(canonical.slug, base);
  }
  return renames;
}

/** Réécrit les liens /salons/<ancien> d'un MDX. Bordure stricte : le slug ne
 *  doit pas être suivi d'un caractère de slug (évite les remplacements partiels). */
function rewriteMdx(mdx: string, renames: Map<string, string>): string {
  return mdx.replace(/\/salons\/([a-z0-9-]+)/g, (full, slug: string) => {
    const target = renames.get(slug);
    return target ? `/salons/${target}` : full;
  });
}

async function rewriteTableMdx(
  table: "salons" | "venues" | "sectors",
  renames: Map<string, string>
): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select("slug, editorial_mdx")
    .not("editorial_mdx", "is", null);
  if (error) throw error;
  let updated = 0;
  for (const row of data ?? []) {
    const mdx = row.editorial_mdx as string;
    const next = rewriteMdx(mdx, renames);
    if (next !== mdx) {
      const { error: upErr } = await supabase
        .from(table)
        .update({ editorial_mdx: next } as never)
        .eq("slug", row.slug as string);
      if (upErr) throw upErr;
      updated++;
    }
  }
  return updated;
}

async function main() {
  const renames = await computeRenames();
  console.log(`Renommages à appliquer : ${renames.size}`);

  // 1. Redirects JSON (avant renommage ; jamais écrasé par une relance vide)
  if (renames.size > 0) {
    const entries = [...renames.entries()]
      .map(([from, to]) => ({
        source: `/salons/${from}`,
        destination: `/salons/${to}`,
      }))
      .sort((a, b) => a.source.localeCompare(b.source));
    writeFileSync(REDIRECTS_FILE, JSON.stringify(entries, null, 2) + "\n");
    console.log(`redirects-slug-year.json : ${entries.length} entrées`);
  } else if (!existsSync(REDIRECTS_FILE)) {
    console.error("Aucun renommage et redirects-slug-year.json absent : rien à faire.");
  }

  // --redirects-only : émettre le JSON sans toucher la DB (préparation du
  // déploiement : on ne renomme en prod qu'au moment de pousser, pour
  // minimiser la fenêtre 404 avant l'arrivée des redirects).
  if (process.argv.includes("--redirects-only")) {
    console.log("Mode --redirects-only : DB non modifiée.");
    return;
  }

  // 2. Liens MDX AVANT le renommage des slugs : si le script meurt au milieu,
  // une relance recalcule encore les renommages (slugs inchangés) et la
  // réécriture MDX est naturellement no-op sur les liens déjà migrés.
  if (renames.size > 0) {
    const s = await rewriteTableMdx("salons", renames);
    const v = await rewriteTableMdx("venues", renames);
    const c = await rewriteTableMdx("sectors", renames);
    console.log(`MDX réécrits : salons=${s}, venues=${v}, sectors=${c}`);
  }

  // 3. Renommage des slugs
  let renamed = 0;
  for (const [from, to] of renames) {
    const { data, error } = await supabase
      .from("salons")
      .update({ slug: to } as never)
      .eq("slug", from)
      .select("id");
    if (error) throw error;
    renamed += (data ?? []).length;
  }
  console.log(`Slugs renommés en DB : ${renamed}`);

  console.log("Terminé.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
