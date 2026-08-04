/**
 * Strip suffixe "| Agoris" (2026-08-04) : le layout ajoute déjà " | Agoris" à
 * tous les titles, mais certaines fiches ont AUSSI le suffixe écrit à la main
 * dans seo_title / seo_title_en, ce qui rend "<title>... | Agoris | Agoris</title>"
 * en prod. Ce script retire le suffixe final des deux colonnes.
 * Idempotent : la sélection se fait sur le contenu courant en DB, une fiche
 * déjà nettoyée ne matche plus. Dry-run par défaut ; --apply pour écrire.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-strip-agoris-suffix.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

// Suffixe final uniquement : un "| Agoris" en milieu de titre serait un autre
// problème, à traiter à la main, pas par ce script.
const SUFFIX_RE = /\s*\|\s*Agoris\s*$/;

async function main() {
  const { data, error } = await sb
    .from("salons")
    .select("id, slug, seo_title, seo_title_en")
    .or("seo_title.ilike.%| Agoris,seo_title_en.ilike.%| Agoris")
    .order("slug");
  if (error) throw error;
  if (!data || data.length === 0) {
    console.log("Aucune fiche avec suffixe | Agoris : rien à faire.");
    return;
  }

  console.log(`${data.length} fiche(s) à nettoyer (${APPLY ? "APPLY" : "dry-run"})\n`);
  let updated = 0;
  for (const salon of data) {
    const patch: { seo_title?: string; seo_title_en?: string } = {};
    if (salon.seo_title && SUFFIX_RE.test(salon.seo_title)) {
      patch.seo_title = salon.seo_title.replace(SUFFIX_RE, "");
    }
    if (salon.seo_title_en && SUFFIX_RE.test(salon.seo_title_en)) {
      patch.seo_title_en = salon.seo_title_en.replace(SUFFIX_RE, "");
    }
    if (Object.keys(patch).length === 0) continue;

    console.log(`- ${salon.slug}`);
    if (patch.seo_title) console.log(`    fr: "${salon.seo_title}" -> "${patch.seo_title}"`);
    if (patch.seo_title_en) console.log(`    en: "${salon.seo_title_en}" -> "${patch.seo_title_en}"`);

    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch).eq("id", salon.id);
      if (upErr) {
        console.error(`    ERREUR: ${upErr.message}`);
        continue;
      }
      updated++;
    }
  }

  if (APPLY) console.log(`\n${updated}/${data.length} fiche(s) mise(s) à jour.`);
  else console.log("\nDry-run : aucune écriture. Relancer avec --apply pour appliquer.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
