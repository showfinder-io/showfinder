-- ============================================================
-- Migration : Table venues (lieux d'exposition)
-- ============================================================

-- Table venues
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  address TEXT,
  postal_code VARCHAR,
  country VARCHAR NOT NULL DEFAULT 'FR',
  lat FLOAT,
  lng FLOAT,
  total_surface_sqm INT,
  website_url VARCHAR,
  description TEXT,
  photo_url VARCHAR,
  google_maps_url VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FK venue_id sur salons
ALTER TABLE salons ADD COLUMN venue_id UUID REFERENCES venues(id) ON DELETE SET NULL;

-- Index
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_salons_venue_id ON salons(venue_id);

-- RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique venues" ON venues FOR SELECT USING (true);

-- ============================================================
-- Seed : principaux lieux d'exposition en France
-- ============================================================

INSERT INTO venues (slug, name, city, address, postal_code, country, lat, lng, total_surface_sqm, website_url, description, google_maps_url) VALUES
(
  'paris-nord-villepinte',
  'Paris Nord Villepinte',
  'Villepinte',
  'ZAC Paris Nord 2, 93420 Villepinte',
  '93420',
  'FR',
  48.9696, 2.5156,
  246000,
  'https://www.vfrancefr.com/parc-des-expositions-de-paris-nord-villepinte/',
  'Plus grand parc des expositions de France avec 246 000 m² de surface couverte, situé à proximité de l''aéroport Paris-Charles de Gaulle. Il accueille les plus grands salons professionnels internationaux.',
  'https://www.google.com/maps/search/?api=1&query=48.9696,2.5156'
),
(
  'paris-expo-porte-de-versailles',
  'Paris Expo Porte de Versailles',
  'Paris',
  '1 Place de la Porte de Versailles, 75015 Paris',
  '75015',
  'FR',
  48.8322, 2.2873,
  228000,
  'https://www.vfrancefr.com/parc-des-expositions-de-paris-porte-de-versailles/',
  'Situé au cœur de Paris, le Parc des Expositions de la Porte de Versailles est le premier site événementiel urbain en Europe. Rénové dans le cadre du projet Viparis, il offre 228 000 m² de surface.',
  'https://www.google.com/maps/search/?api=1&query=48.8322,2.2873'
),
(
  'palais-des-congres-paris',
  'Palais des Congrès de Paris',
  'Paris',
  '2 Place de la Porte Maillot, 75017 Paris',
  '75017',
  'FR',
  48.8789, 2.2831,
  40000,
  'https://www.pfrancefr.com/palais-des-congres-de-paris/',
  'Centre de congrès emblématique de Paris, situé Porte Maillot. Avec ses 4 amphithéâtres et 40 000 m² de surface, il accueille congrès, conventions et salons professionnels.',
  'https://www.google.com/maps/search/?api=1&query=48.8789,2.2831'
),
(
  'eurexpo-lyon',
  'Eurexpo Lyon',
  'Chassieu',
  'Boulevard de l''Europe, 69680 Chassieu',
  '69680',
  'FR',
  45.7275, 4.9520,
  125000,
  'https://www.eurexpo.com/',
  'Deuxième parc des expositions de France avec 125 000 m² de surface d''exposition, situé aux portes de Lyon. Eurexpo accueille plus de 50 salons professionnels et grand public chaque année.',
  'https://www.google.com/maps/search/?api=1&query=45.7275,4.9520'
),
(
  'centre-de-congres-de-lyon',
  'Centre de Congrès de Lyon',
  'Lyon',
  '50 Quai Charles de Gaulle, 69006 Lyon',
  '69006',
  'FR',
  45.7640, 4.8520,
  26000,
  'https://www.ccc-lyon.com/',
  'Situé dans le quartier de la Cité Internationale, le Centre de Congrès de Lyon dispose de 26 000 m² modulables au bord du Rhône. Un lieu prisé pour les congrès médicaux et scientifiques.',
  'https://www.google.com/maps/search/?api=1&query=45.7640,4.8520'
),
(
  'parc-expo-rennes',
  'Parc Expo Rennes',
  'Rennes',
  'Rue de Saint-Malo, 35000 Rennes',
  '35000',
  'FR',
  48.1255, -1.7133,
  44000,
  'https://www.rennes-expo.fr/',
  'Le Parc Expo de Rennes propose 44 000 m² d''espace d''exposition au cœur de la Bretagne. Il accueille le célèbre salon SPACE et de nombreux événements professionnels agricoles et industriels.',
  'https://www.google.com/maps/search/?api=1&query=48.1255,-1.7133'
),
(
  'meett-toulouse',
  'MEETT Toulouse',
  'Toulouse',
  'Concorde Avenue, 31840 Aussonne',
  '31840',
  'FR',
  43.6529, 1.3679,
  155000,
  'https://www.meett.fr/',
  'Inauguré en 2020, le MEETT est le nouveau parc des expositions et centre de conventions de Toulouse Métropole. Avec 155 000 m², c''est l''un des plus grands complexes événementiels de France.',
  'https://www.google.com/maps/search/?api=1&query=43.6529,1.3679'
),
(
  'lille-grand-palais',
  'Lille Grand Palais',
  'Lille',
  '1 Boulevard des Cités Unies, 59777 Lille',
  '59777',
  'FR',
  50.6333, 3.0607,
  77000,
  'https://www.lillegrandpalais.com/',
  'Centre de congrès et d''exposition de Lille, avec 77 000 m² au cœur de l''Eurorégion. Lille Grand Palais accueille congrès internationaux, salons professionnels et événements culturels.',
  'https://www.google.com/maps/search/?api=1&query=50.6333,3.0607'
),
(
  'parc-des-expositions-de-bordeaux',
  'Parc des Expositions de Bordeaux',
  'Bordeaux',
  'Cours Charles Bricaud, 33300 Bordeaux',
  '33300',
  'FR',
  44.8805, -0.5636,
  80000,
  'https://www.bordeaux-expo.com/',
  'Parc des Expositions de Bordeaux Lac, situé au nord de la ville avec 80 000 m² de surface. Il accueille le salon Vinexpo et de nombreux événements viticoles et agroalimentaires.',
  'https://www.google.com/maps/search/?api=1&query=44.8805,-0.5636'
),
(
  'carrousel-du-louvre',
  'Carrousel du Louvre',
  'Paris',
  '99 Rue de Rivoli, 75001 Paris',
  '75001',
  'FR',
  48.8614, 2.3354,
  8800,
  'https://www.carrouseldulouvre.com/',
  'Espace événementiel prestigieux situé sous la Pyramide du Louvre. Avec 8 800 m² de surface modulable, le Carrousel du Louvre accueille salons d''art, de design et événements haut de gamme.',
  'https://www.google.com/maps/search/?api=1&query=48.8614,2.3354'
),
(
  'paris-le-bourget',
  'Parc des Expositions Paris Le Bourget',
  'Le Bourget',
  'Aéroport Paris-Le Bourget, 93350 Le Bourget',
  '93350',
  'FR',
  48.9460, 2.4280,
  100000,
  'https://www.bourget.com/',
  'Situé sur l''aéroport du Bourget, ce parc des expositions est mondialement connu pour le Salon International de l''Aéronautique et de l''Espace. Il offre 100 000 m² en intérieur et extérieur.',
  'https://www.google.com/maps/search/?api=1&query=48.9460,2.4280'
),
(
  'parc-des-expositions-de-strasbourg',
  'Parc des Expositions de Strasbourg',
  'Strasbourg',
  '7 Place Adrien Zeller, 67000 Strasbourg',
  '67000',
  'FR',
  48.5850, 7.7685,
  60000,
  'https://www.strasbourg-events.com/',
  'Le Parc des Expositions de Strasbourg, au cœur du quartier Wacken, propose 60 000 m² pour accueillir des salons professionnels et grand public à dimension européenne et transfrontalière.',
  'https://www.google.com/maps/search/?api=1&query=48.5850,7.7685'
),
(
  'parc-des-expositions-de-nantes',
  'Parc des Expositions de Nantes',
  'Nantes',
  'Route de Saint-Joseph de Porterie, 44300 Nantes',
  '44300',
  'FR',
  47.2575, -1.5200,
  48000,
  'https://www.exponantes.com/',
  'Exponantes propose 48 000 m² de surface d''exposition aux portes de Nantes. Il accueille des salons professionnels et grand public, notamment dans les secteurs de l''habitat, de l''industrie et de l''agriculture.',
  'https://www.google.com/maps/search/?api=1&query=47.2575,-1.5200'
),
(
  'parc-chanot-marseille',
  'Parc Chanot Marseille',
  'Marseille',
  'Rond-Point du Prado, 13008 Marseille',
  '13008',
  'FR',
  43.2652, 5.3975,
  38000,
  'https://www.marseille-chanot.com/',
  'Centre d''expositions et de congrès de Marseille avec 38 000 m² de surface. Situé à proximité du Stade Vélodrome, le Parc Chanot accueille salons, congrès et événements culturels méditerranéens.',
  'https://www.google.com/maps/search/?api=1&query=43.2652,5.3975'
),
(
  'alpexpo-grenoble',
  'Alpexpo Grenoble',
  'Grenoble',
  'Avenue d''Innsbruck, 38100 Grenoble',
  '38100',
  'FR',
  45.1630, 5.7405,
  20000,
  'https://www.alpexpo.com/',
  'Centre d''exposition et de congrès de Grenoble avec 20 000 m² de surface. Alpexpo est un lieu clé pour les salons technologiques et industriels de la région Auvergne-Rhône-Alpes.',
  'https://www.google.com/maps/search/?api=1&query=45.1630,5.7405'
),
(
  'parc-expo-colmar',
  'Parc Expo Colmar',
  'Colmar',
  'Avenue de la Foire aux Vins, 68000 Colmar',
  '68000',
  'FR',
  48.0760, 7.3380,
  30000,
  'https://www.parc-expo-colmar.com/',
  'Parc des Expositions de Colmar avec 30 000 m² de surface en Alsace. Connu pour la Foire aux Vins d''Alsace, il accueille salons viticoles, agricoles et événements grand public.',
  'https://www.google.com/maps/search/?api=1&query=48.0760,7.3380'
),
(
  'parc-expo-metz',
  'Parc Expo Metz',
  'Metz',
  'Rue de la Grange aux Bois, 57000 Metz',
  '57000',
  'FR',
  49.0957, 6.2170,
  35000,
  'https://www.metz-expo.com/',
  'Le Parc des Expositions de Metz, situé dans le quartier de la Grange aux Bois, offre 35 000 m² de surface. Il accueille salons professionnels et événements grand public dans la Grande Région.',
  'https://www.google.com/maps/search/?api=1&query=49.0957,6.2170'
);

-- ============================================================
-- Liaison des salons existants aux venues
-- ============================================================

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'paris-nord-villepinte')
WHERE venue ILIKE '%villepinte%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'paris-expo-porte-de-versailles')
WHERE venue ILIKE '%versailles%' OR venue ILIKE '%porte de versailles%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'palais-des-congres-paris')
WHERE venue ILIKE '%palais des congrès%' AND venue ILIKE '%paris%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'eurexpo-lyon')
WHERE venue ILIKE '%eurexpo%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'centre-de-congres-de-lyon')
WHERE venue ILIKE '%centre de congrès%' AND venue ILIKE '%lyon%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-expo-rennes')
WHERE venue ILIKE '%rennes%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'meett-toulouse')
WHERE venue ILIKE '%meett%' OR (venue ILIKE '%toulouse%' AND venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'lille-grand-palais')
WHERE venue ILIKE '%lille grand palais%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-des-expositions-de-bordeaux')
WHERE venue ILIKE '%bordeaux%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'carrousel-du-louvre')
WHERE venue ILIKE '%carrousel%' OR venue ILIKE '%louvre%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'paris-le-bourget')
WHERE venue ILIKE '%bourget%';

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-des-expositions-de-strasbourg')
WHERE venue ILIKE '%strasbourg%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%' OR venue ILIKE '%wacken%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-des-expositions-de-nantes')
WHERE venue ILIKE '%nantes%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-chanot-marseille')
WHERE venue ILIKE '%chanot%' OR (venue ILIKE '%marseille%' AND venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'alpexpo-grenoble')
WHERE venue ILIKE '%alpexpo%' OR (venue ILIKE '%grenoble%' AND venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-expo-colmar')
WHERE venue ILIKE '%colmar%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%');

UPDATE salons SET venue_id = (SELECT id FROM venues WHERE slug = 'parc-expo-metz')
WHERE venue ILIKE '%metz%' AND (venue ILIKE '%parc%' OR venue ILIKE '%expo%');
