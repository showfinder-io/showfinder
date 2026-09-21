import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import {
  getProviderBySlug,
  getAllProviderSlugs,
  getSalonsByProvider,
  PROVIDER_CATEGORY_LABELS,
} from "@/lib/queries";
import {
  getAllProviderHubs,
  getHubsForProvider,
  getProviderHubBySlug,
  getProvidersForHub,
  isHubIndexable,
} from "@/lib/provider-hubs";
import { ProviderHubView, hubField } from "@/components/provider-hub-view";
import { CategoryBadge } from "@/components/category-badge";
import { QuoteRequest } from "@/components/quote-request";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  BadgeCheck,
  ExternalLink,
  Star,
  Map as MapIcon,
  CalendarDays,
  Users,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

export async function generateStaticParams() {
  // Fiches prestataires et pages hub métier x zone partagent /prestataires/[slug]
  const [slugs, hubs] = await Promise.all([getAllProviderSlugs(), getAllProviderHubs()]);
  return [...hubs.map((h) => h.slug), ...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const [t, tCat] = await Promise.all([
    getTranslations({ locale, namespace: "providers.detail" }),
    getTranslations({ locale, namespace: "providers.categories" }),
  ]);
  const hub = await getProviderHubBySlug(slug);
  if (hub) {
    const hubProviders = await getProvidersForHub(hub);
    return {
      title: hubField(hub, "seo_title", locale),
      description: hubField(hub, "seo_description", locale),
      robots: isHubIndexable(hub, hubProviders.length) ? { index: true, follow: true } : { index: false, follow: true },
      alternates: buildAlternates(`/prestataires/${slug}`, locale),
    };
  }

  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: t("metaNotFound") };

  // Phase 2 i18n : label de catégorie localisé avec fallback FR.
  const label =
    tCat(provider.category as Parameters<typeof tCat>[0], {}) ??
    PROVIDER_CATEGORY_LABELS[provider.category] ??
    provider.category;
  // Phase 2 i18n : description traduite si dispo en EN, sinon FR.
  const description =
    (locale === "en" && provider.description_en
      ? provider.description_en
      : null) ?? provider.description;
  return {
    title: `${provider.company_name} - ${label}`,
    description: description || t("metaDescriptionFallback", { companyName: provider.company_name, label, siteName: siteConfig.name }),
    // Indexable uniquement si le flag est posé (lot test puis élargissement selon GSC),
    // cf. migration 20260921100000. Le reste demeure en noindex,follow (audit du 2026-06-01).
    robots: provider.seo_indexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: buildAlternates(`/prestataires/${slug}`, locale),
  };
}

// Map des catégories Agoris vers les sous-types Schema.org.
// Tomber sur `LocalBusiness` générique si pas de sous-type plus précis.
const PROVIDER_SCHEMA_TYPE: Record<string, string> = {
  traiteur: "FoodEstablishment",
  hebergement: "LodgingBusiness",
  photographe: "LocalBusiness",
  transport: "LocalBusiness",
  av_technique: "LocalBusiness",
  standiste: "LocalBusiness",
  location_mobilier: "LocalBusiness",
  autre: "LocalBusiness",
};

