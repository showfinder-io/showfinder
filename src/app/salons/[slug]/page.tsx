import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getSalonBySlug,
  getAllSalonSlugs,
  getSimilarSalons,
  SALON_CATEGORY_LABELS,
} from "@/lib/queries";
import { formatDateRange } from "@/lib/format";
import { SectorBadge } from "@/components/sector-badge";
import { StatBlock } from "@/components/stat-block";
import { SalonCard } from "@/components/salon-card";
import { ProviderDrawer } from "@/components/provider-drawer";
import { ReportError } from "@/components/report-error";
import { AlertSubscribe } from "@/components/alert-subscribe";
import { ReviewList } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { AgorisCertifiedBadge } from "@/components/agoris-certified-badge";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
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

  // Fiches sans description editoriale : noindex,follow le temps que la
  // pipeline editoriale Nicolas remplisse le champ. Eviter d'envoyer du
  // contenu pauvre dans l'index Google (signal de qualite negatif).
  // Coherent avec methodologie.mdx : "si la donnee n'existe pas, elle ne
  // s'affiche pas" applique aussi a "elle n'est pas indexee".
  const hasDescription =
    typeof salon.description === "string" && salon.description.trim().length > 0;

  return {
    title,
    description,
    robots: hasDescription
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: `${siteConfig.url}/salons/${slug}`,
    },
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

/** Extrait une phrase d'accroche de 140-180 chars max depuis la description. */
function pitchFrom(description: string | null): string | null {
  if (!description) return null;
  const trimmed = description.trim();
  // Tente de couper sur la 1re ponctuation forte si la phrase est courte
  const firstSentence = trimmed.split(/[.!?]\s+/)[0];
  const candidate = firstSentence && firstSentence.length <= 200 ? firstSentence : trimmed;
  return candidate.length > 180 ? candidate.slice(0, 177).trim() + "..." : candidate;
}

