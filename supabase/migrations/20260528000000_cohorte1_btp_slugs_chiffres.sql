-- Cohorte 1 BTP : correction des slugs (édition réelle), des chiffres clés
-- (sourcés depuis les fiches relues par Nicolas) et des dates/venues.
-- Les Quick Stats lisent estimated_visitors/exhibitors → ils affichaient des
-- chiffres faux (Interclima 120000, Nordbat 30000) corrigés ici.

BEGIN;

-- Salon des Maires (annuel, édition 2026 — dates corrigées + chiffres 2025)
UPDATE public.salons SET
  start_date = '2026-11-24', end_date = '2026-11-26',
  estimated_visitors = 65672, estimated_exhibitors = 1380
WHERE slug = 'congresmaire-paris-2026';

-- Interclima (édition 2026, chiffres derniers complets 2024, lieu corrigé)
UPDATE public.salons SET
  estimated_visitors = 42525, estimated_exhibitors = 383,
  venue = 'Paris Expo Porte de Versailles'
WHERE slug = 'interclima-2026';

-- Architect@Work Paris (édition 2026 — dates corrigées + chiffres 2025)
UPDATE public.salons SET
  start_date = '2026-10-21', end_date = '2026-10-22',
  estimated_visitors = 6800, estimated_exhibitors = 250
WHERE slug = 'architect-at-work-paris-2026';

-- Artibat : slug 2026 → 2027 (bisannuel impair), chiffres + venue
UPDATE public.salons SET
  slug = 'artibat-rennes-2027', edition_year = 2027,
  start_date = '2027-10-22', end_date = '2027-10-24',
  estimated_visitors = 45000, estimated_exhibitors = 1100,
  venue = 'Parc des Expositions de Rennes Aéroport'
WHERE slug = 'artibat-rennes-2026';

-- Nordbat : slug 2026 → 2028 (édition 15e en mars 2028), chiffres dernière
-- édition réalisée (14e/2026)
UPDATE public.salons SET
  slug = 'nordbat-lille-2028',
  estimated_visitors = 18140, estimated_exhibitors = 400
WHERE slug = 'nordbat-lille-2026';

-- Eurobois : slug 2026 → 2028 (prochaine édition), chiffres dernière édition
-- réalisée (2026)
UPDATE public.salons SET
  slug = 'eurobois-lyon-2028',
  estimated_visitors = 30500, estimated_exhibitors = 600
WHERE slug = 'eurobois-lyon-2026';

COMMIT;
