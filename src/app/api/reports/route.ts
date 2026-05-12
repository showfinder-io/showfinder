import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail, escapeHtml } from "@/lib/brevo";

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

    // Notification admin (fire-and-forget : ne bloque pas la réponse utilisateur)
    const adminEmail = process.env.BREVO_ADMIN_EMAIL;
    const adminCc = process.env.BREVO_ADMIN_CC?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (adminEmail) {
      const safeCorrection = escapeHtml(correction.trim());
      const safeField = escapeHtml(field);
      const safeSlug = escapeHtml(salonSlug);
      const replyTo = typeof email === "string" && email.trim() ? email.trim() : undefined;
      sendTransactionalEmail({
        to: adminEmail,
        cc: adminCc,
        subject: `[Agoris] Signalement sur ${salonSlug}`,
        replyTo,
        htmlContent: `
          <h2>Nouveau signalement</h2>
          <p><strong>Salon :</strong> <a href="https://agoris.io/salons/${safeSlug}">${safeSlug}</a></p>
          <p><strong>Champ signalé :</strong> ${safeField}</p>
          <p><strong>Correction proposée :</strong></p>
          <blockquote style="border-left:3px solid #ccc;padding-left:12px;margin:8px 0;white-space:pre-wrap;">${safeCorrection}</blockquote>
          ${replyTo ? `<p><strong>Email du contributeur :</strong> ${escapeHtml(replyTo)}</p>` : "<p><em>Pas d'email fourni.</em></p>"}
        `,
      }).catch((err) => {
        console.error("[brevo] échec envoi notification report:", err);
      });
    }

    return NextResponse.json({ message: "Signalement enregistré, merci !" });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide" },
      { status: 400 }
    );
  }
}
