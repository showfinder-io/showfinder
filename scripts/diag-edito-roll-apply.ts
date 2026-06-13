/**
 * Application de la passe éditoriale de rolls (2026-06-13).
 * Pour chaque fiche : structure (dates/edition_year/ville/lieu/venue_id) pilotée
 * par les faits CONFIRMÉS (NEXT), + MDX/SEO rafraîchis depuis les handoffs.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-edito-roll-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/edito-roll");

type Next = { start: string; end: string; year: number; city: string; venue: string; venue_slug: string };
const NEXT: Record<string, Next> = {
  "santexpo-paris":       { start: "2027-05-25", end: "2027-05-27", year: 2027, city: "Paris", venue: "Paris Expo Porte de Versailles", venue_slug: "paris-expo-porte-de-versailles" },
  "hopital-expo-paris":   { start: "2027-05-25", end: "2027-05-27", year: 2027, city: "Paris", venue: "Paris Expo Porte de Versailles", venue_slug: "paris-expo-porte-de-versailles" },
  "mountain-planet":      { start: "2028-04-11", end: "2028-04-13", year: 2028, city: "Grenoble", venue: "Alpexpo", venue_slug: "alpexpo-grenoble" },
  "festival-livre-paris": { start: "2027-04-16", end: "2027-04-18", year: 2027, city: "Paris", venue: "Grand Palais", venue_slug: "grand-palais" },
  "fic-lille":            { start: "2027-03-09", end: "2027-03-11", year: 2027, city: "Lille", venue: "Lille Grand Palais", venue_slug: "lille-grand-palais" },
  "sitl":                 { start: "2027-03-23", end: "2027-03-25", year: 2027, city: "Paris", venue: "Paris Expo Porte de Versailles", venue_slug: "paris-expo-porte-de-versailles" },
  "expobiogaz":           { start: "2027-06-02", end: "2027-06-03", year: 2027, city: "Reims", venue: "Reims Expo", venue_slug: "reims-expo" },
};

async function venueId(slug: string): Promise<string | null> {
  const { data } = await sb.from("venues").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");

  // 0. Créer la fiche lieu Reims Expo (expobiogaz déménage à Reims)
  if (!(await venueId("reims-expo"))) {
    console.log("CREATE venue reims-expo (Reims Expo, Reims, FR)");
    if (APPLY) {
      const { error } = await sb.from("venues").insert({ slug: "reims-expo", name: "Reims Expo", city: "Reims", country: "FR" } as never);
      if (error) throw new Error("reims-expo: " + error.message);
    }
  } else console.log("venue reims-expo déjà présent");

  for (const [slug, n] of Object.entries(NEXT)) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    const vid = await venueId(n.venue_slug);
    if (!vid && APPLY) throw new Error(`venue ${n.venue_slug} introuvable pour ${slug}`);
    const patch: Record<string, unknown> = {
      start_date: n.start, end_date: n.end, edition_year: n.year,
      city: n.city, venue: n.venue, venue_id: vid,
      // dates_confirmed retiré : colonne absente en prod (migration
      // 20260512000003 non déployée, même cas que category). À redéployer à part.
      editorial_mdx: h.mdx, seo_title: h.seo_title, seo_description: h.seo_description,
    };
    console.log(`UPDATE ${slug}: ${n.start} ${n.city}/${n.venue} | mdx ${String(h.mdx).length}c | ${h.seo_title?.slice(0, 50)}`);
    if (APPLY) {
      const { error } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
