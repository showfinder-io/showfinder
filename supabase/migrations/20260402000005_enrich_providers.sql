-- Enrichissement prestataires : zone d'intervention, lien venues, demandes de devis

-- Zone d'intervention (texte libre : "Île-de-France, Lyon, Marseille")
ALTER TABLE providers ADD COLUMN IF NOT EXISTS zone_intervention TEXT;

-- Association prestataires <-> lieux (un prestataire couvre plusieurs venues)
CREATE TABLE IF NOT EXISTS provider_venues (
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, venue_id)
);

ALTER TABLE provider_venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique provider_venues" ON provider_venues FOR SELECT USING (true);

-- Migration : lier les prestataires existants aux venues de leur ville
INSERT INTO provider_venues (provider_id, venue_id)
SELECT p.id, v.id FROM providers p
JOIN venues v ON LOWER(TRIM(p.city)) = LOWER(TRIM(v.city))
WHERE p.city IS NOT NULL
ON CONFLICT DO NOTHING;

-- Table demandes de devis
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  company_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  salon_name VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture admin quotes" ON quotes FOR SELECT USING (true);
