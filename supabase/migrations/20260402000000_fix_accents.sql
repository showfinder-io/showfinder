-- ============================================================
-- Migration: Fix missing French accents in all text content
-- Tables: sectors, salons, providers
-- ============================================================

BEGIN;

-- ============================================================
-- 1. SECTORS — name and description
-- ============================================================

-- Sector names
UPDATE sectors SET name = REPLACE(name, 'Sante et Pharma', 'Santé et Pharma') WHERE name LIKE '%Sante et Pharma%';
UPDATE sectors SET name = REPLACE(name, 'Tech et Numerique', 'Tech et Numérique') WHERE name LIKE '%Tech et Numerique%';
UPDATE sectors SET name = REPLACE(name, 'Energie et Environnement', 'Énergie et Environnement') WHERE name LIKE '%Energie et Environnement%';
UPDATE sectors SET name = REPLACE(name, 'Defense et Securite', 'Défense et Sécurité') WHERE name LIKE '%Defense et Securite%';
UPDATE sectors SET name = REPLACE(name, 'Cosmetique et Beaute', 'Cosmétique et Beauté') WHERE name LIKE '%Cosmetique et Beaute%';
UPDATE sectors SET name = REPLACE(name, 'Tourisme et Hotellerie', 'Tourisme et Hôtellerie') WHERE name LIKE '%Tourisme et Hotellerie%';
UPDATE sectors SET name = REPLACE(name, 'Decoration et Habitat', 'Décoration et Habitat') WHERE name LIKE '%Decoration et Habitat%';

-- Sector descriptions
UPDATE sectors SET description = REPLACE(description, 'Batiment', 'Bâtiment') WHERE description LIKE '%Batiment%';
UPDATE sectors SET description = REPLACE(description, 'materiaux', 'matériaux') WHERE description LIKE '%materiaux%';
UPDATE sectors SET description = REPLACE(description, 'manufacturiere', 'manufacturière') WHERE description LIKE '%manufacturiere%';
UPDATE sectors SET description = REPLACE(description, 'cybersecurite', 'cybersécurité') WHERE description LIKE '%cybersecurite%';
UPDATE sectors SET description = REPLACE(description, 'medicaux', 'médicaux') WHERE description LIKE '%medicaux%';
UPDATE sectors SET description = REPLACE(description, 'Sante', 'Santé') WHERE description LIKE '%Sante%';
UPDATE sectors SET description = REPLACE(description, 'hotellerie', 'hôtellerie') WHERE description LIKE '%hotellerie%';
UPDATE sectors SET description = REPLACE(description, 'Energies renouvelables', 'Énergies renouvelables') WHERE description LIKE '%Energies renouvelables%';
UPDATE sectors SET description = REPLACE(description, 'developpement', 'développement') WHERE description LIKE '%developpement%';
UPDATE sectors SET description = REPLACE(description, 'securite', 'sécurité') WHERE description LIKE '%securite%';
UPDATE sectors SET description = REPLACE(description, 'Defense', 'Défense') WHERE description LIKE '%Defense%';
UPDATE sectors SET description = REPLACE(description, 'aeronautique', 'aéronautique') WHERE description LIKE '%aeronautique%';
UPDATE sectors SET description = REPLACE(description, 'Cosmetiques', 'Cosmétiques') WHERE description LIKE '%Cosmetiques%';
UPDATE sectors SET description = REPLACE(description, 'beaute', 'beauté') WHERE description LIKE '%beaute%';
UPDATE sectors SET description = REPLACE(description, 'bien-etre', 'bien-être') WHERE description LIKE '%bien-etre%';
UPDATE sectors SET description = REPLACE(description, 'mobilite', 'mobilité') WHERE description LIKE '%mobilite%';
UPDATE sectors SET description = REPLACE(description, 'elevage', 'élevage') WHERE description LIKE '%elevage%';
UPDATE sectors SET description = REPLACE(description, 'decoration interieure', 'décoration intérieure') WHERE description LIKE '%decoration interieure%';
UPDATE sectors SET description = REPLACE(description, 'pret-a-porter', 'prêt-à-porter') WHERE description LIKE '%pret-a-porter%';

-- ============================================================
-- 2. SALONS — description (main text content visible to users)
-- ============================================================

