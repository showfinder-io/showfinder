import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import {
  getSalons,
  getSalonsBySector,
  getSectors,
  getCities,
  SALON_CATEGORY_LABELS,
  type SalonCategory,
} from "@/lib/queries";
import { SalonFiltersSidebar } from "@/components/salon-filters-sidebar";
import { SalonCard } from "@/components/salon-card";
import { SalonPagination } from "@/components/salon-pagination";
import { SectionTitle } from "@/components/section-title";
import { SortBar } from "@/components/sort-bar";
import { JsonLd } from "@/components/json-ld";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

const PAGE_SIZE = 20;

type Props = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function buildCanonicalPath(
  page: number,
  params: Record<string, string>
): string {
  const sp = new URLSearchParams(params);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/salons?${qs}` : "/salons";
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const page = parsePage(sp.page);

  // Conserver les filtres pertinents dans le canonical pour ne pas perdre la
  // signature SEO de la combinaison filtre + pagination. Le helper applique la
  // meme query string a chaque locale (hreflang reciproque).
  const seoParams: Record<string, string> = {};
  if (sp.search) seoParams.search = sp.search;
  if (sp.sector) seoParams.sector = sp.sector;
  if (sp.city) seoParams.city = sp.city;
  if (sp.period) seoParams.period = sp.period;
  if (sp.category) seoParams.category = sp.category;
  if (sp.sort && sp.sort !== "date") seoParams.sort = sp.sort;

  return {
    title:
      page > 1
        ? `Tous les salons professionnels · Page ${page}`
        : "Tous les salons professionnels",
    description: `Découvrez tous les salons professionnels en France sur ${siteConfig.name}. Filtrez par secteur, ville et date.`,
    alternates: buildAlternates(buildCanonicalPath(page, seoParams), locale),
  };
}

export default async function SalonsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const sector = params.sector ?? "";
  const city = params.city ?? "";
  const period = params.period ?? "";
  const rawSort = params.sort ?? "date";
  const sort: "date" | "date-desc" | "visitors" | "name" =
    rawSort === "date-desc" ||
    rawSort === "visitors" ||
    rawSort === "name"
      ? rawSort
      : "date";
  const category =
    params.category && params.category in SALON_CATEGORY_LABELS
      ? (params.category as SalonCategory)
      : undefined;
  const page = parsePage(params.page);

  const [sectors, cities, result] = await Promise.all([
    getSectors(),
    getCities(),
    sector
      ? getSalonsBySector(sector, {
          search,
          city,
          period,
          category,
          page,
          pageSize: PAGE_SIZE,
          sort,
        })
      : getSalons({
          search,
          city,
          period,
          category,
          page,
          pageSize: PAGE_SIZE,
          sort,
        }),
  ]);

  // Filtres actifs à conserver dans les URLs de pagination.
  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  if (sector) currentParams.sector = sector;
  if (city) currentParams.city = city;
  if (period) currentParams.period = period;
  if (category) currentParams.category = category;
  if (sort && sort !== "date") currentParams.sort = sort;

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  // Schema.org ItemList : rend la liste de salons citable par Google et les
  // LLMs (GEO). Position globale tenant compte de la pagination ; numberOfItems
  // reflète les éléments réellement listés sur cette vue.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Salons professionnels en France",
    numberOfItems: result.salons.length,
    itemListElement: result.salons.map((salon, i) => ({
      "@type": "ListItem",
      position: (page - 1) * PAGE_SIZE + i + 1,
      name: salon.name,
      url: `${siteConfig.url}/salons/${salon.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      {result.salons.length > 0 && <JsonLd data={itemListJsonLd} />}
      {/* En-tete */}
      <header className="mb-10 md:mb-14">
        <SectionTitle as="h1" size="xl">
          Salons professionnels
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-base text-muted">
          <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
            {result.total}
          </span>{" "}
          salon{result.total > 1 ? "s" : ""} référencé
          {result.total > 1 ? "s" : ""} en France, audité
          {result.total > 1 ? "s" : ""} et classé
          {result.total > 1 ? "s" : ""} par filière.
        </p>
      </header>

      {/* Layout : sidebar (filières) + contenu (sortbar + grille) */}
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Rail latéral filières (desktop) + bouton bottom sheet (mobile) */}
        <Suspense>
          <SalonFiltersSidebar sectors={sectors} cities={cities} />
        </Suspense>

        {/* Contenu principal */}
        <div className="min-w-0 flex-1">
          <Suspense>
            <SortBar total={result.total} cities={cities} />
          </Suspense>

          {result.salons.length > 0 ? (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {result.salons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>

              <SalonPagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/salons"
                searchParams={currentParams}
              />
            </>
          ) : (
            <div className="mt-16 rounded-lg border border-prune/10 bg-ivoire p-12 text-center">
              <p className="font-serif text-xl italic leading-relaxed text-prune/85">
                Rien ne correspond à votre recherche.
                <br />
                Essayez un secteur ou une ville
                <em className="not-italic text-ocre">.</em>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
