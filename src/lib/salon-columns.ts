/**
 * Colonnes de `salons` lisibles par le public (rôles anon et authenticated).
 *
 * Depuis la migration 20261003000000_salons_internal_columns_private, les
 * colonnes internes (notes_internes, scraper_conflicts, locked_fields,
 * alert_flag) ne sont plus accordées en SELECT aux rôles publics : un
 * `select("*")` sur `salons` ou `salons_ordered` échoue donc côté site.
 * Toujours lister les colonnes. L'admin lit les colonnes internes via la
 * fonction `admin_salon_internals` (réservée aux rôles admin et editor).
 *
 * Nouvelle colonne publique sur `salons` : l'ajouter ici ET l'accorder dans
 * sa migration (GRANT SELECT (col) ON public.salons TO anon, authenticated).
 */
export const SALON_PUBLIC_COLUMNS =
  "id, slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, organizer_email, frequency, estimated_exhibitors, estimated_visitors, is_premium, status, logo_url, cover_image_url, seo_title, seo_description, created_at, updated_at, venue_id, is_locked, source_url, last_scraped_at, is_agoris_certified, co_organizer_name, edition_number, last_human_check_at, last_ia_update_at, editorial_mdx, editorial_updated_at, category, category_to_confirm, dates_confirmed, description_en, editorial_mdx_en, seo_title_en, seo_description_en";

export const SALON_INTERNAL_COLUMNS = ["notes_internes", "scraper_conflicts", "locked_fields", "alert_flag"] as const;

export type SalonInternals = {
  id: string;
  notes_internes: string | null;
  scraper_conflicts: unknown;
  locked_fields: unknown;
  alert_flag: boolean | null;
};

/**
 * Complète des lignes salon avec leurs colonnes internes (admin uniquement).
 * Tolérant : si la fonction est absente ou refuse l'accès, les lignes sont
 * renvoyées telles quelles.
 */
export async function withSalonInternals<T extends { id: string }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  rows: T[]
): Promise<(T & Partial<SalonInternals>)[]> {
  if (rows.length === 0) return rows;
  const { data, error } = await supabase.rpc("admin_salon_internals", { p_ids: rows.map((r) => r.id) });
  if (error || !Array.isArray(data)) return rows;
  const byId = new Map((data as SalonInternals[]).map((d) => [d.id, d]));
  return rows.map((r) => ({ ...r, ...(byId.get(r.id) ?? {}) }));
}
