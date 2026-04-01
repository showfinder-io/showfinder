import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { getSalons, getSalonsBySector, getSectors, getCities } from "@/lib/queries";
import { SalonFilters } from "@/components/salon-filters";
import { SalonListLoadMore } from "@/components/salon-list-loadmore";

export const metadata: Metadata = {
  title: "Tous les salons professionnels",
  description: `Découvrez tous les salons professionnels en France sur ${siteConfig.name}. Filtrez par secteur, ville et date.`,
};

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function SalonsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const sector = params.sector ?? "";
  const city = params.city ?? "";

  const [sectors, cities, result] = await Promise.all([
    getSectors(),
    getCities(),
    sector
      ? getSalonsBySector(sector, { search, city, page: 1 })
      : getSalons({ search, city, page: 1, sort: "date" }),
  ]);

  const currentParams: Record<string, string> = {};
  if (search) currentParams.search = search;
  if (sector) currentParams.sector = sector;
  if (city) currentParams.city = city;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Salons professionnels
      </h1>
      <p className="mt-2 text-muted">
        {result.total} salon{result.total > 1 ? "s" : ""} trouvé
        {result.total > 1 ? "s" : ""}
      </p>

      <div className="mt-8">
        <Suspense>
          <SalonFilters sectors={sectors} cities={cities} />
        </Suspense>
      </div>

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
  );
}
