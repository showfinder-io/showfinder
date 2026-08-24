/**
 * Correction GSC 2026-08 (rapport du 21/08) : 2 fiches publiées renvoyaient
 * 500 à cause d'un editorial_mdx invalide généré par la pipeline éditoriale :
 * - franchise-expo-lyon : composant <PricingTable /> jamais défini dans
 *   mdx-components (converti en table markdown)
 * - mwc-barcelona : "<$150" parsé comme ouverture JSX par micromark
 *   (échappé en "\<$150") + composant <HistoryTable /> (converti en table)
 * Les MDX corrigés (FR + EN) sont versionnés dans handoff/gsc-2026-08/.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && \
 *   ./node_modules/.bin/tsx scripts/diag-gsc-500-mdx-fix.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/gsc-2026-08");
const SLUGS = ["franchise-expo-lyon", "mwc-barcelona"];

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of SLUGS) {
    const fr = readFileSync(join(HANDOFF, `${slug}.fr.md`), "utf8");
    const en = readFileSync(join(HANDOFF, `${slug}.en.md`), "utf8");
    // garde-fou : le contenu corrigé ne doit plus contenir de composant JSX
    for (const [name, content] of [["fr", fr], ["en", en]] as const) {
      if (/<[A-Z]/.test(content)) throw new Error(`${slug}.${name} contient encore un composant JSX`);
    }
    const { data: row, error: readError } = await sb
      .from("salons")
      .select("id, status, editorial_mdx, editorial_mdx_en")
      .eq("slug", slug)
      .maybeSingle();
    if (readError) throw new Error(`${slug}: ${readError.message}`);
    if (!row) { console.log(`SKIP ${slug}: absent en base`); continue; }
    if (row.editorial_mdx === fr && row.editorial_mdx_en === en) {
      console.log(`OK ${slug}: déjà corrigé`);
      continue;
    }
    console.log(`UPDATE ${slug} (status=${row.status}) : editorial_mdx ${fr.length} chars, editorial_mdx_en ${en.length} chars`);
    if (!APPLY) continue;
    const { error } = await sb
      .from("salons")
      .update({ editorial_mdx: fr, editorial_mdx_en: en } as never)
      .eq("id", row.id);
    if (error) throw new Error(`${slug}: ${error.message}`);
  }
  console.log("terminé");
}

main().catch((e) => { console.error(e); process.exit(1); });
