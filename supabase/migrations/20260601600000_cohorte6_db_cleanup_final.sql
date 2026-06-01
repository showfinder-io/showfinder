-- ============================================================
-- Cohorte 6 — DB cleanup final batch 3-6
-- ============================================================
-- Consolide les findings detectes par writers + reviewers sur les
-- batches 3 a 6. Resync DB Supabase avec la realite editoriale.
--
--  - 12 UPDATEs (dates / lieu / organisateur / chiffres / rebrands)
--  - 5 DELETEs (doublons semantiques + slugs fantomes legacy)
-- Les 301 redirects correspondants sont dans next.config.ts.

BEGIN;

-- ============================================================
-- 1. UPDATEs (12 salons corriges)
-- ============================================================

-- Innov-Agri : Groupe NGPA (editeur La France Agricole / Terre-Net),
-- pas Comexposium. Dates 9-10 sept (pas 8-9). Source : ngpa.com.
UPDATE public.salons SET
  organizer_name = 'Groupe NGPA',
  start_date = '2026-09-09',
  end_date = '2026-09-10'
WHERE slug = 'innov-agri-ondes-2026';

-- Vinitech-Sifel : BEAM (Bordeaux Events And More, succede a CEB en
-- octobre 2022), pas Comexposium. Dates 1-3 dec (pas 24-26 nov).
-- Source : beam.fr + sitevi.com + Vitisphere.
UPDATE public.salons SET
  organizer_name = 'BEAM',
  start_date = '2026-12-01',
  end_date = '2026-12-03',
  estimated_visitors = 37000,
  estimated_exhibitors = 750
WHERE slug = 'vinitech-sifel-bordeaux-2026';

-- Les Thermalies : Carrousel du Louvre (pas Porte de Versailles).
-- 25k visi Paris seul (40k = cumul Paris+Lyon). Source : thermalies.com.
UPDATE public.salons SET
  venue = 'Carrousel du Louvre',
  estimated_visitors = 25000,
  estimated_exhibitors = 250
WHERE slug = 'les-thermalies-paris-2026';

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'carrousel-du-louvre')
WHERE slug = 'les-thermalies-paris-2026';

-- Serbotel : SPL Exponantes jusqu'a 2025, fusion 2026 avec SPL Cite
-- des Congres en entite unique DSP Nantes Metropole + CCI Nantes
-- Saint-Nazaire. Source : exponantes.com + Le Journal des Entreprises.
UPDATE public.salons SET
  organizer_name = 'SPL Exponantes'
WHERE slug = 'serbotel-nantes-2027';

-- World Nuclear Exhibition : bisannuel annees IMPAIRES. Pas d'edition
-- 2026. Prochaine = 7-9 decembre 2027 Villepinte halls 5A+6.
-- Source : world-nuclear-exhibition.com + gifen.fr.
UPDATE public.salons SET
  edition_year = 2027,
  start_date = '2027-12-07',
  end_date = '2027-12-09',
  co_organizer_name = 'RX France'
WHERE slug = 'world-nuclear-exhibition-2026';

-- Paris Retail Week : rebrande NRF Retail's Big Show Europe en 2025.
-- Co-orga Comexposium + NRF. Site : nrfbigshoweurope.com (parisretailweek.com
-- redirige). Source : Comexposium + NRF + Retail Touchpoints.
UPDATE public.salons SET
  name = 'NRF Retail''s Big Show Europe',
  co_organizer_name = 'NRF',
  website_url = 'https://www.nrfbigshoweurope.com'
WHERE slug = 'paris-retail-week-2026';

-- Paysalia : bilan 2025 = 41 500 visi / 1019 expo. Le 28k DB etait
-- la cible 2027. Source : Eurospapoolnews + Materiel Paysage.
UPDATE public.salons SET
  estimated_visitors = 41500,
  estimated_exhibitors = 1019
WHERE slug = 'paysalia-lyon-2027';

