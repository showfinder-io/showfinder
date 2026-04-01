-- ============================================================
-- Showfinder : seed data
-- Salons reels verifiables, donnees publiques
-- ============================================================

-- Secteurs
-- ------------------------------------------------------------

insert into sectors (slug, name, description) values
  ('agroalimentaire', 'Agroalimentaire', 'Industrie alimentaire, boissons, restauration collective'),
  ('btp-construction', 'BTP et Construction', 'Batiment, travaux publics, materiaux, architecture'),
  ('tech-numerique', 'Tech et Numerique', 'Technologies, startups, IA, cloud, cybersecurite'),
  ('industrie', 'Industrie', 'Industrie manufacturiere, usine, automatisation, robotique'),
  ('sante-pharma', 'Sante et Pharma', 'Sante, pharmacie, dispositifs medicaux, biotechnologies'),
  ('mode-textile', 'Mode et Textile', 'Mode, pret-a-porter, textile, accessoires, luxe'),
  ('tourisme-hotellerie', 'Tourisme et Hotellerie', 'Tourisme, hotellerie, restauration, loisirs'),
  ('energie-environnement', 'Energie et Environnement', 'Energies renouvelables, environnement, developpement durable'),
  ('defense-securite', 'Defense et Securite', 'Defense, securite, aeronautique, spatial'),
  ('cosmetique-beaute', 'Cosmetique et Beaute', 'Cosmetiques, parfumerie, beaute, bien-etre'),
  ('logistique-transport', 'Logistique et Transport', 'Logistique, supply chain, transport, mobilite'),
  ('agriculture', 'Agriculture', 'Agriculture, elevage, machinisme agricole, viticulture'),
  ('decoration-habitat', 'Decoration et Habitat', 'Design, decoration interieure, mobilier, habitat'),
  ('franchise-commerce', 'Franchise et Commerce', 'Franchise, commerce, retail, distribution'),
  ('rh-formation', 'RH et Formation', 'Ressources humaines, formation professionnelle, emploi');

-- Salons
-- Donnees basees sur les informations publiques des organisateurs
-- Les dates sont celles des editions 2025-2026 quand disponibles
-- Les chiffres (exposants, visiteurs) sont les derniers chiffres publies
-- ------------------------------------------------------------

insert into salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) values

