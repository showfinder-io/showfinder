-- Données personnelles fermées à la lecture publique (2026-10-03), étape 2.
-- alerts : SELECT et UPDATE USING (true) pour public (la clé anon lisait les
--   e-mails des 23 abonnés et pouvait désactiver n'importe quelle alerte).
-- quotes : « Lecture admin quotes » était USING (true) pour public.
-- reports : lisible par tout utilisateur connecté (e-mail du signalant).
-- Désormais : lecture et modification réservées aux rôles admin et editor ;
-- l'insertion publique (formulaires) est inchangée ; la désinscription passe
-- par alerts_for_email / alert_unsubscribe (20261003010000).

DROP POLICY IF EXISTS "Public can read own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Public can update own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Lecture admin quotes" ON public.quotes;
DROP POLICY IF EXISTS "Authenticated can read reports" ON public.reports;

CREATE POLICY "Lecture admin alerts" ON public.alerts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND (ur.role)::text IN ('admin', 'editor')));
CREATE POLICY "Modification admin alerts" ON public.alerts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND (ur.role)::text IN ('admin', 'editor')));
CREATE POLICY "Lecture admin quotes" ON public.quotes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND (ur.role)::text IN ('admin', 'editor')));
CREATE POLICY "Lecture admin reports" ON public.reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND (ur.role)::text IN ('admin', 'editor')));
