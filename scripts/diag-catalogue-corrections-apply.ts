/**
 * Application audit catalogue passé passe 2 (2026-06-13). Dry-run par défaut ; --apply.
 * - 5 venues créées (vierges, session venues ultérieure)
 * - ~20 dépublications (fantômes + 3 doublons) : status draft, 301 dans next.config
 * - 21 corrections (villes/dates/venues/noms), 6 renommages de slug (+301),
 *   dates_confirmed=false où l'édition n'est pas datée
 * Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-catalogue-corrections-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const VENUES_CREATE = [
  { slug: "parc-expo-saint-etienne", name: "Parc des Expositions de Saint-Étienne", city: "Saint-Étienne", country: "FR" },
  { slug: "faculte-medecine-strasbourg", name: "Faculté de Médecine de Strasbourg", city: "Strasbourg", country: "FR" },
  { slug: "expo-greater-amsterdam", name: "Expo Greater Amsterdam", city: "Vijfhuizen", country: "NL" },
  { slug: "palais-expo-jacques-chirac-valence", name: "Palais des Expositions Jacques Chirac", city: "Valence", country: "FR" },
  { slug: "parc-expo-iliade-chartres", name: "Parc des Expositions L'Iliade", city: "Chartres", country: "FR" },
];

// Dépublications : slug -> cible 301 (null = pas de redirect)
const DRAFTS: Record<string, string | null> = {
  "shieldafrica-abidjan": "/secteurs/defense-securite",
  "flame-expo-lyon": "/secteurs/energie-environnement",
  "fatex-paris": "/salons/texworld-paris",
  "salon-des-enr-paris": "/secteurs/energie-environnement",
  "blc-bordeaux": "/villes/bordeaux",
  "cersaie-paris-showroom": "/salons/ideobain",
  "emm-lyon": "/salons/global-industrie-lyon",
  "conext-paris": "/secteurs/franchise-commerce",
  "talent-management-paris": "/secteurs/rh-formation",
  "mdd-expo-paris": "/secteurs/agroalimentaire",
  "salon-analyse-industrielle-paris": "/secteurs/industrie",
  "measurement-world-paris": "/salons/global-industrie-lyon",
  "expodefensa-paris": "/secteurs/defense-securite",
  "intralogistics-france": "/salons/sitl",
  "cosmeeting-paris": "/secteurs/cosmetique-beaute",
  "medica-france-forum": "/secteurs/sante-pharma",
  "sirha-green-lyon": "/salons/sirha-lyon",
  "rsi-reims": "/villes/reims",
  "salon-data-ai-paris": "/salons/big-data-ai-paris", // doublon
  "sial-inspire-food-business": "/salons/sial-paris", // doublon
  "cycl-eau-strasbourg": null, // pas d'édition Strasbourg 2026 (itinérant)
};

// Corrections (champs). venue_slug -> venue_id.
const CORR: Record<string, Record<string, unknown>> = {
  "cosmetagora-paris": { venue: "Espace Champerret", venue_slug: "espace-champerret" },
  "adf-pcd-paris": { start_date: "2026-02-05", end_date: "2026-02-06" },
  "pcd-congress-paris": { start_date: "2026-02-05", end_date: "2026-02-06", website_url: "https://www.parispackagingweek.com/en/pcd/", name: "PCD Paris" },
  "restau-co-paris": { start_date: "2026-06-17", end_date: "2026-06-17" },
  "salon-bois-energie": { city: "Nantes", venue: "Parc des Expositions de Nantes", venue_slug: "parc-des-expositions-de-nantes", start_date: "2026-02-11", end_date: "2026-02-12" },
  "elearning-expo-paris": { name: "Innovative Learning by eLearning Expo", start_date: "2026-04-08", end_date: "2026-04-09", website_url: "https://www.innovative-learning.fr" },
  "sepem-douai": { start_date: "2028-01-25", end_date: "2028-01-27", edition_year: 2028, name: "SEPEM Industries Nord" },
  "sepem-colmar": { start_date: "2027-09-21", end_date: "2027-09-23", edition_year: 2027 },
  "3d-print-lyon": { start_date: "2026-06-02" },
  "world-of-concrete-europe-paris": { edition_year: 2027, start_date: "2027-04-21", end_date: "2027-04-24", dates_confirmed: false },
  "hlt-paris": { venue: "Paris Expo Porte de Versailles", venue_slug: "paris-expo-porte-de-versailles", name: "Salon HIT", website_url: "https://www.parishealthcareweek.com/levenement/salon-hit/" },
  "sepag": { city: "Valence", venue: "Palais des Expositions Jacques Chirac", venue_slug: "palais-expo-jacques-chirac-valence", start_date: "2026-04-21", end_date: "2026-04-22" },
  "salon-herbe-villefranche": { name: "Salon de l'Herbe et des Fourrages", website_url: "https://www.salonherbe.com/", city: "Poussay", venue: "Site de plein champ", start_date: "2026-05-20", end_date: "2026-05-21" },
  "food-hotel-tech-paris": { start_date: "2026-04-14", end_date: "2026-04-15" },
  "untec-congres": { city: "Chartres", venue: "Parc des Expositions L'Iliade", venue_slug: "parc-expo-iliade-chartres", start_date: "2026-06-03", end_date: "2026-06-05" },
  "salon-data-ai-paris-SKIP": {}, // (doublon -> drafts)
};

// Renommages : slug -> { new_slug + champs }
const RENAMES: Record<string, Record<string, unknown>> = {
  "salon-habitat-design-lyon": { new_slug: "salon-habitat-design-saint-etienne", city: "Saint-Étienne", venue: "Parc des Expositions de Saint-Étienne", venue_slug: "parc-expo-saint-etienne", start_date: "2026-03-06", end_date: "2026-03-08", website_url: "https://www.salonhabitatdesign-saintetienne.com" },
  "hacking-health-lyon": { new_slug: "hacking-health-strasbourg", venue: "Faculté de Médecine de Strasbourg", venue_slug: "faculte-medecine-strasbourg", start_date: "2026-03-20", end_date: "2026-03-22" },
  "tech-show-paris": { new_slug: "ready-for-it-monaco", name: "Ready For IT", city: "Monaco", country: "MC", venue: "Grimaldi Forum", venue_slug: "grimaldi-forum", start_date: "2026-06-02", end_date: "2026-06-04" },
  "solar-solutions-international-paris": { new_slug: "solar-solutions-international-amsterdam", city: "Vijfhuizen", country: "NL", venue: "Expo Greater Amsterdam", venue_slug: "expo-greater-amsterdam", start_date: "2026-03-10", end_date: "2026-03-12", website_url: "https://en.solarsolutions.nl/" },
  "cosmed-meeting-marseille": { new_slug: "cfic-marseille", name: "CFIC - Cosmetics Industry Transformation Fair", venue: "Parc Chanot", venue_slug: "parc-chanot-marseille", start_date: "2026-06-09", end_date: "2026-06-10", website_url: "https://www.salon-cfic.com" },
};
delete CORR["salon-data-ai-paris-SKIP"];

async function vid(slug: string): Promise<string | null> {
  const { data } = await sb.from("venues").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}
async function upd(slug: string, patch: Record<string, unknown>) {
  if (!APPLY) return;
  const { error } = await sb.from("salons").update(patch as never).eq("slug", slug);
  if (error) throw new Error(`${slug}: ${error.message}`);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");

  console.log("\n-- venues --");
  for (const v of VENUES_CREATE) {
    if (await vid(v.slug)) { console.log(`  ${v.slug} déjà présent`); continue; }
    console.log(`  CREATE ${v.slug}`);
    if (APPLY) { const { error } = await sb.from("venues").insert(v as never); if (error) throw new Error(v.slug + ": " + error.message); }
  }

  console.log(`\n-- dépublications (${Object.keys(DRAFTS).length}) --`);
  for (const slug of Object.keys(DRAFTS)) {
    console.log(`  DRAFT ${slug}${DRAFTS[slug] ? " -> " + DRAFTS[slug] : ""}`);
    await upd(slug, { status: "draft" });
  }

  console.log(`\n-- corrections (${Object.keys(CORR).length}) --`);
  for (const [slug, c] of Object.entries(CORR)) {
    const { venue_slug, ...fields } = c;
    if (venue_slug) fields.venue_id = await vid(venue_slug as string);
    console.log(`  ${slug}: ${Object.keys(fields).join(", ")}`);
    await upd(slug, fields);
  }

  console.log(`\n-- renommages (${Object.keys(RENAMES).length}) --`);
  for (const [slug, r] of Object.entries(RENAMES)) {
    const exists = await sb.from("salons").select("slug").eq("slug", slug).maybeSingle();
    if (!exists.data) { console.log(`  ${slug} absent (déjà renommé ?)`); continue; }
    const { new_slug, venue_slug, ...fields } = r;
    if (venue_slug) fields.venue_id = await vid(venue_slug as string);
    fields.slug = new_slug;
    console.log(`  ${slug} -> ${new_slug}`);
    await upd(slug, fields);
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
