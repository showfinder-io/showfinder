import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

// Types helpers
export type SalonRow = {
  id: string;
  slug: string;
  name: string;
  edition_year: number | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  city: string | null;
  venue: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  country: string;
  website_url: string | null;
  organizer_name: string | null;
  frequency: string | null;
  estimated_exhibitors: number | null;
  estimated_visitors: number | null;
  is_premium: boolean;
  status: string;
  logo_url: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};

export type SectorRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

// Version legere pour les jointures (sans description)
export type SectorSummary = {
  id: string;
  slug: string;
  name: string;
};

export type SalonWithSectors = SalonRow & {
  sectors: SectorSummary[];
};

export type SalonTagRow = {
  id: string;
  label: string;
  category: string | null;
  color: string | null;
};

// Filtres pour la liste des salons
export type SalonFilters = {
  search?: string;
  sector?: string;
  city?: string;
  month?: string; // format "2026-03"
  period?: string; // "this-month" | "next-quarter" | "2026" | "2027"
  page?: number;
  pageSize?: number;
  sort?: "date" | "name";
  upcoming?: boolean;
};

// Requetes
// ------------------------------------------------------------

export async function getSalons(filters: SalonFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("salons")
    .select("*, salon_sectors(sector_id, sectors(id, slug, name))", {
      count: "exact",
    })
    .eq("status", "published");

  // Filtre salons a venir uniquement
  if (filters.upcoming) {
    query = query.gte("start_date", new Date().toISOString().split("T")[0]);
  }

  // Recherche texte
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Filtre ville
  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  // Filtre mois (format "2026-03")
  if (filters.month) {
    const [year, month] = filters.month.split("-");
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = new Date(Number(year), Number(month), 0)
      .toISOString()
      .split("T")[0];
    query = query.gte("start_date", startOfMonth).lte("start_date", endOfMonth);
  }

  // Filtre période
  if (filters.period) {
    const now = new Date();
    if (filters.period === "this-month") {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const startOfMonth = `${y}-${m}-01`;
      const endOfMonth = new Date(y, now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
      query = query
        .gte("start_date", startOfMonth)
        .lte("start_date", endOfMonth);
    } else if (filters.period === "next-quarter") {
      const today = now.toISOString().split("T")[0];
      const threeMonthsLater = new Date(now);
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      const endDate = threeMonthsLater.toISOString().split("T")[0];
      query = query.gte("start_date", today).lte("start_date", endDate);
    } else if (/^\d{4}$/.test(filters.period)) {
      // Filtre par année (ex: "2026", "2027")
      query = query
        .gte("start_date", `${filters.period}-01-01`)
        .lte("start_date", `${filters.period}-12-31`);
    }
  }

  // Tri
  if (filters.sort === "name") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("start_date", { ascending: true, nullsFirst: false });
  }

  // Pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;

  if (error) throw error;

  // Transformer la structure pour aplatir les secteurs
  const salons: SalonWithSectors[] = (data ?? []).map((salon) => {
    const sectors = (salon.salon_sectors as Array<{ sectors: SectorSummary }>)
      .map((ss) => ss.sectors)
      .filter(Boolean);
    const { salon_sectors: _, ...rest } = salon;
    return { ...rest, sectors } as SalonWithSectors;
  });

  return { salons, total: count ?? 0, page, pageSize };
}

// Filtre par secteur (multi-slug, séparés par virgule)
export async function getSalonsBySector(
  sectorSlug: string,
  filters: Omit<SalonFilters, "sector"> = {}
) {
  const slugs = sectorSlug.split(",").map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) return { salons: [], total: 0, page: 1, pageSize: 20 };
  const supabase = await createClient();

  // Recuperer les IDs des secteurs
  const { data: sectorRows } = await supabase
    .from("sectors")
    .select("id")
    .in("slug", slugs);

  const sectorIds = (sectorRows ?? []).map((s) => s.id);
  if (sectorIds.length === 0) return { salons: [], total: 0, page: 1, pageSize: 20 };

  // Recuperer les salon_ids associes
  const { data: salonSectors } = await supabase
    .from("salon_sectors")
    .select("salon_id")
    .in("sector_id", sectorIds);

  const salonIds = (salonSectors ?? []).map((ss) => ss.salon_id);
  if (salonIds.length === 0)
    return { salons: [], total: 0, page: 1, pageSize: 20 };

  // Utiliser getSalons avec un filtre d'IDs
  return getSalonsById(salonIds, filters);
}

