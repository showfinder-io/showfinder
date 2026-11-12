// Partie C des arbitrages roll 2027 (tasks/roll-2027/arbitrages-2026-11-11.md, go Julien
// du 2026-11-12) : dépublie deux fiches, après déploiement de leurs 301 (next.config.ts) :
// - equipbaie-metalexpo-paris : intégré à Batimat depuis 2024 (« Equipbaie-Métalexpo by
//   Batimat », 3 pavillons, https://www.equipbaie.com figé sur 2024) -> /salons/batimat ;
// - paris-retail-week (NRF Retail's Big Show Europe) : « will return to Amsterdam in late
//   September 2028 » (https://www.nrfbigshoweurope.com/en, relevé dans Chrome le
//   2026-11-11) -> /secteurs/franchise-commerce.
// Retire aussi le lien interne vers equipbaie-metalexpo-paris dans le MDX de batimat (FR et
// EN), le texte reste. Les deux fiches retail qui citaient NRF « à Paris » sont corrigées par
// le lot éditorial handoff/edito-lot2-2026-11-12.
// Garde-fous : n'écrit que si la fiche est published ; lien retiré seulement s'il est trouvé.
// Dry-run par défaut ; --apply pour écrire. Idempotent.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-roll-partie-c-unpublish-apply.ts [--apply]

import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const UNPUBLISH: Record<string, string> = {
  "equipbaie-metalexpo-paris":
    "Dépubliée le 2026-11-12 (arbitrage roll 2027, go Julien) : intégré à Batimat depuis 2024 (« Equipbaie-Métalexpo by Batimat »), 301 vers /salons/batimat.",
  "paris-retail-week":
    "Dépubliée le 2026-11-12 (arbitrage roll 2027, go Julien) : NRF Retail's Big Show Europe quitte Paris pour Amsterdam fin septembre 2028 (nrfbigshoweurope.com), 301 vers /secteurs/franchise-commerce.",
};

(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const [slug, note] of Object.entries(UNPUBLISH)) {
    const { data, error } = await sb.from("salons").select("status,notes_internes").eq("slug", slug).single();
    if (error) throw error;
    if (data.status !== "published") { console.log(`DÉJÀ FAIT ${slug} : ${data.status}`); continue; }
    console.log(`UNPUBLISH ${slug}`);
    if (APPLY) {
      const { error: e } = await sb
        .from("salons")
        .update({ status: "draft", notes_internes: [data.notes_internes, note].filter(Boolean).join("\n") } as never)
        .eq("slug", slug)
        .eq("status", "published");
      if (e) throw e;
    }
  }

  const { data: b, error } = await sb.from("salons").select("editorial_mdx,editorial_mdx_en").eq("slug", "batimat").single();
  if (error) throw error;
  const link = /\[([^\]]+)\]\((?:\/en)?\/salons\/equipbaie-metalexpo-paris\)/g;
  const patch: Record<string, string> = {};
  for (const col of ["editorial_mdx", "editorial_mdx_en"] as const) {
    const before = String(b[col] ?? "");
    const after = before.replace(link, "$1");
    if (after !== before) patch[col] = after;
  }
  if (!Object.keys(patch).length) return console.log("DÉJÀ FAIT batimat : aucun lien vers equipbaie-metalexpo-paris");
  console.log(`UNLINK batimat : ${Object.keys(patch).join(", ")}`);
  if (APPLY) {
    const { error: e } = await sb.from("salons").update(patch as never).eq("slug", "batimat");
    if (e) throw e;
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
