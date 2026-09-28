// Correction data sepem-colmar (todo D13bis, décision Julien 2026-09-28).
//
// frequency valait 'ponctuel' alors que le salon est récurrent : 10e édition
// en 2024, 11e annoncée du 21 au 23 septembre 2027 ("sa 11ème édition en
// Alsace", https://colmar.sepem-industries.com/). Cycle de 3 ans, que le MDX
// décrit déjà comme triennal. Valeur 'triennal' existante depuis la migration
// 20260529000000 (libellés, admin et roll-guards la gèrent).
//
// Idempotent : ne touche que frequency, et seulement si elle vaut encore 'ponctuel'.
//
// Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-sepem-colmar-triennal.ts [--apply]

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
  const { data, error } = await sb.from("salons").select("slug, frequency").eq("slug", "sepem-colmar").single();
  if (error) throw error;
  console.log("Avant :", data);

  if (data.frequency === "triennal") return console.log("Déjà corrigé.");
  if (data.frequency !== "ponctuel") return console.log("État inattendu, rien fait : à revoir à la main.");
  if (!APPLY) return console.log("Dry-run : frequency ponctuel -> triennal (relancer avec --apply).");

  const { data: after, error: upErr } = await sb
    .from("salons")
    .update({ frequency: "triennal" })
    .eq("slug", "sepem-colmar")
    .eq("frequency", "ponctuel")
    .select("slug, frequency")
    .single();
  if (upErr) throw upErr;
  console.log("Après :", after);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
