// V5.7+ — Validation automatique des cover_image_url existantes.
//
// Critères de rejet (image qui serait tronquée par aspect-video 16:9
// + object-cover sur la fiche salon) :
//   - inaccessible (404 / 403 / timeout)
//   - ratio < 1.4 (carré ou portrait → crop vertical massif)
//   - ratio > 2.4 (panorama ultra-large → crop horizontal)
//   - width < 800 (image trop petite, pixelisation à l'affichage)
//   - format non supporté (svg / ico / etc.)
//
// Les covers invalides sont resetees a NULL → la fiche tombera sur le
// comportement "pas de bloc visuel" (decision user : soit vraie photo,
// soit rien).
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/validate-covers.ts
//
// Mode --dry-run : affiche le verdict sans modifier la DB.
// Mode normal : applique les corrections (UPDATE cover_image_url = NULL).

import imageSize from "image-size";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const DRY_RUN = process.argv.includes("--dry-run");
const TIMEOUT_MS = 10000;
const SLEEP_MS = 300;

// Validation assouplie suite décision user : object-contain + bg-sable
// (letterbox/pillarbox) sur la fiche salon → tous les ratios passent.
// On rejette seulement : taille trop petite + formats invalides.
const MIN_WIDTH = 600;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Récupère les ~64KB de header de l'image, suffisant pour lire les dimensions. */
async function fetchImageHeader(url: string): Promise<Buffer | null> {
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
    return buf;
  } catch {
    return null;
  }
}

type Verdict =
  | { ok: true; width: number; height: number; ratio: number }
  | { ok: false; reason: string };

async function validateCover(url: string): Promise<Verdict> {
  // Format check rapide via extension
  const lower = url.toLowerCase().split("?")[0];
  if (lower.endsWith(".svg") || lower.endsWith(".ico") || lower.endsWith(".gif")) {
    return { ok: false, reason: "format non supporté" };
  }

  const buf = await fetchImageHeader(url);
  if (!buf || buf.length < 100) {
    return { ok: false, reason: "fetch failed / image vide" };
  }

  let dim: { width?: number; height?: number };
  try {
    dim = imageSize(buf);
  } catch {
    return { ok: false, reason: "dimensions illisibles" };
  }
  const w = dim.width ?? 0;
  const h = dim.height ?? 0;

  if (w < MIN_WIDTH) {
    return { ok: false, reason: `trop petite (${w}px de large)` };
  }
  return { ok: true, width: w, height: h, ratio: w / h };
}

async function main() {
  console.log(`\n=== VALIDATE COVERS (${DRY_RUN ? "DRY-RUN" : "APPLY"}) ===\n`);

  const { data: salons, error } = await supabase
    .from("salons")
    .select("id, slug, cover_image_url")
    .not("cover_image_url", "is", null);

  if (error || !salons) {
    console.error("Erreur fetch :", error?.message);
    process.exit(1);
  }

  console.log(`${salons.length} salons avec cover_image_url à valider.\n`);

  const stats = { ok: 0, rejected: 0, errors: 0 };
  const rejected: { slug: string; reason: string; url: string }[] = [];

  for (const salon of salons) {
    if (!salon.cover_image_url) continue;
    process.stdout.write(`  ${salon.slug.padEnd(45)} `);
    const verdict = await validateCover(salon.cover_image_url);

    if (verdict.ok) {
      console.log(
        `✓ ${verdict.width}x${verdict.height} (${verdict.ratio.toFixed(2)})`
      );
      stats.ok++;
    } else {
      console.log(`✗ ${verdict.reason}`);
      rejected.push({
        slug: salon.slug,
        reason: verdict.reason,
        url: salon.cover_image_url,
      });
      stats.rejected++;

      if (!DRY_RUN) {
        const { error: updErr } = await supabase
          .from("salons")
          .update({ cover_image_url: null } as never)
          .eq("id", salon.id);
        if (updErr) {
          console.log(`    ❌ update failed: ${updErr.message}`);
          stats.errors++;
        }
      }
    }
    await sleep(SLEEP_MS);
  }

  console.log("\n=== RAPPORT ===");
  console.log(`  OK conservés : ${stats.ok}`);
  console.log(`  Rejetées     : ${stats.rejected}${DRY_RUN ? " (dry-run, non appliqué)" : " (UPDATE NULL appliqué)"}`);
  console.log(`  Erreurs      : ${stats.errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
