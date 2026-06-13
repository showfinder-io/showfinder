/**
 * Application cohorte 8 (ÉCRITURE). Dry-run par défaut ; --apply pour exécuter.
 *
 * - Corrections de données vétées + publication des 18 MDX (17 + Sirha)
 * - Décisions Julien 2026-06-13 : co-organisateurs sourcés appliqués (overrides
 *   pour les 3 reconfirmés : agrimax null, châlons UCIA Expos SAS, djazagro
 *   Comexposium) ; category grand_public pour 2 fiches ; frequency triennal
 *   pour FIP (enum l'accepte déjà) ; Sirha Food + co GL Events.
 * - Renommage djazagro-paris -> djazagro-alger (+ venue Safex Alger)
 * - DELETE jec-world-paris / meuble-paris / map-pro-marseille (301 dans next.config)
 * - Roll canonique jec-world -> 2027
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-cohorte8-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Variables requises : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/cohorte-8-review");

// 17 fiches publiables (par slug DB actuel). Sirha traité à part (création).
const PUBLISHABLE = [
  "salon-vegetal-angers", "salon-sme-paris", "workspace-expo-paris",
  "salon-tourisme-voyages-lille", "preventica-paris", "foire-chalons-en-champagne",
  "agrimax-metz", "jfr-paris", "plastic-expo-lyon", "transports-publics-paris",
  "exphotel-bordeaux", "tranofiliere-paris", "salon-habitat-bordeaux",
  "djazagro-paris", "salon-energie-habitat-colmar", "air-drone-bordeaux",
  "sfar-congres-paris",
];

// Champs scalaires auto-appliqués depuis les db_updates des handoffs.
// (venue/venue_lat/slug/status/category traités à part.)
const AUTO_FIELDS = new Set([
  "name", "start_date", "end_date", "edition_year", "frequency",
  "organizer_name", "co_organizer_name", "website_url",
  "estimated_visitors", "estimated_exhibitors", "city", "country",
]);
const INT_FIELDS = new Set(["edition_year", "estimated_visitors", "estimated_exhibitors"]);

// Overrides qui priment sur la proposition du writer (décisions + double-check).
const OVERRIDES: Record<string, Record<string, unknown>> = {
  "agrimax-metz": { co_organizer_name: null }, // GL Events = organisateur unique, pas de co distinct
  "djazagro-paris": { co_organizer_name: "Comexposium" }, // writer avait proposé Promosalons (faux)
  "foire-chalons-en-champagne": { co_organizer_name: "UCIA Expos SAS" },
  // category (grand_public) découplé : colonne absente de la table salons,
  // mécanisme de catégorie à investiguer. Reclassification traitée à part.
};

function coerce(field: string, raw: unknown): unknown {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === "" || s.toLowerCase() === "null" || s.toLowerCase() === "none") return null;
  if (INT_FIELDS.has(field)) {
    const n = parseInt(s.replace(/[^\d-]/g, ""), 10);
    return Number.isNaN(n) ? null : n;
  }
  return s;
}

function loadHandoff(slug: string) {
  return JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
}

type Handoff = {
  db_updates?: { field: string; proposed: unknown }[];
  mdx?: string;
  seo_title?: string;
  seo_description?: string;
};

/** Construit le patch d'un fiche publiable depuis ses db_updates + overrides + MDX. */
function buildPatch(slug: string, h: Handoff): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const u of h.db_updates ?? []) {
    const f = u.field;
    if (AUTO_FIELDS.has(f)) patch[f] = coerce(f, u.proposed);
  }
  Object.assign(patch, OVERRIDES[slug] ?? {});
  // Publication
  let mdx = h.mdx ?? "";
  if (slug === "sirha-mediterranee") {
    mdx = mdx.replace(/sept univers du food service/g, "plusieurs univers du food service");
  }
  patch.editorial_mdx = mdx;
  patch.seo_title = h.seo_title;
  patch.seo_description = h.seo_description;
  patch.status = "published";
  return patch;
}

