# Relecture agent : prestataires (lot test du 2026-09-21), 2026-11-12

Reviewer indépendant et sceptique, en remplacement de la relecture de Nicolas (todo G14).
Méthode : contenu publié en prod relu (curl, user-agent Chrome) et comparé à la base (SELECT seul, aucune écriture), aux sites officiels re-fetchés le 2026-11-12 (pages contact, mentions légales, accueil) et au registre (recherche-entreprises.api.gouv.fr, même source que annuaire-entreprises.data.gouv.fr). Les dossiers figés de `handoff/prestataires/` ont servi de point de comparaison, pas de preuve.
Limite : les pages de références de Videlio et de Lenôtre sont rendues côté client et n'ont pas pu être relues en direct ; pour ces deux sites les citations reposent sur le dossier figé du 2026-09-21 (dit "assumé", pas "confirmé").

## Synthèse

- Fiches : 6 OK, 10 CORRECTIONS, 0 À DÉPUBLIER.
- Hubs : 2 OK, 3 CORRECTIONS (standistes, standistes-paris, standistes-lyon).
- Aucune fiche n'est un homonyme ou une entreprise disparue : l'identité des 16 est confirmée par le registre ou les mentions légales.
- Défauts les plus graves : (1) les 3 hubs standistes affichent en tête de liste et comptent comme standistes GL Events Venues (gestionnaire de sites, marqué vérifié) et MCI France (agence de communication, page en noindex) ; Pico est compté dans les 66 alors qu'aucune entité française n'est identifiable ; (2) ville et département faux en base pour Dushow (Paris au lieu de Roissy-en-France), Videlio (Paris au lieu de Gennevilliers), Alisés (Croissy-Beaubourg au lieu de Chalifert), ce qui sort dans le JSON-LD et fausse le filtre de proximité du drawer ; (3) contradiction entre hubs sur la définition du stand traditionnel ; (4) coordonnées héritées du seed d'avril introuvables sur les sites officiels (téléphones Dushow, Lenôtre, Videlio, e-mails Lenôtre, Videlio) ; (5) références clients d'Aukaré (Corum, April) qui ne sont plus publiées.

## Fiches

### 1. affaire-d-idees : OK
Vérifié sur affairedidees.com (accueil et /a-propos/) : fondée en 2010 ("Conception & Fabrication depuis 2010"), atelier 1 200 m², menuiserie, métallerie, impression, peinture, "Zéro sous-traitance cachée", Better Stand Argent, 16 chemin des Mûriers 69740 Genas. Registre : SIREN 528330053, créée le 2010-10-19, Genas, active (nom commercial PYR4MIDE).
Remarque sans correction : le registre porte aussi le nom commercial PYR4MIDE, absent du site ; à ne pas utiliser.