async function getSalonsById(
  ids: string[],
  filters: Omit<SalonFilters, "sector"> = {}
) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("salons")
    .select("*, salon_sectors(sector_id, sectors(id, slug, name))", {
      count: "exact",
    })
    .eq("status", "published")
    .in("id", ids);

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  // Filtre période
  if (filters.period) {
    const now = new Date();
    if (filters.period === "this-month") {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      query = query
        .gte("start_date", `${y}-${m}-01`)
        .lte("start_date", new Date(y, now.getMonth() + 1, 0).toISOString().split("T")[0]);
    } else if (filters.period === "next-quarter") {
      const today = now.toISOString().split("T")[0];
      const later = new Date(now);
      later.setMonth(later.getMonth() + 3);
      query = query.gte("start_date", today).lte("start_date", later.toISOString().split("T")[0]);
    } else if (/^\d{4}$/.test(filters.period)) {
      query = query
        .gte("start_date", `${filters.period}-01-01`)
        .lte("start_date", `${filters.period}-12-31`);
    }
  }

  // Tri
  if (filters.sort === "name") {
    query = query.order("name", { ascending: true });
  } else {
    query = query.order("start_date", { ascending: true, nullsFirst: false });
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  const salons: SalonWithSectors[] = (data ?? []).map((salon) => {
    const sectors = (salon.salon_sectors as Array<{ sectors: SectorSummary }>)
      .map((ss) => ss.sectors)
      .filter(Boolean);
    const { salon_sectors: _, ...rest } = salon;
    return { ...rest, sectors } as SalonWithSectors;
  });

  return { salons, total: count ?? 0, page, pageSize };
}

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .select(
      "*, salon_sectors(sector_id, sectors(id, slug, name)), salon_tags(id, label, category, color)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const sectors = (data.salon_sectors as Array<{ sectors: SectorSummary }>)
    .map((ss) => ss.sectors)
    .filter(Boolean);

  const tags = (data.salon_tags ?? []) as SalonTagRow[];

  const { salon_sectors: _, salon_tags: __, ...rest } = data;

  return { ...rest, sectors, tags } as SalonWithSectors & {
    tags: SalonTagRow[];
  };
}

export async function getSectors() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sectors")
    .select("id, slug, name, description")
    .order("name");

  if (error) throw error;
  return (data ?? []) as SectorRow[];
}

export async function getCities() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .select("city")
    .eq("status", "published")
    .not("city", "is", null)
    .order("city");

  if (error) throw error;

  // Deduplicate
  const cities = [...new Set((data ?? []).map((s) => s.city).filter(Boolean))];
  return cities as string[];
}

export async function getSimilarSalons(
  salonId: string,
  sectorIds: string[],
  limit = 4
) {
  if (sectorIds.length === 0) return [];

  const supabase = await createClient();

  // Trouver les salons qui partagent au moins un secteur
  const { data: salonSectors } = await supabase
    .from("salon_sectors")
    .select("salon_id")
    .in("sector_id", sectorIds)
    .neq("salon_id", salonId);

  const salonIds = [
    ...new Set((salonSectors ?? []).map((ss) => ss.salon_id)),
  ];

  if (salonIds.length === 0) return [];

  const { data, error } = await supabase
    .from("salons")
    .select("*, salon_sectors(sector_id, sectors(id, slug, name))")
    .eq("status", "published")
    .in("id", salonIds)
    .order("start_date", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((salon) => {
    const sectors = (salon.salon_sectors as Array<{ sectors: SectorSummary }>)
      .map((ss) => ss.sectors)
      .filter(Boolean);
    const { salon_sectors: _, ...rest } = salon;
    return { ...rest, sectors } as SalonWithSectors;
  });
}

// Utilise le client statique (pas de cookies) pour generateStaticParams
export async function getAllSalonSlugs() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("salons")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((s) => s.slug);
}

// ============================================================
// Prestataires
// ============================================================

export type ProviderRow = {
  id: string;
  slug: string;
  company_name: string;
  category: string;
  description: string | null;
  city: string | null;
  coverage_radius_km: number | null;
  zone_intervention: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_verified: boolean;
  subscription_tier: string;
  avg_rating: number;
  review_count: number;
};

export const PROVIDER_CATEGORY_LABELS: Record<string, string> = {
  standiste: "Standiste",
  traiteur: "Traiteur",
  av_technique: "Audiovisuel",
  photographe: "Photographe",
  transport: "Transport",
  hebergement: "Hébergement",
  autre: "Autre",
};

