/**
 * Soumission IndexNow (Bing, Yandex, Ecosia, Yahoo...) : notifie les moteurs
 * partenaires d'URLs créées ou mises à jour. Complément du Request Indexing
 * GSC (qui est manuel et limité à ~10/jour).
 *
 * Usage : set -a && source .env.local && set +a && \
 *   ./node_modules/.bin/tsx scripts/indexnow-submit.ts slug1 slug2 ...   # fiches salon (FR + EN)
 *   ./node_modules/.bin/tsx scripts/indexnow-submit.ts --path /secteurs/agroalimentaire --path /blog/x
 *   ./node_modules/.bin/tsx scripts/indexnow-submit.ts --sitemap          # tout le sitemap live
 *   ... --dry-run pour lister sans envoyer.
 *
 * Requiert INDEXNOW_KEY (même valeur que sur Vercel, cf. src/lib/indexnow.ts).
 */
import { getSiteUrl, localizedUrls, submitIndexNow } from "../src/lib/indexnow";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FROM_SITEMAP = args.includes("--sitemap");

async function collectUrls(): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--path") {
      const p = args[++i];
      if (p) urls.push(...localizedUrls(p));
    } else if (!a.startsWith("--")) {
      urls.push(...localizedUrls(`/salons/${a}`));
    }
  }
  if (FROM_SITEMAP) {
    const res = await fetch(`${getSiteUrl()}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap.xml HTTP ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1].trim());
  }
  return Array.from(new Set(urls));
}

async function main() {
  const urls = await collectUrls();
  if (urls.length === 0) {
    console.error("Aucune URL. Passe des slugs, --path <chemin> ou --sitemap.");
    process.exit(1);
  }
  console.log(`${urls.length} URL(s)${DRY ? " (dry-run)" : ""} :`);
  for (const u of urls.slice(0, 20)) console.log("  " + u);
  if (urls.length > 20) console.log(`  ... (+${urls.length - 20})`);
  if (DRY) return;

  const result = await submitIndexNow(urls);
  console.log("IndexNow :", JSON.stringify(result));
  if (result.status === "error") process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
