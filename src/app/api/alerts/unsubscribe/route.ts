import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET : lister les alertes actives pour un email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("alerts")
      .select("id, alert_type, salon_slug, sector_slug, created_at")
      .eq("email", email.trim().toLowerCase())
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lecture alertes:", error);
      return NextResponse.json(
        { error: "Erreur lors de la lecture" },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: data });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}

// PATCH : désactiver une alerte
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, email } = body;

    if (!alertId || !email?.trim()) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("alerts")
      .update({ is_active: false })
      .eq("id", alertId)
      .eq("email", email.trim().toLowerCase());

    if (error) {
      console.error("Erreur désactivation alerte:", error);
      return NextResponse.json(
        { error: "Erreur lors de la désactivation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Alerte désactivée" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
