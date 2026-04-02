import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { target_type, target_id, rating, role, title, body: reviewBody } = body;

    // Validation
    if (!target_type || !target_id || !rating || !role) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    if (!["salon", "provider"].includes(target_type)) {
      return NextResponse.json(
        { error: "Type de cible invalide" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5" },
        { status: 400 }
      );
    }

    if (!["exposant", "visiteur", "organisateur"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("reviews").insert({
      target_type,
      target_id,
      user_id: user.id,
      rating,
      role,
      title: title || null,
      body: reviewBody || null,
    });

    if (error) {
      console.error("Erreur insertion review:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Avis enregistré avec succès" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
