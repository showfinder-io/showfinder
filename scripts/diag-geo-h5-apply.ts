/**
 * Application du lot GEO H5 (2026-10-02) : contenus validés par le process
 * writer + 2 reviewers + traduction (handoff/geo-h5/).
 *
 * 1. MDX éditorial FR + EN des secteurs franchise-commerce et
 *    tourisme-hotellerie (sauvegarde de l'état précédent dans scripts/output/).
 * 2. Corrections factuelles relevées par les reviewers sur source primaire :
 *    - iftm-top-resa : édition 2027 (5-7 octobre 2027, iftm.fr, relu en pass-1
 *      et pass-2), sans quoi la page tourisme et la fiche se contredisent.
 *    - franchise-expo-paris : organisateur Infopro Digital (franchiseparis.com).
 *    - salon-sme-paris : organisateur Planète micro-entreprises (salonsme.com).
 *
 * La fiche la-dive-bouteille passe par diag-cohorte-trafic-apply.ts (draft
 * puis --publish), le guide blog par une PR (content/blog/).
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-geo-h5-apply.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const DIR = "handoff/geo-h5";

const SECTORS = ["franchise-commerce", "tourisme-hotellerie"];

const SALON_FIXES: { slug: string; expect: Record<string, unknown>; set: Record<string, unknown> }[] = [
  {
    slug: "iftm-top-resa",
    expect: { start_date: "2026-09-15", end_date: "2026-09-17", edition_year: 2026 },
    set: { start_date: "2027-10-05", end_date: "2027-10-07", edition_year: 2027, dates_confirmed: true },
  },
  { slug: "franchise-expo-paris", expect: {}, set: { organizer_name: "Infopro Digital" } },
  { slug: "salon-sme-paris", expect: {}, set: { organizer_name: "Planète micro-entreprises" } },
];

// Garde-fous MDX en base : pas de JSX, pas de "<" brut, pas de tiret long.
function checkMdx(label: string, mdx: string) {
  if (/</.test(mdx)) throw new Error(`${label} : "<" présent`);
  if (/[—–]/.test(mdx)) throw new Error(`${label} : tiret long ou demi-cadratin`);
  if (mdx.length < 5000) throw new Error(`${label} : ${mdx.length} caractères, trop court`);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  mkdirSync("scripts/output", { recursive: true });
  // Sauvegarde écrite AVANT chaque écriture, pour pouvoir revenir en arrière.
  const backup: Record<string, unknown> = {};
  const backupPath = `scripts/output/geo-h5-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const saveBackup = () => APPLY && writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  for (const slug of SECTORS) {
    const fr = readFileSync(`${DIR}/secteur-${slug}.mdx`, "utf-8").trim();
    const en = readFileSync(`${DIR}/secteur-${slug}.en.mdx`, "utf-8").trim();
    checkMdx(`${slug} FR`, fr);
    checkMdx(`${slug} EN`, en);
    const { data: row, error } = await sb.from("sectors").select("slug,editorial_mdx,editorial_mdx_en").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    backup[`sector:${slug}`] = row;
    saveBackup();
    if (row.editorial_mdx === fr && row.editorial_mdx_en === en) {
      console.log(`OK ${slug} : déjà à jour`);
      continue;
    }
    console.log(`UPDATE secteur ${slug} : FR ${row.editorial_mdx?.length ?? 0} -> ${fr.length}, EN ${row.editorial_mdx_en?.length ?? 0} -> ${en.length}`);
    if (APPLY) {
      const { error: e } = await sb
        .from("sectors")
        .update({ editorial_mdx: fr, editorial_mdx_en: en, editorial_updated_at: new Date().toISOString() } as never)
        .eq("slug", slug);
      if (e) throw new Error(`${slug}: ${e.message}`);
    }
  }

  for (const fix of SALON_FIXES) {
    const cols = Array.from(new Set(["slug", ...Object.keys(fix.expect), ...Object.keys(fix.set)])).join(",");
    const { data: row, error } = await sb.from("salons").select(cols).eq("slug", fix.slug).single();
    if (error) throw new Error(`${fix.slug}: ${error.message}`);
    const r = row as unknown as Record<string, unknown>;
    backup[`salon:${fix.slug}`] = r;
    saveBackup();
    if (Object.entries(fix.set).every(([k, v]) => r[k] === v)) {
      console.log(`OK ${fix.slug} : déjà à jour`);
      continue;
    }
    const drift = Object.entries(fix.expect).filter(([k, v]) => r[k] !== v);
    if (drift.length) {
      console.log(`SKIP ${fix.slug} : état inattendu ${JSON.stringify(Object.fromEntries(drift.map(([k]) => [k, r[k]])))}`);
      continue;
    }
    console.log(`UPDATE salon ${fix.slug} : ${Object.keys(fix.set).map((k) => `${k} ${JSON.stringify(r[k])} -> ${JSON.stringify(fix.set[k])}`).join(", ")}`);
    if (APPLY) {
      const { error: e } = await sb.from("salons").update(fix.set as never).eq("slug", fix.slug);
      if (e) throw new Error(`${fix.slug}: ${e.message}`);
    }
  }

  if (APPLY) console.log(`Sauvegarde de l'état précédent : ${backupPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
