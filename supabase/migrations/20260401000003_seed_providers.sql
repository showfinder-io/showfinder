-- =============================================================
-- Seed: Prestataires salons professionnels (~30 providers)
-- =============================================================

-- Standistes (~10)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('expocom-paris', 'Expocom', 'standiste', 'Conception et réalisation de stands sur-mesure pour salons professionnels depuis 1990. Accompagnement complet du design à l''installation.', 'Paris', 500, 'https://www.expocom.fr', '01 45 26 78 00', 'contact@expocom.fr', true, 'premium'),
  ('gl-events-venues-lyon', 'GL Events Venues', 'standiste', 'Leader français de l''événementiel et de la gestion de sites d''exposition. Présent sur plus de 50 sites en France.', 'Lyon', 500, 'https://www.gl-events.com', '04 78 17 60 00', 'contact@gl-events.com', true, 'premium'),
  ('syma-paris', 'Syma', 'standiste', 'Fabricant de systèmes modulaires pour stands d''exposition. Solutions innovantes et réutilisables.', 'Paris', 400, 'https://www.syma.com', '01 49 68 96 96', 'info@syma.com', true, 'premium'),
  ('pico-international-paris', 'Pico International France', 'standiste', 'Groupe international spécialisé dans la conception de stands et d''environnements de marque. Présence dans 40 pays.', 'Paris', 500, 'https://www.pico.com', '01 56 09 10 00', 'france@pico.com', true, 'free'),
  ('mci-france-paris', 'MCI France', 'standiste', 'Agence de communication événementielle et standiste. Création de stands immersifs et expérientiels.', 'Paris', 300, 'https://www.mci-group.com', '01 53 85 35 00', 'paris@mci-group.com', true, 'free'),
  ('stands-plus-lyon', 'Stands Plus', 'standiste', 'Standiste lyonnais spécialisé dans les stands éco-responsables. Matériaux recyclés et conception durable.', 'Lyon', 300, 'https://www.standsplus.fr', '04 72 83 45 00', 'contact@standsplus.fr', false, 'free'),
  ('h2o-events-paris', 'H2O Events', 'standiste', 'Agence de design événementiel. Conception de stands haut de gamme pour les salons internationaux.', 'Paris', 400, 'https://www.h2o-events.fr', '01 42 60 33 00', 'info@h2o-events.fr', false, 'free'),
  ('euro-stands-lille', 'Euro Stands', 'standiste', 'Standiste du nord de la France spécialisé dans les salons industriels et BTP. Plus de 20 ans d''expérience.', 'Lille', 250, 'https://www.eurostands.fr', '03 20 54 78 00', 'contact@eurostands.fr', false, 'free'),
  ('expovista-nantes', 'ExpoVista', 'standiste', 'Conception et montage de stands sur-mesure dans le Grand Ouest. Spécialiste agroalimentaire et industrie.', 'Nantes', 200, 'https://www.expovista.fr', '02 40 35 67 00', 'contact@expovista.fr', false, 'free'),
  ('atelier-stand-bordeaux', 'Atelier du Stand', 'standiste', 'Création de stands design pour salons viticoles, agroalimentaires et lifestyle en Nouvelle-Aquitaine.', 'Bordeaux', 200, 'https://www.atelier-du-stand.fr', '05 56 44 21 00', 'info@atelier-du-stand.fr', false, 'free')
on conflict (slug) do nothing;

-- Traiteurs (~5)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('potel-et-chabot-paris', 'Potel et Chabot', 'traiteur', 'Traiteur de prestige depuis 1820. Référence de la gastronomie événementielle pour les salons haut de gamme.', 'Paris', 300, 'https://www.potel-et-chabot.com', '01 46 62 52 00', 'events@potel-et-chabot.com', true, 'premium'),
  ('lenotre-paris', 'Lenôtre', 'traiteur', 'Maison de gastronomie française. Service traiteur événementiel pour cocktails, déjeuners et dîners de gala sur salons.', 'Paris', 300, 'https://www.lenotre.com', '01 45 02 21 21', 'traiteur@lenotre.com', true, 'free'),
  ('elior-events-paris', 'Elior Events', 'traiteur', 'Restauration événementielle à grande échelle. Partenaire officiel de nombreux parcs d''exposition en France.', 'Paris', 500, 'https://www.elior.com', '01 71 06 70 00', 'events@elior.com', true, 'free'),
  ('traiteur-lefevre-lyon', 'Traiteur Lefèvre', 'traiteur', 'Traiteur lyonnais spécialisé dans la restauration événementielle B2B. Buffets, cocktails et plateaux-repas pour salons.', 'Lyon', 150, 'https://www.traiteur-lefevre.fr', '04 78 60 43 00', 'contact@traiteur-lefevre.fr', false, 'free'),
  ('gourmet-salon-paris', 'Gourmet & Salon', 'traiteur', 'Service traiteur dédié aux salons professionnels. Formules adaptées aux espaces d''exposition.', 'Paris', 200, 'https://www.gourmetsalon.fr', '01 44 55 66 00', 'contact@gourmetsalon.fr', false, 'free')
