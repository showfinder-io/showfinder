import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { getSalons, getSalonsBySector, getSectors, getCities } from "@/lib/queries";
import { SalonFiltersSidebar } from "@/components/salon-filters-sidebar";
import { SalonListLoadMore } from "@/components/salon-list-loadmore";

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

  const [sectors, cities, result] = await Promise.all([
    getSectors(),
    getCities(),
    sector
      ? getSalonsBySector(sector, { search, city, period, page: 1, sort })
      : getSalons({ search, city, period, page: 1, sort }),
  ]);

  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  if (sector) currentParams.sector = sector;
  if (city) currentParams.city = city;
  if (period) currentParams.period = period;
  if (sort && sort !== "date") currentParams.sort = sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* En-tete */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Salons professionnels
        </h1>
        <p className="mt-2 text-muted">
          {result.total} salon{result.total > 1 ? "s" : ""} trouvé
          {result.total > 1 ? "s" : ""}
        </p>
      </div>

      {/* Layout : sidebar + contenu */}
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        {/* Sidebar filtres */}
        <Suspense>
          <SalonFiltersSidebar sectors={sectors} cities={cities} />
        </Suspense>

        {/* Contenu principal */}
        <div className="min-w-0 flex-1">
          {result.salons.length > 0 ? (
            <SalonListLoadMore
              initialSalons={result.salons}
              total={result.total}
              searchParams={currentParams}
            />
          ) : (
            <div className="mt-16 text-center">
              <p className="text-lg text-muted">
                Aucun salon ne correspond à vos critères.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
