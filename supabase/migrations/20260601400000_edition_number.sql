-- ============================================================
-- Ajout colonne edition_number aux salons (numero d'edition humain)
-- ============================================================
-- Permet d'afficher "Éd. 12ᵉ" dans le visuel SalonVisual (brief visuels
-- juin 2026). edition_year reste la reference annee (2026, 2027...).
-- Champ optionnel : NULL quand le numero d'edition n'est pas verifie.

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS edition_number INTEGER;

COMMENT ON COLUMN public.salons.edition_number IS
  'Numero d''edition humain (ex: 12 pour la 12e edition). Distinct de edition_year. Affiche dans les visuels et fiches.';