on conflict (slug) do nothing;

-- AV Technique (~5)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('novelty-paris', 'Novelty', 'av_technique', 'Prestataire audiovisuel événementiel leader en France. Son, lumière, vidéo et scénographie pour salons et congrès.', 'Paris', 500, 'https://www.music-group.com/novelty', '01 49 22 40 00', 'contact@novelty.fr', true, 'premium'),
  ('videlio-paris', 'Videlio', 'av_technique', 'Solutions audiovisuelles intégrées pour l''événementiel. Écrans géants, sonorisation, streaming live.', 'Paris', 500, 'https://www.videlio.com', '01 55 86 00 00', 'events@videlio.com', true, 'free'),
  ('dushow-paris', 'Dushow', 'av_technique', 'Prestataire technique événementiel. Régie son, lumière et vidéo pour salons, conventions et lancements produit.', 'Paris', 400, 'https://www.dushow.com', '01 49 46 06 60', 'contact@dushow.com', true, 'free'),
  ('magnum-lyon', 'Magnum', 'av_technique', 'Prestation technique audiovisuelle pour événements professionnels à Lyon et dans le quart sud-est.', 'Lyon', 250, 'https://www.magnum-events.fr', '04 72 91 45 00', 'info@magnum-events.fr', false, 'free'),
  ('sono-plus-toulouse', 'Sono Plus Événements', 'av_technique', 'Location et installation de matériel audiovisuel pour salons professionnels dans le Grand Sud-Ouest.', 'Toulouse', 200, 'https://www.sonoplus-events.fr', '05 61 22 33 00', 'contact@sonoplus-events.fr', false, 'free')
on conflict (slug) do nothing;

-- Photographes (~4)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('joel-vieillard-paris', 'Joël Vieillard Photographie', 'photographe', 'Photographe événementiel professionnel. Couverture de salons, congrès et événements corporate depuis 15 ans.', 'Paris', 300, 'https://www.joelvieillard.com', '06 12 34 56 78', 'contact@joelvieillard.com', true, 'free'),
  ('evenementiel-photo-paris', 'Événementiel Photo', 'photographe', 'Agence photo spécialisée en événementiel B2B. Reportages salons, portraits exposants, photos de stand.', 'Paris', 400, 'https://www.evenementiel-photo.fr', '01 43 55 22 00', 'info@evenementiel-photo.fr', false, 'free'),
  ('studio-lumieres-lyon', 'Studio Lumières', 'photographe', 'Studio photo et vidéo événementiel basé à Lyon. Spécialiste des salons professionnels Auvergne-Rhône-Alpes.', 'Lyon', 200, 'https://www.studio-lumieres.fr', '04 78 29 11 00', 'contact@studio-lumieres.fr', false, 'free'),
  ('flash-expo-lille', 'Flash Expo', 'photographe', 'Photographe et vidéaste événementiel dans les Hauts-de-France. Couverture complète de salons professionnels.', 'Lille', 150, 'https://www.flash-expo.fr', '03 20 88 45 00', 'hello@flash-expo.fr', false, 'free')
on conflict (slug) do nothing;

-- Transport (~3)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('db-schenker-paris', 'DB Schenker France', 'transport', 'Logistique événementielle internationale. Transport, stockage et manutention de matériel d''exposition.', 'Paris', 500, 'https://www.dbschenker.com/fr', '01 49 89 46 00', 'events.france@dbschenker.com', true, 'free'),
  ('transpost-lyon', 'Transpost Events', 'transport', 'Transport et logistique dédiés aux salons professionnels. Livraison sur parc d''exposition, stockage et retour.', 'Lyon', 300, 'https://www.transpost-events.fr', '04 72 22 55 00', 'contact@transpost-events.fr', false, 'free'),
  ('expo-logistics-paris', 'Expo Logistics', 'transport', 'Commissionnaire de transport spécialisé salons et foires. Gestion douanière, transport et installation.', 'Paris', 500, 'https://www.expo-logistics.fr', '01 48 63 70 00', 'info@expo-logistics.fr', false, 'free')
on conflict (slug) do nothing;

-- Hébergement (~3)
insert into providers (slug, company_name, category, description, city, coverage_radius_km, website_url, phone, email, is_verified, subscription_tier)
values
  ('bhotel-paris', 'B&B Hotels Événements', 'hebergement', 'Réseau hôtelier avec offres dédiées aux exposants et visiteurs de salons. Tarifs négociés à proximité des parcs d''exposition.', 'Paris', 500, 'https://www.hotel-bb.com', '01 72 36 51 00', 'events@hotelbb.com', true, 'free'),
  ('salon-hotels-paris', 'Salon Hotels', 'hebergement', 'Plateforme de réservation hôtelière spécialisée pour les salons professionnels. Blocs de chambres et tarifs groupe.', 'Paris', 300, 'https://www.salonhotels.fr', '01 55 37 44 00', 'booking@salonhotels.fr', false, 'free'),
  ('accor-events-lyon', 'Accor Events Lyon', 'hebergement', 'Service dédié du groupe Accor pour l''hébergement événementiel à Lyon. Proximité Eurexpo et Centre de Congrès.', 'Lyon', 100, 'https://www.accor.com', '04 72 35 60 00', 'events.lyon@accor.com', true, 'free')
