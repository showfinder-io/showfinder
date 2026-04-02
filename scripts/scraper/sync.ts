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
  };

  for (const salon of enriched) {
    // Chercher un salon existant par slug ou nom similaire
    const { data: existing } = await supabase
      .from("salons")
      .select("id, slug, name, is_locked, description, website_url, start_date, end_date, estimated_exhibitors, estimated_visitors, cover_image_url, logo_url, organizer_name, source_url")
      .eq("slug", salon.slug)
      .maybeSingle();

    if (existing) {
      // Salon existe déjà
      if (existing.is_locked) {
        console.log(`  🔒 ${salon.name} (is_locked, ignoré)`);
        result.skipped_locked.push(salon.slug);
        continue;
      }

      // Mettre à jour les champs vides uniquement
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

      for (const { key, scraped } of fields) {
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

      // Toujours mettre à jour source_url et last_scraped_at
      updates.source_url = salon.source_url;
      updates.last_scraped_at = new Date().toISOString();

      if (Object.keys(updates).length > 2) {
        // Plus que juste source_url et last_scraped_at
        const { error } = await supabase
          .from("salons")
          .update(updates)
          .eq("id", existing.id);

        if (error) {
          console.log(`  ❌ ${salon.name} : ${error.message}`);
        } else {
          const fieldCount = Object.keys(updates).length - 2; // -2 pour source_url et last_scraped_at
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
  console.log(`  Créés (draft) : ${result.created.length}`);
  console.log(`  Mis à jour    : ${result.updated.length}`);
  console.log(`  Locked (ignorés) : ${result.skipped_locked.length}`);
  console.log(`  Conflits      : ${result.conflicts.length}`);
  console.log(`\n📄 Rapport : ${REPORT_FILE}`);
}

main().catch(console.error);
