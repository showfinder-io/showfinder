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
import { SalonListLoadMore } from "@/components/salon-list-loadmore";
import { SectionTitle } from "@/components/section-title";

export const metadata: Metadata = {
  title: "Tous les salons professionnels",
  description: `Découvrez tous les salons professionnels en France sur ${siteConfig.name}. Filtrez par secteur, ville et date.`,
  alternates: {
    canonical: `${siteConfig.url}/salons`,
  },
};

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function SalonsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const sector = params.sector ?? "";
  const city = params.city ?? "";
  const period = params.period ?? "";
  const sort = (params.sort as "date" | "name") || "date";
  const category =
    params.category && params.category in SALON_CATEGORY_LABELS
      ? (params.category as SalonCategory)
      : undefined;

  const [sectors, cities, result] = await Promise.all([
    getSectors(),
    getCities(),
    sector
      ? getSalonsBySector(sector, { search, city, period, category, page: 1, sort })
      : getSalons({ search, city, period, category, page: 1, sort }),
  ]);

  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  if (sector) currentParams.sector = sector;
  if (city) currentParams.city = city;
  if (period) currentParams.period = period;
  if (category) currentParams.category = category;
  if (sort && sort !== "date") currentParams.sort = sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
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

      {/* Layout : sidebar + contenu */}
      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        {/* Sidebar filtres */}
        <Suspense>
          <SalonFiltersSidebar sectors={sectors} cities={cities} />
        </Suspense>

        {/* Contenu principal */}
        <div className="min-w-0 flex-1">
          {result.salons.length > 0 ? (
            <SalonListLoadMore
              // `key` change quand les filtres changent → force le remount du
              // composant et reset le state local (sinon useState garde les
              // anciens salons et on affiche des cartes hors filtre).
              key={new URLSearchParams(currentParams).toString()}
              initialSalons={result.salons}
              total={result.total}
              searchParams={currentParams}
            />
          ) : (
            <div className="mt-16 rounded-lg border border-border bg-ivoire p-12 text-center">
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
