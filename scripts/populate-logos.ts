// Script pour populer les logo_url des salons
// Strategie : Google Favicon API (128px) comme logo
// Usage : npm exec -- tsx --env-file=.env.local scripts/populate-logos.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY requis. Ajouter dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

// Google Favicon API : toujours dispo, qualite correcte
function googleFaviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

// Scraper l'og:image du site officiel pour la cover
async function scrapeOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Showfinder/1.0; +https://showfinder-amber.vercel.app)",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();

    // Chercher og:image
    const ogMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );
    if (ogMatch?.[1]) return ogMatch[1];

    // Fallback : twitter:image
    const twMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    );
    if (twMatch?.[1]) return twMatch[1];

    return null;
  } catch {
    return null;
  }
}

async function main() {
  const { data: salons, error } = await supabase
    .from("salons")
    .select("id, slug, name, website_url, logo_url, cover_image_url")
    .not("website_url", "is", null);

  if (error) {
    console.error("Erreur Supabase :", error.message);
    process.exit(1);
  }

  console.log(`${salons.length} salons a traiter\n`);

  let logoCount = 0;
  let coverCount = 0;

  for (const salon of salons) {
    const domain = extractDomain(salon.website_url!);
    if (!domain) continue;

    const updates: Record<string, string> = {};

    // Logo via Google Favicon
    if (!salon.logo_url) {
      const logoUrl = googleFaviconUrl(domain);
      updates.logo_url = logoUrl;
      logoCount++;
    }

    // Cover via og:image
    if (!salon.cover_image_url) {
      const ogImage = await scrapeOgImage(salon.website_url!);
      if (ogImage) {
        updates.cover_image_url = ogImage;
        coverCount++;
        console.log(`  COVER ${salon.name} -> ${ogImage.substring(0, 80)}...`);
      } else {
        console.log(`  MISS  ${salon.name} (pas d'og:image)`);
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("salons")
        .update(updates)
        .eq("id", salon.id);

      if (updateError) {
        console.log(`  ERR   ${salon.name} : ${updateError.message}`);
      }
    }
  }

  console.log(
    `\nTermine : ${logoCount} logos (favicon), ${coverCount} covers (og:image)`
  );
}

main();
