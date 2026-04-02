import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salonSlug, field, correction, email } = body;

    // Validation basique
    if (!salonSlug || !field || !correction?.trim()) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("reports").insert({
      salon_slug: salonSlug,
      field,
      correction: correction.trim(),
      reporter_email: email || null,
    });

    if (error) {
      console.error("Erreur insertion report:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Signalement enregistré, merci !" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
