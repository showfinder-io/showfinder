-- ============================================================
-- Cohorte 6 — DB cleanup batch 1+2 (corrections detectees par writers/reviewers)
-- ============================================================
-- Resync DB Supabase avec la realite editoriale verifiee :
--  - 6 UPDATEs (organisateurs / dates / lieux / chiffres corriges)
--  - 1 INSERT venue (Grande Halle d'Auvergne pour Sommet de l'Elevage)
--  - 7 DELETEs (doublons semantiques avec MDX existants)
-- Les 301 redirects correspondants sont dans next.config.ts.

BEGIN;

-- ============================================================
-- 1. UPDATEs (6 salons corriges)
-- ============================================================

-- AgriSIMA (ex-SIMA) : rebrandé 2024, racheté AXEMA/AgriVitiEvents en
-- avril 2025. Source : agrisima.com + Réussir Machinisme.
UPDATE public.salons SET
  name = 'AgriSIMA',
  organizer_name = 'AgriVitiEvents',
  co_organizer_name = 'AXEMA',
  estimated_visitors = 153000,
  estimated_exhibitors = 1000
WHERE slug = 'sima-paris-2026';

-- Salon Régional de l'Agriculture de Tarbes (ex Foire Agricole) :
-- organisé par SEAE, mars 2026 (pas septembre du brief initial).
-- Source : salon-agricole.com + presse régionale.
UPDATE public.salons SET
  name = 'Salon Régional de l''Agriculture de Tarbes',
  organizer_name = 'SEAE',
  start_date = '2026-03-05',
  end_date = '2026-03-08',
  website_url = 'https://www.salon-agricole.com',
  estimated_visitors = 76748,
  estimated_exhibitors = 315
WHERE slug = 'foire-agricole-tarbes-2026';

-- SITEVI : Comexposium → AgriVitiEvents avril 2025. Dates 30 nov-2 déc.
-- Source : sitevi.com + Vitisphere.
UPDATE public.salons SET
  organizer_name = 'AgriVitiEvents',
  start_date = '2027-11-30',
  end_date = '2027-12-02'
WHERE slug = 'sitevi-montpellier-2027';

-- ALL4PACK : dates corrigées 24-26 nov (23 = montage). Bilan 2024
-- intégré. Source : all-for-pack.com.
UPDATE public.salons SET
  start_date = '2026-11-24',
  estimated_visitors = 27303,
  estimated_exhibitors = 1022
WHERE slug = 'all4pack-paris-2026';

-- Terres de Jim 2026 : Metz-Magny (Moselle), pas Compiègne. Dates
-- 11-13 sept (pas 4-6). Source : lesterresdejim.com.
UPDATE public.salons SET
  city = 'Metz-Magny',
  start_date = '2026-09-11',
  end_date = '2026-09-13',
  estimated_visitors = 70000
WHERE slug = 'terres-de-jim-2026';

-- Paris Design Week : dates 10-19 sept 2026 (les 4-13 sept étaient les
-- dates 2025). Bilan 2025 = 250k visi. Source : parisdesignweek.fr.
UPDATE public.salons SET
  start_date = '2026-09-10',
  end_date = '2026-09-19',
  estimated_visitors = 250000
WHERE slug = 'paris-design-week-2026';

-- ============================================================
-- 2. INSERT venue Grande Halle d'Auvergne + liaison sommet-elevage
-- ============================================================

INSERT INTO public.venues (slug, name, city, country, address, postal_code, lat, lng, total_surface_sqm, website_url, description, google_maps_url)
VALUES (
  'grande-halle-d-auvergne',
  'Grande Halle d''Auvergne',
  'Cournon-d''Auvergne',
  'FR',
  'Route de Chazoux',
  '63800',
  45.7398,
  3.1862,
  30000,
  'https://www.grandehalle-auvergne.com',
  'Parc des expositions emblématique d''Auvergne situé à Cournon-d''Auvergne près de Clermont-Ferrand. Accueille notamment le Sommet de l''Elevage, plus grand salon européen des productions animales. Surface couverte d''environ 30 000 m².',
  'https://www.google.com/maps/search/?api=1&query=45.7398,3.1862'
) ON CONFLICT (slug) DO NOTHING;

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'grande-halle-d-auvergne')
WHERE slug = 'sommet-elevage-clermont-2026';

-- ============================================================
-- 3. DELETE doublons (7 lignes — salon_sectors / salon_providers /
--    salon_tags cascadent automatiquement via ON DELETE CASCADE)
-- ============================================================
--
-- equiphotel-paris-2026     -> /salons/equip-hotel-paris-2026
-- mif-expo-paris-2026       -> /salons/mif-expo-2026
-- solutrans-lyon-2027       -> /salons/solutrans-2027
-- sitl-paris-2026           -> /salons/sitl-2026
-- cfia-rennes-2026          -> /salons/cfia-rennes-2027
-- cosmetic-360-paris-2026   -> /salons/cosmetic-360-2026
-- europain-paris-2026       -> /salons/sirha-bake-snack-2028 (rebranding
--                              + rachat GL Events à Comexposium déc 2024)

DELETE FROM public.salons WHERE slug IN (
  'equiphotel-paris-2026',
  'mif-expo-paris-2026',
  'solutrans-lyon-2027',
  'sitl-paris-2026',
  'cfia-rennes-2026',
  'cosmetic-360-paris-2026',
  'europain-paris-2026'
);

COMMIT;
