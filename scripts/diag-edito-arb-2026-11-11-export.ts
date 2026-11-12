// Export du refresh éditorial des 8 fiches roulées par arbitrage le 2026-11-11
// (todo E9bis, tasks/roll-2027/arbitrages-2026-11-11.md, partie B).
// Écrit handoff/edito-arb-2026-11-11/input/<slug>.json au format attendu par
// scripts/diag-edito-roll-2027-apply.ts --dir handoff/edito-arb-2026-11-11,
// plus published-slugs.json pour le contrôle des liens internes.
//
// previous_edition : état de la fiche AVANT le roll (dates lues dans le journal,
// ville, lieu et nom relevés en base le 2026-11-11 avant application).
//
// Lecture seule. Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-edito-arb-2026-11-11-export.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "handoff/edito-arb-2026-11-11";
const FIELDS =
  "slug,name,start_date,end_date,edition_year,city,venue,venue_id,website_url,organizer_name,co_organizer_name,frequency,dates_confirmed,seo_title,seo_description,seo_title_en,seo_description_en,editorial_mdx,editorial_mdx_en";

// Avant le roll : ce que la fiche disait (base, 2026-11-11).
const BEFORE: Record<string, { name: string; city: string; venue: string; venue_slug: string; frequency: string; note: string }> = {
  "natexpo-paris": { name: "Natexpo", city: "Lyon", venue: "Eurexpo Lyon", venue_slug: "eurexpo-lyon", frequency: "annuel", note: "Changement de ville et de lieu : le salon alterne Paris et Lyon. Édition 2026 à Eurexpo Lyon, édition 2027 à Paris Expo Porte de Versailles (pavillon 7.2)." },
  "batimat": { name: "Batimat", city: "Paris", venue: "Paris Nord Villepinte", venue_slug: "paris-nord-villepinte", frequency: "bisannuel", note: "Changement de lieu : édition 2026 à Paris Nord Villepinte, édition 2028 à Paris Expo Porte de Versailles. Le site intègre aussi 3 pavillons Equipbaie-Métalexpo (fusion annoncée, à décrire seulement si le site le dit pour 2028)." },
  "ideobain": { name: "Ideobain", city: "Paris", venue: "Paris Nord Villepinte", venue_slug: "paris-nord-villepinte", frequency: "bisannuel", note: "Changement de lieu : édition 2026 à Paris Nord Villepinte, édition 2028 à Paris Expo Porte de Versailles, en même temps que Batimat. Le JSON-LD du site est encore sur 2026, se fier au texte visible." },
  "tranofiliere-paris": { name: "Tranoï", city: "Paris", venue: "Palais de Tokyo", venue_slug: "palais-de-tokyo", frequency: "annuel", note: "Changement de lieu : la fiche portait le Palais de Tokyo (édition du 1er au 4 octobre 2026), l'édition Fall/Winter 27-28 se tient au Palais Brongniart du 4 au 7 mars 2027. Fréquence passée à semestriel : deux éditions Paris par an (mars et fin septembre). Le seo_description existant mentionnait déjà le Palais Brongniart pour 2026 : vérifier quel était le lieu réel de l'édition d'octobre 2026 avant de l'écrire au passé." },
  "luxe-pack-monaco": { name: "Luxe Pack Monaco", city: "Monaco", venue: "Grimaldi Forum", venue_slug: "grimaldi-forum", frequency: "annuel", note: "Changement de nom : 'En 2027, LUXE PACK Monaco devient LUXE PACK WORLD'. La fiche s'appelle désormais Luxe Pack World (slug conservé). Expliquer le changement de nom une fois, avec l'URL ; garder 'Luxe Pack Monaco' pour les éditions passées." },
  "silmo-paris": { name: "SILMO", city: "Paris", venue: "Paris Nord Villepinte", venue_slug: "paris-nord-villepinte", frequency: "annuel", note: "Lieu inchangé. Site protégé par Cloudflare : lire la capture sources/silmo-paris/ plutôt que curl." },
  "medi-nov-connection-lyon": { name: "Medi'Nov Connection", city: "Lyon", venue: "Centre de Congrès de Lyon", venue_slug: "centre-de-congres-de-lyon", frequency: "annuel", note: "Lieu inchangé." },
  "aerospace-test-development-show": { name: "Aerospace Test & Development Show", city: "Toulouse", venue: "MEETT Toulouse", venue_slug: "meett-toulouse", frequency: "annuel", note: "Lieu inchangé. Le JSON-LD du site est incohérent (startDate 2027-09-29, endDate 2026-09-30) : se fier au texte visible '28-29 September 2027, Hall 7, MEETT'." },
};

(async () => {
  const journal = JSON.parse(readFileSync("tasks/roll-2027/journal.json", "utf8"));
  for (const d of ["input", "writer", "review", "final", "sources"]) mkdirSync(`${DIR}/${d}`, { recursive: true });
  for (const [slug, before] of Object.entries(BEFORE)) {
    const { data, error } = await sb.from("salons").select(FIELDS).eq("slug", slug).single();
    if (error) throw error;
    const { data: v } = await sb.from("venues").select("slug").eq("id", data.venue_id).maybeSingle();
    const j = journal[slug];
    if (!j || j.at !== "2026-11-11") throw new Error(`${slug}: entrée de journal du 2026-11-11 absente`);
    writeFileSync(
      `${DIR}/input/${slug}.json`,
      JSON.stringify(
        {
          fiche: { ...data, venue_slug: v?.slug ?? null },
          previous_edition: { ...j.from, ...before },
          roll_source_url: j.source_url,
          roll_quote: j.reasons[0],
          roll_notes: before.note,
        },
        null,
        2,
      ),
    );
    console.log(`${slug} : ${data.start_date} -> ${data.end_date} | ${data.venue} (${v?.slug}) | MDX ${data.editorial_mdx?.length ?? 0} c`);
  }
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
    sb.from("sectors").select("slug"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
  writeFileSync(
    `${DIR}/published-slugs.json`,
    JSON.stringify(
      { salons: s.data!.map((r) => r.slug).sort(), lieux: v.data!.map((r) => r.slug).sort(), secteurs: sec.data!.map((r) => r.slug).sort() },
      null,
      2,
    ),
  );
  console.log("export OK");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
