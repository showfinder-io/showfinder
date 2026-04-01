"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type SalonFiltersProps = {
  sectors: { slug: string; name: string }[];
  cities: string[];
};

export function SalonFilters({ sectors, cities }: SalonFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentSector = searchParams.get("sector") ?? "";
  const currentCity = searchParams.get("city") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset page quand on change un filtre
      params.delete("page");
      router.push(`/salons?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateParams("search", formData.get("search") as string);
        }}
        className="flex-1"
      >
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Rechercher un salon..."
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </form>

      {/* Filtre secteur */}
      <select
        value={currentSector}
        onChange={(e) => updateParams("sector", e.target.value)}
        className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted outline-none transition-colors focus:border-accent"
      >
        <option value="">Tous les secteurs</option>
        {sectors.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Filtre ville */}
      <select
        value={currentCity}
        onChange={(e) => updateParams("city", e.target.value)}
        className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted outline-none transition-colors focus:border-accent"
      >
        <option value="">Toutes les villes</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}
