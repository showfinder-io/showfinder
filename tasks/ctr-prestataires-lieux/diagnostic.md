# Diagnostic CTR prestataires et lieux (2026-10-29)

Données : GSC 2026-09-30 au 2026-10-27, `audits/ctr-prestataires-lieux-2026-10-29/gsc-raw.json`. Intentions : Jev (`scripts/diag-ctr-prestataires-lieux-jev.ts`, question Choice à 6 classes, nom de l'entreprise ou du lieu de la page dans l'état), sortie `jev-intents-v2.jsonl`. Une v1 sans nom d'entité classait "design location" (marque, 301 impressions) en requête métier : écartée. 127 couples sur 1 532 ont une confiance < 0,6, surtout des marques peu connues (aktuel, alisés), sans effet sur les conclusions.

Référence "CTR attendu" : courbe CTR x position des fiches `/salons/*` du même site sur la même période (requête x page) : 1-3 : 4,41 % ; 4-5 : 1,67 % ; 6-10 : 0,60 % ; 11-15 : 0,20 % ; 16-20 : 0,86 % ; 21-30 : 0,21 % ; 31-50 : 0,05 % ; 51+ : 0,02 %.

## 1. Les requêtes sont-elles hors sujet ? Réfuté.

| Gabarit | Intention (Jev) | Impressions | Clics |
|---|---|---|---|
| prestataires | cherche un type de prestataire | 5 554 | 1 |
| prestataires | cherche une entreprise par son nom | 1 379 | 3 |
| prestataires | hors sujet + autres | 11 | 0 |
| lieux | cherche le lieu (infos, accès) | 2 400 | 2 |
| lieux | cherche les salons d'un lieu | 441 | 1 |
| lieux | cherche un prestataire | 75 | 0 |
| lieux | hors sujet + organiser un événement | 24 | 0 |

99 % des impressions visibles correspondent à ce que la page traite. Pas de page à désindexer pour cause de requêtes hors sujet.

## 2. La position est-elle trop basse ? Confirmé pour les hubs prestataires, partiel pour les lieux.

| Segment | Impressions | dont position > 20 | Position moy. |
|---|---|---|---|
| Hubs prestataires FR (standistes, mobilier, AV) | 3 740 | 3 148 (84 %) | 41,8 |
| Hubs prestataires EN | 1 642 | 883 (54 %) | 36,2 |
| Lieux FR, requêtes "le lieu" | 1 616 | 667 (41 %) | 21,1 |
| Lieux EN, requêtes "le lieu" | 784 | 194 (25 %) | 17,7 |
| Fiches prestataires FR, requêtes de marque | 1 299 | 68 (5 %) | 9,2 |

Les hubs FR sortent en page 3 à 5 sur "standiste", "standiste paris", "prestataire audiovisuel". À ces positions, les fiches salons font 0,05 % de CTR : un title n'y changera rien.

## 3. Le title ou le snippet est-il en cause ? Confirmé sur 3 segments, à petite échelle.

À position égale, comparé à la courbe des fiches salons :

| Segment (positions 1 à 20) | Impressions | Clics observés | Clics attendus |
|---|---|---|---|
| Hubs EN, positions 1 à 10 (`/en/prestataires/standistes-lyon` surtout) | 563 | 0 | 3,7 |
| Lieux FR + EN, requêtes "le lieu", positions 1 à 20 | 1 539 | 2 | 8,5 |
| Fiches prestataires FR, requêtes de marque, positions 1 à 10 | 981 | 2 | 6,4 |
| Hubs FR, positions 11 à 20 | 558 | 0 | 3,1 |

- **Hubs EN** : 552 des 606 impressions en top 12 viennent de requêtes "exhibition stand builders / contractors / design company in lyon". Le title dit "Stand builders in Lyon: companies listed in the Lyon region" : il ne reprend pas "exhibition", ni la promesse d'une liste.
- **Lieux** : title "Salons à {nom}, {ville}" : 20 des 38 lieux indexables répètent la ville ("Salons à MEETT Toulouse, Toulouse"), 7 dépassent 60 caractères. Le title promet un agenda alors que 85 % de l'intention visible est "le lieu lui-même" (adresse, accès, halls). La meta est la description encyclopédique, sans nombre de salons à venir ni accès, alors que les 38 fiches indexables ont un MDX qui traite l'accès.
- **Fiches prestataires** : l'internaute tape le nom de l'entreprise, son site officiel est n°1. CTR faible structurel ; le gain possible est marginal.

## 4. Appareils

Prestataires : 88 % des impressions sur desktop, 0 clic mobile sur 788 impressions. Lieux : 70 % desktop. Pas de levier spécifique mobile identifié dans les données.

## 5. Angle mort

Même avec un CTR au niveau des fiches salons à position égale, le gain total sur la part visible est d'environ 24 clics / 28 jours (observé 7, attendu 31). Extrapolé aux impressions anonymisées, l'ordre de grandeur reste **+20 à +40 clics / 28 j** pour l'objectif de +5 300 sessions. Le vrai levier de ces gabarits est la position des hubs (84 % des impressions FR en page 3+), pas le snippet.

Pour mémoire, les lieux ne sont pas en retard globalement : 40 clics pour 8 614 impressions (0,46 %) à la position 13,6, et les impressions anonymisées (66 % du total) font 37 clics à 0,65 %.
