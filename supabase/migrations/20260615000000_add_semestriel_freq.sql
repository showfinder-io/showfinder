-- Ajout de la valeur 'semestriel' à l'enum salon_frequency (décision Julien
-- 2026-06-15 : certains salons ont 2 éditions/an, ex. Congrès HR avril+novembre,
-- non couvert par annuel/bisannuel/triennal/ponctuel).
-- L'usage de la nouvelle valeur se fait hors de cette migration (contrainte
-- Postgres : une valeur d'enum ajoutée ne peut être utilisée dans la même
-- transaction). Appliqué ensuite par script (scripts/diag-arbitrages-apply.ts).
ALTER TYPE public.salon_frequency ADD VALUE IF NOT EXISTS 'semestriel';
