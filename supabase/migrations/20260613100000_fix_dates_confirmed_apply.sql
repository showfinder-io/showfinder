-- Correctif : la migration 20260512000003_salon_dates_confirmed.sql a été
-- marquée appliquée dans l'historique mais son DDL n'a jamais tourné en prod
-- (colonne salons.dates_confirmed absente ; la vue salons_ordered, en SELECT
-- s.*, ne l'expose pas, et le bloc "alerte dates à confirmer" de l'app est
-- inerte). Même symptôme que 20260512000002 (category). On ré-exécute le DDL
-- de façon idempotente puis on recrée la vue.
-- Diagnostic : 2026-06-13 (passe éditoriale).

-- 1. Colonne (idempotent). DEFAULT true : les fiches existantes sont
-- considérées comme ayant des dates confirmées (cf. intention d'origine).
ALTER TABLE public.salons
  ADD COLUMN IF NOT EXISTS dates_confirmed BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.salons.dates_confirmed IS
  'Quand false, la fiche salon affiche un bloc "alerte dates à confirmer" pour collecter les emails à notifier dès que les dates seront confirmées.';

-- 2. Recréation de salons_ordered (définition identique à 20260524000001) :
-- le SELECT s.* ré-expanse les colonnes et inclut désormais dates_confirmed
-- (et category, déjà ré-exposée par 20260613000000).
DROP VIEW IF EXISTS public.salons_ordered;

CREATE VIEW public.salons_ordered
WITH (security_invoker = on)
AS
SELECT s.*,
  CASE
    WHEN s.start_date IS NULL THEN '2_'
    WHEN s.start_date >= CURRENT_DATE THEN '0_' || TO_CHAR(s.start_date, 'YYYY-MM-DD')
    ELSE '1_' || LPAD((99999999 - TO_CHAR(s.start_date, 'YYYYMMDD')::INTEGER)::TEXT, 8, '0')
  END AS sort_key,
  lower(unaccent(coalesce(s.name, ''))) AS name_search,
  lower(unaccent(coalesce(s.description, ''))) AS description_search
FROM public.salons s;

GRANT SELECT ON public.salons_ordered TO anon, authenticated;
