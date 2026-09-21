/**
 * Retrait du badge "vérifié" sur deux prestataires du seed d'avril 2026 dont l'identité n'a pas
 * pu être confirmée par la review du 2026-09-21 (règle P33, tasks/regles-edito-prestataires-v1.md) :
 * - db-schenker-paris : dbschenker.com redirige (301) vers dsv.com, aucune entité événementielle
 *   française identifiable, aucun match au registre des entreprises.
 * - pico-international-paris : pico.com est le site corporate mondial du groupe, sans page ni
 *   adresse d'entité française.
 * Décision Julien 2026-09-21 : on dé-vérifie (les fiches et leurs liens salons restent).
 * Idempotent. Dry-run par défaut ; --apply.
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of ["db-schenker-paris", "pico-international-paris"]) {
    const { data } = await sb.from("providers").select("is_verified").eq("slug", slug).maybeSingle();
    if (!data) { console.log(`  ${slug}: ABSENT`); continue; }
    console.log(`  ${slug}: is_verified ${data.is_verified} -> false`);
    if (APPLY && data.is_verified) {
      const { error } = await sb.from("providers").update({ is_verified: false } as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }
  console.log(APPLY ? "=== APPLIQUÉ ===" : "=== DRY-RUN terminé ===");
})().catch((e) => { console.error(e); process.exit(1); });
