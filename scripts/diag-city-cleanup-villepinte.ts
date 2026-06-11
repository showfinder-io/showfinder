// Cleanup data salons.city : convention city="Paris" pour le parc
// Paris Nord Villepinte (audit SEO 2026-06-11).
//
// Contexte : les pages /villes/[slug] entrent dans le sitemap si la ville
// a >= 3 salons publiés (CITY_INDEX_MIN_SALONS). "Villepinte" comme city
// crée une page ville parasite : le lieu précis est déjà porté par
// venue_id -> /lieux/paris-nord-villepinte.
//
// Corrections appliquées (idempotent, relançable sans effet de bord) :
// 1. city "Villepinte" -> "Paris" pour les 6 salons du parc
// 2. intermat-paris-2027 : venue_id manquant -> Paris Nord Villepinte
// 3. midest-2026 : venue texte resté "Paris Nord Villepinte" alors que la
//    migration 20260530000000 a basculé la fiche sur GI Lyon 2027
//    (city=Lyon, venue_id=eurexpo-lyon, dates 15-18/03/2027) -> "Eurexpo Lyon"
// 4. jec-world-paris-2026 : la fiche porte l'édition 2027 (2-4 mars 2027,
//    source jec-world.events) mais son slug dit 2026 et son URL est shadowée
//    par le 301 jec-world-paris-2026 -> jec-world-2026 (next.config.ts).
//    Slug renommé en jec-world-paris-2027 + end_date corrigée (03-05 -> 03-04).
// 5. maison-et-objet-paris-2026 : PAS un doublon de maison-objet-paris-2026
//    (Pulse, édition septembre) mais l'édition janvier 2026, passée et
//    inaccessible (shadowée par le 301 de l'audit 2026-06-01). Passée en
//    draft, le redirect existant reste en place.
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/diag-city-cleanup-villepinte.ts

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

const PARIS_NORD_VILLEPINTE_VENUE_ID = "ebf5c5f3-b0d0-45e7-b622-fe9626c8ac40";

const VILLEPINTE_SLUGS = [
  "comic-con-france-2026",
  "intermat-paris-2027",
  "japan-expo-paris-2026",
  "jec-world-2026",
  "maison-objet-paris-2026",
  "sitl-2026",
];

type Step = {
  label: string;
  run: () => Promise<{ updated: number; detail?: string }>;
};

async function updateBySlug(
  slug: string,
  patch: Record<string, unknown>,
  onlyIf?: Record<string, unknown>
): Promise<number> {
  let query = supabase.from("salons").update(patch).eq("slug", slug);
  for (const [key, value] of Object.entries(onlyIf ?? {})) {
    query = query.eq(key, value as never);
  }
  const { data, error } = await query.select("slug");
  if (error) throw new Error(`${slug} : ${error.message}`);
  return data?.length ?? 0;
}

const steps: Step[] = [
  {
    label: '1. city "Villepinte" -> "Paris" (6 salons du parc)',
    run: async () => {
      const { data, error } = await supabase
        .from("salons")
        .update({ city: "Paris" })
        .in("slug", VILLEPINTE_SLUGS)
        .eq("city", "Villepinte")
        .select("slug");
      if (error) throw new Error(error.message);
      return {
        updated: data?.length ?? 0,
        detail: (data ?? []).map((r) => r.slug).join(", "),
      };
    },
  },
  {
    label: "2. intermat-paris-2027 : venue_id -> Paris Nord Villepinte",
    run: async () => {
      const { data, error } = await supabase
        .from("salons")
        .update({ venue_id: PARIS_NORD_VILLEPINTE_VENUE_ID })
        .eq("slug", "intermat-paris-2027")
        .is("venue_id", null)
        .select("slug");
      if (error) throw new Error(error.message);
      return { updated: data?.length ?? 0 };
    },
  },
  {
    label: '3. midest-2026 : venue texte -> "Eurexpo Lyon"',
    run: async () => ({
      updated: await updateBySlug(
        "midest-2026",
        { venue: "Eurexpo Lyon" },
        { venue: "Paris Nord Villepinte" }
      ),
    }),
  },
  {
    label:
      "4. jec-world-paris-2026 -> jec-world-paris-2027 (édition 2027, 2-4 mars)",
    run: async () => ({
      updated: await updateBySlug(
        "jec-world-paris-2026",
        { slug: "jec-world-paris-2027", end_date: "2027-03-04" },
        { edition_year: 2027 }
      ),
    }),
  },
  {
    label:
      "5. maison-et-objet-paris-2026 (édition janvier, shadowée) -> draft",
    run: async () => ({
      updated: await updateBySlug(
        "maison-et-objet-paris-2026",
        { status: "draft" },
        { status: "published" }
      ),
    }),
  },
];

async function main() {
  let total = 0;
  for (const step of steps) {
    const { updated, detail } = await step.run();
    total += updated;
    console.log(
      `${step.label} : ${updated} ligne(s)${detail ? ` [${detail}]` : ""}`
    );
  }
  console.log(`\nTotal : ${total} ligne(s) modifiée(s).`);

  // Contrôle final : plus aucun salon publié avec city=Villepinte
  const { count } = await supabase
    .from("salons")
    .select("slug", { count: "exact", head: true })
    .eq("city", "Villepinte")
    .eq("status", "published");
  console.log(`Contrôle : salons publiés avec city=Villepinte : ${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
