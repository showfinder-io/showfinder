/**
 * Chantier couverture lieux (2026-06-12). Idempotent : rejouer = 0 ligne.
 *
 * 1. Fusion du doublon venues grand-palais-paris -> grand-palais (même
 *    adresse, le second porte le MDX) : repointage des salons puis delete.
 * 2. Rapprochement venue_id : salons publiés dont le champ venue (texte)
 *    correspond à une fiche lieu existante mais venue_id null. Le texte
 *    venue est aligné sur le nom canonique de la fiche.
 * 3. Création des fiches lieux manquantes (nom + ville + pays uniquement :
 *    données vérifiables, pas de stats fabriquées -> les fiches restent
 *    noindex tant qu'elles ne sont pas enrichies), puis liaison des salons.
 * 4. Sites non pérennes ignorés volontairement (plein champ, camps,
 *    hôtels, "divers lieux") : liste SKIPS, le texte reste tel quel.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-venues-coverage-apply.ts
 */
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

// Texte venue (tel qu'en base, trimé) -> slug de fiche lieu EXISTANTE
const LINK_TO_EXISTING: Record<string, string> = {
  "Palais des Congrès": "palais-des-congres-paris",
  "Centre de Congrès de Lyon": "centre-de-congres-de-lyon",
  "Eurexpo Lyon": "eurexpo-lyon",
  "Paris Expo Porte de Versailles": "paris-expo-porte-de-versailles",
  "Parc des Expositions de Montpellier": "parc-expositions-montpellier",
  "Parc des Expositions de la Beaujoire": "parc-des-expositions-de-nantes",
  "Parc Expo Angers": "parc-expo-angers",
  "Parc des Expositions d'Angers": "parc-expo-angers",
  "Grande Halle de la Villette": "grande-halle-villette",
};

// Fiches lieux à créer : slug -> { name, city, country, textes venue rattachés }
const CREATE_VENUES: Record<
  string,
  { name: string; city: string; country: string; texts: string[] }
> = {
  // France
  "cite-des-congres-nantes": {
    name: "Cité des Congrès de Nantes",
    city: "Nantes",
    country: "FR",
    texts: ["Cité des Congrès de Nantes"],
  },
  "palais-des-festivals-cannes": {
    name: "Palais des Festivals de Cannes",
    city: "Cannes",
    country: "FR",
    texts: ["Palais des Festivals de Cannes", "Palais des Festivals"],
  },
  "palais-de-tokyo": {
    name: "Palais de Tokyo",
    city: "Paris",
    country: "FR",
    texts: ["Palais de Tokyo"],
  },
  "paris-la-defense-arena": {
    name: "Paris La Défense Arena",
    city: "Nanterre",
    country: "FR",
    texts: ["Paris La Défense Arena", "Paris La Defense Arena"],
  },
  "halle-tony-garnier": {
    name: "Halle Tony Garnier",
    city: "Lyon",
    country: "FR",
    texts: ["Halle Tony Garnier"],
  },
  "palais-musique-congres-strasbourg": {
    name: "Palais de la Musique et des Congrès",
    city: "Strasbourg",
    country: "FR",
    texts: [
      "Palais de la Musique et des Congrès",
      "Centre de Congrès de Strasbourg",
    ],
  },
  "centre-des-congres-reims": {
    name: "Centre des Congrès de Reims",
    city: "Reims",
    country: "FR",
    texts: ["Centre des Congrès de Reims"],
  },
  "parc-expo-chalons": {
    name: "Parc des Expositions de Châlons-en-Champagne",
    city: "Chalons-en-Champagne",
    country: "FR",
    texts: ["Parc des Expositions de Chalons"],
  },
  "palais-du-lac-vichy": {
    name: "Palais du Lac",
    city: "Vichy",
    country: "FR",
    texts: ["Palais du Lac Vichy"],
  },
  "espace-champerret": {
    name: "Espace Champerret",
    city: "Paris",
    country: "FR",
    texts: ["Espace Champerret"],
  },
  "palais-brongniart": {
    name: "Palais Brongniart",
    city: "Paris",
    country: "FR",
    texts: ["Palais Brongniart"],
  },
  "parc-equestre-federal": {
    name: "Parc Équestre Fédéral",
    city: "Lamotte-Beuvron",
    country: "FR",
    texts: ["Parc Equestre Federal"],
  },
  "gayant-expo-douai": {
    name: "Gayant Expo Douai",
    city: "Douai",
    country: "FR",
    texts: ["Gayant Expo Douai"],
  },
  "micropolis-besancon": {
    name: "Micropolis Besançon",
    city: "Besancon",
    country: "FR",
    texts: ["Micropolis Besançon"],
  },
  "parc-expo-tarbes": {
    name: "Parc des Expositions de Tarbes",
    city: "Tarbes",
    country: "FR",
    texts: ["Parc des Expositions de Tarbes"],
  },
  "maison-de-la-mutualite": {
    name: "Maison de la Mutualité",
    city: "Paris",
    country: "FR",
    texts: ["Maison de la Mutualité"],
  },
  "palais-du-pharo": {
    name: "Palais du Pharo",
    city: "Marseille",
    country: "FR",
    texts: ["Palais du Pharo"],
  },
  "parc-floral-de-paris": {
    name: "Parc Floral de Paris",
    city: "Paris",
    country: "FR",
    texts: ["Parc Floral de Paris"],
  },
  // International (salons étrangers assumés, décision 2026-06-11)
  "messe-munchen": {
    name: "Messe München",
    city: "Munich",
    country: "DE",
    texts: ["Messe München"],
  },
  "grimaldi-forum": {
    name: "Grimaldi Forum",
    city: "Monaco",
    country: "MC",
    texts: ["Grimaldi Forum"],
  },
  "messe-frankfurt": {
    name: "Messe Frankfurt",
    city: "Francfort",
    country: "DE",
    texts: ["Messe Frankfurt"],
  },
  "messe-dusseldorf": {
    name: "Messe Düsseldorf",
    city: "Düsseldorf",
    country: "DE",
    texts: ["Messe Düsseldorf"],
  },
  "messe-essen": {
    name: "Messe Essen",
    city: "Essen",
    country: "DE",
    texts: ["Messe Essen"],
  },
  "messe-stuttgart": {
    name: "Messe Stuttgart",
    city: "Stuttgart",
    country: "DE",
    texts: ["Messe Stuttgart"],
  },
  "deutsche-messe-hannover": {
    name: "Deutsche Messe",
    city: "Hanovre",
    country: "DE",
    texts: ["Deutsche Messe"],
  },
  "fira-barcelona-gran-via": {
    name: "Fira Barcelona Gran Via",
    city: "Barcelone",
    country: "ES",
    texts: ["Fira Barcelona Gran Via"],
  },
  "fil-lisboa": {
    name: "FIL Lisboa",
    city: "Lisbonne",
    country: "PT",
    texts: ["FIL Lisboa"],
  },
  "las-vegas-convention-center": {
    name: "Las Vegas Convention Center",
    city: "Las Vegas",
    country: "US",
    texts: ["Las Vegas Convention Center"],
  },
  "dubai-world-trade-centre": {
    name: "Dubai World Trade Centre",
    city: "Dubaï",
    country: "AE",
    texts: ["Dubai World Trade Centre"],
  },
  "austria-center-vienna": {
    name: "Austria Center Vienna",
    city: "Vienne",
    country: "AT",
    texts: ["Austria Center Vienna"],
  },
};

