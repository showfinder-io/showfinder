-- Badge "Agoris Verified" (brief redesign v1, mai 2026)
-- Critère manuel POC : Nicolas valide après vérification que les données du salon
-- sont confirmées (dates, lieu, exposants sourcés, description éditoriale rédigée).
-- Premier batch : 20-30 salons max. La rareté du badge en fait la valeur.

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS is_agoris_verified BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.salons.is_agoris_verified IS
  'Badge "Agoris Verified". Toggle manuel via l''admin par l''équipe éditoriale.';

CREATE INDEX IF NOT EXISTS idx_salons_is_agoris_verified
  ON public.salons (is_agoris_verified)
  WHERE is_agoris_verified = true;
