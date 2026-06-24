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
    title: t("cookies.meta.title"),
    description: t("cookies.meta.description"),
    robots: { index: true, follow: true },
    alternates: buildAlternates("/cookies", locale),
  };
}

export default async function CookiesPage() {
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        {t("cookies.heading")}
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          {t("cookies.v1Notice")}
        </p>

        <p>
          {t("cookies.intro")}
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("cookies.essentiels.title")}
          </h2>
          <p className="mt-3">
            {t("cookies.essentiels.body")}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Supabase Auth</strong> : {t("cookies.essentiels.supabase")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("cookies.audience.title")}
          </h2>
          <p className="mt-3">
            {t("cookies.audience.body")}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>_ga, _ga_*</strong> : {t("cookies.audience.ga")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("cookies.marketing.title")}
          </h2>
          <p className="mt-3">
            {t("cookies.marketing.body")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            {t("cookies.gestion.title")}
          </h2>
          <p className="mt-3">
            {t("cookies.gestion.p1")}
          </p>
          <p className="mt-3">
            {t("cookies.gestion.contact")}{" "}
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
