# Test CTR 48 : liste figée

Figée le 2026-10-29. Les autres sessions ne touchent pas à ces pages (seo_title, seo_description, _en, MDX) avant la fin de la mesure J+28.

- Source : GSC `sc-domain:agoris.io`, dimension page, `dataState: final`.
- Fenêtre de référence : 2026-09-30 → 2026-10-27 (28 jours).
- Filtre : impressions >= 500, position moyenne <= 12, CTR < 1 %.
- Résultat : 48 pages, 52 403 impressions, 309 clics, CTR 0,59 %. Identique au calcul du 2026-10-29 du brief.
- Données brutes : `baseline-2026-09-30_2026-10-27.json` (référence par page), `queries-2026-09-30_2026-10-27.json` (toutes les requêtes de chaque page).
- Script : `scripts/diag-ctr-test-48-baseline.ts` (rejouable pour la mesure J+28 avec d'autres dates).

Répartition : 7 éditions déjà passées (12 073 impr.), 18 fiches dont le salon a lieu pendant la mesure (20 231 impr.), 23 pages hors période de salon (20 salons après le 10 décembre 2026 + 3 lieux, 20 099 impr.).

| # | Page | Clics | Impr. | CTR | Pos. | Dates en base | Statut test |
|---|---|---:|---:|---:|---:|---|---|
| 1 | `/salons/sommet-elevage-clermont` | 40 | 5618 | 0,71 % | 10,3 | 2026-10-06 → 2026-10-09 | exclu : édition passée |
| 2 | `/salons/data-centre-world-paris` | 8 | 3229 | 0,25 % | 7,3 | 2026-11-18 → 2026-11-19 | éligible, salon pendant la mesure |
| 3 | `/salons/congres-sfd` | 30 | 3146 | 0,95 % | 6,9 | 2027-03-30 → 2027-04-02 | éligible |
| 4 | `/salons/beauty-profs-marseille` | 20 | 3101 | 0,64 % | 7,9 | 2026-11-14 → 2026-11-15 | éligible, salon pendant la mesure |
| 5 | `/salons/mondial-auto-paris` | 27 | 2747 | 0,98 % | 8,3 | 2026-10-12 → 2026-10-18 | exclu : édition passée |
| 6 | `/salons/cplf` | 10 | 1881 | 0,53 % | 6,5 | 2027-01-29 → 2027-01-31 | éligible |
| 7 | `/en/salons/amwc` | 2 | 1609 | 0,12 % | 6,6 | 2027-04-01 → 2027-04-03 | éligible |
| 8 | `/salons/jdp-paris` | 7 | 1469 | 0,48 % | 7,1 | 2026-12-01 → 2026-12-05 | éligible, salon pendant la mesure |
| 9 | `/salons/gazelec-paris` | 8 | 1458 | 0,55 % | 6,0 | 2026-10-12 → 2026-10-14 | exclu : édition passée |
| 10 | `/salons/smcl` | 4 | 1457 | 0,27 % | 9,5 | 2026-11-24 → 2026-11-26 | éligible, salon pendant la mesure |
| 11 | `/salons/salon-alpin` | 10 | 1332 | 0,75 % | 8,0 | 2026-11-09 → 2026-11-12 | éligible, salon pendant la mesure |
| 12 | `/salons/viteff` | 4 | 1053 | 0,38 % | 8,9 | 2027-10-12 → 2027-10-14 | éligible |
| 13 | `/salons/carrefour-pathologie` | 5 | 1011 | 0,49 % | 6,9 | 2026-11-18 → 2026-11-20 | éligible, salon pendant la mesure |
| 14 | `/salons/euroforest` | 9 | 944 | 0,95 % | 9,1 | 2027-06-16 → 2027-06-19 | éligible |
| 15 | `/salons/cosmetagora-paris` | 1 | 912 | 0,11 % | 6,2 | 2027-01-12 → 2027-01-13 | éligible |
| 16 | `/salons/congres-francais-urologie` | 6 | 909 | 0,66 % | 7,6 | 2026-11-18 → 2026-11-21 | éligible, salon pendant la mesure |
| 17 | `/salons/euronaval-paris` | 5 | 869 | 0,58 % | 10,2 | 2026-11-03 → 2026-11-06 | éligible, salon pendant la mesure |
| 18 | `/salons/salon-des-vins-de-loire` | 2 | 862 | 0,23 % | 7,3 | 2027-02-01 → 2027-02-02 | éligible |
| 19 | `/salons/paris-sante-femmes` | 7 | 851 | 0,82 % | 7,5 | 2026-12-02 → 2026-12-04 | éligible, salon pendant la mesure |
| 20 | `/salons/workplace-meetings-cannes` | 7 | 797 | 0,88 % | 6,7 | 2026-11-24 → 2026-11-26 | éligible, salon pendant la mesure |
| 21 | `/en/salons/jdp-paris` | 5 | 762 | 0,66 % | 5,4 | 2026-12-01 → 2026-12-05 | éligible, salon pendant la mesure |
| 22 | `/salons/satis` | 2 | 733 | 0,27 % | 7,3 | 2026-11-04 → 2026-11-05 | éligible, salon pendant la mesure |
| 23 | `/salons/devoxx-france` | 3 | 722 | 0,42 % | 7,3 | 2027-04-07 → 2027-04-09 | éligible |
| 24 | `/salons/educatech-expo` | 2 | 719 | 0,28 % | 7,0 | 2026-12-02 → 2026-12-04 | éligible, salon pendant la mesure |
| 25 | `/salons/sofins` | 3 | 711 | 0,42 % | 5,7 | 2027-04-06 → 2027-04-08 | éligible |
| 26 | `/salons/iode` | 7 | 703 | 1,00 % | 5,3 | 2027-01-27 → 2027-01-28 | éligible |
| 27 | `/salons/les-assises-de-la-securite-monaco` | 6 | 670 | 0,90 % | 6,6 | 2026-10-07 → 2026-10-10 | exclu : édition passée |
| 28 | `/salons/rencontres-amrae` | 0 | 660 | 0,00 % | 9,0 | 2027-02-03 → 2027-02-05 | éligible |
| 29 | `/salons/energaia-montpellier` | 2 | 629 | 0,32 % | 11,7 | 2026-12-09 → 2026-12-10 | éligible, salon pendant la mesure |
| 30 | `/salons/congres-francais-psychiatrie` | 1 | 626 | 0,16 % | 6,8 | 2026-12-02 → 2026-12-05 | éligible, salon pendant la mesure |
| 31 | `/salons/innovagri` | 6 | 623 | 0,96 % | 9,4 | 2027-06-02 → 2027-06-03 | éligible |
| 32 | `/lieux/parc-expo-chalons` | 4 | 616 | 0,65 % | 8,5 | (lieu) | lieu |
| 33 | `/en/salons/satis` | 5 | 604 | 0,83 % | 5,5 | 2026-11-04 → 2026-11-05 | éligible, salon pendant la mesure |
| 34 | `/salons/jfhod` | 4 | 598 | 0,67 % | 8,6 | 2027-03-11 → 2027-03-14 | éligible |
| 35 | `/salons/europropre` | 4 | 591 | 0,68 % | 9,6 | 2027-03-16 → 2027-03-18 | éligible |
| 36 | `/salons/exphotel-bordeaux` | 0 | 583 | 0,00 % | 6,9 | 2027-11-21 → 2027-11-23 | éligible |
| 37 | `/lieux/grande-halle-d-auvergne` | 5 | 580 | 0,86 % | 11,2 | (lieu) | lieu |
| 38 | `/en/salons/museum-connections` | 4 | 579 | 0,69 % | 5,5 | 2027-01-12 → 2027-01-13 | éligible |
| 39 | `/salons/congres-des-audioprothesistes` | 5 | 573 | 0,87 % | 6,3 | 2027-03-11 → 2027-03-12 | éligible |
| 40 | `/salons/architect-at-work-nantes` | 4 | 572 | 0,70 % | 7,7 | 2026-11-19 → 2026-11-20 | éligible, salon pendant la mesure |
| 41 | `/salons/sival-angers` | 2 | 571 | 0,35 % | 8,6 | 2027-01-12 → 2027-01-14 | éligible |
| 42 | `/en/salons/congres-sofcot` | 5 | 561 | 0,89 % | 6,6 | 2026-11-11 → 2026-11-13 | éligible, salon pendant la mesure |
| 43 | `/salons/architect-at-work-paris` | 3 | 535 | 0,56 % | 9,3 | 2026-10-21 → 2026-10-22 | exclu : édition passée |
| 44 | `/en/lieux/paris-le-bourget` | 1 | 534 | 0,19 % | 11,2 | (lieu) | lieu |
| 45 | `/salons/tranofiliere-paris` | 3 | 525 | 0,57 % | 9,0 | 2026-10-01 → 2026-10-04 | exclu : édition passée |
| 46 | `/salons/ces-las-vegas` | 2 | 525 | 0,38 % | 11,9 | 2027-01-06 → 2027-01-09 | éligible |
| 47 | `/salons/europack-euromanut-lyon` | 4 | 523 | 0,76 % | 8,9 | 2027-11-16 → 2027-11-18 | éligible |
| 48 | `/salons/ad2s-bordeaux` | 5 | 520 | 0,96 % | 6,0 | 2026-09-22 → 2026-09-24 | exclu : édition passée |