export default async function ProviderPage({ params }: Props) {
  const { slug, locale } = await params;
  const [t, tCat] = await Promise.all([
    getTranslations({ locale, namespace: "providers.detail" }),
    getTranslations({ locale, namespace: "providers.categories" }),
  ]);
  const hub = await getProviderHubBySlug(slug);
  if (hub) {
    const [hubProviders, allHubs] = await Promise.all([getProvidersForHub(hub), getAllProviderHubs()]);
    return (
      <ProviderHubView
        hub={hub}
        providers={hubProviders}
        otherHubs={allHubs.filter((h) => h.slug !== hub.slug)}
        locale={locale}
      />
    );
  }

  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const [salons, hubs] = await Promise.all([
    getSalonsByProvider(provider.id),
    getHubsForProvider(provider.category, provider.department ?? null),
  ]);
  const specialties = provider.specialties ?? [];
  const memberships = provider.memberships ?? [];

  // Phase 2 i18n : description traduite si dispo en EN, sinon FR.
  const description =
    (locale === "en" && provider.description_en
      ? provider.description_en
      : null) ?? provider.description;

  // Phase 2 i18n : label de catégorie localisé avec fallback FR.
  const label =
    tCat(provider.category as Parameters<typeof tCat>[0], {}) ??
    PROVIDER_CATEGORY_LABELS[provider.category] ??
    provider.category;
  const isPremium = provider.subscription_tier === "premium";

  // Schema.org LocalBusiness (ou sous-type plus précis selon la catégorie).
  // Champs renseignés uniquement si la donnée existe — pas de fabrication.
  const schemaType =
    PROVIDER_SCHEMA_TYPE[provider.category] ?? "LocalBusiness";
  const providerJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: provider.company_name,
    url: `${siteConfig.url}/prestataires/${slug}`,
  };
  if (description) providerJsonLd.description = description;
  if (provider.logo_url) providerJsonLd.image = provider.logo_url;
  if (provider.phone) providerJsonLd.telephone = provider.phone;
  if (provider.email) providerJsonLd.email = provider.email;
  if (provider.website_url) providerJsonLd.sameAs = [provider.website_url];
  if (provider.city) {
    providerJsonLd.address = {
      "@type": "PostalAddress",
      addressLocality: provider.city,
      ...(provider.postal_code ? { postalCode: provider.postal_code } : {}),
      addressCountry: "FR",
    };
  }
  if (provider.founded_year) providerJsonLd.foundingDate = String(provider.founded_year);
  if (specialties.length > 0) providerJsonLd.knowsAbout = specialties;
  if (provider.zone_intervention) providerJsonLd.areaServed = provider.zone_intervention;
  if (provider.review_count > 0 && provider.avg_rating > 0) {
    providerJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: provider.avg_rating,
      reviewCount: provider.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={providerJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Prestataires", item: "/prestataires" },
          { name: provider.company_name, item: `/prestataires/${slug}` },
        ]}
      />

      {/* Barre d'accent premium */}
      {isPremium && (
        <div className="mb-6 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300" />
      )}

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/prestataires" className="hover:text-ink transition-colors">
          {t("breadcrumbProviders")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{provider.company_name}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <CategoryBadge category={provider.category} label={label} />
          {provider.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <BadgeCheck className="h-3 w-3" />
              {t("badgeVerified")}
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {t("badgePremium")}
            </span>
          )}
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {provider.company_name}
        </h1>
      </header>

      {/* Infos */}
      <section className="mt-8">
        {description &&
          description.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className={`leading-relaxed text-muted ${i > 0 ? "mt-4" : ""}`}>
              {paragraph}
            </p>
          ))}

        {specialties.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("fieldSpecialties")}>
            {specialties.map((specialty) => (
              <li key={specialty} className="rounded-full border border-prune/20 px-3 py-1 text-xs text-prune">
                {specialty}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {provider.city && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldCity")}</p>
                <p className="text-sm text-muted">{provider.city}</p>
              </div>
            </div>
          )}
          {provider.zone_intervention && (
            <div className="flex items-start gap-3">
              <MapIcon className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldZone")}</p>
                <p className="text-sm text-muted">{provider.zone_intervention}</p>
              </div>
            </div>
          )}
          {provider.founded_year && (
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldFounded")}</p>
                <p className="text-sm text-muted">{provider.founded_year}</p>
              </div>
            </div>
          )}
          {memberships.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldMemberships")}</p>
                <p className="text-sm text-muted">
                  {memberships.map((m) => t(`memberships.${m}` as Parameters<typeof t>[0])).join(", ")}
                </p>
              </div>
            </div>
          )}
          {provider.website_url && (
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldWebsite")}</p>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  {t("fieldWebsiteVisit")} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
          {provider.email && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldEmail")}</p>
                <a href={`mailto:${provider.email}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                  {provider.email}
                </a>
              </div>
            </div>
          )}
          {provider.phone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">{t("fieldPhone")}</p>
                <a href={`tel:${provider.phone}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                  {provider.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Maillage : salons rattachés et pages hub du métier */}
      {(salons.length > 0 || hubs.length > 0) && (
        <section className="mt-10 grid gap-8 sm:grid-cols-2">
          {salons.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-prune">{t("salonsHeading")}</h2>
              <ul className="mt-3 space-y-2">
                {salons.map((salon) => (
                  <li key={salon.slug}>
                    <Link href={`/salons/${salon.slug}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                      {salon.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hubs.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-prune">{t("hubsHeading")}</h2>
              <ul className="mt-3 space-y-2">
                {hubs.map((h) => (
                  <li key={h.slug}>
                    <Link href={`/prestataires/${h.slug}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                      {hubField(h, "h1", locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Demander un devis */}
      <section className="mt-10">
        <QuoteRequest providerId={provider.id} providerName={provider.company_name} />
      </section>

      {/* CTA pour prestataires non-premium */}
      {!isPremium && (
        <section className="mt-12 rounded-lg border border-border bg-paper p-6 text-center">
          <p className="text-sm text-muted">
            {t("ctaNotPremium")}{" "}
            <Link
              href="/contact"
              className="font-medium text-accent hover:text-accent-hover transition-colors"
            >
              {t("ctaNotPremiumLink")}
            </Link>{" "}
            {t("ctaNotPremiumSuffix")}
          </p>
        </section>
      )}
    </div>
  );
}
