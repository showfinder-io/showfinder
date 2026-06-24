import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(fields: (string | number | boolean | null | undefined)[]): string {
  return fields.map(escapeCsvField).join(",");
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, name, slug, city, total_surface_sqm, created_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("Export CSV venues:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Compter les salons par venue
  const venueIds = (venues ?? []).map((v) => v.id);
  const salonCounts: Record<string, number> = {};

  if (venueIds.length > 0) {
    const { data: salons } = await supabase
      .from("salons")
      .select("venue_id")
      .in("venue_id", venueIds);

    if (salons) {
      for (const s of salons) {
        if (s.venue_id) {
          salonCounts[s.venue_id] = (salonCounts[s.venue_id] ?? 0) + 1;
        }
      }
    }
  }

  const headers = [
    "Nom",
    "Slug",
    "Ville",
    "Surface (m²)",
    "Nombre de salons",
    "Créé le",
  ];

  const rows = (venues ?? []).map((venue) =>
    buildCsvRow([
      venue.name,
      venue.slug,
      venue.city,
      venue.total_surface_sqm,
      salonCounts[venue.id] ?? 0,
      venue.created_at ? new Date(venue.created_at).toLocaleDateString("fr-FR") : "",
    ])
  );

  // BOM UTF-8 pour Excel Windows
  const bom = "﻿";
  const csvContent = bom + [buildCsvRow(headers), ...rows].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agoris-venues-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
