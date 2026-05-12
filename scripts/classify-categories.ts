// Classification LLM des catégories de salons (P1 — brief Agoris).
// - Lit les salons sans catégorie
// - Demande à Claude de classifier : salon_professionnel / salon_grand_public / congres / autres
// - Génère un fichier SQL d'UPDATE prêt à appliquer
//   - high confidence → category set, category_to_confirm = false
//   - medium/low      → category set, category_to_confirm = true (review admin)
// - JAMAIS d'UPDATE direct depuis le script ; on produit du SQL relu côté Julien.
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/classify-categories.ts
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
const OUTPUT_SQL = path.join(OUTPUT_DIR, `classify-categories-${today}.sql`);
const OUTPUT_CSV = path.join(OUTPUT_DIR, `classify-categories-${today}.csv`);

type Category = "salon_professionnel" | "salon_grand_public" | "congres" | "autres";
type Confidence = "high" | "medium" | "low";

type Salon = {
  slug: string;
  name: string;
  description: string | null;
  organizer_name: string | null;
};

type Classification = {
  slug: string;
  category: Category;
  confidence: Confidence;
  reason: string;
};

const VALID_CATEGORIES: Category[] = [
  "salon_professionnel",
  "salon_grand_public",
  "congres",
  "autres",
];

const SYSTEM_PROMPT = `Tu es un expert des événements professionnels français. Tu classifies des fiches de salons dans 4 catégories exactes :

1. **salon_professionnel** : événement B2B / professionnel, accès réservé ou prioritaire aux pros (exemples : SIRHA, Pollutec, CFIA, Maison & Objet, JEC Composites). C'est de loin la catégorie la plus fréquente sur Agoris.

2. **salon_grand_public** : salon ouvert au grand public, billetterie particuliers (exemples : Salon de l'Agriculture, Foire de Paris, Salon du Mariage, Salon du Cheval). Souvent "Foire" ou "Salon de…" généraliste.

3. **congres** : événement scientifique / sectoriel structuré autour de conférences et communications, plus que d'exposition. Souvent "Congrès…", "Assises…", "Sommet…", "Rencontres…" suivi d'un thème métier. Les RSSI, médecins, économistes, etc. s'y retrouvent.

4. **autres** : tout ce qui ne rentre clairement dans aucune des 3 catégories ci-dessus.

Tu reçois un lot de salons en JSON. Pour chaque salon, renvoie un objet JSON avec :
- "slug" : tel que fourni
- "category" : une des 4 valeurs exactes ci-dessus (en snake_case)
- "confidence" : "high" (très sûr), "medium" (probable), "low" (doute réel)
- "reason" : phrase courte (max 15 mots) justifiant

Renvoie un tableau JSON UNIQUEMENT, pas de markdown, pas d'explication hors JSON.`;

async function classifyBatch(salons: Salon[]): Promise<Classification[]> {
  const userMsg =
    "Salons à classifier :\n\n" +
    salons
      .map((s) =>
        JSON.stringify({
          slug: s.slug,
          name: s.name,
          description: s.description?.slice(0, 400) ?? "",
          organizer: s.organizer_name ?? "",
        })
      )
      .join("\n");

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
  const text = json.content?.find((c) => c.type === "text")?.text?.trim() ?? "[]";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    const parsed = JSON.parse(match[0]) as Classification[];
    return parsed.filter(
      (c) =>
        c &&
        c.slug &&
        VALID_CATEGORIES.includes(c.category) &&
        ["high", "medium", "low"].includes(c.confidence)
    );
  } catch {
    console.warn("  ⚠️  Parse JSON échoué, batch ignoré");
    return [];
  }
}

function sqlEscape(s: string): string {
  return s.replace(/'/g, "''");
}

function writeSQL(classifications: Classification[]): void {
  const lines: string[] = [];
  lines.push("-- Backfill catégories salons (Agoris P1)");
  lines.push(`-- Date : ${today}`);
  lines.push(`-- Source : scripts/classify-categories.ts (Claude Haiku 4.5)`);
  lines.push("-- Règle : high → applique, category_to_confirm = false");
  lines.push("--         medium / low → applique aussi, mais flag à reviewer dans l'admin");
  lines.push("--");
  lines.push("-- Exécution : SQL Editor Supabase, en une transaction.");
  lines.push("");
  lines.push("BEGIN;");
  lines.push("");

  for (const c of classifications) {
    const flagConfirm = c.confidence === "high" ? "false" : "true";
    lines.push(
      `UPDATE public.salons SET category = '${c.category}', category_to_confirm = ${flagConfirm} ` +
        `WHERE slug = '${sqlEscape(c.slug)}';`
    );
  }

  lines.push("");
  lines.push("COMMIT;");
  fs.writeFileSync(OUTPUT_SQL, lines.join("\n") + "\n", "utf-8");
}

function writeCSV(classifications: Classification[]): void {
  const lines = ["slug,category,confidence,reason"];
  for (const c of classifications) {
    const reason = c.reason.includes(",") || c.reason.includes('"')
      ? `"${c.reason.replace(/"/g, '""')}"`
      : c.reason;
    lines.push(`${c.slug},${c.category},${c.confidence},${reason}`);
  }
  fs.writeFileSync(OUTPUT_CSV, lines.join("\n") + "\n", "utf-8");
}

async function main() {
  const start = Date.now();
  console.log("=== Classification catégories salon ===\n");

  const { data, error } = await supabase
    .from("salons")
    .select("slug, name, description, organizer_name")
    .order("slug");

  if (error || !data) {
    console.error("Erreur lecture salons:", error?.message);
    process.exit(1);
  }

  const salons = data as Salon[];
  console.log(`  ${salons.length} salons à classifier`);

  const BATCH_SIZE = 10;
  const all: Classification[] = [];
  const totalBatches = Math.ceil(salons.length / BATCH_SIZE);

  for (let i = 0; i < salons.length; i += BATCH_SIZE) {
    const batch = salons.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(
      `  Batch ${batchNum}/${totalBatches} (${batch.length} salons)... `
    );
    try {
      const results = await classifyBatch(batch);
      all.push(...results);
      console.log(`${results.length} classifié(s)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`erreur: ${msg}`);
    }
  }

  writeSQL(all);
  writeCSV(all);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ ${all.length} classifications en ${elapsed}s`);

  const distrib = all.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});
  const conf = all.reduce<Record<Confidence, number>>(
    (acc, c) => {
      acc[c.confidence] = (acc[c.confidence] ?? 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );
  console.log(`   Distribution : ${JSON.stringify(distrib)}`);
  console.log(`   Confiance    : ${JSON.stringify(conf)}`);
  console.log(`\n📄 SQL : ${OUTPUT_SQL}`);
  console.log(`📄 CSV : ${OUTPUT_CSV}`);
}

main().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
