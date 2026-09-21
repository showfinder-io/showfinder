/**
 * Mesure de visibilité GEO d'Agoris : sur quelles questions les moteurs IA
 * (ChatGPT, Claude, Gemini) citent agoris.io, et qui sort à notre place.
 *
 * 1. Collecte : chaque prompt de scripts/seeds/geo-prompts.json est envoyé aux
 *    API OpenAI, Anthropic et Gemini, recherche web activée (sans elle, un site
 *    lancé en 2026 est absent par construction). Modèles milieu de gamme :
 *    c'est ce que voit l'utilisateur par défaut, et le coût est porté par la
 *    recherche web, pas par le modèle.
 * 2. Détection par le code : domaines cités, mention d'Agoris, concurrents.
 * 3. Jugement (Haiku) : une page Agoris existante répond-elle à la question ?
 *    "aucune" = trou de couverture pour le backlog éditorial.
 *
 * Lecture seule, aucun accès DB. Les réponses brutes sont mises en cache :
 * relancer le script ne repaie que les couples (prompt, moteur) manquants.
 *
 * Limite connue : une réponse d'API n'est pas celle de l'application grand
 * public (personnalisation, modèle, outil de recherche). C'est un proxy.
 *
 * Sortie : scripts/output/geo-visibility-YYYY-MM-DD.{json,csv}
 * Usage  : ./node_modules/.bin/tsx scripts/diag-geo-visibility.ts
 *            [--limit 5] [--engines openai,anthropic,gemini] [--no-judge] [--rejudge]
 * Juge : Jev (TypeSafe) si TYPESAFE_API_KEY est dans .env.local, sinon Haiku.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

process.loadEnvFile(".env.local");

// Clé Google AI Studio : source unique dans le skill seo-geo, surchargeable par env.
function googleKey(): string | undefined {
  if (process.env.GOOGLE_AI_STUDIO_API_KEY) return process.env.GOOGLE_AI_STUDIO_API_KEY;
  const p = path.join(os.homedir(), ".claude", "skills", "seo-geo", ".env");
  if (!existsSync(p)) return undefined;
  const m = readFileSync(p, "utf-8").match(/^GOOGLE_AI_STUDIO_API_KEY=(.+)$/m);
  return m?.[1].trim().replace(/^["']|["']$/g, "");
}

const MODELS = {
  openai: "gpt-5.4-mini",
  anthropic: "claude-haiku-4-5-20251001",
  gemini: "gemini-flash-latest",
} as const;
type Engine = keyof typeof MODELS;

const SITE = "agoris.io";
const COMPETITORS = ["10times.com", "eventseye.com", "expodatabase.de", "tradefairdates.com"];

type Prompt = { id: string; family: string; prompt: string };
type Source = { url: string; domain: string };
type Answer = {
  promptId: string;
  engine: Engine;
  model: string;
  text: string;
  sources: Source[];
  searches: number;
  error?: string;
};
type Coverage = { url: string | null; confidence: string };

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const limit = Number(flag("--limit") ?? 0);
const engines = (flag("--engines")?.split(",") ?? Object.keys(MODELS)) as Engine[];
const noJudge = args.includes("--no-judge");
const rejudge = args.includes("--rejudge");

const domainOf = (url: string, title?: string) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    // Gemini renvoie des URLs de redirection : le domaine réel est dans le titre.
    if (host.includes("vertexaisearch") && title) return title.replace(/^www\./, "").toLowerCase();
    return host.toLowerCase();
  } catch {
    return "";
  }
};

async function post(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

// ─── Collecte par moteur ───────────────────────────────────────────────

async function askOpenAI(prompt: string) {
  const json = await post(
    "https://api.openai.com/v1/responses",
    { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    {
      model: MODELS.openai,
      input: prompt,
      tools: [{ type: "web_search", user_location: { type: "approximate", country: "FR" } }],
    }
  );
  let text = "";
  let searches = 0;
  const sources: Source[] = [];
  for (const item of json.output ?? []) {
    if (item.type === "web_search_call") searches++;
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type !== "output_text") continue;
      text += part.text;
      for (const a of part.annotations ?? [])
        if (a.type === "url_citation") sources.push({ url: a.url, domain: domainOf(a.url) });
    }
  }
  return { text, sources, searches };
}

async function askAnthropic(prompt: string) {
  const json = await post(
    "https://api.anthropic.com/v1/messages",
    { "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    {
      model: MODELS.anthropic,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 3,
          user_location: { type: "approximate", country: "FR" },
        },
      ],
    }
  );
  let text = "";
  const sources: Source[] = [];
  for (const block of json.content ?? []) {
    if (block.type !== "text") continue;
    text += block.text;
    for (const c of block.citations ?? [])
      if (c.url) sources.push({ url: c.url, domain: domainOf(c.url) });
  }
  const searches = json.usage?.server_tool_use?.web_search_requests ?? 0;
  return { text, sources, searches };
}

async function askGemini(prompt: string) {
  const json = await post(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent`,
    { "x-goog-api-key": googleKey()! },
    { contents: [{ role: "user", parts: [{ text: prompt }] }], tools: [{ google_search: {} }] }
  );
  const cand = json.candidates?.[0];
  const text = (cand?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  const meta = cand?.groundingMetadata ?? {};
  const sources: Source[] = (meta.groundingChunks ?? [])
    .filter((c: { web?: { uri: string } }) => c.web?.uri)
    .map((c: { web: { uri: string; title?: string } }) => ({
      url: c.web.uri,
      domain: domainOf(c.web.uri, c.web.title),
    }));
  return { text, sources, searches: (meta.webSearchQueries ?? []).length };
}

const ASK: Record<Engine, (p: string) => Promise<Omit<Answer, "promptId" | "engine" | "model">>> = {
  openai: askOpenAI,
  anthropic: askAnthropic,
  gemini: askGemini,
};

// ─── Jugement : couverture par une page Agoris existante ───────────────

async function loadSitePages(): Promise<string[]> {
  const xml = await (await fetch(`https://www.${SITE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !u.includes("/en/") && !u.endsWith("/en"));
}

async function judgeCoverage(prompt: string, pages: string[]): Promise<Coverage> {
  const json = await post(
    "https://api.anthropic.com/v1/messages",
    { "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    {
      model: MODELS.anthropic,
      max_tokens: 200,
      system: [
        {
          type: "text",
          text:
            "Voici la liste des pages publiées du site agoris.io (annuaire éditorial des salons professionnels français). " +
            "Pour la question posée, désigne LA page dont le sujet répond le plus directement à la question, d'après son URL. " +
            'Si aucune page ne traite ce sujet, réponds null. Réponds uniquement en JSON : {"url": "<url exacte de la liste>" | null, "confidence": "haute" | "moyenne" | "faible"}.\n\n' +
            pages.join("\n"),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: prompt }],
    }
  );
  const raw: string = json.content?.[0]?.text ?? "";
  try {
    const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    // Garde-fou : une URL hors liste est une invention du juge, on la rejette.
    const url = parsed.url && pages.includes(parsed.url) ? parsed.url : null;
    return { url, confidence: String(parsed.confidence ?? "") };
  } catch {
    return { url: null, confidence: "illisible" };
  }
}

// Variante Jev (TypeSafe), utilisée si TYPESAFE_API_KEY est présente. Jev choisit
// parmi des options (255 max) au lieu de générer : le code présélectionne donc
// les candidates. Toutes les pages hors fiches salon, plus les fiches dont le
// slug partage un mot avec la question. Contrat d'API repris de
// ~/MIA-second-brain/tools/veille-ia/judge.py.
const tokens = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4 && !["salon", "salons", "quel", "quels", "quelles", "sont", "2026", "2027"].includes(t));

async function judgeCoverageJev(prompt: string, pages: string[]): Promise<Coverage> {
  const words = new Set(tokens(prompt));
  const candidates = pages
    .filter((u) => !u.includes("/salons/") || tokens(u.split("/salons/")[1]).some((t) => words.has(t)))
    .slice(0, 250);
  const criteria: Record<string, string> = {
    none: "No page in the list is about the subject of the question.",
  };
  for (const u of candidates) {
    const p = new URL(u).pathname || "/";
    criteria[p] = `Page of the French trade show directory agoris.io at path ${p}`;
  }
  const json = await post(
    "https://api.typesafe.ai/v1/systemone",
    { Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`, "User-Agent": "agoris-geo/1.0" },
    {
      model: process.env.JEV_MODEL ?? "jev-latest",
      state: { question: prompt },
      questions: {
        coverage: {
          type: "choice",
          instructions:
            "Which page of the site most directly answers the French-language `question`, judging by the subject its URL path describes?",
          criteria,
        },
      },
    }
  );
  const a = json.answers.coverage;
  const url = a.choice === "none" ? null : candidates.find((u) => (new URL(u).pathname || "/") === a.choice) ?? null;
  return { url, confidence: `jev ${Number(a.confidence).toFixed(2)}` };
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  const date = new Date().toISOString().slice(0, 10);
  mkdirSync("scripts/output", { recursive: true });
  const rawPath = `scripts/output/geo-visibility-${date}.json`;
  const csvPath = `scripts/output/geo-visibility-${date}.csv`;

  let prompts: Prompt[] = JSON.parse(readFileSync("scripts/seeds/geo-prompts.json", "utf-8"));
  if (limit) prompts = prompts.slice(0, limit);

  const store: { answers: Answer[]; coverage: Record<string, Coverage> } = existsSync(rawPath)
    ? JSON.parse(readFileSync(rawPath, "utf-8"))
    : { answers: [], coverage: {} };
  const save = () => writeFileSync(rawPath, JSON.stringify(store, null, 2));

  const pages = noJudge ? [] : await loadSitePages();
  if (!noJudge) console.log(`${pages.length} pages FR dans le sitemap`);

  for (const [i, p] of prompts.entries()) {
    await Promise.all(
      engines.map(async (engine) => {
        const done = store.answers.find((a) => a.promptId === p.id && a.engine === engine);
        if (done && !done.error) return;
        if (done) store.answers.splice(store.answers.indexOf(done), 1);
        const base = { promptId: p.id, engine, model: MODELS[engine] };
        try {
          store.answers.push({ ...base, ...(await ASK[engine](p.prompt)) });
        } catch (e) {
          store.answers.push({ ...base, text: "", sources: [], searches: 0, error: String(e) });
        }
      })
    );
    if (!noJudge && (rejudge || !store.coverage[p.id])) {
      try {
        store.coverage[p.id] = await (process.env.TYPESAFE_API_KEY ? judgeCoverageJev : judgeCoverage)(p.prompt, pages);
      } catch (e) {
        console.error(`juge ${p.id}: ${e}`);
      }
    }
    save();
    console.log(`[${i + 1}/${prompts.length}] ${p.id}`);
  }

  // Gemini masque l'URL citée derrière une redirection : on la résout pour nos
  // propres pages, afin de savoir laquelle est citée et pas seulement le domaine.
  for (const a of store.answers)
    for (const s of a.sources) {
      if (s.domain !== SITE || !s.url.includes("vertexaisearch")) continue;
      try {
        const res = await fetch(s.url, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
        s.url = res.headers.get("location") ?? s.url;
      } catch {
        // URL de redirection conservée telle quelle
      }
    }
  save();

  // CSV : une ligne par (prompt, moteur).
  const esc =(v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const ids = new Set(prompts.map((p) => p.id));
  const rows = store.answers
    .filter((a) => ids.has(a.promptId) && engines.includes(a.engine))
    .map((a) => {
      const p = prompts.find((x) => x.id === a.promptId)!;
      const domains = [...new Set(a.sources.map((s) => s.domain).filter(Boolean))];
      const cov = store.coverage[a.promptId];
      return [
        p.family,
        p.id,
        p.prompt,
        a.engine,
        a.model,
        a.searches,
        domains.includes(SITE) ? "oui" : "non",
        /agoris/i.test(a.text) ? "oui" : "non",
        COMPETITORS.filter((c) => domains.includes(c) || a.text.toLowerCase().includes(c.split(".")[0])).join(" "),
        domains.join(" "),
        [...new Set(a.sources.filter((s) => s.domain === SITE).map((s) => s.url))].join(" "),
        cov?.url ?? (cov ? "aucune" : ""),
        cov?.confidence ?? "",
        a.error ?? "",
      ];
    });
  const header = [
    "famille", "prompt_id", "prompt", "moteur", "modele", "recherches_web",
    "agoris_cite_en_source", "agoris_mentionne_dans_texte", "concurrents_presents",
    "domaines_cites", "pages_agoris_citees", "page_agoris_qui_repond", "confiance_couverture", "erreur",
  ];
  writeFileSync(csvPath, [header, ...rows].map((r) => r.map(esc).join(",")).join("\n"));

  // Synthèse console.
  const ok = rows.filter((r) => !r[r.length - 1]);
  console.log(`\n${ok.length} réponses exploitables, ${rows.length - ok.length} erreurs`);
  for (const engine of engines) {
    const er = ok.filter((r) => r[3] === engine);
    const cited = er.filter((r) => r[6] === "oui").length;
    const searches = er.reduce((n, r) => n + Number(r[5]), 0);
    console.log(`  ${engine.padEnd(10)} agoris cité ${cited}/${er.length}, ${searches} recherches web`);
  }
  const counts = new Map<string, number>();
  for (const r of ok) for (const d of String(r[9]).split(" ").filter(Boolean)) counts.set(d, (counts.get(d) ?? 0) + 1);
  console.log("\nTop 25 domaines cités (nombre de réponses) :");
  for (const [d, n] of [...counts].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  ${String(n).padStart(3)}  ${d}`);
  const gaps = prompts.filter((p) => store.coverage[p.id] && !store.coverage[p.id].url);
  console.log(`\nTrous de couverture (${gaps.length}) :`);
  for (const g of gaps) console.log(`  ${g.id}  ${g.prompt}`);
  console.log(`\n→ ${csvPath}\n→ ${rawPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
