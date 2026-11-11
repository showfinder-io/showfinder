# Agoris SEO : CTR des fiches salon FR à meta générique vs enrichie (D47)
Date : 2026-10-26. Décision D47 du digest « Analyse SEO hebdo » du 2026-10-26.

## Commandes
```
python3 scripts/meta_generique_ctr.py --save-meta /tmp/agoris-meta.csv audits/gsc-baseline-2026-10-26 audits/gsc-baseline-2026-10-12
python3 scripts/meta_generique_ctr.py --load-meta /tmp/agoris-meta.csv audits/gsc-baseline-2026-10-26 audits/gsc-baseline-2026-10-12
```
Crawl en lecture seule du sitemap www.agoris.io le 2026-10-26 : 385 fiches salon FR.
3 fiches (amwc, arab-health-dubai, mapic) en erreur TLS au premier passage, récupérées
au second (HTTP 200, classe enrichie). Classement final : 67 génériques (meta contenant
« informations pratiques sur Agoris »), 318 enrichies. Aucune fiche modifiée.

Limite : la classe est celle du jour du crawl. Une fiche enrichie entre le 2026-09-12
et aujourd'hui est comptée enrichie sur toute la fenêtre 10-12, ce qui brouille surtout
la paire ancienne.

## Résultats (pages à imp >= 100)
Buckets : 4-10 = 4 <= position < 11, 11-20 = 11 <= position < 21 (position moyenne GSC de la page).

### Baseline 10-26 (fenêtre 2026-09-26 → 2026-10-23)
| bucket | classe | n | imp | clics | CTR agrégé | CTR médian |
|---|---|---|---|---|---|---|
| 4-10 | générique | 15 | 11776 | 221 | 1,88 % | 0,96 % |
| 4-10 | générique hors sial-paris et mondial-auto-paris | 13 | 5616 | 48 | 0,85 % | 0,94 % |
| 4-10 | enrichie | 185 | 96805 | 1365 | 1,41 % | 1,02 % |
| 11-20 | générique | 10 | 3245 | 15 | 0,46 % | 0,45 % |
| 11-20 | enrichie | 38 | 15856 | 137 | 0,86 % | 0,82 % |

### Baseline 10-12 (fenêtre 2026-09-12 → 2026-10-09)
| bucket | classe | n | imp | clics | CTR agrégé | CTR médian |
|---|---|---|---|---|---|---|
| 4-10 | générique | 17 | 10459 | 152 | 1,45 % | 0,66 % |
| 4-10 | générique hors sial-paris et mondial-auto-paris | 15 | 6485 | 58 | 0,89 % | 0,49 % |
| 4-10 | enrichie | 134 | 82159 | 1377 | 1,68 % | 0,93 % |
| 11-20 | générique | 13 | 4623 | 40 | 0,87 % | 0,31 % |
| 11-20 | enrichie | 22 | 8429 | 96 | 1,14 % | 0,79 % |

## Rapport CTR enrichie / générique, bucket 4-10
| périmètre | 10-26 | 10-12 |
|---|---|---|
| agrégé, toutes fiches (n générique 15 / 17) | 0,75 | 1,15 |
| agrégé, hors sial-paris et mondial-auto-paris (n générique 13 / 15) | 1,65 | 1,87 |
| médian, toutes fiches | 1,06 | 1,41 |

## Verdict
Règle D47 : rapport CTR enrichie/générique en bucket 4-10, n >= 15 par classe sur les
2 fenêtres : >= 1,3 => hypothèse forte (la meta générique pénalise le CTR) ; <= 1,1 => écartée ;
entre les deux => inconclusif.

**Inconclusif.** Sur le seul périmètre qui respecte n >= 15 sur les deux fenêtres (toutes
fiches, CTR agrégé), le rapport vaut 0,75 puis 1,15 : ni >= 1,3 ni <= 1,1 sur les deux.

Constat : le CTR agrégé des génériques est porté par sial-paris et mondial-auto-paris
(173 des 221 clics au 10-26). Hors ces deux fiches, les enrichies cliquent 1,65 à 1,87 fois
plus que les génériques, mais avec 13 fiches génériques au 10-26 la condition n >= 15 n'est
pas remplie. Le signal va dans le sens de l'hypothèse sans la valider. Le bucket 11-20
(n générique 10 et 13) donne le même sens (rapport agrégé 1,87 et 1,32) mais reste sous le seuil n.
Recontrôle possible au baseline 11-09 si de nouvelles fiches génériques entrent en 4-10.