-- Words starting with "é" (lowercase)
UPDATE salons SET description = REPLACE(description, 'evenement', 'événement') WHERE description LIKE '%evenement%';
UPDATE salons SET description = REPLACE(description, 'equipement', 'équipement') WHERE description LIKE '%equipement%';
UPDATE salons SET description = REPLACE(description, 'energetique', 'énergétique') WHERE description LIKE '%energetique%';
UPDATE salons SET description = REPLACE(description, 'energie', 'énergie') WHERE description LIKE '%energie%';
UPDATE salons SET description = REPLACE(description, 'elevage', 'élevage') WHERE description LIKE '%elevage%';
UPDATE salons SET description = REPLACE(description, 'electrique', 'électrique') WHERE description LIKE '%electrique%';
UPDATE salons SET description = REPLACE(description, 'electricite', 'électricité') WHERE description LIKE '%electricite%';
UPDATE salons SET description = REPLACE(description, 'electronique', 'électronique') WHERE description LIKE '%electronique%';
UPDATE salons SET description = REPLACE(description, 'echanges', 'échanges') WHERE description LIKE '%echanges%';
UPDATE salons SET description = REPLACE(description, 'eclairage', 'éclairage') WHERE description LIKE '%eclairage%';
UPDATE salons SET description = REPLACE(description, 'eco-responsabilite', 'éco-responsabilité') WHERE description LIKE '%eco-responsabilite%';
UPDATE salons SET description = REPLACE(description, 'eco-construction', 'éco-construction') WHERE description LIKE '%eco-construction%';
UPDATE salons SET description = REPLACE(description, 'eolien', 'éolien') WHERE description LIKE '%eolien%';

-- Words starting with "É" (uppercase)
UPDATE salons SET description = REPLACE(description, 'Evenement', 'Événement') WHERE description LIKE '%Evenement%';
UPDATE salons SET description = REPLACE(description, 'Equipements', 'Équipements') WHERE description LIKE '%Equipements%';
UPDATE salons SET description = REPLACE(description, 'Elevage', 'Élevage') WHERE description LIKE '%Elevage%';
UPDATE salons SET description = REPLACE(description, 'Energies', 'Énergies') WHERE description LIKE '%Energies%';
UPDATE salons SET description = REPLACE(description, 'Edition', 'Édition') WHERE description LIKE '%Edition%';

-- Words with accented "é" inside
UPDATE salons SET description = REPLACE(description, 'securite', 'sécurité') WHERE description LIKE '%securite%';
UPDATE salons SET description = REPLACE(description, 'numerique', 'numérique') WHERE description LIKE '%numerique%';
UPDATE salons SET description = REPLACE(description, 'reference', 'référence') WHERE description LIKE '%reference%';
UPDATE salons SET description = REPLACE(description, 'hotellerie', 'hôtellerie') WHERE description LIKE '%hotellerie%';
UPDATE salons SET description = REPLACE(description, 'aeronautique', 'aéronautique') WHERE description LIKE '%aeronautique%';
UPDATE salons SET description = REPLACE(description, 'cosmetique', 'cosmétique') WHERE description LIKE '%cosmetique%';
UPDATE salons SET description = REPLACE(description, 'developpement', 'développement') WHERE description LIKE '%developpement%';
UPDATE salons SET description = REPLACE(description, 'economie', 'économie') WHERE description LIKE '%economie%';
UPDATE salons SET description = REPLACE(description, 'demantelement', 'démantèlement') WHERE description LIKE '%demantelement%';
UPDATE salons SET description = REPLACE(description, 'vehicule', 'véhicule') WHERE description LIKE '%vehicule%';
UPDATE salons SET description = REPLACE(description, 'renovation', 'rénovation') WHERE description LIKE '%renovation%';
UPDATE salons SET description = REPLACE(description, 'amenagement', 'aménagement') WHERE description LIKE '%amenagement%';
UPDATE salons SET description = REPLACE(description, 'batiment', 'bâtiment') WHERE description LIKE '%batiment%';
UPDATE salons SET description = REPLACE(description, 'dedie', 'dédié') WHERE description LIKE '%dedie%';
UPDATE salons SET description = REPLACE(description, 'dediee', 'dédiée') WHERE description LIKE '%dediee%';
UPDATE salons SET description = REPLACE(description, 'specialise', 'spécialisé') WHERE description LIKE '%specialise%';
UPDATE salons SET description = REPLACE(description, 'hebergement', 'hébergement') WHERE description LIKE '%hebergement%';
UPDATE salons SET description = REPLACE(description, 'mediterranee', 'méditerranée') WHERE description LIKE '%mediterranee%';
UPDATE salons SET description = REPLACE(description, 'Mediterranee', 'Méditerranée') WHERE description LIKE '%Mediterranee%';
UPDATE salons SET description = REPLACE(description, 'metier', 'métier') WHERE description LIKE '%metier%';
UPDATE salons SET description = REPLACE(description, 'conference', 'conférence') WHERE description LIKE '%conference%';
UPDATE salons SET description = REPLACE(description, 'reseau', 'réseau') WHERE description LIKE '%reseau%';
UPDATE salons SET description = REPLACE(description, 'strategie', 'stratégie') WHERE description LIKE '%strategie%';
UPDATE salons SET description = REPLACE(description, 'efficacite', 'efficacité') WHERE description LIKE '%efficacite%';
UPDATE salons SET description = REPLACE(description, 'decarbonation', 'décarbonation') WHERE description LIKE '%decarbonation%';
UPDATE salons SET description = REPLACE(description, 'dechets', 'déchets') WHERE description LIKE '%dechets%';

