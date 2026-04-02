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
import { formatDateRange } from "@/lib/format";
import { QuoteRequest } from "@/components/quote-request";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  BadgeCheck,
  ExternalLink,
  Radius,
  Map,
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
  };
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const label = PROVIDER_CATEGORY_LABELS[provider.category] ?? provider.category;
  const isPremium = provider.subscription_tier === "premium";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
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
          {provider.coverage_radius_km && (
            <div className="flex items-start gap-3">
              <Radius className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Rayon d&apos;intervention</p>
                <p className="text-sm text-muted">{provider.coverage_radius_km} km</p>
              </div>
            </div>
          )}
          {provider.zone_intervention && (
            <div className="flex items-start gap-3">
              <Map className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Zone d&apos;intervention</p>
                <p className="text-sm text-muted">{provider.zone_intervention}</p>
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

      {/* Lieux couverts */}
      {provider.venues.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Lieux couverts
          </h2>
          <div className="mt-6 grid gap-4">
            {provider.venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/lieux/${venue.slug}`}
                className="flex items-center justify-between rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-medium">{venue.name}</p>
                  {venue.city && (
                    <p className="mt-1 text-sm text-muted">{venue.city}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Salons couverts */}
      {provider.salons.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Salons couverts
          </h2>
          <div className="mt-6 grid gap-4">
            {provider.salons.map((salon) => (
              <Link
                key={salon.id}
                href={`/salons/${salon.slug}`}
                className="flex items-center justify-between rounded-lg border border-border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-medium">{salon.name}</p>
                  {salon.city && (
                    <p className="mt-1 text-sm text-muted">{salon.city}</p>
                  )}
                </div>
                {salon.start_date && (
                  <p className="text-sm text-muted">
                    {formatDateRange(salon.start_date, null)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
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
