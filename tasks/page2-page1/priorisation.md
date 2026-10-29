# Priorisation : chantier page 2 → page 1

Calculée le 2026-10-29 sur `jev-results.jsonl` (176 couples page × requête, page en 11-20, ≥ 3 impressions, pages modifiables seulement : ni /lieux, ni /prestataires, ni /en). Jugement Jev (`scripts/diag-page2-page1-jev.ts`, jev-latest) : la page répond-elle (oui / partiel / non) et intention (info_salon, liste_salons, prestataire, lieu, edition_passee, autre).

**Potentiel utile** = impressions des requêtes jugées oui ou partiel, hors édition passée et hors autre intention. Total : 1585 impressions sur 1791 jugées, 53 pages.

Répartition des impressions jugées : oui 1096, partiel 619, non 76 ; édition passée 121 ; intention prestataire (« standiste pour le salon X ») 144.

Liens entrants = liens du contenu (hors menu et pied de page) relevés sur les 510 pages FR du sitemap de production le 2026-10-29 (`scripts/diag-page2-page1-inlinks.ts`, `inlinks-2026-10-29.json`). Médiane des fiches salon : 4.

| # | Page | Pot. utile | dont partiel | Imp. page | Pos. | Liens entrants (salons / secteurs / villes / lieux) | Requêtes utiles (imp., pos., verdict) |
|---|---|---|---|---|---|---|---|
| 1 | /salons/siae-le-bourget | 262 | 58 | 2332 | 12.8 | 9 (5 / 2 / 1 / 1) | bourget 2027 (82, 10.7, oui) ; salon bourget 2027 (37, 11.6, oui) ; siae 2027 (32, 10.6, oui) ; standiste pour le salon siae 2027 (22, 17.1, partiel) |
| 2 | /salons/comic-con-france | 215 | 72 | 753 | 20.1 | 2 (0 / 0 / 1 / 1) | comic con france (131, 18.0, oui) ; comic con paris 2026 (65, 18.0, partiel) ; comic convention paris 2026 (7, 11.0, partiel) ; france comic con (6, 13.2, oui) |
| 3 | /secteurs/tech-numerique | 126 | 103 | 608 | 17.5 | 109 (76 / 20 / 12 / 0) | salon digitalisation industrie (24, 18.5, partiel) ; salon digital marketing (18, 16.7, partiel) ; salon marketing digital (14, 17.7, partiel) ; salons digitaux (12, 13.8, oui) |
| 4 | /salons/paris-games-week | 93 | 42 | 2400 | 12.1 | 2 (0 / 0 / 1 / 1) | date pgw (23, 14.6, oui) ; pgw 2026 programme (12, 10.8, partiel) ; pgw dates (12, 10.7, oui) ; programme pgw 2026 (12, 11.8, partiel) |
| 5 | /salons/sfar-congres-paris | 83 | 3 | 309 | 12.8 | 3 (1 / 0 / 1 / 1) | sfar (64, 14.4, oui) ; sfar congres (6, 17.5, oui) ; sfar le congres (4, 18.8, oui) ; congrès anesthésie 2026 (3, 18.3, oui) |
| 6 | /salons/reeduca-paris | 75 | 33 | 277 | 10.7 | 5 (2 / 1 / 1 / 1) | standiste pour le salon reeduca 2026 (25, 14.6, partiel) ; salon reeduca (16, 17.9, oui) ; salon rééduca (14, 17.3, oui) ; reeduca (5, 16.8, oui) |
| 7 | /salons/foire-agricole-tarbes | 71 | 4 | 392 | 10.6 | 2 (0 / 1 / 0 / 1) | foire de tarbes 2027 (19, 10.7, oui) ; foire tarbes 2027 (18, 10.9, oui) ; foire agricole de tarbes 2027 (8, 11.1, oui) ; salon de l agriculture tarbes 2027 (8, 12.0, oui) |
| 8 | /salons/paris-photo | 52 | 0 | 370 | 12.8 | 13 (9 / 1 / 1 / 2) | paris photo dates (18, 10.6, oui) ; date paris photo (14, 13.0, oui) ; paris photo 2026 (12, 16.2, oui) ; dates paris photo 2026 (4, 10.8, oui) |
| 9 | /salons/shop-le-salon | 41 | 0 | 194 | 14.8 | 5 (2 / 1 / 1 / 1) | salon de la plv (22, 20.2, oui) ; salon marketing point de vente (19, 18.7, oui) |
| 10 | /salons/architect-at-work-lyon | 38 | 0 | 197 | 12.8 | 4 (3 / 0 / 1 / 0) | architect work lyon (38, 12.9, oui) |
| 11 | /salons/salon-funeraire | 33 | 21 | 269 | 11.8 | 3 (1 / 0 / 1 / 1) | salon funéraire paris 2026 (21, 11.8, partiel) ; salon du funeraire (12, 16.2, oui) |
| 12 | /salons/milipol-paris | 31 | 20 | 298 | 16.7 | 5 (2 / 1 / 1 / 1) | milipol network (8, 19.1, partiel) ; exposants milipol paris (7, 14.7, partiel) ; milipol paris 2027 (6, 11.5, oui) ; milipol exposant (5, 19.6, partiel) |
| 13 | /salons/learning-technologies-paris | 30 | 22 | 333 | 11.4 | 5 (2 / 1 / 1 / 1) | standiste pour le salon learning & hr 2027 (22, 11.0, partiel) ; e learning technology (4, 18.8, oui) ; salon de la formation et du digital learning (4, 19.8, oui) |
| 14 | /salons/salon-vignerons-independants-paris | 27 | 0 | 665 | 16.6 | 18 (15 / 1 / 1 / 1) | salon des vignerons indépendants paris 2026 (14, 10.6, oui) ; salon des vignerons indépendants paris 2026 porte de versailles (13, 13.8, oui) |
| 15 | /salons/siprho | 26 | 19 | 252 | 10.6 | 4 (1 / 2 / 0 / 1) | standiste salon siprho (19, 17.6, partiel) ; foire de montpellier 2027 (7, 11.1, oui) |
| 16 | /salons/congres-hlm | 20 | 20 | 704 | 10.5 | 3 (0 / 1 / 1 / 1) | standiste pour le congrès hlm h'expo 2026 (20, 17.2, partiel) |
| 17 | /villes/angers | 20 | 0 | 90 | 11.5 | 6 (4 / 2 / 0 / 0) | salon angers (20, 12.1, oui) |
| 18 | /salons/affaire-de-cadeaux | 19 | 16 | 132 | 11.9 | 19 (15 / 2 / 1 / 1) | standiste pour le salon affaires de cadeaux 2026 (16, 18.3, partiel) ; affaire de cadeaux (3, 15.7, oui) |
| 19 | /salons/cprint-lyon | 18 | 0 | 194 | 12 | 6 (1 / 3 / 1 / 1) | cprint lyon (10, 12.8, oui) ; c!print lyon (4, 10.5, oui) ; salon c print (4, 13.5, oui) |
| 20 | /secteurs/agroalimentaire | 18 | 14 | 597 | 15.3 | 82 (47 / 20 / 14 / 0) | liste des salons agroalimentaire 2026 (11, 13.6, partiel) ; salon agroalimentaire 2026 france (4, 10.8, oui) ; salon agroalimentaire france 2026 (3, 17.0, partiel) |
| 21 | /salons/luxe-pack-monaco | 17 | 0 | 291 | 11.8 | 5 (2 / 1 / 1 / 1) | luxepack monaco (9, 17.3, oui) ; emballage monaco (8, 16.0, oui) |
| 22 | /salons/cphi-worldwide | 16 | 11 | 418 | 13.3 | 1 (0 / 0 / 0 / 1) | cphi paris (11, 19.5, partiel) ; cphi messe (5, 15.6, oui) |
| 23 | /villes/lille | 16 | 0 | 53 | 19.7 | 36 (9 / 5 / 21 / 1) | salon lille (9, 16.1, oui) ; salons lille (4, 14.3, oui) ; salons professionnels (3, 12.0, oui) |
| 24 | /salons/salon-tourisme-voyages-lille | 15 | 0 | 272 | 10.6 | 4 (1 / 1 / 1 / 1) | salon du tourisme et des activités nature (15, 13.8, oui) |
| 25 | /secteurs/cosmetique-beaute | 15 | 4 | 181 | 10.5 | 38 (13 / 20 / 4 / 0) | salon industrie cosmétique (11, 16.7, oui) ; salon cosmétique paris (4, 12.5, partiel) |
| 26 | /salons/world-nuclear-exhibition | 14 | 11 | 158 | 15.7 | 3 (0 / 0 / 1 / 1) | wne 2026 (11, 12.5, partiel) ; wne 2027 (3, 14.3, oui) |
| 27 | /salons/congres-adf-paris | 13 | 0 | 264 | 12.7 | 3 (0 / 1 / 1 / 1) | adf paris 2026 (5, 15.6, oui) ; congrès adf 2026 (5, 15.8, oui) ; congres dentaire paris (3, 12.0, oui) |
| 28 | /salons/euromaritime | 13 | 0 | 78 | 11.3 | 3 (0 / 1 / 1 / 1) | euromaritime (10, 15.3, oui) ; salon maritime marseille (3, 14.3, oui) |
| 29 | /salons/innov-agri-ondes | 13 | 13 | 273 | 12.1 | 0 (0 / 0 / 0 / 0) | innov agri 2026 nord (4, 10.5, partiel) ; innov agri 2026 (3, 11.7, partiel) ; innov agri 2026 lieu (3, 10.7, partiel) ; salon innov agri 2026 (3, 11.0, partiel) |
| 30 | /villes/douai | 12 | 0 | 106 | 11.1 | 6 (3 / 2 / 0 / 1) | douai salon (8, 13.1, oui) ; salon a douai (4, 10.8, oui) |
| 31 | /salons/elearning-expo-paris | 11 | 0 | 109 | 16.7 | 7 (4 / 1 / 1 / 1) | salon elearning expo (8, 17.3, oui) ; salon elearning (3, 16.0, oui) |
| 32 | /salons/nordbat-lille | 11 | 0 | 91 | 12.7 | 3 (0 / 1 / 1 / 1) | nordbat (11, 17.8, oui) |
| 33 | /salons/franchise-expo-lyon | 10 | 0 | 333 | 15.7 | 2 (0 / 1 / 1 / 0) | salon de la franchise lyon (7, 20.0, oui) ; franchise city-event (3, 10.7, oui) |
| 34 | /salons/hr-technologies-france | 9 | 0 | 316 | 15.1 | 3 (0 / 1 / 1 / 1) | hr technologie (3, 17.0, oui) ; rh technologies (3, 20.0, oui) ; salon hr tech (3, 20.0, oui) |
| 35 | /salons/produrable-paris | 9 | 0 | 137 | 11.6 | 3 (0 / 1 / 1 / 1) | pro durable (9, 13.1, oui) |
| 36 | /salons/salon-copropriete-paris | 9 | 0 | 361 | 11.6 | 55 (52 / 1 / 1 / 1) | salon de la copropriété 2026 (9, 15.3, oui) |
| 37 | /salons/bepositive-lyon | 8 | 0 | 88 | 13.6 | 6 (3 / 1 / 1 / 1) | bepositive (8, 20.0, oui) |
| 38 | /secteurs/franchise-commerce | 8 | 0 | 214 | 12.8 | 50 (22 / 20 / 7 / 0) | salon retail commercial (8, 20.1, oui) |
| 39 | /salons/cfia-toulouse | 7 | 0 | 282 | 13.9 | 4 (1 / 1 / 1 / 1) | cfia (4, 18.0, oui) ; salon cfia (3, 19.7, oui) |
| 40 | /salons/prodays | 7 | 0 | 164 | 14.9 | 4 (0 / 2 / 1 / 1) | salon du vélo 2027 (7, 10.7, oui) |
| 41 | /secteurs/automobile | 7 | 7 | 45 | 17.9 | 33 (7 / 20 / 5 / 0) | salon carrosserie industrielle (7, 14.9, partiel) |
| 42 | /salons/bau-munich | 5 | 0 | 253 | 14.5 | 3 (0 / 1 / 1 / 1) | bauma 2027 munich (5, 11.0, oui) |
| 43 | /salons/sepem-colmar | 5 | 5 | 214 | 11.4 | 10 (8 / 0 / 1 / 1) | sepem colmar 2026 (5, 11.2, partiel) |
| 44 | /salons/sepem-toulouse | 5 | 0 | 61 | 16.5 | 10 (7 / 1 / 1 / 1) | sepem toulouse (5, 12.4, oui) |
| 45 | /salons/air-drone-bordeaux | 4 | 0 | 367 | 16.7 | 4 (1 / 1 / 1 / 1) | uav show bordeaux (4, 15.8, oui) |
| 46 | /salons/aps-paris | 4 | 0 | 294 | 11.1 | 4 (1 / 1 / 1 / 1) | salon aps (4, 15.0, oui) |
| 47 | /salons/fitex-paris | 4 | 0 | 446 | 11.7 | 3 (0 / 1 / 1 / 1) | salon du fitness paris (4, 16.8, oui) |
| 48 | /salons/mipcom | 4 | 0 | 666 | 13.4 | 6 (4 / 1 / 1 / 0) | mip com (4, 18.0, oui) |
| 49 | /salons/solutions-cse | 4 | 0 | 270 | 16.7 | 3 (0 / 1 / 1 / 1) | salonsce (4, 16.8, oui) |
| 50 | /salons/all4pack-paris | 3 | 0 | 269 | 19.9 | 7 (1 / 3 / 1 / 2) | all 4 pack (3, 12.0, oui) |
| 51 | /salons/it-partners-paris | 3 | 0 | 275 | 12.5 | 2 (0 / 1 / 0 / 1) | itpartners (3, 17.0, oui) |
| 52 | /salons/renodays | 3 | 0 | 83 | 15.5 | 3 (0 / 1 / 1 / 1) | renodays (3, 15.7, oui) |
| 53 | /villes/marseille | 3 | 0 | 67 | 18.3 | 41 (11 / 8 / 21 / 1) | salons professionnels (3, 20.3, oui) |