-- Words with "è"
UPDATE salons SET description = REPLACE(description, 'premiere', 'première') WHERE description LIKE '%premiere%';
UPDATE salons SET description = REPLACE(description, 'derniere', 'dernière') WHERE description LIKE '%derniere%';
UPDATE salons SET description = REPLACE(description, 'filiere', 'filière') WHERE description LIKE '%filiere%';

-- Words with "ê"
UPDATE salons SET description = REPLACE(description, 'bien-etre', 'bien-être') WHERE description LIKE '%bien-etre%';
UPDATE salons SET description = REPLACE(description, 'pret-a-porter', 'prêt-à-porter') WHERE description LIKE '%pret-a-porter%';

-- Words with other accents
UPDATE salons SET description = REPLACE(description, 'materiel', 'matériel') WHERE description LIKE '%materiel%';
UPDATE salons SET description = REPLACE(description, 'materiaux', 'matériaux') WHERE description LIKE '%materiaux%';
UPDATE salons SET description = REPLACE(description, 'matieres premieres', 'matières premières') WHERE description LIKE '%matieres premieres%';
UPDATE salons SET description = REPLACE(description, 'qualite', 'qualité') WHERE description LIKE '%qualite%';
UPDATE salons SET description = REPLACE(description, 'mobilite', 'mobilité') WHERE description LIKE '%mobilite%';
UPDATE salons SET description = REPLACE(description, 'realite', 'réalité') WHERE description LIKE '%realite%';
UPDATE salons SET description = REPLACE(description, 'creativite', 'créativité') WHERE description LIKE '%creativite%';
UPDATE salons SET description = REPLACE(description, 'competitivite', 'compétitivité') WHERE description LIKE '%competitivite%';
UPDATE salons SET description = REPLACE(description, 'ecologique', 'écologique') WHERE description LIKE '%ecologique%';
UPDATE salons SET description = REPLACE(description, 'immobiliere', 'immobilière') WHERE description LIKE '%immobiliere%';
UPDATE salons SET description = REPLACE(description, 'regionale', 'régionale') WHERE description LIKE '%regionale%';
UPDATE salons SET description = REPLACE(description, 'regionaux', 'régionaux') WHERE description LIKE '%regionaux%';
UPDATE salons SET description = REPLACE(description, 'etablissement', 'établissement') WHERE description LIKE '%etablissement%';
UPDATE salons SET description = REPLACE(description, 'echelle', 'échelle') WHERE description LIKE '%echelle%';
UPDATE salons SET description = REPLACE(description, 'demonstration', 'démonstration') WHERE description LIKE '%demonstration%';
UPDATE salons SET description = REPLACE(description, 'mecanique', 'mécanique') WHERE description LIKE '%mecanique%';
UPDATE salons SET description = REPLACE(description, 'metrologie', 'métrologie') WHERE description LIKE '%metrologie%';
UPDATE salons SET description = REPLACE(description, 'metaux', 'métaux') WHERE description LIKE '%metaux%';
UPDATE salons SET description = REPLACE(description, 'metallerie', 'métallerie') WHERE description LIKE '%metallerie%';
UPDATE salons SET description = REPLACE(description, 'metallurgie', 'métallurgie') WHERE description LIKE '%metallurgie%';
UPDATE salons SET description = REPLACE(description, 'siderurgie', 'sidérurgie') WHERE description LIKE '%siderurgie%';
UPDATE salons SET description = REPLACE(description, 'geothermie', 'géothermie') WHERE description LIKE '%geothermie%';
UPDATE salons SET description = REPLACE(description, 'geotechnique', 'géotechnique') WHERE description LIKE '%geotechnique%';
UPDATE salons SET description = REPLACE(description, 'patisserie', 'pâtisserie') WHERE description LIKE '%patisserie%';
UPDATE salons SET description = REPLACE(description, 'Degustation', 'Dégustation') WHERE description LIKE '%Degustation%';
UPDATE salons SET description = REPLACE(description, 'chocolatieres', 'chocolatières') WHERE description LIKE '%chocolatieres%';
UPDATE salons SET description = REPLACE(description, 'oenologie', 'œnologie') WHERE description LIKE '%oenologie%';
UPDATE salons SET description = REPLACE(description, 'nucleaire', 'nucléaire') WHERE description LIKE '%nucleaire%';
UPDATE salons SET description = REPLACE(description, 'hydrogene', 'hydrogène') WHERE description LIKE '%hydrogene%';
UPDATE salons SET description = REPLACE(description, 'precision', 'précision') WHERE description LIKE '%precision%';
UPDATE salons SET description = REPLACE(description, 'controle', 'contrôle') WHERE description LIKE '%controle%';
UPDATE salons SET description = REPLACE(description, 'decarbone', 'décarboné') WHERE description LIKE '%decarbone%';
UPDATE salons SET description = REPLACE(description, 'copropriete', 'copropriété') WHERE description LIKE '%copropriete%';
UPDATE salons SET description = REPLACE(description, 'Copropriete', 'Copropriété') WHERE description LIKE '%Copropriete%';
UPDATE salons SET description = REPLACE(description, 'prevention', 'prévention') WHERE description LIKE '%prevention%';
UPDATE salons SET description = REPLACE(description, 'exterieur', 'extérieur') WHERE description LIKE '%exterieur%';
UPDATE salons SET description = REPLACE(description, 'vegetalisation', 'végétalisation') WHERE description LIKE '%vegetalisation%';
UPDATE salons SET description = REPLACE(description, 'refrigeration', 'réfrigération') WHERE description LIKE '%refrigeration%';
UPDATE salons SET description = REPLACE(description, 'pepinieres', 'pépinières') WHERE description LIKE '%pepinieres%';
UPDATE salons SET description = REPLACE(description, 'vegetal', 'végétal') WHERE description LIKE '%vegetal%';
UPDATE salons SET description = REPLACE(description, 'thalassotherapie', 'thalassothérapie') WHERE description LIKE '%thalassotherapie%';
UPDATE salons SET description = REPLACE(description, 'balneotherapie', 'balnéothérapie') WHERE description LIKE '%balneotherapie%';
UPDATE salons SET description = REPLACE(description, 'sejours', 'séjours') WHERE description LIKE '%sejours%';
UPDATE salons SET description = REPLACE(description, 'seminaires', 'séminaires') WHERE description LIKE '%seminaires%';
UPDATE salons SET description = REPLACE(description, 'evenementiel', 'événementiel') WHERE description LIKE '%evenementiel%';
UPDATE salons SET description = REPLACE(description, 'telesante', 'télésanté') WHERE description LIKE '%telesante%';
UPDATE salons SET description = REPLACE(description, 'medico-social', 'médico-social') WHERE description LIKE '%medico-social%';
UPDATE salons SET description = REPLACE(description, 'medical', 'médical') WHERE description LIKE '%medical%';
UPDATE salons SET description = REPLACE(description, 'medicale', 'médicale') WHERE description LIKE '%medicale%';
UPDATE salons SET description = REPLACE(description, 'createurs', 'créateurs') WHERE description LIKE '%createurs%';
UPDATE salons SET description = REPLACE(description, 'creation', 'création') WHERE description LIKE '%creation%';
UPDATE salons SET description = REPLACE(description, 'creatifs', 'créatifs') WHERE description LIKE '%creatifs%';
UPDATE salons SET description = REPLACE(description, 'aeriennes', 'aériennes') WHERE description LIKE '%aeriennes%';
UPDATE salons SET description = REPLACE(description, 'aerospatial', 'aérospatial') WHERE description LIKE '%aerospatial%';
UPDATE salons SET description = REPLACE(description, 'pedagogiques', 'pédagogiques') WHERE description LIKE '%pedagogiques%';
UPDATE salons SET description = REPLACE(description, 'Pyrenees', 'Pyrénées') WHERE description LIKE '%Pyrenees%';
UPDATE salons SET description = REPLACE(description, 'Compiegne', 'Compiègne') WHERE description LIKE '%Compiegne%';
UPDATE salons SET description = REPLACE(description, 'bioethanol', 'bioéthanol') WHERE description LIKE '%bioethanol%';
UPDATE salons SET description = REPLACE(description, 'methanisation', 'méthanisation') WHERE description LIKE '%methanisation%';
UPDATE salons SET description = REPLACE(description, 'biomethane', 'biométhane') WHERE description LIKE '%biomethane%';
UPDATE salons SET description = REPLACE(description, 'recolte', 'récolte') WHERE description LIKE '%recolte%';
UPDATE salons SET description = REPLACE(description, 'genetique', 'génétique') WHERE description LIKE '%genetique%';
UPDATE salons SET description = REPLACE(description, 'betail', 'bétail') WHERE description LIKE '%betail%';
UPDATE salons SET description = REPLACE(description, 'cereales', 'céréales') WHERE description LIKE '%cereales%';
UPDATE salons SET description = REPLACE(description, 'edition', 'édition') WHERE description LIKE '%edition%';
UPDATE salons SET description = REPLACE(description, 'Cite', 'Cité') WHERE description LIKE '%Cite des%';

