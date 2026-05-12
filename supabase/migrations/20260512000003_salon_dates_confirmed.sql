-- Flag indiquant si les dates affichées sur la fiche salon sont définitives (confirmées).
-- Default true : on assume que toutes les fiches existantes ont des dates confirmées
-- (sinon le bloc "alerte dates à confirmer" s'afficherait partout d'un coup).
-- L'admin peut marquer un salon comme dates_confirmed=false quand on a inscrit
-- un salon avec une date provisoire ou TBA.

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS dates_confirmed BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.salons.dates_confirmed IS
  'Quand false, la fiche salon affiche un bloc "alerte dates à confirmer" pour collecter les emails à notifier dès que les dates seront confirmées.';
