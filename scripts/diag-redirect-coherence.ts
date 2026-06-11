// Détection systématique des incohérences slugs / redirects (audit 2026-06-11).
//
// Lecture seule, aucun write. Trois familles de problèmes détectées :
// 1. Fiches publiées "shadowées" : leur slug est source d'un 301 dans
//    next.config.ts, donc leur URL n'est jamais servie.
// 2. Chaînes et boucles de redirects : une destination qui est elle-même
//    source (boucle si elle pointe en sens inverse, cf. tasks/lessons.md).
// 3. Slugs à année désynchronisée : le slug contient une année différente
//    de edition_year (fiche roulée par find-next-edition sans renommage).
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/diag-redirect-coherence.ts

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

type Redirect = { source: string; destination: string };

// Extraction des redirects depuis next.config.ts. Parsing texte volontaire :
// importer la config Next depuis tsx tirerait tout le runtime Next.
function parseRedirects(): Redirect[] {
  const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
  const redirects: Redirect[] = [];
  const re =
    /source:\s*"\/salons\/([^"]+)",\s*destination:\s*"\/salons\/([^"]+)"/g;
  let match;
  while ((match = re.exec(config)) !== null) {
    redirects.push({ source: match[1], destination: match[2] });
  }
  return redirects;
}

function slugYear(slug: string): number | null {
  const m = slug.match(/(20\d{2})$/);
  return m ? Number(m[1]) : null;
}

async function main() {
  const redirects = parseRedirects();
  console.log(`Redirects /salons/* dans next.config.ts : ${redirects.length}`);

  const { data: salons, error } = await supabase
    .from("salons")
    .select("slug, status, start_date, end_date, edition_year")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  console.log(`Salons publiés en base : ${salons.length}\n`);

  const sources = new Map(redirects.map((r) => [r.source, r.destination]));

  // 1. Fiches publiées shadowées par un redirect
  console.log("== 1. Fiches publiées dont le slug est source d'un redirect ==");
  const shadowed = salons.filter((s) => sources.has(s.slug));
  for (const s of shadowed) {
    console.log(
      `  ${s.slug} (start ${s.start_date}, edition_year ${s.edition_year}) -> shadowée par 301 vers ${sources.get(s.slug)}`
    );
  }
  if (shadowed.length === 0) console.log("  aucune");

  // 2. Chaînes / boucles de redirects
  console.log("\n== 2. Destinations de redirect elles-mêmes sources ==");
  let chains = 0;
  for (const r of redirects) {
    if (sources.has(r.destination)) {
      const next = sources.get(r.destination);
      const loop = next === r.source ? " BOUCLE INFINIE" : "";
      console.log(
        `  ${r.source} -> ${r.destination} -> ${next}${loop}`
      );
      chains++;
    }
  }
  if (chains === 0) console.log("  aucune");

  // 3. Slug avec année != edition_year
  console.log("\n== 3. Fiches publiées : année du slug != edition_year ==");
  let mismatches = 0;
  for (const s of salons) {
    const year = slugYear(s.slug);
    if (year !== null && s.edition_year !== null && year !== s.edition_year) {
      console.log(
        `  ${s.slug} : edition_year ${s.edition_year}, start ${s.start_date}`
      );
      mismatches++;
    }
  }
  if (mismatches === 0) console.log("  aucune");

  // 4. Destinations de redirect sans fiche publiée correspondante (ni MDX :
  //    contrôle base uniquement, les fiches MDX sont signalées pour info)
  console.log("\n== 4. Destinations de redirect absentes des fiches publiées (DB) ==");
  const publishedSlugs = new Set(salons.map((s) => s.slug));
  let dangling = 0;
  for (const r of redirects) {
    if (!publishedSlugs.has(r.destination)) {
      console.log(`  ${r.source} -> ${r.destination} (pas en DB : fiche MDX ou cassée ?)`);
      dangling++;
    }
  }
  if (dangling === 0) console.log("  aucune");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
