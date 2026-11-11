/**
 * Arbitrages en session du roll 2027, partie B de tasks/roll-2027/arbitrages-2026-11-11.md
 * (go Julien du 2026-11-11). Huit fiches dont la routine a classé le handoff a-arbitrer
 * et dont la source officielle, relue le 2026-11-11, donne l'édition suivante sans ambiguïté.
 *
 * Différence avec diag-roll-arbitrages-2026-09-21-apply.ts : quand le lieu change, les
 * coordonnées de la fiche suivent celles du lieu (venues.lat / venues.lng). Le script du
 * 2026-09-21 ne les mettait pas à jour : innorobo-by-sido a gardé celles du Centre de
 * Congrès de Lyon alors qu'il est passé à Eurexpo. Corrigé ici dans les FIXES.
 *
 * Jamais le MDX ni le SEO : les fiches roulées entrent dans la file du refresh éditorial
 * (scripts/roll-apply-handoffs.ts --queue lit le journal).
 *
 * Verrou optimiste sur end_date. Journal tasks/roll-2027/journal.json mis à jour.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-roll-arbitrages-2026-11-11-apply.ts [--apply]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}
const sb = createClient(url, key);
const APPLY = process.argv.includes("--apply");
const JOURNAL = join(process.cwd(), "tasks/roll-2027/journal.json");
const TODAY = "2026-11-11";

type Roll = {
  start: string;
  end: string;
  source: string;
  proof: string;
  venueSlug?: string; // nouveau lieu (venues.slug) : venue, venue_id, venue_lat, venue_lng suivent
  extra?: Record<string, string>; // autres champs arbitrés (ville, nom, fréquence)
};

const ROLLS: Record<string, Roll> = {
  "silmo-paris": {
    start: "2027-09-24", end: "2027-09-27", source: "https://www.silmoparis.com",
    proof: "navigateur (Cloudflare bloque curl) : '24 > 27 SEPT. 2027', '- PARIS NORD VILLEPINTE' ; lieu inchangé",
  },
  "medi-nov-connection-lyon": {
    start: "2027-06-30", end: "2027-07-01", source: "https://www.medinov-connection.com/",
    proof: "relecture mécanique : 'Le 30 juin et 1er juillet 2027 au Centre de Congrès de Lyon', JSON-LD 2027-06-30 / 2027-07-01 concordant ; lieu inchangé",
  },
  "aerospace-test-development-show": {
    start: "2027-09-28", end: "2027-09-29", source: "https://aerotestdevelopmentshow.com",
    proof: "relecture mécanique : '28-29 September 2027, Hall 7, MEETT, Toulouse' quatre fois dans le texte ; JSON-LD écarté car incohérent (startDate 2027-09-29, endDate 2026-09-30) ; lieu inchangé",
  },
  "batimat": {
    start: "2028-10-02", end: "2028-10-05", source: "https://www.batimat.com",
    proof: "relecture mécanique : '02 au 05 octobre 2028 Paris, Porte de Versailles' ; rythme bisannuel cohérent ; changement de lieu Paris Nord Villepinte vers Paris Expo Porte de Versailles",
    venueSlug: "paris-expo-porte-de-versailles",
  },
  "ideobain": {
    start: "2028-10-02", end: "2028-10-05", source: "https://www.ideobain.com",
    proof: "relecture mécanique : '02 au 05 octobre 2028 Paris Expo, Porte de Versailles' (bannière et meta description) ; rythme bisannuel cohérent ; changement de lieu Paris Nord Villepinte vers Paris Expo Porte de Versailles",
    venueSlug: "paris-expo-porte-de-versailles",
  },
  "natexpo-paris": {
    start: "2027-09-26", end: "2027-09-28", source: "https://www.natexpo.com",
    proof: "relecture mécanique : 'Rendez-vous du 26 au 28 septembre 2027 à Paris Expo Porte de Versailles', 'Pavillon 7.2, Du dimanche 26 au mardi 28 septembre 2027' ; alternance Paris / Lyon, changement de ville et de lieu",
    venueSlug: "paris-expo-porte-de-versailles",
    extra: { city: "Paris" },
  },
  "tranofiliere-paris": {
    start: "2027-03-04", end: "2027-03-07", source: "https://www.tranoi.com",
    proof: "relecture mécanique : 'TRANOÏ PARIS Fall/Winter 27-28 4 to 7 March 2027', 'tranoï Paris 4 - 7 MARCH | Palais Brongniart, PARIS' ; deux éditions Paris par an (mars et fin septembre), frequency semestriel ; changement de lieu Palais de Tokyo vers Palais Brongniart",
    venueSlug: "palais-brongniart",
    extra: { frequency: "semestriel" },
  },
  "luxe-pack-monaco": {
    start: "2027-10-04", end: "2027-10-06", source: "https://www.luxepackmonaco.com",
    proof: "relecture mécanique : 'Grimaldi Forum | 4-6 oct. 2027', 'En 2027, LUXE PACK Monaco devient LUXE PACK WORLD' ; lieu inchangé, nom changé, slug conservé",
    extra: { name: "Luxe Pack World" },
  },
};

type Fix = { slug: string; patch: Record<string, number>; source: string };
const FIXES: Fix[] = [
  {
    slug: "innorobo-by-sido",
    patch: { venue_lat: 45.7275, venue_lng: 4.952 },
    source: "coordonnées du lieu eurexpo-lyon ; la fiche portait celles du Centre de Congrès de Lyon (45.764 / 4.852) depuis le changement de lieu du 2026-09-21",
  },
];

const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", timeZone: "UTC" });

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const journal = JSON.parse(readFileSync(JOURNAL, "utf8"));

  console.log("\n--- Rolls arbitrés");
  for (const [slug, r] of Object.entries(ROLLS)) {
    const { data: s, error } = await sb
      .from("salons")
      .select("start_date,end_date,status,city,venue,venue_lat,venue_lng,name,frequency")
      .eq("slug", slug)
      .single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (s.start_date === r.start && s.end_date === r.end) { console.log(`DÉJÀ APPLIQUÉ ${slug}`); continue; }
    if (s.status !== "published") throw new Error(`${slug}: statut ${s.status}`);
    if (!s.end_date || s.end_date >= TODAY || r.start <= s.end_date) throw new Error(`${slug}: dates incohérentes (base ${s.end_date}, cible ${r.start})`);

    const patch: Record<string, unknown> = { start_date: r.start, end_date: r.end, edition_year: Number(r.start.slice(0, 4)), ...r.extra };
    if (r.venueSlug) {
      const { data: v, error: vErr } = await sb.from("venues").select("id,name,lat,lng").eq("slug", r.venueSlug).single();
      if (vErr || !v) throw new Error(`${slug}: lieu ${r.venueSlug} introuvable`);
      if (v.lat === null || v.lng === null) throw new Error(`${slug}: lieu ${r.venueSlug} sans coordonnées`);
      Object.assign(patch, { venue: v.name, venue_id: v.id, venue_lat: v.lat, venue_lng: v.lng });
    }

    const cur = s as Record<string, unknown>;
    const changes = Object.entries(patch)
      .filter(([k]) => !["start_date", "end_date", "edition_year"].includes(k))
      .map(([k, v]) => `${k} ${cur[k]} -> ${v}`);
    console.log(`ROLL ${slug} : ${s.start_date}/${s.end_date} -> ${r.start} (${weekday(r.start)}) / ${r.end} (${weekday(r.end)})`);
    if (changes.length) console.log(`      ${changes.join(" ; ")}`);

    if (APPLY) {
      const { data: rows, error: upErr } = await sb.from("salons").update(patch as never).eq("slug", slug).eq("end_date", s.end_date).select("slug");
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
      if (!rows?.length) throw new Error(`${slug}: aucune ligne mise à jour (verrou optimiste)`);
      journal[slug] = {
        outcome: "applied",
        at: TODAY,
        from: { start_date: s.start_date, end_date: s.end_date },
        to: { start_date: r.start, end_date: r.end, edition_year: Number(r.start.slice(0, 4)) },
        source_url: r.source,
        reasons: [`arbitrage en session (tasks/roll-2027/arbitrages-2026-11-11.md) : ${r.proof}`],
      };
    }
  }

  console.log("\n--- Corrections de données");
  for (const f of FIXES) {
    const cols = Object.keys(f.patch).join(",");
    const { data: s, error } = await sb.from("salons").select(cols).eq("slug", f.slug).single();
    if (error) throw new Error(`${f.slug}: ${error.message}`);
    const cur = s as unknown as Record<string, number | null>;
    const diff = Object.entries(f.patch).filter(([k, v]) => cur[k] !== v);
    if (!diff.length) { console.log(`DÉJÀ APPLIQUÉ ${f.slug}`); continue; }
    console.log(`FIX ${f.slug} : ${diff.map(([k, v]) => `${k} ${cur[k]} -> ${v}`).join(" ; ")}\n      source : ${f.source}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(f.patch as never).eq("slug", f.slug);
      if (upErr) throw new Error(`${f.slug}: ${upErr.message}`);
    }
  }

  if (APPLY) writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + "\n");
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
