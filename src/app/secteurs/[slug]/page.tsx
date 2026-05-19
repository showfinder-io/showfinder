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
import { SectionTitle } from "@/components/section-title";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";

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
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Secteurs", item: "/secteurs" },
          { name: sector.name, item: `/secteurs/${slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-muted">
        <Link href="/secteurs" className="hover:text-prune transition-colors">
          Secteurs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{sector.name}</span>
      </nav>

      {/* Header éditorial */}
      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow="Filière">
          Salons {sector.name}
        </SectionTitle>
        {sector.description && (
          <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
            {sector.description}
          </p>
        )}
        <p className="mt-6 text-sm text-muted">
          <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
            {result.total}
          </span>{" "}
          salon{result.total > 1 ? "s" : ""} référencé
          {result.total > 1 ? "s" : ""} dans cette filière.
        </p>
      </header>

      {/* Alerte nouveaux salons */}
      <div className="mt-10 max-w-2xl">
        <AlertSubscribe type="sector" slug={slug} label={sector.name} />
      </div>

      {/* Résultats */}
      {result.salons.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-border bg-ivoire p-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-prune/85">
            Aucun salon dans cette filière pour le moment
            <em className="not-italic text-ocre">.</em>
          </p>
        </div>
      )}
    </div>
  );
}
