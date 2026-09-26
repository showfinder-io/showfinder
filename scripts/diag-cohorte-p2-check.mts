/**
 * Contrôles automatiques des handoffs de la cohorte P2 shortlist 2 (2026-09-25).
 * Lecture seule. À passer après chaque étape (writer, correction, traduction).
 *
 * Vérifie : JSON et clés obligatoires, enums (category, frequency), secteurs
 * valides, dates cohérentes, liens internes /salons /lieux /secteurs présents
 * dans published-slugs (ou lieu créé par venue_create), compilation MDX,
 * composants en liste blanche, tiret cadratin, longueurs SEO, et avec --en
 * la présence et la compilation des champs anglais.
 *
 * Usage : ./node_modules/.bin/tsx scripts/diag-cohorte-p2-check.mts [--en] slug1 slug2 ...
 */
import { readFileSync } from "node:fs";
import { compile } from "@mdx-js/mdx";

const DIR = "handoff/cohorte-trafic";
const EN = process.argv.includes("--en");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const pub = JSON.parse(readFileSync(`${DIR}/published-slugs-2026-09-25.json`, "utf8"));
const first = (l: string) => l.split(" | ")[0];
const SALONS = new Set<string>(pub.salons_publies.map(first));
const LIEUX = new Set<string>(pub.lieux.map(first));
const SECTEURS = new Set<string>(pub.secteurs_valides.map(first));
const ALLOWED = new Set(["HistoryTable", "BudgetTable", "DataMissing"]);
const REQUIRED = ["slug", "name", "edition_year", "start_date", "end_date", "city", "website_url", "organizer_name", "frequency", "category", "sector_slugs", "description", "seo_title", "seo_description", "editorial_mdx", "alerts"];
const REQUIRED_EN = ["description_en", "seo_title_en", "seo_description_en", "editorial_mdx_en"];

async function checkMdx(src: string, venueCreated: string | null, errs: string[], label: string) {
  if (src.includes("—")) errs.push(`${label}: tiret cadratin`);
  for (const [, tag] of src.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)) if (!ALLOWED.has(tag)) errs.push(`${label}: balise <${tag}>`);
  if (/^\s*\|.*\|\s*$/m.test(src)) errs.push(`${label}: table pipe`);
  for (const [, kind, slug] of src.matchAll(/\]\((?:\/en)?\/(salons|lieux|secteurs)\/([a-z0-9-]+)\)/g)) {
    const ok = kind === "salons" ? SALONS.has(slug) : kind === "lieux" ? LIEUX.has(slug) || slug === venueCreated : SECTEURS.has(slug);
    if (!ok) errs.push(`${label}: lien interne /${kind}/${slug} absent de published-slugs`);
  }
  try { await compile(src, { outputFormat: "function-body" }); } catch (e) { errs.push(`${label}: MDX ne compile pas (${(e as Error).message.slice(0, 80)})`); }
}

let failed = 0;
for (const slug of slugs) {
  const errs: string[] = [];
  const warns: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- handoff JSON brut, chaque champ est validé ci-dessous
  let h: Record<string, any>;
  try { h = JSON.parse(readFileSync(`${DIR}/${slug}.json`, "utf8")); } catch (e) { console.log(`FAIL ${slug}: ${(e as Error).message}`); failed++; continue; }
  for (const k of [...REQUIRED, ...(EN ? REQUIRED_EN : [])]) if (h[k] === undefined || h[k] === null || h[k] === "") errs.push(`clé ${k} manquante`);
  if (h.slug !== slug) errs.push(`slug ${h.slug} != ${slug}`);
  if (!["salon_professionnel", "salon_grand_public", "congres", "autres"].includes(h.category)) errs.push(`category ${h.category}`);
  if (!["annuel", "bisannuel", "semestriel", "ponctuel"].includes(h.frequency)) errs.push(`frequency ${h.frequency}`);
  for (const s of h.sector_slugs ?? []) if (!SECTEURS.has(s)) errs.push(`secteur ${s} invalide`);
  if (!(h.sector_slugs?.length >= 1 && h.sector_slugs.length <= 3)) errs.push("1 à 3 secteurs");
  if (!(h.start_date <= h.end_date)) errs.push("start_date > end_date");
  if (h.start_date < "2026-09-25") errs.push(`start_date passée (${h.start_date})`);
  const venueCreated = h.venue_create?.slug ?? null;
  if (h.venue_slug && !LIEUX.has(h.venue_slug) && h.venue_slug !== venueCreated) errs.push(`venue_slug ${h.venue_slug} inconnu sans venue_create`);
  if (h.venue_create && LIEUX.has(h.venue_create.slug)) errs.push(`venue_create ${h.venue_create.slug} existe déjà`);
  if (/\|\s*Agoris/.test(h.seo_title ?? "")) errs.push("seo_title contient | Agoris");
  const lt = (h.seo_title ?? "").length, ld = (h.seo_description ?? "").length;
  if (lt > 65 || lt < 30) warns.push(`seo_title ${lt} car.`);
  if (ld > 165 || ld < 100) warns.push(`seo_description ${ld} car.`);
  for (const k of ["name", "description", "seo_title", "seo_description"]) if (String(h[k] ?? "").includes("—")) errs.push(`${k}: tiret cadratin`);
  if (h.editorial_mdx) await checkMdx(h.editorial_mdx, venueCreated, errs, "mdx fr");
  if (EN && h.editorial_mdx_en) await checkMdx(h.editorial_mdx_en, venueCreated, errs, "mdx en");
  console.log(`${errs.length ? "FAIL" : "OK  "} ${slug}${errs.length ? " : " + errs.join(" ; ") : ""}${warns.length ? " | avert. " + warns.join(", ") : ""}`);
  if (errs.length) failed++;
}
process.exit(failed ? 1 : 0);
