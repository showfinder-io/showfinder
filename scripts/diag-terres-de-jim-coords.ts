/**
 * Corrige venue_lat/venue_lng de la fiche terres-de-jim (édition 2026, Metz-Magny).
 * Anciennes coordonnées erronées : 49.4178 / 2.8262 (près de Compiègne, Oise).
 * Nouvelles : centroïde du quartier Magny à Metz (Nominatim OSM, 2026-08-04),
 * cohérent avec les sources primaires (lesterresdejim.com : Metz-Magny, 11-13 sept 2026 ;
 * presse locale : site de plein air ~100 ha au sud de Metz, accès rocade Sud).
 * L'événement est itinérant : verrou sur les dates 2026-09-11 → 2026-09-13 pour ne pas
 * écraser une édition future. Dry-run par défaut ; --apply.
 */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const SLUG = "terres-de-jim";
const LOCK = { start_date: "2026-09-11", end_date: "2026-09-13" };
const NEW_COORDS = { venue_lat: 49.0767, venue_lng: 6.188 };

type Row = {
  slug: string; city: string | null; venue: string | null;
  start_date: string | null; end_date: string | null; edition_year: number | null;
  venue_lat: number | null; venue_lng: number | null; status: string;
};

async function main() {
  console.log(APPLY ? "=== APPLY terres-de-jim coords ===" : "=== DRY-RUN terres-de-jim coords ===");
  const { data, error } = await sb
    .from("salons")
    .select("slug,city,venue,start_date,end_date,edition_year,venue_lat,venue_lng,status")
    .eq("slug", SLUG as never);
  if (error) throw new Error(error.message);
  const row = ((data ?? []) as Row[])[0];
  if (!row) { console.log(`!! fiche ${SLUG} introuvable`); process.exit(1); }

  console.log(`Fiche : ${row.slug} | ${row.city} | ${row.venue ?? "(venue NULL)"} | ${row.start_date} → ${row.end_date} | ed=${row.edition_year} | status=${row.status}`);
  console.log(`Coords actuelles : ${row.venue_lat} / ${row.venue_lng}`);
  console.log(`Coords cibles    : ${NEW_COORDS.venue_lat} / ${NEW_COORDS.venue_lng} (Magny, Metz)`);

  if (row.start_date !== LOCK.start_date || row.end_date !== LOCK.end_date) {
    console.log(`!! Verrou dates : la fiche porte ${row.start_date} → ${row.end_date}, attendu ${LOCK.start_date} → ${LOCK.end_date}.`);
    console.log("!! L'événement est itinérant : la fiche a probablement roulé vers une édition future. Aucune écriture.");
    process.exit(1);
  }
  if (row.venue_lat === NEW_COORDS.venue_lat && row.venue_lng === NEW_COORDS.venue_lng) {
    console.log("Déjà à jour, rien à faire.");
    return;
  }
  if (!APPLY) { console.log("Dry-run : relancer avec --apply pour écrire."); return; }

  const { error: upErr } = await sb
    .from("salons")
    .update(NEW_COORDS as never)
    .eq("slug", SLUG as never)
    .eq("start_date", LOCK.start_date as never)
    .eq("end_date", LOCK.end_date as never);
  if (upErr) throw new Error(upErr.message);

  const { data: chk } = await sb.from("salons").select("slug,venue_lat,venue_lng").eq("slug", SLUG as never);
  const c = ((chk ?? []) as Pick<Row, "slug" | "venue_lat" | "venue_lng">[])[0];
  console.log(`Vérif post-apply : ${c?.venue_lat} / ${c?.venue_lng}`);
  if (c?.venue_lat !== NEW_COORDS.venue_lat || c?.venue_lng !== NEW_COORDS.venue_lng) throw new Error("Vérif post-apply en échec");
  console.log("OK.");
}
main().catch((e) => { console.error(e); process.exit(1); });
