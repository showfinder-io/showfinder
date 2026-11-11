# Agoris SEO : position pondérée 09-28 → 10-26, effet rang vs effet mix (D45)
Date : 2026-10-26. Décision D45 du digest « Analyse SEO hebdo » du 2026-10-26.
Paire principale : 09-28 → 10-26, fenêtres indépendantes (aucun jour en commun).
Paire de contrôle : 10-12 → 10-26 (fenêtres chevauchantes sur 14 jours).

## Commandes
```
python3 scripts/position_mix_rank.py audits/gsc-baseline-2026-09-28 audits/gsc-baseline-2026-10-26
python3 scripts/position_mix_rank.py audits/gsc-baseline-2026-10-12 audits/gsc-baseline-2026-10-26
```
Fenêtres (`summary.txt`) : 09-28 = 2026-08-29 → 2026-09-25, 10-12 = 2026-09-12 → 2026-10-09,
10-26 = 2026-09-26 → 2026-10-23 (28 jours chacune).
Source : `pages.csv` de chaque baseline. Gabarits recalculés avec la logique de
`classifyUrl` (`scripts/gsc-baseline-export.ts`) ; contrôle fait : nombre de pages
et position pondérée par gabarit identiques à `by-gabarit.csv` (écart <= 0,01) au 09-28 et au 10-26.

