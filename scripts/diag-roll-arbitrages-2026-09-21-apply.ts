/**
 * Arbitrages en session du roll 2027 (todo E5) et corrections de données relevées
 * pendant le refresh éditorial (todo E7), 2026-09-21.
 *
 * Chaque ligne porte sa source officielle et la façon dont elle a été vérifiée.
 * Ces cas sont ceux que l'automate (scripts/roll-apply-handoffs.ts) a rejetés ou
 * que la routine a classés a-arbitrer / site-mort : CLAUDE.md règle 14(d) les
 * renvoie à un arbitrage humain, fait ici avec preuve. Verrou optimiste sur
 * end_date. Le journal tasks/roll-2027/journal.json est mis à jour.
 *
 * Non roulés, volontairement :
 * - innov-agri-ondes : la page /accueil-grugies annonce la "2nde édition d'INNOVAGRI
 *   dans les Hauts de France" (26-27 mai 2027). Série régionale distincte, pas
 *   l'édition suivante d'Ondes. Prochaine édition d'Ondes non annoncée.
 * - transports-publics-paris : devenu Mobco (fusion EuMo Expo + RNTP), édition 2027
 *   à Saint-Étienne. Relève de RR10 + RR39 (renommage, slug sans ville, 301, fiche
 *   à réécrire) : chantier éditorial séparé.
 * - architect-at-work-lyon ("Spring 2028" sans dates), medi-nov-connection-lyon
 *   ("en 2027 à Lyon" sans dates), numeriquest-toulouse (aucune date) : rien à rouler.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-roll-arbitrages-2026-09-21-apply.ts [--apply]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const JOURNAL = join(process.cwd(), "tasks/roll-2027/journal.json");
const TODAY = "2026-09-21";

type Roll = { start: string; end: string; source: string; proof: string; venue?: { name: string; slug: string } };
const ROLLS: Record<string, Roll> = {
  "vivatech": { start: "2027-06-16", end: "2027-06-19", source: "https://vivatech.com/", proof: "navigateur : Schema.org Event 'VivaTech 2027' startDate 2027-06-16 endDate 2027-06-19, Paris Expo Porte de Versailles ; texte visible '16-19 June 2027' (le site répond 403 aux robots)" },
  "3d-print-lyon": { start: "2027-09-15", end: "2027-09-16", source: "https://www.3dprint-exhibition-lyon.com", proof: "relecture mécanique : '15 et 16 septembre 2027 Eurexpo Lyon' ; rejet automatique dû au seul écart de 468 jours (passage de juin à septembre, format 2 jours)" },
  "playtime-paris": { start: "2027-01-30", end: "2027-02-01", source: "https://www.iloveplaytime.com/playtime-paris/", proof: "navigateur : 'NEXT EDITION, JANUARY 30 – FEBRUARY 1', Parc Floral de Paris ; année non écrite sur la page, déduite des brochures BROCHURE-PARIS-2027.pdf mises en ligne en août 2026 (samedi au lundi, cohérent)" },
  "eurosatory-paris": { start: "2028-06-19", end: "2028-06-23", source: "https://www.eurosatory.com/", proof: "navigateur : image officielle bloc-date-2028.png '19-23 JUIN 2028, PARIS' ; rythme bisannuel cohérent ; lieu non reconfirmé par le site, inchangé en base" },
  "foire-de-paris": { start: "2027-04-30", end: "2027-05-10", source: "https://www.comexposium.com/newsroom/presse/nos-evenements/agenda-des-evenements/foire-de-paris/", proof: "relecture mécanique de l'agenda de l'organisateur Comexposium : '30 Avr 2027 - 10 Mai 2027, Paris' (foiredeparis.fr répond 403) ; lieu non reconfirmé, inchangé en base" },
  "ready-for-it-monaco": { start: "2027-06-01", end: "2027-06-03", source: "https://www.comexposium.com/newsroom/presse/nos-evenements/agenda-des-evenements/ready-for-it/", proof: "relecture mécanique de l'agenda de l'organisateur Comexposium : '1 Juin 2027 - 3 Juin 2027, Monaco' (ready-for-it.com répond 403) ; lieu non reconfirmé, inchangé en base" },
  "maison-objet-paris": { start: "2027-01-14", end: "2027-01-18", source: "https://www.maison-objet.com/paris", proof: "navigateur (anti-robot Incapsula) : '10-14 septembre 2026, 14-18 janvier 2027, Parc des expositions Paris Nord Villepinte'" },
  "salon-mondial-du-tourisme-paris": { start: "2027-03-11", end: "2027-03-14", source: "https://www.salons-du-tourisme.com/fr-FR/Mondial-Paris", proof: "navigateur : 'Salon Mondial du Tourisme – Paris 2027, 11 - 14 mars 2027, Paris Expo Porte de Versailles' ; classé site-mort car l'ancien domaine ne résout plus, le salon a changé de domaine" },
  "innorobo-by-sido": { start: "2027-09-15", end: "2027-09-16", source: "https://www.sido-lyon.com/", proof: "relecture mécanique : 'Rendez-vous les 15 et 16 septembre 2027 à Eurexpo Lyon pour la 13e édition' ; changement de lieu dans la même ville (Centre de Congrès de Lyon vers Eurexpo Lyon)", venue: { name: "Eurexpo Lyon", slug: "eurexpo-lyon" } },
};

type Fix = { slug: string; patch: Record<string, string>; source: string };
const SEMESTRIEL = "deux éditions par an, vérifié sur le site officiel lors du refresh éditorial du 2026-09-21 ('bisannuel' signifie tous les deux ans)";
const FIXES: Fix[] = [
  { slug: "bijorhca-paris", patch: { frequency: "semestriel", website_url: "https://wsn-events.com/events/bijorhca" }, source: `${SEMESTRIEL} ; bijorhca.com redirige vers le portail WSN` },
  { slug: "interfiliere-paris", patch: { frequency: "semestriel", website_url: "https://wsn-events.com/events/interfiliere-paris" }, source: `${SEMESTRIEL} ; interfiliere.com répond 503` },
  { slug: "whos-next-paris", patch: { frequency: "semestriel", website_url: "https://wsn-events.com/events/whos-next" }, source: `${SEMESTRIEL} ; whosnext.com redirige vers l'accueil du portail WSN` },
  { slug: "premiere-vision-paris", patch: { frequency: "semestriel" }, source: SEMESTRIEL },
  { slug: "texworld-paris", patch: { frequency: "semestriel" }, source: SEMESTRIEL },
  { slug: "maison-objet-paris", patch: { frequency: "semestriel" }, source: "maison-objet.com/paris : 'Deux sessions, uniques et complémentaires, chaque année'" },
  { slug: "japan-expo-paris", patch: { website_url: "https://paris.japan-expo.com/", organizer_name: "SEFA Event" }, source: "japan-expo-paris.com redirige en 301 ; mentions légales de SEFA Event sans groupe, Iconik Global est un prestataire de standisme (review du 2026-09-21)" },
  { slug: "vivatech", patch: { website_url: "https://vivatech.com/" }, source: "vivatechnology.com redirige vers vivatech.com" },
  { slug: "salon-mondial-du-tourisme-paris", patch: { website_url: "https://www.salons-du-tourisme.com/fr-FR/Mondial-Paris" }, source: "ancien domaine salon-mondial-tourisme.com en échec DNS" },
  { slug: "salon-etudiant-ile-de-france", patch: { website_url: "https://salon-de-l-etudiant-en-ile-de-france-paris.salon.letudiant.fr/" }, source: "site propre au salon (dates, exposants, accessibilité), l'ancienne valeur était la page liste de tous les salons L'Étudiant" },
];

const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", timeZone: "UTC" });

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const journal = JSON.parse(readFileSync(JOURNAL, "utf8"));

  console.log("\n--- Rolls arbitrés");
  for (const [slug, r] of Object.entries(ROLLS)) {
    const { data: s, error } = await sb.from("salons").select("start_date,end_date,status,venue").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (s.start_date === r.start && s.end_date === r.end) { console.log(`DÉJÀ APPLIQUÉ ${slug}`); continue; }
    if (s.status !== "published") throw new Error(`${slug}: statut ${s.status}`);
    if (!s.end_date || s.end_date >= TODAY || r.start <= s.end_date) throw new Error(`${slug}: dates incohérentes (base ${s.end_date}, cible ${r.start})`);
    const patch: Record<string, unknown> = { start_date: r.start, end_date: r.end, edition_year: Number(r.start.slice(0, 4)) };
    if (r.venue) {
      const { data: v } = await sb.from("venues").select("id").eq("slug", r.venue.slug).maybeSingle();
      if (!v) throw new Error(`${slug}: lieu ${r.venue.slug} introuvable`);
      patch.venue = r.venue.name;
      patch.venue_id = v.id;
    }
    console.log(`ROLL ${slug} : ${s.start_date}/${s.end_date} -> ${r.start} (${weekday(r.start)}) / ${r.end} (${weekday(r.end)})${r.venue ? ` | lieu ${s.venue} -> ${r.venue.name}` : ""}`);
    if (APPLY) {
      const { data: rows, error: upErr } = await sb.from("salons").update(patch as never).eq("slug", slug).eq("end_date", s.end_date).select("slug");
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
      if (!rows?.length) throw new Error(`${slug}: aucune ligne mise à jour (verrou optimiste)`);
      journal[slug] = { outcome: "applied", at: TODAY, from: { start_date: s.start_date, end_date: s.end_date }, to: { start_date: r.start, end_date: r.end, edition_year: Number(r.start.slice(0, 4)) }, source_url: r.source, reasons: [`arbitrage en session : ${r.proof}`] };
    }
  }

  console.log("\n--- Corrections de données");
  for (const f of FIXES) {
    const cols = Object.keys(f.patch).join(",");
    const { data: s, error } = await sb.from("salons").select(cols).eq("slug", f.slug).single();
    if (error) throw new Error(`${f.slug}: ${error.message}`);
    const cur = s as unknown as Record<string, string | null>;
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
