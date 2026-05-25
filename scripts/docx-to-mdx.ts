/**
 * Convertit une fiche salon docx au format Nicolas v3 (avec balises
 * === BLOC N === / === FIN BLOC N ===) en MDX prêt à poser dans
 * content/salons/[slug].mdx.
 *
 * Usage :
 *   ./node_modules/.bin/tsx scripts/docx-to-mdx.ts <input> <slug> [--salon=NAME]
 *
 * <input>   : chemin vers le .docx OU .txt (le .docx est converti via textutil)
 * <slug>    : slug DB du salon, ex "vivatech-paris-2026"
 * --salon   : nom du salon dans le docx (si plusieurs fiches dans le même fichier)
 *
 * Bloc 1 (Identité) est volontairement IGNORÉ : déjà rendu par le header DB
 * (titre, dates, lieu, organisateur, chiffres clés, badge Certified).
 * Le MDX ne contient que les blocs 2, 4, 5, 6, 7, 8, 9.
 *
 * Le script fait ~80% du job. Vérif visuelle + retouches manuelles à attendre
 * sur les sous-sections complexes (formulations spécifiques, marqueurs "[INFO
 * NON DISPONIBLE]" à remplacer par <DataMissing />).
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ----------------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------------

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? "true"];
    })
);

if (positional.length < 2) {
  console.error(
    "Usage: tsx scripts/docx-to-mdx.ts <input.docx|.txt> <slug> [--salon=NAME]"
  );
  process.exit(1);
}

const [inputPath, slug] = positional;
const salonNameFilter = flags.salon as string | undefined;

// ----------------------------------------------------------------------------
// 1. Convertir docx → txt si nécessaire
// ----------------------------------------------------------------------------

function loadText(filepath: string): string {
  if (filepath.endsWith(".txt")) {
    return fs.readFileSync(filepath, "utf-8");
  }
  if (filepath.endsWith(".docx")) {
    const tmp = `/tmp/docx-to-mdx-${Date.now()}.txt`;
    execSync(`textutil -convert txt -output ${tmp} "${filepath}"`);
    const content = fs.readFileSync(tmp, "utf-8");
    fs.unlinkSync(tmp);
    return content;
  }
  throw new Error(`Format non supporté: ${filepath}`);
}

const fullText = loadText(inputPath);

// ----------------------------------------------------------------------------
// 2. Extraire la section salon ciblée (si plusieurs salons dans le fichier)
// ----------------------------------------------------------------------------

function extractSalonSection(text: string, salonName?: string): string {
  if (!salonName) return text;
  const start = new RegExp(
    `=== SALON:\\s*${salonName.toUpperCase()}\\s*===`,
    "i"
  );
  const startMatch = text.match(start);
  if (!startMatch) {
    throw new Error(`Salon "${salonName}" non trouvé dans le fichier`);
  }
  const afterStart = text.slice(startMatch.index! + startMatch[0].length);
  const end = afterStart.match(/=== FIN SALON[:\s][^=]*===/);
  return end ? afterStart.slice(0, end.index!) : afterStart;
}

const salonText = extractSalonSection(fullText, salonNameFilter);

// ----------------------------------------------------------------------------
// 3. Extraire chaque bloc entre === BLOC N ... === et === FIN BLOC N ===
// ----------------------------------------------------------------------------

function extractBlock(text: string, n: number): string | null {
  const re = new RegExp(
    `===\\s*BLOC\\s+${n}\\s+[^=]*===([\\s\\S]*?)===\\s*FIN\\s+BLOC\\s+${n}\\s*===`,
    "i"
  );
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

const blocks = {
  2: extractBlock(salonText, 2),
  4: extractBlock(salonText, 4),
  5: extractBlock(salonText, 5),
  6: extractBlock(salonText, 6),
  7: extractBlock(salonText, 7),
  8: extractBlock(salonText, 8),
  9: extractBlock(salonText, 9),
};

// ----------------------------------------------------------------------------
// 4. Helpers de nettoyage
// ----------------------------------------------------------------------------

/** Vire em-dashes (règle globale + projet) en les remplaçant par virgule. */
function noEmDash(s: string): string {
  return s.replace(/\s*—\s*/g, ", ").replace(/—/g, ", ");
}