-- Additional patterns found in batch data
UPDATE salons SET description = REPLACE(description, 'sante', 'santé') WHERE description LIKE '%sante%';
UPDATE salons SET description = REPLACE(description, 'Sante', 'Santé') WHERE description LIKE '%Sante%';
UPDATE salons SET description = REPLACE(description, 'Systemes', 'Systèmes') WHERE description LIKE '%Systemes%';
UPDATE salons SET description = REPLACE(description, 'systemes', 'systèmes') WHERE description LIKE '%systemes%';
UPDATE salons SET description = REPLACE(description, 'Federation', 'Fédération') WHERE description LIKE '%Federation%';
UPDATE salons SET description = REPLACE(description, 'hospitaliere', 'hospitalière') WHERE description LIKE '%hospitaliere%';
UPDATE salons SET description = REPLACE(description, 'hopital', 'hôpital') WHERE description LIKE '%hopital%';
UPDATE salons SET description = REPLACE(description, 'Hopital', 'Hôpital') WHERE description LIKE '%Hopital%';
UPDATE salons SET description = REPLACE(description, 'Ecosysteme', 'Écosystème') WHERE description LIKE '%Ecosysteme%';
UPDATE salons SET description = REPLACE(description, 'ecosysteme', 'écosystème') WHERE description LIKE '%ecosysteme%';
UPDATE salons SET description = REPLACE(description, 'reunissant', 'réunissant') WHERE description LIKE '%reunissant%';
UPDATE salons SET description = REPLACE(description, 'decideurs', 'décideurs') WHERE description LIKE '%decideurs%';
UPDATE salons SET description = REPLACE(description, 'developpeurs', 'développeurs') WHERE description LIKE '%developpeurs%';
UPDATE salons SET description = REPLACE(description, 'Presentation', 'Présentation') WHERE description LIKE '%Presentation%';
UPDATE salons SET description = REPLACE(description, 'francaises', 'françaises') WHERE description LIKE '%francaises%';
UPDATE salons SET description = REPLACE(description, 'francais', 'français') WHERE description LIKE '%francais%';
UPDATE salons SET description = REPLACE(description, 'Francaise', 'Française') WHERE description LIKE '%Francaise%';
UPDATE salons SET description = REPLACE(description, 'Francais', 'Français') WHERE description LIKE '%Francais%';
UPDATE salons SET description = REPLACE(description, 'marche', 'marché') WHERE description LIKE '%marche%';
UPDATE salons SET description = REPLACE(description, 'Decouverte', 'Découverte') WHERE description LIKE '%Decouverte%';
UPDATE salons SET description = REPLACE(description, 'emergentes', 'émergentes') WHERE description LIKE '%emergentes%';
UPDATE salons SET description = REPLACE(description, 'fabriques', 'fabriqués') WHERE description LIKE '%fabriques%';
UPDATE salons SET description = REPLACE(description, 'presentes', 'présentés') WHERE description LIKE '%presentes%';
UPDATE salons SET description = REPLACE(description, 'Conferences', 'Conférences') WHERE description LIKE '%Conferences%';
UPDATE salons SET description = REPLACE(description, 'conferences', 'conférences') WHERE description LIKE '%conferences%';
UPDATE salons SET description = REPLACE(description, 'dedies', 'dédiés') WHERE description LIKE '%dedies%';
UPDATE salons SET description = REPLACE(description, 'dediee', 'dédiée') WHERE description LIKE '%dediee%';
UPDATE salons SET description = REPLACE(description, 'Societe', 'Société') WHERE description LIKE '%Societe%';
UPDATE salons SET description = REPLACE(description, 'Anesthesie', 'Anesthésie') WHERE description LIKE '%Anesthesie%';
UPDATE salons SET description = REPLACE(description, 'anesthesie', 'anesthésie') WHERE description LIKE '%anesthesie%';
UPDATE salons SET description = REPLACE(description, 'Reanimation', 'Réanimation') WHERE description LIKE '%Reanimation%';
UPDATE salons SET description = REPLACE(description, 'Reglementation', 'Réglementation') WHERE description LIKE '%Reglementation%';
UPDATE salons SET description = REPLACE(description, 'reglementation', 'réglementation') WHERE description LIKE '%reglementation%';
UPDATE salons SET description = REPLACE(description, 'puericulture', 'puériculture') WHERE description LIKE '%puericulture%';
UPDATE salons SET description = REPLACE(description, 'bebe', 'bébé') WHERE description LIKE '%bebe%';
UPDATE salons SET description = REPLACE(description, 'interieur', 'intérieur') WHERE description LIKE '%interieur%';
UPDATE salons SET description = REPLACE(description, 'interieure', 'intérieure') WHERE description LIKE '%interieure%';
UPDATE salons SET description = REPLACE(description, 'revetement', 'revêtement') WHERE description LIKE '%revetement%';
UPDATE salons SET description = REPLACE(description, 'decoration', 'décoration') WHERE description LIKE '%decoration%';
UPDATE salons SET description = REPLACE(description, 'ceramique', 'céramique') WHERE description LIKE '%ceramique%';
UPDATE salons SET description = REPLACE(description, 'competences', 'compétences') WHERE description LIKE '%competences%';
UPDATE salons SET description = REPLACE(description, 'pedagogique', 'pédagogique') WHERE description LIKE '%pedagogique%';
UPDATE salons SET description = REPLACE(description, 'strategies', 'stratégies') WHERE description LIKE '%strategies%';
UPDATE salons SET description = REPLACE(description, 'elevateurs', 'élévateurs') WHERE description LIKE '%elevateurs%';
UPDATE salons SET description = REPLACE(description, 'entrepots', 'entrepôts') WHERE description LIKE '%entrepots%';
UPDATE salons SET description = REPLACE(description, 'Mediterranee', 'Méditerranée') WHERE description LIKE '%Mediterranee%';
UPDATE salons SET description = REPLACE(description, 'connectee', 'connectée') WHERE description LIKE '%connectee%';
UPDATE salons SET description = REPLACE(description, 'esthetique', 'esthétique') WHERE description LIKE '%esthetique%';
UPDATE salons SET description = REPLACE(description, 'aerosol', 'aérosol') WHERE description LIKE '%aerosol%';
UPDATE salons SET description = REPLACE(description, 'surete', 'sûreté') WHERE description LIKE '%surete%';
UPDATE salons SET description = REPLACE(description, 'Videosurveillance', 'Vidéosurveillance') WHERE description LIKE '%Videosurveillance%';
UPDATE salons SET description = REPLACE(description, 'videosurveillance', 'vidéosurveillance') WHERE description LIKE '%videosurveillance%';
UPDATE salons SET description = REPLACE(description, 'embarquee', 'embarquée') WHERE description LIKE '%embarquee%';
UPDATE salons SET description = REPLACE(description, 'Organisee', 'Organisée') WHERE description LIKE '%Organisee%';
UPDATE salons SET description = REPLACE(description, 'engagees', 'engagées') WHERE description LIKE '%engagees%';
UPDATE salons SET description = REPLACE(description, 'speciales', 'spéciales') WHERE description LIKE '%speciales%';
UPDATE salons SET description = REPLACE(description, 'managees', 'managées') WHERE description LIKE '%managees%';
UPDATE salons SET description = REPLACE(description, 'integrateurs', 'intégrateurs') WHERE description LIKE '%integrateurs%';
UPDATE salons SET description = REPLACE(description, 'Chaudieres', 'Chaudières') WHERE description LIKE '%Chaudieres%';
UPDATE salons SET description = REPLACE(description, 'chaudieres', 'chaudières') WHERE description LIKE '%chaudieres%';
UPDATE salons SET description = REPLACE(description, 'Aeronautique', 'Aéronautique') WHERE description LIKE '%Aeronautique%';
UPDATE salons SET description = REPLACE(description, 'Defense', 'Défense') WHERE description LIKE '%Defense%';
UPDATE salons SET description = REPLACE(description, 'defense', 'défense') WHERE description LIKE '%defense%';
UPDATE salons SET description = REPLACE(description, 'Securite', 'Sécurité') WHERE description LIKE '%Securite%';
UPDATE salons SET description = REPLACE(description, 'medicaux', 'médicaux') WHERE description LIKE '%medicaux%';
UPDATE salons SET description = REPLACE(description, 'Journees', 'Journées') WHERE description LIKE '%Journees%';
UPDATE salons SET description = REPLACE(description, 'Reserv', 'Réserv') WHERE description LIKE '%Reserv%';
UPDATE salons SET description = REPLACE(description, 'independant', 'indépendant') WHERE description LIKE '%independant%';

