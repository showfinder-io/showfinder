/** Cohorte 16 : relie venue_id + venue (nom) pour 5 fiches dont le lieu n'était pas relié en base. Dry-run par défaut ; --apply. */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const PAIRS: Record<string, string> = {
  "congres-adf-paris": "palais-des-congres-paris",
  "medfit-marseille": "parc-chanot-marseille",
  "silmo-paris": "paris-nord-villepinte",
  "salon-infirmier-paris": "paris-expo-porte-de-versailles",
  "bim-world-paris": "paris-expo-porte-de-versailles",
};
type Venue = { id: string; slug: string; name: string };
const SLUGS10 = ["bim-world-paris","congres-adf-paris","e-world-essen","hannover-messe","ish-francfort","medfit-marseille","medteclive-stuttgart","salon-infirmier-paris","silmo-paris","smarter-e-europe-munich"];
async function main() {
  console.log(APPLY ? "=== APPLY venuefix ===" : "=== DRY-RUN venuefix ===");
  for (const [salonSlug, venueSlug] of Object.entries(PAIRS)) {
    const { data } = await sb.from("venues").select("id,slug,name").eq("slug", venueSlug as never);
    const v = ((data ?? []) as Venue[])[0];
    if (!v) { console.log(`${salonSlug}: !! venue ${venueSlug} introuvable`); continue; }
    console.log(`${salonSlug}: venue_id=${v.id} venue="${v.name}"`);
    if (APPLY) {
      const { error } = await sb.from("salons").update({ venue_id: v.id, venue: v.name } as never).eq("slug", salonSlug as never);
      if (error) throw new Error(`${salonSlug}: ${error.message}`);
    }
  }
  // vérif apply editorial_mdx
  const { data: chk } = await sb.from("salons").select("slug,status,editorial_mdx,venue,venue_id,edition_year").in("slug", SLUGS10 as never);
  const rows = (chk ?? []) as { slug: string; status: string; editorial_mdx: string | null; venue: string | null; venue_id: string | null; edition_year: number | null }[];
  console.log("\n=== Vérif 10 fiches ===");
  for (const r of rows) console.log(`${r.slug.padEnd(26)} ${r.status} mdx=${r.editorial_mdx ? r.editorial_mdx.length + "c" : "NULL"} ed=${r.edition_year} venue=${r.venue} venue_id=${r.venue_id ? "set" : "NULL"}`);
  console.log(`(${rows.length}/10, ${rows.filter((r) => r.editorial_mdx).length} avec editorial_mdx)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
