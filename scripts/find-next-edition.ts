// Pour chaque salon dont la date est passée, chercher la prochaine édition
// en scrapant la page officielle + analyse Claude, avec garde-fous.
//
// - Lit les salons avec start_date < CURRENT_DATE et website_url non vide
// - Fetch la page d'accueil officielle (User-Agent Agoris)
// - Extrait titre / meta / og / texte tronqué via cheerio
// - Envoie à Claude qui cherche date, ville et lieu de la prochaine édition
// - Garde-fous (audit cohérence slugs du 2026-06-11, PR #25) :
//   * verdict "ok" uniquement si date complète sur le site officiel
//     (confiance high), périodicité (frequency) cohérente avec l'année
//     proposée, même ville et même lieu, aucun champ date verrouillé
//   * verdict "verifier" : proposition plausible mais non confirmée
//     (jours déduits, changement de ville/lieu, périodicité inconnue...).
//     Le SQL généré pose alert_flag + notes_internes, ne touche PAS aux dates.
//   * verdict "ne_pas_rouler" : source insuffisante, salon ponctuel ou
//     année incompatible avec la périodicité (cas solscope-lyon-2026 :
//     biennal années impaires roulé vers une édition 2026 inexistante)
// - Les changements de ville/lieu sont signalés (cas in-cosmetics-global :
//   édition 2027 à Barcelone, le roll avait fabriqué un "Paris 2027")
// - Les slugs ne sont JAMAIS renommés par ce script (le renommage relève de
//   la migration "slugs sans année", décision du 2026-06-12) : rapport des
//   slugs dont l'année diverge de l'edition_year proposé
// - Dump CSV pour review humaine + SQL d'application à relire avant
//   exécution manuelle. Le script lui-même ne fait JAMAIS d'UPDATE.
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/find-next-edition.ts [--limit N] [--slug s1,s2]
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
const OUTPUT_SQL = path.join(OUTPUT_DIR, `next-edition-${today}.sql`);

const USER_AGENT =
  "Mozilla/5.0 (compatible; Agoris/1.0; +https://agoris.io)";
const FETCH_TIMEOUT_MS = 12000;

// Écart d'années attendu entre deux éditions selon la périodicité.
// 'ponctuel' est absent volontairement : pas d'édition suivante garantie.
const FREQUENCY_GAP: Record<string, number> = {
  annuel: 1,
  bisannuel: 2,
  triennal: 3,
};

type Salon = {
  slug: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  website_url: string;
  edition_year: number | null;
  city: string | null;
  venue: string | null;
  frequency: string | null;
  locked_fields: string[] | null;
};

type Confidence = "high" | "medium" | "low" | "not_found";

type Verdict = "ok" | "verifier" | "ne_pas_rouler";

type Guess = {
  slug: string;
  name: string;
  status: string;
  old_start_date: string;
  next_start_date: string | null;
  next_end_date: string | null;
  next_year: number | null;
  next_city: string | null;
  next_venue: string | null;
  confidence: Confidence;
  reason: string;
  source_url: string;
  verdict: Verdict;
  alerts: string[];
};

function parseArgs(): { limit: number | null; slugs: Set<string> | null } {
  const args = process.argv.slice(2);
  let limit: number | null = null;
  let slugs: Set<string> | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit") limit = Number(args[++i]);
    else if (args[i] === "--slug")
      slugs = new Set((args[++i] ?? "").split(",").filter(Boolean));
  }
  return { limit, slugs };
}

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

