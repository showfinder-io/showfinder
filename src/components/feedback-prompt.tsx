import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function FeedbackPrompt({ salonName }: { salonName?: string }) {
  const t = await getTranslations("common.feedbackPrompt");
  const subject = salonName
    ? t("subjectSalon", { salonName })
    : t("subjectGeneric");
  const href = `/contact?sujet=${encodeURIComponent(subject)}`;

  return (
    <aside className="mt-16 rounded-lg border border-ink/10 bg-cream/50 px-5 py-4 text-sm text-ink/70">
      {t("text")}{" "}
      <Link
        href={href}
        className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
      >
        {t("linkLabel")}
      </Link>
      {t("suffix")}
    </aside>
  );
}
