// Étape 3 : Sync to DB
// Compare les données enrichies avec la DB et met à jour
// Respecte is_locked, ne remplace que les champs vides, log les conflits
// Produit : scripts/scraper/output/sync-report.json

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { EnrichedSalon, SyncResult } from "./types";

const OUTPUT_DIR = path.join(__dirname, "output");
const INPUT_FILE = path.join(OUTPUT_DIR, "enriched.json");
const REPORT_FILE = path.join(OUTPUT_DIR, "sync-report.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY requis");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Slugify pour matcher les salons
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Anti-doublon : normalise un nom pour fuzzy match.
// "VivaTech" et "vivatech-paris-2026" se reduisent au meme set de tokens
// avec ce traitement (lowercase, sans accents, tokens > 2 chars).
function nameTokens(text: string | null | undefined): Set<string> {
  if (!text) return new Set();
  const norm = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return new Set(norm.split(" ").filter((t) => t.length > 2));
}

// Jaccard similarity entre 2 noms : 1.0 = identique, 0 = disjoints.
// Seuil 0.7 utilise pour declarer un doublon potentiel apres match ville.
function jaccardSim(a: string | null | undefined, b: string | null | undefined): number {
  const A = nameTokens(a);
  const B = nameTokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter);
}

// Distance en jours entre 2 dates ISO. Infinity si l'une manque.
function daysBetween(a: string | null | undefined, b: string | null | undefined): number {
  if (!a || !b) return Infinity;
  return Math.abs(+new Date(a) - +new Date(b)) / 86_400_000;
}

