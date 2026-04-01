import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getSalonBySlug,
  getAllSalonSlugs,
  getSimilarSalons,
} from "@/lib/queries";
import { formatDateRange, formatNumber } from "@/lib/format";
import { SectorBadge } from "@/components/sector-badge";
import { StatBlock } from "@/components/stat-block";
import { PlaceholderImage } from "@/components/placeholder-image";
import { SalonCard } from "@/components/salon-card";
import {
  MapPin,
  Calendar,
  Globe,
  Building2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG : pre-render toutes les fiches
export async function generateStaticParams() {
  const slugs = await getAllSalonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const salon = await getSalonBySlug(slug);

  if (!salon) {
    return { title: "Salon introuvable" };
  }

  const title = salon.seo_title || `${salon.name} ${salon.edition_year ?? ""}`;
  const description =
    salon.seo_description ||
    `${salon.name} : dates, lieu, exposants et informations pratiques sur ${siteConfig.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(salon.cover_image_url && { images: [salon.cover_image_url] }),
    },
  };
}

// Labels pour la frequence
const frequencyLabels: Record<string, string> = {
  annuel: "Annuel",
  bisannuel: "Bisannuel (tous les 2 ans)",
  ponctuel: "Ponctuel",
};

export default async function SalonPage({ params }: Props) {
  const { slug } = await params;
  const salon = await getSalonBySlug(slug);

  if (!salon) notFound();

  const sectorIds = salon.sectors.map((s) => s.id);
  const similarSalons = await getSimilarSalons(salon.id, sectorIds, 3);

  // Compter les stats affichables (uniquement les verifiables)
  const stats = [
    salon.estimated_exhibitors
      ? { value: salon.estimated_exhibitors, label: "Exposants" }
      : null,
    salon.estimated_visitors
      ? { value: salon.estimated_visitors, label: "Visiteurs" }
      : null,
  ].filter(Boolean) as { value: number; label: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/salons" className="hover:text-ink transition-colors">
          Salons
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{salon.name}</span>
      </nav>

      {/* 1. Header - Le Pitch */}
      <header>
        <div className="flex flex-wrap gap-2">
          {salon.sectors.map((sector) => (
            <SectorBadge
              key={sector.id}
              slug={sector.slug}
              name={sector.name}
            />
          ))}
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {salon.name}
        </h1>

        {/* Meta inline */}
        <div className="mt-4 flex flex-wrap gap-6 text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(salon.start_date, salon.end_date)}</span>
          </div>
          {salon.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {salon.venue}, {salon.city}
              </span>
            </div>
          )}
        </div>

        {/* Tags editoriaux */}
        {salon.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {salon.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 2. Quick Stats */}
      {stats.length > 0 && (
        <section className="mt-10 rounded-lg border border-border bg-white p-8">
          <div className="flex items-center justify-center gap-12">
            {stats.map((stat, i) => (
              <StatBlock key={i} value={stat.value} label={stat.label} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Bloc visuel */}
      <section className="mt-10 overflow-hidden rounded-lg">
        {salon.cover_image_url ? (
          <img
            src={salon.cover_image_url}
            alt={salon.name}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <PlaceholderImage name={salon.name} className="h-64 w-full sm:h-80" />
        )}
      </section>

      {/* 4. Essentiel */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          L&apos;essentiel
        </h2>

        {salon.description && (
          <p className="mt-4 leading-relaxed text-muted">{salon.description}</p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {salon.organizer_name && (
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Organisateur</p>
                <p className="text-sm text-muted">{salon.organizer_name}</p>
              </div>
            </div>
          )}
          {salon.frequency && (
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Fréquence</p>
                <p className="text-sm text-muted">
                  {frequencyLabels[salon.frequency] ?? salon.frequency}
                </p>
              </div>
            </div>
          )}
          {salon.website_url && (
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Site officiel</p>
                <a
                  href={salon.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  Visiter le site
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA Prestataires (placeholder) */}
      <section className="mt-10 rounded-lg border border-accent/20 bg-accent/5 p-8 text-center">
        <h2 className="font-serif text-xl font-bold tracking-tight">
          Organiser mon stand
        </h2>
        <p className="mt-2 text-sm text-muted">
          Trouvez les prestataires recommandés pour ce salon : standistes,
          traiteurs, photographes...
        </p>
        <p className="mt-4 text-sm font-medium text-accent">
          Bientôt disponible
        </p>
      </section>

      {/* 6. Salons similaires */}
      {similarSalons.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Salons similaires
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarSalons.map((s) => (
              <SalonCard key={s.id} salon={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
