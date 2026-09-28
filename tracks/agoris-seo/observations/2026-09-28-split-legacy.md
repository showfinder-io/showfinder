# Agoris SEO : split canonique/legacy des fiches salon, 09-14 et 09-28 (D41)
Date : 2026-09-28. Décision D41 du digest « Analyse SEO hebdo » du 2026-09-28.

## Commande
```
python3 scripts/analyze_slug_migration.py audits/gsc-baseline-2026-09-14 audits/gsc-baseline-2026-09-28
```
Script exécuté tel quel, non modifié. Arguments : répertoires de baseline.
Périmètre du script : fiches salon FR (`/salons/<slug>`), hors `/en/`.

## Split canonique / legacy
| Baseline | Canoniques pages / clics / imp | Legacy pages / clics / imp | Part imp legacy |
|---|---|---|---|
| 09-14 | 205 / 918 / 64 328 | 45 / 5 / 368 | 0,6 % |
| 09-28 | 240 / 1 660 / 96 991 | 50 / 27 / 733 | 0,8 % |

Sur les 27 clics legacy du 09-28, 21 viennent d'une seule URL,
`/salons/congres-hr-paris-2026` (406 impressions, position 2,88).

## Ratio canoniques vivantes sur 278
Dénominateur : 278 fiches salon FR dans le sitemap, remesuré le 2026-09-28
(`https://www.agoris.io/sitemap.xml` : 796 URLs, 278 `/salons/<slug>` FR,
0 millésimée).

| Baseline | Canoniques avec impressions | Ratio sur 278 | Dont présentes dans le sitemap | Ratio strict sur 278 |
|---|---|---|---|---|
| 09-14 | 205 | 73,7 % | 199 | 71,6 % |
| 09-28 | 240 | 86,3 % | 230 | 82,7 % |

Le ratio du 09-14 est calculé sur le sitemap du 09-28 : le nombre de fiches au
sitemap le 09-14 n'a pas été mesuré, ce ratio est donc un minorant probable et
non une mesure.

Canoniques avec impressions mais absentes du sitemap au 09-28 (10) :
`expobiogaz-bordeaux`, `industrie-general-ouest`, `ish-financfort`,
`je-m-export-paris`, `salon-bois-energie`,
`salon-vignerons-ind%C3%A9pendants-paris`, `sepag`, `terres-be-jim`,
`terres-de-Jim`, `terres-jim`. Leur statut HTTP n'a pas été relevé.

## Contrôle HTTP des URLs legacy (lecture seule)
Relevé par `curl -sI https://www.agoris.io<url>` le 2026-09-28, pour chaque
ligne `/salons/*-20XX` de `audits/gsc-baseline-2026-09-28/pages.csv` avec
impressions > 0. 50 lignes pour 47 chemins distincts : 3 chemins apparaissent
deux fois dans l'export (variante sans `www` ou avec barre oblique finale).
La dernière colonne (réponse de la cible de la redirection) est un relevé
supplémentaire, hors spec de la décision.

**Premier saut : 50 sur 50 en 308.** Aucune legacy en 200 ni en 404.

**Cible de la redirection : 42 répondent 200, 6 répondent 308 (chaîne à
deux sauts, arrivée en 200), 2 répondent 404.**

