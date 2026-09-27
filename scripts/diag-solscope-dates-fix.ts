/**
 * Correction solscope (2026-09-27) : la fiche affichait 15-16 juin 2027 avec
 * dates_confirmed=true, alors que solscope.fr annonce que "le lieu et les dates
 * de la prochaine édition de Solscope seront bientôt dévoilés" (seul fait
 * publié : "Rendez-vous en 2027 !", bilan-2025.htm). Dates remises à null
 * (convention des éditions dont seule l'année est connue), "juin 2027" et
 * "17e" (numéro déduit par comptage, RR7) retirés du texte FR et EN.
 * Remplacements exacts uniquement, chaque passage doit être trouvé une fois.
 * Dry-run par défaut ; --apply pour écrire.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-solscope-dates-fix.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const REPLACEMENTS: Record<string, [string, string][]> = {
  editorial_mdx: [
    ["Prochaine édition : la 17e, en juin 2027 (dates précises non publiées).", "Prochaine édition annoncée en 2027 : lieu et dates pas encore publiés par les organisateurs."],
    ['{ "edition": "2027 (17e, à venir)"', '{ "edition": "2027 (à venir)"'],
    ["La prochaine édition, la 17e, se tiendra en juin 2027 à Eurexpo Lyon Hall 7 (dates précises à confirmer par les organisateurs).", "La prochaine édition est annoncée pour 2027 ; les organisateurs n'en ont pas encore publié le lieu ni les dates."],
  ],
  editorial_mdx_en: [
    ["Next edition: the 17th, in June 2027 (exact dates not yet published).", "Next edition announced for 2027: venue and dates not yet published by the organisers."],
    ['{ "edition": "2027 (17th, upcoming)"', '{ "edition": "2027 (upcoming)"'],
    ["The next edition, the 17th, will take place in June 2027 at Eurexpo Lyon Hall 7 (exact dates to be confirmed by the organisers).", "The next edition is announced for 2027; the organisers have not yet published its venue or dates."],
  ],
  description: [
    ["17e édition du seul salon B2B en France", "Le seul salon B2B en France"],
    ["à Eurexpo Lyon Hall 7 sur 2 jours.", "habituellement à Eurexpo Lyon Hall 7 sur 2 jours."],
  ],
  description_en: [
    ["17th edition of the only B2B trade show in France", "The only B2B trade show in France"],
    ["at Eurexpo Lyon Hall 7 over 2 days.", "usually at Eurexpo Lyon Hall 7 over 2 days."],
  ],
};

async function main() {
  const { data: row, error } = await sb
    .from("salons")
    .select("id,start_date,end_date,dates_confirmed,editorial_mdx,editorial_mdx_en,description,description_en")
    .eq("slug", "solscope")
    .single();
  if (error) throw error;
  const update: Record<string, unknown> = { start_date: null, end_date: null, dates_confirmed: false };
  for (const [field, pairs] of Object.entries(REPLACEMENTS)) {
    let text = (row as Record<string, string>)[field];
    for (const [from, to] of pairs) {
      const n = text.split(from).length - 1;
      if (n !== 1) throw new Error(`${field} : passage trouvé ${n} fois : ${from.slice(0, 60)}`);
      text = text.replace(from, to);
    }
    update[field] = text;
  }
  console.log(`start_date ${row.start_date} -> null, end_date ${row.end_date} -> null, dates_confirmed ${row.dates_confirmed} -> false`);
  console.log(`${Object.values(REPLACEMENTS).flat().length} remplacements de texte prêts`);
  if (!APPLY) return console.log("DRY-RUN terminé");
  const { error: upErr } = await sb.from("salons").update(update as never).eq("id", row.id);
  if (upErr) throw upErr;
  console.log("APPLIQUÉ");
}

main().catch((e) => { console.error(e); process.exit(1); });
