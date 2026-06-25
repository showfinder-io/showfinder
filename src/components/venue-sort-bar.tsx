"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/popover";

type VenueSortBarProps = {
  total: number;
  cities: string[];
};

type SortOption = {
  value: string;
  label: string;
  shortLabel: string;
};

/**
 * Bandeau horizontal éditorial pour le listing /lieux.
 * Aligné sur SortBar (salons) et ProviderSortBar.
 */
export function VenueSortBar({ total, cities }: VenueSortBarProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") ?? "surface-desc";
  const currentCity = searchParams.get("city") ?? "";

  const SORT_OPTIONS: SortOption[] = useMemo(() => [
    { value: "surface-desc", label: t("venueSort.surfaceDesc"), shortLabel: t("venueSort.surfaceDescShort") },
    { value: "surface-asc", label: t("venueSort.surfaceAsc"), shortLabel: t("venueSort.surfaceAscShort") },
    { value: "name", label: t("sortOptions.name"), shortLabel: t("sortOptions.nameShort") },
    { value: "city", label: t("venueSort.city"), shortLabel: t("venueSort.city") },
  ], [t]);

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`/lieux?${params.toString()}`);
      });
    },
    [router]
  );

  const updateParam = useCallback(
    (key: string, value: string, defaultValue = "") => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== defaultValue) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      navigate(params);
    },
    [searchParams, navigate]
  );

  const sortLabel = useMemo(
    () =>
      SORT_OPTIONS.find((o) => o.value === currentSort)?.shortLabel ??
      t("venueSort.surfaceDescShort"),
    [SORT_OPTIONS, currentSort, t]
  );

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-prune/10 bg-sable/95 px-4 py-3 backdrop-blur-sm md:top-20 md:-mx-0 md:rounded-md md:border md:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-prune/80">
        <span className="text-prune font-serif text-[15px] normal-case tracking-normal tabular-nums">
          {t("total.venues", { count: total })}
        </span>

        <span className="text-prune/30">·</span>

        <span className="flex items-center gap-1.5">
          <span className="text-prune/55">{t("sort.label")}</span>
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5">
              <span>{sortLabel}</span>
              <span aria-hidden className="text-prune/50">
                ▾
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="flex flex-col">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <PopoverClose
                      onClick={() =>
                        updateParam("sort", opt.value, "surface-desc")
                      }
                      className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                        currentSort === opt.value
                          ? "font-medium text-prune"
                          : "text-prune/70"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentSort === opt.value && (
                        <span className="text-ocre" aria-hidden>
                          ●
                        </span>
                      )}
                    </PopoverClose>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </span>

        <span className="text-prune/30">·</span>

        <span className="flex items-center gap-1.5">
          <span className="text-prune/55">{t("sort.city")}</span>
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5">
              <span className="max-w-[16ch] truncate">{currentCity || t("allShort")}</span>
              <span aria-hidden className="text-prune/50">
                ▾
              </span>
            </PopoverTrigger>
            <PopoverContent className="max-h-[60vh] overflow-y-auto">
              <ul className="flex flex-col">
                <li>
                  <PopoverClose
                    onClick={() => updateParam("city", "")}
                    className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                      !currentCity ? "font-medium text-prune" : "text-prune/70"
                    }`}
                  >
                    <span>{t("allCities")}</span>
                    {!currentCity && (
                      <span className="text-ocre" aria-hidden>
                        ●
                      </span>
                    )}
                  </PopoverClose>
                </li>
                {cities.map((city) => (
                  <li key={city}>
                    <PopoverClose
                      onClick={() => updateParam("city", city)}
                      className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                        currentCity === city
                          ? "font-medium text-prune"
                          : "text-prune/70"
                      }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && (
                        <span className="text-ocre" aria-hidden>
                          ●
                        </span>
                      )}
                    </PopoverClose>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </span>
      </div>
    </div>
  );
}
