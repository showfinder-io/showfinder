/**
 * Application des correctifs de l'audit upcoming passe 2 (2026-06-13).
 * Dry-run par défaut ; --apply. Idempotent.
 *
 * - Création des venues manquantes (fiches vierges, à enrichir en session dédiée)
 * - 17 corrections de données (dates/lieu/ville/site/nom), dates_confirmed=false
 *   quand l'édition 2027 n'est pas encore datée (décision Julien : corriger vers
 *   2027 plutôt que dépublier)
 * - 2 renommages de slug (parabere->nice, tech-elevage->la-roche-sur-yon) + 301
 * - 3 dépublications (fantômes) : surf-interieur-biarritz, batibig-nantes, ipa-nantes
 * Redirects 301 dans next.config.ts.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-audit-corrections-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const VENUES_CREATE = [
  { slug: "le-pre-catelan", name: "Le Pré Catelan", city: "Paris", country: "FR" },
  { slug: "cnit-la-defense", name: "CNIT Forest - Paris La Défense", city: "Puteaux", country: "FR" },
  { slug: "h-arena-nantes", name: "H Arena", city: "Nantes", country: "FR" },
  { slug: "ldlc-arena-lyon", name: "LDLC Arena", city: "Décines-Charpieu", country: "FR" },
  { slug: "parc-expo-oudairies-la-roche", name: "Parc des Expositions des Oudairies", city: "La Roche-sur-Yon", country: "FR" },
  { slug: "corum-montpellier", name: "Corum - Palais des Congrès de Montpellier", city: "Montpellier", country: "FR" },
];

// Corrections par slug. venue_slug -> résolu en venue_id. dates_confirmed où noté.
const CORR: Record<string, Record<string, unknown>> = {
  "congres-hr-paris": { start_date: "2026-11-17", end_date: "2026-11-18", venue: "Le Pré Catelan", venue_slug: "le-pre-catelan" },
  "sepem-angers": { start_date: "2027-10-12", end_date: "2027-10-14", edition_year: 2027 },
  "gazelec-paris": { start_date: "2026-10-12", venue: "CNIT Forest - Paris La Défense", venue_slug: "cnit-la-defense" },
  "les-assises-de-la-securite-monaco": { start_date: "2026-10-07", end_date: "2026-10-10" },
  "devfest-nantes": { edition_year: 2027, start_date: "2027-03-11", end_date: "2027-03-12", venue: "H Arena", venue_slug: "h-arena-nantes" },
  "franchise-expo-lyon": { start_date: "2026-10-08", end_date: "2026-10-08", venue: "LDLC Arena", venue_slug: "ldlc-arena-lyon", website_url: "https://www.lyon-franchise.com" },
  "rent": { website_url: "https://paris.rent.immo" },
  "supply-chain-event-paris": { start_date: "2026-12-01", end_date: "2026-12-02" },
  "rh-lyon": { name: "Solutions Ressources Humaines Lyon", website_url: "https://www.salon-srh.com/", edition_year: 2027, dates_confirmed: false },
  "biofit-lille": { city: "Marseille", venue: "Parc Chanot - Palais de l'Europe", venue_slug: "parc-chanot-marseille", start_date: "2026-12-10", end_date: "2026-12-11" },
  "iltm-cannes": { start_date: "2026-11-30", end_date: "2026-12-03" },
  "regal-toulouse": { edition_year: 2027, dates_confirmed: false },
  "tech-and-bio": { dates_confirmed: false },
  "les-assises-dechets-nantes": { start_date: "2026-09-30", end_date: "2026-10-01", edition_year: 2026 },
  "euroviti-montpellier": { website_url: "https://www.vignevin.com/conferences/euroviti/", venue: "Corum - Palais des Congrès de Montpellier", venue_slug: "corum-montpellier", category: "congres", dates_confirmed: false },
};

// Renommages : slug actuel -> { new_slug, + champs }
const RENAMES: Record<string, Record<string, unknown>> = {
  "parabere-forum-paris": { new_slug: "parabere-forum-nice", city: "Nice", dates_confirmed: false },
  "tech-elevage-lamotte-beuvron": { new_slug: "tech-elevage-la-roche-sur-yon", city: "La Roche-sur-Yon", venue: "Parc des Expositions des Oudairies", venue_slug: "parc-expo-oudairies-la-roche", dates_confirmed: false },
};

const DRAFTS = ["surf-interieur-biarritz", "batibig-nantes", "ipa-nantes"];

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
    console.log(`  CREATE ${v.slug} (${v.name}, ${v.city})`);
    if (APPLY) { const { error } = await sb.from("venues").insert(v as never); if (error) throw new Error(v.slug + ": " + error.message); }
  }

  console.log("\n-- corrections --");
  for (const [slug, c] of Object.entries(CORR)) {
    const { venue_slug, ...fields } = c;
    if (venue_slug) fields.venue_id = await vid(venue_slug as string);
    console.log(`  ${slug}: ${Object.keys(fields).join(", ")}`);
    await upd(slug, fields);
  }

  console.log("\n-- renommages --");
  for (const [slug, r] of Object.entries(RENAMES)) {
    const exists = await sb.from("salons").select("slug").eq("slug", slug).maybeSingle();
    if (!exists.data) { console.log(`  ${slug} absent (déjà renommé ?)`); continue; }
    const { new_slug, venue_slug, ...fields } = r;
    if (venue_slug) fields.venue_id = await vid(venue_slug as string);
    fields.slug = new_slug;
    console.log(`  ${slug} -> ${new_slug} (${Object.keys(fields).join(", ")})`);
    await upd(slug, fields);
  }

  console.log("\n-- dépublications (fantômes) --");
  for (const slug of DRAFTS) {
    console.log(`  DRAFT ${slug}`);
    await upd(slug, { status: "draft" });
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
