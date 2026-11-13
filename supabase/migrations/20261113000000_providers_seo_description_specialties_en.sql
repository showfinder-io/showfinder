-- =============================================================
-- Prestataires : meta description dédiée (FR/EN) et spécialités / zone en anglais
-- =============================================================
-- Relecture du 2026-11-12 (todo G14bis) : la meta description d'une fiche était sa description
-- complète (500 à 700 caractères), tronquée par Google. seo_description(_en) vise 150-160
-- caractères. Relecture de la vague 1 du 2026-11-13 : sur /en, spécialités et zone
-- d'intervention restaient en français, d'où specialties_en et zone_intervention_en.
-- Colonnes publiques comme le reste de la table (policy de lecture publique, droits de table).
-- Additive et idempotente. Données remplies par scripts/diag-providers-seo-en-apply.ts ;
-- tant qu'une colonne est vide, la page retombe sur la version française / la description.

alter table providers add column if not exists seo_description varchar;
alter table providers add column if not exists seo_description_en varchar;
alter table providers add column if not exists specialties_en text[] not null default '{}';
alter table providers add column if not exists zone_intervention_en varchar;