// Sites non pérennes : pas de fiche lieu, texte conservé tel quel
const SKIPS = [
  "Site de plein champ",
  "Site de plein air",
  "Site de l'EPLEFPA",
  "Camp de Souge",
  "Divers lieux Paris",
  "Sofitel Abidjan",
];

async function venueIdBySlug(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from("venues")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data?.id ?? null;
}

async function linkSalons(
  venueText: string,
  venueId: string,
  canonicalName: string
): Promise<number> {
  const { data, error } = await supabase
    .from("salons")
    .update({ venue_id: venueId, venue: canonicalName } as never)
    .eq("venue", venueText)
    .is("venue_id", null)
    .select("slug");
  if (error) throw error;
  return (data ?? []).length;
}

async function main() {
  // 1. Fusion grand-palais-paris -> grand-palais
  const dupId = await venueIdBySlug("grand-palais-paris");
  if (dupId) {
    const keepId = await venueIdBySlug("grand-palais");
    if (!keepId) throw new Error("grand-palais introuvable, fusion annulée");
    const { data: moved, error: mvErr } = await supabase
      .from("salons")
      .update({ venue_id: keepId } as never)
      .eq("venue_id", dupId)
      .select("slug");
    if (mvErr) throw mvErr;
    const { error: delErr } = await supabase
      .from("venues")
      .delete()
      .eq("id", dupId);
    if (delErr) throw delErr;
    console.log(
      `1. Fusion grand-palais-paris -> grand-palais : ${(moved ?? []).length} salon(s) repointé(s), doublon supprimé`
    );
  } else {
    console.log("1. Fusion grand-palais : déjà faite (0 ligne)");
  }

  // 2. Rapprochements vers fiches existantes
  let linked = 0;
  for (const [text, slug] of Object.entries(LINK_TO_EXISTING)) {
    const id = await venueIdBySlug(slug);
    if (!id) {
      console.error(`  fiche ${slug} introuvable, skip "${text}"`);
      continue;
    }
    const { data: v } = await supabase
      .from("venues")
      .select("name")
      .eq("id", id)
      .single();
    const n = await linkSalons(text, id, v?.name ?? text);
    if (n > 0) console.log(`  "${text}" -> ${slug} : ${n} salon(s)`);
    linked += n;
  }
  console.log(`2. Rapprochements vers fiches existantes : ${linked} salon(s)`);

  // 3. Créations + liaisons
  let created = 0;
  let linkedNew = 0;
  for (const [slug, def] of Object.entries(CREATE_VENUES)) {
    let id = await venueIdBySlug(slug);
    if (!id) {
      const { data, error } = await supabase
        .from("venues")
        .insert({
          slug,
          name: def.name,
          city: def.city,
          country: def.country,
        } as never)
        .select("id")
        .single();
      if (error) throw error;
      id = (data as { id: string }).id;
      created++;
    }
    for (const text of def.texts) {
      linkedNew += await linkSalons(text, id, def.name);
    }
  }
  console.log(`3. Fiches lieux créées : ${created} ; salons liés : ${linkedNew}`);
  console.log(`4. Sites ignorés volontairement : ${SKIPS.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
