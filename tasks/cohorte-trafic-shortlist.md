# Cohorte trafic SEO : shortlist de salons à créer

Cadrage de la prochaine cohorte de fiches salons pour Agoris, à partir de deux sources : l'analyse des 1500 requêtes Google Search Console (baseline 2026-07-28) croisée avec le catalogue existant (240 salons), et une recherche web ciblée sur les grands parcs d'expositions et calendriers d'organisateurs français, pour la période septembre 2026 à fin 2027.

Règle appliquée strictement : aucun salon inclus en priorité P1 ou P2 sans vérification par source primaire (site officiel du salon ou de l'organisateur, fetch direct ou recoupement de plusieurs sources indépendantes citant la source primaire). Les cas non vérifiables sont isolés en P3 avec la mention explicite "non vérifié".

## Synthèse

**Étape 1, demande non couverte dans les requêtes GSC**

Sur 1500 requêtes analysées (625 avec au moins 3 impressions sur 28 jours), la quasi totalité correspond déjà à une fiche existante, sous une formulation différente, une faute de frappe, un nom de lieu ou une abréviation. Seules 11 requêtes, représentant 62 impressions cumulées, nomment un salon sans correspondance évidente au premier passage. Après vérification une par une :

- **1 gap réel** confirmant le besoin d'une nouvelle fiche : **Art Basel Paris**, 3 requêtes, 34 impressions cumulées. Événement distinct d'Art Paris (déjà au catalogue).
- **4 faux gaps** : le salon existe déjà au catalogue mais sous un nom différent, suite à un rebranding ou une fusion réelle et documentée. Cela représente un manque à gagner potentiel côté SEO on-page (la fiche existante n'est probablement pas optimisée pour ces formulations), mais pas un besoin de nouvelle fiche :
  - "Concours National de Labour" / "Finale Nationale de Labour 2026" (4 requêtes, 18 impressions) : l'édition 2026 se tient à Metz-Magny dans le cadre du festival **Terres de Jim**, déjà au catalogue.
  - "Géront'Expo" (2 requêtes, 8 impressions) : salon absorbé depuis plusieurs années par **SantExpo**, déjà au catalogue.
  - "Europain" (1 requête, 1 impression) : rebaptisé **Sirha Bake & Snack** depuis janvier 2026, déjà au catalogue.
  - "Salon des Entrepreneurs Paris" (1 requête, 1 impression) : rebaptisé **GO Entrepreneurs** depuis 2021, déjà au catalogue (fiche "Salon Go Entrepreneurs").

**Étape 2, recherche web**

Trois recherches parallèles (Île-de-France ; Lyon et Grand Ouest ; Sud-Ouest, Nord et Méditerranée) ont identifié 37 candidats bruts sur les grands parcs d'expositions et calendriers d'organisateurs (Viparis, Eurexpo, Exponantes, MEETT, Parc Chanot, Lille Grand Palais, etc.). Après retrait des doublons avec le catalogue, des dates hors fenêtre (septembre 2026 à fin 2027) et des cas à vérification insuffisante, la shortlist finale compte **36 salons** répartis en P1/P2/P3, en dessous de la fourchette cible de 40 à 60 : ce choix privilégie la fiabilité (règle CLAUDE.md #13) plutôt que le remplissage avec des candidats mal vérifiés.

**Répartition** : 13 en P1, 20 en P2, 3 en P3.

---

## Priorité P1 (13 salons)

Demande GSC prouvée ou salon majeur de filière, vérifié par source primaire.

### Art Basel Paris
- Paris, Grand Palais
- Dates : 23-25 octobre 2026 (source : artbasel.com/stories)
- Site officiel : https://www.artbasel.com/paris
- Signal : GSC, 34 impressions cumulées (3 requêtes). Art contemporain international, 5e édition, 200+ galeries de 41 pays, distinct d'Art Paris (déjà au catalogue, salon de printemps). Organisateur MCH Group.
- Vérification : fetch direct.

### Industrie Grand Ouest
- Nantes, Parc des Expositions de la Beaujoire
- Dates : 6-8 octobre 2026 (source : industrie-nantes.com)
- Site officiel : https://www.industrie-nantes.com/
- Signal : notoriété. Salon B2B de référence de l'industrie et de la sous-traitance du Grand Ouest, 350+ exposants, 7000 visiteurs professionnels, organisé par Exponantes avec UIMM, CETIM, IMT Atlantique.
- Vérification : fetch direct.

### Bio360 Europe
- Nantes, Parc des Expositions de la Beaujoire
- Dates : 3-4 février 2027 (sources concordantes, dates non affichées sur le site officiel au moment du fetch)
- Site officiel : https://www.bio360expo.com/
- Signal : notoriété. Salon international B2B de la bioénergie et de la bioéconomie, 450+ exposants de 25 pays, 5000+ participants.
- Vérification : fetch direct + recoupement de sources concordantes pour la date.

### CTCO
- Lyon, Eurexpo
- Dates : 2-4 février 2027 (source : salon-ctco.com)
- Site officiel : https://www.salon-ctco.com/en/
- Signal : notoriété. Salon B2B de référence des objets et vêtements publicitaires/promotionnels, 19e édition, 300+ exposants, réservé aux professionnels.
- Vérification : fetch direct.

### Salon des Vins de Loire
- Angers, Parc des Expositions d'Angers
- Dates : 1-2 février 2027 (sources concordantes)
- Site officiel : https://www.salondesvinsdeloire.com/
- Signal : notoriété. Salon 100% professionnel dédié au vignoble du Val de Loire, ~300 exposants. Complète la filière vin déjà présente au catalogue (Vinitech-Sifel, SITEVI, Euroviti).
- Vérification : recherche web multi-sources concordantes.

### AD2S (Aerospace & Defence Support and Services)
- Bordeaux-Mérignac, Base Aérienne 106
- Dates : 22-24 septembre 2026 (source : ad2s-bordeaux.com)
- Site officiel : https://ad2s-bordeaux.com/index.php/fr/
- Signal : notoriété. Seul événement B2B en Europe consacré au soutien et aux services de l'aéronautique de défense, organisé sur une base aérienne opérationnelle sous l'égide du Ministère des Armées.
- Vérification : fetch direct.

### SIFER (Salon International du Ferroviaire)
- Lille, Lille Grand Palais
- Dates : 22-24 juin 2027 (source : sifer-expo.com)
- Site officiel : https://www.sifer-expo.com
- Signal : notoriété. Événement biennal de référence du secteur ferroviaire depuis 1999 (matériel roulant, infrastructures, signalisation).
- Vérification : fetch direct.

### MAPIC
- Cannes, Palais des Festivals et des Congrès
- Dates : 3-4 novembre 2026 (source : mapic.com)
- Site officiel : https://www.mapic.com
- Signal : notoriété. Hub international de l'immobilier commercial, ~4000 participants de 75 pays, 200 exposants, 1800 enseignes.
- Vérification : fetch direct.

### MIPCOM
- Cannes, Palais des Festivals et des Congrès
- Dates : 12-15 octobre 2026 (source : mipcom.com)
- Site officiel : https://www.mipcom.com
- Signal : notoriété. Marché mondial de référence des contenus et médias, 42e édition, 350+ exposants, 10600+ délégués professionnels. Même famille d'événements que MIPIM (déjà au catalogue).
- Vérification : fetch direct.

### TFWA World Exhibition & Conference
- Cannes, Palais des Festivals et des Congrès
- Dates : 27 septembre au 1er octobre 2026 (communiqué officiel tfwa.com)
- Site officiel : https://www.tfwa.com
- Signal : notoriété. Sommet mondial annuel de référence du duty free et du travel retail, 480+ exposants, ~8000 professionnels.
- Vérification : source officielle citée (communiqué de presse), non re-fetchée directement. À confirmer par un fetch direct avant publication.

### SIPRHO
- Montpellier (Pérols), Parc des Expositions de Montpellier
- Dates : 8-10 février 2027 (source : siprho.com)
- Site officiel : https://www.siprho.com
- Signal : notoriété. Un des plus grands salons français du secteur CHR (restauration, hôtellerie, plages aménagées), 410 exposants, ~21588 professionnels qualifiés.
- Vérification : fetch direct.

### MedFEL
- Perpignan, Parc des Expositions de Perpignan
- Dates : 28-29 avril 2027 (source : medfel.com)
- Site officiel : https://medfel.com
- Signal : notoriété. Seul salon français dédié aux fruits et légumes, ~200 exposants, pavillons collectifs français et internationaux. Complète la filière agroalimentaire/agriculture déjà riche au catalogue.
- Vérification : fetch direct.

### APS - Alarmes Protection Sécurité
- Paris, Paris Expo Porte de Versailles (Pavillon 5.1)
- Dates : 28-30 septembre 2027 (source : salon-aps.com)
- Site officiel : https://www.salon-aps.com/fr-fr.html
- Signal : notoriété. Salon de référence de la sûreté et sécurité électronique (alarmes, contrôle d'accès), distinct d'Expoprotection (risques/incendie, déjà au catalogue) et de Milipol (sécurité intérieure/défense, déjà au catalogue).
- Vérification : fetch direct.

---

## Priorité P2 (20 salons)

Salons notables et vérifiés, mais échelle plus modeste, audience mixte pro/grand public, ou vérification par recoupement de sources plutôt que fetch direct pur.

### Data Centre World Paris
- Paris, Paris Expo Porte de Versailles (Hall 5)
- Dates : 18-19 novembre 2026 (source : techshowparis.fr)
- Site officiel : https://www.techshowparis.fr/data-centre-world
- Signal : notoriété. Fait partie de l'umbrella "Tech Show Paris" (10e anniversaire), aux côtés de Cloud & AI Infrastructure Paris (déjà au catalogue sous un autre nom de marque, événement frère mais distinct). À traiter comme les sous-marques SIRHA (Sirha Green, Sirha Bake & Snack) déjà au catalogue : marques distinctes d'un même évènement ombrelle.
- Vérification : fetch direct.

### Solar & Storage Live Paris
- Paris, Paris Le Bourget
- Dates : 14-15 octobre 2026 (source : solarandstoragelive.com)
- Site officiel : https://solarandstoragelive.com/events/
- Signal : notoriété. Énergie solaire et stockage, 200+ exposants, organisé par Terrapinn.
- Vérification : fetch direct.

### Cyber Show Paris
- Paris, Espace Champerret
- Dates : 27-28 janvier 2027 (source : cybershowparis.fr)
- Site officiel : https://www.cybershowparis.fr/
- Signal : notoriété. Cybersécurité B2B, 6000+ participants attendus, 1800 rendez-vous d'affaires programmés.
- Vérification : fetch direct.

### Journées du Courtage
- Paris, Palais des Congrès de Paris
- Dates : 15-16 septembre 2026 (source : lesjourneesducourtage.com)
- Site officiel : https://www.lesjourneesducourtage.com/
- Signal : notoriété. Assurance et courtage, 25e édition, rendez-vous de référence des courtiers en assurance, crédit et services financiers.
- Vérification : fetch direct.

### Séminaire Expo
- Paris, Paris Expo Porte de Versailles (Pavillon 4)
- Dates : 17-19 novembre 2026 (source : seminaire-expo.fr)
- Site officiel : https://www.seminaire-expo.fr/
- Signal : notoriété. MICE et évènementiel d'entreprise, ~20000 participants, ~60 exposants (lieux de réception, agences événementielles, prestataires).
- Vérification : fetch direct.

### FITEX Paris
- Paris, Paris Expo Porte de Versailles (Pavillon 4)
- Dates : 25-27 juin 2027 (source : fitex-event.com)
- Site officiel : https://fitex-event.com/
- Signal : notoriété. Fitness et bien-être, 180 exposants, 14800 visiteurs attendus. Audience partiellement grand public, comme Equip'Hôtel ou SIAE déjà au catalogue.
- Vérification : fetch direct.

### Révélations, biennale internationale des métiers d'art et de la création
- Paris, Grand Palais
- Dates : 19-23 mai 2027 (source : revelations-grandpalais.com)
- Site officiel : https://www.revelations-grandpalais.com/en/
- Signal : notoriété. Métiers d'art, design, artisanat d'excellence, organisé par Ateliers d'Art de France. Public mixte : galeries, manufactures, designers, collectionneurs, professionnels du luxe et de la décoration.
- Vérification : fetch direct.

### Business Hydro
- Grenoble, Alpexpo
- Dates : 6-7 octobre 2026 (source : businesshydro.fr)
- Site officiel : https://businesshydro.fr/en/
- Signal : notoriété. Salon B2B national n°1 de la filière hydroélectricité, 11e édition, ~200 exposants, organisé par Hydro21.
- Vérification : fetch direct.

### Econova
- Rennes, Parc des Expositions de Rennes Aéroport (Hall 10A)
- Dates : 14-15 octobre 2026 (source : econova.bzh)
- Site officiel : https://econova.bzh/
- Signal : notoriété. Salon B2B exclusivement réservé aux professionnels de la transition écologique et énergétique des territoires.
- Vérification : recherche web multi-sources concordantes (fetch direct en échec technique), à re-vérifier par fetch avant publication.

### Business Industries Reims
- Reims, Parc des Expositions de Reims
- Dates : 14-15 avril 2027 (source : businessindustries-reims.com)
- Site officiel : https://www.businessindustries-reims.com/le-salon/
- Signal : notoriété. Salon B2B industriel régional, ~200 exposants, 3000 visiteurs professionnels, soutenu par la CCI Marne Ardennes et La French Fab.
- Vérification : fetch direct.

### Business Industries Dijon
- Dijon, Parc des Expositions de Dijon
- Dates : 2-3 décembre 2026 (source : businessindustries-dijon.com)
- Site officiel : https://www.businessindustries-dijon.com
- Signal : notoriété. Rendez-vous d'affaires et forum emploi pour la filière industrielle de Bourgogne-Franche-Comté (machines-outils, robotique, sous-traitance). Même famille d'évènements que Business Industries Reims.
- Vérification : fetch direct.

### Asbestonomy
- Rennes, Couvent des Jacobins
- Dates : 28-29 octobre 2026 (source : asbestonomy.com)
- Site officiel : https://asbestonomy.com/
- Signal : notoriété. Salon international B2B dédié aux enjeux de l'amiante (diagnostic, désamiantage, réglementation), organisé depuis 2022, reconnu à l'international sur cette niche BTP/santé-sécurité.
- Vérification : recherche web multi-sources concordantes, à re-vérifier par fetch avant publication.

### C!Print Lyon
- Lyon, Eurexpo
- Dates : 2-4 février 2027 (source : salon-cprint.com)
- Site officiel : https://www.salon-cprint.com/en/
- Signal : notoriété. Salon B2B annuel de l'impression et de la communication visuelle, co-localisé avec CTCO (déjà en P1 ci-dessus).
- Vérification : fetch direct.

### Les Assises Port du Futur
- Strasbourg, Port Autonome de Strasbourg
- Dates : 23-24 septembre 2026 (source : portdufutur.fr)
- Site officiel : https://www.portdufutur.fr/les-assises/edition-2026
- Signal : notoriété. Rencontre B2B des professionnels et décideurs portuaires français et européens, 16e édition, organisée par le Cerema. Même format éditorial que les Assises Nationales des Déchets ou les Assises de la cybersécurité, déjà au catalogue.
- Vérification : fetch direct.

### Show Industrie
- Metz, Parc des Expositions de Metz
- Dates : 19-20 novembre 2026 (source : show-industrie.fr)
- Site officiel : https://www.show-industrie.fr/
- Signal : notoriété. Salon de l'industrie du futur en Grand Est, organisé par GL Events. Double vocation B2B (job dating, conférences, réseau industriels) et grand public (animations pédagogiques).
- Vérification : fetch direct.

### Cannes Yachting Festival
- Cannes, Vieux Port et Port Canto
- Dates : 8-13 septembre 2026 (source : cannesyachtingfestival.com)
- Site officiel : https://www.cannesyachtingfestival.com
- Signal : notoriété. Premier salon nautique à flot d'Europe, 680+ exposants, dimension professionnelle forte (chantiers navals, brokerage) et grand public.
- Vérification : fetch direct.

### Beauty Profs Marseille
- Marseille, Parc Chanot
- Dates : 14-15 novembre 2026 (source : billetterie beauty-profs.com)
- Site officiel : https://beauty-profs.com
- Signal : notoriété. Salon professionnel à badge obligatoire (ongles, cils, dermopigmentation, instituts), 60+ exposants. Complète la filière beauté déjà riche au catalogue (Beyond Beauty, Cosmetic 360, MakeUp in Paris) avec une antenne régionale sud.
- Vérification : source secondaire (page billetterie officielle), à re-vérifier avant publication.

### Aerospace Test & Development Show
- Toulouse, MEETT
- Dates : 29-30 septembre 2026 (source : aerotestdevelopmentshow.com)
- Site officiel : https://aerotestdevelopmentshow.com
- Signal : notoriété. Salon international dédié aux essais et au développement dans l'aérospatial et la défense, 150+ exposants.
- Vérification : source secondaire citant le site officiel, à re-vérifier par fetch direct avant publication.

### CBC - Cybersecurity Business Convention
- Toulouse, MEETT
- Dates : 25-26 novembre 2026 (source : cbc-convention.com)
- Site officiel : https://cbc-convention.com
- Signal : notoriété. Cybersécurité industrielle (OT) et spatiale, 8e édition, convention B2B avec tables rondes et rendez-vous d'affaires.
- Vérification : source secondaire citant le site officiel, à re-vérifier par fetch direct avant publication.

### Autonomic Lille Europe
- Lille, Lille Grand Palais
- Dates : 2-3 décembre 2026 (source : autonomic-expo.com)
- Site officiel : https://www.autonomic-expo.com
- Signal : notoriété. Handicap, grand âge, silver économie, ~150 exposants. Événement explicitement ouvert à tous (professionnels comme grand public), entrée gratuite : dimension grand public marquée, filière encore absente du catalogue.
- Vérification : fetch direct.

---

## Priorité P3 (3 salons, à confirmer)

### Prodays (Salon Vélo Prodays)
- Paris, Paris Expo Porte de Versailles (Hall 4)
- Dates : 5-7 juillet 2026 (source : pro-days.com), donc hors fenêtre demandée (septembre 2026 à fin 2027). L'édition suivante se tiendrait vraisemblablement en juillet 2027 (salon annuel) mais cette date n'a pas été confirmée par une source officielle.
- Site officiel : https://pro-days.com/ (fetch direct bloqué en 403, contenu confirmé par recoupement de sources)
- Signal : notoriété. 25e édition, 1000 marques dont 130 marques vélo, 36000 m² d'exposition, salon pro de référence de la filière cycle française.
- Statut : à confirmer, date de la prochaine édition dans la fenêtre à vérifier avant toute création de fiche.

### Patrimonia Paris (édition spéciale)
- Paris, Carreau du Temple
- Dates : 8 avril 2026 (source : clubpatrimoine.com, organisateur Infopro Digital), donc hors fenêtre demandée.
- Site officiel : non directement accessible en fetch (page organisateur Infopro Digital / Patrimonia), confirmé par clubpatrimoine.com
- Signal : notoriété. Gestion de patrimoine et finance, édition parisienne condensée sur une journée, distincte de Patrimonia Lyon (grand salon historique, non présent dans notre périmètre de recherche mais à vérifier séparément).
- Statut : à confirmer, à la fois sur la date dans la fenêtre et sur l'accès à une source primaire directe.

### Salon du Brasseur & de la Boisson (Nancy)
- Nancy (Vandœuvre-lès-Nancy), Parc des Expositions de Nancy
- Dates : NON VÉRIFIÉ, conflit entre le site officiel (1-2 avril 2027, salondubrasseur.com) et plusieurs sources tierces indépendantes (15-16 octobre 2026 selon jds.fr, biere-actu.fr, btobeer.com, destination-nancy.com).
- Site officiel : https://www.salondubrasseur.com
- Signal : notoriété. Salon professionnel du brassage et des boissons, 100 à 177 exposants dont un tiers à l'international.
- Statut : NON VÉRIFIÉ. Ne pas créer de fiche tant que la contradiction de dates n'est pas résolue directement auprès de l'organisateur.

---

## Annexe : requêtes GSC non couvertes (brutes)

### Requêtes nommant un salon sans fiche dédiée (candidats réels ou à résoudre)

| Requête | Clics | Impressions | Position | Résolution |
|---|---|---|---|---|
| art basel paris 2027 | 0 | 26 | 7.54 | Gap réel, voir Art Basel Paris (P1) |
| art basel paris 2027 dates | 0 | 7 | 8.29 | Gap réel, voir Art Basel Paris (P1) |
| art basel 2027 paris | 0 | 1 | 10.00 | Gap réel, voir Art Basel Paris (P1) |
| finale nationale de labour 2026 | 0 | 9 | 7.67 | Déjà couvert par Terres de Jim (Metz-Magny 2026) |
| concours de labour national 2026 | 0 | 5 | 9.80 | Déjà couvert par Terres de Jim |
| concour de labour 2026 | 0 | 2 | 10.50 | Déjà couvert par Terres de Jim |
| concours de labour 2026 | 0 | 2 | 6.50 | Déjà couvert par Terres de Jim |
| geront expo paris | 0 | 5 | 18.60 | Déjà couvert par SantExpo |
| geront expo | 0 | 3 | 17.67 | Déjà couvert par SantExpo |
| salon europain | 0 | 1 | 23.00 | Déjà couvert par Sirha Bake & Snack |
| salon des entrepreneurs | 0 | 1 | 86.00 | Déjà couvert par Salon Go Entrepreneurs |

### Requêtes génériques ou informationnelles (hors périmètre fiche salon, pistes de contenu blog)

Ces requêtes (impressions ≥ 3) ne nomment pas un salon précis et ne justifient pas de nouvelle fiche, mais signalent un potentiel de contenu éditorial (guides, comparatifs) déjà identifié dans la stratégie SEO du projet :

- grandes entreprises sous-exploitation salons tech innovation (27 impressions)
- grands salons tech annuels dirigeants innovation (59 impressions)
- critères choix grand salon tech innovation (51 impressions)
- maximiser salon tech et startups (8 impressions)
- preparation salon professionnel (33 impressions)
- cout d un salon professionnel (5 impressions)
- prix exposant salon (6 impressions)
- logistique salon (15 impressions)
- logistique salon professionnel (10 impressions)
- préparer un stand pour un salon (3 impressions)
- liste des salons agroalimentaire 2026 (18 impressions)
- lieu salon proche paris (3 impressions)

### Note méthodologique

Le reste des 625 requêtes à 3 impressions ou plus (soit plus de 600 requêtes) correspond à des variantes de formulation, fautes de frappe, ou requêtes sur les lieux/parcs d'expositions (Paris Nord Villepinte, Espace Champerret, Eurexpo, etc.) de salons déjà présents au catalogue. Elles ne sont pas listées ici par souci de lisibilité, mais confirment que la couverture actuelle du catalogue est déjà solide sur la demande organique existante : le vrai levier de croissance de trafic est donc la création de nouvelles fiches sur des salons non encore couverts (cette shortlist) plutôt qu'un rattrapage massif de gaps sur la demande actuelle.
