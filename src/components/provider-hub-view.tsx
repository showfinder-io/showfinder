import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { compileMdxContentSafe } from "@/lib/mdx";
import { formatEditorialMonthLocale } from "@/lib/sector-content";
import type { ProviderHubRow } from "@/lib/provider-hubs";
import type { ProviderRow } from "@/lib/queries";
import { ProviderCard } from "@/components/provider-card";
import { SectionTitle } from "@/components/section-title";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";

type ProviderHubViewProps = {
  hub: ProviderHubRow;
  providers: ProviderRow[];
  otherHubs: ProviderHubRow[];
  locale: string;
};

/** Champ localisé d'un hub : version EN si présente, sinon FR. */
export function hubField(hub: ProviderHubRow, field: "h1" | "seo_title" | "seo_description" | "zone_label", locale: string): string {
  const en = hub[`${field}_en` as const];
  return (locale === "en" && en ? en : hub[field]) ?? "";
}

/**
 * Page hub métier x zone. L'intention de recherche est annuaire ("standiste paris") :
 * la liste passe avant le contenu éditorial, qui reste sur la page sous la liste.
 */
export async function ProviderHubView({ hub, providers, otherHubs, locale }: ProviderHubViewProps) {
  const t = await getTranslations({ locale, namespace: "providers.hub" });
  const mdx = (locale === "en" && hub.editorial_mdx_en ? hub.editorial_mdx_en : null) ?? hub.editorial_mdx;
  const Content = mdx ? await compileMdxContentSafe(mdx) : null;
  const h1 = hubField(hub, "h1", locale);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    numberOfItems: providers.length,
    itemListElement: providers.map((provider, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: provider.company_name,
      url: `${siteConfig.url}/prestataires/${provider.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {providers.length > 0 && <JsonLd data={itemListJsonLd} />}
      <BreadcrumbJsonLd
        items={[
          { name: t("breadcrumbHome"), item: "/" },
          { name: t("breadcrumbProviders"), item: "/prestataires" },
          { name: h1, item: `/prestataires/${hub.slug}` },
        ]}
      />

      <nav className="mb-10 text-sm text-muted">
        <Link href="/prestataires" className="hover:text-prune transition-colors">
          {t("breadcrumbProviders")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{h1}</span>
      </nav>

      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow={t("eyebrow")}>
          {h1}
        </SectionTitle>
        <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
          {hubField(hub, "seo_description", locale)}
        </p>
        {Content && hub.editorial_updated_at && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {t("editorialUpdate", { date: formatEditorialMonthLocale(hub.editorial_updated_at, locale) })}
          </p>
        )}
      </header>

      <section id="prestataires" className="mt-14 scroll-mt-8">
        <p className="text-sm text-muted">
          <span className="font-serif text-[22px] font-normal text-prune tabular-nums">{providers.length}</span>{" "}
          {providers.length > 1 ? t("countLabelMany") : t("countLabelOne")}
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {Content && (
        <article className="prose-agoris mt-20 max-w-3xl">
          <Content />
        </article>
      )}

      {otherHubs.length > 0 && (
        <section className="mt-20">
          <SectionTitle as="h2" size="lg">
            {t("otherHubsHeading")}
          </SectionTitle>
          <ul className="mt-6 flex flex-wrap gap-3">
            {otherHubs.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/prestataires/${other.slug}`}
                  className="inline-block rounded-full border border-prune px-4 py-2 text-sm text-prune transition-colors hover:bg-prune/5"
                >
                  {hubField(other, "h1", locale)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
