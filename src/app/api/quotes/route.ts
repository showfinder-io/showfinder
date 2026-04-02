import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, companyName, email, salonName, message } = body;

    // Validation
    if (!providerId || !companyName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Validation email basique
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("quotes").insert({
      provider_id: providerId,
      company_name: companyName.trim(),
      email: email.trim(),
      salon_name: salonName || null,
      message: message.trim(),
    });

    if (error) {
      console.error("Erreur insertion quote:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Demande de devis enregistrée" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
