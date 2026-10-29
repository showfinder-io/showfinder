# Cohorte trafic SEO : shortlist 5 de salons à créer

Établie le 2026-10-29, PROPOSITION À VALIDER PAR JULIEN (aucune fiche écrite).

Méthode : 7 agents de recherche Sonnet (parcs au navigateur, agri et maritime, industrie et BTP, santé, tech et services, agro CHR commerce, reliquats SL4) : 55 lignes brutes, 45 candidats uniques (`handoff/shortlist-5/candidats-*.md`, local). Puis `scripts/diag-sl5-pipeline.py` :
- dédoublonnage par Jev (Noul « même salon ? » contre les 5 fiches les plus proches parmi les 434 du catalogue) : aucun doublon (probabilité max 0,48, toutes sur des éditions régionales de séries en base, fiche par ville conforme aux arbitrages SL3) ;
- capture curl de la page officielle des dates (`handoff/shortlist-5/sources/`), puis Jev sur le texte capturé : édition à venir dans la fenêtre, dates concordantes au jour près, lieu, exposants, public pro ;
- volumes Google Ads France et SERP « nom 2027 » (DataForSEO, 0,18 USD), résultats de SERP classés par Jev ; score = demande / (1 + concurrents), x1,5 si l'édition tombe entre janvier et avril 2027. Tier A : au moins 100 recherches/mois et 4 concurrents au plus ; B : au moins 30 ; C : le reste.

GSC 90 jours (14 876 couples requête/page) : aucun gap nommé significatif, la demande nommée reste couverte par le catalogue. La SL5 élargit l'offre, elle ne rattrape pas de demande perdue.

Constat : les 7 agents sont restés sous leur cible (5 à 9 retenus chacun) car le catalogue couvre déjà l'essentiel des portefeuilles Comexposium, RX, GL events, Infopro, Weyou et des filières agri. Le gisement restant est fait de salons de niche, de congrès médicaux et de salons régionaux d'un ou deux jours.

## Lot 1 proposé : 23 fiches (demande mesurable ou série régionale porteuse)

Score décroissant. Vol = meilleure variante de mot-clé (recherches/mois). Contrôles Jev : V = édition à venir et dates concordantes (≥ 0,85) ; ! = point à lever par le writer.

| # | Salon | Dates | Ville, lieu | Vol | Tier | Point à lever |
|---|---|---|---|---|---|---|
| 1 | Salon Souveraineté Numérique | 29-30/06/2027 | Paris, Porte de Versailles | 390 | A | V. Volume possiblement thématique (requête générique), pas seulement de marque |
| 2 | MedInTechs | 03-04/03/2027 | Paris, lieu à lire | 720 | A | ! Dates à 0,51 sur la page capturée, lieu (Parc Floral) non écrit sur la source |
| 3 | Vapexpo France Paris | 11-12/04/2027 | Paris, Porte de Versailles | 590 | A | V. Filière vape et CBD : DÉCISION ÉDITORIALE à prendre |
| 4 | Forum International Bois Construction | 10-12/02/2027 | Paris, Grand Palais | 720 | A | V |
| 5 | Midi Mat Côte d'Azur | 19-20/03/2027 | Cagnes-sur-Mer, Hippodrome | 170 | A | V. Non vérifiable en SL4, désormais lu. Volume partagé entre les 3 éditions |
| 6 | JNLF (Journées de Neurologie de Langue Française) | 20-23/04/2027 | Lille Grand Palais | 480 | A | ! Exposition faible sur la page capturée |
| 7 | Capr'Inov | 17-18/11/2027 | Niort, Noron | 210 | A | V |
| 8 | JdC Garden Trends | 23-25/03/2027 | Marseille, Parc Chanot | 110 | A | V |
| 9 | Congrès National des Pharmaciens | 09-10/10/2027 | Lyon, lieu à lire | 110 | A | ! Lieu et organisateur non lus |
| 10 | JPRS (Journées Pratiques Respiration Sommeil) | 25-27/03/2027 | Bordeaux, Palais des Congrès | 70 | B | V |
| 11 | Nauti Pro | 02-04/02/2027 | Bordeaux, Hangar 14 | 90 | B | V |
| 12 | High-Tech Cardio | 10-12/03/2027 | Marseille, Palais du Pharo | 90 | B | ! Exposition non lue sur la page capturée (0,06) |
| 13 | Rendez-vous du Courtage Marseille | 23/03/2027 | Marseille, Parc Chanot | 30 | B | V. Distinct de journees-du-courtage (Paris) |
| 14 | Congrès SF2H | 02-04/06/2027 | Strasbourg, PMC | 110 | A | V. Écarté en SL4 pour « pas d'exposition » : exposition retrouvée, à confirmer |
| 15 | Salon SBE Lyon | 04-05/02/2027 | Lyon, Matmut Stadium Gerland | 90 | B | V |
| 16 | Congrès de l'Encéphale | 20-22/01/2027 | Paris, Palais des Congrès | 90 | B | ! Écarté en SL4 (pas d'exposition) ; l'agent santé en a trouvé, Jev 0,11 sur la page des dates |
| 17 | Salon de Podologie AFDP | 19-20/03/2027 | Paris, Parc Floral | 110 | A | ! Dates à 0,09 sur la page capturée, à relire |
| 18 | Premium Sourcing | 15-16/09/2027 | Paris, Carrousel du Louvre | 170 | B | V |
| 19 | BTP Expo Amiens | 14/10/2027 | Amiens, Mégacité | 110 | B | V |
| 20 | VinEquip | 23-25/03/2027 | Mâcon, Parc des expositions | 50 | B | V. Trouvé par 3 agents |
| 21 | Empreinte Expo Amiens | 14/10/2027 | Amiens, Mégacité | 40 | B | V. Co-localisé avec BTP Expo Amiens |
| 22 | Mondial Secours et Protection | 13-16/10/2027 | Bordeaux Lac | 40 | B | V (lu dans le PDF officiel). Non vérifiable en SL4 |
| 23 | Midi Mat Occitanie | 31/03-01/04/2027 | Labège, Diagora | 20 | C | V. À publier avec Midi Mat Côte d'Azur (même série) |

