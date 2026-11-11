/**
 * Application de l'enrichissement de la page secteur agriculture (2026-10-04,
 * tasks/todo.md H8) : contenus validés par le process writer + 2 reviewers +
 * correcteurs + traduction (handoff/secteur-agriculture/, hors git).
 *
 * 1. MDX éditorial FR + EN et description courte FR + EN (meta description)
 *    du secteur agriculture. Sauvegarde de l'état précédent dans scripts/output/.
 * 2. Rolls de fiches relevés par le writer sur source officielle et relus par
 *    les reviewers (dates et edition_year uniquement, même périmètre que la
 *    routine roll, CLAUDE.md règle 14), pour que la page secteur et les fiches
 *    ne se contredisent pas. Chaque roll est protégé par un état attendu.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-secteur-agriculture-apply.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const DIR = "handoff/secteur-agriculture";
const SLUG = "agriculture";

// Rolls validés par les reviewers (remplis après la pass-2). Vide = aucun roll.
const SALON_FIXES: { slug: string; expect: Record<string, unknown>; set: Record<string, unknown>; source: string }[] = [
  {
    // techovin.fr, home relue le 2026-10-04 : « Les 8 & 9 Septembre 2027 », Bellac inchangé.
    // La base portait 1er-2 septembre 2027 avec dates_confirmed=true (erreur de saisie).
    slug: "tech-ovin-bellac",
    expect: { start_date: "2027-09-01", end_date: "2027-09-02", edition_year: 2027 },
    set: { start_date: "2027-09-08", end_date: "2027-09-09" },
    source: "techovin.fr",
  },
  {
    // salon-agricole.com, home relue le 2026-10-04 : « Salon Régional de l'Agriculture Tarbes
    // Du 11 au 14 mars 2027, 50e édition ». Même ville, même organisateur.
    slug: "foire-agricole-tarbes",
    expect: { start_date: "2026-03-05", end_date: "2026-03-08", edition_year: 2026 },
    set: { start_date: "2027-03-11", end_date: "2027-03-14", edition_year: 2027, dates_confirmed: true },
    source: "salon-agricole.com",
  },
];

// Garde-fous MDX en base : pas de JSX, pas de "<" brut, pas de tiret long, longueur.
function checkMdx(label: string, mdx: string) {
  if (/</.test(mdx)) throw new Error(`${label} : "<" présent`);
  if (/[—–]/.test(mdx)) throw new Error(`${label} : tiret long ou demi-cadratin`);
  if (mdx.length < 8000) throw new Error(`${label} : ${mdx.length} caractères, trop court`);
}
function checkDescription(label: string, d: string) {
  if (/[—–<]/.test(d)) throw new Error(`${label} : caractère interdit`);
  if (d.length < 120 || d.length > 170) throw new Error(`${label} : ${d.length} caractères (attendu 140 à 160)`);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  mkdirSync("scripts/output", { recursive: true });
  const backup: Record<string, unknown> = {};
  const backupPath = `scripts/output/secteur-agriculture-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const saveBackup = () => APPLY && writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  const fr = readFileSync(`${DIR}/secteur-${SLUG}.mdx`, "utf-8").trim();
  const en = readFileSync(`${DIR}/secteur-${SLUG}.en.mdx`, "utf-8").trim();
  const descFr = readFileSync(`${DIR}/secteur-${SLUG}.description.txt`, "utf-8").trim();
  const descEn = readFileSync(`${DIR}/secteur-${SLUG}.description.en.txt`, "utf-8").trim();
  checkMdx("FR", fr);
  checkMdx("EN", en);
  checkDescription("description FR", descFr);
  checkDescription("description EN", descEn);

  const { data: row, error } = await sb
    .from("sectors")
    .select("slug,editorial_mdx,editorial_mdx_en,description,description_en,editorial_updated_at")
    .eq("slug", SLUG)
    .single();
  if (error) throw new Error(`${SLUG}: ${error.message}`);
  const r = row as unknown as Record<string, string | null>;
  backup[`sector:${SLUG}`] = r;
  saveBackup();

  const next = { editorial_mdx: fr, editorial_mdx_en: en, description: descFr, description_en: descEn };
  const changed = Object.entries(next).filter(([k, v]) => r[k] !== v);
  if (!changed.length) {
    console.log(`OK secteur ${SLUG} : déjà à jour`);
  } else {
    for (const [k, v] of changed) console.log(`UPDATE secteur ${SLUG}.${k} : ${r[k]?.length ?? 0} -> ${v.length} caractères`);
    if (APPLY) {
      const { error: e } = await sb
        .from("sectors")
        .update({ ...next, editorial_updated_at: new Date().toISOString() } as never)
        .eq("slug", SLUG);
      if (e) throw new Error(`${SLUG}: ${e.message}`);
    }
  }

  for (const fix of SALON_FIXES) {
    const cols = Array.from(new Set(["slug", ...Object.keys(fix.expect), ...Object.keys(fix.set)])).join(",");
    const { data: s, error: se } = await sb.from("salons").select(cols).eq("slug", fix.slug).single();
    if (se) throw new Error(`${fix.slug}: ${se.message}`);
    const sr = s as unknown as Record<string, unknown>;
    backup[`salon:${fix.slug}`] = sr;
    saveBackup();
    if (Object.entries(fix.set).every(([k, v]) => sr[k] === v)) {
      console.log(`OK ${fix.slug} : déjà à jour`);
      continue;
    }
    const drift = Object.entries(fix.expect).filter(([k, v]) => sr[k] !== v);
    if (drift.length) {
      console.log(`SKIP ${fix.slug} : état inattendu ${JSON.stringify(Object.fromEntries(drift.map(([k]) => [k, sr[k]])))}`);
      continue;
    }
    console.log(`UPDATE salon ${fix.slug} (${fix.source}) : ${Object.keys(fix.set).map((k) => `${k} ${JSON.stringify(sr[k])} -> ${JSON.stringify(fix.set[k])}`).join(", ")}`);
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
