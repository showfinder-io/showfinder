// V5.7 — One-shot : scraper les visuels hero des salons sans cover_image_url.
//
// Stratégie d'extraction (par ordre de priorité) :
//   1. <meta property="og:image"> (et twitter:image)
//   2. JSON-LD Event/Place "image"
//   3. Premier <img> dans <header>, .hero, [class*="hero"], [class*="banner"]
//   4. Plus grand <img> de la home (avec filtres anti-logo)
//
// Filtres qualité (anti-bruit) :
//   - skip si "logo" dans src / alt / class
//   - skip si SVG (souvent logo)
//   - skip si data-url base64 (rarement utile, taille indeterminee)
//   - skip si extension .gif (souvent pub animee ou loader)
//   - skip si taille connue et width < 600
//
// Le script peut etre relance : seuls les salons sans cover sont traites.
// Usage : npm exec -- tsx --env-file=.env.local scripts/scrape-hero-images.ts

import * as cheerio from "cheerio";
import imageSize from "image-size";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const TIMEOUT_MS = 12000;
const SLEEP_MS = 800; // throttling soft pour eviter le ban anti-bot

// Validation dimensions (cf. scripts/validate-covers.ts) :
// l'image doit etre 16:9-ish et au moins 800px de large pour bien rendre
// dans le aspect-video object-cover des fiches salons.
const MIN_WIDTH = 800;
const MIN_RATIO = 1.4;
const MAX_RATIO = 2.4;

async function fetchImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36",
        Range: "bytes=0-65535",
      },
    });
    clearTimeout(timer);
    if (!res.ok && res.status !== 206) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const dim = imageSize(buf);
    if (!dim.width || !dim.height) return null;
    return { width: dim.width, height: dim.height };
  } catch {
    return null;
  }
}

/** Verifie que l'image candidate respecte les criteres de rendu 16:9. */
async function validateCandidate(url: string): Promise<boolean> {
  const dim = await fetchImageDimensions(url);
  if (!dim) return false;
  if (dim.width < MIN_WIDTH) return false;
  const ratio = dim.width / dim.height;
  return ratio >= MIN_RATIO && ratio <= MAX_RATIO;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36",
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

/** Résout une URL relative en absolue, retourne null si invalide. */
function resolveUrl(src: string, base: string): string | null {
  try {
    return new URL(src, base).href;
  } catch {
    return null;
  }
}

function isLikelyLogo(src: string, alt: string, cls: string): boolean {
  const txt = (src + " " + alt + " " + cls).toLowerCase();
  return /logo|sprite|icon|favicon/.test(txt);
}

function isBadExt(src: string): boolean {
  const lower = src.toLowerCase();
  if (lower.startsWith("data:")) return true;
  if (lower.endsWith(".svg")) return true;
  if (lower.endsWith(".gif")) return true;
  return false;
}

function pickHero(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);

  // 1. og:image (+ filtre anti-logo : certains sites mettent leur logo
  // comme og:image par defaut, on skipe pour eviter d'avoir un logo
  // tout petit comme hero salon).
  const og =
    $('meta[property="og:image"]').attr("content") ??
    $('meta[property="og:image:secure_url"]').attr("content") ??
    $('meta[name="twitter:image"]').attr("content");
  if (og) {
    const abs = resolveUrl(og, baseUrl);
    if (abs && !isBadExt(abs) && !isLikelyLogo(abs, "", "")) return abs;
  }

  // 2. JSON-LD image
  let jsonLdImage: string | null = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    if (jsonLdImage) return;
    try {
      const txt = $(el).text();
      const parsed = JSON.parse(txt);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of arr) {
        const img = node?.image;
        if (typeof img === "string") jsonLdImage = img;
        else if (Array.isArray(img) && typeof img[0] === "string")
          jsonLdImage = img[0];
        else if (img && typeof img === "object" && typeof img.url === "string")
          jsonLdImage = img.url;
        if (jsonLdImage) break;
      }
    } catch {
      // ignore
    }
  });
  if (jsonLdImage) {
    const abs = resolveUrl(jsonLdImage, baseUrl);
    if (abs && !isBadExt(abs) && !isLikelyLogo(abs, "", "")) return abs;
  }

  // 3. Hero img : sélecteurs courants
  const heroSelectors = [
    "header img",
    ".hero img",
    "[class*='hero'] img",
    "[class*='banner'] img",
    "[class*='Hero'] img",
    "[class*='Banner'] img",
    "main img:first-of-type",
    "section:first-of-type img:first-of-type",
  ];
  for (const sel of heroSelectors) {
    const img = $(sel).first();
    if (img.length === 0) continue;
    const src =
      img.attr("src") ??
      img.attr("data-src") ??
      img.attr("data-lazy-src") ??
      img.attr("srcset")?.split(",")[0]?.split(" ")[0];
    if (!src) continue;
    const alt = img.attr("alt") ?? "";
    const cls = img.attr("class") ?? "";
    if (isBadExt(src) || isLikelyLogo(src, alt, cls)) continue;
    const abs = resolveUrl(src, baseUrl);
    if (abs) return abs;
  }

  // 4. Plus grande img de la home (par attribut width/height connus)
  let best: { src: string; area: number } | null = null;
  $("img").each((_, el) => {
    const img = $(el);
    const src =
      img.attr("src") ??
      img.attr("data-src") ??
      img.attr("data-lazy-src");
    if (!src) return;
    const alt = img.attr("alt") ?? "";
    const cls = img.attr("class") ?? "";
    if (isBadExt(src) || isLikelyLogo(src, alt, cls)) return;
    const w = parseInt(img.attr("width") ?? "0", 10);
    const h = parseInt(img.attr("height") ?? "0", 10);
    if (w && w < 600) return;
    const area = (w || 600) * (h || 400);
    if (!best || area > best.area) best = { src, area };
  });
  if (best) {
    const abs = resolveUrl((best as { src: string }).src, baseUrl);
    if (abs) return abs;
  }

  return null;
}

