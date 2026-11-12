// Corrections de dates relevées pendant le lot « Infos pratiques » du 2026-11-12, confirmées par
// deux reviews indépendantes sur le site officiel :
// - tech-and-bio : https://tech-n-bio.com/ (h1) « Prochaine édition du salon agricole
//   international Tech&Bio les 22 & 23 sept. 2027 » ; la base portait le 15-16 septembre 2027
//   (dates_confirmed = false), sans source trouvée.
// Le texte de la fiche (MDX FR+EN) porte déjà le 22-23 septembre (appliqué juste avant).
// Verrou optimiste sur les anciennes dates. Dry-run par défaut ; --apply pour écrire. Idempotent.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-dates-infos-pratiques-2026-11-12-apply.ts [--apply]

import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const FIXES = [
  { slug: "tech-and-bio", from: { start_date: "2027-09-15", end_date: "2027-09-16" }, to: { start_date: "2027-09-22", end_date: "2027-09-23", dates_confirmed: true } },
  // mipim-cannes : « 16-19 March 2027 » (https://www.mipim.com/en-gb.html, FAQ : « Tuesday, 16 March » au
  // « Friday, 19 March ») ; le 15 mars en base était le lundi d'ouverture du comptoir d'inscription.
  { slug: "mipim-cannes", from: { start_date: "2027-03-15", end_date: "2027-03-19" }, to: { start_date: "2027-03-16", end_date: "2027-03-19", dates_confirmed: true } },
];

(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  // rendez-vous-en-france : lieu 2027 absent en base. https://rendezvousenfrance.pro/informations-pratiques :
  // « Parc des Expositions de Bordeaux / Cours Charles Bricaud / 33300 Bordeaux » (deux reviews
  // indépendantes). Texte de la fiche appliqué juste avant avec le lien /lieux/parc-des-expositions-de-bordeaux.
  {
    const { data: s, error } = await sb.from("salons").select("venue,venue_id").eq("slug", "rendez-vous-en-france").single();
    if (error) throw error;
    const { data: v, error: vErr } = await sb.from("venues").select("id,name,lat,lng").eq("slug", "parc-des-expositions-de-bordeaux").single();
    if (vErr) throw vErr;
    if (s.venue_id === v.id) console.log("DÉJÀ APPLIQUÉ rendez-vous-en-france (lieu)");
    else if (s.venue_id !== null) console.log(`ÉTAT INATTENDU rendez-vous-en-france : venue_id ${s.venue_id}`);
    else {
      console.log(`LIEU rendez-vous-en-france : null -> ${v.name}`);
      if (APPLY) {
        const { error: e } = await sb.from("salons").update({ venue: v.name, venue_id: v.id, venue_lat: v.lat, venue_lng: v.lng }).eq("slug", "rendez-vous-en-france").is("venue_id", null);
        if (e) throw e;
      }
    }
  }
  for (const f of FIXES) {
    const { data: s, error } = await sb.from("salons").select("start_date,end_date,dates_confirmed").eq("slug", f.slug).single();
    if (error) throw error;
    if (s.start_date === f.to.start_date && s.end_date === f.to.end_date) { console.log(`DÉJÀ APPLIQUÉ ${f.slug}`); continue; }
    if (s.start_date !== f.from.start_date || s.end_date !== f.from.end_date) { console.log(`ÉTAT INATTENDU ${f.slug} : ${JSON.stringify(s)}`); continue; }
    console.log(`DATES ${f.slug} : ${s.start_date}/${s.end_date} -> ${f.to.start_date}/${f.to.end_date}`);
    if (APPLY) {
      const { error: e } = await sb.from("salons").update(f.to).eq("slug", f.slug).eq("start_date", f.from.start_date);
      if (e) throw e;
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
