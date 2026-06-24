import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

// Fournit les listes statiques nécessaires au formulaire d'édition d'un salon :
// - venues : sélection du lieu parmi les enregistrements de la table venues
// - sectors : sélection multiple des secteurs

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const [venuesRes, sectorsRes] = await Promise.all([
    supabase
      .from("venues")
      .select("id, name, city, slug")
      .order("name", { ascending: true })
      .limit(500),
    supabase
      .from("sectors")
      .select("id, name, slug")
      .order("name", { ascending: true })
      .limit(200),
  ]);

  if (venuesRes.error) {
    console.error("form-options venues:", venuesRes.error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
  if (sectorsRes.error) {
    console.error("form-options sectors:", sectorsRes.error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({
    venues: venuesRes.data ?? [],
    sectors: sectorsRes.data ?? [],
  });
}
