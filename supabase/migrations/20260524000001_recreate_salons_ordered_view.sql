-- Recréation de la vue salons_ordered.
-- Le rename de colonne is_agoris_verified → is_agoris_certified (migration
-- 20260524000000) a propagé la nouvelle colonne en source de la vue, mais
-- PostgreSQL a conservé l'ancien nom comme alias de sortie :
--   "is_agoris_certified" AS "is_agoris_verified"
-- Conséquence : SELECT * FROM salons_ordered exposait toujours
-- is_agoris_verified, ce qui casse le code app refactoré.
-- DROP + CREATE force une ré-expansion propre de s.*.

DROP VIEW IF EXISTS public.salons_ordered;

CREATE VIEW public.salons_ordered
WITH (security_invoker = on)
AS
SELECT s.*,
  CASE
    WHEN s.start_date IS NULL THEN '2_'
    WHEN s.start_date >= CURRENT_DATE THEN '0_' || TO_CHAR(s.start_date, 'YYYY-MM-DD')
    ELSE '1_' || LPAD((99999999 - TO_CHAR(s.start_date, 'YYYYMMDD')::INTEGER)::TEXT, 8, '0')
  END AS sort_key,
  lower(unaccent(coalesce(s.name, ''))) AS name_search,
  lower(unaccent(coalesce(s.description, ''))) AS description_search
FROM public.salons s;

GRANT SELECT ON public.salons_ordered TO anon, authenticated;
