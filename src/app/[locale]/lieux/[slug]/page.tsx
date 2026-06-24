import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getAllVenueSlugs,
  getVenueBySlug,
  getSalonsByVenue,
  type VenueGalleryItem,
} from "@/lib/queries";
import { formatNumber, slugifyCity } from "@/lib/format";
import { compileMdxContent } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx-components";
import { SalonCard } from "@/components/salon-card";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { VenueOutboundLink } from "@/components/venue-outbound-link";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import {
  MapPin,
  ExternalLink,
  Maximize2,
  Globe,
  Building2,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

// SSG : pre-render toutes les pages venue
export async function generateStaticParams() {
  const slugs = await getAllVenueSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) {
    return { title: "Lieu introuvable" };
  }

  const title = `Salons à ${venue.name}, ${venue.city}`;
  const description =
    venue.description ||
    `Découvrez tous les salons professionnels au ${venue.name} (${venue.city}) sur ${siteConfig.name}.`;

  // Un lieu n'est indexable que si la fiche est riche : description ≥ 80 chars
  // + adresse + surface. Sinon coquille vide → noindex,follow.
  const descLen = (venue.description ?? "").trim().length;
  const hasAddress = ((venue.address ?? "").trim().length) > 0;
  const hasSurface = (venue.total_surface_sqm ?? 0) > 0;
  const isRich = descLen >= 80 && hasAddress && hasSurface;

  return {
    title,
    description,
    robots: isRich
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: buildAlternates(`/lieux/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) notFound();

  const salons = await getSalonsByVenue(venue.id);

  // V6 — MDX éditorial (description longue, halls, accès, services,
  // actualités) render comme sur les salons.
  const MdxContent = venue.editorial_mdx
    ? await compileMdxContent(venue.editorial_mdx, mdxComponents)
    : null;

  const gallery: VenueGalleryItem[] = Array.isArray(venue.gallery)
    ? venue.gallery
    : [];

  // Separer salons a venir / passes
  const today = new Date().toISOString().split("T")[0];
  const upcoming = salons.filter(
    (s) => !s.start_date || s.start_date >= today
  );
  const past = salons.filter((s) => s.start_date && s.start_date < today);

  // Schema.org Place : lieu d'exposition. On enrichit avec PostalAddress et
  // GeoCoordinates uniquement si on a les données — pas de fabrication.
  const placeJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: venue.name,
    url: `${siteConfig.url}/lieux/${slug}`,
    address: {
      "@type": "PostalAddress",
      ...(venue.address ? { streetAddress: venue.address } : {}),
      addressLocality: venue.city,
      ...(venue.postal_code ? { postalCode: venue.postal_code } : {}),
      addressCountry: venue.country,
    },
  };
  if (venue.lat != null && venue.lng != null) {
    placeJsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lng,
    };
  }
  if (venue.description) placeJsonLd.description = venue.description;
  if (venue.photo_url) placeJsonLd.image = venue.photo_url;
  if (venue.website_url) placeJsonLd.sameAs = [venue.website_url];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={placeJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Lieux", item: "/lieux" },
          { name: venue.name, item: `/lieux/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/lieux" className="hover:text-ink transition-colors">
          Lieux
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{venue.name}</span>
      </nav>

      {/* Header + description + MDX : contraints en max-w-3xl pour lisibilité
            (cohérence avec le rendu prose éditorial en dessous). La grille
            salons en bas garde toute la largeur du container max-w-6xl. */}
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {venue.name}
        </h1>

        {/* Infos lieu */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{venue.address ? `${venue.address}` : venue.city}</span>
          </div>
          {venue.total_surface_sqm ? (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4" />
              <span>{formatNumber(venue.total_surface_sqm)} m² de surface</span>
            </div>
          ) : null}
          {venue.halls_count ? (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>
                {venue.halls_count} hall{venue.halls_count > 1 ? "s" : ""}
              </span>
            </div>
          ) : null}
        </div>

        {/* Liens externes */}
        <div className="mt-4 flex flex-wrap gap-4">
          {venue.google_maps_url && (
            <VenueOutboundLink
              slug={slug}
              destination="google_maps"
              href={venue.google_maps_url}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Voir sur Google Maps
            </VenueOutboundLink>
          )}
          {venue.website_url && (
            <VenueOutboundLink
              slug={slug}
              destination="website"
              href={venue.website_url}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <Globe className="h-4 w-4" />
              Site officiel
            </VenueOutboundLink>
          )}
        </div>

        {/* Description courte (toujours visible, vient de la DB) */}
        {venue.description && (
          <p className="mt-6 leading-relaxed text-muted">{venue.description}</p>
        )}

        {/* Maillage : page ville correspondante */}
        {venue.city && (
          <p className="mt-4 text-sm">
            <Link
              href={`/villes/${slugifyCity(venue.city)}`}
              className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
            >
              Tous les salons à {venue.city}
            </Link>
          </p>
        )}
      </div>

      {/* Galerie photos (V6) */}
      {gallery.length > 0 && (
        <section className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-lg border border-border bg-sable"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption ?? venue.name}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                {img.caption && (
                  <figcaption className="px-3 py-2 text-xs text-muted">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* MDX éditorial (V6) : halls, accès, services, actualités… */}
      {MdxContent && (
        <article className="prose-agoris mt-10 max-w-3xl">
          <MdxContent />
        </article>
      )}

      {/* Prochains salons */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Prochains salons
        </h2>
        <p className="mt-1 text-sm text-muted">
          {upcoming.length} salon{upcoming.length > 1 ? "s" : ""} à venir
        </p>

        {upcoming.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-muted">
              Aucun salon à venir dans ce lieu pour le moment.
            </p>
          </div>
        )}
      </section>

      {/* Salons passes */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Salons passés
          </h2>
          <p className="mt-1 text-sm text-muted">
            {past.length} salon{past.length > 1 ? "s" : ""} passé
            {past.length > 1 ? "s" : ""}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
