import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import { getSalons, getSectors } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";
import { SectionTitle } from "@/components/section-title";
import { Hero } from "@/components/hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates("/", locale),
  };
}

export default async function Home() {
  const [
    { salons: upcomingSalons },
    { total: totalPublished },
    sectors,
    t,
  ] = await Promise.all([
    getSalons({ pageSize: 6, sort: "date", upcoming: true }),
    getSalons({ pageSize: 1, sort: "date" }),
    getSectors(),
    getTranslations("home"),
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.description,
  };
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/salons?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={webSiteJsonLd} />
      <Hero totalSalons={totalPublished} />

      <section className="border-b border-border bg-sable py-22 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow={t("upcoming.eyebrow")} size="xl">
              {t("upcoming.title")}
            </SectionTitle>
            <Link
              href="/salons"
              className="font-serif italic text-prune transition-colors hover:text-[var(--color-warning)]"
              style={{
                fontSize: "18px",
                borderBottom: "1px solid var(--color-ocre)",
                paddingBottom: "2px",
                lineHeight: "1.2",
              }}
            >
              {/* On décompose le CTA pour préserver le rendu Fraunces ocre sur le chiffre */}
              {t("upcoming.seeAll").split("{count}")[0]}
              <span
                className="not-italic font-serif text-ocre"
                style={{ fontStyle: "normal" }}
              >
                {totalPublished}
              </span>
              {t("upcoming.seeAll").split("{count}")[1]}
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-sable py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14">
          <SectionTitle eyebrow={t("sectors.eyebrow")} size="lg">
            {t("sectors.title")}
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-base text-muted">
            {t("sectors.description")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <SectorBadge
                key={sector.id}
                slug={sector.slug}
                name={sector.name}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-prune py-[120px]">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle eyebrow={t("why.eyebrow")} size="xl" variant="on-prune">
            {t("why.title")}
          </SectionTitle>
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            <Argument
              number="01"
              title={t("why.arg1Title")}
              body={t("why.arg1Body")}
            />
            <Argument
              number="02"
              title={t("why.arg2Title")}
              body={t("why.arg2Body")}
            />
            <Argument
              number="03"
              title={t("why.arg3Title")}
              body={t("why.arg3Body")}
            />
          </ol>
        </div>
      </section>
    </div>
  );
}

function Argument({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex flex-col">
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-ocre">
        {number}
        <span aria-hidden="true">.</span>
      </span>
      <h3 className="mt-4 font-serif text-[28px] font-normal leading-tight tracking-[-0.015em] text-papier">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-papier/75">{body}</p>
    </li>
  );
}