async function main() {
  console.log("=== SYNC : synchronisation avec la base de données ===\n");

  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Fichier ${INPUT_FILE} introuvable. Lancer enrich d'abord.`);
    process.exit(1);
  }

  const enriched: EnrichedSalon[] = JSON.parse(
    fs.readFileSync(INPUT_FILE, "utf-8")
  );

  const result: SyncResult = {
    created: [],
    updated: [],
    skipped_locked: [],
    conflicts: [],
    potential_dupes: [],
  };

  // Pre-load tous les salons existants pour le check anti-doublon pre-insert.
  // On compare sur name + city + start_date (fenetre +/-14j). Audit juin 2026
  // a montre que le scraper inserait des doublons (ex: vivatech-2026 ET
  // vivatech-paris-2026) parce qu'il matchait uniquement par slug exact.
  const { data: allExisting } = await supabase
    .from("salons")
    .select("id, slug, name, city, start_date, status")
    .limit(2000);
  const existingForDupeCheck = allExisting ?? [];
  console.log(
    `  📋 ${existingForDupeCheck.length} salons charges pour check anti-doublon\n`
  );

  for (const salon of enriched) {
    // Chercher un salon existant par slug ou nom similaire
    const { data: existing } = await supabase
      .from("salons")
      .select("id, slug, name, is_locked, locked_fields, description, website_url, start_date, end_date, estimated_exhibitors, estimated_visitors, cover_image_url, logo_url, organizer_name, source_url")
      .eq("slug", salon.slug)
      .maybeSingle();

    if (existing) {
      // Salon existe déjà
      if (existing.is_locked) {
        console.log(`  🔒 ${salon.name} (is_locked global, ignoré)`);
        result.skipped_locked.push(salon.slug);
        continue;
      }

      // locked_fields : array JSONB ajouté par migration V5 workflow éditorial.
      // Le scraper skip ces champs individuellement (granularité fiche+champ).
      const lockedFields = new Set<string>(
        Array.isArray(existing.locked_fields) ? existing.locked_fields : []
      );

      // Mettre à jour les champs vides uniquement, sauf si verrouillés.
      const updates: Record<string, unknown> = {};
      const fields = [
        { key: "description", scraped: salon.description },
        { key: "website_url", scraped: salon.website_url },
        { key: "start_date", scraped: salon.start_date },
        { key: "end_date", scraped: salon.end_date },
        { key: "estimated_exhibitors", scraped: salon.estimated_exhibitors },
        { key: "estimated_visitors", scraped: salon.estimated_visitors },
        { key: "cover_image_url", scraped: salon.cover_image_url },
        { key: "logo_url", scraped: salon.logo_url },
        { key: "organizer_name", scraped: salon.organizer_name },
      ];

      let skippedLockedFieldsCount = 0;
      for (const { key, scraped } of fields) {
        if (lockedFields.has(key)) {
          // V5 : champ verrouillé individuellement, le scraper n'y touche pas
          skippedLockedFieldsCount++;
          continue;
        }
        const dbValue = existing[key as keyof typeof existing];
        if (scraped === null || scraped === undefined) continue;

        if (dbValue === null || dbValue === undefined || dbValue === "") {
          // Champ vide en DB → on met à jour
          updates[key] = scraped;
        } else if (String(dbValue) !== String(scraped)) {
          // Conflit : la DB a une valeur différente
          result.conflicts.push({
            slug: salon.slug,
            field: key,
            db_value: String(dbValue),
            scraped_value: String(scraped),
          });
        }
      }

      if (skippedLockedFieldsCount > 0) {
        console.log(
          `  🔓 ${salon.name} (${skippedLockedFieldsCount} champ(s) verrouillé(s) skipped)`
        );
      }

      // Toujours mettre à jour source_url + tracking (last_scraped_at historique
      // + last_ia_update_at V5 workflow éditorial pour l'admin UI).
      const now = new Date().toISOString();
      updates.source_url = salon.source_url;
      updates.last_scraped_at = now;
      updates.last_ia_update_at = now;

      if (Object.keys(updates).length > 3) {
        // Plus que juste source_url + last_scraped_at + last_ia_update_at
        const { error } = await supabase
          .from("salons")
          .update(updates)
          .eq("id", existing.id);

        if (error) {
          console.log(`  ❌ ${salon.name} : ${error.message}`);
        } else {
          const fieldCount = Object.keys(updates).length - 3; // -3 pour les 3 trackings
          console.log(`  ✏️  ${salon.name} (+${fieldCount} champs)`);
          result.updated.push(salon.slug);
        }
      } else {
        // Juste le tracking
        await supabase
          .from("salons")
          .update(updates)
          .eq("id", existing.id);
      }
    } else {
      // Check anti-doublon avant INSERT : on cherche un salon en DB avec
      // un nom similaire (jaccard >= 0.7) + meme ville + dates proches
      // (+/- 14j). Si match -> on n'insere PAS, on signale a l'admin.
      const cityNorm = (salon.city ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
      const dupeMatch = existingForDupeCheck.find((e) => {
        const eCityNorm = (e.city ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
        if (eCityNorm !== cityNorm) return false;
        if (daysBetween(salon.start_date, e.start_date) > 14) return false;
        return jaccardSim(salon.name, e.name) >= 0.7;
      });

      if (dupeMatch) {
        const sim = jaccardSim(salon.name, dupeMatch.name);
        const dayDiff = Math.round(daysBetween(salon.start_date, dupeMatch.start_date));
        console.log(
          `  🚫 ${salon.name} : doublon potentiel de "${dupeMatch.name}" (${dupeMatch.slug}, sim=${sim.toFixed(2)}, ${dayDiff}j) — pas insere`
        );
        result.potential_dupes.push({
          scraped_slug: salon.slug,
          scraped_name: salon.name,
          db_slug: dupeMatch.slug,
          db_name: dupeMatch.name,
          similarity: parseFloat(sim.toFixed(2)),
          day_diff: dayDiff,
        });
        continue;
      }

      // Nouveau salon → insérer en draft
      const year = salon.start_date
        ? parseInt(salon.start_date.substring(0, 4))
        : new Date().getFullYear();

      const { error } = await supabase.from("salons").insert({
        slug: salon.slug,
        name: salon.name,
        edition_year: year,
        description: salon.description,
        start_date: salon.start_date,
        end_date: salon.end_date,
        city: salon.city,
        venue: salon.venue_name,
        website_url: salon.website_url,
        organizer_name: salon.organizer_name,
        estimated_exhibitors: salon.estimated_exhibitors,
        estimated_visitors: salon.estimated_visitors,
        logo_url: salon.logo_url,
        cover_image_url: salon.cover_image_url,
        source_url: salon.source_url,
        last_scraped_at: new Date().toISOString(),
        status: "draft", // Review admin avant publication
        country: "FR",
      });

      if (error) {
        console.log(`  ❌ ${salon.name} (insert) : ${error.message}`);
      } else {
        console.log(`  🆕 ${salon.name} (créé en draft)`);
        result.created.push(salon.slug);
      }
    }
  }

  // Rapport
  fs.writeFileSync(REPORT_FILE, JSON.stringify(result, null, 2));

  console.log("\n=== RAPPORT ===");
  console.log(`  Créés (draft)        : ${result.created.length}`);
  console.log(`  Mis à jour           : ${result.updated.length}`);
  console.log(`  Locked (ignorés)     : ${result.skipped_locked.length}`);
  console.log(`  Conflits             : ${result.conflicts.length}`);
  console.log(`  Doublons potentiels  : ${result.potential_dupes.length}`);
  console.log(`\n📄 Rapport : ${REPORT_FILE}`);
}

main().catch(console.error);
