/**
 * Corrections ciblées du 2026-09-28 (todo, signalements hors lot) : bloc RSE
 * d'Alpexpo sur business-hydro, commune du Parc des Expositions d'Angers sur
 * sepem-angers. MDX produits par un correcteur puis validés par un reviewer
 * indépendant (handoff/corrections-2026-09-28/out/REPORT.md et REVIEW.md).
 *
 * Contrôles avant écriture : aucun composant hors liste blanche, pas de tiret
 * cadratin, pas de table pipe, MDX compilable. Verrou optimiste : le MDX en base
 * doit être identique au dump d'entrée (input/<slug>.json).
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-corrections-2026-09-28-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const DIR = join(process.cwd(), "handoff/corrections-2026-09-28");
const SLUGS = ["business-hydro", "sepem-angers"];

async function checkMdx(label: string, mdx: string): Promise<string[]> {
  const issues: string[] = [];
  if (mdx.includes("—")) issues.push(`${label} : tiret cadratin`);
  for (const m of mdx.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!["HistoryTable", "BudgetTable", "DataMissing"].includes(m[1])) issues.push(`${label} : composant non fourni <${m[1]}>`);
  }
  if (/^\s*\|.*\|\s*$/m.test(mdx)) issues.push(`${label} : table en syntaxe pipe`);
  try {
    const { compile } = await import("@mdx-js/mdx");
    await compile(mdx, { outputFormat: "function-body" });
  } catch (e) {
    issues.push(`${label} : MDX non compilable (${(e as Error).message.slice(0, 120)})`);
  }
  return issues;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of SLUGS) {
    const input = JSON.parse(readFileSync(join(DIR, "input", `${slug}.json`), "utf8"));
    const before = Array.isArray(input) ? input[0] : input;
    const fr = readFileSync(join(DIR, "out", `${slug}.fr.mdx`), "utf8");
    const en = readFileSync(join(DIR, "out", `${slug}.en.mdx`), "utf8");

    const { data: row, error } = await sb.from("salons").select("editorial_mdx, editorial_mdx_en").eq("slug", slug).single();
    if (error) throw error;
    if (row.editorial_mdx === fr && row.editorial_mdx_en === en) {
      console.log(`DÉJÀ APPLIQUÉ ${slug}`);
      continue;
    }
    if (row.editorial_mdx !== before.editorial_mdx || row.editorial_mdx_en !== before.editorial_mdx_en) {
      console.log(`REFUS ${slug} : la fiche a changé depuis le dump d'entrée`);
      continue;
    }
    const issues = [...(await checkMdx(`${slug} FR`, fr)), ...(await checkMdx(`${slug} EN`, en))];
    if (issues.length) {
      console.log(`REFUS ${slug} :\n  ${issues.join("\n  ")}`);
      continue;
    }
    if (!APPLY) {
      console.log(`À APPLIQUER ${slug}`);
      continue;
    }
    const { error: upErr } = await sb.from("salons").update({ editorial_mdx: fr, editorial_mdx_en: en }).eq("slug", slug);
    if (upErr) throw upErr;
    console.log(`APPLIQUÉ ${slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
