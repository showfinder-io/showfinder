-- ============================================================
-- V5.6 — MDX editorial migre en DB (brief Nicolas + decision user)
-- ============================================================
-- L'edition admin du contenu editorial des fiches salons devient
-- possible depuis l'interface web (textarea MDX + preview). Le MDX vit
-- desormais en DB plutot qu'en fichier .mdx dans le repo.
--
-- Le script scripts/migrate-mdx-to-db.ts (one-shot) importe les ~113
-- MDX existants dans la colonne editorial_mdx. Apres validation prod,
-- les fichiers content/salons/*.mdx peuvent etre supprimes du repo.

BEGIN;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS editorial_mdx TEXT;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS editorial_updated_at TIMESTAMPTZ;

-- Index pour le filtre "fiches editorialisees" (sitemap, sampling, etc.).
CREATE INDEX IF NOT EXISTS idx_salons_editorial_mdx
  ON public.salons (slug) WHERE editorial_mdx IS NOT NULL;

COMMENT ON COLUMN public.salons.editorial_mdx IS
  'Contenu MDX editorial complet (8-10 blocs : Essentiel, Qui expose, Animations, Sur place, RSE, Historique...). Editable depuis l''admin. Substituera les fichiers content/salons/*.mdx du repo.';

COMMENT ON COLUMN public.salons.editorial_updated_at IS
  'Date de derniere mise a jour editoriale du editorial_mdx. Distinct de last_human_check_at (validation sampling) et last_ia_update_at (sync scraper).';

COMMIT;
