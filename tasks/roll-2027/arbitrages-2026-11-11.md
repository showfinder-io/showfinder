# Arbitrages roll 2027 du 2026-11-11

Les 20 handoffs au statut `a-arbitrer` dans `tasks/roll-2027/handoffs/`. Chaque source a été relue le 2026-11-11 : curl, ou Chrome quand curl était bloqué (Architect@Work, NRF, SILMO). L'état en base a été lu le même jour.

Rappel : `roll-apply-handoffs.ts` ne touche que `start_date`, `end_date` et `edition_year`. Toute décision qui change ville, lieu, nom, fréquence ou statut passe par un script `diag-*` dédié après ton go, puis par le process writer + reviewers pour le MDX.

## A. Déjà réglés en base (6) : rien à décider

Le handoff est resté en `a-arbitrer` alors que la fiche a été mise à jour. Le journal fait foi ; les handoffs sont laissés tels quels (le script du 2026-09-21 ne les modifiait pas non plus, et la routine ne les régénère plus puisque les fiches ne sont plus périmées).

| Fiche | État en base | Comment |
|---|---|---|
| eurosatory-paris | 19-23 juin 2028, Villepinte | appliqué en session le 2026-09-21 (journal) |
| foire-de-paris | 30 avril-10 mai 2027, Porte de Versailles | appliqué le 2026-09-21 |
| innorobo-by-sido | 15-16 sept. 2027, Eurexpo Lyon | appliqué le 2026-09-21 |
| maison-objet-paris | 14-18 janv. 2027, Villepinte | appliqué le 2026-09-21 |
| ready-for-it-monaco | 1-3 juin 2027, Grimaldi Forum | appliqué le 2026-09-21 |
| transports-publics-paris | fiche remplacée par `mobco` (31 mars 2027, Saint-Étienne), 301 dans next.config.ts | rien |

Réserve : le lieu 2028 d'Eurosatory (Villepinte) n'est toujours écrit nulle part sur le site officiel.

## B. Source claire, roulées (8) : APPLIQUÉ le 2026-11-11

Go Julien le 2026-11-11, appliqué par `scripts/diag-roll-arbitrages-2026-11-11-apply.ts --apply` (relance : « DÉJÀ APPLIQUÉ » partout). Coordonnées alignées sur celles du lieu quand il change ; innorobo-by-sido corrigée au passage.

| Fiche | Proposition | Source relue le 2026-11-11 | Change aussi |
|---|---|---|---|
| silmo-paris | 24-27 sept. 2027, Paris Nord Villepinte | silmoparis.com (Chrome) : « 24 > 27 SEPT. 2027 », « PARIS NORD VILLEPINTE » | rien |
| medi-nov-connection-lyon | 30 juin-1er juil. 2027, Centre de Congrès de Lyon | medinov-connection.com : texte + JSON-LD concordants | rien |
| aerospace-test-development-show | 28-29 sept. 2027, MEETT Toulouse | « 28-29 September 2027, Hall 7, MEETT » 4 fois dans le texte. Le JSON-LD est incohérent (début 2027-09-29, fin 2026-09-30) : je l'écarte | rien |
| batimat | 2-5 oct. 2028, Paris Expo Porte de Versailles | batimat.com : « 02 au 05 octobre 2028 Paris, Porte de Versailles » | lieu en base corrigé (Villepinte -> Porte de Versailles) : l'édition 2026 était déjà à Porte de Versailles (bilan RX du 14 octobre 2026), la base se trompait |
| ideobain | 2-5 oct. 2028, Paris Expo Porte de Versailles | ideobain.com : même formule que Batimat, meta description à jour | lieu en base corrigé, même constat que Batimat (FAQ Idéobain 2026 : pavillon 7.2) |
| natexpo-paris | 26-28 sept. 2027, Paris Expo Porte de Versailles (pavillon 7.2) | natexpo.com : « Du dimanche 26 au mardi 28 septembre 2027 » | ville (Lyon -> Paris) et lieu, alternance annuelle annoncée |
| tranofiliere-paris (Tranoï) | 4-7 mars 2027, Palais Brongniart | tranoi.com : « 4 - 7 MARCH », « Palais Brongniart, PARIS » | lieu en base corrigé (Palais de Tokyo -> Brongniart) : l'édition d'octobre 2026 était déjà au Palais Brongniart (tranoi.com/e/paris/fr), la base se trompait ; `frequency` annuel -> semestriel (deux éditions Paris par an : mars et fin septembre) |
| luxe-pack-monaco | 4-6 oct. 2027, Grimaldi Forum | luxepackmonaco.com : « Grimaldi Forum \| 4-6 oct. 2027 » | `name` -> « Luxe Pack World » (le site : « En 2027, LUXE PACK Monaco devient LUXE PACK WORLD »), slug conservé |

