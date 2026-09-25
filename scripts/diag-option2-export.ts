// Export des fiches du chantier option 2 (2026-09-25) vers handoff/option2-2026-09-25/input,
// + liste des slugs publiés (salons, lieux, secteurs) pour le contrôle des liens internes. Lecture seule.
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "handoff/option2-2026-09-25";
const SLUGS = ["all4pack-paris", "sepem-rouen", "sepem-toulouse", "sepem-grenoble", "sepem-colmar", "sepem-angers", "sepem-douai"];
(async () => {
  mkdirSync(`${DIR}/input`, { recursive: true });
  for (const slug of SLUGS) {
    const { data, error } = await sb.from("salons").select("*, venues(slug,name,city)").eq("slug", slug).maybeSingle();
    if (error) throw error;
    writeFileSync(`${DIR}/input/${slug}.json`, JSON.stringify({ fiche: data }, null, 2));
  }
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug,name"),
    sb.from("sectors").select("slug"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
  writeFileSync(`${DIR}/published-slugs.json`, JSON.stringify({
    salons: s.data!.map((r) => r.slug).sort(),
    lieux: v.data!.map((r) => `${r.slug} (${r.name})`).sort(),
    secteurs: sec.data!.map((r) => r.slug).sort(),
  }, null, 2));
  console.log("export OK");
})();