-- Salon names that have accent issues
UPDATE salons SET name = REPLACE(name, 'Premiere Vision', 'Première Vision') WHERE name LIKE '%Premiere Vision%';
UPDATE salons SET name = REPLACE(name, 'Salon des Energies Renouvelables', 'Salon des Énergies Renouvelables') WHERE name LIKE '%Salon des Energies Renouvelables%';
UPDATE salons SET name = REPLACE(name, 'Salon Energie Habitat', 'Salon Énergie Habitat') WHERE name LIKE '%Salon Energie Habitat%';
UPDATE salons SET name = REPLACE(name, 'Salon de la Copropriete', 'Salon de la Copropriété') WHERE name LIKE '%Salon de la Copropriete%';
UPDATE salons SET name = REPLACE(name, 'Assises Nationales des Dechets', 'Assises Nationales des Déchets') WHERE name LIKE '%Assises Nationales des Dechets%';
UPDATE salons SET name = REPLACE(name, 'EMM - Equipements, Machines, Materiaux', 'EMM - Équipements, Machines, Matériaux') WHERE name LIKE '%EMM - Equipements%';
UPDATE salons SET name = REPLACE(name, 'Bois Energie', 'Bois Énergie') WHERE name LIKE '%Bois Energie%';
UPDATE salons SET name = REPLACE(name, 'Hopital Expo', 'Hôpital Expo') WHERE name LIKE '%Hopital Expo%';
UPDATE salons SET name = REPLACE(name, 'Les Assises de la Securite', 'Les Assises de la Sécurité') WHERE name LIKE '%Les Assises de la Securite%';
UPDATE salons SET name = REPLACE(name, 'JFR - Journees Francophones', 'JFR - Journées Francophones') WHERE name LIKE '%JFR - Journees Francophones%';
UPDATE salons SET name = REPLACE(name, 'l''Aeronautique', 'l''Aéronautique') WHERE name LIKE '%Aeronautique%';
-- Note: 'Energaia' is a brand name, kept as-is

