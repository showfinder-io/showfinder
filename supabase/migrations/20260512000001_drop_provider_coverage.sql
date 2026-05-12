-- Drop des champs "rayon" et "zone d'intervention" sur les prestataires.
-- Décision : les prestataires interviennent partout / ont des antennes → plus de coverage.
-- Drop également la table provider_venues ("lieux couverts").
-- La table salon_providers est conservée (utilisée pour relations + featured providers).

ALTER TABLE public.providers
  DROP COLUMN IF EXISTS coverage_radius_km,
  DROP COLUMN IF EXISTS zone_intervention;

DROP TABLE IF EXISTS public.provider_venues;
