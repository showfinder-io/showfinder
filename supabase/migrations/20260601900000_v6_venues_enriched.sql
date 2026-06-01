-- ============================================================
-- V6 — Fiches Lieux enrichies (brief Nicolas P2)
-- ============================================================
-- Enrichit le schema venues pour supporter un contenu editorial riche
-- (similaire aux fiches salons editoriales) :
--  - editorial_mdx : contenu MDX libre (description longue, halls,
--    transports, services, actualites, etc. en markdown). Editable
--    depuis l'admin via textarea.
--  - editorial_updated_at : horodatage derniere mise a jour editoriale.
--  - halls_count : nombre de halls (chiffre, affiche en stat sur la fiche).
--  - gallery : tableau JSONB d'images (id de prestataire / url externe +
--    caption + ordering). Permet une galerie photo sur la fiche lieu.

BEGIN;

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS editorial_mdx TEXT;

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS editorial_updated_at TIMESTAMPTZ;

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS halls_count INTEGER;

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_venues_editorial_mdx
  ON public.venues (slug) WHERE editorial_mdx IS NOT NULL;

COMMENT ON COLUMN public.venues.editorial_mdx IS
  'Contenu editorial markdown (description, halls, transports, services, actualites, etc.). Render via compileMdxContent cote page. Editable admin.';

COMMENT ON COLUMN public.venues.editorial_updated_at IS
  'Date derniere modification editorial_mdx.';

COMMENT ON COLUMN public.venues.halls_count IS
  'Nombre de halls/pavillons (chiffre stat affiche sur la fiche). NULL si non documente.';

COMMENT ON COLUMN public.venues.gallery IS
  'Galerie photos : tableau [{ url: string, caption?: string }]. Ordre = ordre du tableau.';

COMMIT;
