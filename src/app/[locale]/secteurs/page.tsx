import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { getSectors } from "@/lib/queries";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sectors.listing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription", { siteName: siteConfig.name }),
    alternates: buildAlternates("/secteurs", locale),
  };
}

export default async function SecteursPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sectors.listing" });
  const sectors = await getSectors();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        {t("heading")}
      </h1>
      <p className="mt-2 text-muted">
        {sectors.length > 1
          ? t("countMany", { count: sectors.length })
          : t("countOne", { count: sectors.length })}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector) => {
          // Phase 2 i18n : affiche le contenu _en si dispo en locale EN, sinon FR.
          const sectorName =
            (locale === "en" && sector.name_en ? sector.name_en : null) ??
            sector.name;
          const sectorDescription =
            (locale === "en" && sector.description_en
              ? sector.description_en
              : null) ?? sector.description;
          return (
          <Link
            key={sector.id}
            href={`/secteurs/${sector.slug}`}
            className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-bold tracking-tight group-hover:text-accent transition-colors">
              {sectorName}
            </h2>
            {sectorDescription && (
              <p className="mt-2 text-sm text-muted line-clamp-3">
                {sectorDescription}
              </p>
            )}
            <span className="mt-4 inline-flex items-center text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
              {t("seeShows")} &rarr;
            </span>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