Tous les lieux cibles existent déjà dans `venues` : paris-expo-porte-de-versailles, palais-brongniart. Jours de semaine contrôlés, aucun incohérent.

## C. Il faut ta décision (6) : DÉCIDÉ le 2026-11-12

Go Julien sur toutes les recommandations. Appliqué le 2026-11-12 : dépublication + 301 d'equipbaie-metalexpo-paris et paris-retail-week ; untec-congres, numeriquest-toulouse et architect-at-work-lyon avec leur texte refait dans le même lot (CLAUDE.md règle 14(f)). Reste paris-design-week : dates 2027 à lire par Julien.

| Fiche | Constat (source relue) | Ma recommandation | Alternative |
|---|---|---|---|
| equipbaie-metalexpo-paris | Fusionné dans Batimat depuis 2024 (« Equipbaie-Métalexpo by Batimat », 3 pavillons). equipbaie.com figé sur 2024. En base, la fiche dit Porte de Versailles en texte mais pointe le même `venue_id` que Batimat | Dépublier + 301 FR/EN vers /salons/batimat, comme SEPAG | Garder une fiche « Equipbaie by Batimat » avec les dates Batimat 2028 |
| paris-retail-week (NRF Retail's Big Show Europe) | nrfbigshoweurope.com (Chrome) : « will return to Amsterdam in late September 2028 », sans jour ni lieu. Le salon quitte Paris | Dépublier + 301 vers le hub secteur commerce : le slug dit Paris, l'édition suivante n'y est plus | Garder, ville Amsterdam, édition 2028, dates nulles, `dates_confirmed=false` |
| untec-congres (Salon Actes) | actes-untec.com : édition 2027 au Parc des Expositions et Congrès de Dijon, aucune date | Passer à l'édition 2027, Dijon, lieu parc-des-expositions-de-dijon (existe), dates nulles, `dates_confirmed=false` : la fiche cesse d'annoncer Chartres | Attendre les dates |
| architect-at-work-lyon | architectatwork.com (Chrome) : « Prochaine edition : Printemps 2028 », 8e édition en 2026 | `frequency` annuel -> bisannuel, `website_url` = https://www.architectatwork.com/fr/events/a@w-lyon (vide en base), dates laissées en l'état jusqu'à l'annonce | Dates nulles + édition 2028 dès maintenant |
| numeriquest-toulouse (THCon) | thcon.party : conférences « April 29th & 30th, 2027 - Save the date ! », auditorium Marthe Condat, Université Paul Sabatier. La fiche dit Centre de Congrès Pierre Baudis : lieu faux, déjà en 2026 | Rouler au 29-30 avril 2027, lieu -> universite-paul-sabatier-toulouse (existe) | Rouler les dates seules et corriger le lieu plus tard |
| paris-design-week | Site derrière Incapsula, illisible pour curl et le Chrome piloté. `website_url` corrigée le 2026-11-11 | Que tu ouvres https://www.maison-objet.com/paris-design-week une fois et me donnes les dates 2027 | Laisser en l'état |

## Après ta décision

- B : un script `scripts/diag-roll-arbitrages-2026-11-11-apply.ts` (dry-run puis `--apply`), handoffs passés en `applique`, journal mis à jour.
- B et C : MDX FR+EN des fiches qui changent de ville, de lieu ou de nom (natexpo, batimat, ideobain, tranoï, luxe-pack, untec, THCon) mis en file pour le process writer + reviewers : le roll ne touche jamais au MDX.
- Request Indexing des fiches roulées au quota suivant.
