# square-meters-paris : CORRECTIONS

Seconde relecture indépendante, 2026-11-13. Page publiée relue en direct (FR et EN, JSON-LD) avant lecture du rapport de première passe.

## Constats
- Identité : mentions légales du site, "Square Meters International, société par actions simplifiée ... 803 926 187 R.C.S. PARIS, dont le siège social est 20 rue Chauchat, 75009 Paris" (https://www.squaremetersparis.com/general-5). Registre : SIREN 803926187 "SQUARE METERS INTERNATIONAL (SQUARE METERS PARIS)", créée 2014-08-01, active, 20 rue Chauchat 75009 Paris. Le SIREN 800796781 "SQUARE METERS PARIS" (créé 2014-02-14, même adresse) est cessé depuis 2026-04-07 et a pour dirigeant Square Meters International : même groupe, pas un homonyme. "Fondée en 2014" est donc juste pour les deux entités ; l'année n'est pas déclarée par le site, elle vient du registre (admis par P8).
- Adresse JSON-LD Paris 75009, conforme. Téléphone 06 61 72 61 09 et e-mail bmzahner@squaremetersparis.com : "Bernard-Max Zahner associé / directeur du développement Tel: +33.6.61.72.61.09 bmzahner@squaremetersparis.com" (https://www.squaremetersparis.com/notre-equipe), repris dans les mentions légales. Conforme (coordonnées nominatives publiées comme contact de la société).
- Texte FR, affirmation par affirmation :
  - "conçoit, produit et installe des stands d'exposition" : "Nous concevons, fabriquons et installons des stands de 15m2 à plus de 300m2 pour les foires et salons en France et à l'international" (https://www.squaremetersparis.com/stands).
  - pop-up stores et boutiques, showrooms, lounges réceptifs, bureaux : menu d'accueil "STANDS D'EXPOSITION / POP'UP STORES & BOUTIQUES / SHOWROOMS & EXPOSITIONS / LOUNGES RÉCEPTIFS / AMENAGEMENT DE BUREAUX".
  - "normes RSE et ISO 20121" : "Nous respectons les normes RSE et ISO 20121, mises en place pour les métiers de l'évènementiel" ; la fiche dit "applique", pas "certifiée" : correct.
  - "artisans français" : "nous nous engageons à favoriser le recours à des artisans français" (accueil).
  - Références CGI Finance (aménagement de bureaux), Kuehne+Nagel (stand d'exposition), ministère de la Défense (stand d'exposition) : toutes sur https://www.squaremetersparis.com/nos-projets-1 ("CGI FINANCE", "KUEHNE+NAGEL", "MINISTERE DE LA DEFENSE", avec leur type). Trois références, sans adjectif : P7 respecté. Les 3 sont vraiment publiées, aucune ne vient d'une version périmée.
  - Aucun chiffre autre que 2014, aucun label : P8, P12 respectés.
- EN fidèle ("the French Ministry of Defence" pour "ministère de la Défense" : traduction acceptable d'un nom d'institution). memberships leads_france confirmé ("Nous sommes membres du LEADS", accueil). specialties conformes au menu.
- Catégorie standiste : confirmée (stands d'exposition en premier, "concevons, fabriquons et installons").

## Correction proposée (mineure)
`zone_intervention` = "International" est incomplet par rapport à la source : le site écrit "des stands ... pour les foires et salons en France et à l'international" (https://www.squaremetersparis.com/stands). "International" seul, publié dans le JSON-LD (areaServed) et sur la fiche, suggère l'absence d'activité en France, ce que P13 interdit de laisser entendre. Remplacer par la formule du site.

## Remarques non bloquantes
- Le téléphone est un mobile nominatif (06) d'un associé. Publié par le site comme contact, donc repris légitimement ; à surveiller si l'intéressé demande son retrait (RGPD).
- Le site contient des pages de test Wix (https://www.squaremetersparis.com/our-story avec "info@mysite.com") : sans effet sur la fiche.
- La fiche LEADS (https://leads-france.com/agences/square-meters-paris/) parle d'une expérience "depuis plus de 15 ans" des fondateurs : pas utilisé, pas contradictoire.

## Désaccords avec la passe 1
Un seul : la passe 1 range `zone_intervention` "International" parmi les remarques non bloquantes "à passer à France et international à l'occasion" et conclut OK ; je la traite comme une correction, car le champ est publié (page et JSON-LD) et la source dit explicitement "France et à l'international". Pour le reste, accord complet sur les faits, les références et l'identité (la passe 1 qualifie l'autre SIREN de "hors sujet", c'est en fait l'ancienne entité du même groupe).

```json final
{"slug": "square-meters-paris", "set": {"zone_intervention": "France et à l'international"}}
```
