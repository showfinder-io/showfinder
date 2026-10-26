# Agoris SEO : position pondérée 09-28 → 10-12, effet rang vs effet mix (D44)
Date : 2026-10-12. Décision D44 du digest « Analyse SEO hebdo » du 2026-10-12.

## Commande
```
python3 scripts/position_mix_rank.py audits/gsc-baseline-2026-09-28 audits/gsc-baseline-2026-10-12
```
Fenêtres (`summary.txt`) : 09-28 = 2026-08-29 → 2026-09-25, 10-12 = 2026-09-12 → 2026-10-09 (28 jours chacune).
Source : `pages.csv` de chaque baseline. Gabarits recalculés avec la logique de
`classifyUrl` (`scripts/gsc-baseline-export.ts`) ; contrôle fait : nombre de pages
et position pondérée par gabarit identiques à `by-gabarit.csv` (écart <= 0,01) aux deux dates.

## Méthode
- Position pondérée P = Σ (impressions x position) / Σ impressions, par périmètre.
- Effet rang = Σ sur les pages communes de (part d'impressions moyenne des deux dates, au sein du périmètre) x (pos 10-12 - pos 09-28).
- Effet mix = ΔP - effet rang (pages entrantes/sortantes et changement de répartition des impressions).
- Une valeur négative = amélioration (position plus haute).

## Contrôle queries-by-page.csv
- gsc-baseline-2026-09-28 : OK, 5000 lignes, colonnes `query,page,clicks,impressions,ctr,position`
- gsc-baseline-2026-10-12 : OK, 5000 lignes, colonnes conformes

## Résultats
| Périmètre | Pages 09-28 / 10-12 / communes | Imp 09-28 / 10-12 | Pos 09-28 | Pos 10-12 | ΔP | Effet rang | Effet mix |
|---|---|---|---|---|---|---|---|
| (a) toute la propriété | 729 / 884 / 711 | 127098 / 166705 | 10.43 | 10.88 | +0.44 | +0.28 | +0.17 |
| (b) hors prestataire-fiche et en-prestataire-fiche | 696 / 853 / 680 | 125871 / 160551 | 10.30 | 10.19 | -0.11 | +0.20 | -0.31 |
| (c) salon-fiche | 290 / 371 / 278 | 97724 / 119495 | 9.19 | 9.32 | +0.13 | +0.21 | -0.07 |
| (d) secteur-fiche | 15 / 20 / 15 | 4695 / 3847 | 23.62 | 21.72 | -1.90 | -0.75 | -1.15 |
| (d) ville-fiche | 14 / 15 / 14 | 1217 / 1199 | 29.74 | 24.22 | -5.52 | -3.30 | -2.22 |

## Lecture
- Hors prestataires, la légère amélioration de la position pondérée (-0,11 pt) vient
  entièrement du mix (-0,31 pt) : à pages constantes, les positions reculent (+0,20 pt).
- Fiches salon : effet rang +0,21 pt (recul à pages constantes), mix -0,07 pt.
- Toute la propriété : +0,44 pt dont +0,28 pt de rang ; l'écart avec (b) tient aux fiches prestataire.
- Secteurs et villes progressent à pages constantes (-0,75 et -3,30 pt), sur de petits volumes
  (3847 et 1199 impressions au 10-12).

## Verdict
Règle : OK si effet rang (b) <= -0,2 pt ET effet rang (c) <= 0 ; KO si effet rang (b) >= 0 ; sinon neutre.

**KO** : effet rang (b) = +0,20 pt (>= 0), effet rang (c) = +0,21 pt.

## Contrôle du 2026-10-26
Relance de `scripts/position_mix_rank.py` (version de main au 2026-10-26) sur la même paire :
lignes (a), (b), (c) et verdict reproduits à l'identique. Les lignes secteur-fiche et
ville-fiche séparées ci-dessus viennent d'une version antérieure du script ; la version
actuelle les regroupe en (e) secteur-fiche + ville-fiche : effet rang -1,32 pt, effet mix -1,25 pt.
