import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Encapsuler si contient virgule, guillemet ou saut de ligne
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(fields: (string | number | boolean | null | undefined)[]): string {
  return fields.map(escapeCsvField).join(",");
}

// Type étendu pour les salons avec les relations et le champ category (migration 20260613)
// category n'est pas dans les types générés (types obsolètes), on type manuellement.
type SalonExportRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  country: string;
  start_date: string | null;
  end_date: string | null;
  category: string | null;
  status: string;
  is_agoris_certified: boolean;
  organizer_name: string | null;
  estimated_exhibitors: number | null;
  estimated_visitors: number | null;
  salon_sectors: { sectors: { name: string } | null }[];
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  // Récupérer tous les salons avec leurs secteurs joints
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawSalons, error } = await (supabase as any)
    .from("salons")
    .select(
      "id, name, slug, city, country, start_date, end_date, category, status, is_agoris_certified, organizer_name, estimated_exhibitors, estimated_visitors, salon_sectors(sectors(name))"
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Export CSV salons:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  const salons = (rawSalons ?? []) as SalonExportRow[];

  const headers = [
    "Nom",
    "Slug",
    "Ville",
    "Pays",
    "Date début",
    "Date fin",
    "Catégorie",
    "Statut",
    "Agoris Certified",
    "Organisateur",
    "Exposants estimés",
    "Visiteurs estimés",
    "Secteurs",
  ];

  const rows = salons.map((salon) => {
    // Extraire les noms de secteurs depuis la relation M:N
    const sectorNames =
      salon.salon_sectors
        ?.map((ss) => ss.sectors?.name ?? "")
        .filter(Boolean)
        .join(" | ") ?? "";

    return buildCsvRow([
      salon.name,
      salon.slug,
      salon.city,
      salon.country,
      salon.start_date,
      salon.end_date,
      salon.category,
      salon.status,
      salon.is_agoris_certified ? "Oui" : "Non",
      salon.organizer_name,
      salon.estimated_exhibitors,
      salon.estimated_visitors,
      sectorNames,
    ]);
  });

  // BOM UTF-8 pour Excel Windows
  const bom = "﻿";
  const csvContent = bom + [buildCsvRow(headers), ...rows].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agoris-salons-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
