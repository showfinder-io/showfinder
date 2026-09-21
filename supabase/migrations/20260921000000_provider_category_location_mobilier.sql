-- =============================================================
-- Nouvelle catégorie de prestataire : location de mobilier
-- =============================================================
-- Demande Nicolas du 2026-09-20 (import LEADS France + Prestalians) :
-- 5 loueurs de mobilier événementiel ne rentrent dans aucune catégorie existante.
-- Idempotent. L'import des données passe par scripts/diag-import-providers-apply.ts.

alter type provider_category add value if not exists 'location_mobilier';
