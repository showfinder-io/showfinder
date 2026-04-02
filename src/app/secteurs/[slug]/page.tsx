import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getAllSectorSlugs,
  getSectorBySlug,
  getSalonsBySector,
} from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { AlertSubscribe } from "@/components/alert-subscribe";

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG : pre-render toutes les pages secteur
export async function generateStaticParams() {
  const slugs = await getAllSectorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) {
    return { title: "Secteur introuvable" };
  }

  const title = `Salons ${sector.name}`;
  const description =
    sector.description ||
    `Découvrez tous les salons professionnels du secteur ${sector.name} sur ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/secteurs/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function SecteurPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) notFound();

  const result = await getSalonsBySector(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/secteurs" className="hover:text-ink transition-colors">
          Secteurs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{sector.name}</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Salons {sector.name}
      </h1>

      {sector.description && (
        <p className="mt-4 leading-relaxed text-muted">{sector.description}</p>
      )}

      {/* Alerte nouveaux salons */}
      <div className="mt-6">
        <AlertSubscribe type="sector" slug={slug} label={sector.name} />
      </div>

      <p className="mt-4 text-sm text-muted">
        {result.total} salon{result.total > 1 ? "s" : ""} dans ce secteur
      </p>

      {/* Resultats */}
      {result.salons.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted">
            Aucun salon dans ce secteur pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