-- ============================================================
-- 3. SALONS — seo_title, seo_description (if populated)
-- ============================================================

-- Apply same accent fixes to SEO fields if they exist
UPDATE salons SET seo_title = REPLACE(seo_title, 'evenement', 'événement') WHERE seo_title LIKE '%evenement%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'securite', 'sécurité') WHERE seo_title LIKE '%securite%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'numerique', 'numérique') WHERE seo_title LIKE '%numerique%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'energie', 'énergie') WHERE seo_title LIKE '%energie%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'batiment', 'bâtiment') WHERE seo_title LIKE '%batiment%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'hotellerie', 'hôtellerie') WHERE seo_title LIKE '%hotellerie%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'cosmetique', 'cosmétique') WHERE seo_title LIKE '%cosmetique%';
UPDATE salons SET seo_title = REPLACE(seo_title, 'sante', 'santé') WHERE seo_title LIKE '%sante%';

UPDATE salons SET seo_description = REPLACE(seo_description, 'evenement', 'événement') WHERE seo_description LIKE '%evenement%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'securite', 'sécurité') WHERE seo_description LIKE '%securite%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'numerique', 'numérique') WHERE seo_description LIKE '%numerique%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'energie', 'énergie') WHERE seo_description LIKE '%energie%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'batiment', 'bâtiment') WHERE seo_description LIKE '%batiment%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'renovation', 'rénovation') WHERE seo_description LIKE '%renovation%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'amenagement', 'aménagement') WHERE seo_description LIKE '%amenagement%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'hotellerie', 'hôtellerie') WHERE seo_description LIKE '%hotellerie%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'cosmetique', 'cosmétique') WHERE seo_description LIKE '%cosmetique%';
UPDATE salons SET seo_description = REPLACE(seo_description, 'sante', 'santé') WHERE seo_description LIKE '%sante%';

