-- Cohorte 2 BTP : chiffres sourcés (recherche web) + résolution doublon
-- EquipBaie + seed Architect@Work Lyon (manquant). Chiffres = dernière édition
-- réalisée, sources tracées dans les MDX correspondants.

BEGIN;

-- Doublon EquipBaie : on garde equipbaie-metalexpo-paris-2026 (nom officiel
-- actuel « Équipbaie-Métalexpo by Batimat »), on supprime le doublon court.
DELETE FROM public.salon_sectors
  WHERE salon_id = (SELECT id FROM public.salons WHERE slug = 'equipbaie-paris-2026');
DELETE FROM public.salons WHERE slug = 'equipbaie-paris-2026';

-- EquipBaie-Métalexpo : intégré au Mondial du Bâtiment / Paris Builders Show 2026.
-- 311 exposants 2024 ; pas de chiffre visiteurs propre (NULL, ne pas afficher faux).
UPDATE public.salons SET
  estimated_exhibitors = 311, estimated_visitors = NULL,
  start_date = '2026-09-28', end_date = '2026-10-01',
  venue = 'Paris Expo Porte de Versailles'
WHERE slug = 'equipbaie-metalexpo-paris-2026';

-- BePositive 2027 (Lyon Eurexpo). Dates 23-25 mars 2027 (titre site officiel ;
-- conflit non résolu avec 31 mars-2 avril sur le corps du site, signalé en fiche).
UPDATE public.salons SET
  estimated_visitors = 27570, estimated_exhibitors = 500,
  start_date = '2027-03-23', end_date = '2027-03-25'
WHERE slug = 'bepositive-lyon-2027';

-- Préventica Lyon 2026 (édition nationale, 6-8 oct). Chiffres = Paris 2025 (proxy
-- édition nationale comparable), précisé en fiche.
UPDATE public.salons SET
  estimated_visitors = 14000, estimated_exhibitors = 550,
  start_date = '2026-10-06', end_date = '2026-10-08'
WHERE slug = 'preventica-lyon-2026';

-- Idéobain 2026 (Paris Builders Show). 166 exposants 2024 ; pas de visiteurs propre.
UPDATE public.salons SET
  estimated_exhibitors = 166, estimated_visitors = NULL,
  start_date = '2026-09-28', end_date = '2026-10-01'
WHERE slug = 'ideobain-2026';

-- Intermat 2027 (triennal, 21-24 avril, Villepinte). 127 500 visiteurs, 1 065
-- exposants (2024).
UPDATE public.salons SET
  estimated_visitors = 127500, estimated_exhibitors = 1065,
  start_date = '2027-04-21', end_date = '2027-04-24',
  venue = 'Paris Nord Villepinte'
WHERE slug = 'intermat-paris-2027';

-- Architect@Work Lyon : fiche manquante (seul Paris existait). 8e édition
-- 10-11 juin 2026, Halle Tony Garnier. 176 exposants 2024 ; visiteurs non publiés.
INSERT INTO public.salons
  (slug, name, country, city, venue, edition_year, start_date, end_date,
   frequency, organizer_name, estimated_exhibitors, status, is_agoris_certified)
VALUES
  ('architect-at-work-lyon-2026', 'Architect@Work Lyon', 'FR', 'Lyon',
   'Halle Tony Garnier', 2026, '2026-06-10', '2026-06-11',
   'annuel', 'Kortrijk Xpo', 176, 'published', false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'architect-at-work-lyon-2026' AND sec.slug = 'btp-construction'
ON CONFLICT DO NOTHING;

COMMIT;