-- AGROALIMENTAIRE
('sial-paris-2026', 'SIAL Paris', 2026, 'Le plus grand salon mondial de l''innovation alimentaire. Rendez-vous incontournable de l''industrie agroalimentaire, SIAL rassemble l''ensemble de la filiere alimentaire mondiale.', '2026-10-17', '2026-10-21', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.sialparis.com', 'Comexposium', 'bisannuel', 7500, 310000, 'published'),

('sirha-lyon-2027', 'SIRHA Lyon', 2027, 'Salon international de la restauration, de l''hotellerie et de l''alimentation. Le rendez-vous mondial de la food service et de l''hotellerie.', '2027-01-23', '2027-01-27', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.sirha.com', 'GL Events', 'bisannuel', 4000, 210000, 'published'),

('cfia-rennes-2026', 'CFIA Rennes', 2026, 'Carrefour des fournisseurs de l''industrie agroalimentaire. Salon de reference pour les equipements, ingredients et emballages de l''industrie alimentaire.', '2026-03-10', '2026-03-12', 'Rennes', 'Parc Expo Rennes', 48.1255, -1.7133, 'FR', 'https://www.cfiaexpo.com', 'GL Events', 'annuel', 1600, 30000, 'published'),

('sandwich-and-snack-show-2026', 'Sandwich & Snack Show', 2026, 'Le salon de la restauration rapide et du snacking. Innovations produits, equipements et concepts pour la restauration nomade.', '2026-03-18', '2026-03-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.sandwichshows.com', 'Reed Expositions', 'annuel', 450, 18000, 'published'),

-- BTP / CONSTRUCTION
('batimat-2026', 'Batimat', 2026, 'Salon international de la construction. Le rendez-vous de l''ensemble des acteurs du batiment : materiaux, equipements, systemes constructifs.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.batimat.com', 'Reed Expositions', 'bisannuel', 2800, 360000, 'published'),

('interclima-2026', 'Interclima', 2026, 'Salon international du chauffage, de la climatisation et de la qualite de l''air. Solutions pour le confort thermique et la performance energetique.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.interclima.com', 'Reed Expositions', 'bisannuel', 1200, 120000, 'published'),

('pollutec-lyon-2025', 'Pollutec', 2025, 'Salon international des solutions environnement et energie. Reference pour les professionnels de l''environnement et de l''economie circulaire.', '2025-11-25', '2025-11-28', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.pollutec.com', 'Reed Expositions', 'bisannuel', 2200, 70000, 'published'),

('artibat-rennes-2026', 'Artibat', 2026, 'Salon de la construction, de la renovation et de l''amenagement pour les professionnels du BTP du Grand Ouest.', '2026-10-21', '2026-10-23', 'Rennes', 'Parc Expo Rennes', 48.1255, -1.7133, 'FR', 'https://www.artibat.com', 'Ouest Expo', 'bisannuel', 800, 45000, 'published'),

-- TECH / NUMERIQUE
('vivatech-paris-2026', 'VivaTech', 2026, 'Le plus grand evenement tech et startup d''Europe. Innovation, IA, deeptech, fintech et transformation numerique des entreprises.', '2026-06-11', '2026-06-14', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.vivatechnology.com', 'Viva Technology', 'annuel', 2500, 165000, 'published'),

('sido-lyon-2026', 'SIDO Lyon', 2026, 'Showroom de l''IoT, de l''IA et de la robotique. Le salon de convergence des technologies connectees pour l''industrie.', '2026-09-16', '2026-09-17', 'Lyon', 'Centre de Congres de Lyon', 45.7640, 4.8520, 'FR', 'https://www.sido-lyon.com', 'GL Events', 'annuel', 450, 10000, 'published'),

('fic-lille-2026', 'FIC - Forum InCyber', 2026, 'Forum international de la cybersecurite. Le rendez-vous europeen de la securite et de la confiance numerique.', '2026-04-01', '2026-04-03', 'Lille', 'Lille Grand Palais', 50.6333, 3.0607, 'FR', 'https://www.forum-incyber.com', 'CEIS', 'annuel', 650, 20000, 'published'),

('big-data-paris-2026', 'Big Data & AI Paris', 2026, 'Le salon du Big Data, de l''IA et de l''analytique. Cas d''usage, solutions et innovations pour la data-driven enterprise.', '2026-09-15', '2026-09-16', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.bigdataparis.com', 'Corp Agency', 'annuel', 300, 20000, 'published'),

-- INDUSTRIE
('global-industrie-lyon-2025', 'Global Industrie', 2025, 'Le grand rendez-vous de l''industrie en France. Usine connectee, sous-traitance, mesure, materiaux et fabrication additive.', '2025-03-11', '2025-03-14', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.global-industrie.com', 'GL Events', 'annuel', 2500, 45000, 'published'),

('smart-industries-2026', 'Smart Industries', 2026, 'Salon de l''industrie du futur. Robotique, cobotique, impression 3D, IoT industriel et solutions de production intelligentes.', '2026-03-31', '2026-04-03', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.smart-industries.fr', 'GL Events', 'annuel', 1200, 30000, 'published'),

('sepem-toulouse-2026', 'SEPEM Industries Sud-Ouest', 2026, 'Salon des services, equipements, process et maintenance pour l''industrie. Format regional proche des usines.', '2026-09-29', '2026-10-01', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.sepem-industries.com', 'Even Pro', 'annuel', 700, 8000, 'published'),

('midest-2026', 'Midest', 2026, 'Salon mondial de la sous-traitance industrielle. Tous les savoir-faire de la sous-traitance : mecanique, plastique, electronique, textile.', '2026-03-31', '2026-04-03', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.midest.com', 'GL Events', 'annuel', 1500, 40000, 'published'),

-- SANTE / PHARMA
('pharmapack-paris-2026', 'Pharmapack Europe', 2026, 'Salon du packaging et du drug delivery pour l''industrie pharmaceutique. Innovation en emballage et dispositifs d''administration.', '2026-01-22', '2026-01-23', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.pharmapackeurope.com', 'Informa Markets', 'annuel', 420, 7000, 'published'),

('hlt-paris-2026', 'HIT - Health IT', 2026, 'Salon de l''IT pour la sante. Systemes d''information hospitaliers, telesante, IA medicale et cybersecurite sante.', '2026-05-19', '2026-05-21', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.interhopital.com', 'GL Events', 'annuel', 350, 12000, 'published'),

('santexpo-paris-2026', 'SantExpo', 2026, 'Le salon de la sante et de l''innovation. Federation hospitaliere, etablissements de sante, medico-social et innovations.', '2026-05-19', '2026-05-21', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.santexpo.com', 'Hopital Expo', 'annuel', 700, 30000, 'published'),

-- MODE / TEXTILE
('premiere-vision-paris-2026', 'Premiere Vision Paris', 2026, 'Le salon mondial de la creation mode. Tissus, cuirs, accessoires, fils et design pour les createurs et marques de mode.', '2026-02-03', '2026-02-05', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.premierevision.com', 'Premiere Vision', 'bisannuel', 1800, 55000, 'published'),

('texworld-paris-2026', 'Texworld Paris', 2026, 'Salon international du tissu et de la mode. Sourcing textile mondial pour les professionnels de la mode et de l''habillement.', '2026-02-03', '2026-02-05', 'Paris', 'Paris Le Bourget', 48.9462, 2.4253, 'FR', 'https://www.texworld-paris.com', 'Messe Frankfurt', 'bisannuel', 1200, 25000, 'published'),

('who-s-next-paris-2026', 'Who''s Next', 2026, 'Salon du pret-a-porter feminin et des accessoires de mode. Le rendez-vous de la mode en France.', '2026-01-24', '2026-01-26', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.whosnext-salon.com', 'WSN', 'bisannuel', 800, 40000, 'published'),

-- TOURISME / HOTELLERIE
('iftm-top-resa-2026', 'IFTM Top Resa', 2026, 'Salon professionnel du tourisme. Destinations, tour-operateurs, compagnies aeriennes, hotellerie et technologies du voyage.', '2026-09-29', '2026-10-01', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.iftm.fr', 'Reed Expositions', 'annuel', 1700, 34000, 'published'),

('equiphotel-paris-2026', 'EquipHotel', 2026, 'Salon international de l''equipement hotelier et de la restauration. Design, mobilier, technologies et food service pour l''hotellerie.', '2026-11-15', '2026-11-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.equiphotel.com', 'Reed Expositions', 'bisannuel', 1500, 110000, 'published'),

('heavent-paris-2026', 'Heavent Paris', 2026, 'Salon de l''evenementiel, du live et de la communication par l''experience. Solutions pour l''organisation d''evenements.', '2026-11-17', '2026-11-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.heavent.fr', 'Infopro Digital', 'annuel', 350, 9000, 'published'),

-- ENERGIE / ENVIRONNEMENT
('bepositive-lyon-2027', 'BePOSITIVE', 2027, 'Salon de la transition energetique et numerique du batiment. Photovoltaique, bois energie, renovation thermique et smart building.', '2027-03-16', '2027-03-18', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.bepositive-events.com', 'GL Events', 'bisannuel', 700, 40000, 'published'),

('hyvolution-paris-2026', 'Hyvolution', 2026, 'Salon de l''hydrogene. Technologies hydrogene, piles a combustible, stockage d''energie et mobilite hydrogene.', '2026-01-28', '2026-01-29', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.hyvolution-event.com', 'GL Events', 'annuel', 350, 12000, 'published'),

('world-nuclear-exhibition-2026', 'World Nuclear Exhibition', 2026, 'Le salon mondial de l''industrie nucleaire civile. Toute la filiere nucleaire : construction, exploitation, demantelement.', '2026-10-27', '2026-10-29', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.world-nuclear-exhibition.com', 'Reed Expositions', 'bisannuel', 800, 30000, 'published'),

-- DEFENSE / SECURITE
('eurosatory-paris-2026', 'Eurosatory', 2026, 'Salon international de la defense et de la securite terrestres et aeroterrestre. Le plus grand salon de defense en Europe.', '2026-06-15', '2026-06-19', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.eurosatory.com', 'COGES Events', 'bisannuel', 1800, 57000, 'published'),

('milipol-paris-2025', 'Milipol Paris', 2025, 'Salon mondial de la surete et de la securite interieure des Etats. Technologies et equipements pour les forces de securite.', '2025-11-18', '2025-11-21', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.milipol.com', 'Comexposium', 'bisannuel', 1100, 30000, 'published'),

('aeromart-toulouse-2026', 'Aeromart Toulouse', 2026, 'Convention d''affaires de l''aeronautique. Rencontres BtoB entre donneurs d''ordres et sous-traitants de l''aerospatial.', '2026-12-01', '2026-12-03', 'Toulouse', 'MEETT Toulouse', 43.6529, 1.3679, 'FR', 'https://www.aeromart-toulouse.com', 'BCI Aerospace', 'annuel', 600, 5000, 'published'),

-- COSMETIQUE / BEAUTE
('cosmetic-360-paris-2026', 'Cosmetic 360', 2026, 'Salon de l''innovation cosmetique. Ingredients, formulation, packaging et technologies pour l''industrie de la beaute.', '2026-10-14', '2026-10-15', 'Paris', 'Carrousel du Louvre', 48.8611, 2.3336, 'FR', 'https://www.cosmetic-360.com', 'Cosmed', 'annuel', 300, 6000, 'published'),

('cosmetagora-paris-2026', 'Cosmetagora', 2026, 'Journees de la formulation cosmetique. Rencontres entre formulateurs, fournisseurs d''ingredients et marques cosmetiques.', '2026-01-13', '2026-01-14', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.cosmetagora.com', 'SFC', 'annuel', 200, 3500, 'published'),

-- LOGISTIQUE / TRANSPORT
('sitl-paris-2026', 'SITL', 2026, 'Semaine de l''innovation du transport et de la logistique. Supply chain, dernier kilometre, logistique urbaine et technologies.', '2026-03-31', '2026-04-02', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.sitl.eu', 'Reed Expositions', 'annuel', 700, 30000, 'published'),

('solutrans-lyon-2025', 'Solutrans', 2025, 'Salon international des solutions de transport routier et urbain. Vehicules industriels, utilitaires et mobilite durable.', '2025-11-18', '2025-11-22', 'Lyon', 'Eurexpo Lyon', 45.7275, 4.9520, 'FR', 'https://www.solutrans.eu', 'Lyon Expo Events', 'bisannuel', 1100, 55000, 'published'),

-- AGRICULTURE
('sia-paris-2026', 'Salon International de l''Agriculture', 2026, 'Le plus grand salon grand public dedie a l''agriculture en France. Elevage, cultures, terroir, innovations agricoles.', '2026-02-21', '2026-03-01', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salon-agriculture.com', 'Comexposium', 'annuel', 1000, 600000, 'published'),

('sima-paris-2026', 'SIMA', 2026, 'Mondial des fournisseurs de l''agriculture et de l''elevage. Machinisme agricole, equipements et innovations pour les exploitants.', '2026-11-08', '2026-11-12', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.simaonline.com', 'Comexposium', 'bisannuel', 1800, 230000, 'published'),

('tech-and-bio-2025', 'Tech&Bio', 2025, 'Salon de l''agriculture biologique et des techniques alternatives. Demonstrations en plein champ et innovations bio.', '2025-09-17', '2025-09-18', 'Bourg-les-Valence', 'Site de l''EPLEFPA', 44.9485, 4.8877, 'FR', 'https://www.tech-n-bio.com', 'Chambres d''agriculture', 'bisannuel', 350, 20000, 'published'),

-- DECORATION / HABITAT
('maison-et-objet-paris-2026', 'Maison&Objet', 2026, 'Salon international de la decoration, du design et du lifestyle. Le rendez-vous mondial de l''art de vivre et de la decoration.', '2026-01-16', '2026-01-20', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.maison-objet.com', 'SAFI', 'bisannuel', 2500, 80000, 'published'),

('ideobain-2026', 'Ideobain', 2026, 'Salon de la salle de bains. Design, equipements, bien-etre et innovations pour l''univers de la salle de bains.', '2026-09-28', '2026-10-01', 'Paris', 'Paris Nord Villepinte', 48.9696, 2.5156, 'FR', 'https://www.ideobain.com', 'Reed Expositions', 'bisannuel', 500, 70000, 'published'),

('foire-de-paris-2026', 'Foire de Paris', 2026, 'La plus grande foire commerciale de France. Habitat, gastronomie, shopping, innovations et loisirs creatifs.', '2026-04-29', '2026-05-10', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.foiredeparis.fr', 'Comexposium', 'annuel', 3500, 500000, 'published'),

-- FRANCHISE / COMMERCE
('franchise-expo-paris-2026', 'Franchise Expo Paris', 2026, 'Le salon de la franchise et de la creation d''entreprise. Enseignes, concepts et accompagnement pour les entrepreneurs.', '2026-03-15', '2026-03-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.franchiseparis.com', 'Reed Expositions', 'annuel', 500, 35000, 'published'),

('paris-retail-week-2026', 'Paris Retail Week', 2026, 'Le salon du commerce connecte. E-commerce, retail, omnicanal, paiement et experience client.', '2026-09-15', '2026-09-17', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.parisretailweek.com', 'Comexposium', 'annuel', 600, 30000, 'published'),

-- RH / FORMATION
('solutions-rh-paris-2026', 'Solutions RH', 2026, 'Salon des solutions en ressources humaines. SIRH, recrutement, formation, paie et management des talents.', '2026-03-18', '2026-03-19', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.solutions-ressources-humaines.com', 'Weyou Group', 'annuel', 300, 10000, 'published'),

('learning-technologies-paris-2026', 'Learning Technologies', 2026, 'Salon du digital learning et de la formation professionnelle. LMS, e-learning, realite virtuelle et innovations pedagogiques.', '2026-01-29', '2026-01-30', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.learningtechnologiesfrance.com', 'CloserStill Media', 'annuel', 250, 12000, 'published'),

-- DIVERS / TRANSVERSAL
('je-m-export-paris-2026', 'Salon Go Entrepreneurs', 2026, 'Le salon de l''entrepreneuriat et de la creation d''entreprise. Financement, accompagnement et solutions pour les entrepreneurs.', '2026-03-10', '2026-03-11', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.go-entrepreneurs.com', 'Les Echos Le Parisien Events', 'annuel', 400, 25000, 'published'),

('autonomy-paris-2026', 'Autonomy', 2026, 'Salon de la mobilite durable et urbaine. Velo, micromobilite, vehicules electriques et solutions de transport decarbone.', '2026-03-17', '2026-03-18', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.autonomy.paris', 'Autonomy SAS', 'annuel', 350, 12000, 'published'),

('congresmaire-paris-2025', 'Salon des Maires', 2025, 'Salon des maires et des collectivites locales. Solutions et equipements pour les collectivites territoriales.', '2025-11-18', '2025-11-20', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.salondesmaires.com', 'Comexposium', 'annuel', 1000, 60000, 'published'),

('produrable-paris-2026', 'Produrable', 2026, 'Le salon des acteurs et solutions du developpement durable et de la RSE. ESG, climat, economie circulaire et impact.', '2026-03-25', '2026-03-26', 'Paris', 'Palais des Congres', 48.8789, 2.2831, 'FR', 'https://www.produrable.com', 'Produrable', 'annuel', 250, 7000, 'published'),

('workspace-expo-paris-2026', 'Workspace Expo', 2026, 'Salon de l''amenagement des espaces de travail. Mobilier de bureau, acoustique, eclairage et design des espaces professionnels.', '2026-04-01', '2026-04-03', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.workspace-expo.com', 'Reed Expositions', 'annuel', 300, 15000, 'published');


-- Jointure salon_sectors
-- Associe chaque salon a son/ses secteur(s)
-- ------------------------------------------------------------

-- On utilise les slugs pour la lisibilite
insert into salon_sectors (salon_id, sector_id)
select s.id, sec.id from salons s, sectors sec where s.slug = 'sial-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sirha-lyon-2027' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sirha-lyon-2027' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'cfia-rennes-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sandwich-and-snack-show-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'batimat-2026' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'interclima-2026' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'interclima-2026' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'pollutec-lyon-2025' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'artibat-rennes-2026' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'vivatech-paris-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sido-lyon-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sido-lyon-2026' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'fic-lille-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'fic-lille-2026' and sec.slug = 'defense-securite'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'big-data-paris-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'global-industrie-lyon-2025' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'smart-industries-2026' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'smart-industries-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sepem-toulouse-2026' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'midest-2026' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'pharmapack-paris-2026' and sec.slug = 'sante-pharma'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'hlt-paris-2026' and sec.slug = 'sante-pharma'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'hlt-paris-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'santexpo-paris-2026' and sec.slug = 'sante-pharma'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'premiere-vision-paris-2026' and sec.slug = 'mode-textile'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'texworld-paris-2026' and sec.slug = 'mode-textile'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'who-s-next-paris-2026' and sec.slug = 'mode-textile'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'iftm-top-resa-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'equiphotel-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'heavent-paris-2026' and sec.slug = 'tourisme-hotellerie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'bepositive-lyon-2027' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'bepositive-lyon-2027' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'hyvolution-paris-2026' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'world-nuclear-exhibition-2026' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'eurosatory-paris-2026' and sec.slug = 'defense-securite'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'milipol-paris-2025' and sec.slug = 'defense-securite'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'aeromart-toulouse-2026' and sec.slug = 'defense-securite'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'aeromart-toulouse-2026' and sec.slug = 'industrie'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'cosmetic-360-paris-2026' and sec.slug = 'cosmetique-beaute'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'cosmetagora-paris-2026' and sec.slug = 'cosmetique-beaute'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sitl-paris-2026' and sec.slug = 'logistique-transport'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'solutrans-lyon-2025' and sec.slug = 'logistique-transport'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sia-paris-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sia-paris-2026' and sec.slug = 'agroalimentaire'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'sima-paris-2026' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'tech-and-bio-2025' and sec.slug = 'agriculture'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'maison-et-objet-paris-2026' and sec.slug = 'decoration-habitat'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'ideobain-2026' and sec.slug = 'decoration-habitat'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'ideobain-2026' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'foire-de-paris-2026' and sec.slug = 'decoration-habitat'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'franchise-expo-paris-2026' and sec.slug = 'franchise-commerce'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'paris-retail-week-2026' and sec.slug = 'franchise-commerce'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'paris-retail-week-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'solutions-rh-paris-2026' and sec.slug = 'rh-formation'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'learning-technologies-paris-2026' and sec.slug = 'rh-formation'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'learning-technologies-paris-2026' and sec.slug = 'tech-numerique'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'je-m-export-paris-2026' and sec.slug = 'franchise-commerce'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'autonomy-paris-2026' and sec.slug = 'logistique-transport'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'autonomy-paris-2026' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'congresmaire-paris-2025' and sec.slug = 'btp-construction'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'produrable-paris-2026' and sec.slug = 'energie-environnement'
union all select s.id, sec.id from salons s, sectors sec where s.slug = 'workspace-expo-paris-2026' and sec.slug = 'decoration-habitat';
