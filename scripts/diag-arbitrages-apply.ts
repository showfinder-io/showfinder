/**
 * Application des arbitrages Nicolas (décisions Julien 2026-06-15).
 * Dry-run par défaut ; --apply. Idempotent.
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const log = (m: string) => console.log("  " + m);

async function run(label: string, fn: () => PromiseLike<{ error: { message: string } | null }>) {
  if (!APPLY) { log(label + " (dry-run)"); return; }
  const r = await fn();
  log(label + " : " + (r.error ? "ERREUR " + r.error.message : "ok"));
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");

  // 1. Fréquences
  await run("congres-hr-paris frequency=semestriel", () =>
    sb.from("salons").update({ frequency: "semestriel" } as never).eq("slug", "congres-hr-paris"));

  // 2. Categories (enum salon_category)
  await run("regal-toulouse category=salon_grand_public", () =>
    sb.from("salons").update({ category: "salon_grand_public" } as never).eq("slug", "regal-toulouse"));
  await run("salon-copropriete-paris category=salon_professionnel", () =>
    sb.from("salons").update({ category: "salon_professionnel" } as never).eq("slug", "salon-copropriete-paris"));

  // 3. Numéro d'édition aligné sur le site officiel (Gazelec : 17e en 2026)
  await run("gazelec-paris edition_number=17", () =>
    sb.from("salons").update({ edition_number: 17 } as never).eq("slug", "gazelec-paris"));

  // 4. Slug itinérant sans ville : biofit-lille -> biofit
  await run("biofit-lille -> biofit", () =>
    sb.from("salons").update({ slug: "biofit" } as never).eq("slug", "biofit-lille"));

  // 5. Dépublications (doublons/sous-ensembles) -> draft, 301 dans next.config
  await run("cloud-expo-europe-paris -> draft", () =>
    sb.from("salons").update({ status: "draft" } as never).eq("slug", "cloud-expo-europe-paris"));
  await run("world-of-concrete-europe-paris -> draft", () =>
    sb.from("salons").update({ status: "draft" } as never).eq("slug", "world-of-concrete-europe-paris"));

  // 6. Secteur parabère : tourisme-hotellerie -> agroalimentaire
  const { data: pf } = await sb.from("salons").select("id").eq("slug", "parabere-forum-nice").maybeSingle();
  const { data: ag } = await sb.from("sectors").select("id").eq("slug", "agroalimentaire").single();
  if (pf && ag) {
    await run("parabère: retire tourisme-hotellerie", () =>
      sb.from("salon_sectors").delete().eq("salon_id", pf.id));
    await run("parabère: ajoute agroalimentaire", () =>
      sb.from("salon_sectors").insert({ salon_id: pf.id, sector_id: ag.id } as never));
  }

  // 7. Maison de la Mutualité : venue orpheline -> dépublier (delete). Garde-fou : 0 salon rattaché.
  const { data: mv } = await sb.from("venues").select("id").eq("slug", "maison-de-la-mutualite").maybeSingle();
  if (mv) {
    const { count } = await sb.from("salons").select("id", { count: "exact", head: true }).eq("venue_id", mv.id);
    if ((count ?? 0) > 0) { log(`maison-de-la-mutualite : ${count} salon(s) rattaché(s), DELETE annulé`); }
    else await run("maison-de-la-mutualite venue DELETE (orpheline)", () =>
      sb.from("venues").delete().eq("id", mv.id));
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
