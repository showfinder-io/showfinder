-- ============================================================
-- i18n Phase 0 : colonnes de contenu anglais (en-GB)
-- ============================================================
-- Ajout de colonnes _en nullables pour stocker les traductions anglaises
-- du contenu editorial. Le contenu francais reste la source ; une page n'est
-- servie en EN que si sa colonne _en correspondante est non nulle.
-- Les noms propres (salons, lieux) ne sont PAS traduits ; les noms de
-- secteurs le sont (Automobile -> Automotive, etc.).
-- Additif et nullable : aucun impact sur l'existant.
--
-- ROLLBACK :
--   ALTER TABLE salons  DROP COLUMN description_en, DROP COLUMN editorial_mdx_en, DROP COLUMN seo_title_en, DROP COLUMN seo_description_en;
--   ALTER TABLE sectors DROP COLUMN name_en, DROP COLUMN description_en, DROP COLUMN editorial_mdx_en, DROP COLUMN seo_title_en, DROP COLUMN seo_description_en;
--   ALTER TABLE venues  DROP COLUMN description_en, DROP COLUMN editorial_mdx_en, DROP COLUMN seo_title_en, DROP COLUMN seo_description_en;
-- ============================================================

BEGIN;

ALTER TABLE salons
  ADD COLUMN IF NOT EXISTS description_en     TEXT,
  ADD COLUMN IF NOT EXISTS editorial_mdx_en   TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en       VARCHAR,
  ADD COLUMN IF NOT EXISTS seo_description_en VARCHAR;

ALTER TABLE sectors
  ADD COLUMN IF NOT EXISTS name_en            VARCHAR,
  ADD COLUMN IF NOT EXISTS description_en     TEXT,
  ADD COLUMN IF NOT EXISTS editorial_mdx_en   TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en       VARCHAR,
  ADD COLUMN IF NOT EXISTS seo_description_en VARCHAR;

ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS description_en     TEXT,
  ADD COLUMN IF NOT EXISTS editorial_mdx_en   TEXT,
  ADD COLUMN IF NOT EXISTS seo_title_en       VARCHAR,
  ADD COLUMN IF NOT EXISTS seo_description_en VARCHAR;

COMMIT;
