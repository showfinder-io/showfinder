-- Cohorte 3 Énergie : chiffres sourcés (recherche web, R1/R2 OJS prioritaire)
-- + seed ChangeNOW (manquant). Chiffres = dernière édition réalisée.

BEGIN;

-- Pollutec : chiffres OJS 2023 certifiés (42 496 vis / 1 621 exp), privilégiés
-- sur l'auto-déclaré 2025 (51 000) par R2. Édition à venir 2027 (12-15 oct).
UPDATE public.salons SET
  estimated_visitors = 42496, estimated_exhibitors = 1621,
  start_date = '2027-10-12', end_date = '2027-10-15', venue = 'Eurexpo Lyon'
WHERE slug = 'pollutec-lyon-2027';

-- EnerGaïa : 19e édition 2025 = 22 500 participants, 551 exposants.
-- Prochaine 20e = 9-10 déc 2026, Montpellier.
UPDATE public.salons SET
  estimated_visitors = 22500, estimated_exhibitors = 551,
  start_date = '2026-12-09', end_date = '2026-12-10'
WHERE slug = 'energaia-montpellier-2026';

-- Produrable : 18e 2025 = 14 000 visiteurs, 300 exposants.
-- Prochaine 19e = 30 sept-1 oct 2026, Palais des Congrès Paris.
UPDATE public.salons SET
  estimated_visitors = 14000, estimated_exhibitors = 300,
  start_date = '2026-09-30', end_date = '2026-10-01'
WHERE slug = 'produrable-paris-2026';

-- Expobiogaz : édition 2026 tenue à Lyon (Eurexpo), 2 500 participants.
-- Exposants non confirmés par source fiable → NULL. NB slug 'bordeaux' obsolète
-- (le salon change de ville ; 2026 = Lyon) — à renommer dans une passe dédiée.
UPDATE public.salons SET
  estimated_visitors = 2500, estimated_exhibitors = NULL,
  venue = 'Eurexpo Lyon'
WHERE slug = 'expobiogaz-bordeaux-2026';

-- SIBCA : 4e édition 2025 = 12 725 participants, 200 exposants.
-- Prochaine = 1-3 sept 2026, Grand Palais Paris.
UPDATE public.salons SET
  estimated_visitors = 12725, estimated_exhibitors = 200,
  start_date = '2026-09-01', end_date = '2026-09-03', venue = 'Grand Palais'
WHERE slug = 'sibca-paris-2026';

-- ChangeNOW : fiche manquante. 10e édition = 26-28 avril 2027, Grand Palais.
-- 2025 = 40 000 participants, 380 exposants, 140 pays.
INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_visitors, estimated_exhibitors,
   status, is_agoris_certified)
VALUES
  ('changenow-paris-2027', 'ChangeNOW', 'FR', 'Paris', 'Grand Palais',
   2027, '2027-04-26', '2027-04-28', 'annuel', 'ChangeNOW',
   40000, 380, 'published', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'changenow-paris-2027' AND sec.slug = 'energie-environnement'
ON CONFLICT DO NOTHING;

COMMIT;
