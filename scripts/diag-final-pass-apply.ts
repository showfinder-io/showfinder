/**
 * Application dernière passe d'audit (2026-06-13). Dry-run par défaut ; --apply.
 * 0 fantôme parmi les 47 fiches MDX. 2 dépublications + 16 corrections.
 * Clôture du chantier data. Idempotent.
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

// Dépublications : slug -> cible 301 (null = pas de redirect)
const DRAFTS: Record<string, string | null> = {
  "midest": "/salons/global-industrie-lyon", // marque absorbée 2018 (doublon)
  "sima-paris": null, // AgriSIMA 2026 annulé, prochaine édition non confirmée
};

const CORR: Record<string, Record<string, unknown>> = {
  "innov-agri-ondes": { website_url: "https://www.innovagri.com" },
  "maison-objet-paris": { name: "Maison&Objet Paris", start_date: "2026-09-10", end_date: "2026-09-14" },
  "terres-de-jim": { website_url: "https://www.lesterresdejim.com" },
  "iftm-top-resa": { start_date: "2026-09-15", end_date: "2026-09-17" },
  "cphi-worldwide": { city: "Milan" },
  "sirha-lyon": { start_date: "2027-01-21", end_date: "2027-01-25" },
  "pharmagora-plus": { website_url: "https://www.pharmagoraplus.com" },
  "intermat-paris": { website_url: "https://www.intermatconstruction.com" },
  "artibat-rennes": { start_date: "2027-10-20", end_date: "2027-10-22" },
  "texworld-paris": { start_date: "2026-08-31", end_date: "2026-09-02", edition_year: 2026, website_url: "https://texworld-paris.fr.messefrankfurt.com/paris/en.html" },
  "eurogin": { edition_year: 2027, city: "Bologne", venue: "Bologna Congress Center", start_date: "2027-02-10", end_date: "2027-02-13", dates_confirmed: false },
  "art-paris": { edition_year: 2027, start_date: "2027-04-01", end_date: "2027-04-04" },
  "foire-de-paris": { start_date: "2026-04-30", end_date: "2026-05-11" },
  "salon-agriculture-nouvelle-aquitaine": { start_date: "2026-05-22", end_date: "2026-05-31", venue: "Foire Internationale de Bordeaux", website_url: "https://www.foiredebordeaux.com/salon-agriculture" },
  "premiere-vision-paris": { start_date: "2026-09-01", end_date: "2026-09-03" },
};

async function upd(slug: string, patch: Record<string, unknown>) {
  if (!APPLY) return;
  const { error } = await sb.from("salons").update(patch as never).eq("slug", slug);
  if (error) throw new Error(`${slug}: ${error.message}`);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  console.log("\n-- dépublications --");
  for (const slug of Object.keys(DRAFTS)) {
    console.log(`  DRAFT ${slug}${DRAFTS[slug] ? " -> " + DRAFTS[slug] : ""}`);
    await upd(slug, { status: "draft" });
  }
  console.log("\n-- corrections --");
  for (const [slug, c] of Object.entries(CORR)) {
    console.log(`  ${slug}: ${Object.keys(c).join(", ")}`);
    await upd(slug, c);
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