/** Détecte les marqueurs "[INFORMATION NON DISPONIBLE]" ou similaires. */
function isDataMissing(s: string): boolean {
  return /\[(?:INFORMATION NON DISPONIBLE|INFO NON DISPONIBLE|DONNÉE MANQUANTE|DONNEE MANQUANTE)[^\]]*\]/i.test(
    s.trim()
  );
}

/** Lignes propres : retire tabs/whitespace de bord. */
function lines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.replace(/^\s+|\s+$/g, ""))
    .filter((l) => l.length > 0);
}

/** Détecte une ligne de puce avec format "	•	Texte" (tab + bullet + tab). */
function bulletLine(l: string): string | null {
  const m = l.match(/^[•·\-*]\s+(.+)$/);
  return m ? m[1].trim() : null;
}

// ----------------------------------------------------------------------------
// 5. Transformateurs de blocs
// ----------------------------------------------------------------------------

/** BLOC 2 — Liste de 5 points clés. */
function renderBlock2(raw: string): string {
  const items = lines(raw)
    .map((l) => bulletLine(l) ?? l)
    .filter((l) => l && !/^=/i.test(l));
  return `## L'essentiel à retenir\n\n${items.map((i) => `- ${noEmDash(i)}`).join("\n")}\n`;
}

/** Sous-section "Label :\n<contenu>" → H3 + paragraphes. Gère DataMissing. */
function parseLabeledSections(raw: string): { label: string; body: string }[] {
  // Découpe en groupes "Label :" / contenu
  const ls = lines(raw);
  const out: { label: string; body: string }[] = [];
  let currentLabel: string | null = null;
  let currentBody: string[] = [];
  for (const l of ls) {
    // Label de sous-section : commence par majuscule/accent, peut contenir
    // chiffres, parenthèses, &, ' ’ et année. Doit se terminer par ":".
    const labelMatch = l.match(
      /^([A-ZÉÊÀÈÎ][A-Za-zéèêàçïîôûÉÊÀÈÎ&'’()\d\s]+?)\s*:\s*$/
    );
    if (labelMatch) {
      if (currentLabel) {
        out.push({ label: currentLabel, body: currentBody.join("\n") });
      }
      currentLabel = labelMatch[1].trim();
      currentBody = [];
    } else if (currentLabel) {
      currentBody.push(l);
    }
  }
  if (currentLabel) {
    out.push({ label: currentLabel, body: currentBody.join("\n") });
  }
  return out;
}

function renderLabeledSections(
  title: string,
  raw: string,
  options: { displayTitle?: string } = {}
): string {
  const sections = parseLabeledSections(raw);
  if (sections.length === 0) {
    // Fallback : retour brut sans structure
    return `## ${options.displayTitle ?? title}\n\n${noEmDash(raw)}\n`;
  }
  const body = sections
    .map(({ label, body }) => {
      if (!body.trim() || isDataMissing(body)) {
        return `### ${noEmDash(label)}\n\n<DataMissing />`;
      }
      return `### ${noEmDash(label)}\n\n${noEmDash(body.trim())}`;
    })
    .join("\n\n");
  return `## ${options.displayTitle ?? title}\n\n${body}\n`;
}

/** BLOC 4 — Qui expose */
function renderBlock4(raw: string): string {
  return renderLabeledSections("Qui expose", raw);
}

/** BLOC 5 — Animations & communauté */
function renderBlock5(raw: string): string {
  return renderLabeledSections("Animations & communauté", raw);
}

/** BLOC 6 — Logistique : liste de puces "Label : valeur" */
function renderBlock6(raw: string): string {
  const items = lines(raw)
    .map((l) => bulletLine(l) ?? l)
    .filter((l) => l && !/^=/i.test(l))
    .map((l) => {
      const m = l.match(/^([^:]+):\s*(.+)$/);
      if (m) return `- **${noEmDash(m[1].trim())}** : ${noEmDash(m[2].trim())}`;
      return `- ${noEmDash(l)}`;
    });
  return `## Sur place : ce qu'il faut savoir\n\n${items.join("\n")}\n`;
}

/**
 * BLOC 7 — Budget : on tente d'extraire les lignes de tableau et de générer
 * un <BudgetTable />. Format source = 3 lignes par poste (label, low, high).
 * Si parsing rate, fallback en markdown brut.
 */
function renderBlock7(raw: string): string {
  const ls = lines(raw);
  const headerIdx = ls.findIndex((l) =>
    /^Poste\s+de\s+d[ée]pense/i.test(l)
  );
  if (headerIdx === -1) {
    return `## Combien ça coûte d'exposer\n\n${noEmDash(raw)}\n`;
  }

  // Warning : tout ce qui précède le header, sauf les lignes vides
  const warningLines = ls
    .slice(0, headerIdx)
    .map((l) => l.replace(/^[⚠⚠\s]+/, "").trim())
    .filter((l) => l.length > 0);
  const warning = warningLines.join(" ");

  // Skip les 3 lignes header (Poste / Fourchette basse / Fourchette haute)
  const dataLines = ls.slice(headerIdx + 3);

  // Footer : on cherche un éventuel paragraphe final qui ne soit pas un row
  // Heuristique simple : on traite par groupes de 3 jusqu'à tomber sur un
  // groupe incomplet ou une ligne longue non-prix.
  const rows: { poste: string; low: string; high: string }[] = [];
  const totals: { label: string; low: string; high: string }[] = [];
  // Note : `rows` utilise `poste` (matche le composant BudgetTable), `totals`
  // utilise `label`. Différence assumée pour distinguer les deux concepts.
  let footer = "";

  let i = 0;
  while (i + 2 < dataLines.length) {
    const poste = dataLines[i];
    const low = dataLines[i + 1];
    const high = dataLines[i + 2];
    // Heuristique : low et high contiennent un chiffre ou €
    if (!/[\d€]/.test(low) || !/[\d€]/.test(high)) {
      footer = dataLines.slice(i).join(" ");
      break;
    }
    if (/^TOTAL/i.test(poste)) {
      totals.push({ label: poste, low, high });
    } else {
      rows.push({ poste, low, high });
    }
    i += 3;
  }
  if (i < dataLines.length && !footer) {
    footer = dataLines.slice(i).join(" ");
  }

  const jsonRows = JSON.stringify(rows, null, 2)
    .replace(/^/gm, "    ")
    .trim();
  const jsonTotals = JSON.stringify(totals, null, 2)
    .replace(/^/gm, "    ")
    .trim();

  let out = `## Combien ça coûte d'exposer\n\n<BudgetTable`;
  if (warning) {
    out += `\n  warning=${JSON.stringify(noEmDash(warning))}`;
  }
  out += `\n  rows={${jsonRows}}`;
  if (totals.length > 0) {
    out += `\n  totals={${jsonTotals}}`;
  }
  if (footer) {
    out += `\n  footer=${JSON.stringify(noEmDash(footer))}`;
  }
  out += `\n/>\n`;
  return out;
}

/** BLOC 8 — Préparer sa venue : 2 sous-listes (exposant / visiteur). */
function renderBlock8(raw: string): string {
  const ls = lines(raw);
  // Découpe à chaque "Pour ..." (sous-titre)
  const groups: { title: string; items: string[] }[] = [];
  let current: { title: string; items: string[] } | null = null;
  for (const l of ls) {
    const titleMatch = l.match(/^Pour\s+(.+?)\s*:?\s*$/i);
    if (titleMatch) {
      if (current) groups.push(current);
      current = { title: `Pour ${titleMatch[1].trim()}`, items: [] };
    } else if (current) {
      const item = bulletLine(l) ?? l;
      if (item) current.items.push(item);
    }
  }
  if (current) groups.push(current);

  if (groups.length === 0) {
    return `## Préparer sa venue\n\n${noEmDash(raw)}\n`;
  }

  const body = groups
    .map(
      (g) =>
        `### ${noEmDash(g.title)}\n\n${g.items.map((i) => `- ${noEmDash(i)}`).join("\n")}`
    )
    .join("\n\n");
  return `## Préparer sa venue\n\n${body}\n`;
}

/**
 * BLOC 9 — Historique : tableau (Édition + N colonnes) + Analyse de trajectoire.
 * Détection : la 1re ligne "Édition" donne le début, on collecte N labels de
 * colonnes (jusqu'à la 1re ligne qui ressemble à une année / édition).
 */
function renderBlock9(raw: string): string {
  const ls = lines(raw);
  const headerIdx = ls.findIndex((l) => /^Édition$/i.test(l));
  if (headerIdx === -1) {
    return `## L'évolution du salon\n\n${noEmDash(raw)}\n`;
  }

  // Collecte des labels de colonnes : à partir de headerIdx, on prend les
  // lignes jusqu'à tomber sur ce qui ressemble à une édition (commence par
  // un chiffre).
  const columnLabels: string[] = [];
  let i = headerIdx;
  while (i < ls.length && !/^\d{4}/.test(ls[i])) {
    columnLabels.push(ls[i]);
    i++;
  }
  const nCols = columnLabels.length;
  const columns = columnLabels.map((label) => ({
    key: label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]/g, ""),
    label,
  }));

  // Lignes de données : groupes de nCols lignes
  const rows: Record<string, string>[] = [];
  while (i + nCols - 1 < ls.length) {
    const group = ls.slice(i, i + nCols);
    if (!/^\d{4}/.test(group[0])) break;
    const row: Record<string, string> = {};
    columns.forEach((col, k) => {
      row[col.key] = group[k] === "—" ? "" : group[k];
    });
    rows.push(row);
    i += nCols;
  }

  // Notes + sources + analyse : tout ce qui suit
  const tail = ls.slice(i).join("\n");
  const notes: string[] = [];
  const noteMatches = tail.match(/^\*+\s+.+$/gm);
  if (noteMatches) notes.push(...noteMatches.map((s) => s.replace(/^\*+\s+/, "* ")));

  const sourcesMatch = tail.match(/Sources?\s*:\s*([^\n]+)/i);
  const sources = sourcesMatch ? sourcesMatch[1].trim().replace(/\.$/, "") : "";

  const analyseMatch = tail.match(
    /Analyse\s+de\s+trajectoire\s*:?\s*\n?([\s\S]+?)(?:\n\n|$)/i
  );
  const analyse = analyseMatch ? analyseMatch[1].trim() : "";

  const jsonColumns = JSON.stringify(columns, null, 2)
    .replace(/^/gm, "    ")
    .trim();
  const jsonRows = JSON.stringify(rows, null, 2)
    .replace(/^/gm, "    ")
    .trim();

  let out = `## L'évolution du salon\n\n<HistoryTable`;
  out += `\n  columns={${jsonColumns}}`;
  out += `\n  rows={${jsonRows}}`;
  if (notes.length > 0) {
    out += `\n  notes={${JSON.stringify(notes.map(noEmDash))}}`;
  }
  if (sources) {
    out += `\n  sources=${JSON.stringify(noEmDash(sources))}`;
  }
  out += `\n/>\n`;
  if (analyse) {
    out += `\n### Analyse de trajectoire\n\n${noEmDash(analyse)}\n`;
  }
  return out;
}

