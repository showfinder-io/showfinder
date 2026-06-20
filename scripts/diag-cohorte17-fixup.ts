/** Cohorte 17 : catégorie + category_to_confirm + venue_id + secteur (salon_sectors) pour 4 fiches ; dépublie batinov (dormant). Dry-run par défaut ; --apply. */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const CAT: Record<string, string> = { "all4customer-paris": "salon_professionnel", "medi-nov-connection-lyon": "congres", "open-energies-lyon": "salon_professionnel", "reeduca-paris": "salon_professionnel" };
const VENUE: Record<string, string> = { "medi-nov-connection-lyon": "centre-de-congres-de-lyon", "reeduca-paris": "paris-expo-porte-de-versailles" };
const SECTOR: Record<string, string> = { "all4customer-paris": "tech-numerique", "medi-nov-connection-lyon": "sante-pharma", "open-energies-lyon": "energie-environnement", "reeduca-paris": "sante-pharma" };

type Id = { id: string };
type Venue = { id: string; name: string };
async function idOf(table: string, slug: string): Promise<string | null> {
  const { data } = await sb.from(table).select("id").eq("slug", slug as never);
  return ((data ?? []) as Id[])[0]?.id ?? null;
}
async function main() {
  console.log(APPLY ? "=== APPLY fixup ===" : "=== DRY-RUN fixup ===");
  for (const slug of Object.keys(CAT)) {
    const salonId = await idOf("salons", slug);
    if (!salonId) { console.log(`${slug}: !! introuvable`); continue; }
    const patch: Record<string, unknown> = { category: CAT[slug], category_to_confirm: false };
    if (VENUE[slug]) {
      const { data } = await sb.from("venues").select("id,name").eq("slug", VENUE[slug] as never);
      const v = ((data ?? []) as Venue[])[0];
      if (v) { patch.venue_id = v.id; patch.venue = v.name; }
    }
    // secteur : insérer dans salon_sectors si absent
    const sectorId = await idOf("sectors", SECTOR[slug]);
    let sectorAction = "secteur déjà présent ou n.d.";
    if (sectorId) {
      const { data: existing } = await sb.from("salon_sectors").select("salon_id").eq("salon_id", salonId as never).eq("sector_id", sectorId as never);
      if (!(existing ?? []).length) {
        sectorAction = `+ secteur ${SECTOR[slug]}`;
        if (APPLY) { const { error } = await sb.from("salon_sectors").insert({ salon_id: salonId, sector_id: sectorId } as never); if (error) throw new Error(`${slug} sector: ${error.message}`); }
      } else sectorAction = `secteur ${SECTOR[slug]} déjà lié`;
    }
    console.log(`${slug}: category=${CAT[slug]} cat_to_confirm=false${patch.venue ? " venue=" + patch.venue : ""} | ${sectorAction}`);
    if (APPLY) { const { error } = await sb.from("salons").update(patch as never).eq("slug", slug as never); if (error) throw new Error(`${slug}: ${error.message}`); }
  }
  // batinov : dépublication (salon dormant, RR33)
  console.log("\nbatinov-lyon: status -> draft (dormant), category_to_confirm=false, pas d'editorial_mdx");
  if (APPLY) { const { error } = await sb.from("salons").update({ status: "draft", category_to_confirm: false } as never).eq("slug", "batinov-lyon" as never); if (error) throw new Error(`batinov: ${error.message}`); }
}
main().catch((e) => { console.error(e); process.exit(1); });
