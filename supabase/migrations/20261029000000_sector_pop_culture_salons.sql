-- Chantier page 2 → page 1 (2026-10-29) : comic-con-france et japan-expo-paris
-- n'avaient aucun secteur, donc ni lien depuis un hub secteur ni bloc
-- « salons similaires ». Rattachement au secteur Art et Culture (conventions
-- de pop culture, catégorie grand public). Idempotent.
INSERT INTO salon_sectors (salon_id, sector_id)
SELECT s.id, sec.id
FROM salons s
CROSS JOIN sectors sec
WHERE s.slug IN ('comic-con-france', 'japan-expo-paris')
  AND sec.slug = 'art-culture'
  AND NOT EXISTS (
    SELECT 1 FROM salon_sectors ss
    WHERE ss.salon_id = s.id AND ss.sector_id = sec.id
  );
