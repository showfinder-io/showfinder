-- Seed des salons cités dans les pages éditoriales secteurs de Nicolas v3
-- (content/secteurs/*.mdx). 27 fiches en placeholder, à enrichir par la
-- pipeline éditoriale décrite dans content/methodologie.mdx.
--
-- Convention :
--  - status = 'published' pour que les MDX pointent vers de vraies fiches
--  - description = NULL (pas de fabrication, la fiche détaille gracieux-degrade)
--  - is_agoris_certified = false par défaut (badge ajouté plus tard sur sélection)
--  - chiffres estimated_* repris des MDX (sources Nicolas)
--  - rattachement salon_sectors via sous-requête sur slug

BEGIN;

-- ============================================================================
-- BTP / Construction (3 manquants FR + 3 internationaux)
-- ============================================================================

INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_exhibitors, estimated_visitors,
   status, is_agoris_certified)
VALUES
  ('intermat-paris-2027', 'Intermat', 'FR', 'Villepinte',
   'Parc des Expositions de Villepinte', 2027, NULL, NULL,
   'ponctuel', 'Comexposium', 1200, NULL, 'published', false),
  ('batinov-lyon-2026', 'Batinov', 'FR', 'Lyon',
   'Eurexpo Lyon', 2026, NULL, NULL,
   'bisannuel', NULL, NULL, NULL, 'published', false),
  ('bim-world-paris-2026', 'BIM World Paris', 'FR', 'Paris',
   'Paris La Défense Arena', 2026, NULL, NULL,
   'annuel', NULL, NULL, NULL, 'published', false),
  ('bauma-munich-2028', 'Bauma', 'DE', 'Munich',
   'Messe München', 2028, '2028-04-03', '2028-04-09',
   'ponctuel', 'Messe München', 3601, 600000, 'published', false),
  ('bau-munich-2027', 'BAU', 'DE', 'Munich',
   'Messe München', 2027, '2027-01-11', '2027-01-15',
   'bisannuel', 'Messe München', 2250, 250000, 'published', false),
  ('ish-francfort-2027', 'ISH', 'DE', 'Francfort',
   'Messe Frankfurt', 2027, NULL, NULL,
   'bisannuel', 'Messe Frankfurt', NULL, NULL, 'published', false)
ON CONFLICT (slug) DO NOTHING;

-- Rattachement secteurs BTP
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('intermat-paris-2027', 'batinov-lyon-2026',
                 'bauma-munich-2028', 'bau-munich-2027', 'ish-francfort-2027')
  AND sec.slug = 'btp-construction'
ON CONFLICT DO NOTHING;

-- BIM World rattaché à BTP + Tech (intersection)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'bim-world-paris-2026'
  AND sec.slug IN ('btp-construction', 'tech-numerique')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Tech / Numérique (1 manquant FR + 3 internationaux)
-- ============================================================================

INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_exhibitors, estimated_visitors,
   status, is_agoris_certified)
VALUES
  ('all4customer-paris-2026', 'All4Customer', 'FR', 'Paris',
   'Paris Expo Porte de Versailles', 2026, NULL, NULL,
   'annuel', NULL, NULL, NULL, 'published', false),
  ('ces-las-vegas-2026', 'CES', 'US', 'Las Vegas',
   'Las Vegas Convention Center', 2026, '2026-01-06', '2026-01-09',
   'annuel', 'Consumer Technology Association', 4000, 130000, 'published', false),
  ('mwc-barcelona-2026', 'MWC Barcelona', 'ES', 'Barcelone',
   'Fira Barcelona Gran Via', 2026, '2026-03-02', '2026-03-05',
   'annuel', 'GSMA', 2900, 109000, 'published', false),
  ('web-summit-lisbonne-2026', 'Web Summit', 'PT', 'Lisbonne',
   'FIL Lisboa', 2026, NULL, NULL,
   'annuel', 'Web Summit', NULL, 70000, 'published', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('all4customer-paris-2026', 'ces-las-vegas-2026',
                 'mwc-barcelona-2026', 'web-summit-lisbonne-2026')
  AND sec.slug = 'tech-numerique'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Énergie / Environnement (2 manquants FR + 4 internationaux + Pollutec Paris)
-- ============================================================================

INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_exhibitors, estimated_visitors,
   status, is_agoris_certified)
VALUES
  ('sibca-paris-2026', 'SIBCA', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'annuel', NULL, 200, 12500, 'published', false),
  ('open-energies-lyon-2026', 'Open Energies', 'FR', 'Lyon',
   'Eurexpo Lyon', 2026, NULL, NULL,
   'annuel', 'GL events', NULL, NULL, 'published', false),
  ('pollutec-paris-2026', 'Pollutec Paris', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'bisannuel', 'RX France', NULL, NULL, 'published', false),
  ('smarter-e-europe-munich-2026', 'The smarter E Europe', 'DE', 'Munich',
   'Messe München', 2026, NULL, NULL,
   'annuel', 'Solar Promotion GmbH', NULL, NULL, 'published', false),
  ('hannover-messe-2026', 'Hannover Messe', 'DE', 'Hanovre',
   'Deutsche Messe', 2026, NULL, NULL,
   'annuel', 'Deutsche Messe AG', NULL, NULL, 'published', false),
  ('e-world-essen-2026', 'E-world energy & water', 'DE', 'Essen',
   'Messe Essen', 2026, NULL, NULL,
   'annuel', 'E-world energy & water GmbH', NULL, NULL, 'published', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('sibca-paris-2026', 'open-energies-lyon-2026',
                 'pollutec-paris-2026', 'smarter-e-europe-munich-2026',
                 'hannover-messe-2026', 'e-world-essen-2026')
  AND sec.slug = 'energie-environnement'
ON CONFLICT DO NOTHING;

-- Hannover Messe double rattachement (énergie + industrie)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'hannover-messe-2026'
  AND sec.slug = 'industrie'
ON CONFLICT DO NOTHING;

-- SIBCA double rattachement (énergie + btp)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'sibca-paris-2026'
  AND sec.slug = 'btp-construction'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Santé / Pharma (8 manquants FR + 3 internationaux)
-- ============================================================================

INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_exhibitors, estimated_visitors,
   status, is_agoris_certified)
VALUES
  ('pharmagora-plus-paris-2026', 'Pharmagora Plus', 'FR', 'Paris',
   'Paris Expo Porte de Versailles', 2026, '2026-03-14', '2026-03-15',
   'annuel', 'CloserStill Media', 400, 12000, 'published', false),
  ('medfit-marseille-2026', 'MedFIT', 'FR', 'Marseille',
   NULL, 2026, NULL, NULL,
   'annuel', 'Eurasanté', NULL, 900, 'published', false),
  ('medi-nov-connection-lyon-2026', 'Medi''Nov Connection', 'FR', 'Lyon',
   NULL, 2026, NULL, NULL,
   'annuel', 'Lyonbiopole', NULL, NULL, 'published', false),
  ('congres-adf-paris-2026', 'Congrès ADF', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'annuel', 'Association Dentaire Française', NULL, NULL, 'published', false),
  ('reeduca-paris-2026', 'Rééduca', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'annuel', NULL, NULL, NULL, 'published', false),
  ('silmo-paris-2026', 'SILMO', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'annuel', NULL, NULL, NULL, 'published', false),
  ('salon-infirmier-paris-2026', 'Salon Infirmier', 'FR', 'Paris',
   NULL, 2026, NULL, NULL,
   'annuel', NULL, NULL, NULL, 'published', false),
  ('medica-dusseldorf-2026', 'MEDICA', 'DE', 'Düsseldorf',
   'Messe Düsseldorf', 2026, NULL, NULL,
   'annuel', 'Messe Düsseldorf', 5000, 83000, 'published', false),
  ('arab-health-dubai-2026', 'Arab Health', 'AE', 'Dubaï',
   'Dubai World Trade Centre', 2026, NULL, NULL,
   'annuel', 'Informa Markets', 3450, 110000, 'published', false),
  ('medteclive-stuttgart-2026', 'MedtecLIVE', 'DE', 'Stuttgart',
   'Messe Stuttgart', 2026, NULL, NULL,
   'annuel', 'NürnbergMesse', NULL, NULL, 'published', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('pharmagora-plus-paris-2026', 'medfit-marseille-2026',
                 'medi-nov-connection-lyon-2026', 'congres-adf-paris-2026',
                 'reeduca-paris-2026', 'silmo-paris-2026',
                 'salon-infirmier-paris-2026', 'medica-dusseldorf-2026',
                 'arab-health-dubai-2026', 'medteclive-stuttgart-2026')
  AND sec.slug = 'sante-pharma'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Renommer "Medica France Forum" (anciennement nommé MEDICA confusément)
-- pour bien distinguer du vrai MEDICA Düsseldorf ajouté ci-dessus.
-- ============================================================================

UPDATE public.salons
SET name = 'Medica France Forum',
    slug = 'medica-france-forum-2026'
WHERE slug = 'medica-dusseldorf-paris-forum-2026';

COMMIT;