const SYSTEM_PROMPT = `Tu analyses le contenu d'une page d'accueil officielle d'un salon professionnel français. Ta mission : identifier la **prochaine** édition à venir, avec sa date ET son lieu.

Recherche dans le contenu fourni :
- Mention explicite d'une date future, ex : "du 12 au 14 octobre 2027", "20-22 mai 2026"
- Formules type "édition 2027", "prochaine édition", "rendez-vous en 2026"
- Ville et lieu de la prochaine édition, ex : "Paris Expo Porte de Versailles", "Eurexpo Lyon", "Fira de Barcelona"
- Bandeau hero, footer, méta description, og:description
- Tout pattern : DD/MM/YYYY, "du X au Y mois année", "month YYYY"

À retourner : UN SEUL objet JSON, sans markdown :
{
  "next_start_date": "YYYY-MM-DD" | null,
  "next_end_date": "YYYY-MM-DD" | null,
  "next_year": <int> | null,
  "next_city": "<ville>" | null,
  "next_venue": "<lieu / parc des expositions>" | null,
  "confidence": "high" | "medium" | "low" | "not_found",
  "reason": "<phrase courte expliquant la source dans le contenu, max 20 mots>"
}

Règles :
- "high" : date complète DD/MM/YYYY visible textuellement
- "medium" : année + mois trouvés ; jours déduits
- "low" : juste une année future mentionnée
- "not_found" : aucune mention de date future plausible
- next_city / next_venue : UNIQUEMENT si la page mentionne explicitement la ville ou le lieu de la prochaine édition. Ne jamais recopier la ville connue en base si la page ne la mentionne pas. Si la prochaine édition a lieu dans une autre ville (ex : édition itinérante), c'est une information capitale : remplis next_city avec la ville indiquée par la page.

Si seule l'année est connue, mets next_start_date à null mais next_year renseigné.
Pas de markdown, pas d'explication hors JSON.`;