### 2. alphaexpo : CORRECTIONS
1. Passage : "L'agence est basée à Genas (69740), près de Lyon, et son siège social est à Gap (05000)." Correction : "Alphaexpo est basée à Genas (69740), près de Lyon." Preuve : les mentions légales du site (https://www.alphaexpo.fr/mentions-legales/) donnent Gap et RCS Gap 489 034 454, mais ce SIREN est GROUPE DXF (DPC), créé le 2006-02-01, siège 12 rue Lionel Terray 69740 Genas (même adresse que le bureau de la page contact). Le siège de Gap est une mention périmée du site ; la fiche ne doit pas la répéter (P4 : le registre fait foi pour le siège).
2. Passage : "Alphaexpo est membre du Leads et ses menuiseries sont certifiées ISO 20121." Correction : supprimer "membre du Leads" (P5 : l'appartenance est une donnée structurée, déjà dans `memberships`). Garder la phrase ISO 20121 telle quelle : le site écrit "nos menuiseries sont certifiées Iso 20 121" (https://www.alphaexpo.fr/agence/).
3. Signalement sans correction de texte : la société de 2004 (SIREN 478843386, Lyon 6e) est radiée depuis 2014-12-30. "Fondée en 2004 par Pierre-Olivier Debard" est la déclaration du site (https://www.alphaexpo.fr/agence/) et prime (P21), mais `founded_year` = 2004 ne correspond pas à l'entité juridique actuelle (2006). Garder 2004 en l'attribuant au site, ou passer `founded_year` à null.
Vérifié OK : 1 500 projets, plus de 500 clients, deux ateliers, Ligier (Mondial de l'automobile, 472 m²) et Vinci (Pollutec, 138 m²) sur https://www.alphaexpo.fr/realisation/.

### 3. aukare : CORRECTIONS
1. Passage : "Parmi ses réalisations figurent des stands pour Paprec au salon Pollutec, Corum au salon Patrimonia et April au salon JDC Courtage." Correction : "Parmi ses réalisations figure un stand pour Paprec au salon Pollutec." Preuve : "Stand Paprec 530m2 - Salon Pollutec" est toujours publié (https://www.aukare-stand.com/stand-modulaire et /stand-sur-mesure). Corum et April figuraient sur le carrousel de l'accueil au moment du dossier ; le 2026-11-12 ni l'accueil, ni /stands, ni /agence-aukare ne les affichent (P7 : dans le doute, rien). Si Julien veut garder une seconde référence : "Rivard au salon Pollutec" est publié ("Stand Rivard 174m² - Salon Pollutec", https://www.aukare-stand.com/stands).
Vérifié OK : Décines-Charpieu (TGEVENT SAS, marque AUKARÉ, SIREN 750223281, créée le 2012-03-08, mentions légales), services (conseil stratégique, étude technique, fabrication, logistique), "France et Europe".

### 4. axial-design : OK
Mentions légales : axial design SAS, 3 allée des Séquoias 69760 Limonest. Registre : SIREN 339173106 "AXIAL", créé le 1986-09-22, même adresse. "certifiée RSE ISO 20121", prix du stand éco-conçu Pollutec 2004 pour le Grand Lyon, "Lyon, Paris, Shanghai" : sur https://www.axial-design.com/agence. Hermès (hall d'accueil), Bobst (show-room), Solvay (meeting center) sur https://www.axial-design.com/agencement.
Amélioration facultative : `founded_year` peut passer de null à 1986 (registre, SIREN 339173106), le site disant "40 ans d'expérience". La casse "axial design" est la graphie du site et des mentions légales : à garder.

### 5. lenotre-paris : CORRECTIONS
1. Passage : "La maison exploite aussi deux restaurants à Paris, dont Le Pré Catelan, récompensé de trois étoiles au guide Michelin." Correction : "La maison exploite aussi deux restaurants, dont Le Pré Catelan, dans le bois de Boulogne, récompensé de trois étoiles au guide Michelin." Preuve : le site situe le second restaurant "au sein du Stade de France" (https://www.lenotre.com/espace-entreprise, citation du dossier), donc à Saint-Denis, pas à Paris.
2. Coordonnées : téléphone 01 45 02 21 21 et e-mail traiteur@lenotre.com, hérités du seed d'avril, introuvables sur lenotre.com (accueil, /contact, /espace-entreprise, /entreprise) le 2026-11-12. Les retirer de la base ou les sourcer (elles sortent dans le JSON-LD).
3. Pertinence (non bloquant) : la fiche parle de coffrets CSE et de team building en cuisine, sans lien avec un exposant. À recentrer sur réceptions d'entreprise si le site le permet ; sinon laisser.
Vérifié OK : "Traiteur parisien d'exception depuis 1957" (accueil), consulting et école héritée de Gaston Lenôtre (accueil), siège 44 rue d'Auteuil 75016 (registre, SIREN 662054543, active). L'écart 1957 (site) contre 1966 (registre) est signalé dans le dossier ; le site prime.

### 6. potel-et-chabot-paris : OK
Mentions légales : 3 rue de Chaillot 75016 Paris ; registre SIREN 552043754, actif, même adresse. Chronologie du groupe (1820, Saintclair 1982 puis 1988, Dalloyau 1682 puis 2024, Accor 40 % en 2017 puis 100 % en 2023) : citée sur la page À propos du groupe (dossier) ; l'accueil actuel confirme "filiale du Groupe Accor", "Depuis 1820 / 1982 / 1682", "dix lieux parisiens" (https://www.poteletchabot.com). ISO 20121 renouvelée en 2025 (page engagements du dossier).
Remarque : la fiche décrit surtout le groupe ; c'est assumé dans le texte.

### 7. dushow-paris : CORRECTIONS
1. Donnée : city = "Paris", postal_code vide, department = 75. Correction : city "Roissy-en-France", postal_code 95700, department 95. Preuve : mentions légales de dushow.com ("ZAC du Moulin, 18 rue du Meunier 95700 ROISSY-EN-FRANCE", RCS Pontoise 529 975 674) et registre (SIREN 529975674, même adresse). La description le dit déjà ; la base le contredit, et le JSON-LD publie `addressLocality: Paris`.
2. Coordonnées : téléphone 01 49 46 06 60 introuvable sur le site ; le site publie +33 1 34 38 25 25. À remplacer par le numéro du site ou à retirer. L'e-mail contact@dushow.com est confirmé (https://www.dushow.com/contact).
3. Slug : `dushow-paris` pour une société de Roissy ; acceptable (marque parisienne du groupe) mais, si on renomme magnum-lyon et expocom-paris, renommer aussi celui-ci par cohérence (non bloquant).
Vérifié OK : studio de répétition 1 000 m² (accueil), bureau d'études (plans, notes de calcul, simulation 3D), filiales Alabama Média et DushowTV, création 2019 de DushowTV, "Dushow & Le Groupe Novelty s'engagent dans la norme ISO 20121".

### 8. magnum-lyon : CORRECTIONS
1. Slug : `magnum-lyon` alors que la société est à Gonesse (99 rue de Paris 95500, SOCIÉTÉ ACOUSTIQUE FRANÇAISE SAS, SIREN 338378789, créée le 1986-07-01, mentions légales de https://www.magnum.fr/mentions-legales). Aucune source ne mentionne Lyon. Renommer en `magnum-gonesse` (301 FR/EN, mise à jour des liens, sitemap) AVANT de demander l'indexation (la fiche est dans la file "reste à soumettre").
Texte : OK. Vérifié : "prestataire depuis 1986" (https://www.magnum.fr/qui-sommes-nous), "plus de 5000 références", "Partenaire technique de 30 lieux en régie", Label Prestadd depuis 2011 et ISO 20121 depuis 2024 sur le site de Gonesse (https://www.magnum.fr/nos-engagements-rse), appartenance au Groupe Novelty (navigation du site).

### 9. novelty-paris : OK
Mentions légales : NOVELTY SASU, 86 boulevard de la Tour Maubourg 75007 Paris, RCS Paris 419 822 408 ; registre actif. "Fondée en 1973 à Paris" sur https://www.novelty.fr/qui-sommes-nous/ ; liste des agences régionales et internationales sur l'accueil. L'écart 1973 (site) contre 1997 (registre) et la frise qui démarre en 1987 sont connus ; le site prime.
Remarque mineure : "présenté sur son site comme expert des métiers de..." est attribué, donc admissible ; "expert" reste à surveiller si on fait un nouveau passage P10.

### 10. videlio-paris : CORRECTIONS
1. Donnée : city = "Paris", department = 75. Correction : city "Gennevilliers", postal_code 92230, department 92. Preuve : siège 141 avenue des Grésillons 92230 Gennevilliers (registre, SIREN 350093704, créée le 1989-03-08, active ; le texte de la fiche le dit déjà). Le JSON-LD publie `addressLocality: Paris`.
2. Coordonnées : téléphone 01 55 86 00 00 et e-mail events@videlio.com introuvables sur videlio.com le 2026-11-12. Retirer ou sourcer.
3. Références (UNESCO, Mairie de Paris, Parlement européen) : plus relisibles en direct (page https://www.videlio.com/nos-references rendue côté client). Elles étaient prouvées par le dossier du 2026-09-21. Assumé, non confirmé le 2026-11-12 : à re-capturer dans le navigateur avant d'en faire un argument.
Slug `videlio-paris` : voir remarque slug de Dushow.

### 11. expocom-paris : CORRECTIONS
1. Slug : `expocom-paris` pour une entreprise de Metz (2 bis rue de Courcelles 57070 Metz, pied de page du site). Renommer en `expocom-metz` (301 FR/EN) AVANT l'indexation. Identité confirmée : registre SIREN 440499671 "EXPO POINT COM (EXPO.COM)", créée le 2001-12-07, ZAC Grange aux Bois 2 rue de Courcelles 57070 Metz, active. Le dossier signalait une identité incertaine : levée.
Texte : OK. Vérifié : "Spécialiste dans la fabrication de signalétique, d'enseigne et la réalisation de décor depuis 2001", stands parapluie et kits d'exposition, exposition Astérix à Malbrouck, label Imprim Vert, "territoire national et les pays limitrophes" (https://www.expocom.fr/notre-entreprise).
Remarque : `founded_year` null est correct (2001 est une date de diversification selon le site). Le titre de page "Expocom - Autre | Agoris" est faible mais non bloquant.

### 12. aktuel : CORRECTIONS
1. Passage : "dispose d'un second site à Cannes". Correction : "dispose d'un second site dans les Alpes-Maritimes, à Grasse (agence Cannes)". Preuve : https://www.aktuel.fr/ affiche "Cannes 61 route de la Marigarde 06131 GRASSE". Le claim du dossier le disait déjà ("à Cannes, à Grasse").
Vérifié OK : Palaiseau, 36 avenue du 1er mai 91120/91127 (registre SIREN 444507586, créée le 2002-12-12), ISO 20121 depuis 2019 (accueil), groupe Alive (navigation), domaines corporate, réceptif, mode, institutionnel, culturel et ambiances (https://www.aktuel.fr/pages/expertises), "Spécialistes du B2B" (auto-positionnement du site, admis par P10).
Remarque : la base et le site portent 91127 (code CEDEX affiché par le site) ; le registre donne 91120 Palaiseau. Non bloquant, à harmoniser sur 91120 si on veut un code postal standard.

### 13. aliance-mobilier : OK
Registre : ALIANCE MOBILIER, SIREN 489945139, créée le 2006-05-01, 20 boulevard du Libre Échange 31650 Saint-Orens-de-Gameville ; mentions légales du site identiques. "Spécialiste de la location de mobilier en Europe", "boutique de l'exposant", établissement secondaire à Châlons-en-Champagne (https://aliance-mobilier.com/nos-engagements/), "France et pays limitrophes" (fiche annuaire, source P1 admise). Le texte attribue le positionnement ("avec un positionnement de spécialiste") : admissible.

### 14. alises : CORRECTIONS
1. Donnée : city = "Croissy-Beaubourg", postal_code = 77183. Correction : city "Chalifert", postal_code 77144 (department 77 inchangé). Preuve : pied de page de https://www.alises.fr/ ("7 rue de la Persévérance 77144 Chalifert", "RCS B388972358") et registre (SIREN 388972358, créée le 1992-10-01, siège 7 rue de la Persévérance 77144 Chalifert). La description dit déjà Chalifert ; le JSON-LD publie 77183 Croissy-Beaubourg. Le dossier indiquait que cette correction restait à faire.
2. Précision : la phrase "après un déménagement récent depuis Croissy-Beaubourg" est datée par le dossier (annonce du 14/04/2026, effectif le 24/04/2026) mais l'ancienne adresse reste sur les mentions légales du site (27 rue des Vieilles Vignes, Croissy-Beaubourg). Garder la phrase ; elle se périmera, la remplacer à terme par "basée à Chalifert".
Vérifié OK : "DEPUIS 1992", entrepôts 8 000 m², catalogue de 120 pages, livraisons "sur toute la France mais également sur l'Europe" (page société du dossier).

### 15. alive-group : OK
Registre : ALIVE GROUP, SIREN 979282514, créée le 2023-09-07, 119 chaussée Marcelin Berthelot 59200 Tourcoing, active. 600 collaborateurs, 100 M€ de CA, "Un Groupe, 12 marques", Butterfly "labellisé Traiteur de France", ISO 20 121, agences (Lille, Gonesse, Brétigny, Moissy-Cramayel, Antony, Angers, Lyon, Cannes, Lausanne) : confirmés sur https://www.group-alive.com/ et /alive-group-agences. Les mentions légales du site citent encore l'ancien SIRET (ALIVE GROUPE, radiée le 2024-06-27) : défaut du site, pas de la fiche.
Remarque : la catégorie `location_mobilier` est large pour un groupe multi-métiers ; le hub la rend explicite ("production technique où le mobilier n'est qu'un poste"), donc acceptable.

### 16. design-location : CORRECTIONS
1. Passage : "Design Location est le spécialiste de la location de mobilier à Paris et en province". Correction : "Design Location est une entreprise de location de mobilier basée à Goussainville, fondée en 2005." Preuve : la phrase reprend la baseline du site ("Le spécialiste de la Location de Mobilier à Paris & Province", https://www.designlocation.fr/), écrite en voix Agoris sans attribution (P10 superlatif/définitif, P11 slogan). Variante admissible : "se présente comme le spécialiste de...".
Vérifié OK : SIREN 480908664, créée le 2005-01-20, 37 rue Gustave Eiffel 95190 Goussainville ; "Depuis plus de 20 ans" ; badge Committed EcoVadis ; "+ de 500 références" (page société du dossier).

## Hubs

### H1. standistes-paris : CORRECTIONS
1. Passage : "Le stand traditionnel, dit sur mesure, est dessiné pour une marque et un emplacement donnés". Correction : "Le stand sur mesure est dessiné pour une marque et un emplacement donnés". Contradiction avec le hub /prestataires/standistes ("Le stand traditionnel, clé en main, s'appuie sur des cloisons et du mobilier standardisés") et avec Alphaexpo qui distingue traditionnel, modulaire, hybride.
2. Liste : le premier élément de l'ItemList est MCI France (agence de communication et d'événementiel, page en noindex, description jugée trop pauvre). Voir point commun ci-dessous.
3. Le chiffre "39 standistes dont le siège est en Île-de-France" est exact en base (39) mais inclut MCI France.

### H2. standistes-lyon : CORRECTIONS
1. Passage : "Agoris référence 10 standistes basés dans cette zone". Le premier élément de la liste est GL Events Venues (gestionnaire de sites, marqué vérifié, noindex) : ce n'est pas un standiste (constat du dossier, G12). Corriger le périmètre, donc "9", ou le texte.
2. Le texte annonce "le Rhône, l'Ain, l'Isère et la Loire" : aucun prestataire en base dans l'Ain ni la Loire (9 en Rhône et Isère). Formulation exacte : "Rhône et Isère", ou conserver la zone en précisant que l'Ain et la Loire sont couverts par la zone mais sans prestataire référencé.
3. Pech'Up est compté dans la zone avec la ville Beauvallon ; voir "Points tranchés".

### H3. standistes : CORRECTIONS
1. Passage : "Agoris référence 66 standistes dont le siège est en France" (aussi dans la meta description). Les 66 incluent GL Events Venues (pas un standiste), MCI France (agence de communication) et Pico International France (aucune entité française identifiable, dé-vérifié le 2026-09-21). Recompter après décision sur ces trois fiches (63 si les trois sortent de la catégorie), et sortir le chiffre du MDX statique si possible (il se périme à chaque ajout).
2. Le premier élément de l'ItemList est GL Events Venues.

### H4. location-mobilier-evenementiel : OK
Cinq prestataires en base, tous `location_mobilier` (aktuel, aliance-mobilier, alises, alive-group, design-location), conforme à "cinq". "Basés dans plusieurs régions françaises" : exact (Île-de-France, Occitanie, Hauts-de-France). Liens internes tous en 200. Aucun chiffre hors comptage, aucun prix, aucun classement. Réserve : le seuil `min_providers` = 5 est atteint pile ; la sortie d'un seul prestataire doit faire repasser le hub en noindex.

### H5. prestataires-audiovisuel-paris : OK
Sept prestataires `av_technique` dont le siège est en Île-de-France (Bobigny 93, Gonesse 95, Bondoufle 91, Nanterre 92, et Dushow, Novelty, Videlio), conforme à "sept". Après correction des villes de Dushow et Videlio (Roissy 95, Gennevilliers 92), le comptage reste juste. Tous les liens /lieux/ et /salons/ répondent 200, salons publiés, lieux et salons cohérents avec la zone (Batimat, Mondial de l'Auto, Maison&Objet, SIAL, VivaTech : Île-de-France). Aucune affirmation chiffrée hors comptage.

### Points communs aux hubs
- Corriger les listes : GL Events Venues et MCI France sont affichés en tête car "vérifiés", alors qu'ils sont noindex ou hors catégorie. Soit les passer en `is_verified=false` et en catégorie `autre`, soit les exclure des hubs.
- Aucun tiret long, aucun JSX, intro de 1 291 à 1 502 caractères (plafond 1 500 touché), liens FR et EN en nombre égal.

## Points tranchés

1. DB Schenker (`db-schenker-paris`) : conforme à la décision Julien du 2026-09-21 (dé-vérifié, fiche et liens conservés). Constat 2026-11-12 : fiche non vérifiée, non indexable ; aucune action de plus. Source : dbschenker.com redirige vers dsv.com, aucune entité française événementielle identifiable.
2. Pico International France (`pico-international-paris`) : dé-vérifié, noindex, sans département ni code postal. Tranché : la garder hors indexation, mais la sortir de la catégorie `standiste` (ou du comptage des hubs) tant qu'aucune entité française n'est sourcée. Elle fausse "66 standistes dont le siège est en France".
3. GL Events Venues (`gl-events-venues-lyon`) : tranché, ce n'est pas un standiste. Source : le site du groupe structure GL events en trois pôles Live, Exhibitions et Venues (https://gl-events.com) ; registre : GL EVENTS VENUES, SIREN 495014524, 59 quai Rambaud 69002 Lyon, créée le 2007-04-01. Actions : passer la fiche en `is_verified=false` (elle est vérifiée aujourd'hui) et en catégorie `autre`. Je ne peux pas nommer l'entité du groupe qui construit des stands : la source ne figure pas dans ce que j'ai lu (inconnu, à demander à Nicolas ou à sourcer sur gl-events.com).
4. MCI France, Studecors : laisser en noindex. MCI France est marquée vérifiée et listée en tête du hub Paris alors que sa page est en noindex ; la dé-vérifier. Studecors : registre SIREN 478199318, créée le 2004-08-09, 19 rue Louis Armand 77330 Ozoir-la-Ferrière, active ; la fiche est cohérente, elle reste noindex faute de matière, sans autre action.
5. Iboo Studio : afficher Auray (56400, département 56). Source : le site (7 rue Georges Clémenceau 56400 Auray, http://iboostudio.com/ et mentions légales) ET le registre (SIREN 444232508 "I-BOO STUDIO", créée le 2002-10-30, siège 7 rue Georges Clémenceau 56400 Auray, active). Le RCS de Pontoise cité par le site et la ville Courdimanche (95) du fichier LEADS sont des états anciens. La base porte encore Courdimanche 95800 / 95 : à corriger (city, postal_code, department). La fiche est noindex ; elle compte aujourd'hui à tort dans les standistes d'Île-de-France (39 devient 38) et, après correction, dans aucun hub de zone.
6. Pech'Up : afficher Millery (69390, département 69). Source : mentions légales ("Siège social : 20 Rue du Rave, 69390 Millery", https://pechup.fr/mentions-legales) et registre (SIREN 884382367, 29 rue du Rave 69390 Millery, 2 établissements ouverts). Beauvallon (92 route des Varennes 69700) est l'adresse affichée dans le pied de page, vraisemblablement un établissement ; P4 donne la priorité au siège du registre. Le département 69 est identique dans les deux cas : aucun effet sur les hubs.
7. Gilles Bouvry : non importé (aucun slug `bouvry` en base, vérifié). Rien à faire ; la ligne reste à renvoyer à Nicolas à son retour (G8). Je n'ai pas re-testé le site mort.
8. Casse des noms : valider "axial design" (mentions légales : "axial design SAS", logo et texte en minuscules), "Live & co" (site live-co.eu : "Live & co" 14 fois contre "LIVE & CO" 1 fois), "Des Pas En Avant" (site : "Des Pas En Avant" 7 fois contre capitales 2 fois), "2B" (site : "2B®"). Toutes les graphies retenues sont celles des sites.
9. Rattachement salons / prestataires : déjà tranché (pas de rattachement, G4). Pas de reprise.

## Autres constats hors périmètre direct

- Les 16 meta descriptions publiées reprennent la description entière (500 à 800 caractères) : Google la tronquera. Prévoir un `seo_description` de 150 à 160 caractères par fiche (non bloquant, applicable aux 85 fiches).
- Les badges "Vérifié" affichés sur Lenôtre, Dushow, Novelty, Videlio, Potel et Chabot viennent du seed d'avril. Les textes ont été revérifiés ici ; les coordonnées de contact de ces fiches non (voir fiches 5, 7, 10).
- Aktuel : postal_code 91127 (cedex du site) contre 91120 au registre, non bloquant.

## Feu vert pour Request Indexing : oui, par étapes

Oui tout de suite (aucune correction bloquante) : affaire-d-idees, axial-design, potel-et-chabot-paris, novelty-paris. Déjà soumises le 2026-09-21 et valides : aliance-mobilier, alive-group, et les hubs location-mobilier-evenementiel et prestataires-audiovisuel-paris.

Oui après correction (texte ou base, puis redéploiement ; pas de re-soumission nécessaire pour les pages déjà soumises) : alphaexpo (fiche 2), aukare (fiche 3), lenotre-paris (fiche 5), dushow-paris (fiche 7), videlio-paris (fiche 10). Pour les pages déjà soumises le 2026-09-21 (aktuel, alises, design-location) : corriger, sans nouvelle soumission.

Non tant que le slug n'est pas renommé : magnum-lyon (renommer en magnum-gonesse) et expocom-paris (renommer en expocom-metz), avec 301 FR et EN, sinon l'URL erronée s'indexe.

Hubs standistes, standistes-paris, standistes-lyon : déjà soumis le 2026-09-21 ; corrections de texte et de liste à faire (H1 à H3), aucune re-soumission requise, mais ne pas mettre ces trois hubs en avant (liens depuis la page /prestataires, maillage) avant correction de leur tête de liste.
