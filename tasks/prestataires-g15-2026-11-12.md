# G15 : lecture GSC du lot test prestataires, 2026-11-12

Lecture seule. Aucune écriture en base ni dans le repo hors ce fichier.

## Sources et fenêtre

- GSC Search Analytics, propriété `sc-domain:agoris.io`, dimensions page et page x requête, **2026-09-22 au 2026-11-09** (lot ouvert le 2026-09-21, soit 7 semaines et non 4-6). Filtre : URL contenant `agoris.io/(en/)?prestataires`.
- GSC URL Inspection API, appelée le 2026-11-12, sur les 42 URLs du lot (16 fiches + 5 hubs, FR et EN).
- Base (SELECT via REST, service role) : table `providers` (87 lignes, 16 `seo_indexable=true`, 71 `false`) et `provider_hubs` (5).
- Scripts ponctuels (hors repo) : `/private/tmp/claude-501/-Users-julienzakoian-Projects-showfinder/1173f426-845a-4270-aa2f-f3e7c3bfae6f/scratchpad/gsc.mts`, `an.mts`, `grp.mts`. Données brutes : `gsc-pages.json`, `inspect.json`, `providers.json` dans le même dossier.
- Longueur = nombre de mots de `description` / `description_en` (fiches) et `editorial_mdx` / `editorial_mdx_en` (hubs), comptés par séparation sur les espaces. La table `providers` n'a pas de colonne `editorial_mdx` : le texte d'une fiche est `description`.

## 1. Indexation du lot test (état au 2026-11-12)

Taux sur les 42 URLs (21 FR + 21 EN) : **32 indexées sur 42 (76 %)**.

| Ensemble | Indexées | Total | Taux |
|---|---|---|---|
| Hubs FR | 5 | 5 | 100 % |
| Hubs EN | 5 | 5 | 100 % |
| Fiches FR | 10 | 16 | 62,5 % |
| Fiches EN | 12 | 16 | 75 % |

Les 10 URLs non indexées (statut GSC, dernier crawl entre parenthèses) :

