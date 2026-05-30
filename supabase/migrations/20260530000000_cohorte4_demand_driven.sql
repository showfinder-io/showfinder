-- Cohorte 4 demand-driven : corrections issues de recherche web sourcée
-- (rapports d'agents 2026-05-30). 5 fiches sur 6 ont des rebrandings non
-- reflétés en DB (Midest -> Global Industrie, Europack -> Prod&Pack,
-- PHW -> SantExpo, HôpitalExpo intégré SantExpo, "Air Drone" fantôme).

BEGIN;

-- 1. Espace Mayenne (Laval) : créer si manquant (5 000 m² couverts)
INSERT INTO public.venues
  (slug, name, city, postal_code, country, address, lat, lng,
   total_surface_sqm, website_url, description)
VALUES (
  'espace-mayenne',
  'Espace Mayenne',
  'Laval',
  '53000',
  'FR',
  '2 rue Joséphine Baker, 53000 Laval',
  48.0824,
  -0.7625,
  5000,
  'https://www.espace-mayenne.fr/',
  'Parc des expositions et des congrès de Laval inauguré en 2021 : 5 000 m² couverts, 10 000 m² extérieurs, salles modulables (Mayenne 4 500 places, Pégase 1 500 places). Accueille notamment Laval Virtual chaque printemps.'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Laval Virtual : lier au venue + recadrer chiffres
--    (DB 18 000 / 300 = éditions 2018-2019, réalité post-Covid 5-6k / 160-180).
UPDATE public.salons SET
  venue_id = (SELECT id FROM public.venues WHERE slug = 'espace-mayenne'),
  estimated_visitors = 6000,
  estimated_exhibitors = 180,
  organizer_name = 'Association Laval Virtual'
WHERE slug = 'laval-virtual-2026';

-- 3. Midest : intégré à Global Industrie depuis 2018, GI 2027 alterne sur Lyon.
UPDATE public.salons SET
  name = 'Midest (Global Industrie)',
  venue_id = (SELECT id FROM public.venues WHERE slug = 'eurexpo-lyon'),
  city = 'Lyon',
  estimated_visitors = 60000,
  estimated_exhibitors = 2500,
  organizer_name = 'GL Events Exhibitions',
  website_url = 'https://www.global-industrie.com'
WHERE slug = 'midest-2026';

-- 4. Europack Euromanut CFIA -> renommé Prod&Pack en 2020, biennal, pas
--    d'édition 2026 ; prochaine édition 16-18 novembre 2027 à Eurexpo Lyon.
UPDATE public.salons SET
  name = 'Prod&Pack (ex-Europack Euromanut CFIA)',
  start_date = '2027-11-16',
  end_date = '2027-11-18',
  edition_year = 2027,
  estimated_visitors = 15931,
  estimated_exhibitors = 750,
  frequency = 'bisannuel',
  organizer_name = 'GL Events Exhibitions',
  website_url = 'https://www.prodandpack.com'
WHERE slug = 'europack-euromanut-lyon-2026';

-- 5. Paris Healthcare Week -> renommé SantExpo en 2019. Chiffres édition 2025
--    (référence la plus récente : 35 150 participants, 695 exposants).
UPDATE public.salons SET
  name = 'SantExpo (ex-Paris Healthcare Week)',
  estimated_visitors = 35150,
  estimated_exhibitors = 695,
  organizer_name = 'FHF (Fédération Hospitalière de France) / GL Events',
  website_url = 'https://www.santexpo.com'
WHERE slug = 'paris-healthcare-week-2026';

-- 6. Hôpital Expo : intégré à SantExpo depuis 2019 (héritage marque).
--    Organisateur réel : FHF (l'ancien "Hôpital Expo SAS" en DB était faux).
UPDATE public.salons SET
  organizer_name = 'FHF (Fédération Hospitalière de France) / GL Events',
  website_url = 'https://www.santexpo.com'
WHERE slug = 'hopital-expo-paris-2026';

-- 7. UAV Show : "Air Drone" n'existe pas (domaine airdrone.eu parqué),
--    BCI Aerospace n'est pas l'organisateur, dates DB décalées d'1 jour,
--    chiffres surévalués.
UPDATE public.salons SET
  name = 'UAV Show',
  start_date = '2026-10-07',
  end_date = '2026-10-09',
  estimated_visitors = 4000,
  estimated_exhibitors = 110,
  organizer_name = 'Bordeaux Technowest et BEAM (Bordeaux Events And More)',
  website_url = 'https://www.uavshow.com'
WHERE slug = 'air-drone-bordeaux-2026';

COMMIT;
