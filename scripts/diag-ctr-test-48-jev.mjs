// Test CTR 48 : classe l'intention des principales requêtes de chaque page via Jev
// (TypeSafe System One, question Choice). Une requête par page, une question par requête.
// Usage : node --env-file=.env.local scripts/diag-ctr-test-48-jev.mjs <groupes.json> <queries.json> <db-state.json> <out.json>
import { readFileSync, writeFileSync } from "node:fs";

const [groupsFile, queriesFile, dbFile, outFile] = process.argv.slice(2);
const groups = JSON.parse(readFileSync(groupsFile, "utf-8"));
const queries = JSON.parse(readFileSync(queriesFile, "utf-8"));
const salons = Object.fromEntries(JSON.parse(readFileSync(dbFile, "utf-8")).salons.map((s) => [s.slug, s]));

const CRITERIA = {
  navigationnelle:
    "Le chercheur veut atteindre le salon lui-même ou son site officiel : nom du salon seul, sigle, nom + ville ou + année, « site officiel », sans autre besoin exprimé.",
  informationnelle:
    "Le chercheur veut une information pratique ou de fond sur l'événement : dates, lieu, adresse, horaires, programme, conférences, intervenants, billetterie ou inscription visiteur, plan, liste des exposants à visiter, actualités.",
  transactionnelle:
    "Le chercheur envisage d'exposer ou d'acheter une prestation liée : exposer, devenir exposant, prix ou tarif d'un stand, réservation d'espace, dossier exposant, sponsoring, standiste, hôtel pour exposants.",
  hors_sujet:
    "La requête ne porte pas sur ce salon : autre événement, sujet général du secteur sans lien avec le salon, ou requête incompréhensible.",
};

// Requêtes qui couvrent 80 % des impressions de la page, 20 au plus.
function topQueries(rows) {
  const sorted = [...rows].sort((a, b) => b.impressions - a.impressions);
  const total = sorted.reduce((t, r) => t + r.impressions, 0);
  const out = [];
  let acc = 0;
  for (const r of sorted) {
    if (out.length >= 20 || acc >= 0.8 * total) break;
    out.push(r);
    acc += r.impressions;
  }
  return { rows: out, total };
}

async function classify(salon, rows) {
  const state = {
    salon: { nom: salon.name, ville: salon.city, lieu: salon.venue, site_officiel: salon.website_url },
    requetes: rows.map((r) => r.keys[0]),
  };
  const questions = Object.fromEntries(
    rows.map((_, i) => [
      `q${i}`,
      {
        type: "choice",
        instructions: `Quelle intention exprime la requête Google \`requetes[${i}]\` par rapport au salon décrit dans \`salon\` ?`,
        criteria: CRITERIA,
      },
    ])
  );
  const res = await fetch("https://api.typesafe.ai/v1/systemone", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "jev-latest", state, questions }),
  });
  if (!res.ok) throw new Error(`Jev ${res.status} ${await res.text()}`);
  return res.json();
}

const out = {};
for (const g of ["treated", "control"]) {
  for (const p of groups[g]) {
    const { rows, total } = topQueries(queries[`https://www.agoris.io${p.page}`]);
    const r = await classify(salons[p.slug], rows);
    out[p.page] = {
      group: g,
      model: r.model,
      page_impressions: total,
      queries: rows.map((q, i) => ({
        query: q.keys[0],
        impressions: q.impressions,
        clicks: q.clicks,
        position: q.position,
        intent: r.answers[`q${i}`].choice,
        confidence: r.answers[`q${i}`].confidence,
      })),
    };
    const mix = {};
    for (const q of out[p.page].queries) mix[q.intent] = (mix[q.intent] ?? 0) + q.impressions;
    console.log(p.page, r.model, JSON.stringify(mix));
  }
}
writeFileSync(outFile, JSON.stringify(out, null, 2));
