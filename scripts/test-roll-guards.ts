/**
 * Régression des garde-fous du roll automatique (scripts/roll-guards.ts).
 * Les cas bogués sont des handoffs RÉELS classés roll-pret à tort par la routine
 * (lots des 2026-09-14 et 2026-09-21) : le test prouve que les garde-fous les arrêtent.
 * Usage : ./node_modules/.bin/tsx scripts/test-roll-guards.ts
 */
import assert from "node:assert/strict";
import { checkHandoff, pageCarriesDates, quoteCarriesDates, quoteFoundInPage, type Handoff, type SalonRow } from "./roll-guards";

const TODAY = "2026-09-21";
const base: Handoff = {
  slug: "vivatech", status: "roll-pret", checked_at: "2026-09-14",
  current: { start_date: "2026-06-17", end_date: "2026-06-20", edition_year: 2026, city: "Paris", venue: "Paris Expo Porte de Versailles" },
  next: { start_date: "2027-06-16", end_date: "2027-06-19", edition_year: 2027, city: "Paris", venue: "Paris Expo Porte de Versailles" },
  source_url: "https://vivatech.com/", quote: "16-19 June 2027, Paris Expo Porte de Versailles",
  venue_changed: false, city_changed: false,
};
const salon: SalonRow = { slug: "vivatech", status: "published", start_date: "2026-06-17", end_date: "2026-06-20", city: "Paris", frequency: "annuel" };
const rejects = (h: Handoff, s: SalonRow | null, needle: string) => {
  const reasons = checkHandoff(h, s, TODAY);
  assert.ok(reasons.some((r) => r.includes(needle)), `attendu un rejet contenant "${needle}", obtenu : ${JSON.stringify(reasons)}`);
};

// Sanity : le cas sain passe. Sans lui, un garde-fou qui rejette tout validerait tous les tests.
assert.deepEqual(checkHandoff(base, salon, TODAY), []);

// Cas réel 1 : innov-agri-ondes, roll-pret avec city_changed=true (prochaine édition à Grugies).
rejects(
  { ...base, slug: "innov-agri-ondes", city_changed: true, next: { ...base.next!, city: "Grugies" } },
  { ...salon, slug: "innov-agri-ondes", city: "Ondes" },
  "changement de ville",
);
rejects({ ...base, next: { ...base.next!, city: "Grugies" } }, { ...salon, city: "Ondes" }, "différente de la fiche");

// Cas réel 2 : saut à 2029. Rejeté si la fiche est annuelle, accepté si elle est triennale (FIP Lyon).
const fip: Handoff = {
  ...base, slug: "plastic-expo-lyon",
  current: { ...base.current, end_date: "2026-06-05", city: "Lyon" },
  next: { start_date: "2029-06-05", end_date: "2029-06-08", edition_year: 2029, city: "Lyon", venue: "Eurexpo Lyon" },
  quote: "FIP 2029 du 5 au 8 juin 2029 Eurexpo Lyon",
};
rejects(fip, { ...salon, end_date: "2026-06-05", city: "Lyon", frequency: "annuel" }, "incohérent avec la fréquence");
assert.deepEqual(checkHandoff(fip, { ...salon, end_date: "2026-06-05", city: "Lyon", frequency: "triennal" }, TODAY), []);

// Autres garde-fous.
rejects({ ...base, status: "a-arbitrer" }, salon, "seul roll-pret");
rejects(base, { ...salon, end_date: "2026-06-21" }, "modifiée depuis le handoff");
rejects(base, { ...salon, status: "draft" }, "statut draft");
rejects(base, { ...salon, frequency: "ponctuel" }, "pas de roll automatique");
rejects({ ...base, next: { ...base.next!, end_date: null } }, salon, "absentes ou mal formées");
rejects({ ...base, source_url: "https://10times.com/vivatech" }, salon, "agrégateur");
rejects({ ...base, quote: "VivaTech revient en juin 2027" }, salon, "ne porte pas");
rejects({ ...base, next: { ...base.next!, edition_year: 2028 } }, salon, "edition_year");

// Citation : jours et année, accents et entités HTML.
assert.ok(quoteCarriesDates("du 1er au 3 avril 2027", { ...base.next!, start_date: "2027-04-01", end_date: "2027-04-03" }));
assert.ok(!quoteCarriesDates("du 1er au 3 avril 2027", { ...base.next!, start_date: "2027-04-02", end_date: "2027-04-04" }));
const page = "<html><script>var d='16 juin 2099'</script><h1>L&rsquo;&eacute;v&eacute;nement Restau&#39;co</h1><p>PARIS EXPO <b>Porte de Versailles</b> hall 5.1<br>16 juin 2027 de 9h &agrave; 18h</p></html>";
assert.ok(quoteFoundInPage(page, "L'evenement Restau'co PARIS EXPO Porte de Versailles hall 5.1 16 juin 2027 de 9h a 18h"));
assert.ok(!quoteFoundInPage(page, "Porte de Versailles hall 5.1 16 juin 2099"));
assert.ok(!quoteFoundInPage(page, "2027"));

// Relecture de page : formats réels observés le 2026-09-21 (texte, numérique, Schema.org).
const d = (start_date: string, end_date: string) => ({ ...base.next!, start_date, end_date });
assert.ok(pageCarriesDates("<p>La boutique officielle</p><h2>Du 27 ao&ucirc;t au 06 septembre 2027</h2>", d("2027-08-27", "2027-09-06")));
assert.ok(pageCarriesDates("<a href='exhibit.html'>25 – 27. 01. 2027 Paris, Le Bourget</a>", d("2027-01-25", "2027-01-27")));
assert.ok(pageCarriesDates('<script type="application/ld+json">{"startDate":"2027-06-16","endDate":"2027-06-19"}</script>', d("2027-06-16", "2027-06-19")));
assert.ok(pageCarriesDates("<p>Rendez-vous le 16 juin 2027 de 9h à 18h</p>", d("2027-06-16", "2027-06-16")));
// Sanity : une page qui n'annonce que l'édition passée ne valide pas des dates 2027 supposées.
assert.ok(!pageCarriesDates("<h1>VivaTech, du 17 au 20 juin 2026</h1><p>Merci ! Rendez-vous en 2027.</p>", d("2027-06-16", "2027-06-19")));
assert.ok(!pageCarriesDates("<p>Du 16 au 19 mai 2027</p>", d("2027-06-16", "2027-06-19")));

console.log("OK : garde-fous du roll automatique (22 assertions)");
