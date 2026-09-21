/**
 * Insertion des pages hub prestataires (table provider_hubs) depuis les sorties du pipeline
 * (handoff/prestataires/hubs/out/<slug>.json), définitions dans provider-hubs-config.ts.
 *
 * Contrôle mécanique avant écriture (tasks/regles-edito-prestataires-v1.md, P24-P29) :
 *  - MDX simple : pas de JSX, pas de "<" ni "{" bruts, pas de table pipe (contraintes du MDX en base) ;
 *  - pas de tiret long, de point médian, de superlatif (P10, P14) ;
 *  - liens internes uniquement vers les lieux, salons et hubs du dossier (RR37 : aucun lien cassé) ;
 *  - tout nombre du texte existe dans le dossier (P26 : ni prix, ni délai, ni statistique) ;
 *  - longueurs : seo_title <= 65, seo_description 120 à 170, éditorial FR 2 000 à 4 000 caractères.
 * Idempotent (upsert par slug). Dry-run par défaut ; --apply.
 */
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { HUBS } from "./provider-hubs-config";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const BASE = "handoff/prestataires/hubs";

type HubOut = {
  slug: string; h1: string; h1_en: string; seo_title: string; seo_title_en: string;
  seo_description: string; seo_description_en: string; editorial_mdx: string; editorial_mdx_en: string;
};

const BANNED = /[—–·]|\b(leader|incontournable|meilleur|meilleure|meilleurs|premium|haut de gamme|innovant|unique|d'exception|exceptionnel|prestigieux|en moyenne|la plupart des exposants)\b/i;

function lint(out: HubOut, dossierRaw: string): string[] {
  const errors: string[] = [];
  const dossier = JSON.parse(dossierRaw);
  const allowed = new Set<string>([
    ...dossier.venues_in_zone, ...dossier.published_salons_in_zone, ...dossier.sibling_hubs,
  ].map((x: { internal_link: string }) => x.internal_link).concat(["/prestataires", "/salons", "/contact"]));
  for (const [field, text] of [["editorial_mdx", out.editorial_mdx], ["editorial_mdx_en", out.editorial_mdx_en]] as const) {
    if (/[<{}]/.test(text)) errors.push(`${field} : "<", "{" ou "}" brut`);
    if (/^\s*\|.*\|\s*$/m.test(text)) errors.push(`${field} : table pipe`);
    for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) if (!allowed.has(m[1])) errors.push(`${field} : lien interne hors dossier ${m[1]}`);
    for (const m of text.matchAll(/\]\((https?:[^)\s]*)\)/g)) errors.push(`${field} : lien externe ${m[1]}`);
    for (const num of text.match(/\d+/g) ?? []) if (!dossierRaw.includes(num)) errors.push(`${field} : nombre ${num} absent du dossier (P26)`);
  }
  for (const [field, text] of Object.entries(out)) if (typeof text === "string" && field !== "slug") {
    const m = text.match(BANNED);
    if (m && !(field.endsWith("_en") && /^[a-z]/i.test(m[0]))) errors.push(`${field} : "${m[0]}" interdit (P10, P14, P27)`);
  }
  if (out.seo_title.length > 65) errors.push(`seo_title ${out.seo_title.length} car. (max 65)`);
  if (out.seo_description.length < 120 || out.seo_description.length > 170) errors.push(`seo_description ${out.seo_description.length} car. (120 à 170)`);
  if (out.editorial_mdx.length < 2000 || out.editorial_mdx.length > 4000) errors.push(`editorial_mdx ${out.editorial_mdx.length} car. (2 000 à 4 000)`);
  return errors;
}

(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let failed = 0;
  for (const hub of HUBS) {
    const outFile = `${BASE}/out/${hub.slug}.json`;
    if (!existsSync(outFile)) { console.log(`  ${hub.slug}: sortie absente`); failed++; continue; }
    const out: HubOut = JSON.parse(readFileSync(outFile, "utf-8"));
    const errors = lint(out, readFileSync(`${BASE}/dossiers/${hub.slug}.json`, "utf-8"));
    if (errors.length) { failed++; console.log(`✗ ${hub.slug}`); errors.forEach((e) => console.log(`    ${e}`)); continue; }
    console.log(`✓ ${hub.slug}: "${out.seo_title}" (${out.editorial_mdx.length} car.)`);
    if (APPLY) {
      const { error } = await sb.from("provider_hubs").upsert({
        slug: hub.slug, category: hub.category, departments: [...hub.departments],
        zone_label: hub.zone_label, zone_label_en: hub.zone_label_en,
        h1: out.h1, h1_en: out.h1_en, seo_title: out.seo_title, seo_title_en: out.seo_title_en,
        seo_description: out.seo_description, seo_description_en: out.seo_description_en,
        editorial_mdx: out.editorial_mdx, editorial_mdx_en: out.editorial_mdx_en,
        editorial_updated_at: new Date().toISOString(),
      } as never, { onConflict: "slug" });
      if (error) throw new Error(`${hub.slug}: ${error.message}`);
    }
  }
  if (failed) process.exitCode = 1;
  console.log(APPLY ? "=== APPLIQUÉ ===" : "=== DRY-RUN terminé ===");
})().catch((e) => { console.error(e); process.exit(1); });
