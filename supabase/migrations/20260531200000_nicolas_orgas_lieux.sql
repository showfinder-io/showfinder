-- Feedback editorial Nicolas (2026-05-31) :
-- 1. Ajouter colonne co_organizer_name (separation orga / co-orga)
-- 2. Creer 2 venues manquants (Grand Palais, Parc Expos Montpellier)
-- 3. Corriger les organisateurs sur 7 salons et relier les venues

BEGIN;

-- 1. Colonne co_organizer_name
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS co_organizer_name TEXT;

-- 2. Grand Palais Paris
INSERT INTO public.venues
  (slug, name, city, postal_code, country, address, lat, lng, website_url, description)
VALUES (
  'grand-palais-paris',
  'Grand Palais',
  'Paris',
  '75008',
  'FR',
  '3 Avenue du General Eisenhower, 75008 Paris',
  48.8662,
  2.3120,
  'https://www.grandpalais.fr/',
  'Monument historique de la fin du XIXe siecle au coeur de Paris (Nef de 13 500 m²). Apres une renovation complete, accueille des salons professionnels (SIBCA, ChangeNOW) et des expositions culturelles.'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Parc des Expositions de Montpellier
INSERT INTO public.venues
  (slug, name, city, postal_code, country, address, lat, lng, website_url, description)
VALUES (
  'parc-expositions-montpellier',
  'Parc des Expositions de Montpellier',
  'Perols',
  '34470',
  'FR',
  'Route de la Foire, 34470 Perols',
  43.5719,
  3.9572,
  'https://www.parcexpo-montpellier.com/',
  'Parc des expositions de la metropole de Montpellier, situe a Perols a 6 km du centre-ville. Accueille notamment le forum EnerGaia chaque hiver.'
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Produrable : organisateur Groupe AEF + venue Palais des Congres
UPDATE public.salons SET
  organizer_name = 'Groupe AEF',
  venue_id = (SELECT id FROM public.venues WHERE slug = 'palais-des-congres-paris')
WHERE slug = 'produrable-paris-2026';

-- 5. Paris Healthcare Week : separer FHF / GL Events
UPDATE public.salons SET
  organizer_name = 'Federation Hospitaliere de France',
  co_organizer_name = 'GL Events'
WHERE slug = 'paris-healthcare-week-2026';

-- 6. HopitalExpo : idem
UPDATE public.salons SET
  organizer_name = 'Federation Hospitaliere de France',
  co_organizer_name = 'GL Events'
WHERE slug = 'hopital-expo-paris-2026';

-- 7. UAV Show : separer Bordeaux Technowest / BEAM
UPDATE public.salons SET
  organizer_name = 'Bordeaux Technowest',
  co_organizer_name = 'BEAM (Bordeaux Events And More)'
WHERE slug = 'air-drone-bordeaux-2026';

-- 8. EnerGaia : venue + organisateur precise + co-organisateur Region Occitanie
UPDATE public.salons SET
  venue_id = (SELECT id FROM public.venues WHERE slug = 'parc-expositions-montpellier'),
  organizer_name = 'SPL Occitanie Events',
  co_organizer_name = 'Region Occitanie / Montpellier 3M'
WHERE slug = 'energaia-montpellier-2026';

-- 9. SIBCA : completer L'Essentiel (organisateur + co-organisateur BBCA + site + venue)
UPDATE public.salons SET
  organizer_name = 'SIBCA',
  co_organizer_name = 'Association BBCA (Batiment Bas Carbone)',
  website_url = 'https://www.sibca.fr',
  venue_id = (SELECT id FROM public.venues WHERE slug = 'grand-palais-paris')
WHERE slug = 'sibca-paris-2026';

-- 10. ChangeNOW : ajouter site + venue Grand Palais
UPDATE public.salons SET
  website_url = 'https://www.changenow.world',
  venue_id = (SELECT id FROM public.venues WHERE slug = 'grand-palais-paris')
WHERE slug = 'changenow-paris-2027';

COMMIT;
