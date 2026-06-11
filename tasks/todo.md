# SEO : maillage interne + correctifs techniques (2026-06-11)

Audit via skill seo-geo. Base technique saine (canonicals 80%, sitemap filtré qualité, JSON-LD Event/Place/Breadcrumb). Chantier : maillage interne entre fiches + trous techniques.

## Maillage interne

- [x] Footer : ajouter lien /secteurs dans la colonne Produit (absent, alors que Salons/Lieux/Prestataires/Blog y sont)
- [x] Fiche salon : ville cliquable vers /villes/[slug] + breadcrumb à 3 niveaux (Salons / Ville / Salon, visuel + JSON-LD)
- [x] Fiche salon : bloc "Explorer" sous Salons similaires (liens hub : tous les salons du secteur, tous les salons de la ville)
- [x] Page ville : bloc secteurs représentés (badges → /secteurs/[slug])
- [x] Page ville : bloc lieux d'exposition de la ville (→ /lieux/[slug]) (nouvelle query getVenuesByCity)
- [x] Page ville : bloc autres villes principales (→ /villes/[slug], pas d'index /villes donc maillage horizontal indispensable)
- [x] Page secteur : bloc villes de la filière (→ /villes/[slug]) + autres filières (→ /secteurs/[slug])
- [x] Page lieu : lien vers la page ville (/villes/[slug])

## Correctifs techniques

- [x] Canonical manquant : /contact, /mentions, /confidentialite, /cookies
- [x] Bug title /contact : "| Agoris" en dur + template root = doublon
- [x] Sitemap : ajouter pages villes (seuil : ≥ 3 salons publiés), pages légales + contact (priority 0.3)
- [x] Pages villes : robots conditionnel (index si ≥ 3 salons, sinon noindex,follow) : cohérent avec la politique qualité du site (salons MDX only, lieux riches only)
- [x] Pages villes : meta description enrichie (nb de salons, promesse)
- [x] JSON-LD ItemList sur pages villes et secteurs (GEO : listes citables par les LLMs)

## Vérification (definition of done)

- [x] npm run build OK : 565 pages SSG, 0 erreur. npm run lint : 0 erreur (32 warnings préexistants)
- [x] Spot-check HTML rendu (serveur prod local, port 3457) :
  - Fiche salon big-data-ai-paris-2026 : 3 liens /villes/paris (breadcrumb + header + explorer), 2 liens /secteurs/tech-numerique, BreadcrumbList JSON-LD à 4 niveaux avec la ville
  - /villes/lyon : 11 badges secteurs, lien lieu, 8 autres villes, ItemList JSON-LD
  - /secteurs/btp-construction : 6 liens villes, bloc autres filières, ItemList JSON-LD
  - /lieux/paris-expo-porte-de-versailles : lien /villes/paris
  - Canonicals présents sur /contact, /mentions, /cookies, /confidentialite ; title contact sans doublon
  - Sitemap : 176 URLs dont pages villes (lyon, paris, nantes, ...) + 4 pages annexes

## Review

- Décision (hypothèse posée, ajustable) : seuil d'indexabilité des pages ville fixé à 3 salons publiés (CITY_INDEX_MIN_SALONS dans lib/config.ts). En dessous : noindex,follow + hors sitemap, pour éviter le thin content. Cohérent avec la politique existante (salons indexables si MDX, lieux si fiche riche, secteurs si MDX).
- Constat data (hors scope, à traiter côté DB) : le sitemap expose /villes/munich (salons étrangers en base ?) et /villes/villepinte distinct de Paris. À harmoniser dans les données salons.city.
- Le canonical homepage rendu sans trailing slash est une normalisation Next (trailingSlash:false) : équivalent strict pour Google sur la racine, pas d'action.
- Pages secteur : la liste des villes est dérivée des salons affichés (pageSize 20 existant). Si une filière dépasse 20 salons, les villes du reste ne sont pas listées : limitation acceptée au POC.
