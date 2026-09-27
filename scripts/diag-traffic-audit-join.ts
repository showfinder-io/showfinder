// Jointure GSC x DB pour l'audit traffic-vs-size-2026-09-27.
//
// Lit gsc-pages.csv, gsc-page-age.csv et db-salons.csv (déjà produits) et écrit
// une ligne par slug PUBLIÉ dans salons-joined.csv, avec clics/impressions/position
// FR, EN et total, plus first_impression_date et days_with_impr.
//
// Usage : ./node_modules/.bin/tsx scripts/diag-traffic-audit-join.ts

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "audits", "traffic-vs-size-2026-09-27");

// ─── Parseur CSV minimal (RFC4180 : guillemets, virgules et \n dans les champs) ───

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

function readCsvAsObjects(filePath: string): Record<string, string>[] {
  const raw = readFileSync(filePath, "utf-8");
  const rows = parseCsv(raw);
  const header = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h] = r[idx] ?? ""));
    return obj;
  });
}

function csvEscape(v: string | number | boolean | null): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath: string, header: string[], rows: (string | number | boolean | null)[][]) {
  const lines = [header.join(",")];
  for (const row of rows) lines.push(row.map(csvEscape).join(","));
  writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

// ─── Normalisation d'URL -> chemin (retire host www/non-www, slash final, query) ───

function normalizePath(url: string): string {
  let u = url.trim();
  u = u.replace(/^https?:\/\/(www\.)?agoris\.io/i, "");
  const qIdx = u.indexOf("?");
  if (qIdx >= 0) u = u.slice(0, qIdx);
  const hIdx = u.indexOf("#");
  if (hIdx >= 0) u = u.slice(0, hIdx);
  if (u.length > 1 && u.endsWith("/")) u = u.slice(0, -1);
  if (u === "") u = "/";
  return u;
}

function main() {
  console.log("Lecture gsc-pages.csv...");
  const gscPages = readCsvAsObjects(path.join(OUT_DIR, "gsc-pages.csv"));
  console.log(`  -> ${gscPages.length} lignes.`);

  console.log("Lecture gsc-page-age.csv...");
  const gscAge = readCsvAsObjects(path.join(OUT_DIR, "gsc-page-age.csv"));
  console.log(`  -> ${gscAge.length} lignes.`);

  console.log("Lecture db-salons.csv...");
  const dbSalons = readCsvAsObjects(path.join(OUT_DIR, "db-salons.csv"));
  console.log(`  -> ${dbSalons.length} lignes.`);

  // Agrège gsc-pages.csv par chemin normalisé (somme www/non-www/slash final).
  const byPath = new Map<string, { clicks: number; impressions: number; weightedPosSum: number }>();
  for (const r of gscPages) {
    const p = normalizePath(r.page);
    const clicks = Number(r.clicks) || 0;
    const impressions = Number(r.impressions) || 0;
    const position = Number(r.position) || 0;
    const entry = byPath.get(p) ?? { clicks: 0, impressions: 0, weightedPosSum: 0 };
    entry.clicks += clicks;
    entry.impressions += impressions;
    entry.weightedPosSum += position * impressions;
    byPath.set(p, entry);
  }

  // Agrège gsc-page-age.csv par chemin normalisé (min date, somme des jours).
  const ageByPath = new Map<string, { firstDate: string; days: number }>();
  for (const r of gscAge) {
    const p = normalizePath(r.page);
    const days = Number(r.days_with_impr) || 0;
    const date = r.first_impression_date;
    const entry = ageByPath.get(p);
    if (!entry) {
      ageByPath.set(p, { firstDate: date, days });
    } else {
      entry.days += days;
      if (date && (!entry.firstDate || date < entry.firstDate)) entry.firstDate = date;
    }
  }

  const published = dbSalons.filter((s) => s.status === "published");
  console.log(`\nFiches publiées à joindre : ${published.length}`);

  const outRows: (string | number | boolean | null)[][] = [];
  let withImpr = 0;

  for (const s of published) {
    const slug = s.slug;
    const frPath = `/salons/${slug}`;
    const enPath = `/en/salons/${slug}`;

    const fr = byPath.get(frPath) ?? { clicks: 0, impressions: 0, weightedPosSum: 0 };
    const en = byPath.get(enPath) ?? { clicks: 0, impressions: 0, weightedPosSum: 0 };

    const clicksFr = fr.clicks;
    const imprFr = fr.impressions;
    const posFr = imprFr > 0 ? fr.weightedPosSum / imprFr : null;

    const clicksEn = en.clicks;
    const imprEn = en.impressions;
    const posEn = imprEn > 0 ? en.weightedPosSum / imprEn : null;

    const clicksTotal = clicksFr + clicksEn;
    const imprTotal = imprFr + imprEn;
    const posTotal = imprTotal > 0 ? (fr.weightedPosSum + en.weightedPosSum) / imprTotal : null;

    const ageFr = ageByPath.get(frPath);
    const ageEn = ageByPath.get(enPath);
    const dates = [ageFr?.firstDate, ageEn?.firstDate].filter((d): d is string => !!d);
    const firstImpressionDate = dates.length > 0 ? dates.sort()[0] : null;
    const daysWithImpr = (ageFr?.days ?? 0) + (ageEn?.days ?? 0);

    if (imprTotal > 0) withImpr++;

    outRows.push([
      slug,
      s.name,
      s.city,
      s.country,
      s.category,
      s.estimated_exhibitors === "" ? null : Number(s.estimated_exhibitors),
      s.estimated_visitors === "" ? null : Number(s.estimated_visitors),
      s.has_mdx,
      s.sector_slugs,
      clicksFr,
      imprFr,
      posFr,
      clicksEn,
      imprEn,
      posEn,
      clicksTotal,
      imprTotal,
      posTotal,
      firstImpressionDate,
      daysWithImpr,
    ]);
  }

  writeCsv(
    path.join(OUT_DIR, "salons-joined.csv"),
    [
      "slug",
      "name",
      "city",
      "country",
      "category",
      "estimated_exhibitors",
      "estimated_visitors",
      "has_mdx",
      "sector_slugs",
      "clicks_fr",
      "impr_fr",
      "pos_fr",
      "clicks_en",
      "impr_en",
      "pos_en",
      "clicks_total",
      "impr_total",
      "pos_total",
      "first_impression_date",
      "days_with_impr",
    ],
    outRows
  );

  console.log(`\n-> salons-joined.csv écrit (${outRows.length} lignes).`);
  console.log(`Fiches publiées avec au moins 1 impression : ${withImpr} / ${outRows.length}`);
}

main();
