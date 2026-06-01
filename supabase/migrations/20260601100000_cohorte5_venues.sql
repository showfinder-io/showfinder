-- ============================================================
-- Migration : venues manquants pour cohorte 5
-- ============================================================
-- Ajoute les venues référencés par les MDX cohorte 5 mais absents de la table venues.
-- Couvre : Grand Palais, Parc Expo Angers, BolognaFiere, Fiera Milano, Messe Berlin.

INSERT INTO venues (slug, name, city, address, postal_code, country, lat, lng, total_surface_sqm, website_url, description, google_maps_url) VALUES
(
  'grand-palais',
  'Grand Palais',
  'Paris',
  '3 Avenue du Général Eisenhower, 75008 Paris',
  '75008',
  'FR',
  48.8662, 2.3127,
  72000,
  'https://www.grandpalais.fr',
  'Édifice emblématique des Champs-Élysées construit pour l''Exposition universelle de 1900. Rénové et rouvert en 2024, il accueille Paris Photo, Art Paris, Festival du Livre, Art Basel Paris et de nombreuses expositions et foires d''art majeures.',
  'https://www.google.com/maps/search/?api=1&query=48.8662,2.3127'
),
(
  'parc-expo-angers',
  'Parc des Expositions d''Angers',
  'Verrières-en-Anjou',
  'Route de Paris, 49480 Verrières-en-Anjou',
  '49480',
  'FR',
  47.5128, -0.4885,
  34000,
  'https://www.destination-angers.com/parc-des-expositions/',
  'Parc des expositions d''Angers exploité par Destination Angers (SPL ALTEC). Site certifié ISO 20121. Accueille notamment le SIVAL, salon des productions végétales spécialisées.',
  'https://www.google.com/maps/search/?api=1&query=47.5128,-0.4885'
),
(
  'bolognafiere',
  'BolognaFiere',
  'Bologne',
  'Viale della Fiera 20, 40127 Bologna',
  '40127',
  'IT',
  44.5095, 11.3596,
  170000,
  'https://www.bolognafiere.it',
  'Premier centre d''exposition d''Italie avec 170 000 m². Accueille chaque année Cosmoprof Worldwide Bologna, premier salon mondial B2B de l''industrie cosmétique, et de nombreux autres événements internationaux.',
  'https://www.google.com/maps/search/?api=1&query=44.5095,11.3596'
),
(
  'fiera-milano',
  'Fiera Milano',
  'Rho',
  'Strada Statale del Sempione 28, 20017 Rho MI',
  '20017',
  'IT',
  45.5165, 9.0840,
  345000,
  'https://www.fieramilano.it',
  'Plus grand centre d''exposition d''Europe avec 345 000 m² de surface couverte, situé à Rho près de Milan. Accueille CPhI Worldwide, Salone del Mobile, Host et de nombreux salons internationaux.',
  'https://www.google.com/maps/search/?api=1&query=45.5165,9.0840'
),
(
  'messe-berlin',
  'Messe Berlin',
  'Berlin',
  'Messedamm 22, 14055 Berlin',
  '14055',
  'DE',
  52.5039, 13.2737,
  160000,
  'https://www.messe-berlin.de',
  'Parc des expositions de Berlin avec 160 000 m² répartis sur 26 halls, situé à Berlin ExpoCenter City. Accueille ITB Berlin (plus grande bourse mondiale du tourisme), IFA, InnoTrans et de nombreux salons internationaux majeurs.',
  'https://www.google.com/maps/search/?api=1&query=52.5039,13.2737'
)
ON CONFLICT (slug) DO NOTHING;
