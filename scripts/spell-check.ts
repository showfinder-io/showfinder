// Détection d'erreurs orthographiques sur les contenus français de la base Agoris.
// - Lit les colonnes texte FR de salons, venues, providers
// - Envoie par lots à Claude pour détecter typos / accents / ponctuation
// - Dump un CSV trié par confiance pour review humaine
// - JAMAIS d'UPDATE auto : la review humaine est obligatoire avant écriture en base
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/spell-check.ts
// Env requis : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!supabaseUrl || !supabaseKey || !anthropicKey) {
  console.error(
    "Variables requises dans .env.local : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const OUTPUT_DIR = path.join(__dirname, "output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const today = new Date().toISOString().split("T")[0];
const OUTPUT_FILE = path.join(OUTPUT_DIR, `spell-check-${today}.csv`);

// Configuration : quelles colonnes texte analyser par table
type TableConfig = {
  table: string;
  idField: string;
  fields: string[];
};

const TABLES: TableConfig[] = [
  {
    table: "salons",
    idField: "slug",
    fields: ["name", "description", "organizer_name", "venue", "seo_title", "seo_description"],
  },
  {
    table: "venues",
    idField: "slug",
    fields: ["name", "city", "address", "description"],
  },
  {
    table: "providers",
    idField: "slug",
    fields: ["company_name", "description", "zone_intervention", "city"],
  },
];

type Confidence = "high" | "medium" | "low";

type LLMResult = {
  id: string;
  field: string;
  original: string;
  suggestion: string;
  confidence: Confidence;
  reason: string;
};

type Correction = LLMResult & { table: string };

const SYSTEM_PROMPT = `Tu es un correcteur orthographique et grammatical français spécialisé en contenu B2B (salons professionnels, lieux d'exposition, prestataires événementiels).

Mission : détecter les erreurs dans le texte fourni. Tu reçois plusieurs entrées en lot. Renvoie UNIQUEMENT les entrées qui contiennent une erreur réelle.

À détecter :
- Accents manquants ou incorrects (ex: "evenement" → "événement", "deja" → "déjà", "a Paris" → "à Paris")
- Typos évidentes (lettres inversées, lettres en trop ou manquantes)
- Erreurs grammaticales claires (accord, conjugaison)
- Ponctuation française incorrecte (espace insécable manquante avant : ; ! ? %, double espaces)

À NE PAS toucher :
- Noms propres, marques, noms de salons (ex: Comexposium, Eurexpo, Tech-Ovin, Agrimax, Viparis)
- Sigles, acronymes, codes (UNIMEV, B2B, IDF, CES)
- Anglicismes acceptés en français pro (e-commerce, marketing, networking, etc.)
- URLs, emails, numéros, codes postaux
- Choix stylistiques valides (formules consacrées, abréviations marketing)

Format de réponse : un tableau JSON UNIQUEMENT (pas de markdown, pas d'explication hors JSON), où chaque objet a :
- "id": l'identifiant fourni dans l'entrée
- "field": le champ analysé
- "original": le texte d'origine COMPLET (pas juste le mot fautif)
- "suggestion": le texte corrigé COMPLET
- "confidence": "high" (typo claire et indubitable), "medium" (correction probable), "low" (doute, à valider humainement)
- "reason": phrase courte (max 12 mots) expliquant l'erreur

Tableau vide [] si aucune erreur. Pas de texte hors du JSON.`;

async function detectErrors(
  batch: Array<{ id: string; field: string; text: string }>
): Promise<LLMResult[]> {
  const userMsg =
    "Entrées à analyser (une par ligne, format JSON):\n\n" +
    batch.map((e) => JSON.stringify(e)).join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API Anthropic ${response.status}: ${body}`);
  }

  const json = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text =
    json.content?.find((c) => c.type === "text")?.text?.trim() ?? "[]";

  // Extraire le tableau JSON même si le modèle renvoie du texte autour
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    const parsed = JSON.parse(match[0]) as LLMResult[];
    return parsed.filter(
      (r) => r && r.id && r.field && r.original && r.suggestion
    );
  } catch {
    console.warn(`  ⚠️  Parse JSON échoué, batch ignoré`);
    return [];
  }
}

async function processTable(config: TableConfig): Promise<Correction[]> {
  console.log(`\n=== ${config.table} ===`);

  const columns = [config.idField, ...config.fields].join(",");
  const { data, error } = await supabase
    .from(config.table)
    .select(columns);

  if (error || !data) {
    console.error(`  Erreur lecture: ${error?.message ?? "data null"}`);
    return [];
  }

  // Aplatir : une entrée par cellule non vide
  const entries: Array<{ id: string; field: string; text: string }> = [];
  for (const row of data as unknown as Array<Record<string, unknown>>) {
    const id = row[config.idField] as string;
    for (const field of config.fields) {
      const value = row[field];
      if (typeof value === "string" && value.trim().length > 0) {
        entries.push({ id, field, text: value });
      }
    }
  }

  console.log(`  ${data.length} rows, ${entries.length} cellules non vides`);

  // Batching pour limiter taille des prompts (5 cellules par appel)
  const BATCH_SIZE = 5;
  const corrections: Correction[] = [];
  const totalBatches = Math.ceil(entries.length / BATCH_SIZE);

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(
      `  Batch ${batchNum}/${totalBatches} (${batch.length} cellules)... `
    );
    try {
      const results = await detectErrors(batch);
      for (const r of results) {
        corrections.push({ ...r, table: config.table });
      }
      console.log(`${results.length} correction(s)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`erreur: ${msg}`);
    }
  }

  return corrections;
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function writeCSV(corrections: Correction[]): void {
  const header = [
    "table",
    "slug",
    "field",
    "confidence",
    "original",
    "suggestion",
    "reason",
  ];

  // Tri : high d'abord, puis medium, puis low. À facilite la review.
  const order: Record<Confidence, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...corrections].sort((a, b) => {
    const byConf = order[a.confidence] - order[b.confidence];
    if (byConf !== 0) return byConf;
    return a.table.localeCompare(b.table);
  });

  const lines = [header.join(",")];
  for (const c of sorted) {
    lines.push(
      [
        c.table,
        c.id,
        c.field,
        c.confidence,
        csvEscape(c.original),
        csvEscape(c.suggestion),
        csvEscape(c.reason),
      ].join(",")
    );
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n") + "\n", "utf-8");
}

async function main() {
  const start = Date.now();
  const all: Correction[] = [];

  for (const config of TABLES) {
    const corrections = await processTable(config);
    all.push(...corrections);
  }

  writeCSV(all);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ ${all.length} corrections proposées en ${elapsed}s`);
  console.log(`📄 CSV : ${OUTPUT_FILE}`);

  const byConf = all.reduce<Record<Confidence, number>>(
    (acc, c) => {
      acc[c.confidence] = (acc[c.confidence] ?? 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );
  console.log(
    `   high: ${byConf.high}, medium: ${byConf.medium}, low: ${byConf.low}`
  );
  console.log(
    `\nProchaine étape : review humaine du CSV, puis UPDATE SQL pour les corrections validées.`
  );
}

main().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
