import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import {
  getSalonBySlug,
  getAllSalonSlugs,
  getSimilarSalons,
  SALON_CATEGORY_LABELS,
} from "@/lib/queries";
import { formatDateRange, slugifyCity } from "@/lib/format";
import { SalonActionsBar } from "@/components/salon-actions-bar";
import { SectorBadge } from "@/components/sector-badge";
import { StatBlock } from "@/components/stat-block";
import { SalonCard } from "@/components/salon-card";
import { ProviderDrawer } from "@/components/provider-drawer";
import { AlertSubscribe } from "@/components/alert-subscribe";
import { ReviewList } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { AgorisCertifiedBadge } from "@/components/agoris-certified-badge";
import { SalonOutboundLink } from "@/components/salon-outbound-link";
import { getSalonContent } from "@/lib/salon-content";
import { formatEditorialMonth } from "@/lib/sector-content";
import { compileMdxContent } from "@/lib/mdx";
import { salonMdxComponents } from "@/components/mdx/salon-mdx-components";
import { FeedbackPrompt } from "@/components/feedback-prompt";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import {
  MapPin,
  Calendar,
  Globe,
  Building2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

// SSG : pre-render toutes les fiches
export async function generateStaticParams() {
  const slugs = await getAllSalonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const salon = await getSalonBySlug(slug);
  const t = await getTranslations({ locale, namespace: "salon-detail" });

  if (!salon) {
    return { title: t("meta.notFound") };
  }

  const title = salon.seo_title || `${salon.name} ${salon.edition_year ?? ""}`;
  const description =
    salon.seo_description ||
    t("meta.descriptionFallback", { name: salon.name, siteName: siteConfig.name });

  // Une fiche n'est indexable que si elle a un MDX éditorial dans
  // content/salons/[slug].mdx. La description en DB ne suffit pas : trop
  // courte pour faire un contenu de qualité Google.
  const hasEditorialMdx = (await getSalonContent(slug)) !== null;

  return {
    title,
    description,
    robots: hasEditorialMdx
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: buildAlternates(`/salons/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: "website",
      ...(salon.cover_image_url && { images: [salon.cover_image_url] }),
    },
  };
}

// Clés de fréquence -> clé de traduction (dans salon-detail.frequency)
const FREQUENCY_KEYS: Record<string, string> = {
  annuel: "annuel",
  bisannuel: "bisannuel",
  triennal: "triennal",
  ponctuel: "ponctuel",
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
  const { slug, locale } = await params;
  const salon = await getSalonBySlug(slug);
  const t = await getTranslations({ locale, namespace: "salon-detail" });

  if (!salon) notFound();

  const sectorIds = salon.sectors.map((s) => s.id);
  const similarSalons = await getSimilarSalons(salon.id, sectorIds, 3);

  // MDX éditorial (Bloc 2 → Bloc 9 du modèle Nicolas v3). Présent uniquement
  // pour les fiches Agoris Certified passées par la pipeline éditoriale.
  const salonContent = await getSalonContent(slug);
  const MdxContent = salonContent
    ? await compileMdxContent(salonContent.content, salonMdxComponents)
    : null;

  // Quick Stats : uniquement les chiffres vérifiables. Pas de placeholder.
  const stats = [
    salon.estimated_exhibitors
      ? { value: salon.estimated_exhibitors, label: t("stats.exhibitors") }
      : null,
    salon.estimated_visitors
      ? { value: salon.estimated_visitors, label: t("stats.visitors") }
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
          { name: t("breadcrumb.home"), item: "/" },
          { name: t("breadcrumb.salons"), item: "/salons" },
          ...(salon.city
            ? [{ name: salon.city, item: `/villes/${slugifyCity(salon.city)}` }]
            : []),
          { name: salon.name, item: `/salons/${slug}` },
        ]}
      />

      {/* Breadcrumb : niveau ville intercalé pour le maillage géographique */}
      <nav className="mb-10 text-sm text-muted">
        <Link href="/salons" className="hover:text-prune transition-colors">
          {t("nav.salons")}
        </Link>
        {salon.city && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/villes/${slugifyCity(salon.city)}`}
              className="hover:text-prune transition-colors"
            >
              {salon.city}
            </Link>
          </>
        )}
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
              alt={salon.name}
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

        {/* Meta : dates + lieu (gauche) + barre d'actions (droite) */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>{formatDateRange(salon.start_date, salon.end_date)}</span>
            </div>
            {salon.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>
                  {salon.venue_slug ? (
                    <Link
                      href={`/lieux/${salon.venue_slug}`}
                      className="underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                    >
                      {salon.venue}
                    </Link>
                  ) : (
                    salon.venue
                  )}
                  {salon.city && (
                    <>
                      {", "}
                      <Link
                        href={`/villes/${slugifyCity(salon.city)}`}
                        className="underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                      >
                        {salon.city}
                      </Link>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <SalonActionsBar
            slug={slug}
            name={salon.name}
            editionYear={salon.edition_year}
            startDate={salon.start_date}
            endDate={salon.end_date}
            city={salon.city}
            venue={salon.venue}
            sectorLabel={salon.sectors[0]?.name}
            shortDescription={salon.description}
          />
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

      {/* 3. ESSENTIEL — above the fold (brief Nicolas juin 2026) */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
          {t("essential.title")}
        </h2>

        {salon.description && (
          <p className="mt-5 leading-relaxed text-prune/85">
            {salon.description}
          </p>
        )}

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {salon.organizer_name && (
            <Detail icon={<Building2 className="h-4 w-4" />} label={t("essential.organisateur")}>
              <Link
                href={`/organisateurs/${slugifyCity(salon.organizer_name)}`}
                className="underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
              >
                {salon.organizer_name}
              </Link>
            </Detail>
          )}
          {salon.co_organizer_name && (
            <Detail icon={<Building2 className="h-4 w-4" />} label={t("essential.coOrganisateur")}>
              <Link
                href={`/organisateurs/${slugifyCity(salon.co_organizer_name)}`}
                className="underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
              >
                {salon.co_organizer_name}
              </Link>
            </Detail>
          )}
          {salon.frequency && (
            <Detail icon={<RotateCcw className="h-4 w-4" />} label={t("essential.frequence")}>
              {FREQUENCY_KEYS[salon.frequency]
                ? t(`frequency.${FREQUENCY_KEYS[salon.frequency]}` as Parameters<typeof t>[0])
                : salon.frequency}
            </Detail>
          )}
          {salon.website_url && (
            <Detail icon={<Globe className="h-4 w-4" />} label={t("essential.siteOfficiel")}>
              <SalonOutboundLink
                slug={slug}
                destination="website"
                href={salon.website_url}
                className="inline-flex items-center gap-1 text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
              >
                {t("essential.visiterLeSite")}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </SalonOutboundLink>
            </Detail>
          )}
        </dl>

      </section>

      {/* 4. BLOC VISUEL — photo réelle scrapable affichée en object-contain
            sur fond sable (letterbox/pillarbox) pour préserver l'homothétie
            quelle que soit la dimension d'origine. Pas de fallback brand. */}
      {salon.cover_image_url && (
        <section className="mt-12 overflow-hidden rounded-lg border border-border bg-sable">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={salon.cover_image_url}
            alt={t("cover.alt", { name: salon.name })}
            className="aspect-video w-full object-contain"
          />
        </section>
      )}

      {/* 4 bis. ARTICLE MDX éditorial — fiches Agoris Certified uniquement.
            Contient les blocs 2 à 9 du modèle Nicolas v3 (essentiel, qui expose,
            vie du salon, logistique, budget, préparer sa venue, historique).
            Le bloc 1 Identité n'est pas répété, déjà rendu par le header DB. */}
      {MdxContent && salonContent && (
        <article className="prose-agoris mt-12 max-w-3xl">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {t("editorial.analysePrefix")}{" "}
            {formatEditorialMonth(salonContent.frontmatter.updated)}
          </p>
          <MdxContent />
          <p className="mt-12 border-t border-border pt-6 text-xs italic leading-relaxed text-muted">
            {t("editorial.sourcesNote")}
            {salon.website_url ? ` (${new URL(salon.website_url).hostname.replace(/^www\./, "")})` : ""}
            .
          </p>
        </article>
      )}

      {/* 5. DRAWER PRESTATAIRES — point de monétisation */}
      <ProviderDrawer
        salonId={salon.id}
        salonName={salon.name}
        salonSlug={slug}
      />

      {/* 6. AVIS certifiés */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
          {t("reviews.title")}
        </h2>
        <div className="mt-6">
          <ReviewList targetType="salon" targetId={salon.id} />
        </div>
        <div className="mt-8">
          <ReviewForm targetType="salon" targetId={salon.id} />
        </div>
      </section>

      {/* 7. SALONS SIMILAIRES */}
      {similarSalons.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-prune md:text-3xl">
            {t("similarSalons.title")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarSalons.map((s) => (
              <SalonCard key={s.id} salon={s} />
            ))}
          </div>
        </section>
      )}

      {/* 8. EXPLORER : liens hub secteur / ville (maillage interne) */}
      {(salon.sectors.length > 0 || salon.city) && (
        <nav
          aria-label="Explorer"
          className="mt-12 border-t border-border pt-8"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {salon.sectors[0] && (
              <li>
                <Link
                  href={`/secteurs/${salon.sectors[0].slug}`}
                  className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                >
                  {t("explore.allSalonsSector", { sector: salon.sectors[0].name })}
                </Link>
              </li>
            )}
            {salon.city && (
              <li>
                <Link
                  href={`/villes/${slugifyCity(salon.city)}`}
                  className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                >
                  {t("explore.allSalonsCity", { city: salon.city })}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
      <FeedbackPrompt salonName={salon.name} />
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
