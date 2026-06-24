"use client";

import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type ReviewFormProps = {
  targetType: "salon" | "provider";
  targetId: string;
};

/**
 * Le formulaire d'avis est temporairement remplace par un mailto le temps
 * que l'API /api/reviews et le flow de moderation soient fiabilises.
 * On laisse un visuel coherent + un subject pre-rempli qui inclut le type
 * et l'id de la cible (salon ou prestataire) pour faciliter le tri.
 */
export function ReviewForm({ targetType, targetId }: ReviewFormProps) {
  const label = targetType === "salon" ? "ce salon" : "ce prestataire";
  const subject = encodeURIComponent(
    `[Agoris] Avis sur ${targetType}: ${targetId}`
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6">
      <h3 className="font-serif text-lg font-bold">Laisser un avis</h3>
      <p className="text-sm leading-relaxed text-muted">
        Partagez votre experience sur {label} par email : note,
        contexte (exposant, visiteur, organisateur) et commentaire libre.
        Nous publierons l&apos;avis apres moderation.
      </p>
      <a
        href={`mailto:hello@agoris.io?subject=${subject}`}
        onClick={() => trackEvent("review_submit", { target_type: targetType, target_id: targetId })}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Mail className="h-4 w-4" />
        Envoyer mon avis par email
      </a>
    </div>
  );
}
