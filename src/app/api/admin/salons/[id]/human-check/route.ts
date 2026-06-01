// API admin : marquer une fiche comme verifiee humainement.
// Set last_human_check_at = NOW() (brief Nicolas V5).

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();

  // cast as never : la table salons a recu des nouvelles colonnes (V5
  // workflow editorial) mais les types Supabase generes ne sont pas
  // synchronises automatiquement. A regenerer avec `supabase gen types`.
  const { data, error } = await supabase
    .from("salons")
    .update({ last_human_check_at: new Date().toISOString() } as never)
    .eq("id", id)
    .select("id, last_human_check_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Salon introuvable" },
      { status: 400 }
    );
  }

  return NextResponse.json({ salon: data });
}
