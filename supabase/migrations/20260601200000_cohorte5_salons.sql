-- ============================================================
-- Cohorte 5 : 40 salons éditoriaux (MDX content/salons/)
-- ============================================================
-- Insère les fiches salons dont le MDX cohorte 5 a été publié, et qui
-- n'étaient pas encore dans la table salons. Les venues correspondants ont été
-- créés en amont via 20260402000003_venues.sql, 20260601000000_grande_halle_villette.sql
-- et 20260601100000_cohorte5_venues.sql.
--
-- Conventions :
--  - status = 'published' (les MDX sont en ligne dès le seed indexé)
--  - ON CONFLICT (slug) DO NOTHING partout (migration idempotente)
--  - descriptions courtes (2 phrases max) tirées de "L'essentiel à retenir"
--  - chiffres exposants/visiteurs : dernière édition bilantée
--  - venue_id renseigné via UPDATE post-INSERT (sous-requête SELECT id FROM venues)
--  - international : country = ISO 3166 alpha-2 (IT, DE, AT)
--  - Eurogin 2026 : venue_id reste NULL (Austria Center Vienna pas en DB)
--  - rattachement secteur via salon_sectors lorsque le secteur métier existe

BEGIN;

-- ============================================================
-- ART, CULTURE, PHOTO (5 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('art-paris-2026', 'Art Paris', 2026, 'Foire d''art moderne et contemporain au Grand Palais, positionnée moyen marché et scène française en complément d''Art Basel Paris. Édition 2025 record à 87 275 visiteurs et 170 galeries de 25 pays.', '2026-04-09', '2026-04-12', 'Paris', 'Grand Palais', 48.8662, 2.3127, 'FR', 'https://www.artparis.com', 'France Conventions', 'annuel', 170, 87275, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('paris-photo-2026', 'Paris Photo', 2026, '29e édition de la plus grande foire internationale dédiée au médium photographique, nef et balcons du Grand Palais. Bilan 2025 : 87 275 visiteurs, 170 galeries de 25 pays, 1 385 artistes exposés.', '2026-11-12', '2026-11-15', 'Paris', 'Grand Palais', 48.8662, 2.3127, 'FR', 'https://www.parisphoto.com', 'RX France', 'annuel', 170, 87275, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('salon-photo-paris-2026', 'Salon Photo & Vidéo', 2026, 'Ex-Salon de la Photo rebrandé en 2026 pour intégrer la captation vidéo et la création de contenu. Bilan 2025 à la Grande Halle de la Villette : 37 188 visiteurs, 114 exposants réunissant 167 marques.', '2026-10-08', '2026-10-11', 'Paris', 'Grande Halle de la Villette', 48.8902, 2.3920, 'FR', 'https://www.lesalondelaphoto.com', 'Comexposium', 'annuel', 114, 37188, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('festival-livre-paris-2026', 'Festival du Livre de Paris', 2026, '5e édition du Festival du Livre de Paris au Grand Palais, Bande Dessinée invitée d''honneur, thème "Le Voyage". Édition record post-relance : 121 000 visiteurs, 1 800 auteurs, 3 000 dédicaces sur 12 scènes.', '2026-04-17', '2026-04-19', 'Paris', 'Grand Palais', 48.8662, 2.3127, 'FR', 'https://www.festivaldulivredeparis.fr', 'Paris Livres Événements (SNE)', 'annuel', NULL, 121000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('japan-expo-paris-2026', 'Japan Expo', 2026, '25e édition "25th Impact" du premier rendez-vous européen des cultures populaires japonaises, à Paris Nord Villepinte sur 4 jours. Bilan 2025 : 230 000 visiteurs, plus de 800 exposants, 671 invités et 674 événements sur 35 scènes.', '2026-07-09', '2026-07-12', 'Villepinte', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.japan-expo-paris.com', 'SEFA Event (groupe Iconik Global)', 'annuel', 800, 230000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TECH / IA / NUMÉRIQUE (4 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('big-data-ai-paris-2026', 'Big Data & AI Paris', 2026, '15e édition du rendez-vous des décideurs IT & Data qui industrialisent l''IA, premier salon data/IA en France par antériorité. Cibles 2026 : 15 000 participants, 200 exposants, 300+ speakers, 350+ conférences sur 3 salles.', '2026-09-15', '2026-09-16', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.bigdataparis.com', 'RX France', 'annuel', 200, 17000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('vivatech-2026', 'VivaTech', 2026, '10e édition de VivaTech à Paris Expo Porte de Versailles, avec +30 % de surface et l''Allemagne pays à l''honneur. Bilan 2025 : 180 000 visiteurs, 14 000 startups, 3 600 investisseurs, 171 nationalités représentées.', '2026-06-17', '2026-06-20', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://vivatechnology.com', 'Elvyr (Maurice Lévy) et LVMH / Les Echos', 'annuel', 14000, 180000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('innorobo-by-sido-2026', 'Innorobo by SIDO', 2026, 'Zone dédiée robotique au sein de SIDO Lyon, rendez-vous français de la convergence IoT, IA, XR et robotique. Bilan SIDO 2025 (relance Innorobo) : 380 exposants, ~9 000 visiteurs professionnels, 60 conférences.', '2026-09-16', '2026-09-17', 'Lyon', 'Centre de Congrès de Lyon', 45.7640, 4.8520, 'FR', 'https://www.sido-event.com', 'Infopro Digital Trade Shows', 'annuel', 380, 9000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('paris-games-week-2026', 'Paris Games Week', 2026, '15e édition de la Paris Games Week à Paris Expo Porte de Versailles, format grand public 4 jours doublé du volet PGW Business by CMS sur 2 jours pro. Bilan 2025 : 161 000 visiteurs, 180 exposants, 200+ titres jouables.', '2026-10-22', '2026-10-25', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.parisgamesweek.com', 'SELL (Fimalac Entertainment / GL Events / Webedia)', 'annuel', 180, 161000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- COSMÉTIQUE / BEAUTÉ (2 salons, dont 1 international)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('cosmetic-360-2026', 'Cosmetic 360', 2026, '12e édition du premier salon européen B2B dédié à l''innovation dans la cosmétique et la parfumerie, au Carrousel du Louvre. Édition 2025 record : 5 800 visiteurs, 260 exposants dont 36 startups, 75 pays représentés.', '2026-10-14', '2026-10-15', 'Paris', 'Carrousel du Louvre', 48.8614, 2.3354, 'FR', 'https://www.cosmetic-360.com', 'Cosmetic Valley', 'annuel', 260, 5800, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('cosmoprof-bologna-2027', 'Cosmoprof Worldwide Bologna', 2027, '58e édition du premier salon B2B mondial de la cosmétique à BolognaFiere, organisé en 3 sous-salons spécialisés (Cosmopack, Cosmo Perfumery & Cosmetics, Cosmo Hair Nail & Beauty Salon). Bilan 2026 : 255 000+ opérateurs de 150 pays, 3 104 exposants de 68 pays.', '2027-03-18', '2027-03-21', 'Bologne', 'BolognaFiere', 44.5095, 11.3596, 'IT', 'https://www.cosmoprof.com', 'BolognaFiere Cosmoprof S.p.A.', 'annuel', 3104, 255000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SANTÉ / PHARMA (3 salons, dont 2 internationaux)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('cphi-worldwide-2026', 'CPhI Worldwide', 2026, '35e édition du plus grand salon mondial de l''industrie pharmaceutique, à Fiera Milano avec Sustainability Summit pré-salon le 5 octobre. Bilan 2025 Frankfurt : 62 000+ visiteurs de 166 pays, 2 400 exposants, 260 conférenciers.', '2026-10-06', '2026-10-08', 'Rho', 'Fiera Milano', 45.5165, 9.0840, 'IT', 'https://www.cphi.com', 'Informa Markets', 'annuel', 2400, 62000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('eurogin-2026', 'Eurogin', 2026, 'Congrès international HPV multidisciplinaire à l''Austria Center Vienna, format 4 jours pleins de sessions scientifiques et expositions partenaires industrie. Édition 2025 Porto : 1 700+ participants venus de 79 pays, 80+ sessions, 616 présentations orales.', '2026-03-18', '2026-03-21', 'Vienne', 'Austria Center Vienna', 48.2353, 16.4144, 'AT', 'https://www.eurogin.com', 'Eurogin Scientific Society', 'annuel', NULL, 1700, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('pharmagora-plus-2027', 'Pharmagora Plus', 2027, '40e édition anniversaire du seul rendez-vous généraliste de la pharmacie d''officine en France, à Paris Expo Porte de Versailles Hall 7.2. Bilan 2026 : 9 000 à 13 000 professionnels, 350 à 400 exposants, 100 conférences et 75h+ de formation.', '2027-03-13', '2027-03-14', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.pharmagora-plus.com', 'CloserStill Media', 'annuel', 400, 11000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AGRICULTURE / AGROALIMENTAIRE (5 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('cfia-rennes-2027', 'CFIA Rennes', 2027, '30e édition anniversaire du carrefour des fournisseurs de l''industrie agroalimentaire, structuré en 4 univers (Ingrédients & PAI, Équipements & Procédés, Emballage, Food Safety). Édition 2026 : 23 959 visiteurs (+1,4 %) et 2 000 exposants dont 17 % d''internationaux sur 12 halls.', '2027-03-09', '2027-03-11', 'Rennes', 'Parc Expo Rennes', 48.1255, -1.7133, 'FR', 'https://www.cfiaexpo.com', 'GL Events Exhibitions', 'annuel', 2000, 23959, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('sia-paris-2027', 'Salon International de l''Agriculture', 2027, '63e édition du premier salon agricole grand public au monde, à Paris Expo Porte de Versailles sur 9 jours. Pays invité 2027 : Serbie. 1 100+ exposants attendus sur 4 univers (élevages, cultures, gastronomie régionale, agriculture mondiale).', '2027-02-27', '2027-03-07', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salon-agriculture.com', 'CENECA', 'annuel', 1100, NULL, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('sival-angers-2027', 'SIVAL', 2027, '40e édition anniversaire au Parc des Expositions d''Angers, seul salon français couvrant toutes les productions végétales spécialisées (viti, arbo, maraîchage, horti, PPAM). Édition 2026 : près de 24 000 visiteurs, 700 exposants, 14 % d''internationaux issus de 55 nationalités.', '2027-01-12', '2027-01-14', 'Verrières-en-Anjou', 'Parc des Expositions d''Angers', 47.5128, -0.4885, 'FR', 'https://www.sival-angers.com', 'Destination Angers (SPL ALTEC)', 'annuel', 700, 24000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('sirha-bake-snack-2028', 'Sirha Bake & Snack', 2028, '27e édition à Paris Expo Porte de Versailles, salon biennal organisé en complémentarité de Sirha Lyon. Bilan 2026 (ex-Europain) : 35 500 visiteurs (+11 %), 534 exposants, 15 % d''internationaux, sur 3 piliers (boulangerie, pâtisserie, snacking) élargis aux Pôles Café et Start-Up.', '2028-01-16', '2028-01-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.sirha-bakeandsnack.com', 'GL Events et Ekip (marque ombrelle Sirha Food)', 'bisannuel', 534, 35500, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('snack-show-2026', 'Snack Show', 2026, '26e édition du salon B2B leader en France du snacking et de la restauration rapide, à Paris Expo Porte de Versailles Pavillon 7.2. Bilan 2026 : 450 exposants, 16 000 visiteurs, 1 800 innovations sur 3 univers (Snacking, Parizza+Gusto, Smart Lab) plus The Coffee Place.', '2026-04-01', '2026-04-02', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.snackshow.com', 'RX France', 'annuel', 450, 16000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VINS / VIGNERONS (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('salon-vignerons-independants-paris-2026', 'Salon des Vignerons Indépendants Paris', 2026, '48e édition Porte de Versailles Pavillon 3, exclusivement réservé aux vignerons qui cultivent, vinifient, embouteillent et commercialisent eux-mêmes leur production. Bilan édition précédente : 665 vignerons présents dont 30 % de femmes vigneronnes.', '2026-12-10', '2026-12-13', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.vigneron-independant.com', 'Confédération Nationale des Vignerons Indépendants de France', 'annuel', 665, NULL, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MODE / BIJOU (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('bijorhca-paris-2026', 'Bijorhca Paris', 2026, 'Salon B2B bijouterie joaillerie horlogerie à Paris Expo Porte de Versailles Hall 7, co-localisé avec Who''s Next sous le cluster Room 0126 de Comexposium. Édition janvier 2026 : environ 180 marques, 25 % de nouveaux entrants, 50 % de visiteurs internationaux.', '2026-09-05', '2026-09-07', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.bijorhca.com', 'WSN Développement (Comexposium)', 'bisannuel', 180, NULL, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DÉCO / HABITAT (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('maison-objet-paris-2026', 'Maison&Objet Paris Pulse', 2026, 'Édition de rentrée du salon de référence mondial pour la décoration, le design et l''art de vivre, à Paris Nord Villepinte. Édition janvier 2026 : 67 300 visiteurs de 148 pays, 2 300 marques exposantes dont 500 nouvelles, 50 % de visitorat international.', '2026-09-10', '2026-09-14', 'Villepinte', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.maison-objet.com', 'SAFI (Ateliers d''Art de France et RX France)', 'bisannuel', 2300, 67300, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INDUSTRIE / COMPOSITES (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('jec-world-2026', 'JEC World', 2026, '1er salon mondial des composites à Paris Nord Villepinte, format annuel inchangé depuis le retour post-Covid. Édition 2025 : 45 000+ visiteurs de 100 pays, 1 350 exposants, 78 000 m². Cible 2026 : 46 000 visiteurs, 1 400+ exposants, 27 pavillons pays.', '2026-03-10', '2026-03-12', 'Villepinte', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.jec-world.events', 'JEC Group', 'annuel', 1350, 45000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AUTO / MOBILITÉ (2 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('mondial-auto-paris-2026', 'Mondial de l''Auto Paris', 2026, '91e édition du plus ancien salon automobile au monde, format porté à 7 jours à Paris Expo Porte de Versailles. Édition 2024 record : 508 007 visiteurs (+27,7 %), 48 constructeurs, 158 exposants, 4 000 journalistes accrédités sur 5 pavillons.', '2026-10-12', '2026-10-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.mondial.paris', 'PFA (Plateforme Automobile)', 'bisannuel', 158, 508007, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('equip-auto-paris-2027', 'Equip Auto Paris', 2027, 'Rendez-vous mondial de l''après-vente, de la réparation et des services pour la mobilité, à Paris Expo Porte de Versailles sur rythme biennal. Édition 2025 record (50 ans) : 91 500 visiteurs (+17 %), 1 400 exposants (55 % internationaux issus de 35 pays), 100 000 m² sur 5 halls.', '2027-10-12', '2027-10-16', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.equipauto.com', 'GL Events Exhibitions', 'bisannuel', 1400, 91500, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TOURISME / HÔTELLERIE (3 salons, dont 1 international)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('equip-hotel-paris-2026', 'Equip''Hôtel Paris', 2026, '26e édition à Paris Expo Porte de Versailles, format réduit à 4 jours sur 4 pavillons (4, 7.1, 7.2, 7.3). Bilan 2024 : 1 200 exposants et ~80 000 visiteurs pros, 40 % d''exposants internationaux issus de 40 pays, 114 pays côté visitorat.', '2026-11-02', '2026-11-05', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.equiphotel.com', 'RX France', 'bisannuel', 1200, 80000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('itb-berlin-2027', 'ITB Berlin', 2027, 'Plus grande bourse mondiale du tourisme à Messe Berlin, format consolidé B2B 3 jours depuis 2023. Pays partenaire 2027 : Maldives. Édition 2026 (60e anniversaire) : environ 97 000 visiteurs pros, 5 601 exposants, 166 pays représentés, 47 Md€ de transactions générées.', '2027-03-16', '2027-03-18', 'Berlin', 'Messe Berlin', 52.5039, 13.2737, 'DE', 'https://www.itb.com', 'Messe Berlin GmbH', 'annuel', 5601, 97000, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('salon-mondial-tourisme-2026', 'Salon Mondial du Tourisme', 2026, '49e édition à Paris Expo Porte de Versailles Pavillon 4. Édition 2026 : 73 330 visiteurs, plus de 200 exposants et environ 400 destinations représentées, 25 % de primo-participants.', '2026-03-12', '2026-03-15', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salonmondialdutourisme.com', 'Comexposium', 'annuel', 200, 73330, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MONTAGNE (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('mountain-planet-2026', 'Mountain Planet', 2026, 'Rendez-vous mondial de l''aménagement et du développement de la montagne à Alpexpo Grenoble, rythme biennal sur années paires. Édition 2024 (50 ans) : 23 604 visiteurs professionnels, 462 exposants, 67 pays représentés sur 50 000 m².', '2026-04-21', '2026-04-23', 'Grenoble', 'Alpexpo Grenoble', 45.1630, 5.7405, 'FR', 'https://www.mountain-planet.com', 'Alpexpo (SPL Grenoble Alpes Métropole)', 'bisannuel', 462, 23604, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SÉCURITÉ / DÉFENSE (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('expoprotection-2026', 'Expoprotection', 2026, '30e édition du salon de référence de la prévention et de la gestion des risques en France, à Paris Expo Porte de Versailles Pavillon 1. Bilan 2024 : 14 500 visiteurs uniques (+7 %), 100+ pays représentés, 660 exposants dont 55 % d''internationaux.', '2026-11-03', '2026-11-05', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.expoprotection.com', 'RX France', 'bisannuel', 660, 14500, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- POP CULTURE (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('comic-con-france-2026', 'Comic Con France', 2026, 'Édition 2026 à Paris Nord Villepinte, deuxième édition consécutive sur le site après la bascule depuis la Porte de Versailles en 2025. Format week-end 2 jours grand public, dizaines de milliers de visiteurs en 2025.', '2026-04-18', '2026-04-19', 'Villepinte', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.comic-con-paris.com', 'RX France (ReedPop)', 'annuel', NULL, NULL, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- LOGISTIQUE / TRANSPORT (2 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('sitl-2026', 'SITL', 2026, '42e édition du Salon International du Transport et de la Logistique à Paris Nord Villepinte Hall 7, alternant avec Porte de Versailles les années impaires. Cibles 2026 : 27 000+ professionnels, 580+ exposants, 3 450+ rendez-vous d''affaires, 80+ conférences.', '2026-03-31', '2026-04-02', 'Villepinte', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.sitl.eu', 'RX France', 'annuel', 580, 26750, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('solutrans-2027', 'Solutrans', 2027, '19e édition du salon international des solutions de transport routier et urbain à Eurexpo Lyon, plus grand format jamais déployé (108 000 m²). Bilan 2025 : près de 64 000 visiteurs (25 % internationaux), plus de 1 100 exposants (30 % internationaux issus de 21 pays).', '2027-11-16', '2027-11-20', 'Chassieu', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.solutrans.eu', 'Comexposium', 'bisannuel', 1100, 64000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- BTP / GÉOTECHNIQUE (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('solscope-2027', 'Solscope', 2027, '17e édition du seul salon B2B en France couvrant l''intégralité de la chaîne géotechnique, forages et fondations spéciales, à Eurexpo Lyon Hall 7 sur 2 jours. Édition 2025 record : 4 630 participants (+8 %) et plus de 230 exposants sur 6 000 m² intérieur et 1 500 m² extérieur.', '2027-06-15', '2027-06-16', 'Chassieu', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.solscope.fr', 'ATTITUDE Consultants et RPI', 'bisannuel', 230, 4630, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- IMMOBILIER / PROPTECH (2 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('rent-2026', 'RENT (Real Estate & New Technologies)', 2026, '14e édition du premier salon proptech B2B de France à Paris Expo Porte de Versailles Pavillon 6, dédié aux technologies et services de l''immobilier transactionnel, locatif et gestion. Bilan 2025 : 11 500+ visiteurs pros, 400 exposants dont une centaine de startups, 120+ conférences.', '2026-11-04', '2026-11-05', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.rentevent.com', 'Figaro Classifieds', 'annuel', 400, 11500, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('simi-2026', 'SIMI', 2026, '24e édition du rendez-vous annuel de l''immobilier d''entreprise français à Paris Expo Porte de Versailles, après le déménagement structurant de 2025 depuis le Palais des Congrès Porte Maillot. Bilan 2025 : 26 052 professionnels, 470 exposants, 115 prises de parole.', '2026-12-08', '2026-12-10', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salonsimi.com', 'Infopro Digital', 'annuel', 470, 26052, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MADE IN FRANCE / FRANCHISE (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('mif-expo-2026', 'MIF Expo (Salon du Made in France)', 2026, '14e édition à Paris Expo Porte de Versailles Pavillon 7.2, salon B2C dominant à fort effet vitrine BtoB (80 % grand public, 20 % visiteurs professionnels). Bilan 2025 : 110 000 visiteurs, 1 000 exposants, environ 500 journalistes accrédités.', '2026-11-12', '2026-11-15', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.mifexpo.fr', 'ADEL SAS', 'annuel', 1000, 110000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RH / FORMATION / ÉTUDIANT (2 salons)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('solutions-rh-2026', 'Solutions RH', 2026, '31e édition à Paris Expo Porte de Versailles Pavillon 4, sur 4 domaines (Conseil & Management, SIRH, Protection sociale, Formation) et format multi-salons (5 événements co-localisés). Bilan 2025 : 9 140 visiteurs (+15 %), environ 250 exposants, 90+ conférences et ateliers.', '2026-04-08', '2026-04-09', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salons-solutions-rh.com', 'Infopromotions', 'annuel', 250, 9140, 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('salon-etudiant-ile-de-france-2026', 'Salon de l''Étudiant Île-de-France', 2026, '40e édition à Paris Expo Porte de Versailles Pavillons 5.2 et 5.3, salon historique d''orientation post-bac créé en 1986, premier rendez-vous parisien de l''année pour les lycéens et étudiants franciliens. Volumétrie attendue : 35 000 à 45 000 visiteurs sur 3 jours.', '2026-01-30', '2026-02-01', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.letudiant.fr/etudes/salons', 'L''Étudiant', 'annuel', NULL, 40000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- COLLECTIVITÉS / SECTEUR PUBLIC (1 salon)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('smcl-2026', 'Salon des Maires et des Collectivités Locales', 2026, '32e édition à Paris Expo Porte de Versailles Pavillon 7, co-localisé et concomitant au Congrès des Maires de l''AMF. Bilan 2025 : 65 672 visiteurs (+8,4 %), 1 380 exposants, 448 prises de parole, 600 journalistes, 45 visites officielles.', '2026-11-24', '2026-11-26', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salondesmaires.com', 'Infopro Digital', 'annuel', 1380, 65672, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Liaison venue_id (sous-requête sur slug venue)
-- ============================================================

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'grand-palais') WHERE slug IN ('art-paris-2026', 'paris-photo-2026', 'festival-livre-paris-2026');
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'grande-halle-villette') WHERE slug = 'salon-photo-paris-2026';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'paris-nord-villepinte') WHERE slug IN ('japan-expo-paris-2026', 'jec-world-2026', 'maison-objet-paris-2026', 'comic-con-france-2026', 'sitl-2026');
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'paris-expo-porte-de-versailles') WHERE slug IN ('big-data-ai-paris-2026', 'vivatech-2026', 'paris-games-week-2026', 'pharmagora-plus-2027', 'sia-paris-2027', 'sirha-bake-snack-2028', 'snack-show-2026', 'salon-vignerons-independants-paris-2026', 'bijorhca-paris-2026', 'mondial-auto-paris-2026', 'equip-auto-paris-2027', 'equip-hotel-paris-2026', 'salon-mondial-tourisme-2026', 'expoprotection-2026', 'rent-2026', 'simi-2026', 'mif-expo-2026', 'solutions-rh-2026', 'salon-etudiant-ile-de-france-2026', 'smcl-2026');
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'centre-de-congres-de-lyon') WHERE slug = 'innorobo-by-sido-2026';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'carrousel-du-louvre') WHERE slug = 'cosmetic-360-2026';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'bolognafiere') WHERE slug = 'cosmoprof-bologna-2027';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'fiera-milano') WHERE slug = 'cphi-worldwide-2026';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'messe-berlin') WHERE slug = 'itb-berlin-2027';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'parc-expo-rennes') WHERE slug = 'cfia-rennes-2027';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'parc-expo-angers') WHERE slug = 'sival-angers-2027';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'alpexpo-grenoble') WHERE slug = 'mountain-planet-2026';
UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'eurexpo-lyon') WHERE slug IN ('solutrans-2027', 'solscope-2027');
-- eurogin-2026 : pas de venue (Austria Center Vienna pas en DB), venue_id reste NULL