on conflict (slug) do nothing;


-- =============================================================
-- Liaison salon_providers
-- =============================================================

-- Standistes -> salons (3-5 chacun)

-- Expocom (premium)
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'expocom-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'expocom-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'expocom-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'expocom-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'expocom-paris' on conflict do nothing;

-- GL Events Venues (premium)
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'gl-events-venues-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'gl-events-venues-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'gl-events-venues-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'gl-events-venues-lyon' on conflict do nothing;

-- Syma (premium)
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'syma-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'syma-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'syma-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'syma-paris' on conflict do nothing;

-- Pico International
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'pico-international-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'pico-international-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'pico-international-paris' on conflict do nothing;

-- MCI France
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'mci-france-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'mci-france-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'mci-france-paris' on conflict do nothing;

-- Stands Plus
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'stands-plus-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'stands-plus-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'stands-plus-lyon' on conflict do nothing;

-- H2O Events
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'h2o-events-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'h2o-events-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'h2o-events-paris' on conflict do nothing;

-- Euro Stands
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'euro-stands-lille' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'euro-stands-lille' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'euro-stands-lille' on conflict do nothing;

-- ExpoVista
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'expovista-nantes' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'expovista-nantes' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'expovista-nantes' on conflict do nothing;

-- Atelier du Stand
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'atelier-stand-bordeaux' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'atelier-stand-bordeaux' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'atelier-stand-bordeaux' on conflict do nothing;


-- Traiteurs -> salons (2-3 chacun)

-- Potel et Chabot (premium)
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'potel-et-chabot-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'potel-et-chabot-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'potel-et-chabot-paris' on conflict do nothing;

-- Lenôtre
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'lenotre-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'lenotre-paris' on conflict do nothing;

-- Elior Events
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'elior-events-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'elior-events-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'elior-events-paris' on conflict do nothing;

-- Traiteur Lefèvre
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'traiteur-lefevre-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'traiteur-lefevre-lyon' on conflict do nothing;

-- Gourmet & Salon
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'gourmet-salon-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'gourmet-salon-paris' on conflict do nothing;


-- AV Technique -> salons (2-3 chacun)

-- Novelty (premium)
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'novelty-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'novelty-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, true from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'novelty-paris' on conflict do nothing;

-- Videlio
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'videlio-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'videlio-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'videlio-paris' on conflict do nothing;

-- Dushow
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'dushow-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'dushow-paris' on conflict do nothing;

-- Magnum
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'magnum-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'magnum-lyon' on conflict do nothing;

-- Sono Plus
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'sono-plus-toulouse' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'sono-plus-toulouse' on conflict do nothing;


-- Photographes -> salons (2-3 chacun)

-- Joël Vieillard
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'joel-vieillard-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'joel-vieillard-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'joel-vieillard-paris' on conflict do nothing;

-- Événementiel Photo
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'evenementiel-photo-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'evenementiel-photo-paris' on conflict do nothing;

-- Studio Lumières
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'studio-lumieres-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'studio-lumieres-lyon' on conflict do nothing;

-- Flash Expo
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'flash-expo-lille' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'flash-expo-lille' on conflict do nothing;


-- Transport -> salons (2-3 chacun)

-- DB Schenker
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'db-schenker-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'db-schenker-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'db-schenker-paris' on conflict do nothing;

-- Transpost Events
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'transpost-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'transpost-lyon' on conflict do nothing;

-- Expo Logistics
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'expo-logistics-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'expo-logistics-paris' on conflict do nothing;


-- Hébergement -> salons (2-3 chacun)

-- B&B Hotels
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sial-paris-2026' and p.slug = 'bhotel-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'vivatech-paris-2026' and p.slug = 'bhotel-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'batimat-2026' and p.slug = 'bhotel-paris' on conflict do nothing;

-- Salon Hotels
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'eurosatory-paris-2026' and p.slug = 'salon-hotels-paris' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'maison-et-objet-paris-2026' and p.slug = 'salon-hotels-paris' on conflict do nothing;

-- Accor Events Lyon
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'sirha-lyon-2027' and p.slug = 'accor-events-lyon' on conflict do nothing;
insert into salon_providers (salon_id, provider_id, is_featured)
select s.id, p.id, false from salons s, providers p where s.slug = 'global-industrie-lyon-2025' and p.slug = 'accor-events-lyon' on conflict do nothing;
