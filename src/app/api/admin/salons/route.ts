import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const lockedParam = request.nextUrl.searchParams.get("locked") ?? "all";
  const supabase = await createClient();

  let query = supabase
    .from("salons")
    .select(
      "id, name, slug, city, start_date, end_date, status, is_locked, is_agoris_certified"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (lockedParam === "true") {
    query = query.eq("is_locked", true);
  } else if (lockedParam === "false") {
    query = query.eq("is_locked", false);
  }

  const [{ data, error }, lockedCountRes] = await Promise.all([
    query,
    supabase
      .from("salons")
      .select("*", { count: "exact", head: true })
      .eq("is_locked", true),
  ]);

  if (error) {
    console.error("Admin salons GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({
    salons: data,
    lockedCount: lockedCountRes.count ?? 0,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClient();

  // Extraire les sector_ids avant l'insert (champ virtuel)
  const sectorIds: string[] | undefined = Array.isArray(body.sector_ids)
    ? (body.sector_ids as string[])
    : undefined;
  delete body.sector_ids;

  const { data, error } = await supabase
    .from("salons")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Admin salons POST:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Insérer les liens secteurs si fournis
  if (sectorIds && sectorIds.length > 0) {
    const inserts = sectorIds.map((sector_id) => ({ salon_id: data.id, sector_id }));
    const { error: linkError } = await supabase
      .from("salon_sectors")
      .insert(inserts);
    if (linkError) {
      console.error("Admin salons POST — salon_sectors:", linkError);
      // Non bloquant : le salon est créé, on logue l'erreur secteurs
    }
  }

  return NextResponse.json({ salon: data }, { status: 201 });
}
