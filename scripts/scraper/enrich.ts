// Étape 2 : Enrich
// Enrichit chaque salon découvert via son site officiel
// Extrait : description, og:image, og:description, données structurées
// Produit : scripts/scraper/output/enriched.json

import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import type { DiscoveredSalon, EnrichedSalon } from "./types";

const OUTPUT_DIR = path.join(__dirname, "output");
const INPUT_FILE = path.join(OUTPUT_DIR, "discovered.json");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "enriched.json");

async function fetchWithTimeout(url: string, timeout = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Showfinder/1.0; +https://showfinder-amber.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractMeta(html: string) {
  const $ = cheerio.load(html);

  const ogDescription =
    $('meta[property="og:description"]').attr("content") ??
    $('meta[name="description"]').attr("content") ??
    null;

  const ogImage =
    $('meta[property="og:image"]').attr("content") ??
    $('meta[name="twitter:image"]').attr("content") ??
    null;

  const ogTitle =
    $('meta[property="og:title"]').attr("content") ??
    $("title").text() ??
    null;

  // Chercher des chiffres dans le texte (exposants, visiteurs)
  const bodyText = $("body").text();

  let exhibitors: number | null = null;
  let visitors: number | null = null;

  // Patterns : "X exposants", "X exhibitors", "X visiteurs"
  const exhMatch = bodyText.match(/(\d[\d\s,.]*)\s*exposants?/i);
  if (exhMatch) {
    exhibitors = parseInt(exhMatch[1].replace(/[\s,.]/g, ""), 10) || null;
  }

  const visMatch = bodyText.match(/(\d[\d\s,.]*)\s*visiteurs?/i);
  if (visMatch) {
    visitors = parseInt(visMatch[1].replace(/[\s,.]/g, ""), 10) || null;
  }

  // Chercher l'organisateur
  let organizer: string | null = null;
  const orgMatch = bodyText.match(/organis[ée]e?\s+par\s+([^.,()\n]{3,50})/i);
  if (orgMatch) {
    organizer = orgMatch[1].trim();
  }

  return {
    description: ogDescription,
    cover_image_url: ogImage,
    title: ogTitle,
    estimated_exhibitors: exhibitors,
    estimated_visitors: visitors,
    organizer_name: organizer,
  };
}

async function main() {
  console.log("=== ENRICH : enrichissement via sites officiels ===\n");

  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Fichier ${INPUT_FILE} introuvable. Lancer discover d'abord.`);
    process.exit(1);
  }

  const discovered: DiscoveredSalon[] = JSON.parse(
    fs.readFileSync(INPUT_FILE, "utf-8")
  );

  console.log(`${discovered.length} salons à enrichir\n`);

  const enriched: EnrichedSalon[] = [];

  for (const salon of discovered) {
    const base: EnrichedSalon = {
      ...salon,
      description: null,
      organizer_name: null,
      estimated_exhibitors: null,
      estimated_visitors: null,
      logo_url: null,
      cover_image_url: null,
      sectors: [],
    };

    if (!salon.website_url) {
      console.log(`  SKIP ${salon.name} (pas de site web)`);
      enriched.push(base);
      continue;
    }

    const html = await fetchWithTimeout(salon.website_url);
    if (!html) {
      console.log(`  MISS ${salon.name} (site inaccessible)`);
      enriched.push(base);
      continue;
    }

    const meta = extractMeta(html);

    enriched.push({
      ...base,
      description: meta.description,
      organizer_name: meta.organizer_name,
      estimated_exhibitors: meta.estimated_exhibitors,
      estimated_visitors: meta.estimated_visitors,
      cover_image_url: meta.cover_image_url,
      logo_url: salon.website_url
        ? `https://www.google.com/s2/favicons?domain=${new URL(salon.website_url).hostname}&sz=128`
        : null,
    });

    const enrichCount = [meta.description, meta.cover_image_url, meta.estimated_exhibitors].filter(Boolean).length;
    console.log(`  OK   ${salon.name} (+${enrichCount} champs)`);

    // Rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2));
  console.log(`\n📄 ${enriched.length} salons enrichis sauvegardés dans ${OUTPUT_FILE}`);
}

main().catch(console.error);