async function main() {
  const { data: salons, error } = await supabase
    .from("salons")
    .select("id, slug, name, website_url")
    .is("cover_image_url", null)
    .not("website_url", "is", null);

  if (error || !salons) {
    console.error("Erreur fetch salons :", error?.message);
    process.exit(1);
  }

  console.log(`\n=== HERO IMAGES SCRAPING ===`);
  console.log(`${salons.length} salons sans cover_image_url avec website_url.\n`);

  const result = { ok: 0, no_image: 0, fetch_failed: 0, errors: 0 };

  for (const salon of salons) {
    if (!salon.website_url) continue;

    process.stdout.write(`  ${salon.slug} ... `);
    const html = await fetchHtml(salon.website_url);
    if (!html) {
      console.log("⚠️  fetch failed");
      result.fetch_failed++;
      await sleep(SLEEP_MS);
      continue;
    }

    const hero = pickHero(html, salon.website_url);
    if (!hero) {
      console.log("∅ no image found");
      result.no_image++;
      await sleep(SLEEP_MS);
      continue;
    }

    // Validation dimensions (rejette ratios < 1.4 ou > 2.4, ou width < 800).
    const valid = await validateCandidate(hero);
    if (!valid) {
      console.log(`∅ dimensions invalides (${hero.slice(0, 60)}...)`);
      result.no_image++;
      await sleep(SLEEP_MS);
      continue;
    }

    const { error: updErr } = await supabase
      .from("salons")
      .update({ cover_image_url: hero } as never)
      .eq("id", salon.id);

    if (updErr) {
      console.log(`❌ ${updErr.message}`);
      result.errors++;
    } else {
      console.log(`✓ ${hero.slice(0, 80)}${hero.length > 80 ? "..." : ""}`);
      result.ok++;
    }

    await sleep(SLEEP_MS);
  }

  console.log("\n=== RAPPORT ===");
  console.log(`  OK         : ${result.ok}`);
  console.log(`  No image   : ${result.no_image}`);
  console.log(`  Fetch fail : ${result.fetch_failed}`);
  console.log(`  Errors     : ${result.errors}`);
  console.log(`  Total      : ${salons.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
