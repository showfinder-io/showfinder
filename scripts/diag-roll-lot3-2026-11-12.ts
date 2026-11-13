// Lot 3 du 2026-11-12 : fiches signalées fausses (metal-expo-paris, siane-toulouse, solscope).
// bepositive-lyon contrôlée et conforme au site officiel : hors lot (aucune donnée ne change).
// solscope-lyon-2026 : doublon draft de solscope, déjà en 301 dans next.config.ts : hors lot.
// Modes : export | apply-data [slugs] [--apply]. Sans --apply : dry-run, aucune écriture.
// Chaque champ porte sa valeur attendue en base (verrou) : si la base ne porte ni l'ancienne
// ni la nouvelle valeur, le script s'arrête sans rien écrire.
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const DIR = "handoff/edito-lot3-2026-11-12";
const MODE = process.argv[2];
const APPLY = process.argv.includes("--apply");
const FIELDS =
  "slug,name,status,start_date,end_date,edition_year,dates_confirmed,city,venue,venue_id,venue_lat,venue_lng,website_url,organizer_name,co_organizer_name,frequency,seo_title,seo_description,seo_title_en,seo_description_en,editorial_mdx,editorial_mdx_en";

type Val = string | number | boolean | null;
type Target = {
  status: "published" | "draft"; // statut attendu, jamais modifié par ce script
  data: Record<string, { from: Val; to: Val }>;
  venue?: { slug: string; fromSlug: string }; // venue, venue_id, venue_lat, venue_lng suivent ce lieu
  source_url: string;
  quote: string;
  note: string;
};

const TARGETS: Record<string, Target> = {
  "siane-toulouse": {
    status: "published",
    data: {
      start_date: { from: "2026-10-13", to: "2027-10-19" },
      end_date: { from: "2026-10-15", to: "2027-10-21" },
      edition_year: { from: 2026, to: 2027 },
    },
    source_url: "https://www.salonsiane.com/",
    quote: "« Au MEETT à TOULOUSE 19 20 21 OCTOBRE 2027 », « 22 ème édition en 2027 », « 14 000 visiteurs en 2026 », « 1287 acheteurs en 2026 » (relevé curl le 2026-11-12).",
    note: "Roll de dates à lieu constant (MEETT Toulouse). L'édition 2026 (21e, 13-15 octobre 2026) est passée : la décrire au passé. Bilan 2026 affiché sur l'accueil : 14 000 visiteurs et 1287 acheteurs en 2026. Le compteur d'exposants de l'accueil se contredit (« +580 exposants en 2025 » et « 600 exposants en 2025 ») : ne pas l'utiliser. Lauréats des Trophées 2026 publiés sur https://www.salonsiane.com/les-trophees-du-siane/. Dossier d'inscription 2027 en ligne : https://www.salonsiane.com/wp-content/uploads/2026/11/dossier-inscription_SIANE-2027.pdf.",
  },
  solscope: {
    status: "published",
    data: {
      start_date: { from: null, to: "2027-06-16" },
      end_date: { from: null, to: "2027-06-17" },
      dates_confirmed: { from: false, to: true },
    },
    source_url: "https://www.solscope.fr/date-lieu-acces-et-horaires.htm",
    quote: "« 16 - 17 juin 2027 - Lyon Eurexpo Adresse : EUREXPO - Entrée visiteurs HALL 7 Boulevard de l'Europe, 69680 Chassieu », « Horaires d'ouverture de l'exposition : Mercredi 8h30 - 18h Jeudi 8h30 -18h » ; accueil https://www.solscope.fr/ : « revient à Lyon Eurexpo les 16 et 17 juin 2027 » (relevé curl le 2026-11-12).",
    note: "Dates 2027 désormais publiées, lieu inchangé (Eurexpo, Hall 7). Le texte dit encore « lieu et dates pas encore publiés » : refresh minimal. Le doublon solscope-lyon-2026 (draft, issu du seed batch2) est déjà redirigé en 301 vers /salons/solscope.",
  },
  "metal-expo-paris": {
    status: "draft",
    data: {
      name: { from: "Metal Expo", to: "Métal Expo" },
      start_date: { from: "2026-09-15", to: "2027-09-28" },
      end_date: { from: "2026-09-17", to: "2027-09-30" },
      edition_year: { from: 2026, to: 2027 },
      frequency: { from: "annuel", to: "bisannuel" },
      website_url: { from: "https://www.metal-expo.com", to: "https://www.metal-expo.fr" },
      organizer_name: { from: "Metal Expo SAS", to: "Union des métalliers" },
      co_organizer_name: { from: null, to: "PYC Média et Infopro Digital" },
    },
    venue: { slug: "paris-expo-porte-de-versailles", fromSlug: "paris-nord-villepinte" },
    source_url: "https://www.metal-expo.fr/",
    quote: "« 28 | 29 | 30 Septembre 2027 - Paris Expo Porte de Versailles - Hall 7.1 » ; communiqué du 10 juin 2026 (https://cms-prd-idts.s3.amazonaws.com/public/2027/metal-expo/MetalExpo_Communiqu%C3%A9_de_presse_20260610.pdf, lié depuis l'accueil) : « Cette nouvelle édition se tiendra les 28, 29 et 30 septembre 2027 à Paris Expo Porte de Versailles, hall 7.1 », « l'Union des métalliers s'appuie sur deux partenaires clés : PYC Média et Infopro Digital, co-organisateurs de l'événement », « Organisé tous les deux ans » (relevé curl le 2026-11-12).",
    note: "Fiche draft sans MDX, redirigée en 301 vers /salons/batimat depuis la cohorte 9 (Metal Expo était alors une composante d'Equipbaie-Métalexpo by Batimat). Le salon redevient indépendant en 2027 : fiche entièrement à écrire (pas un refresh), données de base issues du seed batch2 toutes fausses (Villepinte, 15-17 septembre 2026, annuel, Metal Expo SAS, metal-expo.com qui ne répond plus). Le statut reste draft : la publication suppose le process writer + 2 reviewers (CLAUDE.md règle 13) et le retrait du 301 /salons/metal-expo-paris de next.config.ts dans le même déploiement.",
  },
};

