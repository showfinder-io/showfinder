/**
 * Scoring des candidats (2026-09-27) : classe chaque résultat du top 10 des
 * SERP "<nom> <année>" (audits/scoring-candidats-2026-09-27/candidats-serp.json)
 * avec Jev (TypeSafe, question Choice), au lieu d'un LLM. Sert à mesurer la
 * concurrence réelle : pages dédiées au salon (agrégateurs, médias,
 * institutionnels) vs bruit (réseaux sociaux, exposants, hors sujet).
 * Idempotent : reprend là où le fichier de sortie s'est arrêté.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-scoring-candidats-jev.ts
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";

const DIR = "audits/scoring-candidats-2026-09-27";
const OUT = `${DIR}/jev-results.jsonl`;
const KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) throw new Error("TYPESAFE_API_KEY absent de l'environnement");

type Serp = { name: string; keyword: string; website_url: string | null; organic_results: { rank_group: number; domain: string; url: string; title: string }[] };
const serps: Serp[] = JSON.parse(readFileSync(`${DIR}/candidats-serp.json`, "utf8"));

const CRITERIA = {
  officiel: "Site officiel de ce salon précis, ou page de son organisateur consacrée à ce salon",
  agregateur: "Annuaire, calendrier ou base d'événements qui liste ce salon (fiche événement d'un site tiers)",
  media: "Article de presse, média spécialisé ou blog qui parle de ce salon",
  institutionnel: "CCI, collectivité, fédération professionnelle, lieu d'accueil (parc des expositions, centre de congrès) ou office de tourisme qui présente ce salon",
  exposant: "Page d'une entreprise exposante, sponsor ou partenaire qui annonce sa participation à ce salon",
  social: "Réseau social ou plateforme vidéo (Facebook, LinkedIn, Instagram, YouTube, X, TikTok)",
  hors_sujet: "Résultat qui ne concerne pas ce salon : homonyme, autre événement, autre sens du mot, page sans rapport",
};

const done = new Set<string>();
if (existsSync(OUT)) for (const l of readFileSync(OUT, "utf8").split("\n").filter(Boolean)) { const r = JSON.parse(l); done.add(`${r.name}|${r.rank}`); }

const jobs = serps.flatMap((s) => s.organic_results.filter((r) => r.rank_group <= 10).map((r) => ({ s, r })))
  .filter(({ s, r }) => !done.has(`${s.name}|${r.rank_group}`));
console.log(`${jobs.length} résultats à classer (${done.size} déjà faits)`);

async function classify(s: Serp, r: Serp["organic_results"][number], attempt = 0): Promise<unknown> {
  const res = await fetch("https://api.typesafe.ai/v1/systemone", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "jev-latest",
      state: { salon: s.name, site_officiel_connu: s.website_url, requete: s.keyword, resultat: { domaine: r.domain, url: r.url, titre: r.title } },
      questions: {
        categorie: {
          type: "choice",
          instructions: "Le résultat `resultat` est apparu sur Google pour la requête `requete`, qui cherche le salon professionnel `salon`. Quel type de page est ce résultat, par rapport à ce salon ?",
          criteria: CRITERIA,
        },
      },
    }),
  });
  if ((res.status === 429 || res.status === 529) && attempt < 6) {
    await new Promise((ok) => setTimeout(ok, 1000 * 2 ** attempt));
    return classify(s, r, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
let inTok = 0, outTok = 0;
const CONC = 4;
for (let i = 0; i < jobs.length; i += CONC) {
  const batch = jobs.slice(i, i + CONC);
  const out = await Promise.all(batch.map(async ({ s, r }) => {
    const j = (await classify(s, r)) as { answers: { categorie: { choice: string; confidence: number; probabilities: Record<string, number> } }; usage: { input_tokens: number; output_tokens: number } };
    inTok += j.usage.input_tokens; outTok += j.usage.output_tokens;
    return { name: s.name, rank: r.rank_group, domain: r.domain, title: r.title, categorie: j.answers.categorie.choice, confidence: j.answers.categorie.confidence, probabilities: j.answers.categorie.probabilities };
  }));
  for (const o of out) appendFileSync(OUT, JSON.stringify(o) + "\n");
  if ((i / CONC) % 25 === 0) console.log(`${Math.min(i + CONC, jobs.length)}/${jobs.length}`);
}
console.log(`Terminé. Tokens : ${inTok} en entrée, ${outTok} en sortie`);
}

main().catch((e) => { console.error(e); process.exit(1); });
