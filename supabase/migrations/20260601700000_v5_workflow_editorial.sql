-- ============================================================
-- V5.1 Workflow editorial — schema admin (brief Nicolas juin 2026)
-- ============================================================
-- Ajoute les colonnes necessaires au workflow editorial de gestion
-- des mises a jour de fiches salon :
--  - locked_fields : array JSONB des champs verrouilles (granularite
--    champ vs is_locked boolean au niveau fiche). Le scraper doit
--    respecter ces verrous (skip les champs locked, enrichir les autres).
--  - notes_internes : commentaire admin non publie (arbitrages,
--    informations a valider, alertes a suivre).
--  - last_human_check_at : timestamp du dernier passage humain validant
--    la fiche (sampling 5/semaine).
--  - last_ia_update_at : timestamp du dernier sync scraper.
--  - alert_flag : marqueur de fiche prioritaire pour relecture humaine.
--
-- + Ajout de la valeur 'review' a l'enum salon_status pour modeliser
-- le workflow draft -> review -> published (Nicolas brief §workflow).

-- ============================================================
-- 1. ALTER TYPE salon_status : ajout valeur 'review'
-- ============================================================
-- Note : ALTER TYPE ADD VALUE ne peut pas s'executer dans une
-- transaction. On le met en premier (auto-commit), le reste en BEGIN.

ALTER TYPE salon_status ADD VALUE IF NOT EXISTS 'review' AFTER 'draft';

-- ============================================================
-- 2. Colonnes workflow editorial
-- ============================================================

BEGIN;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS locked_fields JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS notes_internes TEXT;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS last_human_check_at TIMESTAMPTZ;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS last_ia_update_at TIMESTAMPTZ;

ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS alert_flag BOOLEAN NOT NULL DEFAULT false;

-- Index pour sampling (5 fiches not checked since 6 months OR null)
CREATE INDEX IF NOT EXISTS idx_salons_last_human_check_at
  ON public.salons (last_human_check_at NULLS FIRST);

-- Index pour filtrer les fiches flagged en priorite admin
CREATE INDEX IF NOT EXISTS idx_salons_alert_flag
  ON public.salons (alert_flag) WHERE alert_flag = true;

COMMENT ON COLUMN public.salons.locked_fields IS
  'Array JSONB des noms de champs verrouilles. Le scraper skip ces champs et enrichit les autres. Niveau champ vs is_locked boolean au niveau fiche.';

COMMENT ON COLUMN public.salons.notes_internes IS
  'Commentaires admin non publies. Arbitrages, informations a valider, alertes a suivre.';

COMMENT ON COLUMN public.salons.last_human_check_at IS
  'Timestamp du dernier passage humain validant la fiche (sampling editorial 5/semaine).';

COMMENT ON COLUMN public.salons.last_ia_update_at IS
  'Timestamp du dernier sync scraper IA. UPDATE automatique a chaque pipeline run.';

COMMENT ON COLUMN public.salons.alert_flag IS
  'Marqueur de fiche prioritaire pour relecture humaine (drapeau rouge admin).';

COMMIT;
