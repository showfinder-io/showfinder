# Agoris SEO : split canonique/legacy des fiches salon, 09-14, 09-28 et 10-12 (D43)
Date : 2026-10-12. Décision D43 du digest « Analyse SEO hebdo » du 2026-10-12.
Suite de `2026-09-28-split-legacy.md` (D41).

## Commande
```
python3 scripts/analyze_slug_migration.py audits/gsc-baseline-2026-09-14 audits/gsc-baseline-2026-09-28 audits/gsc-baseline-2026-10-12
```
Script exécuté tel quel, non modifié. Périmètre du script : fiches salon FR
(`/salons/<slug>`), hors `/en/`. Fenêtre de la baseline 10-12 :
2026-09-12 → 2026-10-09 (28 jours, `summary.txt`).

## Split canonique / legacy
| Baseline | Canoniques pages / clics / imp | Legacy pages / clics / imp | Part imp legacy |
|---|---|---|---|
| 09-14 | 205 / 918 / 64 328 | 45 / 5 / 368 | 0,6 % |
| 09-28 | 240 / 1 660 / 96 991 | 50 / 27 / 733 | 0,8 % |
| 10-12 | 328 / 1 921 / 118 958 | 43 / 25 / 537 | 0,4 % |

Sur les 25 clics legacy du 10-12, 21 viennent toujours d'une seule URL,
`/salons/congres-hr-paris-2026` (404 impressions, position 2,85).

## Ratio canoniques vivantes
« Vivante » = fiche canonique avec impressions > 0 dans la baseline. Les
lignes canoniques du script sont toutes des slugs distincts (328 lignes, 328
slugs).

Sitemap remesuré le 2026-10-12 (`https://www.agoris.io/sitemap.xml`) : 1 020
URLs, 385 `/salons/<slug>` FR, 0 millésimée. **71 de ces 385 fiches ont un
lastmod 2026-10-10**, postérieur à la fin de fenêtre de la baseline 10-12
(2026-10-09) : elles ne pouvaient pas encore cumuler d'impressions sur cette
fenêtre, le ratio sur 385 est donc mécaniquement tiré vers le bas.

| Baseline | Canoniques vivantes | Dénominateur | Ratio | Dont présentes dans le sitemap du 10-12 | Ratio strict |
|---|---|---|---|---|---|
| 09-28 | 240 | 278 (sitemap du 09-28) | 86,3 % | 228 | 82,0 % |
| 10-12 | 328 | 385 (sitemap du 10-12) | 85,2 % | 318 | 82,6 % |

Lecture complémentaire, hors spec : sur les 314 fiches du sitemap du 10-12
dont le lastmod n'est pas 2026-10-10, 314 ont des impressions dans la baseline
10-12 (100 %). 4 des 71 fiches à lastmod 2026-10-10 ont déjà des impressions
(lastmod = dernière modification, pas date de création).

Le « dont présentes dans le sitemap » de la ligne 09-28 est mesuré contre le
sitemap du 10-12 (le D41 donnait 230 contre le sitemap du 09-28).

Canoniques avec impressions au 10-12 mais absentes du sitemap (10) :
`expobiogaz-bordeaux`, `industrie-general-ouest`, `innov-agri-ondes`,
`je-m-export-paris`, `salon-bois-energie`,
`salon-vignerons-ind%C3%A9pendants-paris`, `sepag`, `terres-be-jim`,
`terres-de-Jim`, `transports-publics-paris`. Leur statut HTTP n'a pas été
relevé.