export type ProviderFilters = {
  category?: string;
  city?: string;
};

export async function getProviders(filters: ProviderFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("providers")
    .select("*")
    .order("is_verified", { ascending: false })
    .order("company_name");
  if (filters.category) query = query.eq("category", filters.category as never);
  if (filters.city) query = query.eq("city", filters.city);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProviderRow[];
}

export async function getProviderBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select("*, salon_providers(salon_id, is_featured, salons(id, slug, name, city, start_date)), provider_venues(venue_id, venues(id, slug, name, city))")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  type SalonJoin = { salons: { id: string; slug: string; name: string; city: string | null; start_date: string | null }; is_featured: boolean };
  const salons = (data.salon_providers as SalonJoin[])
    .map((sp) => ({ ...sp.salons, is_featured: sp.is_featured }))
    .filter(Boolean);
  type VenueJoin = { venues: { id: string; slug: string; name: string; city: string } };
  const venues = (data.provider_venues as VenueJoin[])
    .map((pv) => pv.venues)
    .filter(Boolean);
  const { salon_providers: _, provider_venues: __, ...rest } = data;
  return { ...rest, salons, venues } as ProviderRow & {
    salons: Array<{ id: string; slug: string; name: string; city: string | null; start_date: string | null; is_featured: boolean }>;
    venues: Array<{ id: string; slug: string; name: string; city: string }>;
  };
}

export async function getProvidersBySalon(salonId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salon_providers")
    .select("is_featured, providers(*)")
    .eq("salon_id", salonId)
    .order("is_featured", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((sp) => ({
    ...(sp.providers as unknown as ProviderRow),
    is_featured: sp.is_featured,
  }));
}

export async function getAllProviderSlugs() {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from("providers").select("slug");
  if (error) throw error;
  return (data ?? []).map((p) => p.slug);
}

export async function getProviderCities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("providers")
    .select("city")
    .not("city", "is", null)
    .order("city");
  if (error) throw error;
  const cities = [...new Set((data ?? []).map((p) => p.city).filter(Boolean))];
  return cities as string[];
}

// Tous les slugs de secteurs (pour generateStaticParams)
export async function getAllSectorSlugs() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("sectors")
    .select("slug");

  if (error) throw error;
  return (data ?? []).map((s) => s.slug);
}

// Recuperer un secteur par slug
export async function getSectorBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sectors")
    .select("id, slug, name, description")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as SectorRow;
}

// Salons filtres par ville
export async function getSalonsByCity(city: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .select("*, salon_sectors(sector_id, sectors(id, slug, name))")
    .eq("status", "published")
    .eq("city", city)
    .order("start_date", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return (data ?? []).map((salon) => {
    const sectors = (salon.salon_sectors as Array<{ sectors: SectorSummary }>)
      .map((ss) => ss.sectors)
      .filter(Boolean);
    const { salon_sectors: _, ...rest } = salon;
    return { ...rest, sectors } as SalonWithSectors;
  });
}

// Toutes les villes uniques avec leurs slugs (pour generateStaticParams)
export async function getAllCitySlugs() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("salons")
    .select("city")
    .eq("status", "published")
    .not("city", "is", null);

  if (error) throw error;

  const cities = [...new Set((data ?? []).map((s) => s.city).filter(Boolean))];
  return cities as string[];
}

// ============================================================
// Venues (lieux d'exposition)
// ============================================================

export type VenueRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string | null;
  postal_code: string | null;
  country: string;
  lat: number | null;
  lng: number | null;
  total_surface_sqm: number | null;
  website_url: string | null;
  description: string | null;
  photo_url: string | null;
  google_maps_url: string | null;
  created_at: string;
};

export async function getVenues() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as VenueRow[];
}

export async function getVenueBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as VenueRow;
}

export async function getSalonsByVenue(venueId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salons")
    .select("*, salon_sectors(sector_id, sectors(id, slug, name))")
    .eq("status", "published")
    .eq("venue_id", venueId)
    .order("start_date", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return (data ?? []).map((salon) => {
    const sectors = (salon.salon_sectors as Array<{ sectors: SectorSummary }>)
      .map((ss) => ss.sectors)
      .filter(Boolean);
    const { salon_sectors: _, ...rest } = salon;
    return { ...rest, sectors } as SalonWithSectors;
  });
}

export async function getAllVenueSlugs() {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("venues")
    .select("slug");

  if (error) throw error;
  return (data ?? []).map((v) => v.slug);
}