| URL legacy | clics | imp | pos | code HTTP | Location | réponse de la cible |
|---|---|---|---|---|---|---|
| /salons/congres-hr-paris-2026 | 21 | 406 | 2,88 | 308 | /salons/congres-hr-paris | 200 |
| /salons/adf-pcd-paris-2026 | 1 | 2 | 6,50 | 308 | /salons/adf-pcd-paris | 200 |
| /salons/batibig-nantes-2026 | 1 | 4 | 5,75 | 308 | /salons/batibig-nantes | 404 |
| /salons/cycl-eau-vichy-2026 | 1 | 1 | 2,00 | 308 | /salons/cycl-eau-vichy | 404 |
| /salons/ideobain-2026 | 1 | 3 | 7,33 | 308 | /salons/ideobain | 200 |
| /salons/jfr-paris-2026 | 1 | 23 | 51,91 | 308 | /salons/jfr-paris | 200 |
| /salons/solutions-rh-paris-2026 | 1 | 23 | 7,00 | 308 | /salons/solutions-rh | 200 |
| /salons/conext-paris-2026 | 0 | 3 | 2,00 | 308 | /salons/conext-paris | 308 vers /secteurs/franchise-commerce (200) |
| /salons/iftm-top-resa-2026 | 0 | 6 | 12,50 | 308 | /salons/iftm-top-resa | 200 |
| /salons/maison-et-objet-paris-2026 | 0 | 32 | 58,41 | 308 | /salons/maison-objet-paris | 200 |
| /salons/makeup-in-paris-2026 | 0 | 11 | 13,55 | 308 | /salons/makeup-in-paris | 200 |
| /salons/numeriquest-toulouse-2026 | 0 | 1 | 4,00 | 308 | /salons/numeriquest-toulouse | 200 |
| /salons/all4pack-paris-2026 | 0 | 5 | 16,60 | 308 | /salons/all4pack-paris | 200 |
| /salons/biofit-lille-2026 | 0 | 2 | 8,50 | 308 | /salons/biofit-lille | 308 vers /salons/biofit (200) |
| /salons/cfia-rennes-2026 | 0 | 2 | 6,50 | 308 | /salons/cfia-rennes | 200 |
| /salons/cfia-toulouse-2026 | 0 | 10 | 8,30 | 308 | /salons/cfia-toulouse | 200 |
| /salons/congres-hr-paris-2026 | 0 | 2 | 1,50 | 308 | /salons/congres-hr-paris | 200 |
| /salons/energaia-montpellier-2026 | 0 | 1 | 6,00 | 308 | /salons/energaia-montpellier | 200 |
| /salons/enerj-meeting-lyon-2026 | 0 | 2 | 19,00 | 308 | /salons/enerj-meeting-lyon | 200 |
| /salons/enerj-meeting-paris-2026 | 0 | 4 | 30,50 | 308 | /salons/enerj-meeting-paris | 200 |
| /salons/equiphotel-paris-2026 | 0 | 2 | 21,50 | 308 | /salons/equip-hotel-paris | 200 |
| /salons/expobiogaz-bordeaux-2026 | 0 | 4 | 43,00 | 308 | /salons/expobiogaz-bordeaux | 308 vers /salons/expobiogaz (200) |
| /salons/franchise-expo-paris-2026 | 0 | 4 | 6,75 | 308 | /salons/franchise-expo-paris | 200 |
| /salons/hyvolution-paris-2026 | 0 | 28 | 47,46 | 308 | /salons/hyvolution-paris | 200 |
| /salons/iftm-top-resa-2026 | 0 | 5 | 9,20 | 308 | /salons/iftm-top-resa | 200 |
| /salons/industrie-lyon-2026 | 0 | 1 | 10,00 | 308 | /salons/global-industrie-lyon | 200 |
| /salons/interclima-2026 | 0 | 5 | 19,20 | 308 | /salons/interclima | 200 |
| /salons/interfiliere-paris-2026 | 0 | 4 | 7,00 | 308 | /salons/interfiliere-paris | 200 |
| /salons/les-assises-de-la-securite-monaco-2026 | 0 | 1 | 8,00 | 308 | /salons/les-assises-de-la-securite-monaco | 200 |
| /salons/makeup-in-paris-2026 | 0 | 1 | 11,00 | 308 | /salons/makeup-in-paris | 200 |
| /salons/map-pro-marseille-2027 | 0 | 3 | 4,33 | 308 | /salons/map-pro-marseille | 308 vers /salons/sirha-mediterranee (200) |
| /salons/natexpo-paris-2026 | 0 | 1 | 10,00 | 308 | /salons/natexpo-paris | 200 |
| /salons/nordbat-lille-2026 | 0 | 3 | 10,00 | 308 | /salons/nordbat-lille | 200 |
| /salons/plastic-expo-lyon-2026 | 0 | 2 | 3,00 | 308 | /salons/plastic-expo-lyon | 200 |
| /salons/preventica-lyon-2026 | 0 | 1 | 4,00 | 308 | /salons/preventica-lyon | 200 |
| /salons/produrable-paris-2026 | 0 | 1 | 38,00 | 308 | /salons/produrable-paris | 200 |
| /salons/salon-habitat-bordeaux-2026 | 0 | 4 | 15,00 | 308 | /salons/salon-habitat-bordeaux | 200 |
| /salons/salon-habitat-design-lyon-2026 | 0 | 7 | 12,86 | 308 | /salons/salon-habitat-design-lyon | 308 vers /salons/salon-habitat-design-saint-etienne (200) |
| /salons/salon-hvac-paris-2026 | 0 | 34 | 10,47 | 308 | /salons/interclima | 200 |
| /salons/sepag-2026 | 0 | 3 | 5,33 | 308 | /secteurs/agroalimentaire | 200 |
| /salons/sfar-congres-paris-2026 | 0 | 5 | 8,40 | 308 | /salons/sfar-congres-paris | 200 |
| /salons/siae-le-bourget-2027 | 0 | 46 | 73,85 | 308 | /salons/siae-le-bourget | 200 |
| /salons/siane-toulouse-2026 | 0 | 2 | 10,00 | 308 | /salons/siane-toulouse | 200 |
| /salons/sitevi-montpellier-2027 | 0 | 3 | 4,33 | 308 | /salons/sitevi-montpellier | 200 |
| /salons/solscope-lyon-2026 | 0 | 7 | 6,57 | 308 | /salons/solscope | 200 |
| /salons/supply-chain-event-paris-2026 | 0 | 1 | 1,00 | 308 | /salons/supply-chain-event-paris | 200 |
| /salons/texworld-paris-2026 | 0 | 3 | 8,00 | 308 | /salons/texworld-paris | 200 |
| /salons/who-s-next-paris-2026 | 0 | 1 | 8,00 | 308 | /salons/whos-next-paris | 200 |
| /salons/workspace-expo-paris-2026 | 0 | 3 | 13,67 | 308 | /salons/workspace-expo-paris | 200 |
| /salons/world-of-concrete-europe-paris-2026 | 0 | 5 | 7,80 | 308 | /salons/world-of-concrete-europe-paris | 308 vers /salons/intermat-paris (200) |

