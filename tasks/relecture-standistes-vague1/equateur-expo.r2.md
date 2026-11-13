# equateur-expo : OK

Seconde relecture indépendante, 2026-11-13. Page publiée relue en direct (FR et EN, JSON-LD) avant lecture du rapport de première passe.

## Constats
- Identité : la recherche par nom renvoie SIREN 398814376 "EQUATEUR EXPO" (créée 1994-11-01) CESSÉE le 2026-06-17 (3 établissements fermés). L'entité exploitante est SIREN 404906836 "ACTIVISE (EQUATEUR)", créée 1996-04-02, active, même adresse 15 rue Hégésippe Moreau 75018 Paris, enseigne EQUATEUR. Les mentions légales du site disent : "Nom : Equateur Expo / Activise ... Siège social : 15 rue hégésippe moreau, 75018, Paris ... SIRET : 40490683600048" (https://equateur-expo.fr/mentions-legales/). Le site est vivant. La fiche reste ouvrable ; aucune phrase du texte ne dépend du statut juridique.
- Adresse : JSON-LD Paris 75018, conforme au siège. Le texte cite "15 rue Hégésippe Moreau, dans le 18e arrondissement" : confirmé par les mentions légales et par https://equateur-expo.fr/standiste-paris/ ("15 rue hégésippe moreau, 75018 Paris").
- Texte FR, affirmation par affirmation :
  - "conçoit, fabrique et installe des stands" : "conçoit, fabrique et installe des stands d'exposition en France comme à l'international" (https://equateur-expo.fr/rse/).
  - "sur mesure, modulables et hybrides" : menu et accueil.
  - "bureau d'études intégré réunissant architectes, designers et chefs de projet" : "notre bureau d'étude pluridisciplinaire : architectes, designers, chefs de projets, graphistes et techniciens" (accueil) ; "Notre bureau d'études intégré" (/standiste-paris/).
  - "bureaux, retail, showrooms et restaurants" : menu "Aménagement et architecture d'intérieur" et sous-pages.
  - "plus de trois décennies" : "Depuis plus de 30 ans" (accueil).
  - "médaillée EcoVadis Gold" : "Agence médaillée EcoVadis Gold, parmi les 5% des entreprises les mieux notées" (accueil, /rse/) ; la fiche n'en reprend pas le classement : bien.
  - "adhère à l'UNIMEV" : "Notre agence est membre de l'UNIMEV ... et du réseau LEADS" (accueil).
  - Zone "partout en France et à l'international" : "Oui, nos équipes interviennent partout en France et à l'international" (/standiste-paris/), verbatim.
  - Aucune référence client, aucun chiffre, aucun label autre que EcoVadis Gold et UNIMEV : P7, P8, P12 respectés. Première occurrence du nom en graphie "Équateur Expo" (le site écrit "Equateur Expo" sans accent dans ses mentions et "Équateur" dans le texte courant) : acceptable (P18).
- FR et EN cohérents, mêmes faits. specialties conformes au menu ; memberships leads_france confirmé par le site et par https://leads-france.com/agences/equateur-expo/.
- JSON-LD publié : plus de téléphone ni d'e-mail, pas de foundingDate : cohérent avec founded_year null (1994 LEADS "Née en 1994", 1996 Activise, site "plus de 30 ans").

## Remarques non bloquantes
- Désaccord factuel avec la passe 1 sur le téléphone : la passe 1 écrit qu'aucun numéro n'est publié sur /standiste-paris/. Or cette page affiche, juste sous l'adresse, "15 rue hégésippe moreau, 75018 Paris / 01 42 46 75 53", avec un lien tel:0142467553 (https://equateur-expo.fr/standiste-paris/). Le numéro 01 42 46 75 53 est donc sourçable. Ajout facultatif, pas une correction d'erreur : `{"slug": "equateur-expo", "set": {"phone": "01 42 46 75 53"}}`. L'ancien numéro du seed (+33 1 49 30 76 76) reste introuvable : son retrait est bon.
- L'ancienne adresse e-mail du seed (info@equateur-expo.fr) et l'adresse de Villiers-sur-Marne (94350) viennent de la fiche LEADS, périmée sur ces deux points ; à ne pas reprendre.
- Nuance sur "fabrique" : le site le dit (/rse/), mais la page https://equateur-expo.fr/stand-sur-mesure/ décrit l'étape fabrication comme "coordination de la fabrication, de la menuiserie, de la signalétique et des animations via notre réseau de partenaires". La fiche ne dit pas "atelier intégré", donc rien à changer ; à surveiller si un hub oppose standistes fabricants et agences.
- Le site appartient au même cercle que Arc et Typ (e-mail des mentions légales en @arcettyp.com), confirmé.

## Désaccords avec la passe 1
Un seul : le téléphone 01 42 46 75 53 existe sur /standiste-paris/ (voir ci-dessus). Pour le reste, accord (identité Activise, phone et e-mail du seed à null, texte inchangé), et la page publiée reflète ces corrections.

## Correction retenue (vérifiée par la session le 2026-11-13 : lien tel:0142467553 sur https://equateur-expo.fr/standiste-paris/)

```json
{"slug": "equateur-expo", "set": {"phone": "01 42 46 75 53"}}
```
