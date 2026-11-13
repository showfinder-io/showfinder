# Coordonnées héritées du seed d'avril : revérification des 6 fiches, 2026-11-13

Méthode : état en base lu par REST (clé anon, SELECT seul) ; sites officiels re-fetchés le 2026-11-13 (`curl -sL -A "Mozilla/5.0 Chrome/120"`, HTML brut, e-mails Cloudflare décodés) ; registre `recherche-entreprises.api.gouv.fr` (siège, P4). Règle appliquée : un téléphone ou un e-mail n'est gardé que si le site officiel l'associe explicitement à la société (ou à l'entité de la fiche). Rien n'a été écrit en base ni dans le code. Le JSON-LD de la page émet `telephone` et `email` dès que les champs sont non nuls (`src/app/[locale]/prestataires/[slug]/page.tsx` l.159-160), d'où l'enjeu.

Statut : **confirmé** = lu sur la page citée le 2026-11-13. **Assumé** = déduit, marqué comme tel.

## 1. gl-events-venues-lyon (GL Events Venues)

État en base : city Lyon, postal_code null, department 69, website https://www.gl-events.com, phone 04 78 17 60 00, email contact@gl-events.com.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | OK (confirmé) | https://www.gl-events.com répond 200 et redirige vers https://www.gl-events.com/fr (même domaine). La page https://www.gl-events.com/fr/venues existe (titre "Location de lieux événementiels \| GL events Venues"). |
| phone 04 78 17 60 00 | **À retirer** | Absent du site. Le seul numéro publié est celui du siège du groupe : "GL EVENTS / 59 Quai Rambaud / 69002 Lyon / T: +33 (0)4 78 176 176" (https://www.gl-events.com/fr/contactez-nous). Il est présenté comme "Siège Social de GL events", pas comme contact de GL events Venues ; la page https://www.gl-events.com/fr/venues n'a qu'un formulaire de contact, sans numéro. Valeur à null. |
| email contact@gl-events.com | **À retirer** | Absent du site. Seule adresse trouvée : communication@gl-events.com, dans les mentions légales (https://www.gl-events.com/fr/mentions-legales-cgu), éditeur GL events Support (SNC, RCS Lyon 480 086 768, Brignais), pas Venues. Valeur à null. |
| city / postal_code / department | À compléter : postal_code 69002 | Registre : SIREN 495014524 GL EVENTS VENUES, active, créée le 2007-04-01, siège 59 QUAI RAMBAUD 69002 LYON, dép. 69. Ville et département déjà corrects ; code postal manquant. |

Option laissée à la décision de Julien (non mise dans le JSON) : le standard du groupe +33 4 78 176 176 est publié pour GL events, dont GL events Venues est une filiale au même siège ; il est véridique mais n'est pas explicitement celui de l'entité de la fiche.

## 2. mci-france-paris (MCI France)

État en base : city Paris, postal_code null, department 75, website https://www.mci-group.com, phone 01 53 85 35 00, email paris@mci-group.com.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | OK (confirmé) | https://www.mci-group.com répond 200 (pas de redirection). Site mondial "mci group", pas de page France. |
| phone 01 53 85 35 00 | **À retirer** | Aucun numéro français sur https://www.mci-group.com/contact/ (formulaire mondial, liste de pays) ni sur l'accueil. |
| email paris@mci-group.com | **À retirer** | Absent. Seule adresse publiée : privacy@mci-group.com, délégué à la protection des données du groupe (https://www.mci-group.com/privacy-policy/). Pas un contact MCI France. |
| city / postal_code / department | **À corriger (assumé)** : Levallois-Perret, 92300, 92 | Registre : aucune société "MCI France" à Paris. Candidate : SIREN 414540252 "MCI GROUP FRANCE (MCI FRANCE - MATTER - OVATION - BLACK FLOWER AGENCY - MCI SPORTS)", active, créée le 1997-11-19, activité 82.30Z, siège 25-29 RUE ANATOLE FRANCE 92300 LEVALLOIS-PERRET. Réserve : mci-group.com ne nomme aucune entité juridique française, donc le rattachement fiche vers SIREN repose sur le nom commercial du registre (assumé, non confirmé par le site). Les autres "MCI FRANCE" du registre (Drancy, Saillenard, Boulogne-Billancourt, Cavalaire) sont des homonymes sans lien établi. Si Julien juge le rattachement trop faible : ne pas appliquer ces trois champs et laisser Paris 75 tel quel (il est de toute façon non étayé). |

## 3. pico-international-paris (Pico International France)

État en base : city Paris, postal_code null, department null, website https://www.pico.com, phone 01 56 09 10 00, email france@pico.com.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | OK (confirmé) | https://www.pico.com répond 200 et redirige vers https://www.pico.com/en (même domaine). Site mondial "Pico Group", "offices in 38 cities", aucune mention de la France ni de Paris. |
| phone 01 56 09 10 00 | **À retirer** | Aucun numéro sur le site (la page https://www.pico.com/en/contact-us renvoie 404 ; la section contact de l'accueil est un formulaire). |
| email france@pico.com | **À retirer** | Absent. Adresses publiées : corp.info@pico.com (données personnelles), dpo@pico.com, careers@pico.com : toutes groupe, aucune France. |
| city / postal_code / department | **Non résolu : aucun changement proposé** | Registre : SIREN 507671485 "PICO INTERNATIONAL FRANCE", active, créée le 2008-07-01, 82.30Z, siège ZAE DES PERRUCHES, 26 RUE DE PISCOP 95350 SAINT-BRICE-SOUS-FORET (dép. 95), aucun dirigeant listé. Le site pico.com ne nomme aucune entité française : le lien entre cette société et le groupe Pico n'est pas confirmé (cohérent avec la dé-vérification du 2026-09-21). La base dit Paris, que le registre contredit ; mais remplacer par Saint-Brice-sous-Forêt reviendrait à affirmer un rattachement non prouvé. À trancher : soit appliquer 95350 / Saint-Brice-sous-Forêt / 95 (nom identique, société active), soit laisser. Mon avis : laisser tant que la fiche est noindex et dé-vérifiée, et sortir Paris dès qu'une source relie les deux. |

## 4. db-schenker-paris (DB Schenker France)

État en base : city Paris, postal_code null, department null, website https://www.dbschenker.com/fr, phone 01 49 89 46 00, email events.france@dbschenker.com.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | **Redirige ailleurs (confirmé)** | https://www.dbschenker.com/fr répond 200 après redirection 301 vers https://www.dsv.com/fr-fr/?utm_source=schenker&utm_medium=301. Message du site : "dbschenker.com a été fusionné avec DSV.com" ; actualité "DSV intègre Schenker en France" (https://www.dsv.com/fr-fr/). Valeur proposée : https://www.dsv.com/fr-fr/ (sans paramètres de suivi). |
| phone 01 49 89 46 00 | **À retirer** | Absent de https://www.dsv.com/fr-fr/ et de https://www.dsv.com/fr-fr/aide/aide-et-contact (aucun numéro "Schenker France" ; seul numéro des mentions légales : +45 43 20 30 40, DSV Danemark). |
| email events.france@dbschenker.com | **À retirer** | Absent ; seule adresse : privacy@dsv.com (https://www.dsv.com/fr-fr/a-propos-de-dsv/mentions-legales). Le domaine dbschenker.com ne sert plus de site. |
| city / postal_code / department | **Non résolu : aucun changement proposé** | Registre : aucune entité "DB Schenker France" ; seules entités françaises "DB SCHENKER" : SIREN 900438441 DB SCHENKER HAUTS DE FRANCE, siège 59262 Sainghin-en-Mélantois (agence régionale, pas le siège France). Le site ne nomme aucune entité juridique. Paris 75 non étayé mais aucune alternative sourcée ; cohérent avec la fiche non vérifiée et non indexable (décision du 2026-09-21). |

## 5. potel-et-chabot-paris (Potel et Chabot)

État en base : city Paris, postal_code null, department 75, website https://www.poteletchabot.com, phone null, email null.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | **Redirige ailleurs (confirmé)** | https://www.poteletchabot.com répond 301 vers https://groupepoteletchabot.com/ (200). Le site est celui du "Groupe Potel et Chabot" ; les mentions légales (https://groupepoteletchabot.com/mentions-legales) désignent l'éditeur "Potel et Chabot, Société par actions simplifiée ... 3 rue de Chaillot 75016 Paris". Valeur proposée : https://groupepoteletchabot.com/. |
| phone | OK (null) | Aucun numéro publié sur l'accueil ni sur les mentions légales (aucun lien `tel:`). Rien à ajouter. |
| email | **À renseigner** : contact@groupepoteletchabot.com | Mentions légales, bloc "Éditeur du site : Potel et Chabot, SAS ... 3 rue de Chaillot 75016 Paris ... Email : contact@groupepoteletchabot.com" (https://groupepoteletchabot.com/mentions-legales). Association explicite à la société de la fiche. |
| city / postal_code / department | À compléter : postal_code 75016 | Mentions légales : "3 rue de Chaillot 75016 Paris, RCS Paris 552 043 754". Registre : SIREN 552043754 POTEL ET CHABOT, active, créée le 1955-01-01, siège 3 RUE DE CHAILLOT 75016 PARIS. Ville et département corrects. |

## 6. novelty-paris (Novelty)

État en base : city Paris, postal_code null, department 75, website https://www.novelty.fr, phone null, email null.

| Champ | Verdict | Preuve |
|---|---|---|
| website_url | OK (confirmé) | https://www.novelty.fr répond 200, pas de redirection. |
| phone | **À renseigner** : +33 1 64 54 26 28 | Pied de page de l'accueil et page https://www.novelty.fr/contact/ : "Novelty / ZI La Vigne aux Loups, Rue George Sand / 91160 Longjumeau / FRANCE / +(33) 1 64 54 26 28" (lien `tel:+(33) 1 64 54 26 28`). Numéro publié par Novelty comme son contact. Réserve : c'est l'adresse de Longjumeau, pas du siège parisien ; le numéro reste celui de la société. |
| email | **À renseigner** : contact@novelty.fr | Même bloc de contact (adresse protégée par Cloudflare, décodée du HTML : contact@novelty.fr) sur https://www.novelty.fr/contact/ et en pied de page. |
| city / postal_code / department | À compléter : postal_code 75007 | Mentions légales : "NOVELTY SASU ... siège ... 86 Boulevard de la Tour Maubourg 75007 PARIS ... B 419 822 408" (https://www.novelty.fr/mentions-legales/). Registre : SIREN 419822408 NOVELTY, active, créée le 1997-12-20, siège 86 BOULEVARD DE LA TOUR-MAUBOURG 75007 PARIS. Ville et département corrects. |

## Synthèse des changements

| Slug | Changements |
|---|---|
| gl-events-venues-lyon | phone null, email null, postal_code 69002 |
| mci-france-paris | phone null, email null, city/postal_code/department Levallois-Perret / 92300 / 92 (assumé, voir §2) |
| pico-international-paris | phone null, email null ; adresse laissée (non résolu) |
| db-schenker-paris | phone null, email null, website_url dsv.com/fr-fr ; adresse laissée (non résolu) |
| potel-et-chabot-paris | website_url groupepoteletchabot.com, email contact@groupepoteletchabot.com, postal_code 75016 |
| novelty-paris | phone +33 1 64 54 26 28, email contact@novelty.fr, postal_code 75007 |

Format des numéros : celui de la base est "01 49 89 46 00" ; le numéro Novelty est donné en "01 64 54 26 28" dans le JSON (même numéro que +33 1 64 54 26 28), à harmoniser si le front l'exige.

```json
[
  {"slug": "gl-events-venues-lyon", "set": {"phone": null, "email": null, "postal_code": "69002"}},
  {"slug": "mci-france-paris", "set": {"phone": null, "email": null, "city": "Levallois-Perret", "postal_code": "92300", "department": "92"}},
  {"slug": "pico-international-paris", "set": {"phone": null, "email": null}},
  {"slug": "db-schenker-paris", "set": {"phone": null, "email": null, "website_url": "https://www.dsv.com/fr-fr/"}},
  {"slug": "potel-et-chabot-paris", "set": {"website_url": "https://groupepoteletchabot.com/", "email": "contact@groupepoteletchabot.com", "postal_code": "75016"}},
  {"slug": "novelty-paris", "set": {"phone": "01 64 54 26 28", "email": "contact@novelty.fr", "postal_code": "75007"}}
]
```
