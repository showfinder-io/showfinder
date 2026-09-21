"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getRegion, parseZone, zoneLabel, zoneParam } from "@/lib/geo-fr";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/popover";

type ProviderSortBarProps = {
  total: number;
  categories: Array<{ value: string; label: string }>;
  // Codes des régions qui comptent au moins un prestataire (on ne propose pas de région vide)
  regions: string[];
};

type SortOption = {
  value: string;
  label: string;
  shortLabel: string;
};

/**
 * Bandeau horizontal éditorial pour le listing /prestataires.
 * Aligné stylistiquement sur SortBar (salons), mais filtres en live via searchParams.
 * Typo mono small caps, séparateurs ·, popovers éditoriaux.
 */
export function ProviderSortBar({ total, categories, regions }: ProviderSortBarProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") ?? "notoriety";
  const currentCategory = searchParams.get("category") ?? "";
  // Proximité sans géocodage : code postal -> département -> région (src/lib/geo-fr.ts)
  const currentZone = parseZone(searchParams.get("zone"));
  const [zoneOpen, setZoneOpen] = useState(false);
  const [postalInput, setPostalInput] = useState("");
  const [postalInvalid, setPostalInvalid] = useState(false);

  const SORT_OPTIONS: SortOption[] = useMemo(() => [
    { value: "notoriety", label: t("providerSort.notoriety"), shortLabel: t("providerSort.notoriety") },
    { value: "name", label: t("sortOptions.name"), shortLabel: t("sortOptions.nameShort") },
    { value: "category", label: t("providerSort.category"), shortLabel: t("providerSort.category") },
    { value: "city", label: t("providerSort.city"), shortLabel: t("providerSort.city") },
  ], [t]);

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`/prestataires?${params.toString()}`);
      });
    },
    [router]
  );

  const updateParam = useCallback(
    (key: string, value: string, defaultValue = "") => {
      const params = new URLSearchParams(searchParams.toString());
      // L'ancien filtre ?city= (liens hérités) n'a plus de contrôle dans la barre : la zone le remplace
      if (key === "zone") params.delete("city");
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
      t("providerSort.notoriety"),
    [SORT_OPTIONS, currentSort, t]
  );

  const categoryLabel = useMemo(() => {
    if (!currentCategory) return t("allShort");
    return (
      categories.find((c) => c.value === currentCategory)?.label ??
      currentCategory
    );
  }, [currentCategory, categories, t]);

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-prune/10 bg-sable/95 px-4 py-3 backdrop-blur-sm md:top-20 md:-mx-0 md:rounded-md md:border md:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-prune/80">
        <span className="text-prune font-serif text-[15px] normal-case tracking-normal tabular-nums">
          {t("total.providers", { count: total })}
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
                        updateParam("sort", opt.value, "notoriety")
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
          <span className="text-prune/55">{t("providerSort.categoryLabel")}</span>
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5">
              <span className="max-w-[18ch] truncate">{categoryLabel}</span>
              <span aria-hidden className="text-prune/50">
                ▾
              </span>
            </PopoverTrigger>
            <PopoverContent className="max-h-[60vh] overflow-y-auto">
              <ul className="flex flex-col">
                <li>
                  <PopoverClose
                    onClick={() => updateParam("category", "")}
                    className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                      !currentCategory
                        ? "font-medium text-prune"
                        : "text-prune/70"
                    }`}
                  >
                    <span>{t("providerSort.allCategories")}</span>
                    {!currentCategory && (
                      <span className="text-ocre" aria-hidden>
                        ●
                      </span>
                    )}
                  </PopoverClose>
                </li>
                {categories.map((cat) => (
                  <li key={cat.value}>
                    <PopoverClose
                      onClick={() => updateParam("category", cat.value)}
                      className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                        currentCategory === cat.value
                          ? "font-medium text-prune"
                          : "text-prune/70"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {currentCategory === cat.value && (
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
          <span className="text-prune/55">{t("providerSort.zoneLabel")}</span>
          <Popover open={zoneOpen} onOpenChange={setZoneOpen}>
            <PopoverTrigger className="inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-prune transition-colors hover:bg-prune/5 focus-visible:bg-prune/5">
              <span className="max-w-[22ch] truncate">
                {currentZone ? zoneLabel(currentZone) : t("providerSort.allZones")}
              </span>
              <span aria-hidden className="text-prune/50">
                ▾
              </span>
            </PopoverTrigger>
            <PopoverContent className="max-h-[60vh] overflow-y-auto">
              <form
                className="mb-2 border-b border-prune/10 px-2.5 pb-3 pt-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const zone = parseZone(postalInput);
                  setPostalInvalid(!zone);
                  if (!zone) return;
                  updateParam("zone", zoneParam(zone));
                  setPostalInput("");
                  setZoneOpen(false);
                }}
              >
                <label className="block text-[11px] uppercase tracking-[0.14em] text-prune/55">
                  {t("providerSort.postalCode")}
                  <span className="mt-1 flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      value={postalInput}
                      onChange={(e) => {
                        setPostalInput(e.target.value.replace(/\D/g, "").slice(0, 5));
                        setPostalInvalid(false);
                      }}
                      // Entrée valide explicitement : on ne dépend pas de la soumission implicite du navigateur
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }}
                      aria-invalid={postalInvalid}
                      className="h-10 w-full min-w-0 rounded-sm border border-prune/30 bg-papier px-2 text-base normal-case tracking-normal text-prune focus:border-prune focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-10 shrink-0 rounded-sm border border-prune px-3 text-[13px] normal-case tracking-normal text-prune transition-colors hover:bg-prune hover:text-papier"
                    >
                      {t("providerSort.postalCodeSubmit")}
                    </button>
                  </span>
                </label>
                {postalInvalid && (
                  <p role="alert" className="mt-1.5 text-[12px] normal-case tracking-normal text-prune">
                    {t("providerSort.postalCodeInvalid")}
                  </p>
                )}
              </form>
              <ul className="flex flex-col" aria-label={t("providerSort.regions")}>
                <li>
                  <PopoverClose
                    onClick={() => updateParam("zone", "")}
                    className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                      !currentZone ? "font-medium text-prune" : "text-prune/70"
                    }`}
                  >
                    <span>{t("providerSort.allZones")}</span>
                    {!currentZone && (
                      <span className="text-ocre" aria-hidden>
                        ●
                      </span>
                    )}
                  </PopoverClose>
                </li>
                {regions.map((code) => {
                  const active = currentZone?.region === code && !currentZone.department;
                  return (
                    <li key={code}>
                      <PopoverClose
                        onClick={() => updateParam("zone", `r${code}`)}
                        className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] normal-case tracking-normal transition-colors hover:bg-prune/5 ${
                          active ? "font-medium text-prune" : "text-prune/70"
                        }`}
                      >
                        <span>{getRegion(code)?.name}</span>
                        {active && (
                          <span className="text-ocre" aria-hidden>
                            ●
                          </span>
                        )}
                      </PopoverClose>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </span>
      </div>
    </div>
  );
}
