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
    .from("venues")
    .select("id, name, slug, city, total_surface_sqm, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Admin venues GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Compter les salons par venue
  const venueIds = (data ?? []).map((v) => v.id);
  let salonCounts: Record<string, number> = {};

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

  const venues = (data ?? []).map((v) => ({
    ...v,
    salon_count: salonCounts[v.id] ?? 0,
  }));

  return NextResponse.json({ venues });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Admin venues POST:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ venue: data }, { status: 201 });
}
