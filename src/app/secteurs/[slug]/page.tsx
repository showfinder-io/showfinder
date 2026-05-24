import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  getAllSectorSlugs,
  getSectorBySlug,
  getSalonsBySector,
} from "@/lib/queries";
import { getSectorContent } from "@/lib/sector-content";
import { compileMdxContent } from "@/lib/mdx";
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

  const sectorContent = getSectorContent(slug);

  // Si MDX présent, on privilégie son frontmatter SEO (rédigé par l'équipe
  // éditoriale, plus riche que la simple description de la table sectors).
  const title = sectorContent?.frontmatter.title ?? `Salons ${sector.name}`;
  const description =
    sectorContent?.frontmatter.description ??
    sector.description ??
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
      type: sectorContent ? "article" : "website",
    },
  };
}

export default async function SecteurPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) notFound();

  const [result, sectorContent] = await Promise.all([
    getSalonsBySector(slug),
    Promise.resolve(getSectorContent(slug)),
  ]);

  const Content = sectorContent
    ? await compileMdxContent(sectorContent.content)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Secteurs", item: "/secteurs" },
          { name: sector.name, item: `/secteurs/${slug}` },
        ]}
      />

      <nav className="mb-10 text-sm text-muted">
        <Link href="/secteurs" className="hover:text-prune transition-colors">
          Secteurs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{sector.name}</span>
      </nav>

      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow="Filière">
          Salons {sector.name}
        </SectionTitle>
        {/* Sans MDX : description courte issue de la table sectors.
            Avec MDX : on n'affiche pas la description courte ici, le contenu
            éditorial qui suit prend le relais (intro plus dense). */}
        {!Content && sector.description && (
          <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
            {sector.description}
          </p>
        )}
      </header>

      {/* Article éditorial chapeau (BTP, Énergie, Tech, Santé pour le moment) */}
      {Content && (
        <article className="prose-agoris mt-12 max-w-3xl">
          <Content />
        </article>
      )}

      {/* Section liste des salons */}
      <section className="mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle as="h2" size="lg">
            Les salons de cette filière
          </SectionTitle>
          <p className="text-sm text-muted">
            <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
              {result.total}
            </span>{" "}
            salon{result.total > 1 ? "s" : ""} référencé
            {result.total > 1 ? "s" : ""}.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <AlertSubscribe type="sector" slug={slug} label={sector.name} />
        </div>

        {result.salons.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-lg border border-border bg-ivoire p-12 text-center">
            <p className="font-serif text-xl italic leading-relaxed text-prune/85">
              Aucun salon dans cette filière pour le moment
              <em className="not-italic text-ocre">.</em>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