async function venueOf(slug: string) {
  const { data: v, error } = await sb.from("venues").select("id,name,lat,lng").eq("slug", slug).single();
  if (error || !v) throw new Error(`lieu ${slug} introuvable`);
  if (v.lat === null || v.lng === null) throw new Error(`lieu ${slug} sans coordonnées`);
  return v;
}

// Patch complet (données + lieu) et valeurs attendues avant écriture
async function plan(slug: string, t: Target) {
  const patch: Record<string, Val> = {};
  const expected: Record<string, Val> = {};
  for (const [k, { from, to }] of Object.entries(t.data)) {
    patch[k] = to;
    expected[k] = from;
  }
  if (t.venue) {
    const [to, from] = await Promise.all([venueOf(t.venue.slug), venueOf(t.venue.fromSlug)]);
    Object.assign(patch, { venue_id: to.id, venue: to.name, venue_lat: to.lat, venue_lng: to.lng });
    Object.assign(expected, { venue_id: from.id });
  }
  return { patch, expected };
}

async function exportLot() {
  for (const d of ["input", "writer", "review", "final", "sources"]) mkdirSync(`${DIR}/${d}`, { recursive: true });
  for (const [slug, t] of Object.entries(TARGETS)) {
    const { data: cur, error } = await sb.from("salons").select(FIELDS).eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    const c = cur as unknown as Record<string, Val>;
    const { patch } = await plan(slug, t);
    const fiche = { ...c, ...patch };
    const { data: v } = await sb.from("venues").select("slug").eq("id", fiche.venue_id as string).maybeSingle();
    writeFileSync(
      `${DIR}/input/${slug}.json`,
      JSON.stringify(
        {
          fiche: { ...fiche, venue_slug: v?.slug ?? null },
          current_data: Object.fromEntries(Object.keys(patch).map((k) => [k, c[k]])),
          previous_edition: { start_date: c.start_date, end_date: c.end_date, edition_year: c.edition_year, city: c.city, venue: c.venue },
          roll_source_url: t.source_url,
          roll_quote: t.quote,
          roll_notes: t.note,
        },
        null,
        2,
      ),
    );
    console.log(`${slug} [${c.status}] : ${fiche.start_date ?? "null"} -> ${fiche.end_date ?? "null"} | ${fiche.city} | ${fiche.venue} | MDX ${String(c.editorial_mdx ?? "").length} c | données cibles : ${Object.keys(patch).join(",")}`);
  }
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug").eq("status", "published"),
    sb.from("venues").select("slug"),
    sb.from("sectors").select("slug"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
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
  const only = process.argv.slice(3).filter((a) => !a.startsWith("--"));
  for (const [slug, t] of Object.entries(TARGETS)) {
    if (only.length && !only.includes(slug)) continue;
    const { patch, expected } = await plan(slug, t);
    const { data: cur, error } = await sb.from("salons").select(Object.keys(patch).join(",") + ",status").eq("slug", slug).single();
    if (error) throw new Error(`${slug}: ${error.message}`);
    const c = cur as unknown as Record<string, Val>;
    if (c.status !== t.status) throw new Error(`${slug}: statut ${c.status}, attendu ${t.status}`);
    // Verrou : chaque champ verrouillé porte l'ancienne valeur (à faire) ou la nouvelle (déjà fait)
    const locked = Object.entries(expected).filter(([k, from]) => c[k] !== from && c[k] !== patch[k]);
    if (locked.length) throw new Error(`${slug}: verrou, la base a changé (${locked.map(([k, from]) => `${k} = ${c[k]}, attendu ${from}`).join(" ; ")})`);
    const diff = Object.entries(patch).filter(([k, v]) => c[k] !== v);
    if (!diff.length) { console.log(`DÉJÀ APPLIQUÉ ${slug}`); continue; }
    console.log(`DATA ${slug} [${c.status}] : ${diff.map(([k, v]) => `${k} ${c[k]} -> ${v}`).join(" ; ")}`);
    if (APPLY) {
      let q = sb.from("salons").update(patch as never).eq("slug", slug);
      for (const [k, from] of Object.entries(expected)) q = from === null ? q.is(k, null) : q.eq(k, from as string);
      const { data: up, error: upErr } = await q.select("slug");
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
      if (!up?.length) throw new Error(`${slug}: aucune ligne mise à jour (verrou)`);
    }
  }
}

(MODE === "export" ? exportLot() : MODE === "apply-data" ? applyData() : Promise.reject(new Error("mode : export | apply-data"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
