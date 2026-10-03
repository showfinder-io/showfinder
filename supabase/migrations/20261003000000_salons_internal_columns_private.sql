-- Colonnes internes et brouillons fermés à la lecture publique (2026-10-03).
--
-- Constat : la policy « Lecture publique salons » (USING true) et le GRANT
-- SELECT de table donnés à anon et authenticated rendaient lisibles, avec la
-- clé publique, les notes internes de l'équipe (notes_internes,
-- scraper_conflicts, locked_fields, alert_flag) et les 48 fiches en brouillon
-- (données non vérifiées, règle CLAUDE.md #13).
--
-- 1. Brouillons : lisibles seulement par les rôles admin et editor.
-- 2. Colonnes internes : SELECT retiré à anon et authenticated, les autres
--    colonnes restent accordées une à une. Toute NOUVELLE colonne publique
--    de salons doit être accordée explicitement dans sa migration
--    (src/lib/salon-columns.ts). Les scripts (service_role) ne sont pas
--    concernés. INSERT, UPDATE et DELETE restent régis par les policies.
-- 3. Vue salons_ordered recréée sans les colonnes internes.
-- 4. admin_salon_internals(ids) : lecture des colonnes internes pour les
--    rôles admin et editor (SECURITY DEFINER, contrôle de rôle explicite).

-- 1. Brouillons
DROP POLICY IF EXISTS "Lecture publique salons" ON public.salons;
CREATE POLICY "Lecture publique salons" ON public.salons
  FOR SELECT
  USING (
    status <> 'draft'
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND (user_roles.role)::text IN ('admin', 'editor')
    )
  );

-- 2. Colonnes internes
REVOKE SELECT ON public.salons FROM anon, authenticated;
GRANT SELECT (
  id, slug, name, edition_year, description, start_date, end_date, city, venue,
  venue_lat, venue_lng, country, website_url, organizer_name, organizer_email,
  frequency, estimated_exhibitors, estimated_visitors, is_premium, status,
  logo_url, cover_image_url, seo_title, seo_description, created_at, updated_at,
  venue_id, is_locked, source_url, last_scraped_at, is_agoris_certified,
  co_organizer_name, edition_number, last_human_check_at, last_ia_update_at,
  editorial_mdx, editorial_updated_at, category, category_to_confirm,
  dates_confirmed, description_en, editorial_mdx_en, seo_title_en,
  seo_description_en
) ON public.salons TO anon, authenticated;

-- 3. Vue salons_ordered sans colonnes internes
DROP VIEW IF EXISTS public.salons_ordered;
CREATE VIEW public.salons_ordered
WITH (security_invoker = on)
AS
SELECT
  s.id, s.slug, s.name, s.edition_year, s.description, s.start_date, s.end_date,
  s.city, s.venue, s.venue_lat, s.venue_lng, s.country, s.website_url,
  s.organizer_name, s.organizer_email, s.frequency, s.estimated_exhibitors,
  s.estimated_visitors, s.is_premium, s.status, s.logo_url, s.cover_image_url,
  s.seo_title, s.seo_description, s.created_at, s.updated_at, s.venue_id,
  s.is_locked, s.source_url, s.last_scraped_at, s.is_agoris_certified,
  s.co_organizer_name, s.edition_number, s.last_human_check_at,
  s.last_ia_update_at, s.editorial_mdx, s.editorial_updated_at, s.category,
  s.category_to_confirm, s.dates_confirmed,
  CASE
    WHEN s.start_date IS NULL THEN '2_'
    WHEN s.start_date >= CURRENT_DATE THEN '0_' || TO_CHAR(s.start_date, 'YYYY-MM-DD')
    ELSE '1_' || LPAD((99999999 - TO_CHAR(s.start_date, 'YYYYMMDD')::INTEGER)::TEXT, 8, '0')
  END AS sort_key,
  lower(unaccent(coalesce(s.name, ''))) AS name_search,
  lower(unaccent(coalesce(s.description, ''))) AS description_search
FROM public.salons s;

GRANT SELECT ON public.salons_ordered TO anon, authenticated;

-- 4. Lecture admin des colonnes internes
CREATE OR REPLACE FUNCTION public.admin_salon_internals(p_ids uuid[])
RETURNS TABLE (
  id uuid,
  notes_internes text,
  scraper_conflicts jsonb,
  locked_fields jsonb,
  alert_flag boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND (user_roles.role)::text IN ('admin', 'editor')
  ) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT s.id, s.notes_internes, s.scraper_conflicts, s.locked_fields, s.alert_flag
    FROM public.salons s
    WHERE s.id = ANY (p_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_salon_internals(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_salon_internals(uuid[]) TO authenticated;