async function askLLM(salon: Salon, pageContent: string): Promise<Guess> {
  const base = emptyGuess(salon);

  const userMsg = `Salon : ${salon.name}
Dernière édition connue : ${salon.start_date}${salon.end_date ? ` → ${salon.end_date}` : ""}
Ville en base (peut être obsolète, ne pas recopier) : ${salon.city ?? "inconnue"}
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
      next_city?: string | null;
      next_venue?: string | null;
      confidence?: Confidence;
      reason?: string;
    };
    return {
      ...base,
      next_start_date: parsed.next_start_date ?? null,
      next_end_date: parsed.next_end_date ?? null,
      next_year: parsed.next_year ?? null,
      next_city: parsed.next_city ?? null,
      next_venue: parsed.next_venue ?? null,
      confidence: parsed.confidence ?? "not_found",
      reason: parsed.reason ?? "",
    };
  } catch {
    base.reason = "Parse JSON échoué (catch)";
    return base;
  }
}

function emptyGuess(salon: Salon): Guess {
  return {
    slug: salon.slug,
    name: salon.name,
    status: salon.status,
    old_start_date: salon.start_date,
    next_start_date: null,
    next_end_date: null,
    next_year: null,
    next_city: null,
    next_venue: null,
    confidence: "not_found",
    reason: "",
    source_url: salon.website_url,
    verdict: "ne_pas_rouler",
    alerts: [],
  };
}

// Normalisation pour comparer villes/lieux : minuscules, sans accents.
function normalizePlace(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Même endroit si égalité ou inclusion après normalisation :
// "Eurexpo" et "Eurexpo Lyon" désignent le même parc.
function samePlace(a: string, b: string): boolean {
  const na = normalizePlace(a);
  const nb = normalizePlace(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

function slugYear(slug: string): number | null {
  const m = slug.match(/(20\d{2})$/);
  return m ? Number(m[1]) : null;
}

const VERDICT_RANK: Record<Verdict, number> = {
  ok: 0,
  verifier: 1,
  ne_pas_rouler: 2,
};

// Moteur de garde-fous : croise la proposition LLM avec la périodicité,
// la ville/le lieu en base et les verrous éditoriaux.
function applyGuardrails(salon: Salon, guess: Guess): void {
  let verdict: Verdict = "ok";
  const alerts: string[] = [];
  const demote = (v: Verdict) => {
    if (VERDICT_RANK[v] > VERDICT_RANK[verdict]) verdict = v;
  };

  // 1. Qualité de la source
  if (guess.confidence === "not_found" || (!guess.next_start_date && guess.next_year == null)) {
    alerts.push("AUCUNE_EDITION_DETECTEE");
    demote("ne_pas_rouler");
  } else if (guess.confidence === "low") {
    alerts.push("SOURCE_FAIBLE: seule une année est mentionnée");
    demote("ne_pas_rouler");
  } else if (guess.confidence === "medium") {
    alerts.push("JOURS_NON_CONFIRMES: jours déduits, pas de date complète sur le site");
    demote("verifier");
  }
  if (!guess.next_start_date && guess.next_year != null) {
    alerts.push("DATE_INCOMPLETE: année sans date de début");
    demote("ne_pas_rouler");
  }

  // 2. Périodicité (cas solscope : biennal roulé vers une année sans édition)
  if (salon.frequency === "ponctuel") {
    alerts.push("FREQ_PONCTUELLE: pas d'édition suivante garantie");
    demote("ne_pas_rouler");
  } else if (!salon.frequency) {
    alerts.push("FREQ_INCONNUE: périodicité non renseignée en base");
    demote("verifier");
  } else if (salon.edition_year == null) {
    alerts.push("EDITION_YEAR_MANQUANT: impossible de valider la périodicité");
    demote("verifier");
  } else if (guess.next_year != null) {
    const expectedGap = FREQUENCY_GAP[salon.frequency];
    const actualGap = guess.next_year - salon.edition_year;
    if (expectedGap != null && actualGap !== expectedGap) {
      alerts.push(
        `FREQ_INCOHERENTE: ${salon.frequency} attend +${expectedGap} an(s), proposition +${actualGap} (${salon.edition_year} -> ${guess.next_year})`
      );
      // Une date complète sur le site officiel peut signifier que la
      // frequency en base est fausse : à vérifier, pas à jeter.
      demote(guess.confidence === "high" ? "verifier" : "ne_pas_rouler");
    }
  }

  // 3. Cohérence des dates
  if (guess.next_start_date && guess.next_start_date <= salon.start_date) {
    alerts.push("DATE_INCOHERENTE: date proposée antérieure ou égale à l'édition en base");
    demote("ne_pas_rouler");
  }

  // 4. Changement de ville / lieu (cas in-cosmetics : 2027 à Barcelone)
  if (guess.next_city && salon.city && !samePlace(guess.next_city, salon.city)) {
    alerts.push(`CHANGEMENT_VILLE: ${salon.city} -> ${guess.next_city}`);
    demote("verifier");
  }
  if (guess.next_venue && salon.venue && !samePlace(guess.next_venue, salon.venue)) {
    alerts.push(`CHANGEMENT_LIEU: ${salon.venue} -> ${guess.next_venue}`);
    demote("verifier");
  }

  // 5. Verrous éditoriaux (workflow v5 : le scraper respecte locked_fields)
  const lockedDates = (salon.locked_fields ?? []).filter((f) =>
    ["start_date", "end_date", "edition_year"].includes(f)
  );
  if (lockedDates.length > 0) {
    alerts.push(`CHAMPS_VERROUILLES: ${lockedDates.join(", ")}`);
    demote("verifier");
  }

  // 6. Slug désynchronisé : informatif, ne change pas le verdict
  //    (pas de renommage auto : migration "slugs sans année" du 2026-06-12)
  const sYear = slugYear(salon.slug);
  if (guess.next_year != null && sYear != null && sYear !== guess.next_year) {
    alerts.push(`SLUG_DESYNC: slug en ${sYear}, edition_year proposé ${guess.next_year}`);
  }

  guess.verdict = verdict;
  guess.alerts = alerts;
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
    "status",
    "old_start_date",
    "next_start_date",
    "next_end_date",
    "next_year",
    "next_city",
    "next_venue",
    "confidence",
    "verdict",
    "alertes",
    "reason",
    "source_url",
  ];

  // Tri : ok d'abord (prêts à appliquer), puis verifier, puis ne_pas_rouler
  const confOrder: Record<Confidence, number> = {
    high: 0,
    medium: 1,
    low: 2,
    not_found: 3,
  };
  const sorted = [...guesses].sort(
    (a, b) =>
      VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
      confOrder[a.confidence] - confOrder[b.confidence]
  );

  const lines = [header.join(",")];
  for (const g of sorted) {
    lines.push(
      [
        g.slug,
        csvEscape(g.name),
        g.status,
        g.old_start_date,
        g.next_start_date ?? "",
        g.next_end_date ?? "",
        g.next_year != null ? String(g.next_year) : "",
        csvEscape(g.next_city ?? ""),
        csvEscape(g.next_venue ?? ""),
        g.confidence,
        g.verdict,
        csvEscape(g.alerts.join(" | ")),
        csvEscape(g.reason),
        csvEscape(g.source_url),
      ].join(",")
    );
  }
  fs.writeFileSync(OUTPUT_CSV, lines.join("\n") + "\n", "utf-8");
}

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

// SQL d'application à relire avant exécution manuelle (psql / éditeur SQL
// Supabase). Le script ne l'exécute jamais.
function writeSQL(guesses: Guess[]): { rolls: number; flags: number } {
  const ok = guesses.filter((g) => g.verdict === "ok");
  const verify = guesses.filter((g) => g.verdict === "verifier");

  const lines: string[] = [
    `-- next-edition ${today} : SQL généré par scripts/find-next-edition.ts`,
    `-- À RELIRE LIGNE À LIGNE avant exécution. Aucun slug n'est renommé :`,
    `-- penser au rapport SLUG_DESYNC du CSV (renommage : migration slugs sans année).`,
    ``,
    `-- ============================================================`,
    `-- 1. Rolls confirmés (verdict ok : date complète sur site officiel,`,
    `--    périodicité cohérente, même ville/lieu, pas de verrou)`,
    `-- ============================================================`,
    ``,
  ];

  for (const g of ok) {
    if (g.alerts.length > 0) lines.push(`-- alertes : ${g.alerts.join(" | ")}`);
    lines.push(
      `-- ${g.slug} : ${g.old_start_date} -> ${g.next_start_date} (${g.reason})`,
      `UPDATE public.salons SET`,
      `  start_date = '${g.next_start_date}',`,
      `  end_date = ${g.next_end_date ? `'${g.next_end_date}'` : "NULL"},`,
      `  edition_year = ${g.next_year},`,
      `  dates_confirmed = true,`,
      `  last_ia_update_at = now()`,
      `WHERE slug = '${sqlEscape(g.slug)}';`,
      ``
    );
  }
  if (ok.length === 0) lines.push(`-- aucun`, ``);

  lines.push(
    `-- ============================================================`,
    `-- 2. À vérifier (verdict verifier) : alert_flag + notes_internes,`,
    `--    les dates ne sont PAS modifiées`,
    `-- ============================================================`,
    ``
  );

  for (const g of verify) {
    const detected = g.next_start_date ?? (g.next_year != null ? `année ${g.next_year}` : "?");
    const note = `[find-next-edition ${today}] Édition suivante détectée : ${detected} (confiance ${g.confidence}). À vérifier : ${g.alerts.join(" | ")}. Source : ${g.source_url}. Dates non modifiées.`;
    lines.push(
      `-- ${g.slug} : ${g.alerts.join(" | ")}`,
      `UPDATE public.salons SET`,
      `  alert_flag = true,`,
      `  notes_internes = COALESCE(notes_internes || E'\\n\\n', '') || '${sqlEscape(note)}'`,
      `WHERE slug = '${sqlEscape(g.slug)}'`,
      `  AND COALESCE(notes_internes, '') NOT LIKE '%[find-next-edition ${today}]%';`,
      ``
    );
  }
  if (verify.length === 0) lines.push(`-- aucun`, ``);

  fs.writeFileSync(OUTPUT_SQL, lines.join("\n") + "\n", "utf-8");
  return { rolls: ok.length, flags: verify.length };
}

