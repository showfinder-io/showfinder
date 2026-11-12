// Lot éditorial roll 2027 du 2026-11-12 (go Julien du 2026-11-12) :
// - les 7 fiches roulées dont le texte est resté sur l'édition passée (file
//   roll-apply-handoffs.ts --queue) ;
// - partie C des arbitrages (tasks/roll-2027/arbitrages-2026-11-11.md) : untec-congres
//   (Salon Actes, édition 2027 à Dijon, dates non publiées), numeriquest-toulouse (THCon,
//   conférences des 29-30 avril 2027, lieu corrigé), architect-at-work-lyon (bisannuel,
//   site officiel) ;
// - deux fiches retail qui présentaient NRF Retail's Big Show Europe « à Paris ».
//
// CLAUDE.md règle 14(f) : les données qui changent la ville, le lieu ou le nom partent
// en base avec le texte refait. D'où deux modes :
//   export      : écrit handoff/edito-lot2-2026-11-12/input/<slug>.json, avec les données
//                 CIBLES déjà appliquées dans `fiche` (les writers rédigent pour l'état final)
//                 et l'état actuel dans `current_data` ;
//   apply-data  : écrit ces données cibles en base, à lancer juste avant
//                 diag-edito-roll-2027-apply.ts --dir handoff/edito-lot2-2026-11-12 --apply.
// Dry-run par défaut pour apply-data ; --apply pour écrire. Idempotent.
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-roll-lot2-2026-11-12.ts export
//         ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-roll-lot2-2026-11-12.ts apply-data [--apply]

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "handoff/edito-lot2-2026-11-12";
const MODE = process.argv[2];
const APPLY = process.argv.includes("--apply");
const FIELDS =
  "slug,name,start_date,end_date,edition_year,dates_confirmed,city,venue,venue_id,venue_lat,venue_lng,website_url,organizer_name,co_organizer_name,frequency,seo_title,seo_description,seo_title_en,seo_description_en,editorial_mdx,editorial_mdx_en";

type Target = {
  data?: Record<string, string | number | boolean | null>;
  venueSlug?: string; // venue, venue_id, venue_lat, venue_lng suivent ce lieu
  coords?: [number, number]; // coordonnées imposées (lieu sans coordonnées en base)
  note: string;
};

const NRF_NOTE =
  "Correction ciblée : la fiche cite NRF Retail's Big Show Europe comme un salon « à Paris » avec un lien vers /salons/paris-retail-week. Cette fiche est dépubliée (301 vers /secteurs/franchise-commerce) car le salon quitte Paris : https://www.nrfbigshoweurope.com/en affiche « Retail's Big Show Europe will return to Amsterdam in late September 2028 » (relevé dans Chrome le 2026-11-11, le site renvoie 403 à curl : ne pas tenter de le fetch, utiliser cette citation). Retirer le lien vers /salons/paris-retail-week et corriger la phrase (édition 2026 à Paris Expo Porte de Versailles au passé, prochaine édition à Amsterdam fin septembre 2028, sans jour). Ne rien changer d'autre que ce passage et ce qui en dépend, en FR et en EN. Si la fiche porte une édition passée (tech-for-retail-paris : 30 nov.-1er déc. 2026, pas encore passée au 2026-11-12), ne pas la rouler.";

