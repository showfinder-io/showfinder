-- ============================================================
-- Signaux mineurs audit sectoriel : mentions explicites
-- ============================================================
-- L'audit a releve bijouterie-horlogerie (4 sources) et nautisme comme
-- themes a nommer dans les descriptions existantes, sans creer de secteur.
-- Correction des accents manquants au passage.
--
-- ROLLBACK :
--   UPDATE sectors SET description = 'Mode, prêt-à-porter, textile, accessoires, luxe' WHERE slug = 'mode-textile';
--   UPDATE sectors SET description = 'Equipements sportifs, outdoor, loisirs, fitness, materiel running' WHERE slug = 'sport-outdoor';
-- ============================================================

BEGIN;

UPDATE sectors
SET description = 'Mode, prêt-à-porter, textile, accessoires, bijouterie-horlogerie, luxe'
WHERE slug = 'mode-textile';

UPDATE sectors
SET description = 'Équipements sportifs, outdoor, nautisme, loisirs, fitness, matériel running'
WHERE slug = 'sport-outdoor';

COMMIT;
