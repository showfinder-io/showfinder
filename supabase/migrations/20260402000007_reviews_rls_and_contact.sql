-- Reviews RLS : INSERT et UPDATE pour utilisateurs authentifiés
-- (SELECT public déjà créé dans initial_schema)

CREATE POLICY "Authenticated users can insert reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

-- Table messages de contact
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  email varchar NOT NULL,
  subject varchar NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde (y compris anon) d'insérer
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
FOR INSERT WITH CHECK (true);

-- Lecture réservée aux admins (via service role, pas de policy SELECT publique)
