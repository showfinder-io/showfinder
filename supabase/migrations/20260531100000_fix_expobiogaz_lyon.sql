-- Expobiogaz : édition 2026 réelle = 10-11 mars 2026 à Eurexpo Lyon (couplé
-- avec Open Energies par GreenTech+ / GL events). La DB indiquait Bordeaux
-- (3-4 juin 2026), incoherence avec le MDX et avec la realite. Le slug
-- `expobiogaz-bordeaux-2026` est conserve pour la continuite SEO (impressions
-- Google existantes), a renommer dans une passe URL cleanup ulterieure.

BEGIN;

UPDATE public.salons SET
  city = 'Lyon',
  venue_id = (SELECT id FROM public.venues WHERE slug = 'eurexpo-lyon'),
  start_date = '2026-03-10',
  end_date = '2026-03-11',
  organizer_name = 'GL events Exhibitions (division GreenTech+)',
  website_url = 'https://www.expobiogaz.com'
WHERE slug = 'expobiogaz-bordeaux-2026';

COMMIT;
