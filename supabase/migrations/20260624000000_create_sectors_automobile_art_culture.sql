-- ============================================================
-- Nouveaux secteurs : Automobile + Art et Culture
-- ============================================================
-- Arbitrage drive par le volume de requetes Google (DataForSEO, FR) :
--  - Automobile : "salon automobile" + variantes ~8000/mois, requete
--    distincte de la logistique (~90/mois) dont les salons auto etaient
--    orphelins ou mal classes. Secteur a part entiere.
--  - Art et Culture : demande reelle (~5000/mois) concentree dans les
--    niches photo, antiquites, art contemporain, metiers d'art. Le
--    parapluie "culture" seul est faible, le maillage doit pointer vers
--    ces sous-requetes.
--  - Medias / Communication / Edition : ECARTE (0 de volume "salon medias").
--  - Logistique et Transport : intitule conserve (pas de gain SEO a renommer).
--
-- Aucune donnee supprimee. Les tags existants sont conserves (ex : Solutrans
-- reste en Logistique ET gagne Automobile). Migration idempotente : rejouable
-- sans erreur (ON CONFLICT DO NOTHING).
--
-- ROLLBACK :
--   DELETE FROM salon_sectors WHERE sector_id IN
--     (SELECT id FROM sectors WHERE slug IN ('automobile','art-culture'));
--   DELETE FROM salon_sectors WHERE salon_id IN
--     (SELECT id FROM salons WHERE slug IN ('sirha-mediterranee','mipim-cannes','rent'))
--     AND sector_id IN (SELECT id FROM sectors WHERE slug IN ('agroalimentaire','immobilier','tech-numerique'));
--   DELETE FROM sectors WHERE slug IN ('automobile','art-culture');
-- ============================================================

BEGIN;

-- 1) Creation des deux secteurs (description = fallback affiche tant qu'il
--    n'y a pas de passe editoriale MDX, cf S5+).
INSERT INTO sectors (slug, name, description)
VALUES
  ('automobile', 'Automobile',
   'Salons de l''automobile et de la mobilite professionnelle : vehicules, equipementiers, apres-vente, vehicules industriels et utilitaires.'),
  ('art-culture', 'Art et Culture',
   'Salons et foires dedies a l''art, la photographie, l''edition, les antiquites et les metiers d''art.')
ON CONFLICT (slug) DO NOTHING;

-- 2) Rattachement des salons (par slug, sans suppression des tags existants).
--    Helper : insere une paire (salon, secteur) si elle n'existe pas deja.
-- On part des VALUES puis on joint salons et sectors (ordre de JOIN correct :
-- l'alias v doit etre introduit avant d'etre reference).
INSERT INTO salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id
FROM (VALUES
  -- Automobile
  ('mondial-auto-paris',    'automobile'),
  ('equip-auto-paris',      'automobile'),
  ('solutrans',             'automobile'),
  ('autonomy-paris-2026',   'automobile'),
  -- Art et Culture (foires d'art / photo / edition, profil B2B)
  -- NB : Japan Expo et Comic Con NON inclus (pop culture grand public,
  -- hors perimetre B2B du secteur ; candidats a un futur "Loisirs").
  ('paris-photo',           'art-culture'),
  ('salon-photo-paris',     'art-culture'),
  ('festival-livre-paris',  'art-culture'),
  ('art-paris',             'art-culture'),
  -- Orphelins rattaches a des secteurs existants
  ('sirha-mediterranee',    'agroalimentaire'),
  ('mipim-cannes',          'immobilier'),
  ('rent',                  'immobilier'),
  ('rent',                  'tech-numerique')
) AS v(salon_slug, sector_slug)
JOIN salons s ON s.slug = v.salon_slug
JOIN sectors sec ON sec.slug = v.sector_slug
ON CONFLICT (salon_id, sector_id) DO NOTHING;

COMMIT;
