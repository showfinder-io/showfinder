import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alerts")
    .select("id, email, alert_type, salon_slug, sector_slug, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Admin alertes GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ alerts: data ?? [] });
}
