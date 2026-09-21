/**
 * Purge des liens salon_providers hérités du seed d'avril 2026 (24 lignes au 2026-09-21, sur
 * 6 salons et 11 prestataires, aucune source). Décision Nicolas 2026-09-21 : on ne rattache plus
 * les prestataires aux salons, le drawer « Organiser mon stand » montre tout le monde avec un
 * filtre de proximité. La table reste en place pour le futur is_featured payant.
 * À lancer APRÈS la mise en prod du nouveau drawer (l'ancien lisait cette table).
 * Sauvegarde des lignes dans scripts/output/ (hors git) avant suppression.
 * Garde-fou : refuse de purger si le nombre de lignes dépasse l'attendu (quelqu'un aurait
 * ajouté des liens entre-temps). Idempotent. Dry-run par défaut ; --apply.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const EXPECTED_MAX = 24;
(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const { data, error } = await sb
    .from("salon_providers")
    .select("salon_id, provider_id, is_featured, salons(slug), providers(slug, subscription_tier)");
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  console.log(`  ${rows.length} lignes salon_providers`);
  for (const r of rows as unknown as Array<{ is_featured: boolean; salons: { slug: string } | null; providers: { slug: string; subscription_tier: string } | null }>) {
    console.log(`    ${r.salons?.slug} <- ${r.providers?.slug}${r.is_featured ? " (featured)" : ""}${r.providers?.subscription_tier === "premium" ? " (PREMIUM)" : ""}`);
  }
  if (rows.length === 0) { console.log("  rien à purger"); return; }
  if (rows.length > EXPECTED_MAX) throw new Error(`${rows.length} lignes > ${EXPECTED_MAX} attendues : des liens ont été ajoutés depuis le 2026-09-21, purge refusée`);
  if (!APPLY) { console.log("=== DRY-RUN terminé ==="); return; }
  mkdirSync("scripts/output", { recursive: true });
  const backup = `scripts/output/salon-providers-backup-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(backup, JSON.stringify(rows, null, 2));
  console.log(`  sauvegarde : ${backup}`);
  const { error: delError, count } = await sb.from("salon_providers").delete({ count: "exact" }).not("salon_id", "is", null);
  if (delError) throw new Error(delError.message);
  console.log(`  ${count} lignes supprimées`);
  console.log("=== APPLIQUÉ ===");
})().catch((e) => { console.error(e); process.exit(1); });