export default async function SalonPage({ params }: Props) {
  const { slug } = await params;
  const salon = await getSalonBySlug(slug);

  if (!salon) notFound();

  const sectorIds = salon.sectors.map((s) => s.id);
  const similarSalons = await getSimilarSalons(salon.id, sectorIds, 3);

  // Quick Stats : uniquement les chiffres vérifiables. Pas de placeholder.
  const stats = [
    salon.estimated_exhibitors
      ? { value: salon.estimated_exhibitors, label: "Exposants" }
      : null,
    salon.estimated_visitors
      ? { value: salon.estimated_visitors, label: "Visiteurs" }
      : null,
  ].filter(Boolean) as { value: number; label: string }[];

  const pitch = pitchFrom(salon.description);
  const certified = salon.is_agoris_certified === true;

  // Schema.org Event
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: salon.name,
    description: salon.description,
    startDate: salon.start_date,
    endDate: salon.end_date,
    location: {
      "@type": "Place",
      name: salon.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: salon.city,
        addressCountry: salon.country,
      },
    },
    organizer: salon.organizer_name
      ? { "@type": "Organization", name: salon.organizer_name }
      : undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: salon.website_url,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-16">
      <JsonLd data={eventJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Salons", item: "/salons" },
          { name: salon.name, item: `/salons/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-muted">
        <Link href="/salons" className="hover:text-prune transition-colors">
          Salons
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{salon.name}</span>
      </nav>

      {/* 1. HEADER — Le Pitch */}
      <header>
        {/* Tags : catégorie + secteurs + certified */}
        <div className="flex flex-wrap items-center gap-2">
          {salon.category && (
            <span className="inline-block rounded-full border border-border bg-ivoire px-3 py-1 text-xs font-medium uppercase tracking-wider text-prune">
              {SALON_CATEGORY_LABELS[salon.category]}
            </span>
          )}
          {salon.sectors.map((sector) => (
            <SectorBadge
              key={sector.id}
              slug={sector.slug}
              name={sector.name}
            />
          ))}
          {certified && <AgorisCertifiedBadge size="md" />}
        </div>

        {/* Titre + logo */}
        <div className="mt-6 flex items-start gap-4">
          {salon.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={salon.logo_url}
              alt=""
              className="h-12 w-12 shrink-0 rounded"
            />
          )}
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-prune sm:text-5xl">
            {salon.name}
            {salon.edition_year && (
              <span className="text-muted"> · {salon.edition_year}</span>
            )}
          </h1>
        </div>

        {/* Pitch éditorial (1re phrase de description) */}
        {pitch && (
          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-prune/90">
            {pitch}
          </p>
        )}

        {/* Meta : dates + lieu */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{formatDateRange(salon.start_date, salon.end_date)}</span>
          </div>
          {salon.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>
                {salon.venue}
                {salon.city ? `, ${salon.city}` : ""}
              </span>
            </div>
          )}
        </div>

        {/* Tags editoriaux (curation Agoris) */}
        {salon.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {salon.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-prune/15 bg-ivoire px-3 py-1 text-xs font-medium text-prune"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Alerte dates : visible uniquement si non confirmées */}
      {salon.dates_confirmed === false && (
        <div className="mt-8">
          <AlertSubscribe type="salon" slug={slug} label={salon.name} />
        </div>
      )}

      {/* 2. QUICK STATS — fond Sable, chiffres Fraunces */}
      {stats.length > 0 && (
        <section className="mt-12 rounded-lg border border-border bg-sable p-8 md:p-10">
          <div className="grid grid-cols-2 gap-8 md:flex md:items-center md:justify-around md:gap-12">
            {stats.map((stat, i) => (
              <StatBlock key={i} value={stat.value} label={stat.label} />
            ))}
          </div>
        </section>
      )}

      {/* 3. BLOC VISUEL — cover ou PhotoPlaceholder 16:9 (en attendant les photos d'ambiance) */}
      <section className="mt-12 overflow-hidden rounded-lg border border-border">
        {salon.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={salon.cover_image_url}
            alt={`${salon.name} - vue du salon`}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <PhotoPlaceholder ratio="16/9" label="salon prof." variant="sable" />
        )}
      </section>

      {/* 4. ESSENTIEL */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
          L&apos;essentiel
        </h2>

        {salon.description && (
          <p className="mt-5 leading-relaxed text-prune/85">
            {salon.description}
          </p>
        )}

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {salon.organizer_name && (
            <Detail icon={<Building2 className="h-4 w-4" />} label="Organisateur">
              {salon.organizer_name}
            </Detail>
          )}
          {salon.frequency && (
            <Detail icon={<RotateCcw className="h-4 w-4" />} label="Fréquence">
              {frequencyLabels[salon.frequency] ?? salon.frequency}
            </Detail>
          )}
          {salon.website_url && (
            <Detail icon={<Globe className="h-4 w-4" />} label="Site officiel">
              <a
                href={salon.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
              >
                Visiter le site
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </Detail>
          )}
        </dl>
      </section>

      {/* 5. DRAWER PRESTATAIRES — point de monétisation */}
      <ProviderDrawer salonId={salon.id} salonName={salon.name} />

      {/* 6. AVIS certifiés */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
          Avis certifiés
        </h2>
        <div className="mt-6">
          <ReviewList targetType="salon" targetId={salon.id} />
        </div>
        <div className="mt-8">
          <ReviewForm targetType="salon" targetId={salon.id} />
        </div>
      </section>

      {/* Signaler une erreur (rendu via composant) */}
      <ReportError salonSlug={slug} />

      {/* 7. SALONS SIMILAIRES */}
      {similarSalons.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
            Salons similaires
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarSalons.map((s) => (
              <SalonCard key={s.id} salon={s} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
        <dd className="mt-1 text-sm text-prune">{children}</dd>
      </div>
    </div>
  );
}
