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
    title: t("confidentialite.meta.title"),
    description: t("confidentialite.meta.description"),
    robots: { index: true, follow: true },
    alternates: buildAlternates("/confidentialite", locale),
  };
}

export default async function ConfidentialitePage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        {t("confidentialite.heading")}
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          {t("confidentialite.v1Notice")}
        </p>

        <p>
          {t("confidentialite.intro")}
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.responsable.title")}
          </h2>
          <p className="mt-3">
            {t("confidentialite.responsable.body")}{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.donnees.title")}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("confidentialite.donnees.item1")}</li>
            <li>{t("confidentialite.donnees.item2")}</li>
            <li>{t("confidentialite.donnees.item3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.finalites.title")}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("confidentialite.finalites.item1")}</li>
            <li>{t("confidentialite.finalites.item2")}</li>
            <li>{t("confidentialite.finalites.item3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.baseLegale.title")}
          </h2>
          <p className="mt-3">
            {t("confidentialite.baseLegale.body")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.conservation.title")}
          </h2>
          <p className="mt-3">
            {t("confidentialite.conservation.body")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.droits.title")}
          </h2>
          <p className="mt-3">{t("confidentialite.droits.intro")}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("confidentialite.droits.item1")}</li>
            <li>{t("confidentialite.droits.item2")}</li>
            <li>{t("confidentialite.droits.item3")}</li>
            <li>{t("confidentialite.droits.item4")}</li>
            <li>{t("confidentialite.droits.item5")}</li>
            <li>{t("confidentialite.droits.item6")}</li>
          </ul>
          <p className="mt-3">
            {t("confidentialite.droits.contact")}{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            . {t("confidentialite.droits.cnil")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("confidentialite.partage.title")}
          </h2>
          <p className="mt-3">
            {t("confidentialite.partage.body")}
          </p>
        </section>
      </div>
    </div>
  );
}
