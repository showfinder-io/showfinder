// Export DB (Supabase REST, lecture seule) pour l'audit traffic-vs-size-2026-09-27.
//
// Toutes les fiches salons (tous statuts), avec secteurs (via salon_sectors -> sectors.slug)
// et has_mdx (editorial_mdx non null, texte non téléchargé).
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-traffic-audit-db.ts

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants (.env.local).");
}

const OUT_DIR = path.join(process.cwd(), "audits", "traffic-vs-size-2026-09-27");
mkdirSync(OUT_DIR, { recursive: true });

async function restFetch<T>(pathAndQuery: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase REST ${pathAndQuery} -> ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

// Pagination Supabase REST via Range headers (limite par défaut souvent 1000).
async function restFetchAll<T>(pathAndQuery: string): Promise<T[]> {
  const all: T[] = [];
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Range: `${offset}-${offset + pageSize - 1}`,
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Supabase REST ${pathAndQuery} -> ${res.status}: ${body}`);
    }
    const rows = (await res.json()) as T[];
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

interface SalonRow {
  id: string;
  slug: string;
  name: string;
  status: string;
  city: string | null;
  country: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  edition_year: number | null;
  frequency: string | null;
  estimated_exhibitors: number | null;
  estimated_visitors: number | null;
  created_at: string;
  editorial_mdx: string | null;
  website_url: string | null;
}

interface SalonSectorRow {
  salon_id: string;
  sector_id: string;
}

interface SectorRow {
  id: string;
  slug: string;
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

async function main() {
  console.log("Fetch salons (tous statuts)...");
  const salons = await restFetchAll<SalonRow>(
    "salons?select=id,slug,name,status,city,country,category,start_date,end_date,edition_year,frequency,estimated_exhibitors,estimated_visitors,created_at,editorial_mdx,website_url&order=slug.asc"
  );
  console.log(`  -> ${salons.length} salons.`);

  console.log("Fetch salon_sectors (jointure)...");
  const salonSectors = await restFetchAll<SalonSectorRow>("salon_sectors?select=salon_id,sector_id");
  console.log(`  -> ${salonSectors.length} liens salon-secteur.`);

  console.log("Fetch sectors (id -> slug)...");
  const sectors = await restFetch<SectorRow[]>("sectors?select=id,slug");
  const sectorSlugById = new Map(sectors.map((s) => [s.id, s.slug]));

  const sectorsBySalonId = new Map<string, string[]>();
  for (const link of salonSectors) {
    const slug = sectorSlugById.get(link.sector_id);
    if (!slug) continue;
    const list = sectorsBySalonId.get(link.salon_id) ?? [];
    list.push(slug);
    sectorsBySalonId.set(link.salon_id, list);
  }

  const rows = salons.map((s) => {
    const sectorSlugs = (sectorsBySalonId.get(s.id) ?? []).sort().join("|");
    const hasMdx = s.editorial_mdx !== null && s.editorial_mdx.trim().length > 0;
    return [
      s.slug,
      s.name,
      s.status,
      s.city,
      s.country,
      s.category,
      s.start_date,
      s.end_date,
      s.edition_year,
      s.frequency,
      s.estimated_exhibitors,
      s.estimated_visitors,
      s.created_at,
      hasMdx,
      sectorSlugs,
      s.website_url,
    ];
  });

  writeCsv(
    path.join(OUT_DIR, "db-salons.csv"),
    [
      "slug",
      "name",
      "status",
      "city",
      "country",
      "category",
      "start_date",
      "end_date",
      "edition_year",
      "frequency",
      "estimated_exhibitors",
      "estimated_visitors",
      "created_at",
      "has_mdx",
      "sector_slugs",
      "website_url",
    ],
    rows
  );
  console.log(`\n-> db-salons.csv écrit (${rows.length} lignes).`);

  const published = salons.filter((s) => s.status === "published");
  console.log(`Fiches publiées : ${published.length} / ${salons.length}`);
}

main().catch((err) => {
  console.error("ERREUR:", err);
  process.exit(1);
});
