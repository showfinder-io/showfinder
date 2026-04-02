import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, alertType, slug } = body;

    // Validation basique
    if (!email?.trim() || !alertType || !slug?.trim()) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Valider le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Valider le type d'alerte
    if (!["salon", "sector"].includes(alertType)) {
      return NextResponse.json(
        { error: "Type d'alerte invalide" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("alerts").insert({
      email: email.trim().toLowerCase(),
      alert_type: alertType,
      salon_slug: alertType === "salon" ? slug.trim() : null,
      sector_slug: alertType === "sector" ? slug.trim() : null,
    });

    if (error) {
      console.error("Erreur insertion alerte:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Alerte enregistrée avec succès" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