-- ============================================================
-- Rattachement secteurs (salon_sectors)
-- Mapping vers les sectors existants (cf. 20260401000001_seed_data.sql).
-- Skip pour art, photo, pop culture, livre, gaming, immobilier, montagne,
-- collectivités, auto : pas de sector métier correspondant en base.
-- ============================================================

-- Tech / Numérique
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('big-data-ai-paris-2026', 'vivatech-2026', 'paris-games-week-2026')
  AND sec.slug = 'tech-numerique'
ON CONFLICT DO NOTHING;

-- Innorobo : industrie + tech-numerique
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'innorobo-by-sido-2026'
  AND sec.slug IN ('industrie', 'tech-numerique')
ON CONFLICT DO NOTHING;

-- Cosmétique / Beauté
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('cosmetic-360-2026', 'cosmoprof-bologna-2027')
  AND sec.slug = 'cosmetique-beaute'
ON CONFLICT DO NOTHING;

-- Santé / Pharma
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('cphi-worldwide-2026', 'eurogin-2026', 'pharmagora-plus-2027')
  AND sec.slug = 'sante-pharma'
ON CONFLICT DO NOTHING;

-- Agroalimentaire
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('cfia-rennes-2027', 'sirha-bake-snack-2028', 'snack-show-2026')
  AND sec.slug = 'agroalimentaire'
