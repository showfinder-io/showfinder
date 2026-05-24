-- Rename "Agoris Verified" → "Agoris Certified" (cohérence avec les pages
-- éditoriales secteurs + méthodologie rédigées par Nicolas, mai 2026).
--
-- Renomme la colonne, l'index partiel et le commentaire.
-- La vue salons_ordered (créée dans 20260519000001_..._unaccent_search.sql)
-- expose s.* et est propagée automatiquement par PostgreSQL.

ALTER TABLE public.salons
  RENAME COLUMN is_agoris_verified TO is_agoris_certified;

ALTER INDEX IF EXISTS idx_salons_is_agoris_verified
  RENAME TO idx_salons_is_agoris_certified;

COMMENT ON COLUMN public.salons.is_agoris_certified IS
  'Badge "Agoris Certified". Toggle manuel via l''admin par l''équipe éditoriale.';
