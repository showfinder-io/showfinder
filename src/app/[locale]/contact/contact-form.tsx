"use client";

import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

/**
 * Formulaire contact remplacé par un mailto direct le temps que l'envoi
 * côté backend soit fiabilisé (le tag fetch /api/contact ne livrait pas
 * les messages à l'équipe). Subject pré-rempli pour faciliter le tri.
 */
export function ContactForm() {
  const t = useTranslations("contact");

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6">
      <p className="text-sm leading-relaxed text-muted">
        {t("form.body")}
      </p>
      <a
        href={`mailto:hello@agoris.io?subject=${encodeURIComponent(t("form.mailtoSubject"))}`}
        onClick={() => trackEvent("contact_form_submit", { method: "mailto" })}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <Mail className="h-4 w-4" />
        {t("form.cta")}
      </a>
    </div>
  );
}
