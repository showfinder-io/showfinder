import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import {
  getAllSectorSlugs,
  getSectorBySlug,
  getSalonsBySector,
  getSectors,
} from "@/lib/queries";
import { slugifyCity } from "@/lib/format";
import { getSectorContent, formatEditorialMonthLocale } from "@/lib/sector-content";
import { compileMdxContent } from "@/lib/mdx";
import { SalonCard } from "@/components/salon-card";
import { AlertSubscribe } from "@/components/alert-subscribe";
import { SectionTitle } from "@/components/section-title";
import { SectorBadge } from "@/components/sector-badge";
import { JsonLd } from "@/components/json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

// SSG : pre-render toutes les pages secteur
export async function generateStaticParams() {
  const slugs = await getAllSectorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const sector = await getSectorBySlug(slug);
  const t = await getTranslations({ locale, namespace: "sectors.detail" });

  if (!sector) {
    return { title: t("metaNotFound") };
  }

  // Phase 2 i18n : getSectorContent retourne le contenu EN (avec fallback FR)
  // selon la locale passée.
  const sectorContent = await getSectorContent(slug, locale);

  // Nom et description du secteur avec fallback FR si la colonne _en est nulle.
  const sectorName =
    (locale === "en" && sector.name_en ? sector.name_en : null) ?? sector.name;
  const sectorDescription =
    (locale === "en" && sector.description_en ? sector.description_en : null) ??
    sector.description;

  // Si MDX présent, on privilégie son frontmatter SEO (rédigé par l'équipe
  // éditoriale, plus riche que la simple description de la table sectors).
  const title = sectorContent?.frontmatter.title ?? `Salons ${sectorName}`;
  const description =
    sectorContent?.frontmatter.description ??
    sectorDescription ??
    (locale === "en"
      ? `Discover all professional trade shows in the ${sectorName} sector on ${siteConfig.name}.`
      : `Découvrez tous les salons professionnels du secteur ${sectorName} sur ${siteConfig.name}.`);

  return {
    title,
    description,
    // noindex,follow pour les secteurs sans MDX éditorial : Google peut crawler
    // pour suivre les liens vers les salons, mais ne référence pas la page.
    // Les 4 secteurs avec MDX (BTP, Énergie, Tech, Santé) restent indexables.
    robots: sectorContent
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: buildAlternates(`/secteurs/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: sectorContent ? "article" : "website",
    },
  };
}

export default async function SecteurPage({ params }: Props) {
  const { slug, locale } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) notFound();

  const t = await getTranslations({ locale, namespace: "sectors.detail" });

  const [result, sectorContent, allSectors] = await Promise.all([
    getSalonsBySector(slug),
    // Phase 2 i18n : retourne le MDX EN si disponible, sinon FR.
    getSectorContent(slug, locale),
    getSectors(),
  ]);

  const Content = sectorContent
    ? await compileMdxContent(sectorContent.content)
    : null;

  // Phase 2 i18n : nom et description du secteur avec fallback FR.
  const sectorName =
    (locale === "en" && sector.name_en ? sector.name_en : null) ?? sector.name;
  const sectorDescription =
    (locale === "en" && sector.description_en ? sector.description_en : null) ??
    sector.description;

  // Villes de la filière (dédupliquées via les salons listés) : maillage
  // croisé secteur → pages ville.
  const cities = [
    ...new Set(
      result.salons.map((s) => s.city).filter((c): c is string => Boolean(c))
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Autres filières : maillage horizontal entre pages secteur
  const otherSectors = allSectors.filter((s) => s.slug !== slug);

  // Schema.org ItemList : liste citable par Google et les LLMs (GEO)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "en" ? `${sectorName} Trade Shows` : `Salons ${sectorName}`,
    numberOfItems: result.total,
    itemListElement: result.salons.map((salon, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: salon.name,
      url: `${siteConfig.url}/salons/${salon.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {result.salons.length > 0 && <JsonLd data={itemListJsonLd} />}
      <BreadcrumbJsonLd
        items={[
          { name: t("breadcrumbHome"), item: "/" },
          { name: t("breadcrumbSectors"), item: "/secteurs" },
          { name: sectorName, item: `/secteurs/${slug}` },
        ]}
      />

      <nav className="mb-10 text-sm text-muted">
        <Link href="/secteurs" className="hover:text-prune transition-colors">
          {t("breadcrumbSectors")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{sectorName}</span>
      </nav>

      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow={t("eyebrow")}>
          {locale === "en" ? `${sectorName} Trade Shows` : `Salons ${sectorName}`}
        </SectionTitle>

        {/* Mention de fraîcheur éditoriale : signal E-E-A-T pour Google
            et les LLMs. Uniquement sur les secteurs avec MDX travaillé. */}
        {sectorContent && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {t("editorialUpdate", {
              date: formatEditorialMonthLocale(sectorContent.frontmatter.updated, locale),
            })}
          </p>
        )}

        {/* Raccourci vers la liste : épargne le scroll aux visiteurs qui
            cherchent juste les salons. Uniquement sur les secteurs avec
            long-form (sinon la liste est juste sous le H1). */}
        {sectorContent && (
          <p className="mt-6 text-sm text-prune/65">
            {t("skipToListPrefix")}{" "}
            <a
              href="#salons"
              className="underline-offset-4 transition-colors hover:underline hover:text-prune"
            >
              {t("skipToList")} ↓
            </a>
          </p>
        )}

        {/* Sans MDX : description courte issue de la table sectors.
            Avec MDX : on n'affiche pas la description courte ici, le contenu
            éditorial qui suit prend le relais (intro plus dense). */}
        {!Content && sectorDescription && (
          <p className="mt-5 text-base leading-relaxed text-prune/85 md:text-lg">
            {sectorDescription}
          </p>
        )}
      </header>

      {/* Article éditorial chapeau (BTP, Énergie, Tech, Santé pour le moment) */}
      {Content && (
        <article className="prose-agoris mt-12 max-w-3xl">
          <Content />
        </article>
      )}

      {/* Section liste des salons : id=salons pour ancre du raccourci ci-dessus.
          scroll-mt pour compenser le header sticky éventuel et garder le titre
          aligné en haut du viewport au scroll. */}
      <section id="salons" className="mt-20 scroll-mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle as="h2" size="lg">
            {t("showsHeading")}
          </SectionTitle>
          <p className="text-sm text-muted">
            <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
              {result.total}
            </span>{" "}
            {result.total > 1 ? t("showsLabelMany") : t("showsLabelOne")}
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
              {t("emptyShows")}
              <em className="not-italic text-ocre">.</em>
            </p>
          </div>
        )}
      </section>

      {/* Villes de la filière : maillage croisé vers les pages ville */}
      {cities.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <SectionTitle as="h2" size="lg">
            {t("citiesHeading")}
          </SectionTitle>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {cities.map((city) => (
              <li key={city}>
                <Link
                  href={`/villes/${slugifyCity(city)}`}
                  className="text-prune underline decoration-prune/30 underline-offset-2 transition-colors hover:decoration-prune"
                >
                  {t("cityLink", { city })}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Autres filières : maillage horizontal entre pages secteur */}
      {otherSectors.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <SectionTitle as="h2" size="lg">
            {t("otherSectorsHeading")}
          </SectionTitle>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherSectors.map((s) => (
              <SectorBadge key={s.slug} slug={s.slug} name={s.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
