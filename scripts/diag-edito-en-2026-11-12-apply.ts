// Relecture EN des fiches salon les plus vues en anglais (chantier croissance du 2026-11-12,
// go Julien). Applique handoff/edito-en-2026-11-12/proposals.json, corrigé par la review
// indépendante handoff/edito-en-2026-11-12/review.md, aux seules fiches validées passées en
// argument :
//   - seo_title_en et seo_description_en proposés (actions « retitrer ») ;
//   - corrections du MDX EN : remplacement exact d'un passage cité, seulement s'il apparaît une
//     seule fois dans editorial_mdx_en.
// Les valeurs corrigées par la review sont à reporter d'abord dans proposals.json (fichier
// final : handoff/edito-en-2026-11-12/proposals.final.json s'il existe, sinon proposals.json).
// Contrôles : title <= 60 caractères, description <= 160, pas de tiret cadratin, MDX EN compilable.
// Verrou optimiste : n'écrit que si les valeurs actuelles sont celles lues par la relecture.
// Dry-run par défaut ; --apply pour écrire. Idempotent.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-edito-en-2026-11-12-apply.ts [--apply] slug ...

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const DIR = "handoff/edito-en-2026-11-12";
const FILE = existsSync(`${DIR}/proposals.final.json`) ? `${DIR}/proposals.final.json` : `${DIR}/proposals.json`;

type Issue = { quote: string; replacement: string };
type Proposal = {
  slug: string;
  action: string;
  current: { seo_title_en: string | null; seo_description_en: string | null };
  proposed?: { seo_title_en?: string; seo_description_en?: string; description_en?: string };
  mdx_en?: { issues?: Issue[] };
};

async function compiles(mdx: string): Promise<string | null> {
  try {
    const { compile } = await import("@mdx-js/mdx");
    await compile(mdx, { outputFormat: "function-body" });
    return null;
  } catch (e) {
    return (e as Error).message.slice(0, 120);
  }
}

(async () => {
  if (!ONLY.length) throw new Error("passer les slugs validés par la review en argument");
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===", FILE);
  const proposals: Proposal[] = JSON.parse(readFileSync(FILE, "utf8"));
  let ok = 0;
  for (const slug of ONLY) {
    const p = proposals.find((x) => x.slug === slug);
    if (!p) { console.log(`ABSENT ${slug}`); continue; }
    const { data: s, error } = await sb.from("salons").select("seo_title_en,seo_description_en,description_en,editorial_mdx_en").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    const issues: string[] = [];
    const patch: Record<string, string> = {};

    if (p.action === "retitrer" && p.proposed) {
      const t = p.proposed.seo_title_en, d = p.proposed.seo_description_en;
      if (t && t !== s.seo_title_en) {
        if (s.seo_title_en !== p.current.seo_title_en) issues.push("seo_title_en modifié depuis la relecture");
        if (t.length > 60) issues.push(`title ${t.length} car.`);
        patch.seo_title_en = t;
      }
      if (d && d !== s.seo_description_en) {
        if (s.seo_description_en !== p.current.seo_description_en) issues.push("seo_description_en modifié depuis la relecture");
        if (d.length > 160) issues.push(`description ${d.length} car.`);
        patch.seo_description_en = d;
      }
      // description_en (texte court de la fiche) quand la relecture l'a trouvé périmé (ex. sitl).
      if (p.proposed.description_en && p.proposed.description_en !== s.description_en) patch.description_en = p.proposed.description_en;
    }

    let mdx = String(s.editorial_mdx_en ?? "");
    let replaced = 0;
    for (const it of p.mdx_en?.issues ?? []) {
      if (!it.quote || it.replacement === undefined) continue;
      if (mdx.includes(it.replacement) && !mdx.includes(it.quote)) continue; // déjà appliqué
      const n = mdx.split(it.quote).length - 1;
      if (n !== 1) { issues.push(`passage trouvé ${n} fois : « ${it.quote.slice(0, 60)} »`); continue; }
      mdx = mdx.replace(it.quote, it.replacement);
      replaced++;
    }
    if (replaced) {
      const err = await compiles(mdx);
      if (err) issues.push(`MDX EN non compilable (${err})`);
      patch.editorial_mdx_en = mdx;
    }
    for (const [k, v] of Object.entries(patch)) if (v.includes("—")) issues.push(`${k} : tiret cadratin`);

    if (issues.length) { console.log(`REJET ${slug} :\n  - ${issues.join("\n  - ")}`); continue; }
    if (!Object.keys(patch).length) { console.log(`DÉJÀ APPLIQUÉ ${slug}`); ok++; continue; }
    console.log(`UPDATE ${slug} : ${Object.keys(patch).join(", ")}${replaced ? ` (${replaced} correction(s) MDX)` : ""}`);
    if (APPLY) {
      const { error: e } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (e) throw new Error(`${slug}: ${e.message}`);
    }
    ok++;
  }
  console.log(`\n${ok}/${ONLY.length} fiches ${APPLY ? "appliquées" : "applicables"}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