## Contrôle HTTP des URLs legacy (lecture seule)
Relevé par `curl -sI https://www.agoris.io<chemin>` le 2026-10-12, pour chaque
ligne `/salons/*-20XX` de `audits/gsc-baseline-2026-10-12/pages.csv` avec
impressions > 0. 43 lignes pour 40 chemins distincts (variantes sans `www` ou
avec barre oblique finale dans l'export ; toutes relevées sur `www`). La
dernière colonne (réponse de la cible) est un relevé supplémentaire, hors spec.

**Premier saut : 43 sur 43 en 308.** Aucune legacy en 200 ni en 404.

**Cible de la redirection : 35 répondent 200, 6 répondent 308 (chaîne à deux
sauts, arrivée en 200), 2 répondent 404.** (Corrigé le 2026-10-26 : la version
initiale annonçait 34 et 7, le recomptage du tableau ci-dessous donne 35 et 6.)

| URL legacy (export GSC) | clics | imp | pos | code HTTP | Location | réponse de la cible |
|---|---|---|---|---|---|---|
| www/salons/congres-hr-paris-2026 | 21 | 404 | 2,85 | 308 | /salons/congres-hr-paris | 200 |
| www/salons/batibig-nantes-2026 | 1 | 3 | 5,00 | 308 | /salons/batibig-nantes | 404 |
| www/salons/ideobain-2026 | 1 | 3 | 7,33 | 308 | /salons/ideobain | 200 |
| www/salons/jfr-paris-2026 | 1 | 7 | 47,57 | 308 | /salons/jfr-paris | 200 |
| www/salons/solutions-rh-paris-2026 | 1 | 4 | 6,25 | 308 | /salons/solutions-rh | 200 |
| /salons/conext-paris-2026 | 0 | 3 | 2,00 | 308 | /salons/conext-paris | 308 vers /secteurs/franchise-commerce (200) |
| /salons/iftm-top-resa-2026 | 0 | 2 | 15,00 | 308 | /salons/iftm-top-resa | 200 |
| /salons/maison-et-objet-paris-2026 | 0 | 7 | 55,86 | 308 | /salons/maison-objet-paris | 200 |
| /salons/makeup-in-paris-2026 | 0 | 1 | 27,00 | 308 | /salons/makeup-in-paris | 200 |
| /salons/numeriquest-toulouse-2026 | 0 | 1 | 4,00 | 308 | /salons/numeriquest-toulouse | 200 |
| /salons/sitl-paris-2026 | 0 | 1 | 25,00 | 308 | /salons/sitl | 200 |
| /salons/surf-interieur-biarritz-2026 | 0 | 1 | 6,00 | 308 | /salons/surf-interieur-biarritz | 404 |
| www/salons/adf-pcd-paris-2026 | 0 | 1 | 9,00 | 308 | /salons/adf-pcd-paris | 200 |
| www/salons/all4pack-paris-2026 | 0 | 1 | 7,00 | 308 | /salons/all4pack-paris | 200 |
| www/salons/cfia-rennes-2026 | 0 | 2 | 6,50 | 308 | /salons/cfia-rennes | 200 |
| www/salons/cfia-toulouse-2026 | 0 | 8 | 10,25 | 308 | /salons/cfia-toulouse | 200 |
| www/salons/congres-hr-paris-2026/ | 0 | 2 | 1,50 | 308 | /salons/congres-hr-paris | 200 |
| www/salons/equiphotel-paris-2026 | 0 | 1 | 2,00 | 308 | /salons/equip-hotel-paris | 200 |
| www/salons/expobiogaz-bordeaux-2026 | 0 | 4 | 85,75 | 308 | /salons/expobiogaz-bordeaux | 308 vers /salons/expobiogaz (200) |
| www/salons/franchise-expo-paris-2026 | 0 | 2 | 5,50 | 308 | /salons/franchise-expo-paris | 200 |
| www/salons/hyvolution-paris-2026 | 0 | 10 | 50,50 | 308 | /salons/hyvolution-paris | 200 |
| www/salons/iftm-top-resa-2026 | 0 | 3 | 9,00 | 308 | /salons/iftm-top-resa | 200 |
| www/salons/interclima-2026 | 0 | 1 | 6,00 | 308 | /salons/interclima | 200 |
| www/salons/les-assises-de-la-securite-monaco-2026 | 0 | 1 | 8,00 | 308 | /salons/les-assises-de-la-securite-monaco | 200 |
| www/salons/makeup-in-paris-2026 | 0 | 1 | 12,00 | 308 | /salons/makeup-in-paris | 200 |
| www/salons/map-pro-marseille-2027 | 0 | 2 | 3,50 | 308 | /salons/map-pro-marseille | 308 vers /salons/sirha-mediterranee (200) |
| www/salons/nordbat-lille-2026 | 0 | 3 | 10,00 | 308 | /salons/nordbat-lille | 200 |
| www/salons/pcd-congress-paris-2026 | 0 | 1 | 6,00 | 308 | /salons/pcd-congress-paris | 308 vers /salons/adf-pcd-paris (200) |
| www/salons/plastic-expo-lyon-2026 | 0 | 2 | 3,00 | 308 | /salons/plastic-expo-lyon | 200 |
| www/salons/preventica-lyon-2026 | 0 | 1 | 4,00 | 308 | /salons/preventica-lyon | 200 |
| www/salons/produrable-paris-2026 | 0 | 1 | 38,00 | 308 | /salons/produrable-paris | 200 |
| www/salons/salon-habitat-bordeaux-2026 | 0 | 2 | 10,00 | 308 | /salons/salon-habitat-bordeaux | 200 |
| www/salons/salon-habitat-design-lyon-2026 | 0 | 2 | 6,00 | 308 | /salons/salon-habitat-design-lyon | 308 vers /salons/salon-habitat-design-saint-etienne (200) |
| www/salons/salon-hvac-paris-2026 | 0 | 17 | 8,88 | 308 | /salons/interclima | 200 |
| www/salons/sfar-congres-paris-2026 | 0 | 4 | 8,00 | 308 | /salons/sfar-congres-paris | 200 |
| www/salons/siae-le-bourget-2027 | 0 | 15 | 64,60 | 308 | /salons/siae-le-bourget | 200 |
| www/salons/sitevi-montpellier-2027 | 0 | 3 | 4,33 | 308 | /salons/sitevi-montpellier | 200 |
| www/salons/solscope-lyon-2026 | 0 | 3 | 6,67 | 308 | /salons/solscope | 200 |
| www/salons/supply-chain-event-paris-2026 | 0 | 1 | 1,00 | 308 | /salons/supply-chain-event-paris | 200 |
| www/salons/texworld-paris-2026 | 0 | 1 | 9,00 | 308 | /salons/texworld-paris | 200 |
| www/salons/who-s-next-paris-2026 | 0 | 1 | 8,00 | 308 | /salons/whos-next-paris | 200 |
| www/salons/workspace-expo-paris-2026 | 0 | 1 | 25,00 | 308 | /salons/workspace-expo-paris | 200 |
| www/salons/world-of-concrete-europe-paris-2026 | 0 | 3 | 8,33 | 308 | /salons/world-of-concrete-europe-paris | 308 vers /salons/intermat-paris (200) |

`www/` = ligne exportée sur `https://www.agoris.io`, `/` seul = ligne exportée
sur `https://agoris.io`.

### Points relevés
- **2 cibles en 404** (HEAD) : `/salons/batibig-nantes` (déjà relevée au D41)
  et `/salons/surf-interieur-biarritz` (nouvelle). `cycl-eau-vichy-2026`,
  relevée au D41, n'apparaît plus dans l'export 10-12.
- **6 chaînes à deux sauts** : 5 du D41 encore présentes dans l'export
  (`conext-paris`, `expobiogaz-bordeaux`, `map-pro-marseille`,
  `salon-habitat-design-lyon`, `world-of-concrete-europe-paris` ; `biofit-lille`
  n'est plus dans l'export) plus `pcd-congress-paris` (vers `adf-pcd-paris`).

## Verdict D43
Règle : A si part legacy <= 1 % ET ratio 09-28 >= 80 % ET legacy en 301/308 ;
B si part legacy > 1,5 % OU une legacy en 200/404 OU ratio < 75 % ; sinon C.

| Critère | Mesure | Atteint |
|---|---|---|
| Part imp legacy <= 1 % (10-12) | 0,4 % | oui |
| Ratio 09-28 >= 80 % | 86,3 % (240/278) | oui |
| Legacy en 301/308 | 43 sur 43 en 308 | oui |
| Ratio 10-12 (information) | 85,2 % (328/385) | n/a |

**Verdict : A.** Aucune condition de B n'est remplie. Réserve identique au
D41 : le critère ne porte que sur le premier saut, et 2 redirections legacy
aboutissent à une 404.
