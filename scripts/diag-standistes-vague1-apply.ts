/**
 * Vague 1 des standistes (go Julien du 2026-11-13) : 12 fiches du groupe A
 * (tasks/prestataires-g15-2026-11-12.md) situées à Paris (75) et dans le Rhône (69),
 * relues sur sources (tasks/relecture-standistes-vague1/<slug>.md, méthode de
 * tasks/relecture-agent-prestataires-2026-11-12.md).
 *
 * Lit le verdict (titre « <slug> : OK | CORRECTIONS | NE PAS OUVRIR ») et, pour
 * CORRECTIONS, le dernier bloc ```json {"slug", "set": {...}} de chaque rapport.
 *  - sans option : dry-run (affiche avant -> après) ;
 *  - --apply : écrit les corrections, editorial_reviewed_at = maintenant ;
 *  - --open : passe seo_indexable à true pour les fiches OK ou CORRIGÉES (corrections
 *    déjà en base, vérifié), puis IndexNow. Les fiches NE PAS OUVRIR restent en noindex.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-standistes-vague1-apply.ts [--apply|--open]
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { localizedUrls, submitIndexNow } from "../src/lib/indexnow";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "tasks/relecture-standistes-vague1";
const APPLY = process.argv.includes("--apply");
const OPEN = process.argv.includes("--open");
const SLUGS = "r2-stand-et-event merci-gustave agence-procept arc-et-typ cap-linea idee-fixe equateur-expo la-p-tite-histoire square-meters-paris stand-by-me media-product laps-concept".split(" ");
const FIELDS = ["description", "description_en", "city", "postal_code", "department", "phone", "email", "founded_year", "specialties", "memberships", "category", "zone_intervention"];
// Corrigées mais pas ouvertes : critère du groupe B (ni e-mail ni téléphone après relecture)
const HOLD: Record<string, string> = {
  "equateur-expo": "aucun contact publié par le site (formulaire seul), critère groupe B",
};
const CATEGORIES = ["standiste", "traiteur", "av_technique", "photographe", "transport", "hebergement", "autre"];

type Verdict = "OK" | "CORRECTIONS" | "NE PAS OUVRIR";

function readReport(slug: string): { verdict: Verdict; set: Record<string, unknown> } {
  const md = readFileSync(`${DIR}/${slug}.md`, "utf8");
  const m = md.match(new RegExp(`^#+\\s*${slug}\\s*:\\s*(OK|CORRECTIONS|NE PAS OUVRIR)\\b`, "m"));
  if (!m) throw new Error(`${slug} : verdict introuvable`);
  const verdict = m[1] as Verdict;
  if (verdict !== "CORRECTIONS") return { verdict, set: {} };
  const blocks = [...md.matchAll(/```json\s*\n([\s\S]*?)```/g)];
  if (!blocks.length) throw new Error(`${slug} : CORRECTIONS sans bloc json`);
  const obj = JSON.parse(blocks[blocks.length - 1][1]);
  if (obj.slug !== slug) throw new Error(`${slug} : slug du bloc json = ${obj.slug}`);
  for (const [k, v] of Object.entries(obj.set ?? {})) {
    if (!FIELDS.includes(k)) throw new Error(`${slug} : champ ${k} non admis`);
    if (typeof v === "string" && v.includes("—")) throw new Error(`${slug}.${k} : tiret cadratin`);
    if ((k === "description" || k === "description_en") && (typeof v !== "string" || v.length < 200)) throw new Error(`${slug}.${k} : texte vide ou trop court`);
    if (k === "category" && !CATEGORIES.includes(v as string)) throw new Error(`${slug} : catégorie ${v}`);
  }
  return { verdict, set: obj.set ?? {} };
}

const show = (v: unknown) => (typeof v === "string" && v.length > 80 ? `${v.length} car.` : JSON.stringify(v));

async function main() {
  console.log(OPEN ? "=== OPEN ===" : APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const reports = Object.fromEntries(SLUGS.map((s) => [s, readReport(s)]));
  const { data: rows, error } = await sb.from("providers").select(`id,slug,seo_indexable,${FIELDS.join(",")}`).in("slug", SLUGS);
  if (error) throw error;
  const bySlug = Object.fromEntries((rows as unknown as Record<string, unknown>[]).map((r) => [r.slug as string, r]));
  const opened: string[] = [];

  for (const slug of SLUGS) {
    const { verdict, set } = reports[slug];
    const row = bySlug[slug];
    if (!row) throw new Error(`${slug} : absent en base`);
    const diff = Object.entries(set).filter(([k, v]) => JSON.stringify(row[k]) !== JSON.stringify(v));
    console.log(`${slug} [${verdict}]${diff.length ? "" : " : rien à écrire"}`);
    for (const [k, v] of diff) console.log(`  ${k} : ${show(row[k])} -> ${show(v)}`);

    if (OPEN) {
      if (verdict === "NE PAS OUVRIR") { console.log("  reste noindex"); continue; }
      if (HOLD[slug]) { console.log(`  reste noindex : ${HOLD[slug]}`); continue; }
      if (diff.length) throw new Error(`${slug} : corrections pas encore en base, lancer --apply d'abord`);
      if (row.seo_indexable) { console.log("  déjà indexable"); continue; }
      const { error: e } = await sb.from("providers").update({ seo_indexable: true } as never).eq("id", row.id as string);
      if (e) throw e;
      opened.push(slug);
      console.log("  -> seo_indexable true");
      continue;
    }
    if (APPLY && diff.length) {
      const patch = { ...Object.fromEntries(diff), editorial_reviewed_at: new Date().toISOString() };
      const { error: e } = await sb.from("providers").update(patch as never).eq("id", row.id as string);
      if (e) throw e;
      console.log("  écrit");
    }
  }
  const count = (v: Verdict) => SLUGS.filter((s) => reports[s].verdict === v).length;
  console.log(`\nOK ${count("OK")}, CORRECTIONS ${count("CORRECTIONS")}, NE PAS OUVRIR ${count("NE PAS OUVRIR")}`);
  if (opened.length) console.log("IndexNow :", JSON.stringify(await submitIndexNow(opened.flatMap((s) => localizedUrls(`/prestataires/${s}`)))));
}

main().catch((e) => { console.error(e); process.exit(1); });
