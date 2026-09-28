// Correction data heavent-cannes (todo D22, 2026-09-28).
//
// La fiche stockait 2027-03-03 -> 2027-03-04 (les deux journées de salon),
// alors que le site officiel annonce "les 2 - 3 - 4 mars 2027" (cocktail
// d'ouverture le 2 au soir) et que le MDX relu, le MDX EN et la seo_description
// disent "du 2 au 4 mars". L'édition 2026 était déjà stockée sur 3 jours
// (24-26 mars). Source : https://www.heavent-one-to-one-meetings.fr
//
// Idempotent : ne touche que start_date, et seulement si elle vaut encore 2027-03-03.
//
// Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-heavent-dates-2027.ts [--apply]

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}
const sb = createClient(url, key);
const APPLY = process.argv.includes("--apply");

async function main() {
  const { data, error } = await sb
    .from("salons")
    .select("slug, start_date, end_date, edition_year")
    .eq("slug", "heavent-cannes")
    .single();
  if (error) throw error;
  console.log("Avant :", data);

  if (data.start_date === "2027-03-02") return console.log("Déjà corrigé.");
  if (data.start_date !== "2027-03-03" || data.end_date !== "2027-03-04") {
    return console.log("État inattendu, rien fait : à revoir à la main.");
  }
  if (!APPLY) return console.log("Dry-run : start_date 2027-03-03 -> 2027-03-02 (relancer avec --apply).");

  const { data: after, error: upErr } = await sb
    .from("salons")
    .update({ start_date: "2027-03-02" })
    .eq("slug", "heavent-cannes")
    .eq("start_date", "2027-03-03")
    .select("slug, start_date, end_date, edition_year")
    .single();
  if (upErr) throw upErr;
  console.log("Après :", after);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
