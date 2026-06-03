-- ============================================================
-- V7 -- Fiches Secteurs editoriales (brief Nicolas juin 2026)
-- ============================================================
-- Etend la table sectors pour porter un contenu editorial riche
-- (~5-10k chars Markdown par secteur, sections "Salons de
-- reference en France", "Salons europeens", "Au-dela des salons").
-- Equivalent venues.editorial_mdx et salons.editorial_mdx.
--
-- En parallele : creation 3 nouveaux secteurs (Immobilier,
-- Sport et Outdoor, Finance et Assurance) et modification
-- de 2 secteurs existants (Franchise et Commerce sous-titre,
-- renommage Industrie en Industrie et Packaging).

BEGIN;

-- Schema enrichment
ALTER TABLE public.sectors
  ADD COLUMN IF NOT EXISTS editorial_mdx TEXT;

ALTER TABLE public.sectors
  ADD COLUMN IF NOT EXISTS editorial_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_sectors_editorial_mdx
  ON public.sectors (slug) WHERE editorial_mdx IS NOT NULL;

COMMENT ON COLUMN public.sectors.editorial_mdx IS
  'Contenu editorial markdown long-form (analyse secteur, salons de reference, salons internationaux, au-dela des salons). Render via compileMdxContent. Editable admin.';

COMMENT ON COLUMN public.sectors.editorial_updated_at IS
  'Date derniere modification editorial_mdx.';

-- Modification "Franchise et Commerce" : sous-titre + e-commerce
UPDATE public.sectors
SET description = 'Franchise, commerce, retail, distribution, e-commerce'
WHERE slug = 'franchise-commerce';

-- Renommage "Industrie" -> "Industrie et Packaging"
UPDATE public.sectors
SET
  name = 'Industrie et Packaging',
  description = 'Industrie manufacturiere, automatisation, robotique, emballage et packaging'
WHERE slug = 'industrie';

-- 3 nouveaux secteurs
INSERT INTO public.sectors (slug, name, description) VALUES
  (
    'immobilier',
    'Immobilier',
    'Immobilier d''entreprise, residentiel, investissement, promotion'
  ),
  (
    'sport-outdoor',
    'Sport et Outdoor',
    'Equipements sportifs, outdoor, loisirs, fitness, materiel running'
  ),
  (
    'finance-assurance',
    'Finance et Assurance',
    'Banque, assurance, fintech, investissement, patrimoine'
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
