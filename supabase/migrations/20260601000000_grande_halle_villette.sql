-- Ajout du venue Grande Halle de la Villette
-- Necessaire pour les fiches salons Photo & Video 2026, Architect@Work Paris, Comic Con (historique 2015), etc.

BEGIN;

INSERT INTO public.venues
  (slug, name, city, postal_code, country, address, lat, lng, website_url, description)
VALUES (
  'grande-halle-villette',
  'Grande Halle de la Villette',
  'Paris',
  '75019',
  'FR',
  '211 avenue Jean Jaures, 75019 Paris',
  48.8902,
  2.3920,
  'https://lavillette.com/',
  'Ancienne halle aux boeufs construite en 1867 par Jules de Merindol, classee monument historique en 1979, reconvertie en espace evenementiel de 20 000 m² au coeur du Parc de la Villette (55 hectares). Accueille notamment le Salon Photo & Video, Architect@Work Paris et de nombreux salons culturels et professionnels grand public.'
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
