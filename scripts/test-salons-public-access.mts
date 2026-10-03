/**
 * Régression : ce que la clé publique (anon) peut lire sur `salons` et les tables à données personnelles.
 * Garde la migration 20261003000000_salons_internal_columns_private :
 *  - colonnes internes (notes_internes, scraper_conflicts, locked_fields,
 *    alert_flag) illisibles, sur la table comme sur la vue salons_ordered ;
 *  - fiches en brouillon invisibles ;
 *  - lecture publique normale intacte (colonnes publiques, vue, fiche).
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/test-salons-public-access.mts
 */
import { createClient } from "@supabase/supabase-js";
import * as columns from "../src/lib/salon-columns";

// Module TS chargé en CommonJS : les exports nommés sont sous default.
const { SALON_INTERNAL_COLUMNS, SALON_PUBLIC_COLUMNS } = ((columns as unknown as { default?: typeof columns }).default ?? columns);

const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
let failed = 0;
const check = (ok: boolean, label: string) => {
  console.log(`${ok ? "OK  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};

for (const col of SALON_INTERNAL_COLUMNS) {
  const t = await anon.from("salons").select(`id, ${col}`).limit(1);
  check(!!t.error, `salons.${col} refusé à anon`);
  const v = await anon.from("salons_ordered" as never).select(`id, ${col}`).limit(1);
  check(!!v.error, `salons_ordered.${col} refusé à anon`);
}
const drafts = await anon.from("salons").select("id").eq("status", "draft");
check(!drafts.error && (drafts.data ?? []).length === 0, "aucun brouillon visible par anon");

const pub = await anon.from("salons").select(SALON_PUBLIC_COLUMNS).eq("status", "published").limit(3);
check(!pub.error && (pub.data ?? []).length === 3, "colonnes publiques lisibles");
const view = await anon.from("salons_ordered" as never).select("id, slug, sort_key").eq("status", "published").limit(3);
check(!view.error && (view.data ?? []).length === 3, "vue salons_ordered lisible");

// Données personnelles (migration 20261003020000) : rien de lisible en anon.
for (const table of ["alerts", "quotes", "reports", "contact_messages"]) {
  const r = await anon.from(table as never).select("id").limit(1);
  check(!!r.error || (r.data ?? []).length === 0, `${table} : aucune ligne lisible par anon`);
}
const unsub = await anon.rpc("alerts_for_email" as never, { p_email: "personne-inexistante@example.invalid" } as never);
check(!unsub.error, "désinscription : alerts_for_email accessible à anon");

console.log(failed ? `${failed} échec(s)` : "tout est OK");
process.exit(failed ? 1 : 0);
