import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { getAllCitySlugs, getSalonsByCity } from "@/lib/queries";
import { slugifyCity } from "@/lib/format";
import { SalonCard } from "@/components/salon-card";

type Props = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const city = await findCityBySlug(slug);

  if (!city) {
    return { title: "Ville introuvable" };
  }

  const title = `Salons professionnels à ${city}`;
  const description = `Découvrez tous les salons professionnels à ${city} sur ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/villes/${slug}`,
    },
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

  const salons = await getSalonsByCity(city);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
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
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Géographie
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-prune md:text-5xl">
          Salons professionnels à {city}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
          {salons.length} salon{salons.length > 1 ? "s" : ""} référencé
          {salons.length > 1 ? "s" : ""} à {city}, audité
          {salons.length > 1 ? "s" : ""} et classé
          {salons.length > 1 ? "s" : ""} par notre équipe éditoriale.
        </p>
      </header>

      {/* Résultats */}
      {salons.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-border bg-papier p-12 text-center">
          <p className="text-base text-muted">
            Aucun salon dans cette ville pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
