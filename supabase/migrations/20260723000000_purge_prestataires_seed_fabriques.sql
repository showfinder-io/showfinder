-- =============================================================
-- Purge des prestataires fabriqués du seed d'avril 2026
-- =============================================================
-- Contexte : le seed 20260401000003_seed_providers.sql (même époque que la
-- contamination batch2, cf. CLAUDE.md règle 13) mélangeait entreprises réelles
-- et entreprises inventées par LLM (domaines inexistants, téléphones et emails
-- plausibles mais fictifs). Vérification web du 2026-07-23 : fetch de chaque
-- website_url + recherche entreprise. Détail dans tasks/todo.md (volet A).
--
-- 15 entreprises sans aucune existence vérifiable + 3 "divisions" inexistantes
-- de groupes réels (Elior Events, Accor Events Lyon, B&B Hotels Événements).
-- La suppression cascade sur salon_providers et provider_venues (FK on delete cascade).
-- h2o-events-paris est déjà absent de la base : le slug reste dans la liste
-- par exhaustivité vis-à-vis du seed, le delete est alors sans effet.

delete from providers where slug in (
  -- inventés (aucune trace de l'entreprise, domaine inexistant ou parké)
  'stands-plus-lyon',
  'h2o-events-paris',
  'euro-stands-lille',
  'expovista-nantes',
  'atelier-stand-bordeaux',
  'traiteur-lefevre-lyon',
  'gourmet-salon-paris',
  'sono-plus-toulouse',
  'joel-vieillard-paris',
  'evenementiel-photo-paris',
  'studio-lumieres-lyon',
  'flash-expo-lille',
  'transpost-lyon',
  'expo-logistics-paris',
  'salon-hotels-paris',
  -- divisions inexistantes de groupes réels
  'elior-events-paris',
  'accor-events-lyon',
  'bhotel-paris'
);

-- =============================================================
-- Corrections des fiches réelles aux coordonnées fabriquées
-- =============================================================
-- Principe : entreprise réelle conservée, mais toute donnée non vérifiée
-- (téléphone, email inventés par le seed) est mise à null plutôt que corrigée
-- par une autre donnée non sourcée.

-- Potel et Chabot : vraie maison (1820), mais URL du seed fausse.
-- Vrai domaine : poteletchabot.com.
update providers set
  website_url = 'https://www.poteletchabot.com',
  phone = null,
  email = null
where slug = 'potel-et-chabot-paris';

-- Novelty : entreprise réelle (AV événementiel), URL du seed inexistante.
-- Vrai domaine : novelty.fr.
update providers set
  website_url = 'https://www.novelty.fr',
  phone = null,
  email = null
where slug = 'novelty-paris';

-- Magnum : entreprise réelle (AV événementiel) mais basée à Gonesse, pas Lyon,
-- et domaine du seed inexistant. Vrai domaine : magnum.fr.
update providers set
  city = 'Gonesse',
  website_url = 'https://www.magnum.fr',
  phone = null,
  email = null,
  description = 'Prestation technique audiovisuelle pour événements et salons professionnels.',
  description_en = 'Audiovisual technical services for professional trade shows and events.'
where slug = 'magnum-lyon';

-- Expocom : entreprise réelle à Metz mais son métier est la signalétique et
-- l'impression grand format, pas la conception de stands. Le téléphone du seed
-- (préfixe 01 pour Metz) est fabriqué.
update providers set
  category = 'autre',
  description = 'Signalétique et impression grand format pour événements et salons professionnels.',
  description_en = 'Signage and large-format printing for professional trade shows and events.',
  phone = null,
  email = null,
  is_verified = false
where slug = 'expocom-paris';
