/**
 * Régression de la proximité sans géocodage et de la rotation quotidienne (src/lib/geo-fr.ts).
 * Cas d'origine : le filtre par ville exacte de /prestataires ne rapprochait pas un standiste de
 * Genas d'un exposant lyonnais. Le test prouve que code postal -> département -> région le fait.
 * Usage : ./node_modules/.bin/tsx scripts/test-geo-fr.ts
 */
import assert from "node:assert/strict";
import {
  DEPARTMENTS, REGIONS, departmentFromPostalCode, departmentsOfRegion, parseZone, zoneParam, zoneLabel,
  splitByZone, rotateDaily, parisDayIndex,
} from "../src/lib/geo-fr";

// Table : 101 départements, 18 régions, chaque département pointe vers une région connue.
assert.equal(DEPARTMENTS.length, 101);
assert.equal(new Set(DEPARTMENTS.map((d) => d.code)).size, 101);
assert.equal(REGIONS.length, 18);
assert.ok(DEPARTMENTS.every((d) => REGIONS.some((r) => r.code === d.region)));
assert.deepEqual(departmentsOfRegion("11"), ["75", "77", "78", "91", "92", "93", "94", "95"]);

// Code postal -> département, avec les pièges : Corse, outre-mer, Monaco, saisie invalide.
assert.equal(departmentFromPostalCode("69003"), "69");
assert.equal(departmentFromPostalCode("01000"), "01");
assert.equal(departmentFromPostalCode("93420"), "93");
assert.equal(departmentFromPostalCode("20000"), "2A");
assert.equal(departmentFromPostalCode("20137"), "2A");
assert.equal(departmentFromPostalCode("20200"), "2B");
assert.equal(departmentFromPostalCode("20600"), "2B");
assert.equal(departmentFromPostalCode("97400"), "974");
assert.equal(departmentFromPostalCode("98000"), null);
assert.equal(departmentFromPostalCode("6900"), null);
assert.equal(departmentFromPostalCode("lyon"), null);
assert.equal(departmentFromPostalCode(null), null);

// Zone : code postal, département, région préfixée ; aller-retour par l'URL.
assert.deepEqual(parseZone("69740"), { region: "84", department: "69", postalCode: "69740" });
assert.deepEqual(parseZone(" 2a "), { region: "94", department: "2A", postalCode: null });
assert.deepEqual(parseZone("r84"), { region: "84", department: null, postalCode: null });
// Piège : « 01 » est l'Ain (département), « r01 » la Guadeloupe (région).
assert.equal(parseZone("01")?.region, "84");
assert.equal(parseZone("r01")?.region, "01");
assert.equal(parseZone("r99"), null);
assert.equal(parseZone("99"), null);
assert.equal(parseZone(""), null);
for (const raw of ["69", "2A", "r11"]) assert.equal(zoneParam(parseZone(raw)!), raw);
// Le code postal saisi ne part jamais dans l'URL : seul son département compte.
assert.equal(zoneParam(parseZone("69740")!), "69");
assert.equal(zoneLabel(parseZone("69740")!), "Rhône (69)");
assert.equal(zoneLabel(parseZone("r11")!), "Île-de-France");

// Cas d'origine : un exposant lyonnais (69003) doit trouver le standiste de Genas (69) en tête,
// celui de Grenoble (38) ensuite, et pas celui de Paris.
const providers = [
  { slug: "paris", city: "Paris", department: "75" },
  { slug: "grenoble", city: "Grenoble", department: "38" },
  { slug: "genas", city: "Genas", department: "69" },
  { slug: "sans-departement", city: null, department: null },
];
// Sanity : l'ancien filtre (ville exacte) ratait bien Genas, sinon ce test ne garderait rien.
assert.deepEqual(providers.filter((p) => p.city === "Lyon"), []);
const split = splitByZone(providers, parseZone("69003")!);
assert.deepEqual(split.department.map((p) => p.slug), ["genas"]);
assert.deepEqual(split.region.map((p) => p.slug), ["grenoble"]);
assert.deepEqual(split.elsewhere.map((p) => p.slug), ["paris", "sans-departement"]);
// Zone régionale sans département : personne en tête, toute la région au même niveau.
const regional = splitByZone(providers, parseZone("r84")!);
assert.deepEqual(regional.department, []);
assert.deepEqual(regional.region.map((p) => p.slug), ["grenoble", "genas"]);

// Rotation : déterministe, indépendante de l'ordre d'entrée, complète, et qui tourne vraiment.
const list = Array.from({ length: 66 }, (_, i) => ({ slug: `p${String(i).padStart(2, "0")}`, subscription_tier: "free" }));
const day = 20717;
assert.deepEqual(rotateDaily(list, day), rotateDaily([...list].reverse(), day));
assert.equal(new Set(rotateDaily(list, day).map((p) => p.slug)).size, 66);
const top = (d: number) => rotateDaily(list, d).slice(0, 8).map((p) => p.slug);
assert.notDeepEqual(top(day), top(day + 1));
// La première page se renouvelle entièrement d'un jour à l'autre.
assert.equal(top(day).filter((s) => top(day + 1).includes(s)).length, 0);
// Sur un cycle, chaque prestataire passe en première page.
const seen = new Set<string>();
for (let d = 0; d < 66; d++) top(day + d).forEach((s) => seen.add(s));
assert.equal(seen.size, 66);
// Piège : une petite liste (4 traiteurs) doit tourner aussi. Un décalage de 8 par jour modulo 4 resterait à 0.
const small = list.slice(0, 4);
assert.equal(new Set([0, 1, 2, 3].map((d) => rotateDaily(small, day + d)[0].slug)).size, 4);
// Premium devant, quel que soit le jour.
const withPremium = [...list.slice(0, 5), { slug: "zz-premium", subscription_tier: "premium" }];
for (let d = 0; d < 6; d++) assert.equal(rotateDaily(withPremium, day + d)[0].slug, "zz-premium");
assert.deepEqual(rotateDaily([], day), []);

// Jour de Paris : 23h30 UTC le 21 est déjà le 22 à Paris (heure d'été).
assert.equal(parisDayIndex(new Date("2026-09-21T23:30:00Z")), parisDayIndex(new Date("2026-09-22T10:00:00Z")));
assert.equal(parisDayIndex(new Date("2026-09-21T21:30:00Z")) + 1, parisDayIndex(new Date("2026-09-22T10:00:00Z")));

console.log("OK : proximité sans géocodage et rotation quotidienne");
