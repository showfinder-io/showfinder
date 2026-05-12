-- Vue salons_ordered : encode l'ordre "à venir ASC puis passés DESC" dans un sort_key texte.
-- Usage côté app : SELECT * FROM salons_ordered ORDER BY sort_key ASC.
--   - upcoming (start_date >= CURRENT_DATE) → '0_' + YYYY-MM-DD  (ASC naturel)
--   - past     (start_date <  CURRENT_DATE) → '1_' + (99999999 - YYYYMMDD) (ASC = DESC sur la date)
--   - null                                  → '2_' (en fin)
-- security_invoker=on : la RLS de la table salons s'applique au caller, pas au owner de la vue.

CREATE OR REPLACE VIEW public.salons_ordered
WITH (security_invoker = on)
AS
SELECT s.*,
  CASE
    WHEN s.start_date IS NULL THEN '2_'
    WHEN s.start_date >= CURRENT_DATE THEN '0_' || TO_CHAR(s.start_date, 'YYYY-MM-DD')
    ELSE '1_' || LPAD((99999999 - TO_CHAR(s.start_date, 'YYYYMMDD')::INTEGER)::TEXT, 8, '0')
  END AS sort_key
FROM public.salons s;

COMMENT ON VIEW public.salons_ordered IS
  'Salons avec sort_key calculé : à venir croissant puis passés décroissant. Migration 20260512000000.';

GRANT SELECT ON public.salons_ordered TO anon, authenticated;
