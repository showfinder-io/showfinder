-- Champs pour le tracking du scraper
ALTER TABLE salons ADD COLUMN IF NOT EXISTS source_url VARCHAR;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS last_scraped_at TIMESTAMPTZ;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS scraper_conflicts JSONB;
