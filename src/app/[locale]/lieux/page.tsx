import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { getVenues, type VenueRow } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { VenueCard } from "@/components/venue-card";
import { VenueSortBar } from "@/components/venue-sort-bar";
import { SectionTitle } from "@/components/section-title";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "venues.listing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription", { siteName: siteConfig.name }),
    alternates: buildAlternates("/lieux", locale),
  };
}

type Props = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

/**
 * Tri appliqué côté serveur :
 *  - surface-desc (défaut) : surface totale en m² descendante, nulls last
 *  - surface-asc           : surface totale ascendante, nulls last
 *  - name                  : nom A-Z
 *  - city                  : groupé par ville, puis nom A-Z
 */
function sortVenues(venues: VenueRow[], sort: string): VenueRow[] {
  if (sort === "name") {
    return [...venues].sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
    );
  }
  if (sort === "city") {
    return [...venues].sort((a, b) => {
      const cmp = a.city.localeCompare(b.city, "fr", { sensitivity: "base" });
      if (cmp !== 0) return cmp;
      return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
    });
  }
  if (sort === "surface-asc") {
    return [...venues].sort((a, b) => {
      if (!a.total_surface_sqm && !b.total_surface_sqm) return 0;
      if (!a.total_surface_sqm) return 1;
      if (!b.total_surface_sqm) return -1;
      return a.total_surface_sqm - b.total_surface_sqm;
    });
  }
  // surface-desc default
  return [...venues].sort((a, b) => {
    if (!a.total_surface_sqm && !b.total_surface_sqm) return 0;
    if (!a.total_surface_sqm) return 1;
    if (!b.total_surface_sqm) return -1;
    return b.total_surface_sqm - a.total_surface_sqm;
  });
}

export default async function LieuxPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "venues.listing" });

  const sp = await searchParams;
  const city = sp.city ?? "";
  const sort = sp.sort ?? "surface-desc";

  const supabase = await createClient();
  const [venuesRaw, salonVenuesRes] = await Promise.all([
    getVenues(),
    supabase
      .from("salons")
      .select("venue_id")
      .eq("status", "published")
      .not("venue_id", "is", null),
  ]);

  // Comptage des salons par venue_id (un seul round-trip, comptage côté Node)
  const salonCountsByVenue = new Map<string, number>();
  for (const row of (salonVenuesRes.data ?? []) as Array<{
    venue_id: string;
  }>) {
    if (!row.venue_id) continue;
    salonCountsByVenue.set(
      row.venue_id,
      (salonCountsByVenue.get(row.venue_id) ?? 0) + 1
    );
  }

  // Filtre ville (pré-tri pour que le compteur affiché reflète bien la sélection)
  let venues = venuesRaw;
  if (city) venues = venues.filter((v) => v.city === city);

  // Tri
  venues = sortVenues(venues, sort);

  // Villes uniques pour le filtre (toujours sur l'ensemble brut, pas filtré)
  const cities = [...new Set(venuesRaw.map((v) => v.city).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <header className="mb-10 md:mb-14">
        <SectionTitle as="h1" size="xl" eyebrow={t("eyebrow")}>
          {t("heading")}
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-base text-muted">
          <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
            {venues.length}
          </span>{" "}
          {venues.length > 1
            ? t("countLabelMany")
            : t("countLabelOne")}
        </p>
      </header>

      <Suspense>
        <VenueSortBar total={venues.length} cities={cities} />
      </Suspense>

      {venues.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              salonCount={salonCountsByVenue.get(venue.id) ?? 0}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-prune/10 bg-ivoire p-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-prune/85">
            {t("emptyResult")}
            <br />
            {t("emptyHint")}
            <em className="not-italic text-ocre">.</em>
          </p>
        </div>
      )}
    </div>
  );
}
