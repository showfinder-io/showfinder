// Étape 1 : Discover
// Scrape les calendriers des venues pour trouver les salons
// Produit : scripts/scraper/output/discovered.json

import fs from "fs";
import path from "path";
import { VENUE_SOURCES } from "./sources";
import type { DiscoveredSalon } from "./types";

const OUTPUT_DIR = path.join(__dirname, "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "discovered.json");

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
    if (!res.ok) {
      console.log(`  WARN ${url} → ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.log(`  ERR  ${url} → ${(err as Error).message}`);
    return null;
  }
}

async function main() {
  console.log("=== DISCOVER : scrape des calendriers venues ===\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allSalons: DiscoveredSalon[] = [];

  for (const source of VENUE_SOURCES) {
    console.log(`📍 ${source.name} (${source.city})`);
    console.log(`   ${source.calendar_url}`);

    const html = await fetchWithTimeout(source.calendar_url);
    if (!html) {
      console.log("   ❌ Impossible de charger la page\n");
      continue;
    }

    console.log(`   HTML reçu : ${(html.length / 1024).toFixed(0)}KB`);

    const salons = source.parse(html, source);
    console.log(`   ✅ ${salons.length} salons trouvés\n`);

    allSalons.push(...salons);
  }

  // Déduplique par slug
  const uniqueSalons = [...new Map(allSalons.map((s) => [s.slug, s])).values()];

  // Filtre : garder seulement les salons avec au moins un nom
  const validSalons = uniqueSalons.filter((s) => s.name.length > 2);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validSalons, null, 2));
  console.log(`\n📄 ${validSalons.length} salons sauvegardés dans ${OUTPUT_FILE}`);
}

main().catch(console.error);
