"use client";

import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Formulaire contact remplacé par un mailto direct le temps que l'envoi
 * côté backend soit fiabilisé (le tag fetch /api/contact ne livrait pas
 * les messages à l'équipe). Subject pré-rempli pour faciliter le tri.
 */
export function ContactForm() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6">
      <p className="text-sm leading-relaxed text-muted">
        Envoyez-nous votre demande par email : nous répondons sous 48h
        ouvrées. Pensez à indiquer le contexte (organisateur, prestataire,
        visiteur) et toute information utile pour traiter votre demande.
      </p>
      <a
        href="mailto:hello@agoris.io?subject=Demande%20generale%20Agoris"
        onClick={() => trackEvent("contact_form_submit", { method: "mailto" })}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Mail className="h-4 w-4" />
        Écrire à hello@agoris.io
      </a>
    </div>
  );
}
