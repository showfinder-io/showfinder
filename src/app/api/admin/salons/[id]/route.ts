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
    .select("*, salon_sectors(sector_id)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Salon introuvable" }, { status: 404 });
  }

  // Aplatir les sector_ids dans un tableau simple pour le formulaire
  const salonWithSectors = {
    ...data,
    sector_ids: (data.salon_sectors as { sector_id: string }[] | null ?? []).map((ss) => ss.sector_id),
  };

  return NextResponse.json({ salon: salonWithSectors });
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

  // Extraire les sector_ids avant la mise à jour du salon (champ virtuel)
  const sectorIds: string[] | undefined = Array.isArray(body.sector_ids)
    ? (body.sector_ids as string[])
    : undefined;

  // Ne pas permettre la modification de l'id ni des champs calculés
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  delete body.salon_sectors;
  delete body.sector_ids;

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

  // Mettre à jour les secteurs (M:N) si fournis
  if (sectorIds !== undefined) {
    // Supprimer les liens existants puis réinsérer
    const { error: deleteError } = await supabase
      .from("salon_sectors")
      .delete()
      .eq("salon_id", id);

    if (deleteError) {
      console.error("Admin salon PUT — suppression salon_sectors:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    if (sectorIds.length > 0) {
      const inserts = sectorIds.map((sector_id) => ({ salon_id: id, sector_id }));
      const { error: insertError } = await supabase
        .from("salon_sectors")
        .insert(inserts);

      if (insertError) {
        console.error("Admin salon PUT — insertion salon_sectors:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }
    }
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
