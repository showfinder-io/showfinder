/**
 * Application du chantier option 2 (2026-09-25) : ALLFORPACK et réseau SEPEM.
 * Source : handoff/option2-2026-09-25/final/<slug>.{fr.mdx,en.mdx,meta.json},
 * produits par le process writer, reviewer, correcteur-traducteur.
 *
 * Seuls les champs de la liste blanche FIELDS passent en base. `venue_slug`
 * est résolu en venue_id + venue + city + venue_lat/lng depuis la fiche lieu.
 * Garde-fous avant toute écriture : chaque MDX compile, n'utilise que les
 * composants HistoryTable, BudgetTable, DataMissing, et ne contient aucun
 * tiret cadratin ; la fiche est published.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-option2-apply.mts [--apply] slug1 slug2 ...
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@mdx-js/mdx";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const FINAL = join(process.cwd(), "handoff/option2-2026-09-25/final");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const FIELDS = [
  "name", "organizer_name", "co_organizer_name", "website_url", "logo_url",
  "start_date", "end_date", "edition_year", "frequency",
  "seo_title", "seo_description", "seo_title_en", "seo_description_en",
  "description", "description_en",
] as const;
const ALLOWED_COMPONENTS = new Set(["HistoryTable", "BudgetTable", "DataMissing"]);

async function checkMdx(slug: string, lang: string, src: string) {
  if (src.includes("—")) throw new Error(`${slug} ${lang}: tiret cadratin présent`);
  for (const [, tag] of src.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!ALLOWED_COMPONENTS.has(tag)) throw new Error(`${slug} ${lang}: balise <${tag}> hors liste blanche`);
  }
  await compile(src, { outputFormat: "function-body" });
}

async function main() {
  if (!slugs.length) throw new Error("aucun slug fourni");
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of slugs) {
    const meta = JSON.parse(readFileSync(join(FINAL, `${slug}.meta.json`), "utf8"));
    const patch: Record<string, unknown> = {};
    for (const f of FIELDS) if (f in meta) patch[f] = meta[f];

    for (const [lang, col] of [["fr", "editorial_mdx"], ["en", "editorial_mdx_en"]] as const) {
      const p = join(FINAL, `${slug}.${lang}.mdx`);
      if (!existsSync(p)) continue;
      const src = readFileSync(p, "utf8");
      await checkMdx(slug, lang, src);
      patch[col] = src;
    }

    if (meta.venue_slug) {
      const { data: v, error } = await sb.from("venues").select("id,name,city,lat,lng").eq("slug", meta.venue_slug).maybeSingle();
      if (error) throw error;
      if (!v) throw new Error(`${slug}: venue ${meta.venue_slug} introuvable`);
      Object.assign(patch, { venue_id: v.id, venue: v.name, city: v.city, venue_lat: v.lat, venue_lng: v.lng });
    }
    patch.editorial_updated_at = new Date().toISOString();

    const { data, error } = await sb.from("salons").select(`status,${Object.keys(patch).join(",")}`).eq("slug", slug).maybeSingle();
    if (error) throw error;
    // Select dynamique : Supabase ne sait pas typer la liste de colonnes
    const cur = data as unknown as Record<string, unknown> | null;
    if (!cur) throw new Error(`${slug}: fiche introuvable`);
    if (cur.status !== "published") throw new Error(`${slug}: statut ${cur.status}`);

    const diff = Object.keys(patch).filter((k) => k !== "editorial_updated_at" && JSON.stringify(cur[k]) !== JSON.stringify(patch[k]));
    console.log(`\n${slug} : ${diff.length} champ(s) modifié(s)`);
    for (const k of diff) {
      const show = (x: unknown) => (typeof x === "string" && x.length > 90 ? `${x.slice(0, 90)}… (${x.length}c)` : JSON.stringify(x));
      console.log(`  ${k}: ${show(cur[k])} → ${show(patch[k])}`);
    }
    if (APPLY && diff.length) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
