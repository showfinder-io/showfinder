/**
 * Métal Expo (metal-expo-paris) : textes FR et EN après writer + 2 relectures
 * (handoff/edito-lot3-2026-11-12/final/, gitignoré), puis publication.
 *
 * Les données de base ont été corrigées par scripts/diag-roll-lot3-2026-11-12.ts
 * apply-data (dates 28-30 sept. 2027, Paris Expo Porte de Versailles, Union des
 * métalliers). Ce script écrit en plus :
 *  - editorial_mdx / _en, seo_title / _en, seo_description / _en, description / _en ;
 *  - dates_confirmed = true (accueil et communiqué du 10 juin 2026) ;
 *  - estimated_exhibitors / estimated_visitors = null : 350 et 8 000 venaient du seed
 *    batch2 (inventés) ; les « 60 exposants » et « 5 000 professionnels » de l'accueil
 *    sont des objectifs, cités comme tels dans le MDX, pas des estimations ;
 *  - secteurs : ceux de final/metal-expo-paris.meta.json (sector_slugs).
 * Le 301 /salons/metal-expo-paris -> /salons/batimat est retiré de next.config.ts
 * dans la même PR (le déploiement rend la fiche accessible).
 *
 * Modes : (rien) dry-run ; --apply écrit en laissant le statut draft ;
 * --publish passe en published + IndexNow (après --apply).
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-metal-expo-publish-2026-11-13.ts [--apply|--publish]
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { localizedUrls, submitIndexNow } from "../src/lib/indexnow";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SLUG = "metal-expo-paris";
const DIR = "handoff/edito-lot3-2026-11-12/final";
const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");

async function main() {
  const { data: row, error } = await sb.from("salons").select("id,status,name,start_date,venue,organizer_name").eq("slug", SLUG).single();
  if (error) throw error;

  if (PUBLISH) {
    if (row.status === "published") { console.log("déjà publié"); return; }
    const { data: chk } = await sb.from("salons").select("editorial_mdx,editorial_mdx_en").eq("id", row.id).single();
    if (!chk?.editorial_mdx || !chk.editorial_mdx_en) throw new Error("MDX absent : lancer --apply d'abord");
    const { error: upErr } = await sb.from("salons").update({ status: "published" } as never).eq("id", row.id);
    if (upErr) throw upErr;
    console.log("PUBLIÉ");
    console.log("IndexNow :", JSON.stringify(await submitIndexNow(localizedUrls(`/salons/${SLUG}`))));
    return;
  }

  // Verrou : les données de base doivent être celles du lot 3
  if (row.status !== "draft" || row.name !== "Métal Expo" || row.start_date !== "2027-09-28" || row.venue !== "Paris Expo Porte de Versailles" || row.organizer_name !== "Union des métalliers") {
    throw new Error(`données de base inattendues : ${JSON.stringify(row)}`);
  }
  const meta = JSON.parse(readFileSync(`${DIR}/${SLUG}.meta.json`, "utf8"));
  const patch: Record<string, unknown> = {
    editorial_mdx: readFileSync(`${DIR}/${SLUG}.fr.mdx`, "utf8").trim(),
    editorial_mdx_en: readFileSync(`${DIR}/${SLUG}.en.mdx`, "utf8").trim(),
    seo_title: meta.seo_title, seo_description: meta.seo_description, description: meta.description,
    seo_title_en: meta.seo_title_en, seo_description_en: meta.seo_description_en, description_en: meta.description_en,
    dates_confirmed: true, estimated_exhibitors: null, estimated_visitors: null,
  };
  for (const [k, v] of Object.entries(patch)) {
    if (k.startsWith("estimated_")) continue;
    if (v === undefined || v === null || v === "") throw new Error(`champ ${k} vide`);
    if (typeof v === "string" && v.includes("—")) throw new Error(`${k} : tiret cadratin`);
  }

  // Liens internes : salons publiés et lieux existants uniquement
  const { compile } = await import("@mdx-js/mdx");
  const [{ data: pub }, { data: ven }] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
  ]);
  const okSalons = new Set(pub!.map((r) => r.slug as string));
  const okVenues = new Set(ven!.map((r) => r.slug as string));
  for (const k of ["editorial_mdx", "editorial_mdx_en"]) {
    const mdx = patch[k] as string;
    await compile(mdx, { outputFormat: "function-body" });
    for (const m of mdx.matchAll(/\]\((?:\/en)?\/(salons|lieux)\/([a-z0-9-]+)\)/g)) {
      const ok = m[1] === "salons" ? okSalons.has(m[2]) && m[2] !== SLUG : okVenues.has(m[2]);
      if (!ok) throw new Error(`${k} : lien /${m[1]}/${m[2]} invalide`);
    }
  }

  const sectorSlugs = meta.sector_slugs as string[];
  if (!sectorSlugs?.length) throw new Error("sector_slugs vide");
  const { data: secs } = await sb.from("sectors").select("id,slug").in("slug", sectorSlugs);
  if (secs!.length !== sectorSlugs.length) throw new Error(`secteur inconnu dans ${sectorSlugs}`);

  console.log(`${APPLY ? "APPLY" : "DRY-RUN"} ${SLUG} (reste draft)`);
  for (const [k, v] of Object.entries(patch)) console.log(`  ${k} : ${typeof v === "string" ? `${v.length} car.${v.length < 200 ? ` « ${v} »` : ""}` : v}`);
  console.log(`  secteurs : ${sectorSlugs.join(", ")}`);
  if (!APPLY) return;

  const { error: upErr } = await sb.from("salons").update(patch as never).eq("id", row.id).eq("status", "draft");
  if (upErr) throw upErr;
  const { error: delErr } = await sb.from("salon_sectors").delete().eq("salon_id", row.id);
  if (delErr) throw delErr;
  const { error: insErr } = await sb.from("salon_sectors").insert(secs!.map((s) => ({ salon_id: row.id, sector_id: s.id })) as never);
  if (insErr) throw insErr;
  console.log("ÉCRIT (draft)");
}

main().catch((e) => { console.error(e); process.exit(1); });
