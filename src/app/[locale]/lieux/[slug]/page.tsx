import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import {
  getAllVenueSlugs,
  getVenueBySlug,
  getSalonsByVenue,
  type VenueGalleryItem,
} from "@/lib/queries";
import { formatNumber, slugifyCity } from "@/lib/format";
import { compileMdxContentSafe } from "@/lib/mdx";
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
  const t = await getTranslations({ locale, namespace: "venues.detail" });

  if (!venue) {
    return { title: t("metaNotFound") };
  }

  // Phase 2 i18n : utiliser les champs _en si disponibles, sinon fallback FR.
  const seoTitle =
    (locale === "en" && venue.seo_title_en ? venue.seo_title_en : null);
  const seoDescription =
    (locale === "en" && venue.seo_description_en ? venue.seo_description_en : null);
  const venueDescription =
    (locale === "en" && venue.description_en ? venue.description_en : null) ??
    venue.description;

  const title =
    seoTitle ??
    (locale === "en"
      ? `Trade Shows at ${venue.name}, ${venue.city}`
      : `Salons à ${venue.name}, ${venue.city}`);
  const description =
    seoDescription ??
    venueDescription ??
    (locale === "en"
      ? `Discover all professional trade shows at ${venue.name} (${venue.city}) on ${siteConfig.name}.`
      : `Découvrez tous les salons professionnels au ${venue.name} (${venue.city}) sur ${siteConfig.name}.`);

  // Un lieu n'est indexable que si la fiche est riche : description >= 80 chars
  // + adresse + surface. Sinon coquille vide : noindex,follow.
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
  const { slug, locale } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) notFound();

  const t = await getTranslations({ locale, namespace: "venues.detail" });

  const salons = await getSalonsByVenue(venue.id);

  // Phase 2 i18n : description et MDX avec fallback FR si la colonne EN est nulle.
  const venueDescription =
    (locale === "en" && venue.description_en ? venue.description_en : null) ??
    venue.description;
  const venueMdx =
    (locale === "en" && venue.editorial_mdx_en ? venue.editorial_mdx_en : null) ??
    venue.editorial_mdx ?? null;

  // V6 — MDX éditorial (description longue, halls, accès, services,
  // actualités) render comme sur les salons.
  const MdxContent = venueMdx
    ? await compileMdxContentSafe(venueMdx, mdxComponents)
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
  if (venueDescription) placeJsonLd.description = venueDescription;
  if (venue.photo_url) placeJsonLd.image = venue.photo_url;
  if (venue.website_url) placeJsonLd.sameAs = [venue.website_url];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={placeJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: t("breadcrumbHome"), item: "/" },
          { name: t("breadcrumbVenues"), item: "/lieux" },
          { name: venue.name, item: `/lieux/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/lieux" className="hover:text-ink transition-colors">
          {t("breadcrumbVenues")}
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
              <span>
                {formatNumber(venue.total_surface_sqm)} m² {t("surfaceLabel")}
              </span>
            </div>
          ) : null}
          {venue.halls_count ? (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>
                {venue.halls_count > 1
                  ? t("hallMany", { count: venue.halls_count })
                  : t("hallOne", { count: venue.halls_count })}
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
              {t("googleMapsLink")}
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
              {t("websiteLink")}
            </VenueOutboundLink>
          )}
        </div>

        {/* Description courte (toujours visible, vient de la DB).
            Phase 2 i18n : affiche description_en si disponible, sinon FR. */}
        {venueDescription && (
          <p className="mt-6 leading-relaxed text-muted">{venueDescription}</p>
        )}

        {/* Maillage : page ville correspondante */}
        {venue.city && (
          <p className="mt-4 text-sm">
            <Link
              href={`/villes/${slugifyCity(venue.city)}`}
              className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
            >
              {t("cityLink", { city: venue.city })}
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

      {/* MDX éditorial (V6) : halls, accès, services, actualités */}
      {MdxContent && (
        <article className="prose-agoris mt-10 max-w-3xl">
          <MdxContent />
        </article>
      )}

      {/* Prochains salons */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          {t("upcomingHeading")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {upcoming.length}{" "}
          {upcoming.length > 1 ? t("upcomingLabelMany") : t("upcomingLabelOne")}
        </p>

        {upcoming.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-muted">{t("upcomingEmpty")}</p>
          </div>
        )}
      </section>

      {/* Salons passes */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            {t("pastHeading")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {past.length}{" "}
            {past.length > 1 ? t("pastLabelMany") : t("pastLabelOne")}
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
