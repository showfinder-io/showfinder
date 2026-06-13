/**
 * Dépublication de 3 fiches fantômes détectées le 2026-06-13 (vérif home) :
 * - power-gen-europe-paris : POWERGEN Europe rebrandé Enlit Europe (2019), édition
 *   2026 à Vienne en novembre, pas Paris en juin. Fiche doublement fausse.
 * - equipmag-paris : marque absorbée par Paris Retail Week (-> NRF). Doublon -> 301.
 * - cycl-eau-vichy : aucune édition Vichy en 2026 (Cycl'eau itinérant).
 * Idempotent. Dry-run par défaut ; --apply.
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
(async () => {
  console.log(APPLY?"=== APPLY ===":"=== DRY-RUN ===");
  for (const slug of ["power-gen-europe-paris","equipmag-paris","cycl-eau-vichy"]) {
    const { data } = await sb.from("salons").select("status").eq("slug",slug).maybeSingle();
    if (!data) { console.log(`  ${slug}: ABSENT`); continue; }
    console.log(`  ${slug}: ${data.status} -> draft`);
    if (APPLY) {
      const { error } = await sb.from("salons").update({ status:"draft" } as never).eq("slug",slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }
  console.log(APPLY?"=== APPLIQUÉ ===":"=== DRY-RUN terminé ===");
})().catch(e=>{console.error(e);process.exit(1);});