function printReport(guesses: Guess[]): void {
  const cityChanges = guesses.filter((g) =>
    g.alerts.some((a) => a.startsWith("CHANGEMENT_VILLE") || a.startsWith("CHANGEMENT_LIEU"))
  );
  console.log("\n== Rolls avec changement de ville ou de lieu ==");
  if (cityChanges.length === 0) console.log("  aucun");
  for (const g of cityChanges) {
    const changes = g.alerts.filter((a) => a.startsWith("CHANGEMENT_"));
    console.log(`  ${g.slug} [${g.verdict}] : ${changes.join(" | ")}`);
  }

  const slugDesync = guesses.filter((g) =>
    g.alerts.some((a) => a.startsWith("SLUG_DESYNC"))
  );
  console.log("\n== Slugs désynchronisés (année du slug != edition_year proposé) ==");
  console.log("   (aucun renommage automatique : voir migration slugs sans année)");
  if (slugDesync.length === 0) console.log("  aucun");
  for (const g of slugDesync) {
    console.log(
      `  ${g.slug} [${g.verdict}] : edition_year proposé ${g.next_year}`
    );
  }

  const dist = guesses.reduce<Record<Verdict, number>>(
    (acc, g) => {
      acc[g.verdict] = (acc[g.verdict] ?? 0) + 1;
      return acc;
    },
    { ok: 0, verifier: 0, ne_pas_rouler: 0 }
  );
  console.log(`\n   Verdicts : ${JSON.stringify(dist)}`);
}

