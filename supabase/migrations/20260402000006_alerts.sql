CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL,
  alert_type VARCHAR NOT NULL CHECK (alert_type IN ('salon', 'sector')),
  -- For salon alerts: the salon slug
  salon_slug VARCHAR,
  -- For sector alerts: the sector slug
  sector_slug VARCHAR,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure at least one target is set
  CHECK (salon_slug IS NOT NULL OR sector_slug IS NOT NULL)
);

CREATE INDEX idx_alerts_email ON alerts(email);
CREATE INDEX idx_alerts_salon ON alerts(salon_slug) WHERE salon_slug IS NOT NULL;
CREATE INDEX idx_alerts_sector ON alerts(sector_slug) WHERE sector_slug IS NOT NULL;

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
-- Anyone can subscribe
CREATE POLICY "Public can insert alerts" ON alerts FOR INSERT WITH CHECK (true);
-- Users can manage their own alerts by email (simplified, no auth required)
CREATE POLICY "Public can read own alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public can update own alerts" ON alerts FOR UPDATE USING (true);
