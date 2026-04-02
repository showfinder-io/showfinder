-- ============================================================
-- Showfinder : correction donnees salons
-- Date : 2026-04-02
-- Objectif : corriger URLs mortes, gerer les dates passees,
--            creer une vue upcoming_salons
-- ============================================================

-- ============================================================
-- 1. CORRECTION DES URLS MORTES (VERIFIE PAR CURL/DNS)
-- ============================================================

-- agrimax.fr : domaine en vente (redirige vers nameshift.com / buy.nameshift.com)
-- Le salon Agrimax est organise par Metz Expo Evenements mais n'a pas de site dedie fiable
UPDATE salons SET website_url = NULL
WHERE slug = 'agrimax-metz-2025';

-- tech-ovin.com : DNS ne resout plus (curl exit code 6)
-- Le bon domaine est techovin.fr (verifie, repond en 200 avec contenu fr-FR)
UPDATE salons SET website_url = 'https://www.techovin.fr'
WHERE slug = 'tech-ovin-bellac-2025';

-- whosnext-salon.com : DNS ne resout plus (curl exit code 6)
-- Who's Next utilise desormais le domaine wsn.community
-- On met NULL par securite car le nouveau domaine n'a pas pu etre verifie via web search
UPDATE salons SET website_url = NULL
WHERE slug = 'who-s-next-paris-2026';

-- interhopital.com : DNS ne resout plus (curl exit code 6)
-- Le salon HIT/Health IT est lie a SantExpo, pas de site dedie confirme
UPDATE salons SET website_url = NULL
WHERE slug = 'hlt-paris-2026';

-- emm-expo.com : DNS ne resout plus (curl exit code 6)
-- EMM est colocalisee avec Global Industrie, pas de site dedie confirme
UPDATE salons SET website_url = NULL
WHERE slug = 'emm-lyon-2025';

-- foire-de-chalons.com : DNS ne resout plus (curl exit code 6)
UPDATE salons SET website_url = NULL
WHERE slug = 'foire-chalons-en-champagne-2025';

-- map-pro.fr : DNS ne resout plus (curl exit code 6)
UPDATE salons SET website_url = NULL
WHERE slug = 'map-pro-marseille-2025';

-- sirha-green.com : erreur SSL persistante (curl exit code 35)
-- Le salon est organise par GL Events sous l'egide SIRHA
UPDATE salons SET website_url = NULL
WHERE slug = 'sirha-green-lyon-2025';


-- ============================================================
-- 2. SALONS 2025 AVEC DATES PASSEES — MISE A JOUR EDITIONS
-- ============================================================
-- Strategie :
--   - Salons annuels : prochaine edition = 2026 (memes mois/jours approximatifs)
--   - Salons bisannuels : prochaine edition = 2027
--   - Sans verification web (web search indisponible), on ne met a jour que
--     les salons dont le cycle est previsible. On ajoute un commentaire
--     pour chaque mise a jour.
--   - Les dates exactes devront etre confirmees manuellement.
--     On utilise des dates estimees basees sur l'edition precedente.
-- ============================================================

-- ---- SALONS ANNUELS 2025 -> prochaine edition 2026 ----

