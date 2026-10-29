# CTR prestataires et lieux : progress

## Tâche

Comprendre pourquoi `/prestataires/*` et `/lieux/*` (et `/en/...`) ont des impressions mais presque aucun clic, puis corriger. Chantier 2 sur 5 du plan trafic (objectif 10 000 sessions GA4 / 28 j). Hors périmètre : `/salons/*` (chantiers 1 et 3).

## Mesure de référence (GSC, 2026-09-30 au 2026-10-27, dataState final)

Méthode : API Search Analytics, `sc-domain:agoris.io`, filtre page regex `agoris\.io(/en)?/prestataires/` et `agoris\.io(/en)?/lieux/` (le slash final exclut les index `/prestataires` et `/lieux`, d'où 8 614 contre 8 839 dans le brief qui les incluait). Agrégat par page (dimension `page`). Script : `tasks/ctr-prestataires-lieux/gsc-export.mjs`, à relancer tel quel à J+28 avec les nouvelles dates.

| Gabarit | Pages | Impressions | Clics | CTR | Position moy. |
|---|---|---|---|---|---|
| prestataires FR | 15 | 6467 | 11 | 0,17 % | 28,8 |
| prestataires EN | 16 | 2236 | 2 | 0,09 % | 29,4 |
| **prestataires total** | 31 | **8703** | **13** | **0,15 %** | 29,0 |
| lieux FR | 34 | 5301 | 28 | 0,53 % | 14,5 |
| lieux EN | 37 | 3313 | 12 | 0,36 % | 12,1 |
| **lieux total** | 71 | **8614** | **40** | **0,46 %** | 13,6 |
| Site entier | | 202043 | 2357 | 1,17 % | 11,4 |

20 pages les plus vues des deux gabarits :

| # | Page | Impressions | Clics | CTR | Position |
|---|---|---|---|---|---|
| 1 | `/prestataires/standistes` | 1112 | 2 | 0,18 % | 45,4 |
| 2 | `/prestataires/location-mobilier-evenementiel` | 1079 | 0 | 0,00 % | 23,2 |
| 3 | `/prestataires/prestataires-audiovisuel-paris` | 862 | 1 | 0,12 % | 57,1 |
| 4 | `/prestataires/standistes-lyon` | 853 | 1 | 0,12 % | 24,3 |
| 5 | `/en/prestataires/standistes` | 848 | 1 | 0,12 % | 48,5 |
| 6 | `/lieux/meett-toulouse` | 670 | 2 | 0,30 % | 12,7 |
| 7 | `/en/prestataires/standistes-lyon` | 659 | 0 | 0,00 % | 12,4 |
| 8 | `/lieux/paris-nord-villepinte` | 654 | 1 | 0,15 % | 21,2 |
| 9 | `/lieux/parc-expo-chalons` | 616 | 4 | 0,65 % | 8,5 |
| 10 | `/lieux/grande-halle-d-auvergne` | 580 | 5 | 0,86 % | 11,2 |
| 11 | `/prestataires/design-location` | 562 | 0 | 0,00 % | 12,8 |
| 12 | `/en/lieux/paris-le-bourget` | 534 | 1 | 0,19 % | 11,2 |
| 13 | `/lieux/fiera-milano` | 455 | 6 | 1,32 % | 15,5 |
| 14 | `/prestataires/standistes-paris` | 439 | 2 | 0,46 % | 45,2 |
| 15 | `/en/lieux/grande-halle-villette` | 422 | 1 | 0,24 % | 10,5 |
| 16 | `/en/lieux/fiera-milano` | 421 | 3 | 0,71 % | 9,4 |
| 17 | `/en/lieux/paris-nord-villepinte` | 413 | 2 | 0,48 % | 11,7 |
| 18 | `/lieux/eurexpo-lyon` | 389 | 2 | 0,51 % | 20,7 |
| 19 | `/en/lieux/paris-expo-porte-de-versailles` | 378 | 1 | 0,26 % | 14,5 |
| 20 | `/prestataires/alises` | 334 | 0 | 0,00 % | 7,9 |

Visibilité des requêtes : prestataires 6 944 impressions sur 8 703 rattachées à une requête (80 %), lieux 2 942 sur 8 614 (34 %, le reste est anonymisé par Google). Le diagnostic lieux portera donc sur un tiers du volume.

## Premières lectures (assumées, à confirmer au diagnostic)

1. **Hubs prestataires (standistes, AV, mobilier) : problème de position, pas de CTR.** Position 23 à 57 sur des requêtes génériques ("standiste", "standiste paris", "prestataire audiovisuel"). En page 3 à 6, un CTR proche de zéro est normal ; le title n'y changera presque rien.
2. **Fiches prestataires (design-location, alises, novelty, aliance, aktuel) : requêtes de marque.** Position 6 à 13 sur le nom de l'entreprise : l'internaute veut le site officiel, qui est n°1. CTR faible structurel.
3. **`/en/prestataires/standistes-lyon` : vrai problème de snippet.** Position 8 à 10 sur "exhibition stand builders in lyon" et variantes, ~500 impressions, 0 clic.
4. **Lieux : requêtes de navigation vers le lieu** ("parc des expositions chalons en champagne", "grande halle de la villette") en position 8 à 12, derrière le site officiel. Une part des requêtes cherche "quels salons ici" ("salon villepinte", "montpellier salon", "salon grande halle d'auvergne") ou l'adresse ("meett adresse") : le title "Salons à X, Ville" y répond partiellement, le snippet est la description longue.
5. Mobile quasi absent côté prestataires (788 impressions sur 6 944 visibles, 0 clic).

## Critères de fin

1. Diagnostic écrit dans `tasks/ctr-prestataires-lieux/diagnostic.md` : pour chaque gabarit et langue, répartition des impressions par intention de requête (cherche un prestataire, cherche un lieu ou un accès, cherche un salon, marque d'un prestataire, hors sujet), par tranche de position et par appareil, avec le CTR de chaque case. Classement des requêtes fait par Jev, pas par LLM.
2. Chaque hypothèse (requête hors sujet, title/snippet, position) marquée confirmée ou réfutée avec le chiffre qui la tranche.
3. Liste de corrections chiffrées (gain attendu en clics/28 j, hypothèse de CTR cible explicite), validée par Julien avant implémentation.
4. Corrections implémentées en chaîne complète : messages FR et EN dans `messages/`, colonnes `_en` si contenu en base (migration SQL si schéma touché, `scripts/test-salons-public-access.mts` si droits touchés), aucune modification de `/salons/*`.
5. `npm run build` vert, PR vers main avec `--body-file`, CI verte, squash-merge, déploiement prod constaté via statut Vercel du commit.
6. Vérification en prod des titles/meta modifiés sur au moins 5 pages des 20 ci-dessus (FR et EN).
7. Ligne dans `tasks/todo.md` : mesure J+28 après la date de déploiement, même script, même filtre, mêmes 20 pages, comparée à cette référence. Critère de succès de la mesure : CTR des pages à position stable (écart < 2 places) en hausse, clics totaux des deux gabarits au-dessus de 53.

## Plan

1. Validation de ce document par Julien. **(validé 2026-10-29)**
2. Diagnostic : export query x page x appareil, classement d'intention par Jev (skill `typesafe:typesafe-ai`), croisement intention x position x CTR. Comparer avec la courbe de CTR par position du reste du site (salons) pour distinguer "position basse" et "snippet faible".
   - Passe par Jev : le classement d'intention de chaque requête (décision typée à 5 classes).
   - Ne passe pas par Jev : la collecte GSC (API), les agrégats (calcul déterministe), la rédaction des titles/meta (rédaction).
3. Propositions chiffrées : gabarit de title/meta lieux et prestataires, contenu des hubs, noindex ou canonical des fiches pauvres, maillage salons vers lieux et hubs (côté composants partagés, sans toucher aux pages salons si possible ; à arbitrer si nécessaire).
4. Implémentation, build, PR, merge, vérif prod.
5. Ligne J+28 dans `tasks/todo.md`.

## Propositions (validées par Julien le 2026-10-29 : P1, P2, P3)

Diagnostic complet : `diagnostic.md`. Hypothèses : requêtes hors sujet réfuté (99 % des impressions sont dans le sujet de la page) ; position trop basse confirmé pour les hubs (84 % des impressions FR au-delà de la 20e place) ; snippet faible confirmé sur trois segments, à petite échelle.

| # | Correction | Chiffre qui la motive | Gain estimé / 28 j | Coût |
|---|---|---|---|---|
| P1 | Gabarit title + meta des lieux (FR et EN) : `{nom}{, ville si absente du nom} : salons {n à venir}, accès et halls`, meta qui commence par le nombre de salons à venir et le prochain salon (données en base uniquement), puis la description. Les 2 overrides `seo_title_en` restent prioritaires. | Lieux, requêtes "le lieu", positions 1 à 20 : 1 539 impressions, 2 clics, 8,5 attendus. 20 titles sur 38 répètent la ville, 7 dépassent 60 caractères | +5 à +15 | Code (`lieux/[slug]/page.tsx`) + messages FR/EN |
| P2 | Titles et metas EN des 3 hubs standistes : "Exhibition stand builders in Lyon / Paris / France", nombre de standistes listés dans la meta | Hubs EN positions 1 à 10 : 563 impressions, 0 clic, 3,7 attendus ; 552 de ces impressions sont des requêtes "exhibition stand builders/contractors" | +3 à +5 | Migration de données sur `provider_hubs.seo_title_en` / `seo_description_en` |
| P3 | Maillage lieux vers hubs : sur chaque fiche lieu, un bloc "Prestataires pour exposer ici" qui pointe vers les hubs du département du lieu (Paris IDF vers standistes-paris et audiovisuel-paris, Lyon vers standistes-lyon), plus les hubs nationaux | Hubs FR à la position 41,8 (3 148 impressions sur 3 740 au-delà de la 20e place). Aujourd'hui, seul le drawer prestataires des salons et `/prestataires` font des liens vers les hubs | Non chiffrable avant coup : se mesure en position des hubs à J+28 | Composant + messages FR/EN, aucune page salon touchée |
| Non | Pas de noindex ni de canonical | Pas de requêtes hors sujet ; les fiches prestataires sortent en position 9,2 sur leur marque | | |
| Non | Pas de retouche des titles des fiches prestataires | 981 impressions de marque en top 10 : le site officiel est n°1, au mieux +4 clics | | |

Ordre de grandeur honnête : P1 + P2 valent +10 à +20 clics / 28 j. Ce gabarit ne fera pas l'objectif des 10 000 sessions par le CTR ; P3 vise la position des hubs, qui est le seul levier de volume ici.

## Fait

- 2026-10-29 : export GSC de référence (`gsc-export.mjs`), chiffres ci-dessus.
- 2026-10-29 : diagnostic (`diagnostic.md`), classement d'intention par Jev sur 1 532 couples requête x page (`scripts/diag-ctr-prestataires-lieux-jev.ts`, sortie dans `audits/ctr-prestataires-lieux-2026-10-29/`, dossier ignoré par git, données locales).
- 2026-10-29 : P1 (`src/app/[locale]/lieux/[slug]/page.tsx`, `messages/*/venues.json`), P2 (migration `20261029120000_provider_hubs_seo_en_exhibition.sql`), P3 (`getHubsForVenueDepartment` dans `src/lib/provider-hubs.ts`, bloc sur la fiche lieu). `npm run build` vert. Vérifié en local (`next start`) : titles/metas FR et EN de 8 lieux, liens vers les hubs du bon département (Paris IDF : standistes-paris + audiovisuel-paris + mobilier ; Lyon : standistes-lyon + mobilier ; Fiera Milano : aucun), rendu mobile 375 px correct.
- 2026-10-29 : mesure J+28 inscrite dans `tasks/todo.md`.

## Décisions

- 2026-10-29 : Julien valide critères de fin et plan.
- 2026-10-29 (message du chantier 1, test CTR 48) : les pages `/lieux/parc-expo-chalons`, `/lieux/grande-halle-d-auvergne`, `/en/lieux/paris-le-bourget` relèvent de ce chantier. Les 38 fiches salons de `tasks/ctr-test-48/groupes.json` (branche `claude/jz-ctr-test-48-fa3e32`) sont gelées jusqu'à leur mesure J+28 : ne pas toucher à leurs seo_title, seo_description, colonnes _en, MDX. P1 à P3 ne touchent aucune donnée salon ; P1 affiche le nombre et le prochain salon d'un lieu en lecture seule.

## Problèmes ouverts

- 66 % des impressions lieux sans requête visible : le diagnostic lieux est partiel.

## Prochaine action

PR, CI verte, merge, migration P2 appliquée en base, vérification prod.