## Lot 2 proposé : 12 fiches (demande faible, intérêt de maillage ou d'imminence)

| Salon | Dates | Ville, lieu | Vol | Point à lever |
|---|---|---|---|---|
| Property Asset Retrofit | 02/02/2027 | Paris, Palais des Congrès | 10 | V |
| Journées Cicatrisations | 17-19/01/2027 | Paris, Palais des Congrès | 0 | V |
| Congrès AMF du 93 | 11-12/03/2027 | Le Bourget | 10 | V. Congrès de maires avec exposition (2e édition) |
| Congrès International de Métrologie (CIM) | 15-18/03/2027 | Lyon, Eurexpo (dans Global Industrie) | 10 | V. Co-localisé avec global-industrie |
| Congrès CFPV | 17-19/03/2027 | Paris, Maison de la Chimie | 10 | ! Exposition 0,62 |
| Spinexpo Paris | 12-13/01/2027 | Paris, Espace 38 | 20 | V. Petit format, taille non lue |
| Pépites & Papilles Rennes | 07-08/02/2027 | Rennes, Parc Expo | 0 | V. Pepites-et-papilles-bordeaux en base |
| Les Grandes Occasions de La France Agricole | 24-25/02/2027 | Douai, Gayant Expo | 0 | ! Source unique (NGPA), itinérant, exposition 0,26 |
| Édition Spéciale by Luxe Pack | 11-12/05/2027 | Paris, Carreau du Temple | 20 | V |
| Rendez-vous Forêt-Bois | 20-21/05/2027 | Belloy-Saint-Léonard | 0 | V. Salon en forêt, filière qui marche |
| Préventica Montpellier | 28-30/09/2027 | Pérols, Parc des expositions | 0 | V. Préventica Paris et Lyon en base, Agoris déjà en 5e position |
| Rendez-vous du Courtage Lille | 22/06/2027 | Marcq-en-Barœul | 20 | V |

## Écartés ou en attente (10)

- Build It Summit (01-03/12/2026) et Empreinte Expo Rouen (03/12/2026) : édition trop proche, le pic de recherche sera passé avant l'indexation.
- Congrès Français de Rhumatologie (13-15/12/2026) : trop proche, et dates non retrouvées sur la page capturée (0,08).
- FOWT 2027 : dates non retrouvées sur la page capturée (0,02), à revérifier.
- Cycl'Eau Corsica : dates non retrouvées sur la page capturée (0,09), à revérifier.
- Itechmer : site en erreur 500 avec du spam injecté, aucune source lisible.
- Congrès SFCR : pas d'exposition lue (0,06).
- F.A.B. Impulse (ex CAP IT) : exposition lue seulement en mention de sponsoring (0,50), 10 recherches/mois.
- BTP Expo Colmar : pas de site propre (dates lues sur un salon co-localisé), public pro à 0,23.
- Rest'Hôtel Tarbes (10-11/10/2027) : exposants non lus sur la page (0,29), 30 recherches/mois ; à reprendre avec la série Rest'Hôtel si besoin.

Reliquats SL4 toujours non vérifiables (capture navigateur nécessaire) : Top Transport Saint-Malo, Ceramic Network, SPIE Photonics Europe 2028, Midi Mat Provence (dates non publiées), Enlit Europe, Ouest Industries, Solutions CSE Lille, Shipping Days La Rochelle, Désherb'Avenir 2027. Écartés définitivement : RICAI (congrès d'infectiologie, hors cible), Energies+ et Salon des Caves Particulières (introuvables), Patrimonia Lyon (pas de dates 2027), Batinov (aucune source primaire), SFAP (pas d'exposition).
