-- Correctif : la migration 20260512000002_salon_categories.sql a été marquée
-- appliquée dans l'historique mais son DDL n'a jamais tourné en prod (colonnes
-- salons.category / category_to_confirm absentes ; la vue salons_ordered, en
-- SELECT s.*, ne les expose donc pas et le filtre catégorie de l'app est inerte).
-- Cette migration ré-exécute le DDL de façon idempotente puis recrée la vue
-- pour qu'elle ré-expanse s.* en incluant les nouvelles colonnes.
-- Diagnostic : 2026-06-13 (chantier catégorie).

-- 1. Type + colonnes (idempotent : ne casse rien si déjà présents)
DO $$ BEGIN
  CREATE TYPE public.salon_category AS ENUM (
    'salon_professionnel',
    'salon_grand_public',
    'congres',
    'autres'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS category public.salon_category,
  ADD COLUMN IF NOT EXISTS category_to_confirm BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.salons.category IS 'Catégorie métier (P1 brief). Backfill par LLM puis review admin.';
COMMENT ON COLUMN public.salons.category_to_confirm IS 'Marque les classifications LLM peu fiables, à valider via l''admin.';

-- 2. Recréation de salons_ordered (définition identique à 20260524000001) :
-- le SELECT s.* ré-expanse les colonnes au moment du CREATE et inclut donc
-- désormais category + category_to_confirm.
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
