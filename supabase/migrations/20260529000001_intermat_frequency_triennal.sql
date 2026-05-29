-- R15 : correction de la fréquence d'Intermat (était 'ponctuel', le salon est
-- triennal : 2018, 2024, 2027). Transaction séparée de l'ADD VALUE (contrainte
-- Postgres sur l'usage d'une valeur d'enum fraîchement ajoutée).
UPDATE public.salons
SET frequency = 'triennal'
WHERE slug = 'intermat-paris-2027';
