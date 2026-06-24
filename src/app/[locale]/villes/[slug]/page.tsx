import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, CITY_INDEX_MIN_SALONS } from "@/lib/config";
import {
  getAllCitySlugs,
  getSalonsByCity,
  getCityCounts,
  getVenuesByCity,
} from "@/lib/queries";
import { slugifyCity } from "@/lib/format";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";
import { SectionTitle } from "@/components/section-title";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

// SSG : pre-render toutes les pages ville
export async function generateStaticParams() {
  const cities = await getAllCitySlugs();
  return cities.map((city) => ({ slug: slugifyCity(city) }));
}

// Retrouver le nom original de la ville a partir du slug
async function findCityBySlug(slug: string): Promise<string | null> {
  const cities = await getAllCitySlugs();
  return cities.find((city) => slugifyCity(city) === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const city = await findCityBySlug(slug);

  if (!city) {
    return { title: "Ville introuvable" };
  }

  const cityCounts = await getCityCounts();
  const count = cityCounts.find((c) => c.city === city)?.count ?? 0;

  const title = `Salons professionnels à ${city}`;
  const description =
    count > 0
      ? `Calendrier des ${count} salon${count > 1 ? "s" : ""} professionnel${count > 1 ? "s" : ""} à ${city} : dates, lieux d'exposition, secteurs et informations pratiques sur ${siteConfig.name}.`
      : `Découvrez tous les salons professionnels à ${city} sur ${siteConfig.name}.`;

  return {
    title,
    description,
    // Une page ville n'est indexable qu'à partir de CITY_INDEX_MIN_SALONS
    // salons publiés. En dessous : contenu trop mince → noindex,follow
    // (Google suit quand même les liens vers les fiches salon).
    robots:
      count >= CITY_INDEX_MIN_SALONS
        ? { index: true, follow: true }
        : { index: false, follow: true },
    alternates: buildAlternates(`/villes/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function VillePage({ params }: Props) {
  const { slug } = await params;
  const city = await findCityBySlug(slug);

  if (!city) notFound();

  const [salons, venues, cityCounts] = await Promise.all([
    getSalonsByCity(city),
    getVenuesByCity(city),
    getCityCounts(),
  ]);

  // Secteurs représentés dans la ville (dédupliqués via les salons)
  const sectorsMap = new Map<string, { slug: string; name: string }>();
  for (const salon of salons) {
    for (const sector of salon.sectors) {
      if (!sectorsMap.has(sector.slug)) {
        sectorsMap.set(sector.slug, { slug: sector.slug, name: sector.name });
      }
    }
  }
  const sectors = [...sectorsMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Autres villes principales : maillage horizontal indispensable car il
  // n'existe pas de page index /villes. On ne lie que les villes indexables.
  const otherCities = cityCounts
    .filter((c) => c.city !== city && c.count >= CITY_INDEX_MIN_SALONS)
    .slice(0, 8);

  // Schema.org ItemList : liste citable par Google et les LLMs (GEO)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Salons professionnels à ${city}`,
    numberOfItems: salons.length,
    itemListElement: salons.map((salon, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: salon.name,
      url: `${siteConfig.url}/salons/${salon.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Pas de page index /villes : on reflète le breadcrumb visuel
          (Accueil → Salons → {ville}) pour rester cohérent et pointer vers
          des URLs qui existent réellement. */}
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Salons", item: "/salons" },
          { name: city, item: `/villes/${slug}` },
        ]}
      />
      {salons.length > 0 && <JsonLd data={itemListJsonLd} />}

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-muted">
        <Link href="/salons" className="hover:text-prune transition-colors">
          Salons
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{city}</span>
      </nav>

      {/* Header éditorial */}
      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow="Géographie">
          Salons professionnels à {city}
        </SectionTitle>
        <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
          <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
            {salons.length}
          </span>{" "}
          salon{salons.length > 1 ? "s" : ""} référencé
          {salons.length > 1 ? "s" : ""} à {city}, audité
          {salons.length > 1 ? "s" : ""} et classé
          {salons.length > 1 ? "s" : ""} par notre équipe éditoriale.
        </p>

        {/* Secteurs représentés : maillage vers les pages filière */}
        {sectors.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <SectorBadge
                key={sector.slug}
                slug={sector.slug}
                name={sector.name}
              />
            ))}
          </div>
        )}
      </header>

      {/* Résultats */}
      {salons.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-border bg-ivoire p-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-prune/85">
            Aucun salon dans cette ville pour le moment
            <em className="not-italic text-ocre">.</em>
          </p>
        </div>
      )}

      {/* Lieux d'exposition de la ville : maillage vers les fiches lieu */}
      {venues.length > 0 && (
        <section className="mt-16">
          <SectionTitle as="h2" size="lg">
            Lieux d&apos;exposition à {city}
          </SectionTitle>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link
                  href={`/lieux/${venue.slug}`}
                  className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                >
                  {venue.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Autres villes : maillage horizontal entre pages ville */}
      {otherCities.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <SectionTitle as="h2" size="lg">
            Salons dans d&apos;autres villes
          </SectionTitle>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {otherCities.map((c) => (
              <li key={c.city}>
                <Link
                  href={`/villes/${slugifyCity(c.city)}`}
                  className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                >
                  Salons à {c.city}
                </Link>{" "}
                <span className="text-muted">({c.count})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