ON CONFLICT DO NOTHING;

-- Agriculture
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('sia-paris-2027', 'sival-angers-2027', 'salon-vignerons-independants-paris-2026')
  AND sec.slug = 'agriculture'
ON CONFLICT DO NOTHING;

-- Mode / Textile (Bijorhca)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'bijorhca-paris-2026'
  AND sec.slug = 'mode-textile'
ON CONFLICT DO NOTHING;

-- Décoration / Habitat
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'maison-objet-paris-2026'
  AND sec.slug = 'decoration-habitat'
ON CONFLICT DO NOTHING;

-- Industrie (JEC composites)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'jec-world-2026'
  AND sec.slug = 'industrie'
ON CONFLICT DO NOTHING;

-- Tourisme / Hôtellerie
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('equip-hotel-paris-2026', 'itb-berlin-2027', 'salon-mondial-tourisme-2026', 'mountain-planet-2026')
  AND sec.slug = 'tourisme-hotellerie'
ON CONFLICT DO NOTHING;

-- Défense / Sécurité
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'expoprotection-2026'
  AND sec.slug = 'defense-securite'
ON CONFLICT DO NOTHING;

-- Logistique / Transport
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('sitl-2026', 'solutrans-2027')
  AND sec.slug = 'logistique-transport'
ON CONFLICT DO NOTHING;

-- BTP / Construction (Solscope géotechnique)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'solscope-2027'
  AND sec.slug = 'btp-construction'
ON CONFLICT DO NOTHING;

-- Franchise / Commerce (MIF Expo, salon BtoC dominant à effet vitrine BtoB)
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'mif-expo-2026'
  AND sec.slug = 'franchise-commerce'
ON CONFLICT DO NOTHING;

-- RH / Formation
INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug IN ('solutions-rh-2026', 'salon-etudiant-ile-de-france-2026')
  AND sec.slug = 'rh-formation'
ON CONFLICT DO NOTHING;

COMMIT;
