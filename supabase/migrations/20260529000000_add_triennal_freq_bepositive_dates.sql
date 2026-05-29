-- R15 : ajout de la valeur 'triennal' à l'enum salon_frequency (Intermat,
-- Bauma… ont un cycle de 3 ans, non couvert par annuel/bisannuel/ponctuel).
-- L'usage de la nouvelle valeur se fait dans une migration séparée (contrainte
-- Postgres : une valeur d'enum ajoutée ne peut pas être utilisée dans la même
-- transaction).
ALTER TYPE public.salon_frequency ADD VALUE IF NOT EXISTS 'triennal';

-- R14 : vraie date BePositive 2027 vérifiée sur bepositive-events.com
-- (31 mars-2 avril, et non 23-25 mars). Ne dépend pas de l'enum.
UPDATE public.salons
SET start_date = '2027-03-31', end_date = '2027-04-02'
WHERE slug = 'bepositive-lyon-2027';
