/**
 * Chantier CTR prestataires et lieux (2026-10-29) : classe l'intention de
 * chaque couple (requête, page) GSC des gabarits /prestataires/* et /lieux/*
 * avec Jev (TypeSafe, question Choice), au lieu d'un LLM.
 * Entrée : audits/ctr-prestataires-lieux-2026-10-29/gsc-raw.json
 * (export de tasks/ctr-prestataires-lieux/gsc-export.mjs).
 * Idempotent : reprend là où le fichier de sortie s'est arrêté.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-ctr-prestataires-lieux-jev.ts
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";

const DIR = "audits/ctr-prestataires-lieux-2026-10-29";
const OUT = `${DIR}/jev-intents-v2.jsonl`;
// v1 sans nom d'entité : Jev prenait "design location" (marque) pour une requête métier.
// v2 : le nom de l'entreprise ou du lieu de la page est dans l'état.
const ENTITIES: Record<string, string> = JSON.parse(readFileSync(`${DIR}/entities.json`, "utf8"));
const KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) throw new Error("TYPESAFE_API_KEY absent de l'environnement");

type Row = { keys: string[]; clicks: number; impressions: number; position: number };
const raw = JSON.parse(readFileSync(`${DIR}/gsc-raw.json`, "utf8")) as Record<"prestataires" | "lieux", { queryPage: Row[] }>;

const CRITERIA = {
  prestataire_type: "Cherche un type de prestataire ou de service événementiel (standiste, fabricant de stand, location de mobilier, audiovisuel, traiteur...), avec ou sans ville, sans nommer une entreprise précise",
  prestataire_marque: "Cherche une entreprise précise par son nom (marque, raison sociale), éventuellement avec un mot comme mobilier, location, paris",
  lieu_infos: "Cherche un lieu d'exposition ou de congrès précis pour lui-même : son site, sa présentation, son adresse, son accès, son plan, son parking, ses halls",
  lieu_agenda: "Cherche les salons ou événements qui ont lieu dans un lieu ou une ville (programme, agenda, salon à tel endroit, salon à telle date)",
  organiser_evenement: "Cherche à louer un espace, organiser un séminaire, une réunion ou un événement, ou un service sur place pour son propre événement",
  hors_sujet: "Requête sans rapport avec les salons professionnels, les lieux d'exposition ou les prestataires événementiels",
};

const jobs = (["prestataires", "lieux"] as const).flatMap((g) =>
  raw[g].queryPage.map((r) => ({ gabarit: g, query: r.keys[0], page: r.keys[1].replace(/^https:\/\/(www\.)?agoris\.io/, "") })),
);
const done = new Set<string>();
if (existsSync(OUT)) for (const l of readFileSync(OUT, "utf8").split("\n").filter(Boolean)) { const r = JSON.parse(l); done.add(`${r.query}|${r.page}`); }
const todo = jobs.filter((j) => !done.has(`${j.query}|${j.page}`));
console.log(`${todo.length} couples à classer (${done.size} déjà faits)`);

async function classify(j: (typeof jobs)[number], attempt = 0): Promise<unknown> {
  const res = await fetch("https://api.typesafe.ai/v1/systemone", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "jev-latest",
      state: { requete: j.query, page_agoris_affichee: j.page, sujet_de_la_page: ENTITIES[j.page.replace(/^\/en/, "")] ?? null },
      questions: {
        intention: {
          type: "choice",
          instructions: "Un internaute a tapé la requête `requete` sur Google. Que cherche-t-il ? Juge l'intention de la requête elle-même ; `page_agoris_affichee` (annuaire de salons professionnels, de lieux d'exposition et de prestataires événementiels) indique seulement quelle page lui a été proposée, et `sujet_de_la_page` le nom de l'entreprise, du lieu ou du métier qu'elle présente : si la requête reprend ce nom propre, c'est une recherche de cette entreprise ou de ce lieu.",
          criteria: CRITERIA,
        },
      },
    }),
  });
  if ((res.status === 429 || res.status === 529) && attempt < 6) {
    await new Promise((ok) => setTimeout(ok, 1000 * 2 ** attempt));
    return classify(j, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  let inTok = 0, outTok = 0;
  const CONC = 4;
  for (let i = 0; i < todo.length; i += CONC) {
    const batch = todo.slice(i, i + CONC);
    const out = await Promise.all(batch.map(async (j) => {
      const r = (await classify(j)) as { answers: { intention: { choice: string; confidence: number } }; usage: { input_tokens: number; output_tokens: number } };
      inTok += r.usage.input_tokens; outTok += r.usage.output_tokens;
      return { ...j, intention: r.answers.intention.choice, confidence: r.answers.intention.confidence };
    }));
    for (const o of out) appendFileSync(OUT, JSON.stringify(o) + "\n");
    if ((i / CONC) % 50 === 0) console.log(`${Math.min(i + CONC, todo.length)}/${todo.length}`);
  }
  console.log(`Terminé. Tokens : ${inTok} en entrée, ${outTok} en sortie`);
}

main().catch((e) => { console.error(e); process.exit(1); });
