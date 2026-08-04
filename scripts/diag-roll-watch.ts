/**
 * Roll watch (2026-08-04) : détecte les fiches publiées dont l'édition est
 * passée (end_date < aujourd'hui) et qui doivent basculer vers l'édition
 * suivante (dates, edition_year, seo_title, MDX). Lecture seule.
 * Alimente la boucle hebdo : chaque fiche listée est candidate à un roll
 * via le process handoff (cf. scripts/diag-edito-roll-apply.ts).
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-roll-watch.ts
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await sb
    .from("salons")
    .select("slug,name,edition_year,end_date,frequency,website_url")
    .eq("status", "published")
    .lt("end_date", today)
    .order("end_date", { ascending: true });
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  console.log(`Fiches publiées dont l'édition est passée au ${today} : ${rows.length}`);
  console.log("");
  for (const r of rows) {
    const days = Math.floor((Date.parse(today) - Date.parse(r.end_date)) / 86400000);
    console.log(
      `${r.slug.padEnd(38)} fin ${r.end_date} (${String(days).padStart(3)}j) · ${r.frequency ?? "?"} · ${r.website_url ?? "PAS DE SITE"}`
    );
  }
  console.log("");
  console.log("Priorité de roll : ancienneté décroissante x fréquence annuelle d'abord.");
  console.log("Process : vérifier les dates de la prochaine édition sur le site officiel");
  console.log("(RR8, jamais un snippet SERP), puis handoff + apply (pattern diag-edito-roll-apply.ts).");
}

main().catch((e) => { console.error(e); process.exit(1); });
