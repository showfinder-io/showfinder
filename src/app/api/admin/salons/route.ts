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
    .from("salons")
    .select("id, name, slug, city, start_date, end_date, status, is_locked")
    .order("created_at", { ascending: false })
    .limit(200);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Admin salons GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ salons: data });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Admin salons POST:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ salon: data }, { status: 201 });
}
