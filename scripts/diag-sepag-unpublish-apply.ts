// Dépublie la fiche fantôme sepag (décision Julien 2026-09-25) : le SEPAG a
// fusionné en 2020 dans RSD3 (CCI Drôme-Ardèche, Valence, rsd3.fr), la fiche
// n'avait ni dates ni site joignable. 301 vers /secteurs/agroalimentaire dans
// next.config.ts. Garde-fou : n'écrit que si la fiche est published.
// Dry-run par défaut ; --apply pour écrire.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-sepag-unpublish-apply.ts [--apply]
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
(async () => {
  const { data, error } = await sb.from("salons").select("status,notes_internes").eq("slug", "sepag").maybeSingle();
  if (error) throw error;
  if (data?.status !== "published") { console.log(`SKIP sepag: ${JSON.stringify(data?.status)}`); return; }
  const note = "Dépubliée le 2026-09-25 : SEPAG fusionné en 2020 dans RSD3 (https://www.rsd3.fr/), fiche RSD3 à créer.";
  console.log("UNPUBLISH sepag");
  if (APPLY) {
    const { error: e } = await sb.from("salons").update({ status: "draft", notes_internes: [data.notes_internes, note].filter(Boolean).join("\n") } as never).eq("slug", "sepag");
    if (e) throw e;
  }
})();
