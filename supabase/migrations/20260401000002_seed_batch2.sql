-- ============================================================
-- Showfinder : batch seed — AGROALIMENTAIRE, AGRICULTURE, TOURISME/HOTELLERIE
-- Salons reels verifiables, donnees publiques
-- 40 salons supplementaires
-- ============================================================

-- ============================================================
-- AGROALIMENTAIRE (14 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('ipa-nantes-2026', 'IPA - Ingredients & Process Alimentaires', 2026, 'Salon des ingredients, equipements et process pour l''industrie agroalimentaire. Rendez-vous cle de la filiere IAA dans le Grand Ouest.', '2026-10-19', '2026-10-21', 'Nantes', 'Parc des Expositions de la Beaujoire', 47.2571, -1.5250, 'FR', 'https://www.ipa-web.com', 'GL Events', 'bisannuel', 500, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('natexpo-lyon-2025', 'Natexpo', 2025, 'Salon international des produits biologiques et de l''eco-responsabilite. Le rendez-vous professionnel du bio et du naturel en France.', '2025-10-20', '2025-10-22', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.natexpo.com', 'SPAS Organisation', 'annuel', 1300, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('mdd-expo-paris-2026', 'MDD Expo', 2026, 'Salon international de la marque de distributeur. Innovations produits et packaging pour les marques propres de la grande distribution.', '2026-03-24', '2026-03-25', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.mdd-expo.com', 'Comexposium', 'annuel', 500, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('all4pack-paris-2026', 'ALL4PACK Emballage Paris', 2026, 'Salon international de l''emballage et de l''intralogistique. Solutions d''emballage, de processing et de logistique pour tous les secteurs.', '2026-11-23', '2026-11-26', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.all4pack.com', 'Comexposium', 'bisannuel', 1300, 80000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('djazagro-paris-2026', 'Djazagro', 2026, 'Salon des productions agroalimentaires dedie a l''export vers le Maghreb et l''Afrique. Equipements, matieres premieres et emballages.', '2026-04-20', '2026-04-23', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.djazagro.com', 'Comexposium', 'annuel', 700, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('europain-paris-2026', 'Europain', 2026, 'Salon mondial de la boulangerie, patisserie, glacerie et chocolaterie. Innovations et savoir-faire pour les artisans et industriels.', '2026-01-11', '2026-01-14', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.europain.com', 'Comexposium', 'bisannuel', 800, 50000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cfia-toulouse-2026', 'CFIA Toulouse', 2026, 'Carrefour des fournisseurs de l''industrie agroalimentaire, edition Sud-Ouest. Equipements, ingredients et services pour l''IAA.', '2026-09-22', '2026-09-23', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.cfiaexpo.com', 'GL Events', 'annuel', 400, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-du-chocolat-paris-2025', 'Salon du Chocolat Paris', 2025, 'Le plus grand evenement mondial dedie au chocolat et au cacao. Degustation, concours de patisserie et innovations chocolatieres.', '2025-10-29', '2025-11-02', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salon-du-chocolat.com', 'Event International', 'annuel', 500, 120000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('vinitech-sifel-bordeaux-2026', 'Vinitech-Sifel', 2026, 'Salon mondial des equipements et services pour la vigne, le vin, les fruits et legumes. Innovations pour la filiere viticole et arboricole.', '2026-11-24', '2026-11-26', 'Bordeaux', 'Parc des Expositions de Bordeaux', 44.8955, -0.5645, 'FR', 'https://www.vinitech-sifel.com', 'Comexposium', 'bisannuel', 900, 45000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('vinexpo-paris-2026', 'Vinexposium Paris', 2026, 'Salon international des vins et spiritueux. Point de rencontre des acteurs de la filiere vins et spiritueux a l''echelle mondiale.', '2026-02-10', '2026-02-12', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.vinexposium.com', 'Vinexposium', 'annuel', 2000, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('regal-toulouse-2026', 'REGAL', 2026, 'Salon des professionnels de l''alimentation en Occitanie. Produits regionaux, innovations et rencontres entre producteurs et distributeurs.', '2026-12-10', '2026-12-11', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.regal-toulouse.com', 'GL Events', 'bisannuel', 350, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('serbotel-nantes-2025', 'Serbotel', 2025, 'Salon de l''hotellerie et de la restauration dans le Grand Ouest. Equipements, produits et services pour les CHR.', '2025-10-19', '2025-10-22', 'Nantes', 'Parc des Expositions de la Beaujoire', 47.2571, -1.5250, 'FR', 'https://www.serbotel.com', 'Ouest Expo', 'bisannuel', 600, 35000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sepag-2026', 'SEPAG', 2026, 'Salon des equipements et process agroalimentaires du Grand Est. Fournisseurs de l''industrie alimentaire regionale.', '2026-06-02', '2026-06-03', 'Strasbourg', 'Parc des Expositions de Strasbourg', 48.5850, 7.7727, 'FR', 'https://www.sepag.com', 'Comexposium', 'annuel', 200, 4000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sial-inspire-food-business-2026', 'SIAL Inspire Food Business', 2026, 'Evenement dedie a l''innovation et aux tendances alimentaires mondiales. Conferences et prospective sur l''alimentation de demain.', '2026-03-23', '2026-03-24', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.sialparis.com', 'Comexposium', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

-- ============================================================
-- AGRICULTURE (14 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('space-rennes-2026', 'SPACE', 2026, 'Salon international des productions animales. Le rendez-vous des professionnels de l''elevage : bovins, porcins, avicoles, caprins.', '2026-09-15', '2026-09-17', 'Rennes', 'Parc Expo Rennes', 48.1255, -1.7133, 'FR', 'https://www.space.fr', 'SPACE', 'annuel', 1400, 100000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sommet-elevage-clermont-2025', 'Sommet de l''Elevage', 2025, 'Premier salon europeen de l''elevage. Genetique animale, machinisme, alimentation du betail et equipements d''elevage.', '2025-10-07', '2025-10-10', 'Clermont-Ferrand', 'Grande Halle d''Auvergne', 45.7592, 3.1300, 'FR', 'https://www.sommet-elevage.fr', 'Sommet de l''Elevage', 'annuel', 1500, 95000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('tech-ovin-bellac-2025', 'Tech-Ovin', 2025, 'Salon national des professionnels de l''elevage ovin. Demonstrations techniques, genetique ovine et equipements pour eleveurs de moutons.', '2025-09-03', '2025-09-04', 'Bellac', 'Site de plein air', 46.1231, 1.0486, 'FR', 'https://www.tech-ovin.com', 'Institut de l''Elevage', 'bisannuel', 250, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('foire-chalons-en-champagne-2025', 'Foire de Chalons-en-Champagne', 2025, 'Grande foire agricole et commerciale de la region Grand Est. Machinisme agricole, elevage, produits du terroir et artisanat.', '2025-08-29', '2025-09-08', 'Chalons-en-Champagne', 'Parc des Expositions de Chalons', 48.9491, 4.3679, 'FR', 'https://www.foire-de-chalons.com', 'Chalons Agglo', 'annuel', 800, 250000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('innov-agri-ondes-2026', 'Innov-Agri', 2026, 'Salon en plein champ des innovations agricoles. Demonstrations de materiel et techniques culturales sur plus de 50 hectares.', '2026-09-08', '2026-09-09', 'Ondes', 'Site de plein champ', 43.7761, 1.2931, 'FR', 'https://www.innov-agri.com', 'Comexposium', 'annuel', 300, 50000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('terres-de-jim-2026', 'Terres de Jim', 2026, 'Festival national de l''agriculture. Evenement des Jeunes Agriculteurs alliant demonstrations agricoles, culture et spectacles.', '2026-09-04', '2026-09-06', 'Compiegne', 'Site de plein air', 49.4178, 2.8262, 'FR', 'https://www.terresdejim.com', 'Jeunes Agriculteurs', 'annuel', 200, 80000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-agriculture-nouvelle-aquitaine-2026', 'Salon de l''Agriculture Nouvelle-Aquitaine', 2026, 'Salon regional de l''agriculture en Nouvelle-Aquitaine. Productions animales, vegetales, terroir et innovations agricoles.', '2026-05-16', '2026-05-24', 'Bordeaux', 'Parc des Expositions de Bordeaux', 44.8955, -0.5645, 'FR', 'https://www.salon-agriculture-bordeaux.com', 'Comexposium', 'annuel', 600, 200000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('agrimax-metz-2025', 'Agrimax', 2025, 'Salon professionnel agricole du Grand Est. Machinisme, elevage, productions vegetales et services aux agriculteurs.', '2025-10-28', '2025-10-30', 'Metz', 'Metz Expo', 49.1011, 6.2268, 'FR', 'https://www.agrimax.fr', 'Metz Expo Evenements', 'annuel', 350, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-vegetal-angers-2026', 'Salon du Vegetal', 2026, 'Salon professionnel de la filiere du vegetal. Horticulture, pepinieres, paysage, fleurissement et espaces verts.', '2026-06-16', '2026-06-18', 'Angers', 'Parc des Expositions d''Angers', 47.4785, -0.5632, 'FR', 'https://www.salonduvegetal.com', 'Val''hor', 'annuel', 600, 18000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('foire-agricole-tarbes-2025', 'Foire Agricole de Tarbes', 2025, 'Foire exposition et concours agricole des Pyrenees. Elevage, machinisme et produits du terroir de la region Occitanie.', '2025-09-11', '2025-09-14', 'Tarbes', 'Parc des Expositions de Tarbes', 43.2413, 0.0715, 'FR', 'https://www.foiredetarbes.fr', 'Tarbes Expo', 'annuel', 400, 100000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sitevi-montpellier-2025', 'SITEVI', 2025, 'Salon international des equipements et savoir-faire pour les productions vigne-vin, olive et fruits-legumes.', '2025-11-25', '2025-11-27', 'Montpellier', 'Parc des Expositions de Montpellier', 43.6148, 3.8215, 'FR', 'https://www.sitevi.com', 'Comexposium', 'bisannuel', 1100, 55000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('tech-elevage-lamotte-beuvron-2025', 'Tech Elevage', 2025, 'Salon des innovations en elevage dans le Centre-Val de Loire. Demonstrations techniques et materiel pour eleveurs de ruminants.', '2025-11-05', '2025-11-06', 'Lamotte-Beuvron', 'Parc Equestre Federal', 47.5978, 2.0245, 'FR', 'https://www.tech-elevage.com', 'Chambres d''agriculture Centre', 'bisannuel', 200, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('euroviti-montpellier-2025', 'Euroviti', 2025, 'Forum viticole d''echanges techniques et scientifiques. Innovations en viticulture, oenologie et commercialisation du vin.', '2025-11-25', '2025-11-26', 'Montpellier', 'Parc des Expositions de Montpellier', 43.6148, 3.8215, 'FR', 'https://www.euroviti.com', 'Institut Francais de la Vigne et du Vin', 'bisannuel', 150, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-herbe-villefranche-2026', 'Salon aux Champs', 2026, 'Salon en plein champ des cultures fourrageres et de l''herbe. Demonstrations de materiel, techniques de recolte et gestion des prairies.', '2026-06-03', '2026-06-04', 'Villefranche-d''Allier', 'Site de plein champ', 46.3984, 2.8551, 'FR', 'https://www.salonauxchamps.fr', 'Comexposium', 'bisannuel', 200, 15000, 'published') on conflict (slug) do nothing;

-- ============================================================
-- TOURISME / HOTELLERIE (12 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('iltm-cannes-2025', 'ILTM Cannes', 2025, 'International Luxury Travel Market. Le salon du voyage de luxe reunissant les plus grands operateurs du tourisme haut de gamme mondial.', '2025-12-01', '2025-12-04', 'Cannes', 'Palais des Festivals de Cannes', 43.5513, 7.0177, 'FR', 'https://www.iltm.com/cannes', 'RX France', 'annuel', 1800, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-mondial-du-tourisme-paris-2026', 'Salon Mondial du Tourisme', 2026, 'Grand salon du tourisme ouvert au public et aux professionnels. Destinations, voyagistes, croisieres et tourisme responsable.', '2026-03-12', '2026-03-15', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salon-mondial-tourisme.com', 'Comexposium', 'annuel', 600, 110000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('les-thermalies-paris-2026', 'Les Thermalies', 2026, 'Salon de l''eau et du bien-etre. Thermalisme, thalassotherapie, spa, balneotherapie et destinations de remise en forme.', '2026-01-22', '2026-01-25', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.thermalies.com', 'Spas Organisation', 'annuel', 300, 40000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('food-hotel-tech-paris-2026', 'Food Hotel Tech', 2026, 'Salon de l''innovation technologique pour l''hotellerie et la restauration. Solutions digitales, equipements et services pour les CHR.', '2026-06-09', '2026-06-10', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.food-hotel-tech.com', 'Food Hotel Tech', 'annuel', 300, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('exphotel-bordeaux-2026', 'Exp''Hotel Bordeaux', 2026, 'Salon de l''hotellerie, de la restauration et des metiers de bouche du Sud-Ouest. Equipements, services et produits pour les CHR.', '2026-11-15', '2026-11-17', 'Bordeaux', 'Parc des Expositions de Bordeaux', 44.8955, -0.5645, 'FR', 'https://www.exphotel.com', 'Comexposium', 'bisannuel', 400, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('heavent-cannes-2026', 'Heavent Meetings Cannes', 2026, 'Salon de l''evenementiel et des rencontres MICE sur la Cote d''Azur. Incentive, congres, seminaires et evenements corporate.', '2026-04-14', '2026-04-16', 'Cannes', 'Palais des Festivals de Cannes', 43.5513, 7.0177, 'FR', 'https://www.heavent-meetings.com', 'Infopro Digital', 'annuel', 250, 4000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('egast-strasbourg-2025', 'EGAST', 2025, 'Salon de l''equipement et de la gastronomie pour l''hotellerie et la restauration dans le Grand Est.', '2025-03-09', '2025-03-12', 'Strasbourg', 'Parc des Expositions de Strasbourg', 48.5850, 7.7727, 'FR', 'https://www.egast.com', 'GL Events', 'bisannuel', 500, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sirha-green-lyon-2025', 'SIRHA Green', 2025, 'Salon de la restauration et de l''hotellerie engagees. Alimentation durable, circuits courts et transition ecologique pour les CHR.', '2025-06-03', '2025-06-04', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.sirha-green.com', 'GL Events', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('map-pro-marseille-2025', 'MAP Pro', 2025, 'Salon professionnel de l''hotellerie et de la restauration en region PACA. Equipements, produits et services pour les metiers de l''accueil.', '2025-03-16', '2025-03-18', 'Marseille', 'Parc Chanot Marseille', 43.2730, 5.3945, 'FR', 'https://www.map-pro.fr', 'Safim', 'bisannuel', 350, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-tourisme-voyages-lille-2026', 'Salon des Vacances de Lille', 2026, 'Salon du tourisme et des voyages du Nord de la France. Destinations, sejours, croisieres et tourisme de proximite.', '2026-01-29', '2026-02-01', 'Lille', 'Lille Grand Palais', 50.6333, 3.0607, 'FR', 'https://www.salondestourisme-lille.com', 'Comexposium', 'annuel', 200, 50000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('restau-co-paris-2026', 'Restau''Co', 2026, 'Salon de la restauration collective en gestion directe. Solutions, equipements et innovations pour les cuisines collectives.', '2026-03-04', '2026-03-05', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.restau-co.com', 'Restau''Co', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('parabere-forum-paris-2025', 'Parabere Forum', 2025, 'Forum international sur le role des femmes dans la gastronomie et l''hotellerie. Conferences, ateliers et networking.', '2025-03-03', '2025-03-04', 'Paris', 'Maison de la Mutualite', 48.8490, 2.3499, 'FR', 'https://www.parabereforum.com', 'Parabere Forum', 'annuel', NULL, 2000, 'published') on conflict (slug) do nothing;


-- ============================================================
-- JOINTURES salon_sectors
-- ============================================================

-- AGROALIMENTAIRE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'ipa-nantes-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'natexpo-lyon-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'mdd-expo-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'all4pack-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'all4pack-paris-2026' and sec.slug = 'logistique-transport'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'djazagro-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'europain-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'cfia-toulouse-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-du-chocolat-paris-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'vinitech-sifel-bordeaux-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'vinitech-sifel-bordeaux-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'vinexpo-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'regal-toulouse-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'serbotel-nantes-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'serbotel-nantes-2025' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sepag-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sial-inspire-food-business-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'natexpo-lyon-2025' and sec.slug = 'energie-environnement'

-- AGRICULTURE
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'space-rennes-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sommet-elevage-clermont-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'tech-ovin-bellac-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'foire-chalons-en-champagne-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'innov-agri-ondes-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'terres-de-jim-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-agriculture-nouvelle-aquitaine-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'agrimax-metz-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-vegetal-angers-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'foire-agricole-tarbes-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sitevi-montpellier-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sitevi-montpellier-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'tech-elevage-lamotte-beuvron-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'euroviti-montpellier-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'euroviti-montpellier-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-herbe-villefranche-2026' and sec.slug = 'agriculture'

-- TOURISME / HOTELLERIE
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'iltm-cannes-2025' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-mondial-du-tourisme-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'les-thermalies-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'food-hotel-tech-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'food-hotel-tech-paris-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'exphotel-bordeaux-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'heavent-cannes-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'egast-strasbourg-2025' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'egast-strasbourg-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sirha-green-lyon-2025' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sirha-green-lyon-2025' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sirha-green-lyon-2025' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'map-pro-marseille-2025' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-tourisme-voyages-lille-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'restau-co-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'restau-co-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'parabere-forum-paris-2025' and sec.slug = 'tourisme-hotellerie' on conflict do nothing;
-- ============================================================
-- Showfinder : batch seed — INDUSTRIE, BTP/CONSTRUCTION, ENERGIE/ENVIRONNEMENT
-- 50 salons professionnels reels en France
-- ============================================================

-- ============================================================
-- INDUSTRIE (18 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('jec-world-paris-2026', 'JEC World', 2026, 'Salon mondial des composites. Le plus grand evenement international dedie aux materiaux composites et a leurs applications dans l''aeronautique, l''automobile et la construction.', '2026-03-03', '2026-03-05', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.jec-world.events', 'JEC Group', 'annuel', 1300, 43000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('micronora-besancon-2026', 'Micronora', 2026, 'Salon international des microtechniques et de la precision. Reference pour l''horlogerie, le medical, l''aeronautique et les micro-nanotechnologies.', '2026-09-22', '2026-09-25', 'Besancon', 'Micropolis Besancon', 47.2476, 6.0228, 'FR', 'https://www.micronora.com', 'Micronora', 'bisannuel', 800, 20000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('measurement-world-paris-2026', 'Measurement World', 2026, 'Salon de la mesure, de l''instrumentation et de la vision industrielle. Tests, controle qualite, metrologie et capteurs pour l''industrie.', '2026-03-31', '2026-04-03', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.measurement-world.com', 'GL Events', 'annuel', 400, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('europack-euromanut-lyon-2025', 'Europack Euromanut CFIA', 2025, 'Salon de l''emballage, de la manutention et du process industriel. Solutions de conditionnement, logistique interne et automatisation.', '2025-11-18', '2025-11-20', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.europack-euromanut-cfia.com', 'GL Events', 'annuel', 1200, 28000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sepem-douai-2026', 'SEPEM Industries Nord', 2026, 'Salon des services, equipements, process et maintenance pour l''industrie. Edition regionale Nord pour les usines des Hauts-de-France.', '2026-01-27', '2026-01-29', 'Douai', 'Gayant Expo Douai', 50.3720, 3.0794, 'FR', 'https://www.sepem-industries.com', 'Even Pro', 'annuel', 700, 7000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sepem-colmar-2026', 'SEPEM Industries Est', 2026, 'Salon des services, equipements, process et maintenance pour l''industrie. Edition regionale Est couvrant l''Alsace, la Lorraine et la Bourgogne.', '2026-06-02', '2026-06-04', 'Colmar', 'Parc Expo Colmar', 48.0847, 7.3380, 'FR', 'https://www.sepem-industries.com', 'Even Pro', 'annuel', 650, 6500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sepem-grenoble-2026', 'SEPEM Industries Sud-Est', 2026, 'Salon des services, equipements, process et maintenance pour l''industrie. Edition regionale Sud-Est couvrant Auvergne-Rhone-Alpes et PACA.', '2026-11-24', '2026-11-26', 'Grenoble', 'Alpexpo Grenoble', 45.1621, 5.7384, 'FR', 'https://www.sepem-industries.com', 'Even Pro', 'annuel', 650, 6500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sepem-angers-2025', 'SEPEM Industries Centre-Ouest', 2025, 'Salon des services, equipements, process et maintenance pour l''industrie. Edition regionale Centre-Ouest couvrant les Pays de la Loire et la Bretagne.', '2025-10-07', '2025-10-09', 'Angers', 'Parc Expo Angers', 47.4784, -0.5632, 'FR', 'https://www.sepem-industries.com', 'Even Pro', 'annuel', 650, 6500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('industrie-lyon-2025', 'Industrie Lyon', 2025, 'Salon des technologies de production. Usinage, formage, soudage, robotique et fabrication additive pour l''industrie manufacturiere.', '2025-03-11', '2025-03-14', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.industrie-expo.com', 'GL Events', 'annuel', 900, 22000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('siane-toulouse-2025', 'SIANE', 2025, 'Salon des partenaires de l''industrie du Sud-Ouest. Sous-traitance, equipements, services et fournitures industrielles pour l''Occitanie.', '2025-10-21', '2025-10-23', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.salonsiane.com', 'CCI Occitanie', 'annuel', 750, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('formnext-france-lyon-2026', 'Formnext France', 2026, 'Salon de la fabrication additive et de l''impression 3D industrielle. Technologies, materiaux, logiciels et applications pour la production additive.', '2026-06-17', '2026-06-18', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.formnext.fr', 'Mesago Messe Frankfurt', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('all4pack-paris-2026', 'ALL4PACK Emballage Paris', 2026, 'Salon international de l''emballage et de l''intralogistique. Packaging, process, printing et logistique pour tous secteurs industriels.', '2026-11-23', '2026-11-26', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.all4pack.com', 'Comexposium', 'bisannuel', 1500, 80000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-analyse-industrielle-paris-2026', 'Analyse Industrielle', 2026, 'Salon des solutions d''analyse pour l''industrie. Instrumentation, controle de process, analyse en ligne et laboratoire industriel.', '2026-03-31', '2026-04-03', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.analyse-industrielle.fr', 'GL Events', 'annuel', 250, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('emm-lyon-2025', 'EMM - Equipements, Machines, Materiaux', 2025, 'Salon des equipements et machines pour l''industrie du bois, de la menuiserie et de l''ameublement. Outillage, automatisation et materiaux.', '2025-03-11', '2025-03-14', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.emm-expo.com', 'GL Events', 'annuel', 300, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('plastic-expo-lyon-2025', 'FIP - Forum International de la Plasturgie', 2025, 'Salon de la plasturgie et des composites. Matieres premieres, equipements, moules et technologies pour la transformation des plastiques.', '2025-06-17', '2025-06-20', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.f-i-p.com', 'Idice', 'annuel', 800, 17000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('rsi-reims-2026', 'RSI - Rencontres de la Sous-traitance Industrielle', 2026, 'Convention d''affaires de la sous-traitance industrielle du Grand Est. Rencontres BtoB entre donneurs d''ordres et sous-traitants.', '2026-06-10', '2026-06-11', 'Reims', 'Centre des Congres de Reims', 49.2470, 3.9920, 'FR', 'https://www.rsi-reims.com', 'CCI Grand Est', 'annuel', 300, 3000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cfia-toulouse-2026', 'CFIA Toulouse', 2026, 'Carrefour des fournisseurs de l''industrie agroalimentaire, edition Toulouse. Equipements, ingredients et process pour l''agroalimentaire du Sud-Ouest.', '2026-09-29', '2026-10-01', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.cfiaexpo.com', 'GL Events', 'annuel', 500, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('metal-expo-paris-2026', 'Metal Expo', 2026, 'Salon de la metallurgie, du travail du metal et de la siderurgie. Acier, aluminium, fonderie, traitement de surface et recyclage des metaux.', '2026-09-15', '2026-09-17', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.metal-expo.com', 'Metal Expo SAS', 'annuel', 350, 8000, 'published') on conflict (slug) do nothing;

-- ============================================================
-- BTP / CONSTRUCTION (17 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('nordbat-lille-2026', 'Nordbat', 2026, 'Salon de la construction pour le Nord de la France. Materiaux, equipements, amenagement et renovation pour les professionnels du BTP.', '2026-03-25', '2026-03-27', 'Lille', 'Lille Grand Palais', 50.6333, 3.0607, 'FR', 'https://www.nordbat.com', 'CCI Grand Lille', 'bisannuel', 500, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('piscine-global-lyon-2026', 'Piscine Global Europe', 2026, 'Salon international de la piscine, du spa et du bien-etre. Equipements, construction, traitement de l''eau et amenagements exterieurs.', '2026-11-17', '2026-11-20', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.piscine-global-europe.com', 'GL Events', 'bisannuel', 800, 20000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('carrefour-de-leau-rennes-2026', 'Carrefour de l''Eau', 2026, 'Salon professionnel des metiers de l''eau. Gestion de l''eau, assainissement, reseaux, traitement et technologies pour les collectivites.', '2026-01-28', '2026-01-29', 'Rennes', 'Parc Expo Rennes', 48.1255, -1.7133, 'FR', 'https://www.carrefour-eau.com', 'Infoshow', 'annuel', 250, 5500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-copropriete-paris-2025', 'Salon de la Copropriete', 2025, 'Salon professionnel de la copropriete et de la gestion immobiliere. Syndics, administrateurs de biens, renovation energetique et gestion technique.', '2025-11-05', '2025-11-06', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salondelacopropriete.fr', 'Weyou Group', 'annuel', 200, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-habitat-bordeaux-2026', 'Salon de l''Habitat Bordeaux', 2026, 'Salon de la construction, de la renovation et de l''amenagement de la maison. Solutions pour les particuliers et professionnels du BTP.', '2026-03-06', '2026-03-09', 'Bordeaux', 'Parc des Expositions Bordeaux', 44.8955, -0.5652, 'FR', 'https://www.salon-habitat-bordeaux.com', 'Viparis', 'annuel', 350, 40000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('world-of-concrete-europe-paris-2026', 'World of Concrete Europe', 2026, 'Salon international du beton et de la construction en beton. Technologies, equipements et innovations pour l''industrie du beton.', '2026-04-28', '2026-04-30', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.worldofconcrete-europe.com', 'Informa Markets', 'annuel', 350, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('untec-congres-2026', 'Congres UNTEC', 2026, 'Congres annuel de l''Union Nationale des Economistes de la Construction. Rendez-vous des professionnels de l''economie du batiment et de la maitrise d''oeuvre.', '2026-06-11', '2026-06-12', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.untec.com', 'UNTEC', 'annuel', NULL, 2000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('eurobois-lyon-2026', 'Eurobois', 2026, 'Salon de la filiere bois. Machines, outillage, materiaux bois, menuiserie industrielle et construction bois pour les professionnels.', '2026-02-03', '2026-02-06', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.eurobois.net', 'GL Events', 'bisannuel', 500, 16000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-bois-energie-2026', 'Bois Energie', 2026, 'Salon professionnel du bois energie et de la biomasse. Chaudieres, poeles, granules, bois buche et reseaux de chaleur.', '2026-03-17', '2026-03-19', 'Grenoble', 'Alpexpo Grenoble', 45.1621, 5.7384, 'FR', 'https://www.bois-energie.fr', 'Bois Energie SAS', 'annuel', 250, 7000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('rocalia-lyon-2025', 'Rocalia', 2025, 'Salon de la pierre naturelle. Extraction, transformation, pose et amenagement en pierre naturelle pour le batiment et l''espace public.', '2025-12-02', '2025-12-04', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.rocalia.com', 'GL Events', 'bisannuel', 250, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('preventica-lyon-2026', 'Preventica Lyon', 2026, 'Salon de la prevention des risques professionnels et de la securite au travail. Equipements, formation et solutions pour la sante au travail.', '2026-09-22', '2026-09-24', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.preventica.com', 'Preventica', 'annuel', 400, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('preventica-paris-2026', 'Preventica Paris', 2026, 'Salon de la prevention des risques professionnels et de la securite au travail. Edition parisienne pour les entreprises d''Ile-de-France.', '2026-06-02', '2026-06-04', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.preventica.com', 'Preventica', 'annuel', 500, 13000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('solscope-lyon-2026', 'Solscope', 2026, 'Salon de la geotechnique et des fondations. Sondages, forages, fondations speciales, parois et renforcement de sols.', '2026-06-17', '2026-06-18', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.solscope.com', 'Solscope SAS', 'bisannuel', 150, 3000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('equipbaie-metalexpo-paris-2026', 'Equipbaie Metalexpo', 2026, 'Salon de la fenetre, de la fermeture et de la protection solaire. Menuiseries, vitrages, stores, volets et metallerie du batiment.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.equipbaie.com', 'Reed Expositions', 'bisannuel', 500, 35000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('blc-bordeaux-2026', 'BLC Bordeaux Lac', 2026, 'Salon professionnel du batiment du Sud-Ouest. Materiaux, equipements, outillage et solutions pour les artisans et entreprises du BTP.', '2026-02-12', '2026-02-14', 'Bordeaux', 'Parc des Expositions Bordeaux Lac', 44.8955, -0.5652, 'FR', 'https://www.blc-expo.com', 'CCI Bordeaux', 'bisannuel', 300, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-immobilier-entreprise-paris-2026', 'SIMI', 2026, 'Salon de l''immobilier d''entreprise. Investissement, promotion, bureaux, commerces, logistique et amenagement du territoire.', '2026-12-08', '2026-12-10', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.salonsimi.com', 'Groupe Moniteur', 'annuel', 450, 28000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('batibig-nantes-2026', 'Batibig Nantes', 2026, 'Salon regional du batiment pour les professionnels du Grand Ouest. Gros oeuvre, second oeuvre, amenagement et renovation.', '2026-10-15', '2026-10-16', 'Nantes', 'Parc des Expositions Nantes', 47.2609, -1.5323, 'FR', 'https://www.batibig.com', 'Batibig Events', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

-- ============================================================
-- ENERGIE / ENVIRONNEMENT (15 salons)
-- ============================================================

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('energaia-montpellier-2025', 'Energaia', 2025, 'Salon international des energies renouvelables. Solaire, eolien, biomasse, hydrogene et stockage pour la transition energetique en Mediterranee.', '2025-12-10', '2025-12-11', 'Montpellier', 'Parc des Expositions Montpellier', 43.6117, 3.8214, 'FR', 'https://www.energaia.fr', 'SPL Events', 'annuel', 350, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('expobiogaz-bordeaux-2026', 'Expobiogaz', 2026, 'Salon du biogaz, du biomethane et de la methanisation. Production, valorisation, injection reseau et equipements pour la filiere biogaz.', '2026-06-03', '2026-06-04', 'Bordeaux', 'Parc des Expositions Bordeaux', 44.8955, -0.5652, 'FR', 'https://www.expobiogaz.com', 'GL Events', 'annuel', 250, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-des-enr-paris-2026', 'Salon des Energies Renouvelables', 2026, 'Salon professionnel des energies renouvelables. Solaire photovoltaique, thermique, eolien, geothermie et solutions de stockage.', '2026-02-04', '2026-02-06', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salon-enr.com', 'Comexposium', 'annuel', 400, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('gazelec-paris-2026', 'Gazelec', 2026, 'Salon professionnel du gaz et de l''electricite. Congres et exposition pour les fournisseurs, distributeurs et gestionnaires de reseaux energetiques.', '2026-10-13', '2026-10-14', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.gazelec.com', 'Conext', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cycl-eau-strasbourg-2026', 'Cycl''eau Strasbourg', 2026, 'Salon professionnel des solutions pour l''eau et les milieux aquatiques. Gestion durable de l''eau, assainissement et reseaux pour le Grand Est.', '2026-04-01', '2026-04-02', 'Strasbourg', 'Palais de la Musique et des Congres', 48.5865, 7.7685, 'FR', 'https://www.cycl-eau.com', 'Idealconnaissances', 'annuel', 150, 2500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cycl-eau-vichy-2026', 'Cycl''eau Vichy', 2026, 'Salon professionnel des solutions pour l''eau. Edition Auvergne-Rhone-Alpes pour la gestion durable de l''eau et l''assainissement.', '2026-09-16', '2026-09-17', 'Vichy', 'Palais du Lac Vichy', 46.1263, 3.4238, 'FR', 'https://www.cycl-eau.com', 'Idealconnaissances', 'annuel', 120, 2000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-energie-habitat-colmar-2026', 'Salon Energie Habitat', 2026, 'Salon de l''energie et de la renovation de l''habitat. Isolation, chauffage, solaire, pompes a chaleur et eco-construction.', '2026-03-20', '2026-03-23', 'Colmar', 'Parc Expo Colmar', 48.0847, 7.3380, 'FR', 'https://www.salon-energiehabitat.fr', 'Parc Expo Colmar', 'annuel', 200, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('enerj-meeting-paris-2026', 'EnerJ-meeting Paris', 2026, 'Journee de l''efficacite energetique et environnementale du batiment. Conference et exposition sur la performance energetique et la RE2020.', '2026-02-05', '2026-02-05', 'Paris', 'Palais Brongniart', 48.8694, 2.3413, 'FR', 'https://www.enerj-meeting.com', 'XPAIR', 'annuel', 100, 3500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('enerj-meeting-lyon-2026', 'EnerJ-meeting Lyon', 2026, 'Journee de l''efficacite energetique du batiment, edition lyonnaise. RE2020, renovation energetique et decarbonation des batiments.', '2026-06-25', '2026-06-25', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.enerj-meeting.com', 'XPAIR', 'annuel', 80, 2500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('solar-solutions-international-paris-2026', 'Solar Solutions International', 2026, 'Salon professionnel du solaire photovoltaique et thermique. Panneaux, onduleurs, stockage, monitoring et solutions d''installation.', '2026-04-07', '2026-04-09', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.solarsolutions-international.com', 'Solarplaza', 'annuel', 300, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-hvac-paris-2026', 'Salon HVAC', 2026, 'Salon du genie climatique et de la refrigeration. Chauffage, ventilation, climatisation, pompes a chaleur et traitement d''air.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.hvac-expo.com', 'Reed Expositions', 'bisannuel', 400, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('flame-expo-lyon-2026', 'Flame Expo', 2026, 'Salon de l''appareil a granules, poeles et cheminees. Chauffage au bois et granules, fumisterie et solutions de chauffage domestique.', '2026-02-03', '2026-02-05', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.flame-expo.com', 'GL Events', 'annuel', 180, 6000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('les-assises-dechets-nantes-2025', 'Assises Nationales des Dechets', 2025, 'Congres de reference de la gestion des dechets et de l''economie circulaire. Collecte, tri, recyclage et valorisation des dechets.', '2025-10-01', '2025-10-02', 'Nantes', 'Cite des Congres de Nantes', 47.2134, -1.5427, 'FR', 'https://www.assises-dechets.org', 'Assises des Dechets', 'bisannuel', NULL, 1500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('power-gen-europe-paris-2026', 'Power Gen Europe', 2026, 'Congres et exposition de la production d''electricite. Centrales thermiques, renouvelables, stockage et reseaux electriques intelligents.', '2026-06-23', '2026-06-25', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.powergeneurope.com', 'Clarion Events', 'annuel', 300, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('paysalia-lyon-2025', 'Paysalia', 2025, 'Salon du paysage et de l''amenagement exterieur. Espaces verts, vegetalisation urbaine, gestion durable des paysages et materiels d''entretien.', '2025-12-02', '2025-12-04', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.paysalia.com', 'GL Events', 'bisannuel', 800, 28000, 'published') on conflict (slug) do nothing;


-- ============================================================
-- Jointure salon_sectors
-- ============================================================

-- INDUSTRIE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'jec-world-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'micronora-besancon-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'measurement-world-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'europack-euromanut-lyon-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'europack-euromanut-lyon-2025' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sepem-douai-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sepem-colmar-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sepem-grenoble-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sepem-angers-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'industrie-lyon-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'siane-toulouse-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'formnext-france-lyon-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'formnext-france-lyon-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'all4pack-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'all4pack-paris-2026' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-analyse-industrielle-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'emm-lyon-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'plastic-expo-lyon-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'rsi-reims-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cfia-toulouse-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cfia-toulouse-2026' and sec.slug = 'agroalimentaire' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'metal-expo-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

-- BTP / CONSTRUCTION
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'nordbat-lille-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'piscine-global-lyon-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'carrefour-de-leau-rennes-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'carrefour-de-leau-rennes-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-copropriete-paris-2025' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-habitat-bordeaux-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-habitat-bordeaux-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'world-of-concrete-europe-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'untec-congres-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'eurobois-lyon-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'eurobois-lyon-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-bois-energie-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-bois-energie-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'rocalia-lyon-2025' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'preventica-lyon-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'preventica-lyon-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'preventica-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'preventica-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'solscope-lyon-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'equipbaie-metalexpo-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'blc-bordeaux-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-immobilier-entreprise-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'batibig-nantes-2026' and sec.slug = 'btp-construction' on conflict do nothing;

-- ENERGIE / ENVIRONNEMENT
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'energaia-montpellier-2025' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'expobiogaz-bordeaux-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-des-enr-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'gazelec-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cycl-eau-strasbourg-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cycl-eau-vichy-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-energie-habitat-colmar-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-energie-habitat-colmar-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'enerj-meeting-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'enerj-meeting-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'enerj-meeting-lyon-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'enerj-meeting-lyon-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'solar-solutions-international-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-hvac-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-hvac-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'flame-expo-lyon-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'les-assises-dechets-nantes-2025' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'power-gen-europe-paris-2026' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'paysalia-lyon-2025' and sec.slug = 'energie-environnement' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'paysalia-lyon-2025' and sec.slug = 'btp-construction' on conflict do nothing;
-- ============================================================
-- Showfinder : batch seed — Tech, Sante, Mode, Cosmetique,
-- Logistique, Decoration, Franchise, RH, Defense
-- 60 salons professionnels reels en France
-- ============================================================

-- TECH / NUMERIQUE (10 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('laval-virtual-2026', 'Laval Virtual', 2026, 'Salon international des technologies immersives et de la realite virtuelle. Rendez-vous de reference pour la VR, AR et les technologies XR.', '2026-04-08', '2026-04-10', 'Laval', 'Espace Mayenne', 48.0735, -0.7710, 'FR', 'https://www.laval-virtual.com', 'Laval Virtual', 'annuel', 300, 18000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('it-partners-paris-2026', 'IT Partners', 2026, 'Salon de l''ecosysteme IT : cloud, cybersecurite, infrastructure et services managees. Convention d''affaires pour les revendeurs et integrateurs.', '2026-03-11', '2026-03-12', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.itpartners.fr', 'Comexposium', 'annuel', 250, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('les-assises-de-la-securite-monaco-2026', 'Les Assises de la Securite', 2026, 'Rendez-vous annuel des decideurs en cybersecurite. Conferences, ateliers et rendez-vous BtoB pour les RSSI et DSI.', '2026-10-14', '2026-10-17', 'Monaco', 'Grimaldi Forum', 43.7384, 7.4246, 'FR', 'https://www.lesassisesdelacybersecurite.com', 'DG Consultants', 'annuel', 200, 3000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('3d-print-lyon-2026', '3D Print Congress & Exhibition', 2026, 'Salon de la fabrication additive et de l''impression 3D. Technologies, materiaux et applications pour l''industrie et le prototypage.', '2026-06-03', '2026-06-04', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.3dprint-exhibition.com', 'IdExpo', 'annuel', 250, 7000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cloud-expo-europe-paris-2026', 'Cloud Expo Europe Paris', 2026, 'Salon du cloud computing, de la data et de l''infrastructure IT. Solutions cloud, hebergement, devops et multicloud.', '2026-11-18', '2026-11-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.cloudexpoeurope.fr', 'CloserStill Media', 'annuel', 300, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-data-ai-paris-2026', 'AI Paris', 2026, 'Salon de l''intelligence artificielle pour les entreprises. Cas d''usage, solutions et strategies IA pour la transformation numerique.', '2026-06-10', '2026-06-11', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.aiparis.fr', 'Corp Agency', 'annuel', 200, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('devfest-nantes-2026', 'DevFest Nantes', 2026, 'Conference technique pour les developpeurs. Organisee par le GDG Nantes, elle couvre le web, le mobile, le cloud et l''IA.', '2026-10-15', '2026-10-16', 'Nantes', 'Cite des Congres de Nantes', 47.2132, -1.5425, 'FR', 'https://devfest.gdgnantes.com', 'GDG Nantes', 'annuel', NULL, 3500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('tech-show-paris-2026', 'Ready For IT', 2026, 'Convention d''affaires de l''IT et du numerique. Rendez-vous BtoB entre decideurs IT, DSI et fournisseurs de solutions technologiques.', '2026-05-20', '2026-05-22', 'Monaco', 'Grimaldi Forum', 43.7384, 7.4246, 'FR', 'https://www.yourreadyforit.com', 'Weyou Group', 'annuel', 150, 1500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('innorobo-paris-2026', 'Innorobo', 2026, 'Sommet europeen de la robotique et des technologies intelligentes. Robotique de service, IA embarquee et cobotique.', '2026-05-24', '2026-05-25', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.innorobo.com', 'Innoecho', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('numeriquest-toulouse-2026', 'Toulouse Hacking Convention', 2026, 'Convention de cybersecurite et hacking ethique du sud de la France. Conferences techniques, CTF et workshops pratiques.', '2026-11-05', '2026-11-06', 'Toulouse', 'Centre de Congres Pierre Baudis', 43.6115, 1.4277, 'FR', 'https://www.thcon.party', 'THCon', 'annuel', NULL, 1500, 'published') on conflict (slug) do nothing;


-- SANTE / PHARMA (8 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('jfr-paris-2026', 'JFR - Journees Francophones de Radiologie', 2026, 'Congres national de radiologie et d''imagerie medicale. Formation continue, innovations technologiques et recherche en imagerie.', '2026-10-02', '2026-10-05', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.jfrexpo.com', 'SFR', 'annuel', 250, 20000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('hopital-expo-paris-2026', 'Hopital Expo', 2026, 'Salon de l''equipement et de l''amenagement de l''hopital. Materiel medical, mobilier hospitalier, logistique et restauration de sante.', '2026-05-19', '2026-05-21', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.hopitalexpo.com', 'Hopital Expo SAS', 'annuel', 600, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('sfar-congres-paris-2026', 'Congres SFAR', 2026, 'Congres national de la Societe Francaise d''Anesthesie et de Reanimation. Formation, recherche et innovations en anesthesie-reanimation.', '2026-09-17', '2026-09-19', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://sfar.org/congres', 'SFAR', 'annuel', 150, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('paris-healthcare-week-2026', 'Paris Healthcare Week', 2026, 'Semaine de la sante a Paris reunissant SantExpo, HIT et Hopital Expo. Ecosysteme complet de la sante, de l''innovation et du numerique.', '2026-05-19', '2026-05-21', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.parishealthcareweek.com', 'GL Events', 'annuel', 1000, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('biofit-lille-2026', 'BioFIT', 2026, 'Convention d''affaires de l''innovation en sante et biotechnologies. Rencontres BtoB entre startups biotech, pharma et investisseurs.', '2026-12-01', '2026-12-02', 'Lille', 'Lille Grand Palais', 50.6333, 3.0607, 'FR', 'https://www.biofit-event.com', 'Eurasante', 'annuel', 150, 2500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('pcd-congress-paris-2026', 'PCD Congress', 2026, 'Congres et exposition du packaging et du conditionnement pour la cosmetique, la pharma et les biens de consommation.', '2026-01-29', '2026-01-30', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.pcd-congress.com', 'Easyfairs', 'annuel', 350, 6500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('hacking-health-lyon-2026', 'Hacking Health Camp', 2026, 'Hackathon et conference de l''innovation en sante numerique. Reunissant professionnels de sante, developpeurs et designers.', '2026-03-27', '2026-03-29', 'Strasbourg', 'Centre de Congres de Strasbourg', 48.5894, 7.7553, 'FR', 'https://www.hackinghealth.camp', 'Hacking Health', 'annuel', NULL, 1500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('medica-dusseldorf-paris-forum-2026', 'Medica France Forum', 2026, 'Forum de l''innovation en dispositifs medicaux et technologies de sante. Presentation des solutions francaises pour le marche mondial.', '2026-04-09', '2026-04-10', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.medicaforum.fr', 'Messe Dusseldorf', 'annuel', 200, 4000, 'published') on conflict (slug) do nothing;


-- MODE / TEXTILE (7 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('fatex-paris-2026', 'Fatex', 2026, 'Salon de la sous-traitance mode et habillement. Sourcing, fabrication et services pour les marques de mode et de luxe.', '2026-02-03', '2026-02-05', 'Paris', 'Paris Le Bourget', 48.9462, 2.4253, 'FR', 'https://www.fatex.fr', 'Messe Frankfurt', 'bisannuel', 400, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('interfiliere-paris-2026', 'Interfiliere Paris', 2026, 'Salon international de la lingerie, du bain et des tissus d''habillement. Sourcing matieres premieres, dentelles et broderies.', '2026-01-17', '2026-01-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.interfiliere.com', 'Eurovet', 'bisannuel', 350, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('mif-expo-paris-2026', 'MIF Expo - Made in France', 2026, 'Salon du Made in France. Produits fabriques en France dans tous les secteurs : mode, textile, artisanat, alimentaire et industrie.', '2026-11-12', '2026-11-15', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.mfrancexpo.fr', 'Weyou Group', 'annuel', 800, 90000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-du-luxe-paris-2026', 'Salon du Luxe', 2026, 'Le rendez-vous des professionnels du luxe. Strategies, tendances et innovations du marche du luxe francais et international.', '2026-07-01', '2026-07-02', 'Paris', 'Palais de Tokyo', 48.8637, 2.2972, 'FR', 'https://www.salonduluxe.com', 'LuxuryToday', 'annuel', NULL, 2000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('playtime-paris-2026', 'Playtime Paris', 2026, 'Salon international de la mode enfant et de la puericulture. Collections kids, juniors et accessoires bebe pour les acheteurs.', '2026-01-24', '2026-01-26', 'Paris', 'Parc Floral de Paris', 48.8381, 2.4451, 'FR', 'https://www.iloveplaytime.com', 'Playtime', 'bisannuel', 500, 10000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('tranofiliere-paris-2026', 'Tranoï', 2026, 'Salon de mode contemporaine et de createurs. Decouverte de marques emergentes et de createurs internationaux.', '2026-01-24', '2026-01-27', 'Paris', 'Palais de Tokyo', 48.8637, 2.2972, 'FR', 'https://www.tranoi.com', 'Tranoi', 'bisannuel', 300, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('maroquinerie-paris-2026', 'Salon du Cuir Paris', 2026, 'Salon international du cuir, de la maroquinerie et de la ganterie. Matieres premieres, fournitures et savoir-faire cuir.', '2026-09-16', '2026-09-18', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.leatherfair-paris.com', 'Premiere Vision', 'bisannuel', 250, 7000, 'published') on conflict (slug) do nothing;


-- COSMETIQUE / BEAUTE (7 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('makeup-in-paris-2026', 'MakeUp in Paris', 2026, 'Salon dedie a la formulation et au packaging du maquillage. Innovations produits, couleurs et tendances du make-up.', '2026-06-18', '2026-06-19', 'Paris', 'Carrousel du Louvre', 48.8611, 2.3336, 'FR', 'https://www.makeup-in-paris.com', 'Infopro Digital', 'annuel', 200, 4000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('adf-pcd-paris-2026', 'ADF&PCD Paris', 2026, 'Salon du packaging aerosol, du dispensing et du packaging cosmetique et parfumerie. Innovations en conditionnement beaute.', '2026-01-29', '2026-01-30', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.adf-pcd.com', 'Easyfairs', 'annuel', 400, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('luxe-pack-monaco-2026', 'Luxe Pack Monaco', 2026, 'Salon international du packaging de luxe. Emballages haut de gamme pour la cosmetique, les parfums, les vins et spiritueux.', '2026-09-28', '2026-09-30', 'Monaco', 'Grimaldi Forum', 43.7384, 7.4246, 'FR', 'https://www.luxepackmonaco.com', 'Idice', 'annuel', 500, 9500, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('in-cosmetics-global-paris-2026', 'in-cosmetics Global', 2026, 'Salon mondial des ingredients cosmetiques. Matieres premieres, actifs, innovations formulatoires pour l''industrie cosmetique.', '2026-04-14', '2026-04-16', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.in-cosmetics.com', 'RX Global', 'annuel', 900, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cosmed-meeting-marseille-2026', 'Cosmed Meeting', 2026, 'Rencontre annuelle de l''association Cosmed dediee aux PME cosmetiques. Reglementation, innovation et tendances du secteur.', '2026-06-11', '2026-06-12', 'Marseille', 'Palais du Pharo', 43.2902, 5.3584, 'FR', 'https://www.cosmed.fr', 'Cosmed', 'annuel', 100, 1200, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('beyond-beauty-paris-2026', 'Beyond Beauty Paris', 2026, 'Salon professionnel de la beaute et du bien-etre. Cosmetiques, soins, spa, equipements esthetiques et innovations beaute.', '2026-09-08', '2026-09-09', 'Paris', 'Carrousel du Louvre', 48.8611, 2.3336, 'FR', 'https://www.beyondbeautyparis.com', 'Beyond Beauty Events', 'annuel', 350, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cosmeeting-paris-2026', 'Cosmeeting', 2026, 'Salon de l''innovation cosmetique et du sourcing ingredients. Plateforme de rencontres entre fournisseurs et formulateurs.', '2026-04-02', '2026-04-03', 'Paris', 'Espace Champerret', 48.8856, 2.2900, 'FR', 'https://www.cosmeeting.com', 'Cosmeeting SAS', 'annuel', 120, 2500, 'published') on conflict (slug) do nothing;


-- LOGISTIQUE / TRANSPORT (6 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('siae-le-bourget-2025', 'Salon International de l''Aeronautique et de l''Espace', 2025, 'Le plus grand salon aeronautique au monde. Aeronautique civile et militaire, espace, defense et innovations technologiques.', '2025-06-16', '2025-06-22', 'Paris', 'Parc des Expositions du Bourget', 48.9462, 2.4253, 'FR', 'https://www.siae.fr', 'SIAE', 'bisannuel', 2500, 300000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('transports-publics-paris-2026', 'Salon European Mobility Expo', 2026, 'Salon europeen de la mobilite. Transports publics, ferroviaire, bus, mobilite urbaine et solutions de transport collectif.', '2026-11-24', '2026-11-26', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.european-mobility-expo.com', 'GIE Objectif Transport Public', 'bisannuel', 350, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('intralogistics-france-2026', 'Intralogistics France', 2026, 'Salon de la manutention et de l''intralogistique. Chariots elevateurs, convoyeurs, systemes de stockage et automatisation d''entrepots.', '2026-03-31', '2026-04-02', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.intralogistics-france.com', 'Reed Expositions', 'annuel', 400, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('top-transport-europe-marseille-2026', 'Top Transport Europe', 2026, 'Convention d''affaires du transport et de la logistique en Mediterranee. Rendez-vous BtoB entre chargeurs et transporteurs.', '2026-06-16', '2026-06-17', 'Marseille', 'Parc Chanot', 43.2630, 5.3963, 'FR', 'https://www.toptransport.fr', 'Marseille Chanot', 'annuel', 200, 4000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('supply-chain-event-paris-2026', 'Supply Chain Event', 2026, 'Salon de la supply chain et de la logistique connectee. Technologies, digital et innovations pour optimiser la chaine d''approvisionnement.', '2026-11-18', '2026-11-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.supplychain-event.com', 'Weyou Group', 'annuel', 250, 6000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('solutrans-lyon-2027', 'Solutrans', 2027, 'Salon international des solutions de transport routier et urbain. Vehicules industriels, utilitaires et mobilite durable.', '2027-11-18', '2027-11-22', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.solutrans.eu', 'Lyon Expo Events', 'bisannuel', 1100, 55000, 'published') on conflict (slug) do nothing;


-- DECORATION / HABITAT (7 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('architect-at-work-paris-2026', 'Architect@Work Paris', 2026, 'Salon de l''architecture et du design interieur. Selection de produits innovants presentes aux architectes et prescripteurs.', '2026-09-24', '2026-09-25', 'Paris', 'Grande Halle de la Villette', 48.8921, 2.3900, 'FR', 'https://www.architectatwork.fr', 'Kortrijk Xpo', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('equipbaie-paris-2026', 'Equipbaie', 2026, 'Salon de la fenetre, de la fermeture et de la protection solaire. Menuiseries, facades vitrees, volets et stores pour le batiment.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.equipbaie.com', 'Reed Expositions', 'bisannuel', 400, 40000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-habitat-design-lyon-2026', 'Salon Habitat et Design', 2026, 'Salon de l''habitat, de la decoration et du design d''interieur. Mobilier, luminaires, revetements et objets de decoration.', '2026-03-19', '2026-03-22', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.salonhabitatdesign.com', 'GL Events', 'annuel', 350, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('paris-design-week-2026', 'Paris Design Week', 2026, 'Festival du design a Paris. Parcours dans les showrooms, galeries et lieux d''exposition dedies au design et a la decoration.', '2026-09-04', '2026-09-13', 'Paris', 'Divers lieux Paris', 48.8566, 2.3522, 'FR', 'https://www.parisdesignweek.fr', 'SAFI', 'annuel', NULL, 50000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('meuble-paris-2026', 'Salon du Meuble de Paris', 2026, 'Salon du mobilier contemporain et du design. Editeurs de meubles, designers et artisans du mobilier francais et international.', '2026-01-16', '2026-01-20', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.salondumeuble-paris.com', 'SAFI', 'bisannuel', 600, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('cersaie-paris-showroom-2026', 'Salon Carrelage et Bain', 2026, 'Salon des revetements ceramiques, du carrelage et de l''amenagement de la salle de bain. Innovations et tendances materiaux.', '2026-03-04', '2026-03-06', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.saloncarrelagebain.com', 'Reed Expositions', 'annuel', 250, 12000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('surf-interieur-biarritz-2026', 'Salon Surfacing Interiors', 2026, 'Salon des surfaces et finitions pour la decoration interieure. Peintures, enduits, papiers peints et solutions murales.', '2026-10-08', '2026-10-09', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.surfacing-expo.fr', 'Comexposium', 'annuel', 180, 8000, 'published') on conflict (slug) do nothing;


-- FRANCHISE / COMMERCE (5 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('salon-sme-paris-2026', 'Salon SME (ex Salon des Micro-Entreprises)', 2026, 'Salon des solutions pour les createurs et dirigeants de TPE/PME. Financement, gestion, marketing et outils pour entrepreneurs.', '2026-10-05', '2026-10-06', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.salonsme.com', 'Weyou Group', 'annuel', 250, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('equipmag-paris-2026', 'EquipMag - Paris Retail Week', 2026, 'Salon de l''equipement commercial et de l''agencement de magasins. Mobilier commercial, digital in-store et experience client.', '2026-09-15', '2026-09-17', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.equipmag.com', 'Comexposium', 'annuel', 350, 20000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('franchise-expo-lyon-2026', 'Forum Franchise Lyon', 2026, 'Forum regional de la franchise a Lyon. Rencontres entre franchiseurs et candidats a la franchise dans le sud-est de la France.', '2026-10-22', '2026-10-22', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.forumfranchise-lyon.com', 'Reed Expositions', 'annuel', 120, 3000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('ecommerce-paris-2026', 'E-Commerce Paris', 2026, 'Salon du e-commerce et du digital. Solutions logistiques, paiement, marketing digital et technologies pour le commerce en ligne.', '2026-09-15', '2026-09-17', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.ecommerceparis.com', 'Comexposium', 'annuel', 500, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('conext-paris-2026', 'CONEXT', 2026, 'Salon de la franchise et du commerce organise. Concepts innovants de franchise, licence de marque et commerce associe.', '2026-03-15', '2026-03-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.conext.fr', 'Reed Expositions', 'annuel', 200, 10000, 'published') on conflict (slug) do nothing;


-- RH / FORMATION (5 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('talent-management-paris-2026', 'Talent Management Expo', 2026, 'Salon de la gestion des talents et du recrutement. SIRH, ATS, assessment, marque employeur et solutions de gestion des competences.', '2026-03-18', '2026-03-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.talent-management.fr', 'Weyou Group', 'annuel', 200, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('elearning-expo-paris-2026', 'eLearning Expo', 2026, 'Salon du e-learning et de la formation digitale. Plateformes LMS, contenus pedagogiques, serious games et realite virtuelle.', '2026-03-18', '2026-03-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.elearning-expo.com', 'Weyou Group', 'annuel', 180, 7000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('rh-lyon-2026', 'Salon RH Lyon', 2026, 'Salon regional des solutions RH. Recrutement, paie, SIRH, QVT et management pour les entreprises du sud-est.', '2026-11-25', '2026-11-26', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.salon-rh-lyon.com', 'Weyou Group', 'annuel', 120, 4000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('preventica-paris-2026', 'Preventica Paris', 2026, 'Congres/salon de la sante et securite au travail. Prevention des risques, QVT, ergonomie et bien-etre au travail.', '2026-06-16', '2026-06-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.preventica.com', 'Preventica', 'annuel', 450, 15000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('congres-hr-paris-2026', 'Congres HR', 2026, 'Congres des decideurs RH et de la transformation du travail. Conferences, keynotes et ateliers sur l''avenir des ressources humaines.', '2026-10-06', '2026-10-07', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.congreshr.com', 'Groupe Studyrama', 'annuel', NULL, 5000, 'published') on conflict (slug) do nothing;


-- DEFENSE / SECURITE (5 salons)
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('euronaval-paris-2026', 'Euronaval', 2026, 'Salon international de la defense navale. Marine militaire, systemes navals, sous-marins et technologies maritimes de defense.', '2026-10-19', '2026-10-22', 'Paris', 'Paris Le Bourget', 48.9462, 2.4253, 'FR', 'https://www.euronaval.fr', 'GICAN', 'bisannuel', 500, 25000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('shieldafrica-abidjan-2026', 'ShieldAfrica', 2026, 'Salon de la securite et de la defense en Afrique. Equipements de securite, cybersecurite et solutions pour les forces de l''ordre.', '2026-01-20', '2026-01-22', 'Abidjan', 'Sofitel Abidjan', 5.3364, -4.0266, 'FR', 'https://www.shieldafrica.com', 'Coges Events', 'bisannuel', 300, 6000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('expodefensa-paris-2026', 'SOFINS', 2026, 'Salon des forces speciales et des innovations. Equipements, armements et technologies pour les forces speciales francaises.', '2026-03-31', '2026-04-02', 'Bordeaux', 'Camp de Souge', 44.7830, -0.8500, 'FR', 'https://www.sofins-event.com', 'CIRP', 'bisannuel', 350, 8000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('secuexpo-paris-2026', 'Expoprotection', 2026, 'Salon de la securite, de la surete et de la prevention des risques. Videosurveillance, controle d''acces, incendie et securite au travail.', '2026-11-03', '2026-11-05', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.expoprotection.com', 'Reed Expositions', 'bisannuel', 800, 30000, 'published') on conflict (slug) do nothing;

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values
('air-drone-bordeaux-2026', 'UAV Show - Air Drone', 2026, 'Salon international du drone professionnel. Drones civils et militaires, anti-drones, reglementation et applications sectorielles.', '2026-10-06', '2026-10-08', 'Bordeaux', 'Parc des Expositions de Bordeaux', 44.8955, -0.5600, 'FR', 'https://www.uavshow.com', 'BCI Aerospace', 'annuel', 200, 5000, 'published') on conflict (slug) do nothing;


-- ============================================================
-- JOINTURES salon_sectors
-- ============================================================

-- TECH / NUMERIQUE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'laval-virtual-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'it-partners-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'les-assises-de-la-securite-monaco-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'les-assises-de-la-securite-monaco-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = '3d-print-lyon-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = '3d-print-lyon-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cloud-expo-europe-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-data-ai-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'devfest-nantes-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'tech-show-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'innorobo-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'innorobo-paris-2026' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'numeriquest-toulouse-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'numeriquest-toulouse-2026' and sec.slug = 'defense-securite' on conflict do nothing;

-- SANTE / PHARMA
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'jfr-paris-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'hopital-expo-paris-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sfar-congres-paris-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'paris-healthcare-week-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'paris-healthcare-week-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'biofit-lille-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'pcd-congress-paris-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'pcd-congress-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'hacking-health-lyon-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'hacking-health-lyon-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'medica-dusseldorf-paris-forum-2026' and sec.slug = 'sante-pharma' on conflict do nothing;

-- MODE / TEXTILE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'fatex-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'interfiliere-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'mif-expo-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'mif-expo-paris-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-du-luxe-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-du-luxe-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'playtime-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'tranofiliere-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'maroquinerie-paris-2026' and sec.slug = 'mode-textile' on conflict do nothing;

-- COSMETIQUE / BEAUTE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'makeup-in-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'adf-pcd-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'luxe-pack-monaco-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'in-cosmetics-global-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cosmed-meeting-marseille-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'beyond-beauty-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cosmeeting-paris-2026' and sec.slug = 'cosmetique-beaute' on conflict do nothing;

-- LOGISTIQUE / TRANSPORT
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'siae-le-bourget-2025' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'siae-le-bourget-2025' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'siae-le-bourget-2025' and sec.slug = 'industrie' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'transports-publics-paris-2026' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'intralogistics-france-2026' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'top-transport-europe-marseille-2026' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'supply-chain-event-paris-2026' and sec.slug = 'logistique-transport' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'supply-chain-event-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'solutrans-lyon-2027' and sec.slug = 'logistique-transport' on conflict do nothing;

-- DECORATION / HABITAT
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'architect-at-work-paris-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'architect-at-work-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'equipbaie-paris-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'equipbaie-paris-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-habitat-design-lyon-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'paris-design-week-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'meuble-paris-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cersaie-paris-showroom-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'cersaie-paris-showroom-2026' and sec.slug = 'btp-construction' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'surf-interieur-biarritz-2026' and sec.slug = 'decoration-habitat' on conflict do nothing;

-- FRANCHISE / COMMERCE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'salon-sme-paris-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'equipmag-paris-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'equipmag-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'franchise-expo-lyon-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'ecommerce-paris-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'ecommerce-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'conext-paris-2026' and sec.slug = 'franchise-commerce' on conflict do nothing;

-- RH / FORMATION
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'talent-management-paris-2026' and sec.slug = 'rh-formation' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'elearning-expo-paris-2026' and sec.slug = 'rh-formation' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'elearning-expo-paris-2026' and sec.slug = 'tech-numerique' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'rh-lyon-2026' and sec.slug = 'rh-formation' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'preventica-paris-2026' and sec.slug = 'rh-formation' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'congres-hr-paris-2026' and sec.slug = 'rh-formation' on conflict do nothing;

-- DEFENSE / SECURITE
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'euronaval-paris-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'shieldafrica-abidjan-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'expodefensa-paris-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'secuexpo-paris-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'air-drone-bordeaux-2026' and sec.slug = 'defense-securite' on conflict do nothing;

insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'air-drone-bordeaux-2026' and sec.slug = 'tech-numerique' on conflict do nothing;
