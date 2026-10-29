-- Chantier CTR prestataires (2026-10-29) : titles et metas EN des hubs standistes.
-- GSC 2026-09-30 au 2026-10-27 : les hubs EN en top 10 font 563 impressions et
-- 0 clic, dont 552 sur des requêtes "exhibition stand builders / contractors".
-- Les titles disaient "Stand builders". Effectifs vérifiés en base le 2026-10-29
-- (catégorie standiste, départements du hub) : France 66, Paris IDF 39, Lyon 10.
-- Données uniquement, FR inchangé.

UPDATE provider_hubs SET
  seo_title_en = 'Exhibition stand builders in France: designers and manufacturers',
  seo_description_en = 'Agoris lists 66 exhibition stand builders and contractors in France: design, manufacture and installation of bespoke, modular or traditional trade show stands.'
WHERE slug = 'standistes';

UPDATE provider_hubs SET
  seo_title_en = 'Exhibition stand builders in Paris and Île-de-France',
  seo_description_en = '39 exhibition stand builders and contractors based in Paris and Île-de-France: design, manufacture and assembly of stands for the region''s exhibition centres.'
WHERE slug = 'standistes-paris';

UPDATE provider_hubs SET
  seo_title_en = 'Exhibition stand builders in Lyon: 10 companies listed',
  seo_description_en = '10 exhibition stand builders and contractors based in Lyon, the Ain, Isère and Loire, and what to check before entrusting the construction of your stand.'
WHERE slug = 'standistes-lyon';