const TARGETS: Record<string, Target> = {
  "untec-congres": {
    data: { edition_year: 2027, start_date: null, end_date: null, dates_confirmed: false, city: "Dijon" },
    venueSlug: "parc-des-expositions-de-dijon",
    coords: [47.3288506, 5.0546248],
    note: "Arbitrage Julien du 2026-11-12 : bascule sur l'édition 2027 à Dijon, dates non publiées. Source : https://www.actes-untec.com/informations-pratiques (« Salon Actes 2027 », « Adresse d'Actes Parc des Expositions et Congrès de Dijon 3 boulevard de Champagne »). Salon itinérant : édition 2026 à Chartres (Parc des Expositions L'Iliade, 3-5 juin 2026), au passé. Ne jamais inventer de dates 2027 : écrire que les dates ne sont pas encore publiées. Les coordonnées viennent de Nominatim (3 boulevard de Champagne, Dijon).",
  },
  "numeriquest-toulouse": {
    data: { edition_year: 2027, start_date: "2027-04-29", end_date: "2027-04-30", dates_confirmed: true },
    venueSlug: "universite-paul-sabatier-toulouse",
    note: "Arbitrage Julien du 2026-11-12 : THCon (Toulouse Hacking Convention). https://thcon.party : « Conferences - April 29 th & 30 th, 2027 - Save the date ! », « Marthe Condat auditorium, Paul Sabatier University, Toulouse ». La base portait le Centre de Congrès Pierre Baudis, déjà faux pour 2026 (le site décrivait l'auditorium Marthe Condat pour les conférences et l'ENSEEIHT pour le CTF) : c'est une correction, pas un changement de lieu. La date du CTF 2027 n'est pas publiée. Le slug numeriquest-toulouse ne correspond pas au nom : ne pas le commenter.",
  },
  "architect-at-work-lyon": {
    data: { frequency: "bisannuel", website_url: "https://www.architectatwork.com/fr/events/a@w-lyon" },
    note: "Arbitrage Julien du 2026-11-12 : fréquence passée à bisannuel, site officiel renseigné. https://www.architectatwork.com/fr/events/a@w-lyon (lu dans Chrome le 2026-11-11, redirections en boucle pour curl : utiliser ces citations) : « Lyon 2026 », « Cet événement est passé. Prochaine edition : Printemps 2028. », « 2.937 visiteurs sont venus découvrir 297 innovations », « ARCHITECT@WORK LYON, un succès confirmé pour la 8e édition », thème 2026 « COURTS-CIRCUITS ». Les dates restent celles du 10-11 juin 2026 en base (prochaine édition sans date) : le texte présente 2026 au passé et annonce le printemps 2028 sans jour.",
  },
  "interclima": {
    venueSlug: "paris-expo-porte-de-versailles",
    note: "Fiche roulée par la routine (2-5 octobre 2028, en même temps que Batimat et Idéobain, Paris Builders Show). Le venue_id et les coordonnées pointaient sur Paris Nord Villepinte alors que le texte dit Porte de Versailles : corrigés. L'édition 2026 s'est tenue à Paris Expo Porte de Versailles (bilan RX du 14 octobre 2026 sur batimat.com).",
  },
  "preventica-paris": { note: "Fiche roulée par la routine : refresh minimal selon le brief." },
  "cannes-yachting-festival": { note: "Fiche roulée par la routine : refresh minimal selon le brief." },
  "tfwa-world-exhibition": { note: "Fiche roulée par la routine : refresh minimal selon le brief." },
  "produrable-paris": { note: "Fiche roulée par la routine : refresh minimal selon le brief." },
  "premiere-classe": { note: "Fiche roulée par la routine (deux éditions par an) : refresh minimal selon le brief, le seo_title est encore sur 2026." },
  "ad2s-bordeaux": { note: "Fiche roulée par la routine (bisannuel, édition 2028) : refresh minimal selon le brief." },
  "one-to-one-retail-ecommerce": { note: NRF_NOTE },
  "tech-for-retail-paris": { note: NRF_NOTE },
};

async function target(slug: string, t: Target) {
  const patch: Record<string, unknown> = { ...t.data };
  if (t.venueSlug) {
    const { data: v, error } = await sb.from("venues").select("id,name,lat,lng").eq("slug", t.venueSlug).single();
    if (error || !v) throw new Error(`${slug}: lieu ${t.venueSlug} introuvable`);
    const [lat, lng] = t.coords ?? [v.lat, v.lng];
    if (lat === null || lng === null) throw new Error(`${slug}: lieu ${t.venueSlug} sans coordonnées`);
    Object.assign(patch, { venue: v.name, venue_id: v.id, venue_lat: lat, venue_lng: lng });
  }
  return patch;
}

