"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { getSectorColorClasses } from "@/components/sector-badge";

type Sector = { slug: string; name: string };

type SalonFiltersSidebarProps = {
  sectors: Sector[];
  cities: string[];
};

const PERIOD_OPTIONS = [
  { value: "", label: "Toutes les dates" },
  { value: "this-month", label: "Ce mois" },
  { value: "next-quarter", label: "Prochain trimestre" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
];

// Contenu des filtres (partagé entre sidebar desktop et panel mobile)
function FilterContent({
  sectors,
  cities,
  currentSearch,
  selectedSectors,
  currentCity,
  currentPeriod,
  currentSort,
  onSearchSubmit,
  onToggleSector,
  onUpdateParam,
}: {
  sectors: Sector[];
  cities: string[];
  currentSearch: string;
  selectedSectors: string[];
  currentCity: string;
  currentPeriod: string;
  currentSort: string;
  onSearchSubmit: (value: string) => void;
  onToggleSector: (slug: string) => void;
  onUpdateParam: (key: string, value: string) => void;
}) {
  const hasActiveFilters =
    currentSearch ||
    selectedSectors.length > 0 ||
    currentCity ||
    currentPeriod ||
    currentSort !== "date";

  return (
    <div className="flex flex-col gap-8">
      {/* Recherche */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Recherche
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSearchSubmit(formData.get("search") as string);
          }}
        >
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Nom du salon..."
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/20"
          />
        </form>
      </div>

      {/* Secteurs */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted">
          Secteurs
        </label>
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => {
            const isSelected = selectedSectors.includes(sector.slug);
            const colorClasses = getSectorColorClasses(sector.slug);
            return (
              <button
                key={sector.slug}
                onClick={() => onToggleSector(sector.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? `${colorClasses} ring-2 ring-offset-1 ring-current/20 shadow-sm`
                    : "border-border bg-white text-muted hover:border-gray-300"
                }`}
              >
                {sector.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ville */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Ville
        </label>
        <select
          value={currentCity}
          onChange={(e) => onUpdateParam("city", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/20"
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Periode */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Periode
        </label>
        <select
          value={currentPeriod}
          onChange={(e) => onUpdateParam("period", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/20"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Trier par */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted">
          Trier par
        </label>
        <div className="flex flex-col gap-2">
          {[
            { value: "date", label: "Date" },
            { value: "name", label: "Nom" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={currentSort === option.value}
                onChange={() => onUpdateParam("sort", option.value)}
                className="h-4 w-4 border-border text-accent accent-accent"
              />
              <span className={currentSort === option.value ? "font-medium text-ink" : "text-muted"}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reinitialiser */}
      {hasActiveFilters && (
        <button
          onClick={() => onUpdateParam("reset", "")}
          className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-gray-50 hover:text-ink"
        >
          Reinitialiser les filtres
        </button>
      )}
    </div>
  );
}

export function SalonFiltersSidebar({
  sectors,
  cities,
}: SalonFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSearch = searchParams.get("search") ?? "";
  const currentSector = searchParams.get("sector") ?? "";
  const selectedSectors = currentSector
    ? currentSector.split(",").filter(Boolean)
    : [];
  const currentCity = searchParams.get("city") ?? "";
  const currentPeriod = searchParams.get("period") ?? "";
  const currentSort = searchParams.get("sort") ?? "date";

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`/salons?${params.toString()}`);
      });
    },
    [router, startTransition]
  );

  const updateParam = useCallback(
    (key: string, value: string) => {
      if (key === "reset") {
        navigate(new URLSearchParams());
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      if (value && !(key === "sort" && value === "date")) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      navigate(params);
    },
    [searchParams, navigate]
  );

  const toggleSector = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get("sector")
        ? params.get("sector")!.split(",").filter(Boolean)
        : [];

      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];

      if (updated.length > 0) {
        params.set("sector", updated.join(","));
      } else {
        params.delete("sector");
      }
      params.delete("page");
      navigate(params);
    },
    [searchParams, navigate]
  );

  const handleSearchSubmit = useCallback(
    (value: string) => {
      updateParam("search", value);
    },
    [updateParam]
  );

  const activeFilterCount =
    (currentSearch ? 1 : 0) +
    selectedSectors.length +
    (currentCity ? 1 : 0) +
    (currentPeriod ? 1 : 0) +
    (currentSort !== "date" ? 1 : 0);

  return (
    <>
      {/* Mobile : bouton + panel */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            Filtres
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <svg
            className={`h-4 w-4 text-muted transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Panel mobile slide-down */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "mt-4 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-xl border border-border bg-white p-6">
            <FilterContent
              sectors={sectors}
              cities={cities}
              currentSearch={currentSearch}
              selectedSectors={selectedSectors}
              currentCity={currentCity}
              currentPeriod={currentPeriod}
              currentSort={currentSort}
              onSearchSubmit={(val) => {
                handleSearchSubmit(val);
                setMobileOpen(false);
              }}
              onToggleSector={(slug) => {
                toggleSector(slug);
              }}
              onUpdateParam={(key, val) => {
                updateParam(key, val);
                if (key === "reset") setMobileOpen(false);
              }}
            />
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>

      {/* Desktop : sidebar sticky */}
      <aside className="hidden md:block">
        <div className="sticky top-20 w-[280px] rounded-xl border border-border bg-white p-6">
          <FilterContent
            sectors={sectors}
            cities={cities}
            currentSearch={currentSearch}
            selectedSectors={selectedSectors}
            currentCity={currentCity}
            currentPeriod={currentPeriod}
            currentSort={currentSort}
            onSearchSubmit={handleSearchSubmit}
            onToggleSector={toggleSector}
            onUpdateParam={updateParam}
          />
        </div>
      </aside>
    </>
  );
}
