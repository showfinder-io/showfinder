// Pour chaque salon dont la date est passée, chercher la prochaine édition
// en scrapant la page officielle + analyse Claude.
//
// - Lit les salons avec start_date < CURRENT_DATE et website_url non vide
// - Fetch la page d'accueil officielle (User-Agent Agoris)
// - Extrait titre / meta / og / texte tronqué via cheerio
// - Envoie à Claude qui cherche la date de prochaine édition
// - Dump CSV pour review humaine (jamais d'UPDATE auto)
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/find-next-edition.ts
// Env requis : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY

import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
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
const OUTPUT_CSV = path.join(OUTPUT_DIR, `next-edition-${today}.csv`);

const USER_AGENT =
  "Mozilla/5.0 (compatible; Agoris/1.0; +https://agoris.io)";
const FETCH_TIMEOUT_MS = 12000;

type Salon = {
  slug: string;
  name: string;
  start_date: string;
  end_date: string | null;
  website_url: string;
  edition_year: number | null;
};

type Confidence = "high" | "medium" | "low" | "not_found";

type Guess = {
  slug: string;
  name: string;
  old_start_date: string;
  next_start_date: string | null;
  next_end_date: string | null;
  next_year: number | null;
  confidence: Confidence;
  reason: string;
  source_url: string;
};

async function fetchPageText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").text().trim();
    const metaDesc = $('meta[name="description"]').attr("content") ?? "";
    const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
    const ogDesc = $('meta[property="og:description"]').attr("content") ?? "";

    // Texte des balises probables pour une date (hero / header / footer)
    const focusedText = [
      $("h1").text(),
      $("h2").text(),
      $("header").text(),
      $(".hero, .banner, .dates, .next-edition").text(),
      $("footer").text(),
    ]
      .join("\n")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2500);

    // Texte brut tronqué
    $("script, style, noscript").remove();
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000);

    return [
      `URL: ${url}`,
      `TITLE: ${title}`,
      `OG_TITLE: ${ogTitle}`,
      `META_DESC: ${metaDesc}`,
      `OG_DESC: ${ogDesc}`,
      `FOCUSED:\n${focusedText}`,
      `BODY:\n${bodyText}`,
    ].join("\n\n");
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `Tu analyses le contenu d'une page d'accueil officielle d'un salon professionnel français. Ta mission : identifier la **prochaine** édition à venir.

Recherche dans le contenu fourni :
- Mention explicite d'une date future, ex : "du 12 au 14 octobre 2027", "20-22 mai 2026"
- Formules type "édition 2027", "prochaine édition", "rendez-vous en 2026"
- Bandeau hero, footer, méta description, og:description
- Tout pattern : DD/MM/YYYY, "du X au Y mois année", "month YYYY"

À retourner : UN SEUL objet JSON, sans markdown :
{
  "next_start_date": "YYYY-MM-DD" | null,
  "next_end_date": "YYYY-MM-DD" | null,
  "next_year": <int> | null,
  "confidence": "high" | "medium" | "low" | "not_found",
  "reason": "<phrase courte expliquant la source dans le contenu, max 20 mots>"
}

Règles :
- "high" : date complète DD/MM/YYYY visible textuellement
- "medium" : année + mois trouvés ; jours déduits
- "low" : juste une année future mentionnée
- "not_found" : aucune mention de date future plausible

Si seule l'année est connue, mets next_start_date à null mais next_year renseigné.
Pas de markdown, pas d'explication hors JSON.`;