-- ============================================================
-- 4. SECTORS — seo_title, seo_description (if populated)
-- ============================================================

UPDATE sectors SET seo_title = REPLACE(seo_title, 'Energie', 'Énergie') WHERE seo_title LIKE '%Energie%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Securite', 'Sécurité') WHERE seo_title LIKE '%Securite%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Numerique', 'Numérique') WHERE seo_title LIKE '%Numerique%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Sante', 'Santé') WHERE seo_title LIKE '%Sante%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Cosmetique', 'Cosmétique') WHERE seo_title LIKE '%Cosmetique%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Hotellerie', 'Hôtellerie') WHERE seo_title LIKE '%Hotellerie%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Decoration', 'Décoration') WHERE seo_title LIKE '%Decoration%';
UPDATE sectors SET seo_title = REPLACE(seo_title, 'Defense', 'Défense') WHERE seo_title LIKE '%Defense%';

UPDATE sectors SET seo_description = REPLACE(seo_description, 'securite', 'sécurité') WHERE seo_description LIKE '%securite%';
UPDATE sectors SET seo_description = REPLACE(seo_description, 'energie', 'énergie') WHERE seo_description LIKE '%energie%';
UPDATE sectors SET seo_description = REPLACE(seo_description, 'numerique', 'numérique') WHERE seo_description LIKE '%numerique%';
UPDATE sectors SET seo_description = REPLACE(seo_description, 'cosmetique', 'cosmétique') WHERE seo_description LIKE '%cosmetique%';
UPDATE sectors SET seo_description = REPLACE(seo_description, 'hotellerie', 'hôtellerie') WHERE seo_description LIKE '%hotellerie%';

