/**
 * Application générique de corrections prestataires relues (2026-11-13) : lit un fichier JSON
 * [{ "slug": "...", "set": { <champ>: <valeur> } }] produit et relu par le process habituel
 * (sources dans le rapport .md à côté du JSON) et écrit les champs dans `providers`.
 * Utilisé pour : tasks/contacts-seed-avril-2026-11-13.json (coordonnées du seed d'avril),
 * tasks/standistes-groupe-b/apply.json (groupe B étoffé), tasks/providers-seo-en/apply.json
 * (metas et versions EN).
 * Garde-fous : champs en liste blanche, aucun tiret cadratin, metas de 120 à 160 caractères,
 * descriptions d'au moins 200 caractères, catégorie dans l'enum. Ne touche jamais seo_indexable.
 * Dry-run par défaut, --apply pour écrire (editorial_reviewed_at = maintenant si un texte change).
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-providers-set-apply.ts <fichier.json> [--apply]
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!file) throw new Error("usage : diag-providers-set-apply.ts <fichier.json> [--apply]");

const FIELDS = [
  "description", "description_en", "city", "postal_code", "department", "phone", "email", "website_url",
  "founded_year", "specialties", "specialties_en", "memberships", "category", "zone_intervention",
  "zone_intervention_en", "seo_description", "seo_description_en",
];
const TEXTS = ["description", "description_en", "seo_description", "seo_description_en"];
const CATEGORIES = ["standiste", "traiteur", "av_technique", "photographe", "transport", "hebergement", "autre", "location_mobilier"];

const show = (v: unknown) => (typeof v === "string" && v.length > 70 ? `${v.length} car.` : JSON.stringify(v));

async function main() {
  const items = JSON.parse(readFileSync(file!, "utf8")) as { slug: string; set: Record<string, unknown> }[];
  for (const { slug, set } of items) {
    for (const [k, v] of Object.entries(set)) {
      if (!FIELDS.includes(k)) throw new Error(`${slug} : champ ${k} non admis`);
      if (JSON.stringify(v).includes("—")) throw new Error(`${slug}.${k} : tiret cadratin`);
      if (k.startsWith("seo_description") && v !== null && (typeof v !== "string" || v.length < 120 || v.length > 160)) throw new Error(`${slug}.${k} : ${typeof v === "string" ? v.length : "?"} car. (attendu 120-160)`);
      if (k.startsWith("description") && (typeof v !== "string" || v.length < 200)) throw new Error(`${slug}.${k} : texte vide ou trop court`);
      if (k === "category" && !CATEGORIES.includes(v as string)) throw new Error(`${slug} : catégorie ${v}`);
    }
  }
  const { data: rows, error } = await sb.from("providers").select(`id,slug,${FIELDS.join(",")}`).in("slug", items.map((i) => i.slug));
  if (error) throw error;
  const bySlug = new Map((rows as unknown as Record<string, unknown>[]).map((r) => [r.slug as string, r]));
  let changed = 0;
  for (const { slug, set } of items) {
    const row = bySlug.get(slug);
    if (!row) throw new Error(`${slug} : absent en base`);
    const diff = Object.entries(set).filter(([k, v]) => JSON.stringify(row[k] ?? null) !== JSON.stringify(v));
    if (!diff.length) continue;
    changed++;
    console.log(slug);
    for (const [k, v] of diff) console.log(`  ${k} : ${show(row[k])} -> ${show(v)}`);
    if (!APPLY) continue;
    const patch: Record<string, unknown> = Object.fromEntries(diff);
    if (diff.some(([k]) => TEXTS.includes(k))) patch.editorial_reviewed_at = new Date().toISOString();
    const { error: e } = await sb.from("providers").update(patch as never).eq("id", row.id as string);
    if (e) throw e;
  }
  console.log(`\n${changed} fiche(s) ${APPLY ? "écrites" : "à écrire (dry-run)"} sur ${items.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