-- Go Entrepreneurs (slug legacy je-m-export) : Paris La Defense Arena
-- (pas Palais des Congres). EBRA Events depuis 2025 (rachat Les Echos
-- Le Parisien Events). Source : ebra-events.fr + The Media Leader.
UPDATE public.salons SET
  venue = 'Paris La Defense Arena',
  organizer_name = 'EBRA Events',
  city = 'Nanterre'
WHERE slug = 'je-m-export-paris-2026';

-- Euronaval : 3-6 nov 2026 (pas 19-22 oct). Villepinte Hall 6 (pas
-- Le Bourget, transfert 2024 JO permanent). 30e ed. Source :
-- euronaval.com + GICAN.
UPDATE public.salons SET
  start_date = '2026-11-03',
  end_date = '2026-11-06',
  venue = 'Paris Nord Villepinte',
  co_organizer_name = 'SOGENA'
WHERE slug = 'euronaval-paris-2026';

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'paris-nord-villepinte')
WHERE slug = 'euronaval-paris-2026';

-- Natexpo : Lyon (pas Paris !) — alternance Lyon paires / Paris impaires.
-- Dates 28-29 sept (pas 19-21 oct). Co-orga La Maison de la Bio.
-- Source : natexpo.com + spas-expo.com.
UPDATE public.salons SET
  city = 'Lyon',
  venue = 'Eurexpo Lyon',
  start_date = '2026-09-28',
  end_date = '2026-09-29',
  co_organizer_name = 'La Maison de la Bio'
WHERE slug = 'natexpo-paris-2026';

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'eurexpo-lyon')
WHERE slug = 'natexpo-paris-2026';

-- EGAST : biennal annees PAIRES. 20e ed = 2026 (deja passee). Prochaine
-- = 19-22 mars 2028. Strasbourg Evenements (SEM, GL Events au capital
-- depuis 2014). Source : egast.eu + Rue89 Strasbourg.
UPDATE public.salons SET
  edition_year = 2028,
  start_date = '2028-03-19',
  end_date = '2028-03-22',
  organizer_name = 'Strasbourg Evenements'
WHERE slug = 'egast-strasbourg-2027';

-- Micronora : dates 29 sept-2 oct (pas 22-25 sept brief DB).
-- Source : micronora.com + macommune.info + Mesures.com.
UPDATE public.salons SET
  start_date = '2026-09-29',
  end_date = '2026-10-02'
WHERE slug = 'micronora-besancon-2026';

-- FIC Lille : dates 31 mars-2 avril 2026 (DB avait 2 oct + end NULL !).
-- Rebrand FIC -> Forum InCyber Europe en 2024. Forward Global organisateur
-- depuis 2024 (scission Avisa Partners). CEIS = filiale historique.
-- Source : forum-incyber.com + forwardglobal.com + Le Mag IT.
UPDATE public.salons SET
  name = 'Forum InCyber Europe',
  start_date = '2026-03-31',
  end_date = '2026-04-02',
  organizer_name = 'Forward Global'
WHERE slug = 'fic-lille-2026';

-- ============================================================
-- 2. DELETEs (5 doublons / slugs fantomes legacy)
-- ============================================================
-- ON DELETE CASCADE cascade automatiquement salon_sectors, salon_providers, salon_tags
--
-- smart-industries-2026     -> /salons/global-industrie-lyon-2025 (fusion 2018)
-- ecommerce-paris-2026      -> /salons/paris-retail-week-2026 (fusion 2015, rebrand NRF 2025)
-- industrie-lyon-2026       -> /salons/global-industrie-lyon-2025 (fusion 2018)
-- salon-hvac-paris-2026     -> /salons/interclima-2026 (doublon sectoriel HVAC)
-- secuexpo-paris-2026       -> /salons/expoprotection-2026 (doublon, name = Expoprotection en DB)

DELETE FROM public.salons WHERE slug IN (
  'smart-industries-2026',
  'ecommerce-paris-2026',
  'industrie-lyon-2026',
  'salon-hvac-paris-2026',
  'secuexpo-paris-2026'
);

COMMIT;
