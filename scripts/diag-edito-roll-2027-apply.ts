/**
 * Application du refresh éditorial des fiches roulées (roll 2027, todo E6).
 * Lit handoff/edito-roll-2027/final/<slug>.{fr.mdx,en.mdx,meta.json} (process
 * writer + reviewer + correcteur-traducteur, cf. handoff/edito-roll-2027/BRIEF.md)
 * et met à jour editorial_mdx, editorial_mdx_en et les champs SEO.
 *
 * Contrôles mécaniques avant écriture : MDX compilable, aucun composant hors
 * liste blanche, composants existants conservés, aucune table pipe, aucun tiret cadratin, liens internes existants, année de
 * l'édition courante présente. Verrou optimiste : la fiche ne doit pas avoir
 * changé depuis le dump d'entrée. Un champ SEO null à l'entrée reste null.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-edito-roll-2027-apply.ts [--apply] [slug ...]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const DIR = join(process.cwd(), "handoff/edito-roll-2027");
const SEO_FIELDS = ["seo_title", "seo_description", "seo_title_en", "seo_description_en"] as const;

const published: { salons: string[]; lieux: string[]; secteurs: string[] } = JSON.parse(readFileSync(join(DIR, "published-slugs.json"), "utf8"));

async function checkMdx(label: string, mdx: string, year: number): Promise<string[]> {
  const issues: string[] = [];
  if (mdx.includes("—")) issues.push(`${label} : tiret cadratin`);
  // Seuls composants fournis par src/components/mdx/salon-mdx-components.tsx.
  for (const m of mdx.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!["HistoryTable", "BudgetTable", "DataMissing"].includes(m[1])) issues.push(`${label} : balise ou composant non fourni <${m[1]}>`);
  }
  if (/^\s*\|.*\|\s*$/m.test(mdx)) issues.push(`${label} : table en syntaxe pipe`);
  if (!mdx.includes(String(year))) issues.push(`${label} : année ${year} absente`);
  for (const m of mdx.matchAll(/\]\((?:\/en)?\/(salons|lieux|secteurs)\/([a-z0-9-]+)[)#?]/g)) {
    const list = published[m[1] as "salons" | "lieux" | "secteurs"];
    if (!list.includes(m[2])) issues.push(`${label} : lien interne cassé /${m[1]}/${m[2]}`);
  }
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
  const slugs = readdirSync(join(DIR, "final"))
    .filter((f) => f.endsWith(".meta.json"))
    .map((f) => f.replace(".meta.json", ""))
    .filter((s) => !ONLY.length || ONLY.includes(s));

  let ok = 0;
  for (const slug of slugs) {
    const input = JSON.parse(readFileSync(join(DIR, "input", `${slug}.json`), "utf8")).fiche;
    const meta = JSON.parse(readFileSync(join(DIR, "final", `${slug}.meta.json`), "utf8"));
    const frPath = join(DIR, "final", `${slug}.fr.mdx`);
    const enPath = join(DIR, "final", `${slug}.en.mdx`);
    if (!existsSync(frPath) || !existsSync(enPath)) {
      console.log(`REJET ${slug} : MDX final FR ou EN manquant`);
      continue;
    }
    const fr = readFileSync(frPath, "utf8").trim();
    const en = readFileSync(enPath, "utf8").trim();

    const issues = [...(await checkMdx("FR", fr, input.edition_year)), ...(await checkMdx("EN", en, input.edition_year))];
    // Un composant présent en production ne doit pas disparaître au refresh.
    for (const c of ["<HistoryTable", "<BudgetTable"]) {
      if (input.editorial_mdx.includes(c) && !fr.includes(c)) issues.push(`FR : composant ${c}> supprimé`);
      if (String(input.editorial_mdx_en).includes(c) && !en.includes(c)) issues.push(`EN : composant ${c}> supprimé`);
    }
    for (const f of SEO_FIELDS) {
      if (input[f] === null && meta[f] != null) issues.push(`${f} était null et doit le rester`);
      if (input[f] !== null && !meta[f]) issues.push(`${f} renseigné à l'entrée mais absent du final`);
      if (meta[f] && !String(meta[f]).includes(String(input.edition_year))) issues.push(`${f} sans l'année ${input.edition_year}`);
      if (meta[f] && String(meta[f]).includes("—")) issues.push(`${f} : tiret cadratin`);
    }

    const { data: live, error } = await sb.from("salons").select("editorial_mdx,start_date").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (live.editorial_mdx === fr) {
      console.log(`DÉJÀ APPLIQUÉ ${slug}`);
      ok++;
      continue;
    }
    if (live.editorial_mdx !== input.editorial_mdx) issues.push("fiche modifiée en base depuis le dump d'entrée");
    if (live.start_date !== input.start_date) issues.push("dates modifiées en base depuis le dump d'entrée");

    if (issues.length) {
      console.log(`REJET ${slug} :\n  - ${issues.join("\n  - ")}`);
      continue;
    }
    const patch: Record<string, unknown> = { editorial_mdx: fr, editorial_mdx_en: en };
    for (const f of SEO_FIELDS) if (input[f] !== null) patch[f] = meta[f];
    console.log(`UPDATE ${slug} : FR ${input.editorial_mdx.length}c -> ${fr.length}c | EN ${String(input.editorial_mdx_en).length}c -> ${en.length}c | SEO ${Object.keys(patch).filter((k) => k.startsWith("seo")).join(",") || "inchangé"}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
    ok++;
  }
  console.log(`\n${ok}/${slugs.length} fiches ${APPLY ? "appliquées" : "applicables"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