async function update(slug: string, patch: Record<string, unknown>) {
  const view = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [k, k === "editorial_mdx" ? `<mdx ${String(v).length}c>` : v])
  );
  console.log(`  UPDATE ${slug}:`, JSON.stringify(view));
  if (!APPLY) return;
  const { error } = await sb.from("salons").update(patch as never).eq("slug", slug);
  if (error) throw new Error(`${slug}: ${error.message}`);
}

async function main() {
  console.log(APPLY ? "=== MODE APPLY ===" : "=== DRY-RUN (ajouter --apply) ===");

  // 1. Fiches publiables (corrections + publication)
  console.log("\n-- 1. Corrections + publication (17 fiches) --");
  for (const slug of PUBLISHABLE) {
    if (slug === "djazagro-paris") continue; // traité en section 3
    await update(slug, buildPatch(slug, loadHandoff(slug)));
  }

  // 2. Sirha Méditerranée : création (remplace map-pro-marseille)
  console.log("\n-- 2. Création Sirha Méditerranée --");
  const sirhaH = loadHandoff("sirha-mediterranee");
  const { data: pc } = await sb.from("venues").select("id").eq("slug", "parc-chanot-marseille").single();
  const sirhaPatch = buildPatch("sirha-mediterranee", sirhaH);
  const sirhaRow = {
    slug: "sirha-mediterranee", city: "Marseille", venue: "Parc Chanot",
    venue_id: pc!.id, ...sirhaPatch,
  };
  console.log("  UPSERT sirha-mediterranee:", JSON.stringify({ ...sirhaRow, editorial_mdx: `<mdx ${String(sirhaPatch.editorial_mdx).length}c>` }));
  if (APPLY) {
    const { error } = await sb.from("salons").upsert(sirhaRow as never, { onConflict: "slug" });
    if (error) throw new Error(`sirha: ${error.message}`);
  }

  // 3. Djazagro : Alger. Venue Safex + corrections + publication + rename slug.
  console.log("\n-- 3. Djazagro -> Alger --");
  const { data: existAlger } = await sb.from("salons").select("slug").eq("slug", "djazagro-alger").maybeSingle();
  if (existAlger) {
    console.log("  djazagro-alger existe déjà, section ignorée (idempotence)");
  } else {
    // Venue Safex
    let { data: safex } = await sb.from("venues").select("id").eq("slug", "safex-alger").maybeSingle();
    if (!safex) {
      console.log("  CREATE venue safex-alger (Palais des expositions des Pins maritimes, Alger, DZ)");
      if (APPLY) {
        const { data, error } = await sb.from("venues").insert({
          slug: "safex-alger", name: "Palais des expositions des Pins maritimes (Safex)",
          city: "Alger", country: "DZ",
        } as never).select("id").single();
        if (error) throw new Error(`safex: ${error.message}`);
        safex = data;
      }
    }
    const djH = loadHandoff("djazagro-paris");
    const djPatch = buildPatch("djazagro-paris", djH);
    djPatch.venue = "Palais des expositions des Pins maritimes (Safex)";
    djPatch.venue_id = safex?.id ?? null;
    djPatch.slug = "djazagro-alger";
    await update("djazagro-paris", djPatch); // .eq slug djazagro-paris -> renomme
  }

  // 4. Roll canonique jec-world -> 2027
  console.log("\n-- 4. Roll jec-world 2027 --");
  console.log("  UPDATE jec-world: edition_year=2027, 2027-03-02/2027-03-04");
  if (APPLY) {
    const { error } = await sb.from("salons").update({
      edition_year: 2027, start_date: "2027-03-02", end_date: "2027-03-04",
    } as never).eq("slug", "jec-world");
    if (error) throw new Error(`jec-world: ${error.message}`);
  }

  // 5. DELETE doublons / salons disparus (301 gérés dans next.config.ts)
  console.log("\n-- 5. DELETE (301 dans next.config) --");
  for (const slug of ["jec-world-paris", "meuble-paris", "map-pro-marseille"]) {
    console.log(`  DELETE ${slug}`);
    if (APPLY) {
      const { error } = await sb.from("salons").delete().eq("slug", slug);
      if (error) throw new Error(`delete ${slug}: ${error.message}`);
    }
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé (rien écrit) ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