-- ============================================================
-- 5. PROVIDERS — description (fix any missing accents)
-- Note: most provider descriptions already have accents,
-- but apply defensively in case of any misses
-- ============================================================

UPDATE providers SET description = REPLACE(description, 'evenement', 'événement') WHERE description LIKE '%evenement%';
UPDATE providers SET description = REPLACE(description, 'equipement', 'équipement') WHERE description LIKE '%equipement%';
UPDATE providers SET description = REPLACE(description, 'securite', 'sécurité') WHERE description LIKE '%securite%';
UPDATE providers SET description = REPLACE(description, 'numerique', 'numérique') WHERE description LIKE '%numerique%';
UPDATE providers SET description = REPLACE(description, 'reference', 'référence') WHERE description LIKE '%reference%';
UPDATE providers SET description = REPLACE(description, 'specialise', 'spécialisé') WHERE description LIKE '%specialise%';
UPDATE providers SET description = REPLACE(description, 'hotellerie', 'hôtellerie') WHERE description LIKE '%hotellerie%';
UPDATE providers SET description = REPLACE(description, 'batiment', 'bâtiment') WHERE description LIKE '%batiment%';
UPDATE providers SET description = REPLACE(description, 'renovation', 'rénovation') WHERE description LIKE '%renovation%';
UPDATE providers SET description = REPLACE(description, 'amenagement', 'aménagement') WHERE description LIKE '%amenagement%';
UPDATE providers SET description = REPLACE(description, 'hebergement', 'hébergement') WHERE description LIKE '%hebergement%';
UPDATE providers SET description = REPLACE(description, 'cosmetique', 'cosmétique') WHERE description LIKE '%cosmetique%';
UPDATE providers SET description = REPLACE(description, 'energetique', 'énergétique') WHERE description LIKE '%energetique%';

COMMIT;
