-- ============================================================
-- Admin features : rôles utilisateurs + protection salons
-- ============================================================

-- Table des rôles utilisateurs
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Verrou manuel sur les fiches salon
ALTER TABLE salons ADD COLUMN is_locked BOOLEAN NOT NULL DEFAULT false;

-- Politiques admin sur la table salons
CREATE POLICY "Admins can insert salons"
  ON salons FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can update salons"
  ON salons FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Admins can delete salons"
  ON salons FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Politiques admin sur la table reports (update pour changer le status)
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'editor'))
  );
