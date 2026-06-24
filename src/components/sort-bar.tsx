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

type SortBarProps = {
  total: number;
  cities: string[];
};

type SortOption = {
  value: string;
  label: string;
  shortLabel: string;
};

/**
 * Bandeau horizontal sticky au-dessus de la grille listing salons.
 * Affiche le total + trois popovers éditoriaux : tri, ville, période.
 * Typo mono small caps, séparateurs ·, style institutionnel.
 */
export function SortBar({ total, cities }: SortBarProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") ?? "date";
  const currentCity = searchParams.get("city") ?? "";
  const currentPeriod = searchParams.get("period") ?? "";

  const SORT_OPTIONS: SortOption[] = useMemo(() => [
    { value: "date", label: t("sortOptions.dateAsc"), shortLabel: t("sortOptions.dateAscShort") },
    { value: "date-desc", label: t("sortOptions.dateDesc"), shortLabel: t("sortOptions.dateDescShort") },
    { value: "visitors", label: t("sortOptions.visitors"), shortLabel: t("sortOptions.visitorsShort") },
    { value: "name", label: t("sortOptions.name"), shortLabel: t("sortOptions.nameShort") },
  ], [t]);

  const PERIOD_OPTIONS: SortOption[] = useMemo(() => [
    { value: "", label: t("periods.all"), shortLabel: t("sortOptions.allDatesShort") },
    { value: "this-month", label: t("periods.thisMonth"), shortLabel: t("periods.thisMonth") },
    { value: "next-quarter", label: t("periods.nextQuarter"), shortLabel: t("periods.nextQuarter") },
    { value: "2026", label: t("periods.2026"), shortLabel: t("periods.2026") },
    { value: "2027", label: t("periods.2027"), shortLabel: t("periods.2027") },
  ], [t]);

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`/salons?${params.toString()}`);
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
      params.delete("page");
      navigate(params);
    },
    [searchParams, navigate]
  );

  const sortLabel = useMemo(
    () => SORT_OPTIONS.find((o) => o.value === currentSort)?.shortLabel ?? t("sortOptions.dateAscShort"),
    [SORT_OPTIONS, currentSort, t]
  );

  const periodLabel = useMemo(
    () =>
      PERIOD_OPTIONS.find((o) => o.value === currentPeriod)?.shortLabel ??
      t("sortOptions.allDatesShort"),
    [PERIOD_OPTIONS, currentPeriod, t]
  );

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-prune/10 bg-sable/95 px-4 py-3 backdrop-blur-sm md:top-20 md:-mx-0 md:rounded-md md:border md:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-prune/80">
        <span className="text-prune">
          <span className="font-serif text-[15px] normal-case tracking-normal text-prune tabular-nums">
            {total}
          </span>{" "}
          {/* Pluralisation simple : total salon(s). La forme plurielle FR/EN varie peu ici. */}
          salon{total > 1 ? "s" : ""}
        </span>

        <span className="text-prune/30">·</span>

        <span className="flex items-center gap-1.5">
          <span className="text-prune/55">{t("sort.label")}</span>
          <Popover>
            <PopoverTrigger
              className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5"
            >
              <span>{sortLabel}</span>
              <span aria-hidden className="text-prune/50">▾</span>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="flex flex-col">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <PopoverClose
                      onClick={() => updateParam("sort", opt.value, "date")}
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
            <PopoverTrigger
              className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5"
            >
              <span className="max-w-[16ch] truncate">{currentCity || t("allShort")}</span>
              <span aria-hidden className="text-prune/50">▾</span>
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

        <span className="text-prune/30">·</span>

        <span className="flex items-center gap-1.5">
          <span className="text-prune/55">{t("sort.period")}</span>
          <Popover>
            <PopoverTrigger
              className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5"
            >
              <span>{periodLabel}</span>
              <span aria-hidden className="text-prune/50">▾</span>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="flex flex-col">
                {PERIOD_OPTIONS.map((opt) => (
                  <li key={opt.value || "all"}>
                    <PopoverClose
                      onClick={() => updateParam("period", opt.value)}
                      className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                        currentPeriod === opt.value
                          ? "font-medium text-prune"
                          : "text-prune/70"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentPeriod === opt.value && (
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