### Points relevés
- **2 cibles en 404** (confirmé en HEAD et en GET) : `/salons/batibig-nantes`
  et `/salons/cycl-eau-vichy`. Les legacy correspondantes ont 1 clic chacune
  sur la fenêtre.
- **6 chaînes à deux sauts** : `biofit-lille`, `conext-paris`,
  `expobiogaz-bordeaux`, `map-pro-marseille`, `salon-habitat-design-lyon`,
  `world-of-concrete-europe-paris`.
- **Redirections vers une page qui n'est pas la fiche du même salon** :
  `sepag-2026` vers `/secteurs/agroalimentaire`, `conext-paris-2026` vers
  `/secteurs/franchise-commerce` (second saut), `salon-hvac-paris-2026` vers
  `/salons/interclima`, `map-pro-marseille-2027` vers
  `/salons/sirha-mediterranee` (second saut), `world-of-concrete-europe-paris-2026`
  vers `/salons/intermat-paris` (second saut), `salon-habitat-design-lyon-2026`
  vers `/salons/salon-habitat-design-saint-etienne` (second saut). Relevé
  factuel : le caractère voulu ou non de ces cibles n'a pas été vérifié.

## Lecture au regard du critère fixé dans le digest
Scénario A : ratio >= 80 % (>= 223/278), clics canoniques 09-28 >= 1600, part
imp legacy <= 1 %, toutes legacy en 301/308.

| Critère | Mesure 09-28 | Atteint |
|---|---|---|
| Ratio >= 80 % | 86,3 % (82,7 % en strict sitemap) | oui |
| Clics canoniques >= 1600 | 1 660 | oui |
| Part imp legacy <= 1 % | 0,8 % | oui |
| Toutes legacy en 301/308 | 50 sur 50 en 308 | oui |

Les quatre conditions du scénario A sont remplies à la lettre. Réserve : le
critère ne porte que sur le premier saut, et 2 redirections aboutissent à une
404.