async function main() {
  const start = Date.now();
  const { limit, slugs } = parseArgs();
  console.log("=== Recherche prochaine édition (salons passés) ===\n");

  const todayDate = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("salons")
    .select(
      "slug, name, status, start_date, end_date, website_url, edition_year, city, venue, frequency, locked_fields"
    )
    .lt("start_date", todayDate)
    .not("website_url", "is", null)
    .order("start_date", { ascending: false });

  if (error || !data) {
    console.error("Erreur lecture salons:", error?.message);
    process.exit(1);
  }

  let salons = (data as Salon[]).filter(
    (s) => s.website_url && s.website_url.trim().length > 0
  );
  if (slugs) salons = salons.filter((s) => slugs.has(s.slug));
  if (limit != null) salons = salons.slice(0, limit);
  console.log(`  ${salons.length} salons à analyser\n`);

  const guesses: Guess[] = [];
  let idx = 0;
  for (const salon of salons) {
    idx++;
    process.stdout.write(`  [${idx}/${salons.length}] ${salon.slug.padEnd(45)} `);

    const pageContent = await fetchPageText(salon.website_url);
    if (!pageContent) {
      const g = emptyGuess(salon);
      g.reason = "fetch failed (timeout, 404, ou bloqué)";
      g.alerts = ["FETCH_ECHEC"];
      guesses.push(g);
      console.log("✗ fetch");
      continue;
    }

    try {
      const guess = await askLLM(salon, pageContent);
      applyGuardrails(salon, guess);
      guesses.push(guess);
      console.log(
        `${guess.verdict} (${guess.confidence})${
          guess.next_start_date ? ` → ${guess.next_start_date}` : ""
        }${guess.alerts.length > 0 ? ` [${guess.alerts.length} alerte(s)]` : ""}`
      );
    } catch (err) {
      const g = emptyGuess(salon);
      g.reason = err instanceof Error ? err.message : String(err);
      g.alerts = ["ERREUR_LLM"];
      guesses.push(g);
      console.log("✗ LLM");
    }
  }

  writeCSV(guesses);
  const { rolls, flags } = writeSQL(guesses);
  printReport(guesses);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ ${guesses.length} salons traités en ${elapsed}s`);
  console.log(`\n📄 CSV : ${OUTPUT_CSV}`);
  console.log(`📄 SQL : ${OUTPUT_SQL} (${rolls} roll(s) confirmé(s), ${flags} flag(s) à vérifier)`);
  console.log(
    `\n⚠️  Aucun UPDATE exécuté par ce script. Relire le SQL avant application manuelle.`
  );
}

main().catch((err) => {
  console.error("❌ Erreur:", err.message);
  process.exit(1);
});
