import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import {
  getProviders,
  getProviderCities,
  PROVIDER_CATEGORY_LABELS,
  type ProviderRow,
} from "@/lib/queries";
import { ProviderCard } from "@/components/provider-card";
import { ProviderSortBar } from "@/components/provider-sort-bar";
import { SectionTitle } from "@/components/section-title";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "providers.listing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription", { siteName: siteConfig.name }),
    robots: { index: false, follow: true },
    alternates: buildAlternates("/prestataires", locale),
  };
}

type Props = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

/**
 * Tri appliqué côté serveur (post-fetch) :
 *  - notoriety (défaut) : ordre natif renvoyé par getProviders (premium → verified → name)
 *  - name     : A-Z par company_name
 *  - category : groupé par catégorie (label localisé), puis A-Z dans chaque
 *  - city     : groupé par ville (nulls last), puis A-Z dans chaque
 */
function sortProviders(
  providers: ProviderRow[],
  sort: string,
  categoryLabels: Record<string, string>
): ProviderRow[] {
  if (sort === "name") {
    return [...providers].sort((a, b) =>
      a.company_name.localeCompare(b.company_name, "fr", {
        sensitivity: "base",
      })
    );
  }
  if (sort === "category") {
    return [...providers].sort((a, b) => {
      const la = categoryLabels[a.category] ?? a.category;
      const lb = categoryLabels[b.category] ?? b.category;
      const cmp = la.localeCompare(lb, "fr", { sensitivity: "base" });
      if (cmp !== 0) return cmp;
      return a.company_name.localeCompare(b.company_name, "fr", {
        sensitivity: "base",
      });
    });
  }
  if (sort === "city") {
    return [...providers].sort((a, b) => {
      // nulls last
      if (!a.city && !b.city) return 0;
      if (!a.city) return 1;
      if (!b.city) return -1;
      const cmp = a.city.localeCompare(b.city, "fr", { sensitivity: "base" });
      if (cmp !== 0) return cmp;
      return a.company_name.localeCompare(b.company_name, "fr", {
        sensitivity: "base",
      });
    });
  }
  return providers; // notoriety default = ordre natif (premium → verified → name)
}

export default async function PrestatairesPage({ params: pageParams, searchParams }: Props) {
  const { locale } = await pageParams;
  const [t, tCat] = await Promise.all([
    getTranslations({ locale, namespace: "providers.listing" }),
    getTranslations({ locale, namespace: "providers.categories" }),
  ]);

  const params = await searchParams;
  const category = params.category ?? "";
  const city = params.city ?? "";
  const sort = params.sort ?? "notoriety";

  // Labels de catégories localisés (Phase 2 i18n) : fallback sur les labels FR
  // statiques si la clé n'est pas traduite.
  const categoryLabels: Record<string, string> = Object.fromEntries(
    Object.keys(PROVIDER_CATEGORY_LABELS).map((key) => [
      key,
      tCat(key as Parameters<typeof tCat>[0], {}) ?? PROVIDER_CATEGORY_LABELS[key],
    ])
  );

  const [providersRaw, cities] = await Promise.all([
    getProviders({ category: category || undefined, city: city || undefined }),
    getProviderCities(),
  ]);

  const providers = sortProviders(providersRaw, sort, categoryLabels);

  const categories = Object.entries(categoryLabels).map(
    ([value, label]) => ({ value, label })
  );

  return (
    <div>
      {/* Header éditorial + listing */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <header className="mb-10 md:mb-14">
          <SectionTitle as="h1" size="xl" eyebrow={t("eyebrow")}>
            {t("heading")}
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-base text-muted">
            <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
              {providers.length}
            </span>{" "}
            {providers.length > 1 ? t("countLabelMany") : t("countLabelOne")}
          </p>
        </header>

        <Suspense>
          <ProviderSortBar
            total={providers.length}
            categories={categories}
            cities={cities}
          />
        </Suspense>

        {providers.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-lg border border-prune/10 bg-ivoire p-12 text-center">
            <p className="font-serif text-xl italic leading-relaxed text-prune/85">
              {t("emptyResult")}
              <br />
              {t("emptyHint")}
              <em className="not-italic text-ocre">.</em>
            </p>
          </div>
        )}
      </div>

      {/* Bannière Prestataires fond Prune en bas — rupture nette pleine largeur */}
      <section className="bg-prune py-[120px]">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8801F]">
            {t("banner.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-0.015em] text-papier md:text-5xl">
            {t("banner.heading")}
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-papier/75">
            {t("banner.description")}
          </p>
          <div className="mt-10 flex flex-col items-start gap-3">
            <Link
              href="/contact"
              className="font-serif italic text-papier transition-colors hover:text-ocre"
              style={{
                fontSize: "18px",
                borderBottom: "1px solid var(--color-ocre)",
                paddingBottom: "2px",
                lineHeight: "1.2",
              }}
            >
              {t("banner.ctaPrimary")}{" "}
              <span className="not-italic" style={{ fontStyle: "normal" }}>
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="text-sm text-papier/55 transition-colors hover:text-papier/85"
            >
              {t("banner.ctaSecondary")} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
