# Roll 2027 : suivi hebdomadaire

Rapport alimenté chaque lundi par la routine cloud agoris-roll-2027-watch (détection des fiches publiées à édition passée, vérification des dates de la prochaine édition sur les sites officiels, handoffs dans handoffs/). Depuis le 2026-09-21 : la routine merge sa PR elle-même, puis .github/workflows/roll-apply.yml applique en base les roll-pret qui passent les garde-fous (scripts/roll-guards.ts). Résultats et rejets dans journal.json, refresh éditorial des fiches roulées via scripts/roll-apply-handoffs.ts --queue.

## Lot du 2026-09-21

| Slug | Ancienneté | Statut | Prochaine édition / raison | Source |
|------|-----------:|--------|------------------------------|--------|
| 3d-print-lyon | 109 jours | roll-pret | 15 et 16 septembre 2027, Eurexpo Lyon (passage de juin 3 jours à septembre 2 jours) | https://www.3dprint-exhibition-lyon.com |
| plastic-expo-lyon | 108 jours | roll-pret | 5 au 8 juin 2029, Eurexpo Lyon (rythme triennal confirmé, cohérent avec la fiche) | https://www.f-i-p.com |
| untec-congres | 108 jours | non-annoncee | Site figé sur l'édition 2026 (Illiade de Chartres), aucune date 2027 ; salon itinérant | https://www.actes-untec.com |
| transports-publics-paris | 102 jours | a-arbitrer | Changement de ville et de lieu : 31 mars au 1er avril 2027, Parc Expo Auvergne-Rhône-Alpes, Saint-Étienne (Mobco alterne Paris / régions) | https://mobco-expo.com/dates-lieu-et-acces/ |
| architect-at-work-lyon | 102 jours | a-arbitrer | website_url absent en base (retrouvé via WebSearch) ; calendrier officiel du réseau A@WX indique "Spring 2028" sans dates précises, saut de fréquence à arbitrer | https://www.architectatwork.com/fr/events/a@w-lyon |
| restau-co-paris | 96 jours | roll-pret | 16 juin 2027, Paris Expo Porte de Versailles hall 5.1 (bandeau d'accueil ambigu "fin septembre" à vérifier) | https://www.salonrestauco.com/evenement |

Reste à traiter : 0 fiche périmée. Ce lot a revérifié 6 fiches déjà couvertes par le complément du 2026-09-14 (la PR #97 n'était pas encore mergée au moment du run, le décompte initial de 29 l'ignorait). Les handoffs du 2026-09-21 font foi.

## Lot du 2026-09-14 (complément, 23 fiches)

Lot complémentaire traité le même jour à la demande de Julien, en dehors du rythme hebdomadaire habituel (6 fiches/semaine), pour vider le stock de fiches périmées restantes.

| Slug | Ancienneté | Statut | Prochaine édition / raison | Source |
|------|-----------:|--------|------------------------------|--------|
| 3d-print-lyon | 102 jours | a-arbitrer | Site annonce 15-16 septembre 2027 à Eurexpo Lyon, mais incohérence en base : edition_year=2027 alors que les dates actuelles sont celles de l'édition 2026 | https://www.3dprint-exhibition-lyon.com/ |
| untec-congres | 101 jours | non-annoncee | Site vivant, toujours sur l'édition 2026 (Chartres) ; salon itinérant, aucune date/ville 2027 publiée | https://www.actes-untec.com/ |
| plastic-expo-lyon | 101 jours | roll-pret | 5 au 8 juin 2029, Eurexpo Lyon (cohérent avec le rythme triennal) | https://www.f-i-p.com/ |
| architect-at-work-lyon | 95 jours | a-arbitrer | 17 au 18 mai 2028, Halle Tony Garnier Lyon, mais saut 2026 → 2028 incohérent avec frequency=annuel en base | https://www.architectatwork.com/en/events/a@w-lyon |
| transports-publics-paris | 95 jours | a-arbitrer | 31 mars au 1er avril 2027, mais déménagement Paris → Saint-Étienne (Parc Expo Auvergne-Rhône-Alpes) | https://mobco-expo.com/dates-lieu-et-acces/ |
| restau-co-paris | 89 jours | non-annoncee | Aucune date publiée ; commercialisation de la nouvelle édition annoncée pour fin septembre 2026 | https://www.salonrestauco.com |
| makeup-in-paris | 88 jours | roll-pret | 16 au 17 juin 2027, Carrousel du Louvre, Paris (lieu inchangé) | https://www.makeup-in-paris.com |
| eurosatory-paris | 87 jours | a-arbitrer | 19 au 23 juin 2028 (bisannuel), Paris confirmé mais nom exact du site d'exposition non confirmé | https://www.eurosatory.com/ |
| vivatech | 86 jours | roll-pret | 16 au 19 juin 2027, Paris Expo Porte de Versailles (lieu inchangé ; domaine officiel devenu vivatech.com) | https://vivatech.com/ |
| smarter-e-europe-munich | 81 jours | roll-pret | 8 au 10 juin 2027, Munich (Messe München), inchangé | https://www.thesmartere.de/home |
| playtime-paris | 77 jours | roll-pret | 30 janvier au 1er février 2027, Parc Floral de Paris ; année déduite des fichiers officiels (bannière WINTER-2027), à vérifier visuellement | https://www.iloveplaytime.com/playtime-paris/ |
| medi-nov-connection-lyon | 74 jours | a-arbitrer | Site annonce "2027 à Lyon" sans jour ni lieu précis | https://www.medinov-connection.com/ |
| japan-expo-paris | 64 jours | roll-pret | 8 au 11 juillet 2027, Paris Nord Villepinte, inchangé | https://www.japan-expo-paris.com |
| texworld-paris | 12 jours | roll-pret | 25 au 27 janvier 2027, Paris Le Bourget | https://texworld-paris.fr.messefrankfurt.com/paris/en.html |
| sibca-paris | 11 jours | non-annoncee | Site vivant, entièrement centré sur l'édition 2026, aucune date 2027 | https://www.sibca.fr |
| premiere-vision-paris | 11 jours | roll-pret | 26 au 28 janvier 2027, Paris Nord Villepinte | https://paris.premierevision.com/en |
| bijorhca-paris | 7 jours | roll-pret | 16 au 18 janvier 2027, Porte de Versailles Paris | https://wsn-events.com/events/bijorhca |
| interfiliere-paris | 7 jours | roll-pret | 16 au 18 janvier 2027, Porte de Versailles Paris (site interfiliere.com injoignable, HTTP 503 ; source = organisateur WSN) | https://wsn-events.com/events/interfiliere-paris |
| foire-chalons-en-champagne | 7 jours | roll-pret | 27 août au 6 septembre 2027, Châlons-en-Champagne | https://www.foiredechalons.com/ |
| whos-next-paris | 7 jours | roll-pret | 16 au 18 janvier 2027, Porte de Versailles Paris | https://wsn-events.com/events/whos-next |
| innov-agri-ondes | 4 jours | roll-pret | 26 au 27 mai 2027 à Grugies (Hauts-de-France) ; changement de ville, salon itinérant | https://www.innovagri.com/accueil-grugies |
| terres-de-jim | 1 jour | non-annoncee | Site à jour sur 2026 (Metz-Magny), aucune date ni ville 2027 publiée | https://www.lesterresdejim.com/ |
| cannes-yachting-festival | 1 jour | non-annoncee | Site à jour sur 2026, aucune date 2027 publiée | https://www.cannesyachtingfestival.com/ |

Reste à traiter : 0 fiche périmée

## Lot du 2026-09-14

| Slug | Ancienneté | Statut | Prochaine édition / raison | Source |
|------|-----------:|--------|------------------------------|--------|
| snack-show | 165 jours | roll-pret | 24 au 25 mars 2027, Pavillon 7.3, Paris Porte de Versailles | https://www.snackshow.com |
| comic-con-france | 148 jours | non-annoncee | Site officiel en base injoignable ; site lié (comiccon.fr) vivant mais figé sur l'édition 2026, aucune date 2027 | https://comiccon.fr |
| numeriquest-toulouse | 130 jours | a-arbitrer | Contradiction de lieu : fiche indique Centre de Congrès Pierre Baudis, site officiel décrit l'édition 2026 à l'auditorium Marthe Condat (Univ. Paul Sabatier) + ENSEEIHT ; aucune date 2027 | https://thcon.party |
| foire-de-paris | 126 jours | a-arbitrer | 30 avril au 10 mai 2027, Paris (lieu exact non reconfirmé) ; site officiel foiredeparis.fr bloqué (403) | https://www.comexposium.com (organisateur) |
| salon-agriculture-nouvelle-aquitaine | 106 jours | non-annoncee | Site figé sur l'édition 2026 (22 au 31 mai, déjà passée), aucune date 2027 | https://www.foiredebordeaux.com/salon-agriculture |
| ready-for-it-monaco | 102 jours | a-arbitrer | 1er au 3 juin 2027, Monaco (lieu exact non reconfirmé) ; site officiel ready-for-it.com bloqué (403) | https://www.comexposium.com (organisateur) |

Reste à traiter : 23 fiches périmées

## Lot du 2026-09-11

| Slug | Ancienneté | Statut | Prochaine édition / raison | Source |
|------|-----------:|--------|------------------------------|--------|
| preventica-paris | 456 jours | non-annoncee | Paris absent des éditions 2026 annoncées (Rennes, Lyon, Casablanca) ; salon bisannuel, retour à Paris non daté | https://www.preventica.com |
| salon-etudiant-ile-de-france | 222 jours | roll-pret | 29 au 30 janvier 2027, Paris Expo Porte de Versailles (Halls 5.2 et 5.3) | https://salon-de-l-etudiant-en-ile-de-france-paris.salon.letudiant.fr |
| salon-habitat-bordeaux | 187 jours | roll-pret | 5 au 7 mars 2027, Parc des Expositions de Bordeaux (Hall 3) | https://leopro.fr/salon-habitat-deco-bordeaux/ |
| foire-agricole-tarbes | 187 jours | non-annoncee | Site figé sur la 49e édition (5 au 8 mars 2026, déjà passée), aucune date 2027 | https://www.salon-agricole.com |
| salon-mondial-du-tourisme-paris | 180 jours | site-mort | Domaine salon-mondial-tourisme.com mort (DNS) ; site successeur salons-du-tourisme.com bloqué par Cloudflare (403), aucune date vérifiable | (aucune source accessible) |
| salon-energie-habitat-colmar | 172 jours | non-annoncee | Site figé sur la 45e édition (20 au 23 mars 2026, déjà passée), aucune date 2027 | https://www.energiehabitat-colmar.com |

Reste à traiter : 27 fiches périmées
