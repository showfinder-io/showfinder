/**
 * Passe CTR (2026-08-03) : seo_title + seo_description pour 24 fiches à fortes
 * impressions GSC (baseline 2026-07-28) qui tombaient sur le fallback générique
 * "Nom Année". Textes composés uniquement depuis les champs DB vérifiés
 * (dates, lieu, ville, exposants, visiteurs, description éditoriale).
 * Garde-fous : n'écrase jamais un seo_title existant différent ; vérifie que
 * les dates DB correspondent aux dates citées dans les textes avant d'écrire.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-ctr-pass-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

type Entry = { start: string; end: string; seo_title: string; seo_description: string };

// Les dates start/end servent de verrou : si la fiche a bougé en DB depuis la
// rédaction (roll d'édition), on saute la fiche au lieu d'écrire un texte périmé.
const ENTRIES: Record<string, Entry> = {
  "artibat-rennes": {
    start: "2027-10-20", end: "2027-10-22",
    seo_title: "Artibat 2027 Rennes : dates (20-22 octobre), exposants, accès",
    seo_description: "Artibat 2027, salon de la construction du Grand Ouest, du 20 au 22 octobre au Parc des Expositions de Rennes Aéroport. 1 100 exposants, 45 000 visiteurs attendus.",
  },
  "cfia-rennes": {
    start: "2027-03-09", end: "2027-03-11",
    seo_title: "CFIA Rennes 2027 : dates (9-11 mars), exposants, infos pratiques",
    seo_description: "CFIA Rennes 2027, le carrefour des fournisseurs de l'agroalimentaire, du 9 au 11 mars au Parc Expo de Rennes. 2 000 exposants : ingrédients, équipements, emballage.",
  },
  "changenow-paris": {
    start: "2027-04-26", end: "2027-04-28",
    seo_title: "ChangeNOW 2027 Paris : dates (26-28 avril), Grand Palais, infos",
    seo_description: "ChangeNOW 2027 au Grand Palais, Paris, du 26 au 28 avril. 380 exposants, 40 000 visiteurs attendus. Dates, lieu, accès et infos pratiques sur Agoris.",
  },
  "equipbaie-metalexpo-paris": {
    start: "2026-09-28", end: "2026-10-01",
    seo_title: "Equipbaie Metalexpo 2026 : dates, exposants, Porte de Versailles",
    seo_description: "Equipbaie Metalexpo 2026, salon de la fenêtre, de la fermeture et de la métallerie, du 28 septembre au 1er octobre à Paris Expo Porte de Versailles. 311 exposants.",
  },
  "euronaval-paris": {
    start: "2026-11-03", end: "2026-11-06",
    seo_title: "Euronaval 2026 : dates (3-6 novembre), lieu, exposants | Paris",
    seo_description: "Euronaval 2026, salon international de la défense navale, du 3 au 6 novembre à Paris Nord Villepinte. 500 exposants, 25 000 visiteurs attendus. Infos pratiques.",
  },
  "europack-euromanut-lyon": {
    start: "2027-11-16", end: "2027-11-18",
    seo_title: "Prod&Pack 2027 Lyon (ex-Europack Euromanut) : dates et infos",
    seo_description: "Prod&Pack 2027, salon de l'emballage, de la manutention et du process industriel, du 16 au 18 novembre à Eurexpo Lyon. 750 exposants attendus. Dates, accès, infos.",
  },
  "expoprotection": {
    start: "2026-11-03", end: "2026-11-05",
    seo_title: "Expoprotection 2026 : dates (3-5 novembre), Porte de Versailles",
    seo_description: "Expoprotection 2026, le salon de la prévention et de la gestion des risques, du 3 au 5 novembre à Paris Expo Porte de Versailles. 660 exposants, 14 500 visiteurs.",
  },
  "iftm-top-resa": {
    start: "2026-09-15", end: "2026-09-17",
    seo_title: "IFTM Top Resa 2026 : dates (15-17 septembre), lieu, exposants",
    seo_description: "IFTM Top Resa 2026, le salon professionnel du tourisme, du 15 au 17 septembre à Paris Expo Porte de Versailles. 1 700 exposants, 34 000 visiteurs. Infos pratiques.",
  },
  "japan-expo-paris": {
    start: "2026-07-09", end: "2026-07-12",
    seo_title: "Japan Expo Paris 2026 : dates, lieu et infos pratiques",
    seo_description: "Japan Expo, le rendez-vous européen de la culture japonaise à Paris Nord Villepinte. Édition 2026 du 9 au 12 juillet : 800 exposants, 230 000 visiteurs.",
  },
  "je-m-export-paris": {
    start: "2027-04-28", end: "2027-04-29",
    seo_title: "Go Entrepreneurs Paris 2027 : dates (28-29 avril), infos, accès",
    seo_description: "Go Entrepreneurs 2027, le salon de l'entrepreneuriat et de la création d'entreprise, les 28 et 29 avril à Paris La Défense Arena. 400 exposants, 25 000 visiteurs.",
  },
  "les-thermalies-paris": {
    start: "2027-01-21", end: "2027-01-24",
    seo_title: "Les Thermalies 2027 : dates (21-24 janvier), Carrousel du Louvre",
    seo_description: "Les Thermalies 2027, le salon de l'eau et du bien-être (thermalisme, thalasso, spa), du 21 au 24 janvier au Carrousel du Louvre à Paris. 250 exposants attendus.",
  },
  "mif-expo": {
    start: "2026-11-12", end: "2026-11-15",
    seo_title: "MIF Expo 2026, Salon du Made in France : dates (12-15 novembre)",
    seo_description: "MIF Expo 2026, le Salon du Made in France, du 12 au 15 novembre à Paris Expo Porte de Versailles. 1 000 exposants, 110 000 visiteurs. Dates, lieu et infos pratiques.",
  },
  "milipol-paris": {
    start: "2027-11-16", end: "2027-11-19",
    seo_title: "Milipol Paris 2027 : dates (16-19 novembre), lieu et exposants",
    seo_description: "Milipol Paris 2027, salon mondial de la sûreté et de la sécurité intérieure des États, du 16 au 19 novembre à Paris Nord Villepinte. 1 100 exposants, 30 000 visiteurs.",
  },
  "paris-design-week": {
    start: "2026-09-10", end: "2026-09-19",
    seo_title: "Paris Design Week 2026 : dates (10-19 septembre), lieux, infos",
    seo_description: "Paris Design Week 2026, le festival du design dans les showrooms et galeries de Paris, du 10 au 19 septembre. 250 000 visiteurs attendus. Dates, parcours et infos.",
  },
  "paris-games-week": {
    start: "2026-10-22", end: "2026-10-25",
    seo_title: "Paris Games Week 2026 : dates (22-25 octobre), lieu, infos",
    seo_description: "Paris Games Week 2026, le salon du jeu vidéo, du 22 au 25 octobre à Paris Expo Porte de Versailles. 180 exposants, 161 000 visiteurs, volet pro PGW Business.",
  },
  "paris-photo": {
    start: "2026-11-12", end: "2026-11-15",
    seo_title: "Paris Photo 2026 : dates (12-15 novembre), Grand Palais, infos",
    seo_description: "Paris Photo 2026, la foire internationale de la photographie, du 12 au 15 novembre au Grand Palais. 170 galeries, 87 275 visiteurs en 2025. Dates et infos pratiques.",
  },
  "paysalia-lyon": {
    start: "2027-11-30", end: "2027-12-02",
    seo_title: "Paysalia 2027 Lyon : dates (30 nov-2 déc), exposants, infos",
    seo_description: "Paysalia 2027, le salon du paysage et de l'aménagement extérieur, du 30 novembre au 2 décembre à Eurexpo Lyon. 1 019 exposants, 41 500 visiteurs. Infos pratiques.",
  },
  "siae-le-bourget": {
    start: "2027-06-14", end: "2027-06-20",
    seo_title: "Salon du Bourget 2027 (SIAE) : dates (14-20 juin), infos, accès",
    seo_description: "Salon International de l'Aéronautique et de l'Espace 2027, du 14 au 20 juin au Bourget. Le plus grand salon aéronautique au monde : 2 500 exposants, 300 000 visiteurs.",
  },
  "sibca-paris": {
    start: "2026-09-01", end: "2026-09-03",
    seo_title: "SIBCA 2026 : dates (1-3 septembre), Grand Palais, exposants",
    seo_description: "SIBCA 2026, le Salon de l'Immobilier Bas Carbone, du 1er au 3 septembre au Grand Palais à Paris. 200 exposants, 12 725 visiteurs. Dates, programme et infos pratiques.",
  },
  "sival-angers": {
    start: "2027-01-12", end: "2027-01-14",
    seo_title: "SIVAL 2027 Angers : dates (12-14 janvier), exposants, infos",
    seo_description: "SIVAL 2027, le salon des productions végétales spécialisées (viti, arbo, maraîchage), du 12 au 14 janvier au Parc des Expositions d'Angers. 700 exposants, 24 000 visiteurs.",
  },
  "smcl": {
    start: "2026-11-24", end: "2026-11-26",
    seo_title: "Salon des Maires 2026 (SMCL) : dates (24-26 novembre), infos",
    seo_description: "Salon des Maires et des Collectivités Locales 2026, du 24 au 26 novembre à Paris Expo Porte de Versailles, avec le Congrès des Maires. 1 380 exposants, 65 672 visiteurs.",
  },
  "solutions-rh": {
    start: "2027-06-09", end: "2027-06-10",
    seo_title: "Solutions RH 2027 : dates (9-10 juin), Porte de Versailles",
    seo_description: "Solutions RH 2027, le salon des ressources humaines (SIRH, formation, conseil), les 9 et 10 juin à Paris Expo Porte de Versailles. 250 exposants, 9 140 visiteurs.",
  },
  "sommet-elevage-clermont": {
    start: "2026-10-06", end: "2026-10-09",
    seo_title: "Sommet de l'Élevage 2026 : dates (6-9 octobre), Clermont-Ferrand",
    seo_description: "Sommet de l'Élevage 2026, premier salon européen de l'élevage, du 6 au 9 octobre à la Grande Halle d'Auvergne, Clermont-Ferrand. 1 500 exposants, 95 000 visiteurs.",
  },
  "whos-next-paris": {
    start: "2026-09-05", end: "2026-09-07",
    seo_title: "Who's Next 2026 : dates (5-7 septembre), Porte de Versailles",
    seo_description: "Who's Next 2026, le salon de la mode féminine prêt-à-porter, du 5 au 7 septembre à Paris Expo Porte de Versailles. 1 200 marques, 38 000 visiteurs. Infos pratiques.",
  },
};

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let updated = 0, skipped = 0;

  for (const [slug, e] of Object.entries(ENTRIES)) {
    const { data: row, error } = await sb
      .from("salons")
      .select("slug,start_date,end_date,seo_title")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (!row) { console.log(`SKIP ${slug}: fiche introuvable`); skipped++; continue; }

    if (row.start_date !== e.start || row.end_date !== e.end) {
      console.log(`SKIP ${slug}: dates DB (${row.start_date} → ${row.end_date}) != texte (${e.start} → ${e.end}), fiche rollée depuis la rédaction`);
      skipped++; continue;
    }
    if (row.seo_title && row.seo_title !== e.seo_title) {
      console.log(`SKIP ${slug}: seo_title déjà renseigné ("${row.seo_title.slice(0, 50)}"), pas d'écrasement`);
      skipped++; continue;
    }

    console.log(`UPDATE ${slug}: ${e.seo_title}`);
    if (APPLY) {
      const { error: upErr } = await sb
        .from("salons")
        .update({ seo_title: e.seo_title, seo_description: e.seo_description } as never)
        .eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
    updated++;
  }

  console.log(`\n${APPLY ? "APPLIQUÉ" : "DRY-RUN"} : ${updated} mises à jour, ${skipped} sautées`);
}

main().catch((e) => { console.error(e); process.exit(1); });