- FR : potel-et-chabot-paris, lenotre-paris, videlio-paris : "Excluded by noindex tag", dernier crawl en juillet 2026 (donc avant l'ouverture). dushow-paris et expocom-paris : "Crawled - currently not indexed" (crawls de mai et juillet). magnum-lyon : "Discovered - currently not indexed", jamais crawlée.
- EN : potel-et-chabot-paris, aliance-mobilier, videlio-paris : "URL is unknown to Google". dushow-paris : "Excluded by noindex tag".

Lecture (assumée, pas confirmée) : 8 des 10 ont un dernier crawl antérieur au 2026-09-21 ou aucun crawl, ce qui correspond au feu vert de la relecture G14 qui ne donnait Request Indexing tout de suite qu'à 4 fiches et différait les autres (lenotre, videlio, dushow après application des corrections ; magnum et expocom après le renommage). Les pages crawlées après l'ouverture sont toutes indexées, sauf expocom-paris et dushow-paris dont les crawls sont antérieurs. Donc l'écart n'est pas un rejet de Google sur le contenu, c'est un crawl qui n'a pas encore eu lieu. Non vérifié : si Request Indexing a été fait pour les fiches de la liste.

## 2. Impressions et clics du lot test (2026-09-22 au 2026-11-09)

| Ensemble | Impressions | Clics |
|---|---|---|
| 16 fiches FR | 3 323 | 6 |
| 16 fiches EN | 553 | 2 |
| 5 hubs FR | 7 302 | 11 |
| 5 hubs EN | 4 045 | 5 |
| Total lot | 15 223 | 24 |

Pour comparaison, tout le site sur la même fenêtre : 350 680 impressions, 4 127 clics (le lot pèse 4,3 % des impressions, 0,6 % des clics).

Par fiche (FR impressions / clics / position moyenne), les requêtes principales sont presque toujours le nom de la société :

| Fiche | FR imp / clics / pos | EN imp / clics | Requêtes dominantes (FR) |
|---|---|---|---|
| design-location | 805 / 1 / 12,9 | 0 | "design location" 416, "location mobilier design" 89 |
| alises | 548 / 0 / 8,0 | 13 / 0 | "alises location" 77, "alises mobilier" 56 |
| aktuel | 351 / 0 / 9,9 | 59 / 1 | "aktuel mobilier" 107, "aktuel paris" 42 |
| alive-group | 378 / 0 / 10,1 | 141 / 0 | "alive location mobilier" 50 |
| novelty-paris | 365 / 0 / 12,2 | 8 / 0 | "novelty" 222 |
| aukare | 350 / 5 / 6,6 | 31 / 0 | "aukaré" 96 (2 clics), "aukare stand" 43 |
| aliance-mobilier | 201 / 0 / 7,1 | 0 | "aliance mobilier" 89 |
| affaire-d-idees | 136 / 0 / 5,6 | 10 / 0 | "affaire d'idées" 32 |
| alphaexpo | 106 / 0 / 7,7 | 42 / 0 | "alphaexpo" 46 |
| axial-design | 82 / 0 / 7,8 | 64 / 0 | "axial design" 36 |
| dushow-paris | 1 / 0 | 0 | non indexée |
| magnum-lyon | 0 | 146 / 0 / 12,4 | EN : "magnum gonesse" 10, "magnum av" 8 |
| lenotre-paris | 0 | 38 / 1 / 8,9 | EN : "lenotre catering" 3 |
| expocom-paris | 0 | 1 / 0 | |
| potel-et-chabot-paris, videlio-paris | 0 | 0 | non indexées |

Hubs (FR imp / clics / pos ; EN imp / clics / pos) :

| Hub | FR | EN | Requêtes dominantes |
|---|---|---|---|
| standistes | 1 628 / 5 / 43,1 | 1 797 / 2 / 37,7 | "standiste" (pos 62,7), "fabricant de stand" ; EN "exhibition stand manufacturer france" |
| standistes-lyon | 1 637 / 2 / 26,6 | 1 172 / 1 / 12,6 | "standiste lyon" 349 (pos 31,2) ; EN "exhibition stand builders in lyon" 245 (pos 7,9) |
| standistes-paris | 666 / 2 / 42,7 | 421 / 1 / 22,3 | "standiste paris" 96 (pos 48,8) |
| prestataires-audiovisuel-paris | 1 449 / 2 / 56,3 | 402 / 1 / 35,0 | "prestataire audiovisuel" 162 (pos 65,8) |
| location-mobilier-evenementiel | 1 922 / 0 / 22,2 | 253 / 0 / 50,5 | "location mobilier salon professionnel" 75 (pos 25,5) |

Ce que ça dit : (a) les fiches sont trouvées sur leur nom (position 5 à 12), ce qui est le rôle attendu, mais le site de la société passe devant et le clic va rarement chez nous (8 clics sur 3 876 impressions de fiches). (b) Les hubs captent les requêtes métier (10 000+ impressions combinées) mais à des positions de 26 à 65 en FR, d'où 16 clics. Le seul bon rang est EN "exhibition stand builders in lyon" (pos 8-9, 0 clic). Non mesuré : le CTR par position de référence, le trafic GA4 de ces pages, les conversions drawer ou Premium.

Autres URLs `/prestataires/` avec impressions hors lot : bhotel-paris (1) et evenementiel-photo-paris (5), deux fiches en noindex dans la base à ce jour. Anomalie mineure non expliquée (une vue GSC antérieure au noindex est possible, non vérifié).

## 3. Effet de la longueur : non mesurable avec ces données

Le todo demande 400-500 vs 700-800 mots. Ces deux groupes n'existent pas dans la base :

- Les 16 fiches du lot ont une `description` de **78 à 128 mots** (EN : 70 à 130). Aucune n'approche 400 mots.
- Les 5 hubs font **474 à 537 mots** (FR) et 477 à 524 (EN), un seul ordre de grandeur. Aucun hub à 700-800 mots.
- Je n'ai trouvé aucune mention de 400-500 / 700-800 ailleurs dans `tasks/` : l'hypothèse du todo semble ne pas avoir été mise en œuvre.

Ce qui peut quand même être observé :

- Fiches, par longueur croissante (mots FR, statut FR) : axial-design 78 indexée ; aliance-mobilier 79 indexée ; aukare 81 indexée ; affaire-d-idees 84 indexée ; design-location 84 indexée ; alises 91 indexée ; aktuel 93 indexée ; expocom-paris 95 crawlée non indexée ; dushow-paris 97 crawlée non indexée ; alive-group 103 indexée ; videlio-paris 103 noindex (crawl de juillet) ; alphaexpo 113 indexée ; magnum-lyon 114 découverte non indexée ; novelty-paris 117 indexée ; lenotre-paris 118 noindex (crawl de juillet) ; potel-et-chabot-paris 128 noindex (crawl de juillet).
- Les fiches indexées vont de 78 à 117 mots, les non indexées de 95 à 128 : pas de lien entre longueur et indexation, le facteur visible est la date du dernier crawl.
- Hubs (474-537 mots) : 100 % indexés, mais ils sont aussi les plus liés (navigation, drawer), ce qui est confondu avec la longueur.
- Impressions : les fiches les plus visibles (design-location 84 mots, alises 91, aktuel 93) ne sont pas les plus longues ; elles correspondent aux noms de société les plus recherchés. Avec 16 points, aucune conclusion causale.

Conclusion : l'effet de la longueur n'a pas pu être mesuré. Pour le tester il faudrait produire un groupe de fiches allongées (par exemple 5 à 10 fiches à 400-500 mots et un groupe témoin), ce qui est un travail rédactionnel à décider, pas une lecture.

## 4. Les 71 fiches en noindex

Données lues par SELECT : `category`, `city`, `department`, longueur `description` / `description_en`, `website_url`, `is_verified`, `editorial_reviewed_at`, `specialties`, `email`, `phone`.

Constats communs aux 71 : 69 ont une description FR et EN (10 à 133 mots FR), 71 sur 71 ont un site web, 69 ont `editorial_reviewed_at` renseigné (sont exclues pico-international-paris et db-schenker-paris), seules 2 ont `is_verified=true` (gl-events-venues-lyon, mci-france-paris, toutes deux dans le groupe C). Répartition par catégorie : 62 standistes, 3 AV (big-bang, eclairis, versant), 2 traiteurs, 3 transport (db-schenker-paris, esi, wel-group), 1 photographe. Le lot test, lui, est surtout du mobilier, de l'AV et du traiteur : **seulement 4 standistes sur 16** (affaire-d-idees, alphaexpo, aukare, axial-design). L'effet mesuré ne se transpose donc pas tel quel aux 62 standistes. Non mesuré.

Critères de classement (mécaniques, appliqués à toutes les lignes) :
- C, à ne pas ouvrir : fiches que le todo G12 ou la relecture G14 signalent comme matière insuffisante ou hors périmètre, ou description de moins de 50 mots.
- B, à enrichir d'abord : description FR sous 75 mots ou EN sous 65 mots (les 16 du lot ont 78 mots FR au minimum), ville contestée (todo G12), ou ni email ni téléphone.
- A, prête après relecture : tout le reste.

Limite importante : la relecture du 2026-11-12 sur les 16 du lot a trouvé 10 fiches avec CORRECTIONS (villes fausses, contacts introuvables, références périmées). Aucune des 71 n'a eu cette relecture. Le groupe A est donc "contenu suffisant en volume", pas "vérifié". Il faut la même relecture sur sources avant ouverture, pas une relecture rapide de forme.

### Groupe A : prête à ouvrir après relecture (53)

Répartition : 46 standistes, 2 AV (big-bang, eclairis), 2 traiteurs (maison-poirier, un-amour-de-bonbon), 2 transport (esi, wel-group), 1 photographe (pierre-et-gilles).

triangle-expositions, ambs, co-nect, media-product, c2j-standexpo, r2-stand-et-event, athenee, expo-4, merci-gustave, wenes-stand, eclairis, un-amour-de-bonbon, wel-group, maison-poirier, pierre-et-gilles, 3d-actions, a-b, adexpo, artpulsion, agence-procept, atelier-design, big-bang, audace, arc-et-typ, capsule-concept, evolu-stand, stik-co, clamens-design, ex-nihilo, fg-design, cap-linea, euro-design, go4expo, des-pas-en-avant, esi, idee-fixe, laps-concept, equateur-expo, expace, la-p-tite-histoire, stand-op, l-architecture-communicante, live-co, l-as-decors, square-meters-paris, trajectoire-expositions, standpub, technistyle, stand-by-me, tas-exposition, tungstene-creation, thems-concept, understand.

Raison : description FR 77 à 133 mots, EN 65 à 125, site web, au moins un moyen de contact, 3 à 6 spécialités, pas de point ouvert dans le todo. Les contacts du seed d'avril n'ont pas été revérifiés.

### Groupe B : à enrichir ou trancher d'abord (13)

| Fiche | Raison |
|---|---|
| expo-even | texte court : FR 66 / EN 63 mots |
| id2stand | texte court : FR 72 / EN 61 |
| galis | texte court : FR 67 / EN 58 |
| 2b | texte court : FR 69 / EN 65 |
| agence-bosco | texte court : FR 74 / EN 65, aucun email ni téléphone en base |
| hopen-design-stand | texte court : EN 64 |
| technistand | texte court : FR 74 |
| versant | texte court : FR 71 (catégorie av_technique) |
| alris-communication | ni email ni téléphone en base |
| keops-expositions | ni email ni téléphone en base |
| wmh-project | ni email ni téléphone en base |
| iboo-studio | ville à trancher (site : Auray 56 ; registre et LEADS : Courdimanche 95), todo G12 |
| pech-up | ville à trancher (fichier : Beauvallon ; mentions légales : Millery), todo G12 |

Les cas "texte court" sont à 1 à 12 mots du seuil observé dans le lot : ils peuvent passer en A avec une passe d'étoffement sans nouvelle donnée, sous réserve de sources.

### Groupe C : à ne pas ouvrir (5)

| Fiche | Raison |
|---|---|
| pico-international-paris | description FR 16 mots, pas de `editorial_reviewed_at`, aucune entité française identifiable (todo G12) |
| db-schenker-paris | description FR 10 mots, pas de `editorial_reviewed_at`, dbschenker.com redirige vers dsv.com (todo G12). Le todo le disait encore `is_verified=true` ; la base lue le 2026-11-12 indique `false` |
| studecors | description FR 45 mots, "matière insuffisante" (todo G12) |
| gl-events-venues-lyon | gestionnaire de sites, pas un standiste, catégorie à revoir (todo G12 et relecture G14) ; `is_verified=true` |
| mci-france-paris | agence de communication, pas un standiste, matière insuffisante (todo G12 et relecture G14) ; `is_verified=true` |

Note : ces cinq (et pico) sont aussi comptées parmi les 66 standistes des hubs, défaut déjà relevé par la relecture G14.

## 5. Ce qui fonctionne, ce qui ne fonctionne pas

Fonctionne :
- Indexation : les hubs sont à 100 %, les fiches crawlées après ouverture sont indexées sans exception observée, y compris en EN.
- Positionnement sur nom de société (positions 5 à 13) et sur quelques requêtes locales EN (Lyon, pos 8-9).
- Aucun rejet de contenu par Google constaté (pas de "Duplicate", pas de "Soft 404" dans les statuts lus).

Ne fonctionne pas (encore) :
- Peu de trafic utile : 24 clics sur 15 223 impressions en 7 semaines, soit 0,16 % de CTR, contre 1,18 % sur le site entier. Les hubs en pos 26-65 sur les requêtes métier ne rapportent presque rien en FR.
- 10 URLs du lot non indexées, dont plusieurs par absence de recrawl.

Non mesuré : sessions GA4 des pages prestataires, ouvertures du drawer, leads, effet de l'ouverture sur le reste du site (aucun signe vu, aucun test fait), effet de la longueur.

## 6. Recommandation

1. Ne pas ouvrir les 71 d'un bloc. Les chiffres ne montrent pas de gain mesurable à indexer des fiches de société : leurs impressions sont des requêtes de nom, avec un clic pour 480 impressions. En revanche, rien ne montre non plus de dommage, et le coût d'indexation est faible.
2. Avant toute ouverture : lancer sur le groupe A la même relecture sur sources que celle du 2026-11-12 (10 fiches sur 16 corrigeables). C'est le vrai coût et le vrai risque (règle 13 du CLAUDE.md), pas la décision d'indexer.
3. Ouvrir par vagues (par exemple 10 à 15 standistes du groupe A après relecture) puis mesurer 4 à 6 semaines, car le lot test ne contient que 4 standistes sur 62 : on ignore si le schéma se répète pour la catégorie dominante. À défaut, ouvrir le groupe A entier après relecture si Julien privilégie la couverture (mémoire : publication SEO d'un bloc dès validation).
4. Finir d'abord le lot test : Request Indexing sur les fiches en attente (potel, lenotre, videlio, dushow, magnum, expocom) après application des corrections de la PR #187, puis relire GSC à 2 semaines.
5. Si l'objectif est le trafic et non la couverture : le levier mesurable est les hubs (positions 26-65 à remonter), pas l'ouverture des fiches.
6. Tester la longueur par un échantillon à 400-500 mots (voir section 3) ou retirer ce critère du todo.
7. Groupe B à étoffer ou trancher (Nicolas indisponible, voir mémoire), groupe C à laisser en noindex et à sortir du compte des hubs.
