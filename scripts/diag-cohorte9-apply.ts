/**
 * Application cohorte 9 (2026-06-13). Dry-run par défaut ; --apply. Idempotent.
 *
 * - Publication de 5 fiches (MDX/SEO depuis handoffs + corrections de données
 *   vérifiées par 2 reviewers). Création venue Palais de la Bourse (Lyon).
 * - Dépublication metal-expo-paris (doublon equipbaie-metalexpo) et
 *   maroquinerie-paris (absorbé par Première Vision 2014) : status draft.
 *   (formnext-france-lyon, salon-du-luxe-paris, beyond-beauty-paris déjà draftés.)
 * - Redirects 301 gérés dans next.config.ts.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-cohorte9-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/cohorte-9-review");

// Corrections de données vétées (consolidées depuis les handoffs + faits confirmés).
// venue_slug -> résolu en venue_id à l'exécution.
const PUBLISH: Record<string, Record<string, unknown> & { venue_slug?: string }> = {
  "top-transport-europe-marseille": {
    start_date: "2026-10-14", end_date: "2026-10-15", venue: "Palais du Pharo",
    venue_slug: "palais-du-pharo", website_url: "https://www.toptransporteurope.com",
    organizer_name: "Comexposium One to One", estimated_exhibitors: 170,
  },
  "enerj-meeting-lyon": {
    start_date: "2026-09-15", end_date: "2026-09-15", venue: "Palais de la Bourse",
    venue_slug: "palais-de-la-bourse-lyon", organizer_name: "Batiactu Groupe",
    website_url: "https://lyon.enerj-meeting.com",
  },
  "cfia-toulouse": {
    frequency: "bisannuel", website_url: "https://toulouse.cfiaexpo.com/fr",
    estimated_exhibitors: 350,
  },
  "luxe-pack-monaco": { organizer_name: "IDICE MC", country: "MC" },
  "sepem-toulouse": {
    start_date: "2026-09-22", end_date: "2026-09-24", frequency: "bisannuel",
    name: "SEPEM Industries Sud-Ouest",
  },
};

const DRAFT = ["metal-expo-paris", "maroquinerie-paris"];

async function venueId(slug: string): Promise<string | null> {
  const { data } = await sb.from("venues").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");

  // 0. Venue Palais de la Bourse (Lyon) pour enerj-meeting-lyon
  if (!(await venueId("palais-de-la-bourse-lyon"))) {
    console.log("CREATE venue palais-de-la-bourse-lyon (Palais de la Bourse, Lyon, FR)");
    if (APPLY) {
      const { error } = await sb.from("venues").insert({ slug: "palais-de-la-bourse-lyon", name: "Palais de la Bourse", city: "Lyon", country: "FR" } as never);
      if (error) throw new Error("palais-bourse: " + error.message);
    }
  }

  // 1. Publication des 5
  for (const [slug, patch] of Object.entries(PUBLISH)) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    const { venue_slug, ...fields } = patch;
    const full: Record<string, unknown> = { ...fields, status: "published", editorial_mdx: h.mdx, seo_title: h.seo_title, seo_description: h.seo_description };
    if (venue_slug) {
      const vid = await venueId(venue_slug as string);
      if (!vid && APPLY) throw new Error(`venue ${venue_slug} introuvable (${slug})`);
      full.venue_id = vid;
    }
    console.log(`PUBLISH ${slug}: ${Object.keys(fields).join(",")} | mdx ${String(h.mdx).length}c`);
    if (APPLY) {
      const { error } = await sb.from("salons").update(full as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }

  // 2. Dépublication (doublons / marques absorbées)
  for (const slug of DRAFT) {
    console.log(`DRAFT ${slug}`);
    if (APPLY) {
      const { error } = await sb.from("salons").update({ status: "draft" } as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
