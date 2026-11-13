# equateur-expo : CORRECTIONS

Relu le 2026-11-13 : site officiel (https://equateur-expo.fr/, /mentions-legales/, /rse/, /standiste-paris/, /briefez-nous/), registre, page publiée https://www.agoris.io/prestataires/equateur-expo (noindex, follow).

1. Identité (point d'attention, pas un blocage) : la recherche par nom renvoie EQUATEUR EXPO, SIREN 398814376, créée le 1994-11-01, mais état CESSÉE depuis le 2026-06-17 (même adresse). La société exploitante est ACTIVISE (nom commercial EQUATEUR), SIREN 404906836, créée le 1996-04-02, 15 rue Hégésippe Moreau 75018 Paris, ACTIVE, enseigne "EQUATEUR". Preuve : mentions légales du site, "Nom : Equateur Expo / Activise ... Siège social : 15 rue hégésippe moreau, 75018, Paris ... SIRET : 40490683600048 puis RCS Paris" (https://equateur-expo.fr/mentions-legales/, mise à jour le 27 avril 2026). L'entité de 1994 a donc disparu, l'activité continue sous Activise, même adresse. Le site est vivant (mis à jour le 11 novembre 2026). La fiche reste ouvrable. Le site appartient au même cercle que Arc et Typ (l'e-mail des mentions légales est en @arcettyp.com).
2. Adresse : 15 rue Hégésippe Moreau, Paris 18e (mentions légales). Base : Paris, 75018, 75 : conforme.
3. Contacts :
   - téléphone "+33 1 49 30 76 76" : introuvable sur le site (accueil, /briefez-nous/, /mentions-legales/, /rse/, /standiste-paris/ : aucun numéro, formulaire seul). Passer à null.
   - e-mail "info@equateur-expo.fr" : introuvable sur le site (il sort pourtant dans le JSON-LD de la fiche Agoris). Le seul e-mail publié est celui des mentions légales, benoit.cara@arcettyp.com, adresse nominative du dirigeant sur un autre domaine : je ne le propose pas. Passer à null.
4. Description :
   - "bureaux parisiens ... 15 rue Hégésippe Moreau, dans le 18e arrondissement" : mentions légales ; "Equateur Expo est installée à Paris, dans le 18e arrondissement" (/standiste-paris/).
   - "conçoit, fabrique et installe des stands" : "Equateur Expo est une agence de stands parisienne qui conçoit, fabrique et installe des stands d'exposition" (/rse/).
   - "sur mesure, modulables et hybrides" : menu et accueil. "bureau d'études intégré réunissant architectes, designers et chefs de projet" : "notre bureau d'études pluridisciplinaire : architectes, designers, chefs de projets, graphistes et techniciens" (accueil).
   - "bureaux, retail, showrooms et restaurants" : menu et accueil.
   - "plus de trois décennies" : "Depuis plus de 30 ans" (accueil). Le registre donne 1994 pour l'ancienne entité, 1996 pour Activise : le site prime, formulation attribuable.
   - "médaillée EcoVadis Gold" : "Agence médaillée EcoVadis Gold" (accueil et /rse/).
   - "adhère à l'UNIMEV" : "Notre agence est membre de l'UNIMEV ... et du réseau LEADS" (accueil). Remarque P5 non bloquante : la mention d'adhésion à une fédération est dans le texte ; `memberships` porte déjà leads_france, UNIMEV n'est pas dans le vocabulaire v1 (P23). Texte conservé.
   - Aucune référence client citée : P7 sans objet.
5. founded_year null : correct (écart 1994 / 1996 / "plus de 30 ans"). specialties cohérentes. memberships leads_france confirmé par le site.
6. Catégorie : standiste ("Standiste & créateur de stands sur mesure") : confirmé.

Correction : phone et email à null. Texte inchangé.

```json
{"slug": "equateur-expo", "set": {"phone": null, "email": null}}
```
