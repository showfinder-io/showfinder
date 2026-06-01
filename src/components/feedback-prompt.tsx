import Link from "next/link";

export function FeedbackPrompt({ salonName }: { salonName?: string }) {
  const subject = salonName
    ? `Correction ou suggestion sur la fiche ${salonName}`
    : "Correction ou suggestion sur une fiche";
  const href = `/contact?sujet=${encodeURIComponent(subject)}`;

  return (
    <aside className="mt-16 rounded-lg border border-ink/10 bg-cream/50 px-5 py-4 text-sm text-ink/70">
      Une information à corriger ou à ajouter sur cette fiche ?{" "}
      <Link
        href={href}
        className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
      >
        Contactez-nous
      </Link>
      , nous mettons à jour rapidement.
    </aside>
  );
}
