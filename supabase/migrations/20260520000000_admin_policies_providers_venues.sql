-- ============================================================
-- Fix admin : RLS policies INSERT/UPDATE/DELETE manquantes
-- sur providers et venues (cf. admin_features.sql pour salons).
--
-- Sans ces policies, l'admin connecté est bloqué silencieusement
-- au write par RLS (code Postgres 42501) :
--   "new row violates row-level security policy for table X"
-- Symptômes utilisateur (bug report Nicolas 2026-05-19) :
--   - Impossible de créer un prestataire
--   - Impossible de modifier un prestataire
--   - "Passer Free" ne fonctionne pas (PATCH subscription_tier)
--   - Erreur à la création d'un lieu
--
-- Pattern : strictement identique à admin_features.sql/salons —
-- admin OU editor pour INSERT/UPDATE, admin seul pour DELETE.
-- ============================================================

-- ---------- providers ----------

CREATE POLICY "Admins can insert providers"
  ON providers FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update providers"
  ON providers FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete providers"
  ON providers FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ---------- venues ----------

CREATE POLICY "Admins can insert venues"
  ON venues FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update venues"
  ON venues FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete venues"
  ON venues FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
