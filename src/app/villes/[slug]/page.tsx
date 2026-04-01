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
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/salons" className="hover:text-ink transition-colors">
          Salons
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{city}</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Salons professionnels à {city}
      </h1>

      <p className="mt-4 text-sm text-muted">
        {salons.length} salon{salons.length > 1 ? "s" : ""} dans cette ville
      </p>

      {/* Resultats */}
      {salons.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted">
            Aucun salon dans cette ville pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
