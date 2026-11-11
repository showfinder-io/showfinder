/**
 * Applique en prod le contenu de la migration 20261029000000_sector_pop_culture_salons :
 * rattache comic-con-france et japan-expo-paris au secteur art-culture.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-sector-pop-culture-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const APPLY = process.argv.includes("--apply");

async function main() {
  const { data: sector } = await supabase.from("sectors").select("id").eq("slug", "art-culture").single();
  const { data: salons } = await supabase
    .from("salons")
    .select("id, slug, salon_sectors(sector_id)")
    .in("slug", ["comic-con-france", "japan-expo-paris"]);
  if (!sector || salons?.length !== 2) throw new Error("secteur ou salons introuvables");

  const rows = salons
    .filter((s) => !(s.salon_sectors as { sector_id: string }[]).some((ss) => ss.sector_id === sector.id))
    .map((s) => ({ salon_id: s.id, sector_id: sector.id, slug: s.slug }));
  console.log(`${rows.length} lien(s) à créer : ${rows.map((r) => r.slug).join(", ") || "aucun"}`);
  if (!APPLY || rows.length === 0) return;

  const { error } = await supabase.from("salon_sectors").insert(rows.map(({ slug: _, ...r }) => r));
  if (error) throw error;
  console.log("Appliqué.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
