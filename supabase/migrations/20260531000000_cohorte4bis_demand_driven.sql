-- Cohorte 4bis demand-driven : 4 fiches forcees a la reindexation Google par
-- Julien apres switch 307->308 sur l'apex. Issues de recherche web sourcee
-- 2026-05-31. 4 fiches sur 4 ont des incoherences DB majeures, dont :
-- Heavent Paris (organisateur faux, dates 2j vs 3j, chiffres 2x sous-estimes),
-- MakeUp in Paris (dates 2025 indument copiees pour 2026),
-- Salon du Chocolat (chiffres marketing vs OJS),
-- THCon (vraies dates en mai 2026 et non en novembre, "Numeriquest" inexistant).

BEGIN;

-- 1. Université Paul Sabatier (Toulouse) : creer pour THCon
INSERT INTO public.venues
  (slug, name, city, postal_code, country, address, lat, lng, website_url, description)
VALUES (
  'universite-paul-sabatier-toulouse',
  'Université Paul Sabatier',
  'Toulouse',
  '31062',
  'FR',
  '118 route de Narbonne, 31062 Toulouse',
  43.5616,
  1.4675,
  'https://www.univ-tlse3.fr/',
  'Universite scientifique de Toulouse. Accueille notamment la Toulouse Hacking Convention chaque printemps a l''auditorium Marthe Condat.'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Salon du Chocolat Paris : chiffres DB (120k/500) = projections marketing,
--    pas OJS. Source OJS Comexposium 2023 = 92 000 / 230. Organisateur
--    Event International, partenariat Comexposium depuis mars 2024.
UPDATE public.salons SET
  estimated_visitors = 92000,
  estimated_exhibitors = 240,
  organizer_name = 'Event International (partenariat Comexposium)',
  website_url = 'https://www.salon-du-chocolat.com'
WHERE slug = 'salon-du-chocolat-paris-2026';

-- 3. Heavent Paris : organisateur DB faux (Infopro Digital -> Weyou Group),
--    edition 2026 sur 3 jours (17-19 nov, pas 17-18), chiffres ~2x
--    sous-estimes (9k/350 -> 20k/490 sur les bilans 2024 et 2025).
UPDATE public.salons SET
  end_date = '2026-11-19',
  estimated_visitors = 20000,
  estimated_exhibitors = 490,
  organizer_name = 'Weyou Group',
  website_url = 'https://www.heavent-paris.com'
WHERE slug = 'heavent-paris-2026';

-- 4. MakeUp in Paris : dates 2026 DB (18-19 juin) etaient en realite celles
--    de la 15e edition 2025. Edition 2026 = 17-18 juin (cf. site officiel).
--    Organisateur historique = Beauteam (rachete par Infopro Digital en 2017).
UPDATE public.salons SET
  start_date = '2026-06-17',
  end_date = '2026-06-18',
  estimated_exhibitors = 150,
  organizer_name = 'Beauteam (groupe Infopro Digital)',
  website_url = 'https://www.makeup-in-paris.com'
WHERE slug = 'makeup-in-paris-2026';

-- 5. Toulouse Hacking Convention : slug "numeriquest" historique (Numeriquest
--    n'existe pas comme salon, c'est juste une boite qui exposait dans un
--    salon RH lyonnais). Vrais element : THCon en mai 2026 (pas novembre).
--    Convention cyber + CTF, pas un salon classique avec exposants stands.
UPDATE public.salons SET
  name = 'Toulouse Hacking Convention (THCon)',
  start_date = '2026-05-05',
  end_date = '2026-05-07',
  estimated_visitors = 1800,
  estimated_exhibitors = NULL,
  venue_id = (SELECT id FROM public.venues WHERE slug = 'universite-paul-sabatier-toulouse'),
  city = 'Toulouse',
  organizer_name = 'Toulouse Hacking Convention (asso)',
  website_url = 'https://thcon.party'
WHERE slug = 'numeriquest-toulouse-2026';

COMMIT;