// ----------------------------------------------------------------------------
// 6. Assemblage final
// ----------------------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);

const frontmatter = `---
updated: "${today}"
---
`;

const bodyParts: string[] = [];
if (blocks[2]) bodyParts.push(renderBlock2(blocks[2]));
if (blocks[4]) bodyParts.push(renderBlock4(blocks[4]));
if (blocks[5]) bodyParts.push(renderBlock5(blocks[5]));
if (blocks[6]) bodyParts.push(renderBlock6(blocks[6]));
if (blocks[7]) bodyParts.push(renderBlock7(blocks[7]));
if (blocks[8]) bodyParts.push(renderBlock8(blocks[8]));
if (blocks[9]) bodyParts.push(renderBlock9(blocks[9]));

const mdx = frontmatter + "\n" + bodyParts.join("\n");

// ----------------------------------------------------------------------------
// 7. Écriture
// ----------------------------------------------------------------------------

const outDir = path.join(process.cwd(), "content/salons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.mdx`);
fs.writeFileSync(outPath, mdx, "utf-8");

console.log(`✓ Écrit ${outPath} (${mdx.length} chars)`);
console.log(`  Blocs trouvés : ${Object.entries(blocks).filter(([, v]) => v).map(([k]) => k).join(", ")}`);
console.log(`  Vérifie visuellement : sous-sections, formulations, marqueurs DataMissing.`);
