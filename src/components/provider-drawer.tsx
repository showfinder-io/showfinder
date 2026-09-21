"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  DAILY_ROTATION_STRIDE,
  REGIONS,
  getRegion,
  parseZone,
  rotateDaily,
  splitByZone,
  zoneLabel,
  zoneParam,
  type Zone,
} from "@/lib/geo-fr";
import type { DrawerProvider } from "@/lib/queries";

type DrawerHub = { slug: string; category: string; departments: string[] };

type DrawerData = {
  providers: DrawerProvider[];
  venueDepartment: string | null;
  hubs: DrawerHub[];
  dayIndex: number;
};

type ProviderDrawerProps = {
  salonId: string;
  salonName: string;
  salonSlug?: string;
};

// Règle d'affichage (décision Nicolas 2026-09-21) : aucun rattachement prestataire / salon.
// Un exposant choisit son standiste près de son siège : la zone est saisie par l'utilisateur.
// Les autres métiers se choisissent près du parc : préfiltre sur la zone du lieu du salon.
const EXHIBITOR_ZONE_CATEGORY = "standiste";
const CATEGORY_ORDER = [
  "standiste",
  "location_mobilier",
  "av_technique",
  "traiteur",
  "transport",
  "photographe",
  "hebergement",
  "autre",
];
const ZONE_STORAGE_KEY = "agoris:exhibitor-zone";

type Scope = "department" | "region" | "widened" | "all";

type Selection = {
  items: DrawerProvider[];
  scope: Scope;
  // Zone réellement appliquée (null si France entière) : sert au lien « voir tous »
  zone: Zone | null;
};

/**
 * Prestataires d'une catégorie pour une zone : toute la région, le département en tête. La zone
 * est celle de l'exposant pour les standistes, celle du lieu pour les autres métiers. Région vide
 * (l'inventaire hors Île-de-France est encore mince) : sélection France entière, annoncée.
 */
function selectProviders(list: DrawerProvider[], zone: Zone | null, dayIndex: number): Selection {
  if (!zone) return { items: rotateDaily(list, dayIndex), scope: "all", zone: null };
  const split = splitByZone(list, zone);
  const items = [...rotateDaily(split.department, dayIndex), ...rotateDaily(split.region, dayIndex)];
  if (items.length === 0) return { items: rotateDaily(list, dayIndex), scope: "widened", zone: null };
  return { items, scope: split.department.length > 0 ? "department" : "region", zone };
}

/** Lien « voir tous » : hub local s'il couvre le département, hub national sans zone, sinon listing filtré. */
function seeAllHref(category: string, zone: Zone | null, hubs: DrawerHub[]): string {
  const categoryHubs = hubs.filter((h) => h.category === category);
  const hub = zone
    ? categoryHubs.find((h) => zone.department !== null && h.departments.includes(zone.department))
    : categoryHubs.find((h) => h.departments.length === 0);
  if (hub) return `/prestataires/${hub.slug}`;
  const params = new URLSearchParams({ category });
  if (zone) params.set("zone", zoneParam(zone));
  return `/prestataires?${params.toString()}`;
}

