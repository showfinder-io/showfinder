// Corrections de données du 2026-11-11 (todo : « Suites website_url » et
// « Signalements hors lot »), demandées par Julien.
//
// 1. salon-habitat-design-saint-etienne : venue_lat / venue_lng valaient
//    45.7275 / 4.952, soit Eurexpo Lyon (Chassieu). Le salon se tient au Parc
//    des Expositions de Saint-Étienne, 31 boulevard Jules Janin. Coordonnées
//    Nominatim du 2026-11-11 pour cette adresse (objet « Saint-Étienne Parc
//    Expo », type exhibition_centre) : 45.4492573 / 4.3961651. Le lieu
//    parc-expo-saint-etienne n'avait aucune coordonnée : mêmes valeurs.
//
// 2. paris-design-week : https://www.parisdesignweek.fr est en erreur TLS
//    (« unrecognized name », le certificat ne couvre pas le domaine). Le
//    domaine officiel répond en http par un 301 vers
//    https://www.maison-objet.com/paris-design-week (relevé le 2026-11-11).
//    Le contenu de la cible n'a pas pu être relu : Incapsula bloque curl et le
//    navigateur piloté. La preuve retenue est la redirection posée par
//    l'organisateur sur son propre domaine.
//
// salon-alpin : rien à corriger. salonalpin.com annonce « du 9 au 12 novembre
// 2026 » (meta description relevée le 2026-11-11), comme la fiche. Le
// « Octobre 2026 » signalé était une étiquette d'actualité.
//
// Idempotent : chaque écriture est conditionnée à l'ancienne valeur.
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-corrections-2026-11-11-apply.ts [--apply]

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}
const sb = createClient(url, key);
const APPLY = process.argv.includes("--apply");

const LAT = 45.4492573;
const LNG = 4.3961651;
const OLD_LAT = 45.7275;
const OLD_LNG = 4.952;
const OLD_URL = "https://www.parisdesignweek.fr";
const NEW_URL = "https://www.maison-objet.com/paris-design-week";

async function fixSaintEtienneSalon() {
  const slug = "salon-habitat-design-saint-etienne";
  const { data, error } = await sb.from("salons").select("slug, venue_lat, venue_lng").eq("slug", slug).single();
  if (error) throw error;
  console.log(`[${slug}] avant :`, data);
  if (data.venue_lat === LAT && data.venue_lng === LNG) return console.log("  déjà corrigé.");
  if (data.venue_lat !== OLD_LAT || data.venue_lng !== OLD_LNG) return console.log("  état inattendu, rien fait.");
  if (!APPLY) return console.log(`  dry-run : ${OLD_LAT} / ${OLD_LNG} -> ${LAT} / ${LNG}`);
  const { data: after, error: upErr } = await sb
    .from("salons")
    .update({ venue_lat: LAT, venue_lng: LNG })
    .eq("slug", slug)
    .eq("venue_lat", OLD_LAT)
    .eq("venue_lng", OLD_LNG)
    .select("slug, venue_lat, venue_lng")
    .single();
  if (upErr) throw upErr;
  console.log("  après :", after);
}

async function fixSaintEtienneVenue() {
  const slug = "parc-expo-saint-etienne";
  const { data, error } = await sb.from("venues").select("slug, address, lat, lng").eq("slug", slug).single();
  if (error) throw error;
  console.log(`[lieu ${slug}] avant :`, data);
  if (data.lat === LAT && data.lng === LNG) return console.log("  déjà corrigé.");
  if (data.lat !== null || data.lng !== null) return console.log("  état inattendu, rien fait.");
  if (!APPLY) return console.log(`  dry-run : null / null -> ${LAT} / ${LNG}`);
  const { data: after, error: upErr } = await sb
    .from("venues")
    .update({ lat: LAT, lng: LNG })
    .eq("slug", slug)
    .is("lat", null)
    .is("lng", null)
    .select("slug, lat, lng")
    .single();
  if (upErr) throw upErr;
  console.log("  après :", after);
}

async function fixParisDesignWeek() {
  const slug = "paris-design-week";
  const { data, error } = await sb
    .from("salons")
    .select("slug, website_url, editorial_mdx, editorial_mdx_en")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  // Constat seulement : les mentions dans le MDX passent par le process writer + reviewers.
  const count = (s: string | null) => (s ?? "").split("parisdesignweek.fr").length - 1;
  console.log(`[${slug}] avant :`, {
    website_url: data.website_url,
    mentions_mdx_fr: count(data.editorial_mdx),
    mentions_mdx_en: count(data.editorial_mdx_en),
  });
  if (data.website_url === NEW_URL) return console.log("  déjà corrigé.");
  if (data.website_url !== OLD_URL) return console.log("  état inattendu, rien fait.");
  if (!APPLY) return console.log(`  dry-run : ${OLD_URL} -> ${NEW_URL}`);
  const { data: after, error: upErr } = await sb
    .from("salons")
    .update({ website_url: NEW_URL })
    .eq("slug", slug)
    .eq("website_url", OLD_URL)
    .select("slug, website_url")
    .single();
  if (upErr) throw upErr;
  console.log("  après :", after);
}

async function main() {
  console.log(APPLY ? "MODE APPLY" : "MODE DRY-RUN");
  await fixSaintEtienneSalon();
  await fixSaintEtienneVenue();
  await fixParisDesignWeek();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
