/**
 * Harmonisation du format monétaire des textes anglais des fiches salon
 * (décision Julien 2026-10-03, F7bis c) : « €4,500 » (symbole avant, virgule
 * des milliers) au lieu de « 4,500 € » / « 4 500 € » / « 65 euros ».
 * Transformation typographique seule (scripts/lib-en-currency.mjs), aucun
 * montant modifié. Champs : editorial_mdx_en, description_en, seo_description_en.
 *
 * Dry-run par défaut ; --apply pour écrire (sauvegarde préalable dans
 * scripts/output/). Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-en-currency-apply.mts [--apply]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { compile } from "@mdx-js/mdx";
import { createClient } from "@supabase/supabase-js";
import { enCurrency } from "./lib-en-currency.mjs";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const FIELDS = ["editorial_mdx_en", "description_en", "seo_description_en"] as const;

const { data, error } = await sb.from("salons").select(`slug,${FIELDS.join(",")}`);
if (error) throw error;

const changes: { slug: string; before: Record<string, unknown>; patch: Record<string, string> }[] = [];
for (const row of data as unknown as Record<string, string | null>[]) {
  const patch: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = row[f];
    if (v && enCurrency(v) !== v) patch[f] = enCurrency(v);
  }
  if (Object.keys(patch).length) {
    if (patch.editorial_mdx_en) await compile(patch.editorial_mdx_en); // lève si le MDX ne compile plus
    changes.push({ slug: row.slug!, before: Object.fromEntries(FIELDS.map((f) => [f, row[f]])), patch });
  }
}

console.log(`${APPLY ? "APPLY" : "DRY-RUN"} : ${changes.length} fiches à harmoniser`);
if (APPLY && changes.length) {
  mkdirSync("scripts/output", { recursive: true });
  const path = `scripts/output/en-currency-backup-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(path, JSON.stringify(changes.map(({ slug, before }) => ({ slug, ...before })), null, 2));
  console.log(`Sauvegarde : ${path}`);
  for (const c of changes) {
    const { error: e } = await sb.from("salons").update(c.patch as never).eq("slug", c.slug);
    if (e) throw new Error(`${c.slug}: ${e.message}`);
  }
  console.log("Écrit.");
}