function readStoredZone(): Zone | null {
  try {
    return parseZone(window.localStorage.getItem(ZONE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function storeZone(zone: Zone | null) {
  try {
    if (zone) window.localStorage.setItem(ZONE_STORAGE_KEY, zone.postalCode ?? zoneParam(zone));
    else window.localStorage.removeItem(ZONE_STORAGE_KEY);
  } catch {
    // Stockage indisponible (navigation privée) : la zone vit le temps de la session.
  }
}

export function ProviderDrawer({ salonId, salonName, salonSlug }: ProviderDrawerProps) {
  const t = useTranslations("salon-detail.providers");
  const [data, setData] = useState<DrawerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [exhibitorZone, setExhibitorZone] = useState<Zone | null>(null);
  const [postalInput, setPostalInput] = useState("");
  const [nearVenue, setNearVenue] = useState(true);

  async function loadProviders() {
    if (loaded) return;
    setLoading(true);
    const stored = readStoredZone();
    if (stored) {
      setExhibitorZone(stored);
      setPostalInput(stored.postalCode ?? "");
    }
    try {
      const res = await fetch(`/api/providers/drawer/${salonId}`);
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  function applyExhibitorZone(zone: Zone | null) {
    setExhibitorZone(zone);
    storeZone(zone);
    if (zone) trackEvent("filter_change", { filter_name: "provider_zone", filter_value: `r${zone.region}` });
  }

  function onPostalChange(raw: string) {
    const value = raw.replace(/\D/g, "").slice(0, 5);
    setPostalInput(value);
    if (value.length === 5) applyExhibitorZone(parseZone(value));
    else if (exhibitorZone?.postalCode) applyExhibitorZone(null);
  }

  const providers = data?.providers ?? [];
  const venueZone = parseZone(data?.venueDepartment);
  const postalInvalid = postalInput.length === 5 && !parseZone(postalInput);

  const sections = CATEGORY_ORDER.map((category) => {
    const list = providers.filter((p) => p.category === category);
    const byExhibitor = category === EXHIBITOR_ZONE_CATEGORY;
    const zone = byExhibitor ? exhibitorZone : nearVenue ? venueZone : null;
    return { category, byExhibitor, total: list.length, ...selectProviders(list, zone, data?.dayIndex ?? 0) };
  }).filter((s) => s.total > 0);

  const scopeNote = (section: (typeof sections)[number]): string | null => {
    if (section.scope === "all") return null;
    const regionName = getRegion((section.byExhibitor ? exhibitorZone : venueZone)?.region)?.name ?? "";
    if (section.byExhibitor) {
      if (section.scope === "widened") return t("scope.exhibitorWidened");
      return section.scope === "department"
        ? t("scope.exhibitorDepartment", { zone: zoneLabel(section.zone!) })
        : t("scope.exhibitorRegion", { zone: regionName });
    }
    if (section.scope === "department") return t("scope.venueDepartment", { zone: zoneLabel(section.zone!) });
    return section.scope === "region"
      ? t("scope.venueRegion", { zone: regionName })
      : t("scope.venueWidened", { zone: regionName });
  };

  // Calm tech : une même note n'est pas répétée de section en section, et la bascule disparaît
  // quand elle ne changerait rien (aucun prestataire dans la région du salon, tous métiers confondus).
  const notes = sections.map(scopeNote);
  const toggleUseful = venueZone !== null && sections.some((s) => !s.byExhibitor && s.scope !== "widened");

  return (
    <section className="mt-12">
      <Sheet
        onOpenChange={(open) => {
          if (open) {
            loadProviders();
            trackEvent("provider_drawer_open", { salon_slug: salonSlug });
          }
        }}
      >
        <SheetTrigger className="group block w-full rounded-lg bg-prune p-8 text-left text-papier transition-opacity hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable md:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ocre px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-prune">
            {t("badgeLabel")}
          </span>
          <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-papier/75">
            {t("description", { salonName })}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ocre transition-transform group-hover:translate-x-1">
            {t("cta")}
            <span aria-hidden="true">→</span>
          </span>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto bg-sable text-prune data-[side=right]:w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-prune">
              {t("drawerTitle", { salonName })}
            </SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-10">
            {loading && (
              <p className="text-sm text-muted">{t("loading")}</p>
            )}

            {!loading && loaded && sections.length === 0 && (
              <div className="rounded-lg border border-border bg-ivoire py-10 px-6 text-center">
                <p className="text-sm text-muted">
                  {t("empty")}
                </p>
                <p className="mt-4 text-sm text-prune">
                  {t("areYouProvider")}{" "}
                  <Link
                    href="/contact"
                    className="font-medium underline decoration-prune/30 underline-offset-2 hover:decoration-prune"
                  >
                    {t("contactUs")}
                  </Link>
                </p>
              </div>
            )}

            {!loading && sections.length > 0 && (
              <p className="mb-6 text-sm leading-relaxed text-muted">{t("intro")}</p>
            )}

            {/* Bascule du préfiltre « près du salon » (hors standistes), seulement si le lieu est localisé */}
            {!loading && sections.length > 0 && (toggleUseful || !nearVenue) && (
              <div
                role="group"
                aria-label={t("venueToggle.label")}
                className="mb-7 grid grid-cols-2 gap-1 rounded-lg border border-prune/15 bg-papier p-1 text-sm"
              >
                {[true, false].map((near) => (
                  <button
                    key={String(near)}
                    type="button"
                    aria-pressed={nearVenue === near}
                    onClick={() => setNearVenue(near)}
                    className={`min-h-11 rounded-md px-3 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-prune ${
                      nearVenue === near ? "bg-prune text-papier" : "text-prune hover:bg-prune/5"
                    }`}
                  >
                    {near ? t("venueToggle.near") : t("venueToggle.all")}
                  </button>
                ))}
              </div>
            )}

            {!loading &&
              sections.map((section, index) => {
                const shown = section.items.slice(0, DAILY_ROTATION_STRIDE);
                const note = index > 0 && notes[index] === notes[index - 1] ? null : notes[index];
                const href = seeAllHref(section.category, section.zone, data?.hubs ?? []);
                const categoryLabel = t(`categories.${section.category}` as Parameters<typeof t>[0]);
                return (
                  <div key={section.category} className="mb-9">
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {categoryLabel}
                    </h3>

                    {section.byExhibitor && (
                      <div
                        role="group"
                        aria-labelledby="exhibitor-zone-legend"
                        className="mb-4 rounded-lg border border-prune/15 bg-papier p-4"
                      >
                        <p id="exhibitor-zone-legend" className="mb-3 font-serif text-lg text-prune">
                          {t("zoneField.legend")}
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <label className="block text-xs text-muted">
                            {t("zoneField.postalCode")}
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              maxLength={5}
                              value={postalInput}
                              onChange={(e) => onPostalChange(e.target.value)}
                              aria-invalid={postalInvalid}
                              className="mt-1 block h-11 w-full rounded-md border border-prune/30 bg-papier px-3 text-base text-prune focus:border-prune focus:outline-none focus-visible:ring-2 focus-visible:ring-prune/30"
                            />
                          </label>
                          <label className="block text-xs text-muted">
                            {t("zoneField.region")}
                            <select
                              value={exhibitorZone && !exhibitorZone.postalCode ? zoneParam(exhibitorZone) : ""}
                              onChange={(e) => {
                                setPostalInput("");
                                applyExhibitorZone(parseZone(e.target.value));
                              }}
                              className="mt-1 block h-11 w-full rounded-md border border-prune/30 bg-papier px-2 text-base text-prune focus:border-prune focus:outline-none focus-visible:ring-2 focus-visible:ring-prune/30"
                            >
                              <option value="">{t("zoneField.anyRegion")}</option>
                              {REGIONS.map((r) => (
                                <option key={r.code} value={`r${r.code}`}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        {postalInvalid && (
                          <p role="alert" className="mt-2 text-xs text-prune">{t("zoneField.invalid")}</p>
                        )}
                      </div>
                    )}

                    {note && <p className="mb-3 text-xs leading-relaxed text-muted">{note}</p>}

                    <div className="space-y-2.5">
                      {shown.map((p) => {
                        const isPremium = p.subscription_tier === "premium";
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center justify-between rounded-lg border p-3 transition-shadow hover:shadow-sm ${
                              isPremium
                                ? "border-ocre/40 bg-ocre/10"
                                : "border-border bg-ivoire"
                            }`}
                          >
                            <Link
                              href={`/prestataires/${p.slug}`}
                              className="flex-1"
                            >
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-medium text-prune">
                                  {p.company_name}
                                </span>
                                {p.is_verified && (
                                  <BadgeCheck
                                    className="h-3.5 w-3.5 text-prune"
                                    aria-label={t("verifiedAriaLabel")}
                                  />
                                )}
                                {isPremium && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-ocre px-2 py-0.5 text-[10px] font-semibold text-prune">
                                    <Star className="h-2.5 w-2.5 fill-prune" />
                                    {t("recommended")}
                                  </span>
                                )}
                              </div>
                              {p.city && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                                  <MapPin className="h-3 w-3" aria-hidden="true" />
                                  {p.city}
                                  {p.department ? ` (${p.department})` : ""}
                                </div>
                              )}
                            </Link>
                            <Link
                              href={`/prestataires/${p.slug}`}
                              className="ml-3 shrink-0 rounded-md border border-prune/30 px-2.5 py-1 text-xs font-medium text-prune transition-colors hover:bg-prune hover:text-papier"
                            >
                              {t("quote")}
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                    {(section.total > shown.length || href.startsWith("/prestataires/")) && (
                      <Link
                        href={href}
                        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-prune underline decoration-prune/30 underline-offset-4 hover:decoration-prune"
                      >
                        {t("seeAll", { category: categoryLabel })}
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
