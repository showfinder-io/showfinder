-- Catégories de salons (brief P1).
-- 4 valeurs métier : salon professionnel, salon grand public, congrès, autres.
-- Flag `category_to_confirm` : permet de marquer les classifications LLM peu fiables
-- pour review humaine dans l'admin, sans bloquer l'affichage.

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
COMMENT ON COLUMN public.salons.category_to_confirm IS 'Marque les classifications LLM peu fiables — à valider via l''admin.';
