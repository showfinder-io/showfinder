// Export des fiches des suites SL3C (todo, 2026-10-12) vers handoff/edito-sl3c/input,
// + liste des slugs publiés (salons, lieux, secteurs) pour le contrôle des liens internes. Lecture seule.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-edito-sl3c-export.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "handoff/edito-sl3c";
const SLUGS = ["architect-at-work-paris", "architect-at-work-lyon", "sepem-grenoble", "sepem-rouen",
  "documation", "solutions-rh", "all4customer-cannes", "bioket"];
const FIELDS = "slug,name,start_date,end_date,edition_year,city,venue,website_url,organizer_name,co_organizer_name,frequency,dates_confirmed,seo_title,seo_description,seo_title_en,seo_description_en,editorial_mdx,editorial_mdx_en";
(async () => {
  for (const d of ["input", "writer", "review", "final"]) mkdirSync(`${DIR}/${d}`, { recursive: true });
  for (const slug of SLUGS) {
    const { data, error } = await sb.from("salons").select(FIELDS).eq("slug", slug).maybeSingle();
    if (error) throw error;
    writeFileSync(`${DIR}/input/${slug}.json`, JSON.stringify({ fiche: data }, null, 2));
  }
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
    sb.from("sectors").select("slug"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
  writeFileSync(`${DIR}/published-slugs.json`, JSON.stringify({
    salons: s.data!.map((r) => r.slug).sort(),
    lieux: v.data!.map((r) => r.slug).sort(),
    secteurs: sec.data!.map((r) => r.slug).sort(),
  }, null, 2));
  const { data: k } = await sb.from("salons").select("slug,status").ilike("organizer_name", "%kortrijk%");
  console.log("organizer_name Kortrijk :", JSON.stringify(k));
  console.log("export OK");
})();