## Méthode
- Position pondérée P = Σ (impressions x position) / Σ impressions, par périmètre.
- Effet rang = Σ sur les pages communes de (part d'impressions moyenne des deux dates, au sein du périmètre) x (pos new - pos old).
- Effet mix = ΔP - effet rang (pages entrantes/sortantes et changement de répartition des impressions).
- Une valeur négative = amélioration (position plus haute).
- Périmètres D45 : (a) propriété, (b) hors prestataire-fiche et en-prestataire-fiche, (c) salon-fiche FR,
  (d) salon-fiche FR hors terres-de-jim, ad2s-bordeaux, salon-herbe, sommet-elevage-clermont, tech-and-bio
  (fiches saisonnières, les versions /en ne sont pas dans (c) ni (d)), (e) secteur-fiche + ville-fiche.

## Contrôle queries-by-page.csv
- gsc-baseline-2026-09-28 : OK, 5000 lignes, colonnes `query,page,clicks,impressions,ctr,position`
- gsc-baseline-2026-10-12 : OK, 5000 lignes, colonnes conformes
- gsc-baseline-2026-10-26 : OK, 5000 lignes, colonnes conformes

## Résultats : paire indépendante 09-28 → 10-26
| Périmètre | Pages 09-28 / 10-26 / communes | Imp 09-28 / 10-26 | Pos 09-28 | Pos 10-26 | ΔP | Effet rang | Effet mix |
|---|---|---|---|---|---|---|---|
| (a) toute la propriété | 729 / 945 / 660 | 127098 / 202599 | 10.43 | 11.26 | +0.83 | +1.49 | -0.66 |
| (b) hors prestataire-fiche et en-prestataire-fiche | 696 / 913 / 630 | 125871 / 193909 | 10.30 | 10.50 | +0.19 | +1.40 | -1.21 |
| (c) salon-fiche FR | 290 / 394 / 239 | 97724 / 142878 | 9.19 | 9.95 | +0.76 | +1.51 | -0.75 |
| (d) salon-fiche FR hors 5 fiches saisonnières | 285 / 389 / 234 | 81121 / 133845 | 9.70 | 10.05 | +0.35 | +1.73 | -1.38 |
| (e) secteur-fiche + ville-fiche | 29 / 35 / 29 | 5912 / 5422 | 24.88 | 22.22 | -2.66 | -0.91 | -1.75 |

## Résultats : paire de contrôle 10-12 → 10-26
| Périmètre | Pages 10-12 / 10-26 / communes | Imp 10-12 / 10-26 | Pos 10-12 | Pos 10-26 | ΔP | Effet rang | Effet mix |
|---|---|---|---|---|---|---|---|
| (a) toute la propriété | 884 / 945 / 832 | 166705 / 202599 | 10.88 | 11.26 | +0.38 | +0.93 | -0.55 |
| (b) hors prestataire-fiche et en-prestataire-fiche | 853 / 913 / 802 | 160551 / 193909 | 10.19 | 10.50 | +0.30 | +0.92 | -0.62 |
| (c) salon-fiche FR | 371 / 394 / 332 | 119495 / 142878 | 9.32 | 9.95 | +0.63 | +0.94 | -0.31 |
| (d) salon-fiche FR hors 5 fiches saisonnières | 366 / 389 / 327 | 102358 / 133845 | 9.66 | 10.05 | +0.39 | +1.01 | -0.62 |
| (e) secteur-fiche + ville-fiche | 35 / 35 / 35 | 5046 / 5422 | 22.31 | 22.22 | -0.09 | +0.34 | -0.43 |

## Lecture
- Sur la paire indépendante, hors prestataires (b), la position pondérée recule de +0,19 pt alors que
  le mix joue à -1,21 pt : à pages constantes, les positions reculent de +1,40 pt. Les nouvelles pages
  et la redistribution des impressions masquent les deux tiers du recul de rang.
- Fiches salon FR (c) : effet rang +1,51 pt sur 239 pages communes, mix -0,75 pt.
- Retirer les 5 fiches saisonnières (d) n'atténue pas le recul : l'effet rang monte à +1,73 pt.
  Ces 5 fiches pesaient 16603 impressions au 09-28 et 9033 au 10-26 ; leurs positions bougent peu
  (terres-de-jim 5,94 → 5,70, ad2s-bordeaux 4,60 → 5,60, salon-herbe 3,89 → 3,36,
  sommet-elevage-clermont 9,40 → 9,94, tech-and-bio 5,24 → 5,08). Le recul de rang est diffus
  sur le reste des fiches salon FR, pas porté par la saisonnalité de ces 5 fiches.
- Secteurs + villes (e) progressent à pages constantes sur la paire indépendante (-0,91 pt) mais
  reculent sur la paire de contrôle (+0,34 pt), sur un petit volume (5422 impressions au 10-26).
- La paire de contrôle 10-12 → 10-26 donne le même sens avec des amplitudes plus faibles
  (effet rang (b) +0,92 pt, (c) +0,94 pt, (d) +1,01 pt), cohérent avec un recul continu entre les
  trois exports : au 10-12 l'effet rang (b) 09-28 → 10-12 valait +0,20 pt.

## Verdict
Règle (inchangée depuis D44) : OK si effet rang (b) <= -0,2 pt ET effet rang (c) <= 0 ; KO si effet rang (b) >= 0 ; sinon neutre.

**KO** sur la paire indépendante 09-28 → 10-26 : effet rang (b) = +1,40 pt, effet rang (c) = +1,51 pt, effet rang (d) = +1,73 pt.
**KO** sur la paire de contrôle 10-12 → 10-26 : effet rang (b) = +0,92 pt, effet rang (c) = +0,94 pt.

Constat : le recul de la position pondérée est un recul de rang à pages constantes, diffus sur les
fiches salon FR, et non un effet de composition (nouvelles pages, saisonnalité des 5 fiches exclues en (d)).

## Mesure D45
Règle D45 : effet rang (d) <= 0 et (b) <= 0 => promotion de position-cycle-montee-charge ;
effet rang (d) > +0,2 pt => rétrogradation ; sinon statu quo.

Paire indépendante 09-28 → 10-26 : effet rang (d) = +1,73 pt (> +0,2), effet rang (b) = +1,40 pt.
**Rétrogradation de position-cycle-montee-charge.** Recontrôle au baseline 11-09.
Chiffres reproduits à l'identique par une seconde exécution du script le 2026-10-26.
