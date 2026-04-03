import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const supabase = await createClient();

  let query = supabase
    .from("sectors")
    .select("id, name, slug, icon, created_at")
    .order("name", { ascending: true })
    .limit(200);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Admin secteurs GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Compter les salons par secteur
  const sectorIds = (data ?? []).map((s) => s.id);
  const salonCounts: Record<string, number> = {};

  if (sectorIds.length > 0) {
    const { data: links } = await supabase
      .from("salon_sectors")
      .select("sector_id")
      .in("sector_id", sectorIds);

    if (links) {
      for (const l of links) {
        salonCounts[l.sector_id] = (salonCounts[l.sector_id] ?? 0) + 1;
      }
    }
  }

  const sectors = (data ?? []).map((s) => ({
    ...s,
    salon_count: salonCounts[s.id] ?? 0,
  }));

  return NextResponse.json({ sectors });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sectors")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Admin secteurs POST:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ sector: data }, { status: 201 });
}
