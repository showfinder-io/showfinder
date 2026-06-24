"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { getSectorColorClasses } from "@/components/sector-badge";
import { trackEvent } from "@/lib/analytics";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Sector = { slug: string; name: string };

type SalonFiltersSidebarProps = {
  sectors: Sector[];
  cities: string[];
};

type TranslationFn = ReturnType<typeof useTranslations>;

/**
 * Grille de chips sectorielles 2 colonnes.
 * Réutilisable desktop (rail) + mobile (bottom sheet).
 */
function SectorChipsGrid({
  sectors,
  selectedSectors,
  onToggleSector,
}: {
  sectors: Sector[];
  selectedSectors: string[];
  onToggleSector: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sectors.map((sector) => {
        const isSelected = selectedSectors.includes(sector.slug);
        const colorClasses = getSectorColorClasses(sector.slug);
        return (
          <button
            key={sector.slug}
            type="button"
            onClick={() => onToggleSector(sector.slug)}
            className={`min-w-0 truncate rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-all ${
              isSelected
                ? `${colorClasses} shadow-sm`
                : "border-prune/15 bg-papier text-prune/70 hover:border-prune/30 hover:text-prune"
            }`}
          >
            {sector.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Input recherche éditorial (style hero) — underline prune, italic Fraunces 16px.
 */
function EditorialSearchInput({
  defaultValue,
  onSubmit,
  placeholder,
}: {
  defaultValue: string;
  onSubmit: (value: string) => void;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData.get("search") as string);
      }}
    >
      <input
        type="text"
        name="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border-0 border-b border-prune/30 bg-transparent px-0 py-2 font-serif text-[16px] italic text-prune outline-none transition-colors placeholder:italic placeholder:text-prune/40 focus:border-prune"
      />
    </form>
  );
}

/**
 * Contenu complet du bottom sheet mobile (secteurs + ville + période + catégorie + tri).
 */
function MobileFilterPanel({
  sectors,
  cities,
  currentSearch,
  selectedSectors,
  currentCity,
  currentPeriod,
  currentCategory,
  currentSort,
  onSearchSubmit,
  onToggleSector,
  onUpdateParam,
  onClose,
  t,
}: {
  sectors: Sector[];
  cities: string[];
  currentSearch: string;
  selectedSectors: string[];
  currentCity: string;
  currentPeriod: string;
  currentCategory: string;
  currentSort: string;
  onSearchSubmit: (value: string) => void;
  onToggleSector: (slug: string) => void;
  onUpdateParam: (key: string, value: string) => void;
  onClose: () => void;
  t: TranslationFn;
}) {
  const hasActiveFilters =
    currentSearch ||
    selectedSectors.length > 0 ||
    currentCity ||
    currentPeriod ||
    currentCategory ||
    currentSort !== "date";

  const PERIOD_OPTIONS = [
    { value: "", label: t("periods.all") },
    { value: "this-month", label: t("periods.thisMonth") },
    { value: "next-quarter", label: t("periods.nextQuarter") },
    { value: "2026", label: t("periods.2026") },
    { value: "2027", label: t("periods.2027") },
  ];

  const CATEGORY_OPTIONS = [
    { value: "", label: t("categories.all") },
    { value: "salon_professionnel", label: t("categories.salonProfessionnel") },
    { value: "salon_grand_public", label: t("categories.salonGrandPublic") },
    { value: "congres", label: t("categories.congres") },
    { value: "autres", label: t("categories.autres") },
  ];

  const SORT_OPTIONS = [
    { value: "date", label: t("sortOptions.dateAsc") },
    { value: "date-desc", label: t("sortOptions.dateDesc") },
    { value: "visitors", label: t("sortOptions.visitors") },
    { value: "name", label: t("sortOptions.name") },
  ];

  return (
    <div className="flex flex-col gap-7 overflow-y-auto px-5 pb-6 pt-2">
      <div>
        <label className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("search")}
        </label>
        <EditorialSearchInput
          defaultValue={currentSearch}
          onSubmit={onSearchSubmit}
          placeholder={t("searchPlaceholder")}
        />
      </div>

      <div>
        <label className="mb-2.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("sectors")}
        </label>
        <SectorChipsGrid
          sectors={sectors}
          selectedSectors={selectedSectors}
          onToggleSector={onToggleSector}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("city")}
        </label>
        <select
          value={currentCity}
          onChange={(e) => onUpdateParam("city", e.target.value)}
          className="w-full rounded-md border border-prune/15 bg-papier px-3 py-2 text-sm text-prune outline-none transition-colors focus:border-prune"
        >
          <option value="">{t("allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("period")}
        </label>
        <select
          value={currentPeriod}
          onChange={(e) => onUpdateParam("period", e.target.value)}
          className="w-full rounded-md border border-prune/15 bg-papier px-3 py-2 text-sm text-prune outline-none transition-colors focus:border-prune"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("category")}
        </label>
        <select
          value={currentCategory}
          onChange={(e) => onUpdateParam("category", e.target.value)}
          className="w-full rounded-md border border-prune/15 bg-papier px-3 py-2 text-sm text-prune outline-none transition-colors focus:border-prune"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
          {t("sortBy")}
        </label>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-prune/5"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={currentSort === option.value}
                onChange={() => onUpdateParam("sort", option.value)}
                className="h-4 w-4 accent-prune"
              />
              <span
                className={
                  currentSort === option.value
                    ? "font-medium text-prune"
                    : "text-prune/65"
                }
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-prune/10 bg-papier px-5 py-4">
        {hasActiveFilters && (
          <button
            onClick={() => {
              onUpdateParam("reset", "");
              onClose();
            }}
            className="flex-1 rounded-md border border-prune/20 bg-papier px-4 py-2.5 text-sm font-medium text-prune/70 transition-colors hover:bg-prune/5 hover:text-prune"
          >
            {t("reset")}
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 rounded-md bg-prune px-4 py-2.5 text-sm font-medium text-papier transition-opacity hover:opacity-90"
        >
          {t("seeResults")}
        </button>
      </div>
    </div>
  );
}

export function SalonFiltersSidebar({
  sectors,
  cities,
}: SalonFiltersSidebarProps) {
  const t = useTranslations("filters");
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
  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "date";

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`/salons?${params.toString()}`);
      });
    },
    [router]
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
      trackEvent("filter_change", { filter_name: key, filter_value: value || "none" });
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
      trackEvent("filter_change", {
        filter_name: "sector",
        filter_value: slug,
        action: current.includes(slug) ? "remove" : "add",
      });
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
    (currentCategory ? 1 : 0) +
    (currentSort !== "date" ? 1 : 0);

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <button className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-prune/15 bg-papier px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-prune transition-colors hover:bg-prune/5">
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M6 12h12M10 18h4"
                    />
                  </svg>
                  {t("filterLabel")}
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ocre px-1 text-[10px] font-bold tracking-normal text-prune">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                <span className="text-prune/50" aria-hidden>
                  ▴
                </span>
              </button>
            }
          />
          <SheetContent
            side="bottom"
            className="max-h-[90dvh] rounded-t-xl bg-papier"
          >
            <SheetHeader className="border-b border-prune/10">
              <SheetTitle className="font-serif text-lg font-normal text-prune">
                {t("filterTitle")}
                <em className="not-italic text-ocre">.</em>
              </SheetTitle>
            </SheetHeader>
            <MobileFilterPanel
              sectors={sectors}
              cities={cities}
              currentSearch={currentSearch}
              selectedSectors={selectedSectors}
              currentCity={currentCity}
              currentPeriod={currentPeriod}
              currentCategory={currentCategory}
              currentSort={currentSort}
              onSearchSubmit={(val) => {
                handleSearchSubmit(val);
              }}
              onToggleSector={toggleSector}
              onUpdateParam={updateParam}
              onClose={() => setMobileOpen(false)}
              t={t}
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20 w-[280px]">
          <div className="rounded-lg border border-prune/10 bg-papier p-5">
            <div className="mb-6">
              <label className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
                {t("search")}
              </label>
              <EditorialSearchInput
                defaultValue={currentSearch}
                onSubmit={handleSearchSubmit}
                placeholder={t("searchPlaceholder")}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-prune/60">
                {t("sectors")}
              </label>
              <SectorChipsGrid
                sectors={sectors}
                selectedSectors={selectedSectors}
                onToggleSector={toggleSector}
              />
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => updateParam("reset", "")}
                className="mt-6 w-full rounded-md border border-prune/15 bg-papier px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-prune/65 transition-colors hover:bg-prune/5 hover:text-prune"
              >
                {t("reset")}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
