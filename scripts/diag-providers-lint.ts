/**
 * Étape 2 du pipeline éditorial prestataires : contrôle mécanique, sans LLM, des sorties writer
 * (handoff/prestataires/out/<slug>.json) contre les dossiers sources figés
 * (handoff/prestataires/dossiers/<slug>.json). Règles : tasks/regles-edito-prestataires-v1.md.
 *
 *  - P3  : chaque citation (evidence.quote) existe verbatim dans le dossier
 *  - P8  : tout nombre de la description figure dans une citation (ou = founded_year)
 *  - P10, P11, P14 : lexique interdit, première personne, tirets longs, point médian
 *  - P15 : 400 à 850 caractères si status "ok"
 *  - P17 : pas plus de deux segments de 8 mots communs avec l'annuaire source
 *  - P20, P21 : 2 à 6 spécialités prouvées ; founded_year "api" = unité légale du dossier
 *
 * Usage : tsx scripts/diag-providers-lint.ts [--only slug1,slug2]   (exit 1 si un échec)
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";

const OUT = "handoff/prestataires/out";
const DOSSIERS = "handoff/prestataires/dossiers";
const onlyArg = process.argv.indexOf("--only");
const ONLY = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

type Evidence = { url?: string; quote?: string; source?: string };
type Output = {
  slug: string; status: "ok" | "matiere_insuffisante"; display_name: string; description_fr: string;
  description_en?: string;
  specialties: { label: string; evidence: Evidence }[];
  founded_year: { value: number; evidence: Evidence } | null;
  zone_intervention: { value: string; evidence: Evidence } | null;
  memberships: string[];
  claims: { claim: string; evidence: Evidence }[];
};

// Normalisation commune aux deux côtés : espaces, apostrophes et guillemets typographiques, casse
const norm = (s: string) =>
  s.replace(/[’‘ʼ]/g, "'").replace(/[“”«»]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

const BANNED: [RegExp, string][] = [
  [/[—–]/, "tiret long ou demi-cadratin (P14)"],
  [/·/, "point médian (P14)"],
  [/\b(leader|leaders|incontournable|incontournables|meilleur|meilleure|meilleurs|premium|haut de gamme|innovant|innovante|innovants|unique|uniques|passion|passionné|passionnée|passionnés|d'exception|exceptionnel|exceptionnelle|reconnu|reconnue|renommé|renommée|référence du|excellence|prestigieux|prestigieuse)\b/i, "superlatif ou jugement (P10)"],
  [/\brevendiqu/i, "« revendique » (P14, R26)"],
  [/\b(nous|notre|nos|vous|votre|vos)\b/i, "première ou deuxième personne (P11)"],
  [/[<>{}]|\*\*|\]\(/, "balisage dans un texte brut (P14)"],
];

function shingles(text: string, n = 8): Set<string> {
  const w = norm(text).replace(/[^\p{L}\p{N}' ]/gu, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

function lint(slug: string): string[] {
  const errors: string[] = [];
  const dossierFile = `${DOSSIERS}/${slug}.json`;
  if (!existsSync(dossierFile)) return [`dossier absent : ${dossierFile}`];
  const dossier = JSON.parse(readFileSync(dossierFile, "utf-8"));
  let out: Output;
  try { out = JSON.parse(readFileSync(`${OUT}/${slug}.json`, "utf-8")); } catch (e) { return [`JSON illisible : ${(e as Error).message}`]; }

  const corpus = norm([
    ...(dossier.site_pages ?? []).map((p: { text: string }) => p.text),
    dossier.directory?.text ?? "",
  ].join("\n"));

  const evidences: { where: string; ev: Evidence }[] = [
    ...(out.claims ?? []).map((c, i) => ({ where: `claims[${i}]`, ev: c.evidence })),
    ...(out.specialties ?? []).map((s, i) => ({ where: `specialties[${i}] "${s.label}"`, ev: s.evidence })),
    ...(out.zone_intervention ? [{ where: "zone_intervention", ev: out.zone_intervention.evidence }] : []),
    ...(out.founded_year && out.founded_year.evidence?.source !== "api" ? [{ where: "founded_year", ev: out.founded_year.evidence }] : []),
  ];
  for (const { where, ev } of evidences) {
    const q = ev?.quote ?? "";
    // Une spécialité se prouve souvent par un intitulé de menu ou de rubrique, court par nature
    const min = where.startsWith("specialties") ? 8 : 20;
    if (q.length < min || q.length > 260) { errors.push(`${where} : citation de ${q.length} car. (attendu ${min} à 260)`); continue; }
    if (!corpus.includes(norm(q))) errors.push(`${where} : citation introuvable dans le dossier (P3) : "${q.slice(0, 80)}"`);
  }

  if (out.founded_year?.evidence?.source === "api") {
    const year = dossier.legal_unit?.match?.date_creation?.slice(0, 4);
    if (!year) errors.push("founded_year source api mais aucune unité légale en match strict dans le dossier (P21)");
    else if (String(out.founded_year.value) !== year) errors.push(`founded_year ${out.founded_year.value} != unité légale ${year} (P21)`);
  }

  const desc = out.description_fr ?? "";
  if (out.status === "ok") {
    if (desc.length < 400 || desc.length > 850) errors.push(`description de ${desc.length} car. (P15 : 400 à 850)`);
    if ((out.specialties ?? []).length < 2 || out.specialties.length > 6) errors.push("2 à 6 spécialités attendues (P20)");
    if ((out.claims ?? []).length < 3) errors.push("moins de 3 affirmations prouvées pour une description status ok (P3)");
  } else if (desc.length > 850) errors.push(`description de ${desc.length} car. (plafond 850)`);

  for (const text of [desc, out.description_en ?? ""]) for (const [re, label] of BANNED) {
    // Le lexique FR ne s'applique qu'au FR ; les règles de ponctuation aux deux
    if (text === out.description_en && !/P14/.test(label)) continue;
    const m = text.match(re);
    if (m) errors.push(`${label} : "${m[0]}"`);
  }

  const quotesText = norm(evidences.map((e) => e.ev?.quote ?? "").join(" "));
  for (const num of desc.match(/\d[\d\s.,]*\d|\d/g) ?? []) {
    const digits = num.replace(/\D/g, "");
    if (out.founded_year && digits === String(out.founded_year.value)) continue;
    if (!quotesText.replace(/[\s.,]/g, "").includes(digits)) errors.push(`nombre "${num.trim()}" absent de toute citation (P8)`);
  }

  const mine = shingles(desc);
  for (const [label, other] of [["annuaire source", dossier.directory?.text ?? ""], ["description actuelle", dossier.current_description ?? ""]] as const) {
    const theirs = shingles(other);
    const shared = [...mine].filter((s) => theirs.has(s));
    if (shared.length > 2) errors.push(`${shared.length} segments de 8 mots communs avec ${label} (P17), ex. "${shared[0]}"`);
  }
  return errors;
}

const slugs = (existsSync(OUT) ? readdirSync(OUT) : []).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).filter((s) => !ONLY || ONLY.has(s));
for (const s of ONLY ?? []) if (!slugs.includes(s)) { console.log(`✗ ${s}\n    sortie absente : ${OUT}/${s}.json`); process.exitCode = 1; }
let failed = 0;
for (const slug of slugs) {
  const errors = lint(slug);
  if (errors.length) { failed++; console.log(`✗ ${slug}`); errors.forEach((e) => console.log(`    ${e}`)); }
  else console.log(`✓ ${slug}`);
}
console.log(`${slugs.length - failed}/${slugs.length} conformes`);
if (failed) process.exitCode = 1;
