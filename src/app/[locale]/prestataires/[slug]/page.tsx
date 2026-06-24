import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getProviderBySlug,
  getAllProviderSlugs,
  PROVIDER_CATEGORY_LABELS,
} from "@/lib/queries";
import { CategoryBadge } from "@/components/category-badge";
import { QuoteRequest } from "@/components/quote-request";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  BadgeCheck,
  ExternalLink,
  Star,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProviderSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: "Prestataire introuvable" };

  const label = PROVIDER_CATEGORY_LABELS[provider.category] ?? provider.category;
  return {
    title: `${provider.company_name} - ${label}`,
    description: provider.description || `${provider.company_name}, ${label} pour salons professionnels sur ${siteConfig.name}.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteConfig.url}/prestataires/${slug}`,
    },
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
  autre: "LocalBusiness",
};

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const label = PROVIDER_CATEGORY_LABELS[provider.category] ?? provider.category;
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
  if (provider.description) providerJsonLd.description = provider.description;
  if (provider.logo_url) providerJsonLd.image = provider.logo_url;
  if (provider.phone) providerJsonLd.telephone = provider.phone;
  if (provider.email) providerJsonLd.email = provider.email;
  if (provider.website_url) providerJsonLd.sameAs = [provider.website_url];
  if (provider.city) {
    providerJsonLd.address = {
      "@type": "PostalAddress",
      addressLocality: provider.city,
      addressCountry: "FR",
    };
  }
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
          Prestataires
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{provider.company_name}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <CategoryBadge category={provider.category} />
          {provider.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <BadgeCheck className="h-3 w-3" />
              Vérifié
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              Premium
            </span>
          )}
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {provider.company_name}
        </h1>
      </header>

      {/* Infos */}
      <section className="mt-8">
        {provider.description && (
          <p className="leading-relaxed text-muted">{provider.description}</p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {provider.city && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Ville</p>
                <p className="text-sm text-muted">{provider.city}</p>
              </div>
            </div>
          )}
          {provider.website_url && (
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Site web</p>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  Visiter le site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
          {provider.email && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Email</p>
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
                <p className="text-sm font-medium">Téléphone</p>
                <a href={`tel:${provider.phone}`} className="text-sm text-accent hover:text-accent-hover transition-colors">
                  {provider.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Demander un devis */}
      <section className="mt-10">
        <QuoteRequest providerId={provider.id} providerName={provider.company_name} />
      </section>

      {/* CTA pour prestataires non-premium */}
      {!isPremium && (
        <section className="mt-12 rounded-lg border border-border bg-paper p-6 text-center">
          <p className="text-sm text-muted">
            Vous êtes ce prestataire ? {" "}
            <Link
              href="/contact"
              className="font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Passez en Premium
            </Link>{" "}
            pour être mis en avant sur les fiches salons.
          </p>
        </section>
      )}
    </div>
  );
}
