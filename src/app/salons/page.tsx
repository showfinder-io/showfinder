import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { getSalons, getSalonsBySector, getSectors, getCities } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SalonFilters } from "@/components/salon-filters";
import { Pagination } from "@/components/pagination";

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
  const page = Number(params.page ?? "1");

  // Charger filtres et resultats en parallele
  const [sectors, cities, result] = await Promise.all([
    getSectors(),
    getCities(),
    sector
      ? getSalonsBySector(sector, { search, city, page })
      : getSalons({ search, city, page, sort: "date" }),
  ]);

  const totalPages = Math.ceil(result.total / result.pageSize);

  // Reconstruire les search params pour la pagination
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

      {/* Filtres */}
      <div className="mt-8">
        <Suspense>
          <SalonFilters sectors={sectors} cities={cities} />
        </Suspense>
      </div>

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
            Aucun salon ne correspond à vos critères.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/salons"
        searchParams={currentParams}
      />
    </div>
  );
}
