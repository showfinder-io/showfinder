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
  page?: number;
  pageSize?: number;
  sort?: "date" | "name";
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

// Filtre par secteur : necessite une sous-requete
export async function getSalonsBySector(
  sectorSlug: string,
  filters: Omit<SalonFilters, "sector"> = {}
) {
  const supabase = await createClient();

  // Recuperer l'ID du secteur
  const { data: sector } = await supabase
    .from("sectors")
    .select("id")
    .eq("slug", sectorSlug)
    .single();

  if (!sector) return { salons: [], total: 0, page: 1, pageSize: 20 };

  // Recuperer les salon_ids associes
  const { data: salonSectors } = await supabase
    .from("salon_sectors")
    .select("salon_id")
    .eq("sector_id", sector.id);

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

  query = query
    .order("start_date", { ascending: true, nullsFirst: false })
    .range(offset, offset + pageSize - 1);

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
