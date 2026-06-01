-- ============================================================
-- Cohorte 5 — orphelins : 2 fiches MDX produites en batch 2/4
-- non couvertes par 20260601200000_cohorte5_salons.sql
-- ============================================================
-- Conventions identiques à 20260601200000_cohorte5_salons.sql :
--  - status = 'published'
--  - ON CONFLICT (slug) DO NOTHING (migration idempotente)
--  - venue_id : Paris Expo Porte de Versailles (déjà en DB)

BEGIN;

-- ============================================================
-- MODE / TEXTILE
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('whos-next-paris-2026', 'Who''s Next', 2026, 'Salon historique de la mode féminine prêt-à-porter, créé en 1994 par WSN Développement, édition automne 2026 à Paris Expo Porte de Versailles Hall 7. Bilan cluster janvier 2026 : 1 760 marques exposantes (1 200 Who''s Next), 38 000 visiteurs uniques (+5 % vs septembre 2025).', '2026-09-05', '2026-09-07', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.whosnext.com', 'WSN Développement', 'bisannuel', 1200, 38000, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AGROALIMENTAIRE (vins et spiritueux)
-- ============================================================

INSERT INTO public.salons (slug, name, edition_year, description, start_date, end_date, city, venue, venue_lat, venue_lng, country, website_url, organizer_name, frequency, estimated_exhibitors, estimated_visitors, status) VALUES
('wine-paris-2027', 'Wine Paris & Vinexpo Paris', 2027, 'Salon B2B leader mondial des vins et spiritueux structuré en 3 univers (Wine Paris, Be Spirits, Be No), édition 2027 à Paris Expo Porte de Versailles. Édition 2026 record : 63 541 professionnels de 169 pays (+20,75 %), 6 537 exposants de 63 pays (+20 %).', '2027-02-15', '2027-02-17', 'Paris', 'Paris Expo Porte de Versailles', 48.8322, 2.2873, 'FR', 'https://www.wineparis.com', 'Vinexposium', 'annuel', 6537, 63541, 'published')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Liaison venue_id
-- ============================================================

UPDATE public.salons SET venue_id = (SELECT id FROM public.venues WHERE slug = 'paris-expo-porte-de-versailles') WHERE slug IN ('whos-next-paris-2026', 'wine-paris-2027');

-- ============================================================
-- Rattachement secteurs
-- ============================================================

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'whos-next-paris-2026'
  AND sec.slug = 'mode-textile'
ON CONFLICT DO NOTHING;

INSERT INTO public.salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id FROM public.salons s, public.sectors sec
WHERE s.slug = 'wine-paris-2027'
  AND sec.slug = 'agroalimentaire'
ON CONFLICT DO NOTHING;

COMMIT;