async function exportLot() {
  const journal = JSON.parse(readFileSync("tasks/roll-2027/journal.json", "utf8"));
  for (const d of ["input", "writer", "review", "final", "sources"]) mkdirSync(`${DIR}/${d}`, { recursive: true });
  for (const [slug, t] of Object.entries(TARGETS)) {
    const { data: cur, error } = await sb.from("salons").select(FIELDS).eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    const patch = await target(slug, t);
    const fiche = { ...cur, ...patch };
    const { data: v } = await sb.from("venues").select("slug").eq("id", fiche.venue_id).maybeSingle();
    const j = journal[slug];
    writeFileSync(
      `${DIR}/input/${slug}.json`,
      JSON.stringify(
        {
          fiche: { ...fiche, venue_slug: v?.slug ?? null },
          current_data: Object.fromEntries(Object.keys(patch).map((k) => [k, (cur as Record<string, unknown>)[k]])),
          previous_edition: j?.from ?? null,
          roll_source_url: j?.source_url ?? null,
          roll_quote: j?.reasons?.[0] ?? null,
          roll_notes: t.note,
        },
        null,
        2,
      ),
    );
    console.log(`${slug} : ${fiche.start_date ?? "null"} -> ${fiche.end_date ?? "null"} | ${fiche.city} | ${fiche.venue} | MDX ${String(cur.editorial_mdx ?? "").length} c${Object.keys(patch).length ? ` | données cibles : ${Object.keys(patch).join(",")}` : ""}`);
  }
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
    sb.from("sectors").select("slug"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
  // Fiches dépubliées dans ce même chantier : aucun lien vers elles.
  const unpublished = ["equipbaie-metalexpo-paris", "paris-retail-week"];
  writeFileSync(
    `${DIR}/published-slugs.json`,
    JSON.stringify(
      {
        salons: s.data!.map((r) => r.slug).filter((x) => !unpublished.includes(x)).sort(),
        lieux: v.data!.map((r) => r.slug).sort(),
        secteurs: sec.data!.map((r) => r.slug).sort(),
      },
      null,
      2,
    ),
  );
  console.log("export OK");
}

async function applyData() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  // Slugs optionnels en argument : n'appliquer que les fiches dont le texte final est prêt.
  const only = process.argv.slice(3).filter((a) => !a.startsWith("--"));
  for (const [slug, t] of Object.entries(TARGETS)) {
    if (only.length && !only.includes(slug)) continue;
    const patch = await target(slug, t);
    if (!Object.keys(patch).length) continue;
    const { data: cur, error } = await sb.from("salons").select(Object.keys(patch).join(",") + ",status").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    const c = cur as unknown as Record<string, unknown>;
    if (c.status !== "published") throw new Error(`${slug}: statut ${c.status}`);
    const diff = Object.entries(patch).filter(([k, v]) => c[k] !== v);
    if (!diff.length) { console.log(`DÉJÀ APPLIQUÉ ${slug}`); continue; }
    console.log(`DATA ${slug} : ${diff.map(([k, v]) => `${k} ${c[k]} -> ${v}`).join(" ; ")}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
  }
  // Lieu de Dijon sans coordonnées en base : mêmes valeurs que la fiche.
  const dijon = TARGETS["untec-congres"].coords!;
  const { data: v } = await sb.from("venues").select("lat,lng").eq("slug", "parc-des-expositions-de-dijon").single();
  if ((!only.length || only.includes("untec-congres")) && v && v.lat === null && v.lng === null) {
    console.log(`LIEU parc-des-expositions-de-dijon : null -> ${dijon.join(" / ")} (Nominatim, 3 boulevard de Champagne)`);
    if (APPLY) {
      const { error } = await sb.from("venues").update({ lat: dijon[0], lng: dijon[1] }).eq("slug", "parc-des-expositions-de-dijon").is("lat", null);
      if (error) throw error;
    }
  }
}

(MODE === "export" ? exportLot() : MODE === "apply-data" ? applyData() : Promise.reject(new Error("mode : export | apply-data"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
