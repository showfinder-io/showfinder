"use client";

import { Mail } from "lucide-react";

/**
 * Formulaire contact remplace par un mailto direct le temps que l'envoi
 * cote backend soit fiabilise (le tag fetch /api/contact ne livrait pas
 * les messages a l'equipe). Subject pre-rempli pour faciliter le tri.
 */
export function ContactForm() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6">
      <p className="text-sm leading-relaxed text-muted">
        Envoyez-nous votre demande par email : nous repondons sous 48h
        ouvrees. Pensez a indiquer le contexte (organisateur, prestataire,
        visiteur) et toute information utile pour traiter votre demande.
      </p>
      <a
        href="mailto:hello@agoris.io?subject=Demande%20generale%20Agoris"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Mail className="h-4 w-4" />
        Ecrire a hello@agoris.io
      </a>
    </div>
  );
}