## Diagnostic du maillage (constaté sur la production le 2026-10-29)

1. **Hub secteur plafonné à 20 salons.** `src/app/[locale]/secteurs/[slug]/page.tsx` appelle `getSalonsBySector(slug)` sans pagination : `pageSize` par défaut 20, tri `sort_key` (à venir d'abord), et aucun lien vers une page 2. Au-delà du 20e salon d'un secteur, la fiche n'a aucun lien depuis son hub. 99 fiches salon n'ont aucun lien entrant depuis une page secteur, dont comic-con-france, paris-games-week, sfar-congres-paris et cphi-worldwide.
2. **« Salons similaires » concentré.** `getSimilarSalons` prend les 3 salons à venir les plus proches dans le temps parmi ceux qui partagent un secteur. Résultat : satis reçoit 80 liens de fiches, euro-industries 79, vrac-tech 79, et 182 fiches n'en reçoivent aucun. Le lien suit le calendrier, pas la proximité thématique.
3. Les pages ville listent tous leurs salons (pas de plafond), d'où au moins un lien ville pour la plupart des fiches.

## Cannibalisation

Pas de cannibalisation à corriger entre fiches. Les recouvrements détectés sont des paires FR/EN (gérées par hreflang), `/villes/paris` sur la requête générique « salons professionnels », et `/salons/innov-agri-ondes` contre `/salons/innovagri`, déjà résolu : l'ancien slug répond 308 vers `/salons/innovagri` (next.config). Levier 3 sans action.