async function askLLM(salon: Salon, pageContent: string): Promise<Guess> {
  const base: Guess = {
    slug: salon.slug,
    name: salon.name,
    old_start_date: salon.start_date,
    next_start_date: null,
    next_end_date: null,
    next_year: null,
    confidence: "not_found",
    reason: "",
    source_url: salon.website_url,
  };

  const userMsg = `Salon : ${salon.name}
Dernière édition connue : ${salon.start_date}${salon.end_date ? ` → ${salon.end_date}` : ""}
URL officielle : ${salon.website_url}

CONTENU DE LA PAGE :
${pageContent}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    }),
  });

  if (!response.ok) {
    base.confidence = "not_found";
    base.reason = `API error ${response.status}`;
    return base;
  }

  const json = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text = json.content?.find((c) => c.type === "text")?.text?.trim() ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    base.reason = "Parse JSON échoué";
    return base;
  }
  try {
    const parsed = JSON.parse(match[0]) as {
      next_start_date?: string | null;
      next_end_date?: string | null;
      next_year?: number | null;
      confidence?: Confidence;
      reason?: string;
    };
    return {
      ...base,
      next_start_date: parsed.next_start_date ?? null,
      next_end_date: parsed.next_end_date ?? null,
      next_year: parsed.next_year ?? null,
      confidence: parsed.confidence ?? "not_found",
      reason: parsed.reason ?? "",
    };
  } catch {
    base.reason = "Parse JSON échoué (catch)";
    return base;
  }
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function writeCSV(guesses: Guess[]): void {
  const header = [
    "slug",
    "name",
    "old_start_date",
    "next_start_date",
    "next_end_date",
    "next_year",
    "confidence",
    "reason",
    "source_url",
  ];

  // Tri : high d'abord pour faciliter la review, puis medium, low, not_found
  const order: Record<Confidence, number> = {
    high: 0,
    medium: 1,
    low: 2,
    not_found: 3,
  };
  const sorted = [...guesses].sort(
    (a, b) => order[a.confidence] - order[b.confidence]
  );

  const lines = [header.join(",")];
  for (const g of sorted) {
    lines.push(
      [
        g.slug,
        csvEscape(g.name),
        g.old_start_date,
        g.next_start_date ?? "",
        g.next_end_date ?? "",
        g.next_year != null ? String(g.next_year) : "",
        g.confidence,
        csvEscape(g.reason),
        csvEscape(g.source_url),
      ].join(",")
    );
  }
  fs.writeFileSync(OUTPUT_CSV, lines.join("\n") + "\n", "utf-8");
}

async function main() {
  const start = Date.now();
  console.log("=== Recherche prochaine édition (salons passés) ===\n");

  const todayDate = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("salons")
    .select("slug, name, start_date, end_date, website_url, edition_year")
    .lt("start_date", todayDate)
    .not("website_url", "is", null)
    .order("start_date", { ascending: false });

  if (error || !data) {
    console.error("Erreur lecture salons:", error?.message);
    process.exit(1);
  }

  const salons = (data as Salon[]).filter(
    (s) => s.website_url && s.website_url.trim().length > 0
  );
  console.log(`  ${salons.length} salons à analyser\n`);

  const guesses: Guess[] = [];
  let idx = 0;
  for (const salon of salons) {
    idx++;
    process.stdout.write(`  [${idx}/${salons.length}] ${salon.slug.padEnd(45)} `);

    const pageContent = await fetchPageText(salon.website_url);
    if (!pageContent) {
      guesses.push({
        slug: salon.slug,
        name: salon.name,
        old_start_date: salon.start_date,
        next_start_date: null,
        next_end_date: null,
        next_year: null,
        confidence: "not_found",
        reason: "fetch failed (timeout, 404, ou bloqué)",
        source_url: salon.website_url,
      });
      console.log("✗ fetch");
      continue;
    }

    try {
      const guess = await askLLM(salon, pageContent);
      guesses.push(guess);
      console.log(
        `${guess.confidence}${
          guess.next_start_date ? ` → ${guess.next_start_date}` : ""
        }`
      );
    } catch (err) {
      guesses.push({
        slug: salon.slug,
        name: salon.name,
        old_start_date: salon.start_date,
        next_start_date: null,
        next_end_date: null,
        next_year: null,
        confidence: "not_found",
        reason: err instanceof Error ? err.message : String(err),
        source_url: salon.website_url,
      });
      console.log("✗ LLM");
    }
  }

  writeCSV(guesses);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ ${guesses.length} salons traités en ${elapsed}s`);
  const dist = guesses.reduce<Record<Confidence, number>>(
    (acc, g) => {
      acc[g.confidence] = (acc[g.confidence] ?? 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0, not_found: 0 }
  );
  console.log(`   Confiance : ${JSON.stringify(dist)}`);
  console.log(`\n📄 CSV : ${OUTPUT_CSV}`);
}

main().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
