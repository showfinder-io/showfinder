# Cohorte trafic SEO : shortlist 2 de salons à créer

Cadrage de la cohorte suivante de fiches salons pour Agoris (D13 de tasks/todo.md), établi le 2026-08-23 selon la méthode de la shortlist 1 (tasks/cohorte-trafic-shortlist.md) sur une fenêtre élargie : janvier 2027 à juin 2028.

Sources : export frais du catalogue (273 salons dont 224 publiés, 48 draft, 1 annulé, y compris les 33 fiches des lots 1 à 6), baseline GSC du 2026-08-18 (1500 requêtes, 28 jours), et deux vagues de recherche web par sous-agents (vague 1 : trois zones géographiques ; vague 2 : pistes non résolues, calendriers d'organisateurs, balayage par filière, découverte par agrégateurs puis vérification primaire), suivies d'une passe de vérification ciblée sur les cas en conflit.

Règle appliquée strictement (CLAUDE.md #13) : aucun salon en P1 ou P2 sans vérification par source primaire (fetch direct du site officiel du salon ou de l'organisateur). Les candidats dont la date, le lieu ou l'existence de l'édition n'a pu être lue sur la source primaire sont isolés en P3 avec la mention explicite de ce qui manque. Les chiffres (exposants, visiteurs, numéro d'édition) ne sont repris que s'ils ont été lus sur la source primaire ; sinon "non disponible". Les 36 candidats de la shortlist 1 et ses 3 P3 (Prodays, Patrimonia Paris, Salon du Brasseur Nancy) sont exclus.

## Synthèse

**Étape 1, catalogue.** 273 slugs exportés par REST le 2026-08-23 (224 publiés, 48 draft, 1 annulé). Tous les candidats ci-dessous ont été passés au grep sur nom, abréviation, ville et organisateur contre cet export.

**Étape 2, demande GSC non couverte (baseline 2026-08-18).** Sur 1500 requêtes, 832 ont au moins 2 impressions (8947 impressions cumulées) ; 583 nomment un événement précis (7074 impressions). 525 d'entre elles (6543 impressions, 96% du volume nommé) correspondent à une fiche existante, souvent sous une autre formulation. Un seul gap réel : **La Levée de la Loire** (2 requêtes, 20 impressions, position 8,6), salon des vins de Loire bio/biodynamie distinct du Salon des Vins de Loire déjà au catalogue. Constats annexes :

- Deux fiches en draft captent des impressions sans page live : `batinov-lyon` (15 impressions) et `mdd-expo-paris` (2 impressions). Gap de publication, pas de catalogue : à publier si les critères de la règle #13 sont remplis.
- Piste Talma (événement marque employeur, requête "conference marque employeur paris", 16 impressions, position 80) : 1re édition mars 2026 à Lyon, retour 2027 annoncé sans date. Non retenu.
- 249 requêtes génériques (1873 impressions : "salon agroalimentaire" 123, "salon logistique" 98, "salon du bâtiment" 70, "salon btp" 60, "organisateurs de salons" 49, "preparation salon professionnel" 22...) confirment le potentiel de contenu éditorial et de pages secteur renforcées, hors périmètre de cette shortlist.

**Étape 3, recherche web.** Vague 1 (IDF ; Lyon/Grand Ouest ; Sud/Nord/Est) : 25 candidats, en dessous de l'attendu car chaque sous-agent a épuisé son budget de recherche, et parce que le catalogue couvre déjà densément Lyon/AURA, le Grand Ouest et le Nord (zone Nord : zéro candidat nouveau, tout est déjà en base). Vague 2 (quatre angles complémentaires) : 31 candidats supplémentaires uniques. Les calendriers des grands parcs (Viparis, GL events, Comexposium, RX) sont rendus en JavaScript et inaccessibles en fetch statique : la découverte a reposé sur les sites des organisateurs, les filières et les agrégateurs, chaque nom étant ensuite vérifié sur le site officiel.

**Étape 4, shortlist.** **56 candidats** : 18 en P1, 33 en P2, 5 en P3 (après arbitrages du 2026-08-24). Dans la fourchette cible 40-60. Une observation de fond : la demande organique nommée est couverte à 96%, la shortlist 2 est donc un levier d'élargissement de l'offre (nouvelles filières : maritime, musées, montagne, forêt, flotte automobile, risk management, composites, lingerie, accessoires) plutôt qu'un rattrapage de gaps GSC.

**Points tranchés (Julien, 2026-08-24)** :

1. One to One Retail E-Commerce (Monaco) : ACCEPTÉ, promu en P2 (précédents Luxe Pack, Ready For IT, Assises de la cybersécurité). Reste à re-fetcher le site dédié (403) avant écriture, l'agenda Comexposium fait foi en attendant.
2. Première Classe : CONSERVÉ. Précédent CTCO / C!Print : co-localisé avec Who's Next mais marque, site et audience distincts ; la co-localisation sera dite dans la fiche.
3. Cannes Lions, AMRAE, ATEC ITS, Minalogic : catégorie `salon_professionnel` (décision Julien : `congres` ne dit rien de l'audience, or elle est 100% pro). Le format convention/festival sera précisé dans le texte éditorial.
4. Signalement hors shortlist, fiche existante à corriger : ALL4PACK (fiche `all4pack-paris`, 24-27 novembre 2026) n'a plus lieu à cette date. Vérifié par fetch : all4pack.fr redirige en 301 vers all-for-pack.com, le salon est rebaptisé "ALLFORPACK Emballage Paris" et la prochaine édition est annoncée du 29 juin au 1er juillet 2027 à Paris Expo Porte de Versailles. À répercuter sur la fiche (nom, dates, edition_year, website_url, ancien nom dans les metas) via le pattern diag-edito-roll-apply.
5. Signalement hors shortlist, incohérence interne : la fiche `sepem-grenoble` porte le nom "SEPEM Industries Sud-Est" alors que sepem-industries.com nomme "Sud-Est" l'édition de Martigues (8-9 juin 2027, nouveau candidat P2) et liste Grenoble séparément (édition 24-26 novembre 2026, pas d'édition 2027/2028 annoncée). À réconcilier lors de l'écriture de la fiche Martigues.

---

## Priorité P1 (18 salons)

Demande GSC prouvée ou salon majeur de filière, vérifié par fetch direct du site officiel.

### La Levée de la Loire
- Angers, Parc des Expositions d'Angers
- Dates : 1-2 février 2027 (source : laleveedelaloire.com, page programme)
- Site officiel : https://www.laleveedelaloire.com
- Organisateur : association Loire Vin Bio
- Signal : GSC, 20 impressions (2 requêtes, position 8,6). Salon des vins de Loire bio, biodynamie et nature, environ 480 exposants, strictement réservé aux professionnels (vérifié à l'écriture sur le site officiel, contrairement au cadrage initial). Allié depuis 2023 au Salon des Vins de Loire (déjà au catalogue) mais marque, site et calendrier propres : pas un doublon.
- Catégorie : salon_professionnel
- Vérification : fetch direct.

### Millésime Bio
- Montpellier (Pérols), Parc des Expositions de Montpellier
- Dates : 25-27 janvier 2027 (source : millesime-bio.com, page dates et horaires)
- Site officiel : https://www.millesime-bio.com
- Organisateur : non affiché sur la page consultée (historiquement Sudvinbio)
- Signal : notoriété. 34e édition, présenté comme le plus grand salon mondial du vin bio. Exposants et visiteurs : non disponible sur la page consultée.
- Vérification : fetch direct.

### MIDEM
- Cannes, Palais des Festivals et des Congrès
- Dates : 19-21 janvier 2027 (source : midem.com, infos pratiques)
- Site officiel : https://www.midem.com
- Signal : notoriété. Marché international de référence de l'industrie musicale. Même famille que MIPCOM et MIPIM (déjà au catalogue). Chiffres : non disponible sur la page consultée.
- Vérification : fetch direct.

### Cannes Lions International Festival of Creativity
- Cannes, Palais des Festivals et des Congrès
- Dates : 21-25 juin 2027 (source : canneslions.com/festival)
- Site officiel : https://www.canneslions.com
- Signal : notoriété mondiale. Festival professionnel de référence de la publicité et de la communication créative. Chiffres : non disponible sur la page consultée.
- Catégorie : salon_professionnel (format festival/congrès à préciser dans le texte, décision Julien 2026-08-24).
- Vérification : fetch direct.

### Euromaritime
- Marseille, Parc Chanot
- Dates : 1-3 février 2028 (source : euromaritime.fr, "See you from 1 to 3 February 2028 in Marseille, Parc Chanot")
- Site officiel : https://www.euromaritime.fr
- Organisateur : SOGENA pour le GICAN
- Signal : notoriété. Salon biennal de l'économie maritime (construction et réparation navales, économie portuaire, technologies). Édition 2026 : 330 exposants, 5791 visiteurs de 70 pays, 1547 rendez-vous B2B (lus sur le site officiel). Historiquement à Paris, déménage à Marseille en 2028. Filière maritime absente du catalogue.
- Vérification : fetch direct (deux agents indépendants).

### HR Technologies France
- Paris, Paris Expo Porte de Versailles, Hall 4
- Dates : 20-21 janvier 2027 (source : hrtechnologiesfrance.com)
- Site officiel : https://www.hrtechnologiesfrance.com/
- Organisateur : CloserStill Media avec Parlons RH, co-localisé avec Learning Technologies France (déjà au catalogue)
- Signal : notoriété. Bilan 2026 : 350 exposants, 16 000 participants (périmètre du duo co-localisé avec Learning Technologies), 300 sessions ; les 410 exposants et 350 conférences du cadrage initial étaient l'annonce 2027 (corrigé à l'écriture, RR21). Distinct de Congrès HR (`congres-hr-paris`) et de Solutions RH (`solutions-rh`). NB : la mention initiale "absorbe Digital RH Meeting France" était fausse (événement distinct de One Place Corporate, vérifié à l'écriture).
- Vérification : fetch direct.

### SETA, Salon de l'Environnement de Travail et des Achats
- Paris, Paris Expo Porte de Versailles, Pavillon 1
- Dates : 16-18 mars 2027 (source : salon-environnement-de-travail-achats.fr)
- Site officiel : https://www.salon-environnement-de-travail-achats.fr/
- Organisateur : Weyou Group
- Signal : notoriété. Édition 2025 : 144 exposants, 20 910 participants. Co-localisé avec Europropre (ci-dessous).
- Vérification : fetch direct.

### Europropre
- Paris, Paris Expo Porte de Versailles, Pavillon 1
- Dates : 16-18 mars 2027 (source : europropre.com)
- Site officiel : https://www.europropre.com/
- Organisateur : Weyou Group
- Signal : notoriété. Salon de référence de la propreté et des services associés. Édition 2025 : 207 stands, 15 900 visiteurs.
- Vérification : fetch direct.

### Museum Connections Paris
- Paris, Paris Expo Porte de Versailles, Hall 5.2
- Dates : 12-13 janvier 2027 (source : museumconnections.com/e/paris-2027)
- Site officiel : https://www.museumconnections.com/
- Signal : notoriété. Salon international des musées, lieux culturels et sites touristiques. Édition 2026 : 403 exposants (44% internationaux), 6332 participants. Distinct de SITEM (P2).
- Vérification : fetch direct (deux agents indépendants).

### Rendez-vous en France
- Bordeaux (lieu exact non affiché sur atout-france.fr ni sur la presse spécialisée au moment du fetch : non disponible, à compléter avant publication)
- Dates : 23-24 mars 2027 (source : atout-france.fr, page salon Rendez-vous en France 2027 et actualité "Atout France choisit Bordeaux")
- Site officiel : https://www.atout-france.fr/fr/catalogue/rendez-vous/salon-rendez-vous-en-france-2027
- Organisateur : Atout France
- Signal : notoriété. Salon B2B de référence de la commercialisation internationale de l'offre touristique française, 20e édition. Édition 2026 (Nice) : 704 sociétés exposantes, 814 acheteurs internationaux de 52 pays, 28 465 rendez-vous d'affaires. Distinct d'IFTM Top Resa.
- Vérification : fetch direct.

### Sport-Achat Hiver
- Grenoble, Alpexpo
- Dates : 25-27 janvier 2027 (source : sport-achat.com)
- Site officiel : https://sport-achat.com/
- Organisateur : Sportair, Eurovet
- Signal : notoriété. Salon B2B de l'outdoor et des sports d'hiver : 500 marques, 4000 professionnels, 20 000 m². Distinct de FITEX (fitness, déjà au catalogue).
- Vérification : fetch direct.

### Smahrt Toulouse
- Toulouse, MEETT
- Dates : 30 janvier au 1er février 2028 (source : smahrt.com)
- Site officiel : https://www.smahrt.com/
- Organisateur : GL events, écosystème Sirha Food
- Signal : notoriété. Rendez-vous du food service, de l'hôtellerie et des métiers de bouche du Grand Sud-Ouest : 270 exposants, 18 000 m², 15 000 visiteurs professionnels attendus (52% décideurs). Complète Sirha Lyon, Serbotel et SIPRHO déjà au catalogue.
- Vérification : fetch direct.

### Rencontres Flotauto Paris
- Paris Le Bourget
- Dates : 11 mars 2027 (source : rencontres.flotauto.com)
- Site officiel : https://rencontres.flotauto.com/
- Organisateur : Flottes Automobiles
- Signal : notoriété. Salon B2B de référence de la gestion de flotte et de la mobilité d'entreprise : 300 exposants, 5700 visiteurs. Filière absente du catalogue.
- Vérification : fetch direct.

### Paris Space Week
- Paris, Espace Champerret
- Dates : 31 mars au 1er avril 2027 (source : paris-space-week.com)
- Site officiel : https://www.paris-space-week.com/
- Organisateur : ASTech et Vimeet Events, groupe Comexposium
- Signal : notoriété. Convention B2B du spatial : édition 2026, 150+ stands, 2000+ visiteurs, 40+ pays, 4000+ rendez-vous d'affaires. Distinct du SIAE.
- Vérification : fetch direct.

### Destination Montagnes (Grand Ski)
- Grenoble, Alpexpo
- Dates : 19-20 janvier 2027 (source : destinationmontagnes.com)
- Site officiel : https://www.destinationmontagnes.com
- Organisateur : Atout France
- Signal : notoriété. 36e édition du workshop B2B de la montagne française (stations et tour-opérateurs internationaux). Chiffres : non disponible.
- Vérification : fetch direct.

### Les Culturales
- Villers-Saint-Christophe (Aisne), station de recherche Arvalis
- Dates : 23-24 juin 2027 (source : arvalis.fr, page événements)
- Site officiel : https://www.arvalis.fr/evenements-arvalis
- Organisateur : Arvalis, institut technique agricole
- Signal : notoriété. Salon biennal de référence des grandes cultures en plein champ : environ 250 exposants, 15 000 visiteurs attendus. Complète Innov-Agri, Tech & Bio et le Salon de l'Herbe déjà au catalogue.
- Vérification : fetch direct.

### Signal Week (ex Paris Blockchain Week)
- Paris, Palais des Congrès de Paris
- Dates : 6-7 juillet 2027 (source : parisblockchainweek.com)
- Site officiel : https://www.parisblockchainweek.com/
- Signal : notoriété. Édition 2026 : 7500+ participants de 100+ pays, co-localisé avec le sommet IA RAISE. Finance institutionnelle et actifs numériques.
- Vérification : fetch direct. Rebranding récent : prévoir l'ancien nom dans les metas.

### VITeff
- Épernay, Le Millesium
- Dates : 12-14 octobre 2027 (source : viteff.com)
- Site officiel : https://www.viteff.com
- Organisateur : EFFEVENT
- Signal : notoriété. Salon international biennal des technologies des vins effervescents, seul événement de ce type en France. Chiffres (350 entreprises, 27 000 m² selon agrégateurs) : non confirmés sur la source primaire, non disponible.
- Vérification : fetch direct.

---

## Priorité P2 (33 salons)

Vérifiés par fetch direct, mais échelle plus modeste, régionale, congrès/convention d'affaires, ou audience mixte.

### Navexpo
- Lorient, Port de Lorient Centre, Quai du Péristyle (10 rue Jean Stéphan)
- Dates : 25-27 mai 2027 (source : navexpo.com, "25 > 27 MAI 2027", page accès et horaires)
- Site officiel : https://www.navexpo.com
- Organisateur : Le Bureau Naval / VAL S.A.S. (lu sur le site)
- Signal : salon biennal de l'innovation maritime à flot, réservé aux opérateurs, acheteurs et décideurs. Chiffres 2027 : non disponible. Filière maritime absente du catalogue (avec Euromaritime en P1).
- Vérification : fetch direct (passe finale ; un premier recoupement plaçait le salon à Lanester, contredit par la source primaire).

### Documation
- Paris, Paris Expo Porte de Versailles (lieu 2027 affiché côté Digital Workplace, page infos pratiques de Documation encore sur l'édition 2026)
- Dates : 9-10 juin 2027 (source : salon-documation.com, page d'accueil). La mention "8-9 avril" relevée en vague 1 concerne l'édition 2026 : pas de contradiction.
- Site officiel : https://salon-documation.com/
- Organisateur : Infopromotions
- Signal : 32e édition, gestion de l'information et dématérialisation. Édition 2025 : 100+ exposants, 5290 visiteurs professionnels. Co-localisé avec Digital Workplace Paris, en synergie avec Solutions RH (déjà au catalogue).
- Vérification : fetch direct (passe finale).

### Curve Paris (Salon International de la Lingerie)
- Paris, Paris Expo Porte de Versailles
- Dates : 16-18 janvier 2027 (source : fr.saloninternationaldelalingerie.com, horaires 9h-19h les 16 et 17, 9h-18h le 18)
- Site officiel : https://fr.saloninternationaldelalingerie.com/
- Organisateur : WSN
- Signal : salon biannuel (janvier et septembre) de la lingerie et du balnéaire, couplé à Interfilière Paris (déjà au catalogue) mais marque distincte. Chiffres : non disponible.
- Vérification : fetch direct (passe finale).

### Tech For Industry Show
- Paris, Paris Expo Porte de Versailles, Hall 7.1
- Dates : 19-20 mai 2027 (source : techforindustryshow.com, "19 & 20 mai 2027, Paris Expo, Hall 7.1")
- Site officiel : https://www.techforindustryshow.com
- Organisateur : FHT Events
- Signal : salon des technologies pour l'industrie réservé aux professionnels. Édition 2026 (page Viparis) : 100+ exposants, 4000+ visiteurs décideurs et C-level.
- Vérification : fetch direct (passe finale).

### ENVIROpro Sud-Ouest
- Bordeaux, Parc des Expositions de Bordeaux-Lac (Cours Charles Bricaud)
- Dates : 1-2 mars 2028 (source : enviropro-salon.com, page date-acces-horaire Bordeaux, "Du 01 au 02 mars 2028")
- Site officiel : https://www.enviropro-salon.com/fr/salon/bordeaux
- Organisateur : Nexfairs
- Signal : 300+ exposants annoncés sur la source primaire. Même réseau que Toulouse, Grand-Ouest et Nord.
- Vérification : fetch direct (passe finale).

### SEPEM Industries Sud-Est (Martigues)
- Martigues (lieu exact non affiché sur la liste des salons, à lire sur la page de l'édition avant écriture)
- Dates : 8-9 juin 2027 (source : sepem-industries.com, liste des salons, "Martigues 08 & 09 juin 2027, Sud-Est")
- Site officiel : https://www.sepem-industries.com
- Organisateur : SEPEM Industries
- Signal : édition régionale du réseau SEPEM (Rouen en P2, Angers, Colmar, Douai, Grenoble, Toulouse au catalogue). Chiffres : non disponible.
- Vérification : fetch direct (passe finale). Attention : la fiche `sepem-grenoble` porte déjà le nom "Sud-Est", à réconcilier (voir Synthèse, point 5).

### BISOU
- Marseille, Parc Chanot (Palais Phocéen)
- Dates : 23-25 janvier 2027 (source : bisou.com/fr)
- Site officiel : https://www.bisou.com
- Organisateur : Orgexpo (salon historiquement niçois, édition 2027 à Marseille)
- Signal : salon international du cadeau, de la décoration, du beachwear et du souvenir, accès strictement professionnel, 200+ exposants sur 10 000 m².
- Vérification : fetch direct.

### Euroforest
- Saint-Bonnet-de-Joux (Saône-et-Loire), en forêt
- Dates : 16-19 juin 2027 (source : euroforest.fr)
- Site officiel : https://www.euroforest.fr
- Organisateur : Fibois BFC et CFBL
- Signal : salon de référence de l'exploitation forestière et du bois en conditions réelles, 4 jours en 2027. Chiffres : non disponible. Distinct de Forexpo (Mimizan, prochaine édition 2029).
- Vérification : fetch direct (dates) ; lieu exact recoupé par sources secondaires.

### SEPEM Industries Rouen
- Le Grand-Quevilly (Rouen), Rouen Expo Congrès
- Dates : 26-28 janvier 2027 (source : rouen.sepem-industries.com)
- Site officiel : https://rouen.sepem-industries.com/
- Organisateur : SEPEM Industries
- Signal : 6e édition normande du réseau SEPEM (Angers, Colmar, Douai, Grenoble, Toulouse déjà au catalogue). Nombre d'exposants : non disponible.
- Vérification : fetch direct.

### IODE
- Vannes, Parc des Expositions Le Chorus
- Dates : 27-28 janvier 2027 (source : salon-iode.fr)
- Site officiel : https://www.salon-iode.fr/
- Organisateur : Campo Ouest
- Signal : salon professionnel de l'équipement de plein air, du tourisme et de l'hôtellerie : 220+ exposants, 2500 visiteurs professionnels.
- Vérification : fetch direct.

### Cycl'eau Bordeaux Nouvelle-Aquitaine
- Bordeaux, Palais 2 l'Atlantique
- Dates : 2-3 juin 2027 (source : cycleau.fr)
- Site officiel : https://www.cycleau.fr/evenements/cycl-eau-bordeaux-nouvelle-aquitaine
- Organisateur : association Cycl'eau
- Signal : 10e anniversaire, environ 150 exposants sur 7000 m². Cycl'eau Strasbourg et Vichy sont au catalogue (en draft) : édition régionale distincte.
- Vérification : fetch direct.

### Salon Funéraire (Salon International des Arts Funéraires)
- Paris Le Bourget, Hall 2B
- Dates : 17-19 novembre 2027 (source : salon-funeraire.com)
- Site officiel : https://www.salon-funeraire.com/
- Organisateur : SPAT et SAF (Syndicat de l'Art Funéraire)
- Signal : 20e édition, salon biennal depuis 1987, filière absente du catalogue.
- Vérification : fetch direct.

### SITEM, Salon international des musées, monuments et tourisme culturel
- Paris, Carrousel du Louvre
- Dates : 31 mars au 1er avril 2027 (source : sitem.fr)
- Site officiel : https://www.sitem.fr/
- Signal : 31e édition. Chiffres : non disponible. Complémentaire de Museum Connections (P1).
- Vérification : fetch direct.

### Salon SEE (Salon de l'Expérience Étudiante)
- Paris, Docks de Paris, Dock Pullman
- Dates : 9-10 mars 2027 (source : salon-see.com)
- Site officiel : https://www.salon-see.com/
- Organisateur : HEADway Advisory et RPI
- Signal : salon B2B des professionnels de l'enseignement supérieur (villages Tech, Service, Campus). Distinct du Salon de l'Étudiant (grand public, déjà au catalogue). Chiffres : non disponible.
- Vérification : fetch direct.

### Congrès des Audioprothésistes (SDA)
- Paris, Palais des Congrès de Paris
- Dates : 11-12 mars 2027 (source : congresdesaudios.org)
- Site officiel : https://www.congresdesaudios.org/
- Organisateur : Syndicat des Audioprothésistes
- Signal : 47e édition, congrès avec exposition professionnelle de la filière audition. Chiffres : non disponible.
- Catégorie : salon_professionnel (même logique que la décision du 2026-08-24 : l'audience est pro, le format congrès sera dit dans le texte).
- Vérification : fetch direct.

### Paris Café Festival
- Paris, Carreau du Temple
- Dates : 24-26 avril 2027 (source : pariscafefestival.com)
- Site officiel : https://www.pariscafefestival.com/
- Organisateur : Paris Coffee Ventures
- Signal : 8e édition, 101+ exposants, journée professionnelle dédiée. Audience mixte pro/grand public (à signaler comme FITEX ou Cannes Yachting Festival).
- Catégorie : salon_grand_public, category_to_confirm.
- Vérification : fetch direct.

### CHR PRO EXPO Grand-Est
- Colmar, Parc des Expositions de Colmar
- Dates : 7-9 mars 2027 (source : chrpro-grandest.fr)
- Site officiel : https://www.chrpro-grandest.fr
- Organisateur : Artecom Group
- Signal : salon régional des professionnels de l'hôtellerie, de la restauration et des métiers de bouche. Chiffres : non disponible.
- Vérification : fetch direct.

### URBEST
- Metz, Parc des Expositions de Metz
- Dates : 13-14 janvier 2027 (source : urbest.fr)
- Site officiel : https://www.urbest.fr
- Organisateur : Metz Événements
- Signal : salon professionnel des décideurs de l'espace public du Grand Est, sur invitation : 120 exposants, 6000 m², 31e édition en 2026. Complète SMCL (national).
- Vérification : fetch direct.

### ENVIROpro Toulouse
- Labège (Toulouse), Diagora
- Dates : 6-7 octobre 2027 (source : enviropro-salon.com, infos pratiques Toulouse)
- Site officiel : https://www.enviropro-salon.com/fr/salon/toulouse/infos-pratiques
- Organisateur : Nexfairs
- Signal : salon régional des solutions environnementales et énergétiques (eau, déchets, air, éco-construction, mobilité). Chiffres : non disponible pour cette édition.
- Vérification : fetch direct.

### ENVIROpro Grand-Ouest
- Angers, Angers Parc Expo
- Dates : 24-25 mars 2027 (source : enviropro-salon.com, présentation Angers)
- Site officiel : https://www.enviropro-salon.com/fr/salon/angers/presentation
- Organisateur : Nexfairs
- Signal : 300+ exposants annoncés sur la source primaire. Même réseau que les éditions Toulouse, Nord et Sud-Ouest.
- Vérification : fetch direct.

### ENVIROpro Nord
- Douai, Gayant Expo
- Dates : 18-19 juin 2028 (source : enviropro-salon.com, présentation Douai)
- Site officiel : https://www.enviropro-salon.com/fr-fr/douai/presentation
- Organisateur : Nexfairs
- Signal : 2e édition, 300+ exposants annoncés.
- Vérification : fetch direct.

### Minalogic Business Meetings
- Grenoble, Alpexpo
- Dates : 11 mars 2027 (source : minalogicbusinessmeetings.com)
- Site officiel : https://www.minalogicbusinessmeetings.com/fr
- Organisateur : Minalogic
- Signal : convention d'affaires du numérique et des technologies, édition précédente 500+ participants, 1400+ rendez-vous (chiffres 2025/2026).
- Catégorie : salon_professionnel (format convention d'affaires, décision Julien 2026-08-24).
- Vérification : fetch direct.

### Digital Workplace Paris
- Paris, Paris Expo Porte de Versailles
- Dates : 9-10 juin 2027 (source : salon-digitalworkplace.com)
- Site officiel : https://salon-digitalworkplace.com
- Organisateur : Infopromotions
- Signal : salon de l'environnement de travail numérique, co-localisé avec Documation (P2, mêmes dates) et en synergie avec Solutions RH (déjà au catalogue). Chiffres : non disponible.
- Vérification : fetch direct.

### C!Brand
- Paris, Paris Expo Porte de Versailles, Hall 5
- Dates : 24-25 mars 2027 (source : salon-cbrand.com)
- Site officiel : https://www.salon-cbrand.com/
- Organisateur : Infopro Digital Trade Shows, en partenariat avec SHOP! Le Salon
- Signal : 3e édition, déploiement de l'univers de marque (PLV, signalétique, objets promotionnels). Chiffres : non disponible. Proche de CTCO (déjà au catalogue) par filière mais salon distinct.
- Vérification : fetch direct (deux agents indépendants).

### SHOP! Le Salon (ex Salon Marketing Point de Vente)
- Paris, Paris Expo Porte de Versailles, Hall 5
- Dates : 24-25 mars 2027 (source : shop-le-salon.fr)
- Site officiel : https://www.shop-le-salon.fr/
- Organisateur : association SHOP! France
- Signal : 38e édition, salon de référence du marketing au point de vente. Chiffres : non disponible sur la source primaire. Co-localisé avec C!Brand.
- Vérification : fetch direct (deux agents indépendants). Ancien nom à intégrer dans les metas.

### ContaminExpo
- Paris, Paris Expo Porte de Versailles, Hall 5.1
- Dates : 23-25 mars 2027 (source : contaminexpo.fr)
- Site officiel : https://www.contaminexpo.fr/
- Organisateur : ASPEC
- Signal : 20e édition, salon de la maîtrise de la contamination et des salles propres, couplé au congrès ContaminExpert. Chiffres : non disponible.
- Vérification : fetch direct.

### Composites Meetings Europe
- Nantes, Parc des Expositions de Nantes (nouveau lieu)
- Dates : 1-2 décembre 2027 (source : france.compositesmeetings.com)
- Site officiel : https://france.compositesmeetings.com/
- Organisateur : Pôle EMC2 et abe (advanced business events)
- Signal : 11e édition, convention d'affaires des matériaux composites (aéronautique, automobile, naval). Édition 2025 : 156 exposants de 13 pays, 494 participants.
- Vérification : fetch direct.

### France Air Expo
- Lyon, aéroport de Lyon-Bron
- Dates : 27-29 mai 2027 (source : franceairexpo.com)
- Site officiel : https://www.franceairexpo.com/
- Signal : 20e anniversaire, salon de référence de l'aviation générale en France, 2e en Europe selon l'organisateur. Audience mixte (professionnels et passionnés). Chiffres : non disponible.
- Catégorie : salon_professionnel, category_to_confirm.
- Vérification : fetch direct.

### Première Classe
- Paris, Jardin des Tuileries
- Dates : 5-8 mars 2027 (source : wsn-events.com)
- Site officiel : https://wsn-events.com/events/premiere-classe
- Organisateur : WSN
- Signal : salon international des accessoires de mode, environ 13 000 visiteurs dont 69% internationaux (lu sur le site). Co-localisé avec Who's Next (déjà au catalogue) : à trancher, voir Synthèse.
- Vérification : fetch direct.

### Congrès ATEC ITS France (Mobil'in Pulse)
- Montrouge, Beffroi de Montrouge
- Dates : 19-20 janvier 2027 (source : congres.atec-its-france.com)
- Site officiel : https://congres.atec-its-france.com/
- Organisateur : ATEC ITS France
- Signal : 54e congrès, référence française des systèmes de transport intelligents. Chiffres : non disponible.
- Catégorie : salon_professionnel (format convention d'affaires, décision Julien 2026-08-24).
- Vérification : fetch direct.

### Les Rencontres du Risk Management (AMRAE)
- Deauville, Centre International de Deauville
- Dates : 3-5 février 2027 (source : amrae-rencontres.fr)
- Site officiel : https://www.amrae-rencontres.fr/
- Organisateur : AMRAE
- Signal : 34e édition, congrès de référence du risk management et de l'assurance d'entreprise. Chiffres : non disponible. Complète les Journées du Courtage déjà au catalogue.
- Catégorie : salon_professionnel (format convention d'affaires, décision Julien 2026-08-24).
- Vérification : fetch direct.

### VS Pack
- Cognac, Espace 3000
- Dates : 7-9 décembre 2027 (source : vspack.com)
- Site officiel : https://www.vspack.com/
- Organisateur : Atlanpack
- Signal : 14e édition, salon du packaging et du conditionnement des vins et spiritueux. Chiffres : non disponible.
- Vérification : fetch direct.

### One to One Retail E-Commerce
- Monaco, Grimaldi Forum
- Dates : 9-11 mars 2027, 15e édition (source : agenda comexposium.com ; site dédié en 403)
- Site officiel : https://www.1to1-retail-ecommerce.com/
- Organisateur : Comexposium
- Signal : rendez-vous d'affaires de référence des décideurs retail et e-commerce. Chiffres : non disponible.
- Vérification : agenda organisateur Comexposium (site dédié en 403, à re-fetcher avant écriture). Monaco accepté (décision Julien 2026-08-24).

---

## Priorité P3 (5 salons, à confirmer)

Une information essentielle (date, lieu, existence de l'édition) n'a pas pu être lue sur la source primaire malgré la passe finale, ou une décision de périmètre est nécessaire. Ne pas écrire de fiche sans lever le point bloquant.

### Salon du Dessin
- Paris, Palais Brongniart
- Dates : 7-12 avril 2027 (sources secondaires concordantes : parisjetaime.com, eventseye, salons-antiquaires.com)
- Site officiel : https://salondudessin.com/ (403 persistant sur /, /fr, /en à deux passes)
- Signal : 39 galeries spécialisées en dessin ancien, moderne et contemporain, foire de marchands d'art.
- Bloquant : source primaire jamais lue (protection anti-bot). À confirmer en navigateur.

### Alpipro Digital Montagne
- Chambéry, Savoiexpo
- Dates : 31 mars 2027 confirmé sur alpipro.com (remise des Mountain Tourism Awards "mercredi 31 mars 2027 à 19h") ; 1er avril 2027 uniquement par sources secondaires (cluster-montagne.com, domaines-skiables.fr, anmsm.fr). L'agenda savoiexpo.com ne liste pas encore l'événement.
- Site officiel : https://www.alpipro.com/
- Organisateur : Savoiexpo
- Signal : salon B2B de l'aménagement des stations de montagne, édition 2025 : 360+ exposants, 4100 à 4500 visiteurs professionnels. Fort potentiel, à promouvoir en P1 dès confirmation.
- Bloquant : date de fin à lire en texte sur une source primaire.

### Carrefour International du Bois
- Nantes, Parc des Expositions
- Dates : 30 mai au 1er juin 2028 (radonexhibition.eu "30 - 01 Jun 28", promosalons.com) ; site officiel timbershow.com en erreur 500 sur 6 tentatives (/, /fr, /en, deux passes). Dernière édition 2-4 juin 2026 (exponantes.com). Fréquence : biennale selon l'écart 2026-2028, mais la page Exponantes dit "annuel" et le site officiel est injoignable.
- Site officiel : https://www.timbershow.com
- Bloquant : édition 2028 et fréquence à lire sur la source primaire dès qu'elle répond.

### Midi Mat Occitanie
- Toulouse (lieu non affiché ; Diagora Labège selon eventseye uniquement)
- Dates : "avril 2027" sur midi-mat.com (avec Midi Mat Côte d'Azur en mars 2027 à Mandelieu et Midi Mat Provence en avril 2027) ; jours 31 mars-1er avril selon eventseye uniquement
- Site officiel : https://midi-mat.com/
- Signal : salon régional de la construction, du transport et de l'industrie (matériel BTP, loueurs, distributeurs). Chiffres : non disponible.
- Bloquant : jours exacts et lieu à lire sur la source primaire (page badge Occitanie ou organisateur, +33 4 92 19 22 00).

### Architect@Work Bordeaux
- Bordeaux, Parc des Expositions
- Dates : 18-19 novembre 2027 selon plusieurs sources secondaires (architecturebois.fr, fibois-na.fr, eventseye) ; site officiel architectatwork.com en boucle de redirection sur 3 URL à deux passes
- Site officiel : https://architectatwork.com (page événement : architectatwork.com/events/a@w-bordeaux)
- Signal : Architect@Work Lyon et Paris sont au catalogue ; édition Bordeaux cohérente mais non lue sur le site officiel.
- Bloquant : à confirmer en navigateur.

---

## Vérifications ciblées (passe finale, 2026-08-23)

Quatorze points en conflit ou fragiles ont été re-vérifiés par fetch direct. Résultats :

| Point | Résultat | Source lue |
|---|---|---|
| Navexpo lieu et dates | Confirmé : 25-27 mai 2027, Port de Lorient Centre, Quai du Péristyle. Lanester non trouvé. | navexpo.com/fr/acces-horaires-navexpo |
| Documation dates | Confirmé : 9-10 juin 2027 (le "8-9 avril" est l'édition 2026). Même dates que Digital Workplace. | salon-documation.com |
| SEPEM 2027-2028 | Rouen 26-28 janv 2027, Martigues (Sud-Est) 8-9 juin 2027, Colmar 21-23 sept 2027, Angers 12-14 oct 2027, Douai 25-27 janv 2028. Grenoble : 24-26 nov 2026 seulement. | sepem-industries.com |
| ALL4PACK | Contredit : rebaptisé ALLFORPACK Emballage Paris, 29 juin-1er juillet 2027, Porte de Versailles (301 depuis all4pack.fr). | all-for-pack.com/fr-FR |
| Carrefour International du Bois | Site officiel injoignable (500). 2028 recoupé, fréquence non confirmée. Reste P3. | radonexhibition.eu, exponantes.com |
| Curve Paris janvier 2027 | Confirmé : 16-18 janvier 2027, Porte de Versailles. | fr.saloninternationaldelalingerie.com |
| Tech For Industry Show 2027 | Confirmé : 19-20 mai 2027, Paris Expo Hall 7.1. | techforindustryshow.com |
| Patrimonia Lyon 2027 | Contredit : la 33e édition est le 30 sept-1er oct 2026, aucune date 2027 publiée. Écarté. | patrimonia.fr (accueil, presse) |
| Alpipro 2027 | Partiel : 31 mars 2027 lu (remise de prix), 1er avril non lu. Reste P3. | alpipro.com, savoiexpo.com |
| Salon du Dessin | Non lu (403 persistant). Reste P3. | secondaires |
| ENVIROpro Sud-Ouest | Confirmé : 1-2 mars 2028, Parc des expositions, Cours Charles Bricaud, Bordeaux. | enviropro-salon.com/fr/salon/bordeaux/date-acces-horaire |
| Midi Mat Occitanie | Partiel : "avril 2027", ni jours ni lieu. Reste P3. | midi-mat.com |
| Architect@Work Bordeaux | Non lu (boucles de redirection). Reste P3. | secondaires |
| Rendez-vous en France | Confirmé : 23-24 mars 2027, Bordeaux. Lieu exact non affiché. | atout-france.fr (catalogue et actualité) |

---

## Écartés notables

Candidats examinés puis écartés, avec la raison, pour éviter de les re-vérifier à la shortlist 3.

**Déjà au catalogue sous un autre nom ou une autre formulation** : Paris Packaging Week (= ADF&PCD Paris, mêmes dates), Innovagri Hauts-de-France (26-27 mai 2027 : même marque itinérante qu'Innov-Agri Ondes, Groupe NGPA), Digital RH Meeting France (fusionné dans HR Technologies France), Transports Publics 2028 (`transports-publics-paris`), Top Transport Europe, Hyvolution Paris 2027, EnerJ-Meeting Paris et Lyon, Salon du Végétal Angers, Aeromart Toulouse, UAV Show (`air-drone-bordeaux`), Innorobo/SIDO, Vinisud (fusionné dans Wine Paris), Apparel Sourcing (partie de Texworld), Who's Next, Bijorhca et Interfilière de janvier (même série), Mountain Planet 2028, Nordbat 2028, SEPEM Douai 2028, FIC 2027, SIFER, CFIA Rennes 2027, Expobiogaz.

**Prochaine édition hors fenêtre ou non annoncée sur la source primaire** : Patrimonia Lyon (33e édition le 30 septembre-1er octobre 2026, aucune date 2027 sur patrimonia.fr ; fort potentiel pour la shortlist 3 dès annonce), Grand Pavois La Rochelle 2027, AGECOTEL Nice 2028, Forexpo (2029), Itechmer Lorient, Seanergy 2027 ("dates and venue will be announced soon"), Paris Fintech Forum 2027, Talma 2027, Préventica Marseille, ViV Industry Bordeaux, SEPEM Brest, Dionysud (novembre 2026, biennal), MED'Agri Avignon (octobre 2026), Educatech Expo (décembre 2026), Silver Economy Expo (décembre 2026), Losangexpo (novembre 2026), Congrès de l'Ordre des Experts-Comptables, Congrès des Notaires, Convention Nationale des Avocats, Congrès AFVAC, Top Franchise Méditerranée (octobre 2026), Salon des Vins Demeter (février 2026), CITEXT Troyes (septembre 2028), Salon International du Patrimoine Culturel (octobre 2026), Beauty Forum Paris, JDL Expo Beaune (septembre 2026), REuse Economy Expo, France Vet, RiverDating, FCTM ESOPE, BE 5.0 Mulhouse, Plastics Meetings, Intersol, Solarplaza Summit, ASD Alliance, Carrefour des Gestions Durables de l'Eau Dijon, Salon Agro Hauts-de-France, Business Expo Amiens.

**Non vérifiable (site officiel inaccessible ou introuvable)** : Art Elysées, AKAA, Nautic (nauticenseine.fr en 403), Degré Zéro Marseille, PROSUD Nice (1re édition octobre 2026), Aquibat (domaine perdu), Sport Achat Été (403), BSE Valence, ENVIROpro Grand-Est Nancy (contradiction 2027/2028 sur la source), Millésimes Alsace, Salon Maison Colmar, ALINA Bordeaux, Euradh Toulouse, Autonomic Sud.

**Grand public pur ou hors cible** : Rétromobile, Expozoo, SAVIM, Vinidôme, Occy'gène, Toulouse Space Festival, Salon Nautique d'Arcachon, Matter and Shape, Ob'Art, foires généralistes (Strasbourg, Mulhouse, Besançon, Nancy, Angers, Rennes, Tours, Rouen), salons étudiants, mariage, habitat, tatouage, art grand public (Art Up!, Art3f), Biennale Design Saint-Étienne (dominante culturelle, dates provisoires), congrès médicaux académiques de niche (Europa Organisation), CFMTC.

---

## Annexe : requêtes GSC non couvertes (baseline 2026-08-18)

| Requête | Clics | Impressions | Position | Résolution |
|---|---|---|---|---|
| la levée de la loire 2027 | 0 | (20 cumulées sur 2 requêtes) | 8,6 | Gap réel, voir La Levée de la Loire (P1) |
| levée de la loire 2027 | 0 | | | idem |
| salon batinov 2026 | 0 | 15 | | Fiche `batinov-lyon` en draft : gap de publication |
| mdd expo | 0 | 2 | | Fiche `mdd-expo-paris` en draft : gap de publication |
| conference marque employeur paris | 0 | 16 | 80,6 | Talma (Lyon 2026, 2027 sans date) : non retenu |

Hors périmètre (511 impressions, 56 requêtes) : CES Las Vegas, Bauma/BAU Munich, Messe Berlin (étranger), requêtes d'éditions passées (eurexpo 2017, salon digital 2018...), requêtes non événementielles (seminar in reims, open space bruz, cofaq), "agoris" (navigationnel, 74 impressions).

Les faux gaps de la shortlist 1 (Terres de Jim, SantExpo, Sirha Bake & Snack, GO Entrepreneurs) continuent d'apparaître et sont bien captés par leurs fiches (passe on-page D5) : Terres de Jim 167 impressions et 3 clics, SantExpo 216 impressions et 5 clics.

### Note méthodologique

Couverture de la demande nommée : 96% en volume d'impressions. Le plateau de trafic ne vient donc pas de gaps sur la demande existante mais de la taille de l'offre indexée : chaque nouvelle fiche crée sa propre demande (exemple des 33 fiches des lots 1 à 6, Art Basel Paris déjà à 70 impressions). La shortlist 2 ouvre des filières absentes (maritime, musées, montagne, forêt, flotte automobile, risk management, composites, lingerie, accessoires, funéraire, propreté) plutôt que de densifier des filières déjà couvertes. Limite : les calendriers des grands parcs (Viparis, Eurexpo, MEETT, Parc Chanot) sont inaccessibles en fetch statique, une shortlist 3 gagnerait à les parcourir en navigateur.
