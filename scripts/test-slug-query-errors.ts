/**
 * Régression : une erreur Supabase ne doit plus produire un 404 sur les pages
 * par slug (salons, secteurs, lieux, prestataires). Cause probable des 404
 * transitoires vus par Googlebot entre le 17 et le 22/09/2026.
 *
 * Rejoue l'ancien traitement (.single() + `if (error || !data) return null`)
 * et le nouveau (.maybeSingle() + throw sur erreur) sur deux cas réels :
 *   - slug absent  : les deux doivent renvoyer null (404 légitime)
 *   - erreur forcée (colonne inexistante) : l'ancien renvoie null (bug,
 *     sanity check), le nouveau doit lever
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/test-slug-query-errors.ts
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function oldLookup(column: string, slug: string) {
  const { data, error } = await sb.from("salons").select(column).eq("slug", slug).eq("status", "published").single();
  if (error || !data) return null;
  return data;
}

async function newLookup(column: string, slug: string) {
  const { data, error } = await sb.from("salons").select(column).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data;
}

let failures = 0;
function check(label: string, ok: boolean) {
  console.log(`${ok ? "OK  " : "FAIL"} ${label}`);
  if (!ok) failures++;
}

(async () => {
  const absent = "slug-inexistant-test-regression";
  const existing = "world-nuclear-exhibition";

  check("existant : nouveau traitement renvoie la fiche", (await newLookup("slug", existing)) !== null);
  check("absent : ancien traitement renvoie null", (await oldLookup("slug", absent)) === null);
  check("absent : nouveau traitement renvoie null (404 conservé)", (await newLookup("slug", absent)) === null);

  // Sanity check : l'ancien traitement masque l'erreur en null, donc en 404
  check("erreur : ancien traitement renvoie null (bug reproduit)", (await oldLookup("colonne_inexistante", existing)) === null);

  let threw = false;
  try {
    await newLookup("colonne_inexistante", existing);
  } catch {
    threw = true;
  }
  check("erreur : nouveau traitement lève une exception", threw);

  if (failures) {
    console.error(`${failures} échec(s)`);
    process.exit(1);
  }
  console.log("Tous les cas passent");
})();
