/**
 * Diagnostic (LECTURE SEULE) de la migration "slugs sans année".
 *
 * Règle cible : le slug d'une fiche salon ne porte plus d'année. La fiche
 * canonique d'une série (édition la plus récente publiée) prend le slug de
 * base ; les éditions passées publiées qui coexistent (archives) gardent
 * leur slug avec année.
 *
 * Sorties :
 *  1. Renommages à faire (published, slug avec année, canonique de sa série)
 *  2. Archives conservées (published, non canoniques de leur série)
 *  3. Collisions : slug de base déjà occupé par une autre fiche (draft ou non)
 *  4. Redirects next.config.ts dont la destination sera renommée (à réécrire)
 *  5. Redirects dont la source est égale à un futur slug de base (shadowing)
 *  6. Liens /salons/<slug-année> dans les MDX (salons, venues, sectors)
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-slug-migration.ts
 */
import { readFileSync } from "node:fs";
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

type SalonRow = {
  slug: string;
  name: string;
  status: string;
  start_date: string | null;
  edition_year: number | null;
  editorial_mdx: string | null;
};

type Redirect = { source: string; destination: string };

function parseRedirects(): Redirect[] {
  const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
  const out: Redirect[] = [];
  const re =
    /source:\s*"\/salons\/([^"]+)",\s*destination:\s*"\/salons\/([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(config))) {
    out.push({ source: m[1], destination: m[2] });
  }
  return out;
}

function baseSlug(slug: string): string {
  return slug.replace(YEAR_SUFFIX, "");
}

async function main() {
  const { data, error } = await supabase
    .from("salons")
    .select("slug, name, status, start_date, edition_year, editorial_mdx");
  if (error) throw error;
  const salons = (data ?? []) as SalonRow[];
  const allSlugs = new Set(salons.map((s) => s.slug));
  const published = salons.filter((s) => s.status === "published");

  // Groupes par slug de base (published uniquement pour la canonicité)
  const groups = new Map<string, SalonRow[]>();
  for (const s of published) {
    const base = baseSlug(s.slug);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base)!.push(s);
  }

  const renames: { from: string; to: string; name: string }[] = [];
  const archives: SalonRow[] = [];
  const collisions: { base: string; holder: SalonRow }[] = [];
  const noop: string[] = [];

  for (const [base, members] of groups) {
    // Canonique = start_date max (fallback edition_year max)
    const sorted = [...members].sort((a, b) => {
      const da = a.start_date ?? "0000";
      const db = b.start_date ?? "0000";
      if (da !== db) return db.localeCompare(da);
      return (b.edition_year ?? 0) - (a.edition_year ?? 0);
    });
    const canonical = sorted[0];
    for (const other of sorted.slice(1)) archives.push(other);

    if (canonical.slug === base) {
      noop.push(canonical.slug);
      continue;
    }
    // Collision : le slug de base existe déjà sur une AUTRE fiche (tout statut)
    const holder = salons.find((s) => s.slug === base);
    if (holder) {
      collisions.push({ base, holder });
      continue;
    }
    renames.push({ from: canonical.slug, to: base, name: canonical.name });
  }

  console.log(`Fiches totales : ${salons.length} (${published.length} publiées)`);
  console.log(`Séries (groupes par slug de base) : ${groups.size}\n`);

  console.log(`== 1. Renommages (canonique -> slug de base) : ${renames.length} ==`);
  for (const r of renames) console.log(`  ${r.from} -> ${r.to}`);

  console.log(`\n== 2. Archives publiées conservées avec année : ${archives.length} ==`);
  for (const a of archives)
    console.log(`  ${a.slug} (start ${a.start_date}, ${a.editorial_mdx ? "MDX" : "sans MDX"})`);

  console.log(`\n== 3. Collisions de slug de base : ${collisions.length} ==`);
  for (const c of collisions)
    console.log(`  ${c.base} déjà porté par ${c.holder.slug} (${c.holder.status})`);

  console.log(`\n== Slugs publiés déjà sans année : ${noop.length} ==`);

  // Redirects
  const redirects = parseRedirects();
  const renameMap = new Map(renames.map((r) => [r.from, r.to]));

  console.log(`\n== 4. Redirects existants dont la destination sera renommée : ==`);
  let rewriteCount = 0;
  for (const r of redirects) {
    if (renameMap.has(r.destination)) {
      console.log(`  ${r.source} -> ${r.destination} (réécrire vers ${renameMap.get(r.destination)})`);
      rewriteCount++;
    }
  }
  console.log(`  total : ${rewriteCount} / ${redirects.length} redirects`);

  console.log(`\n== 5. Redirects dont la source est un futur slug de base (shadowing) : ==`);
  const newSlugs = new Set(renames.map((r) => r.to));
  let shadowCount = 0;
  for (const r of redirects) {
    if (newSlugs.has(r.source)) {
      console.log(`  ${r.source} -> ${r.destination}`);
      shadowCount++;
    }
  }
  console.log(`  total : ${shadowCount}`);

  // Liens MDX
  console.log(`\n== 6. Liens /salons/<slug renommé> dans les MDX : ==`);
  const oldSlugs = new Set(renames.map((r) => r.from));
  let mdxHits = 0;

  const scanMdx = (label: string, rows: { slug?: string; editorial_mdx: string | null }[]) => {
    for (const row of rows) {
      if (!row.editorial_mdx) continue;
      const links = [...row.editorial_mdx.matchAll(/\/salons\/([a-z0-9-]+)/g)].map(
        (m) => m[1]
      );
      const hits = links.filter((l) => oldSlugs.has(l));
      if (hits.length) {
        console.log(`  [${label}] ${row.slug} : ${[...new Set(hits)].join(", ")}`);
        mdxHits += hits.length;
      }
    }
  };

  scanMdx("salon", salons);
  const { data: venues } = await supabase
    .from("venues")
    .select("slug, editorial_mdx")
    .not("editorial_mdx", "is", null);
  scanMdx("venue", venues ?? []);
  const { data: sectors } = await supabase
    .from("sectors")
    .select("slug, editorial_mdx")
    .not("editorial_mdx", "is", null);
  scanMdx("sector", sectors ?? []);
  console.log(`  total liens à réécrire : ${mdxHits}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
