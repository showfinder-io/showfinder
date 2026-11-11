/**
 * Chantier page 2 → page 1 (2026-10-29) : pour chaque couple (page modifiable,
 * requête où la page est en position 11-20, ≥ 3 impressions) de
 * tasks/page2-page1/reference.json, Jev juge si la page répond à la requête
 * et quelle est l'intention de la requête. Identité de la page = title, H1 et
 * meta description lus sur la page en production.
 * Idempotent : reprend là où le fichier de sortie s'est arrêté.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-page2-page1-jev.ts
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";

const DIR = "tasks/page2-page1";
const OUT = `${DIR}/jev-results.jsonl`;
const KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) throw new Error("TYPESAFE_API_KEY absent de l'environnement");

type Row = { keys: string[]; clicks: number; impressions: number; position: number };
const ref: { pages: { url: string }[] } = JSON.parse(readFileSync(`${DIR}/reference.json`, "utf8"));
const pq: Row[] = JSON.parse(readFileSync(`${DIR}/gsc-2026-09-30_2026-10-27/page-query.json`, "utf8"));

// Périmètre modifiable validé : ni /lieux ni /prestataires (chantier 2), pas d'EN en direct
const modifiable = new Set(
  ref.pages.map((p) => p.url).filter((u) => !u.startsWith("/en") && !/^\/(lieux|prestataires)/.test(u))
);
const strip = (u: string) => u.replace(/^https:\/\/(www\.)?agoris\.io/, "");
const couples = pq
  .filter((r) => modifiable.has(strip(r.keys[0])) && r.position >= 10.5 && r.position < 20.5 && r.impressions >= 3)
  .map((r) => ({ url: strip(r.keys[0]), query: r.keys[1], impressions: r.impressions, position: r.position }));

const done = new Set<string>();
if (existsSync(OUT)) for (const l of readFileSync(OUT, "utf8").split("\n").filter(Boolean)) { const r = JSON.parse(l); done.add(`${r.url}|${r.query}`); }
const jobs = couples.filter((c) => !done.has(`${c.url}|${c.query}`));
console.log(`${jobs.length} couples à juger (${done.size} déjà faits)`);

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]+>/g, "").trim();
const pageCache = new Map<string, Promise<{ title: string; h1: string; description: string }>>();
function pageIdentity(url: string) {
  if (!pageCache.has(url)) {
    pageCache.set(url, fetch(`https://www.agoris.io${url}`).then(async (res) => {
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      const html = await res.text();
      return {
        title: decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
        h1: decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""),
        description: decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
      };
    }));
  }
  return pageCache.get(url)!;
}

const QUESTIONS = {
  reponse: {
    type: "choice",
    instructions: "Un internaute a tapé `requete` sur Google et la page `page` d'Agoris (annuaire français de salons professionnels) est apparue. Nous sommes le `date_du_jour`. La page répond-elle à ce que cherche cette requête ?",
    criteria: {
      oui: "La page porte exactement sur ce que cherche la requête (même salon, même lieu, même ville ou même secteur) et peut satisfaire la recherche",
      partiel: "La page porte sur le bon sujet mais pas sur l'angle précis demandé (édition, année, information ou service particulier que la page ne met pas en avant)",
      non: "La requête cherche autre chose : un autre salon, un autre événement, une autre ville, un autre sujet, ou un sens différent des mots",
    },
  },
  intention: {
    type: "choice",
    instructions: "Nous sommes le `date_du_jour`. Quelle est l'intention principale de la requête `requete` ?",
    criteria: {
      info_salon: "Trouver un salon précis ou ses informations pratiques : dates, lieu, édition à venir, exposants, programme",
      liste_salons: "Trouver une liste ou un calendrier de salons (par secteur, ville, période)",
      prestataire: "Trouver un prestataire ou un service pour exposer : standiste, stand, traiteur, audiovisuel, hébergement",
      lieu: "Trouver un lieu d'exposition, son adresse ou son accès",
      edition_passee: "Chercher une édition déjà passée (année révolue par rapport à la date du jour)",
      autre: "Autre intention : emploi, produit, information générale sans rapport avec un salon",
    },
  },
};

type Choice = { choice: string; confidence: number };
type JevResponse = {
  answers: { reponse: Choice; intention: Choice };
  usage: { input_tokens: number; output_tokens: number };
};

async function judge(c: (typeof couples)[number], attempt = 0): Promise<JevResponse> {
  const page = { url: `https://www.agoris.io${c.url}`, ...(await pageIdentity(c.url)) };
  const res = await fetch("https://api.typesafe.ai/v1/systemone", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "jev-latest", state: { date_du_jour: "2026-10-29", requete: c.query, page }, questions: QUESTIONS }),
  });
  if ((res.status === 429 || res.status === 529) && attempt < 6) {
    await new Promise((ok) => setTimeout(ok, 1000 * 2 ** attempt));
    return judge(c, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  let inTok = 0, outTok = 0;
  const CONC = 4;
  for (let i = 0; i < jobs.length; i += CONC) {
    const out = await Promise.all(jobs.slice(i, i + CONC).map(async (c) => {
      const j = await judge(c);
      inTok += j.usage.input_tokens; outTok += j.usage.output_tokens;
      return { ...c, reponse: j.answers.reponse.choice, reponse_conf: j.answers.reponse.confidence, intention: j.answers.intention.choice, intention_conf: j.answers.intention.confidence };
    }));
    for (const o of out) appendFileSync(OUT, JSON.stringify(o) + "\n");
    if ((i / CONC) % 10 === 0) console.log(`${Math.min(i + CONC, jobs.length)}/${jobs.length}`);
  }
  console.log(`Terminé. Tokens : ${inTok} en entrée, ${outTok} en sortie`);
}

main().catch((e) => { console.error(e); process.exit(1); });
