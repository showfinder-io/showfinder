import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getAllVenueSlugs,
  getVenueBySlug,
  getSalonsByVenue,
} from "@/lib/queries";
import { formatNumber } from "@/lib/format";
import { SalonCard } from "@/components/salon-card";
import { MapPin, ExternalLink, Maximize2, Globe } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG : pre-render toutes les pages venue
export async function generateStaticParams() {
  const slugs = await getAllVenueSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) {
    return { title: "Lieu introuvable" };
  }

  const title = `Salons à ${venue.name} — ${venue.city}`;
  const description =
    venue.description ||
    `Découvrez tous les salons professionnels au ${venue.name} (${venue.city}) sur ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/lieux/${slug}`,
    },
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

  // Separer salons a venir / passes
  const today = new Date().toISOString().split("T")[0];
  const upcoming = salons.filter(
    (s) => !s.start_date || s.start_date >= today
  );
  const past = salons.filter((s) => s.start_date && s.start_date < today);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/lieux" className="hover:text-ink transition-colors">
          Lieux
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{venue.name}</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        {venue.name}
      </h1>

      {/* Infos lieu */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>
            {venue.address ? `${venue.address}` : venue.city}
          </span>
        </div>
        {venue.total_surface_sqm && (
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4" />
            <span>{formatNumber(venue.total_surface_sqm)} m² de surface</span>
          </div>
        )}
      </div>

      {/* Liens externes */}
      <div className="mt-4 flex flex-wrap gap-4">
        {venue.google_maps_url && (
          <a
            href={venue.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Voir sur Google Maps
          </a>
        )}
        {venue.website_url && (
          <a
            href={venue.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Globe className="h-4 w-4" />
            Site officiel
          </a>
        )}
      </div>

      {/* Description */}
      {venue.description && (
        <p className="mt-6 leading-relaxed text-muted">{venue.description}</p>
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
