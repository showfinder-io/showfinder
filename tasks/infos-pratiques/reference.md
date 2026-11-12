# Test « Infos pratiques » : référence

Fenêtre de référence : 2026-10-13 au 2026-11-09 (28 jours, GSC `dataState: final`, propriété `sc-domain:agoris.io`). Établie le 2026-11-12.
Graine : `infos-pratiques-2026-11-12`. Script : `tasks/infos-pratiques/mesure.ts`.

## Verdict de taille

Objectif 2 x 44 non atteignable. Après exclusions, 11 fiches FR ont au moins 20 impressions logistiques sur la fenêtre (27 avant exclusions). Taille maximale honnête au seuil demandé : **5 paires, 5 traitées et 5 témoins** (la 11e fiche reste sans paire).

Entonnoir (fiches /salons FR avec impressions GSC) :
- 6 non publiées ; 43 dans ctr-test-48 ; 43 dans la table de priorisation page2-page1 ; 15 des 20 fiches refaites les 11 et 12 novembre (les 5 autres n'apparaissent pas dans les données GSC FR de la fenêtre, ou sont déjà comptées dans une autre exclusion) ; 324 sous le seuil de 20 impressions logistiques ; 11 retenues.
- tasks/ctr-prestataires-lieux ne touche que /lieux et /prestataires : aucune fiche salon à exclure.
- Variante `-seuil5` (au moins 5 impressions logistiques) : 34 éligibles, 17 paires (fichiers `groupes-seuil5.json`, `reference-seuil5.json`). Signal trop faible pour conclure (voir limites).

## Chiffres de référence, seuil 20 (5 + 5), FR

| Groupe | Fiches | Impr. totales | Clics | CTR | Position | Impr. logistiques | Clics log. | CTR log. | Position log. |
|---|---|---|---|---|---|---|---|---|---|
| Traités | 5 | 7 355 | 77 | 1,047 % | 11,57 | 593 | 16 | 2,698 % | 7,87 |
| Témoins | 5 | 4 827 | 108 | 2,237 % | 12,12 | 1 018 | 55 | 5,403 % | 8,42 |

EN (informatif, /en/salons, mêmes slugs) : traités 289 imp / 1 clic ; témoins 284 imp / 8 clics ; impressions logistiques EN : 0 et 2.

## Chiffres de référence, variante seuil 5 (17 + 17), FR

| Groupe | Fiches | Impr. totales | Clics | CTR | Position | Impr. logistiques | Clics log. | CTR log. | Position log. |
|---|---|---|---|---|---|---|---|---|---|
| Traités | 17 | 12 352 | 181 | 1,465 % | 11,28 | 769 | 22 | 2,861 % | 13,51 |
| Témoins | 17 | 10 425 | 164 | 1,573 % | 11,04 | 1 160 | 58 | 5,000 % | 9,08 |

## Limites à lire avant d'utiliser ces groupes

1. Les requêtes anonymisées par Google n'apparaissent pas dans l'export page x requête : les chiffres logistiques sont un plancher.
2. Appariement imparfait à ce volume : au seuil 20, les traités ont 53 % d'impressions totales en plus et 42 % d'impressions logistiques en moins que les témoins (une paire domine : sial-paris, 716 impr. logistiques, 54 clics). Au seuil 5, la position logistique diverge (13,5 contre 9,1). Comparer par évolution (J+28 contre référence) et par paire, jamais en niveau.
3. 6 des 10 fiches au seuil 20 ont une édition terminée à la date du jour (champ `fiches_edition_terminee_a_date` de groupes.json) : un bloc « Infos pratiques » sur une édition passée n'a pas la même utilité ni la même saisonnalité que sur une édition à venir. Le trafic logistique est saisonnier (pic autour des dates du salon) : la baisse post-salon touchera traités et témoins, mais l'écart peut être bruité.
4. L'hypothèse n'est pas appuyée par ces chiffres : le CTR sur requêtes logistiques (2,7 % à 5,4 %) est supérieur au CTR global des mêmes fiches (1,0 % à 2,2 %), à position logistique comparable ou meilleure. Les requêtes logistiques ne sont pas ici un angle mort de clic mesuré, au moins sur les fiches à plus fort volume.
5. Motifs logistiques par regex (mesure.ts, LOGI_FR / LOGI_EN), approximatifs : « exposants » et « liste » incluent des requêtes qui ne sont pas logistiques au sens strict.

## Refaire la mesure à J+28

Si le bloc est déployé le jour D, fenêtre = D+1 à D+28 (GSC final disponible à J+31) :

```bash
cd /Users/julienzakoian/Projects/showfinder && ./node_modules/.bin/tsx --env-file=.env.local tasks/infos-pratiques/mesure.ts measure <D+1> <D+28> tasks/infos-pratiques/mesure-j28
```

Sortie : `mesure-j28/mesure.json` (mêmes fiches, mêmes motifs, mêmes agrégats que reference.json). Pour la variante seuil 5, préfixer la commande par `OUT_SUFFIX=-seuil5`. Ne pas reconstruire les groupes avec `build` après coup : la liste figée est celle de groupes.json.
