-- Recréation complète de la view salons_ordered.
-- DROP + CREATE plutôt que CREATE OR REPLACE car ce dernier refuse de changer
-- l'ordre/le nom des colonnes existantes ; or nous avons besoin que `s.*` soit
-- ré-expansé pour inclure les colonnes ajoutées après la création initiale
-- (category, category_to_confirm, dates_confirmed, is_agoris_verified).
-- Sans cela ces colonnes sont invisibles dans les listings (cartes salons).
--
-- Ajout en parallèle de :
--  - name_search / description_search : lower(unaccent(...)) pour rendre la
--    recherche agnostique aux accents et à la casse côté app.

CREATE EXTENSION IF NOT EXISTS unaccent;

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