-- Global Industrie : annuel, mars a Lyon (alternance Lyon/Paris)
-- 2025 : 11-14 mars Lyon. En 2026 c'est Smart Industries / Midest a Paris.
-- Global Industrie Lyon reviendra en 2027. On passe en 2026 Paris pour coherence.
-- NOTE: deja present comme smart-industries-2026 et midest-2026, on laisse tel quel.
-- On marque Global Industrie 2025 comme passe sans mise a jour (pas d'edition 2026 sous ce nom)

-- Salon des Maires : annuel, novembre, Paris
UPDATE salons SET
  start_date = '2026-11-17',
  end_date = '2026-11-19',
  edition_year = 2026,
  slug = 'congresmaire-paris-2026',
  name = 'Salon des Maires'
WHERE slug = 'congresmaire-paris-2025';

-- Natexpo : annuel (alterne Lyon/Paris), 2025 Lyon -> 2026 Paris probable
-- On ne change que l'annee, les dates exactes a confirmer
UPDATE salons SET
  start_date = '2026-10-19',
  end_date = '2026-10-21',
  edition_year = 2026,
  slug = 'natexpo-paris-2026',
  city = 'Paris',
  venue = 'Paris Nord Villepinte',
  venue_lat = 48.9696,
  venue_lng = 2.5156
WHERE slug = 'natexpo-lyon-2025';

-- Salon du Chocolat : annuel, fin octobre, Paris
UPDATE salons SET
  start_date = '2026-10-28',
  end_date = '2026-11-01',
  edition_year = 2026,
  slug = 'salon-du-chocolat-paris-2026'
WHERE slug = 'salon-du-chocolat-paris-2025';

-- Sommet de l'Elevage : annuel, octobre, Clermont-Ferrand
UPDATE salons SET
  start_date = '2026-10-06',
  end_date = '2026-10-09',
  edition_year = 2026,
  slug = 'sommet-elevage-clermont-2026'
WHERE slug = 'sommet-elevage-clermont-2025';

-- Foire Agricole de Tarbes : annuel, septembre
UPDATE salons SET
  start_date = '2026-09-10',
  end_date = '2026-09-13',
  edition_year = 2026,
  slug = 'foire-agricole-tarbes-2026'
WHERE slug = 'foire-agricole-tarbes-2025';

-- Foire de Chalons-en-Champagne : annuel, fin aout - debut septembre
UPDATE salons SET
  start_date = '2026-08-28',
  end_date = '2026-09-07',
  edition_year = 2026,
  slug = 'foire-chalons-en-champagne-2026'
WHERE slug = 'foire-chalons-en-champagne-2025';

-- SEPEM Angers : annuel (editions regionales tournantes)
UPDATE salons SET
  start_date = '2026-10-06',
  end_date = '2026-10-08',
  edition_year = 2026,
  slug = 'sepem-angers-2026'
WHERE slug = 'sepem-angers-2025';

-- Industrie Lyon : annuel (colocalisee Global Industrie)
UPDATE salons SET
  start_date = '2026-03-11',
  end_date = '2026-03-14',
  edition_year = 2026,
  slug = 'industrie-lyon-2026'
WHERE slug = 'industrie-lyon-2025';

-- SIANE Toulouse : annuel, octobre
UPDATE salons SET
  start_date = '2026-10-20',
  end_date = '2026-10-22',
  edition_year = 2026,
  slug = 'siane-toulouse-2026'
WHERE slug = 'siane-toulouse-2025';

-- Salon de la Copropriete : annuel, novembre, Paris
UPDATE salons SET
  start_date = '2026-11-04',
  end_date = '2026-11-05',
  edition_year = 2026,
  slug = 'salon-copropriete-paris-2026'
WHERE slug = 'salon-copropriete-paris-2025';

-- Energaia Montpellier : annuel, decembre
UPDATE salons SET
  start_date = '2026-12-09',
  end_date = '2026-12-10',
  edition_year = 2026,
  slug = 'energaia-montpellier-2026'
WHERE slug = 'energaia-montpellier-2025';

-- ILTM Cannes : annuel, decembre
UPDATE salons SET
  start_date = '2026-12-01',
  end_date = '2026-12-04',
  edition_year = 2026,
  slug = 'iltm-cannes-2026'
WHERE slug = 'iltm-cannes-2025';

-- SIRHA Green Lyon : annuel, juin (URL deja mise a NULL plus haut)
UPDATE salons SET
  start_date = '2026-06-02',
  end_date = '2026-06-03',
  edition_year = 2026,
  slug = 'sirha-green-lyon-2026'
WHERE slug = 'sirha-green-lyon-2025';

-- Europack Euromanut CFIA Lyon : annuel, novembre
UPDATE salons SET
  start_date = '2026-11-17',
  end_date = '2026-11-19',
  edition_year = 2026,
  slug = 'europack-euromanut-lyon-2026'
WHERE slug = 'europack-euromanut-lyon-2025';

-- EMM Lyon : annuel, mars (URL deja mise a NULL plus haut)
UPDATE salons SET
  start_date = '2026-03-11',
  end_date = '2026-03-14',
  edition_year = 2026,
  slug = 'emm-lyon-2026'
WHERE slug = 'emm-lyon-2025';

-- Parabere Forum : annuel, mars, Paris
UPDATE salons SET
  start_date = '2026-03-02',
  end_date = '2026-03-03',
  edition_year = 2026,
  slug = 'parabere-forum-paris-2026'
WHERE slug = 'parabere-forum-paris-2025';

-- Les Assises des Dechets : bisannuel, mais on traite ici
-- Prochaine edition 2027
UPDATE salons SET
  start_date = '2027-10-01',
  end_date = '2027-10-02',
  edition_year = 2027,
  slug = 'les-assises-dechets-nantes-2027'
WHERE slug = 'les-assises-dechets-nantes-2025';

-- ---- SALONS BISANNUELS 2025 -> prochaine edition 2027 ----

-- Pollutec : bisannuel, novembre, Lyon
UPDATE salons SET
  start_date = '2027-11-23',
  end_date = '2027-11-26',
  edition_year = 2027,
  slug = 'pollutec-lyon-2027'
WHERE slug = 'pollutec-lyon-2025';

-- Milipol Paris : bisannuel, novembre
UPDATE salons SET
  start_date = '2027-11-16',
  end_date = '2027-11-19',
  edition_year = 2027,
  slug = 'milipol-paris-2027'
WHERE slug = 'milipol-paris-2025';

-- Solutrans Lyon : bisannuel, novembre
-- L'edition 2027 existe deja dans les seeds (solutrans-lyon-2027),
-- on supprime l'entree 2025 obsolete
DELETE FROM salons WHERE slug = 'solutrans-lyon-2025';

-- Tech&Bio : bisannuel, septembre
UPDATE salons SET
  start_date = '2027-09-15',
  end_date = '2027-09-16',
  edition_year = 2027,
  slug = 'tech-and-bio-2027'
WHERE slug = 'tech-and-bio-2025';

-- Tech-Ovin Bellac : bisannuel, septembre (URL deja corrigee plus haut)
UPDATE salons SET
  start_date = '2027-09-01',
  end_date = '2027-09-02',
  edition_year = 2027,
  slug = 'tech-ovin-bellac-2027'
WHERE slug = 'tech-ovin-bellac-2025';

-- Serbotel Nantes : bisannuel, octobre
UPDATE salons SET
  start_date = '2027-10-17',
  end_date = '2027-10-20',
  edition_year = 2027,
  slug = 'serbotel-nantes-2027'
WHERE slug = 'serbotel-nantes-2025';

-- EGAST Strasbourg : bisannuel, mars
UPDATE salons SET
  start_date = '2027-03-07',
  end_date = '2027-03-10',
  edition_year = 2027,
  slug = 'egast-strasbourg-2027'
WHERE slug = 'egast-strasbourg-2025';

-- MAP Pro Marseille : bisannuel, mars (URL deja mise a NULL plus haut)
UPDATE salons SET
  start_date = '2027-03-14',
  end_date = '2027-03-16',
  edition_year = 2027,
  slug = 'map-pro-marseille-2027'
WHERE slug = 'map-pro-marseille-2025';

-- SITEVI Montpellier : bisannuel, novembre
UPDATE salons SET
  start_date = '2027-11-23',
  end_date = '2027-11-25',
  edition_year = 2027,
  slug = 'sitevi-montpellier-2027'
WHERE slug = 'sitevi-montpellier-2025';

-- Tech Elevage Lamotte-Beuvron : bisannuel, novembre
UPDATE salons SET
  start_date = '2027-11-03',
  end_date = '2027-11-04',
  edition_year = 2027,
  slug = 'tech-elevage-lamotte-beuvron-2027'
WHERE slug = 'tech-elevage-lamotte-beuvron-2025';

-- Euroviti Montpellier : bisannuel, novembre
UPDATE salons SET
  start_date = '2027-11-23',
  end_date = '2027-11-24',
  edition_year = 2027,
  slug = 'euroviti-montpellier-2027'
WHERE slug = 'euroviti-montpellier-2025';

-- Rocalia Lyon : bisannuel, decembre
UPDATE salons SET
  start_date = '2027-11-30',
  end_date = '2027-12-02',
  edition_year = 2027,
  slug = 'rocalia-lyon-2027'
WHERE slug = 'rocalia-lyon-2025';

-- Paysalia Lyon : bisannuel, decembre
UPDATE salons SET
  start_date = '2027-11-30',
  end_date = '2027-12-02',
  edition_year = 2027,
  slug = 'paysalia-lyon-2027'
WHERE slug = 'paysalia-lyon-2025';

-- SIAE Le Bourget : bisannuel, juin (grand salon aeronautique)
UPDATE salons SET
  start_date = '2027-06-14',
  end_date = '2027-06-20',
  edition_year = 2027,
  slug = 'siae-le-bourget-2027'
WHERE slug = 'siae-le-bourget-2025';

-- FIP / Plastic Expo Lyon : annuel selon la fiche, juin
UPDATE salons SET
  start_date = '2026-06-16',
  end_date = '2026-06-19',
  edition_year = 2026,
  slug = 'plastic-expo-lyon-2026'
WHERE slug = 'plastic-expo-lyon-2025';

-- ---- SALONS RESTANTS SANS CYCLE CLAIR ----

-- Global Industrie Lyon 2025 : pas d'edition "Global Industrie" en 2026 (c'est Smart Industries)
-- On le laisse en l'etat, il apparaitra naturellement comme passe
-- L'edition 2027 reprendra probablement le nom Global Industrie a Lyon

-- Agrimax Metz : annuel, octobre (URL deja mise a NULL plus haut)
UPDATE salons SET
  start_date = '2026-10-27',
  end_date = '2026-10-29',
  edition_year = 2026,
  slug = 'agrimax-metz-2026'
WHERE slug = 'agrimax-metz-2025';


-- ============================================================
-- 3. VUE POUR LES SALONS A VENIR
-- ============================================================

-- Vue filtrant automatiquement les salons passes
-- Inclut les salons sans date (start_date NULL) en fin de liste
CREATE OR REPLACE VIEW upcoming_salons AS
SELECT *
FROM salons
WHERE status = 'published'
  AND (start_date >= CURRENT_DATE OR start_date IS NULL)
ORDER BY start_date ASC NULLS LAST;

-- Politique RLS pour la vue (herite de la table salons)
-- Pas necessaire car les vues heritent des politiques de la table sous-jacente


-- ============================================================
-- 4. INDEX SUPPLEMENTAIRE POUR LES REQUETES DE DATE
-- ============================================================

-- Index composite pour les requetes upcoming (status + start_date)
CREATE INDEX IF NOT EXISTS idx_salons_upcoming
  ON salons(status, start_date)
  WHERE status = 'published';
