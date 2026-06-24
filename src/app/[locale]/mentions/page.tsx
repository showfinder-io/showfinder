import type { Metadata } from "next";
import { SectionTitle } from "@/components/section-title";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("mentions.meta.title"),
    description: t("mentions.meta.description"),
    robots: { index: true, follow: true },
    alternates: buildAlternates("/mentions", locale),
  };
}

export default async function MentionsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        {t("mentions.heading")}
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          {t("mentions.v1Notice")}
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("mentions.editeur.title")}
          </h2>
          <p className="mt-3 whitespace-pre-line">
            {t("mentions.editeur.body")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("mentions.directeur.title")}
          </h2>
          <p className="mt-3">{t("mentions.directeur.body")}</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("mentions.hebergeur.title")}
          </h2>
          <p className="mt-3 whitespace-pre-line">
            {t("mentions.hebergeur.body")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("mentions.propriete.title")}
          </h2>
          <p className="mt-3">
            {t("mentions.propriete.p1")}
          </p>
          <p className="mt-3">
            {t("mentions.propriete.p2")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("mentions.signalement.title")}
          </h2>
          <p className="mt-3">
            {t("mentions.signalement.body")}{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
