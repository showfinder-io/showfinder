import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  }

  return NextResponse.json({ salon: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  // Ne pas permettre la modification de l'id
  delete body.id;
  delete body.created_at;
  delete body.updated_at;

  const { data, error } = await supabase
    .from("salons")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin salon PUT:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ salon: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("salons").delete().eq("id", id);

  if (error) {
    console.error("Admin salon DELETE:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Salon supprimé" });
}
