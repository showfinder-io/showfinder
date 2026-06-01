# Règles édito Agoris — Référentiel unique v2

> Consolidation des **33 règles canoniques Nicolas** (R1-R33, cohortes 1-2 BTP)
> et des **36 règles RR Dream** issues des cohortes 1-6 (RR1-RR36).
> Date : 2026-06-01 (v2 post-cohorte 6). À injecter in extenso dans le brief writer cohorte 7+.

**Statut** : 69 règles formalisées au total. R1-R33 = canoniques (Nicolas).
RR1-RR36 = candidates Dream consolidées (6 cohortes, 113 fiches observées).

---

## PARTIE I — R1 à R33 (canoniques Nicolas)

### A. Sources et citations

- **R1** Sources sur les chiffres clés uniquement (visiteurs/exposants), OJS prioritaire ; reste en bas de page.
- **R2** Jamais deux chiffres contradictoires (hiérarchie OJS > organisateur > presse), conflit en alerte interne jamais en texte.
- **R3** Sources interdites : **mediaproduct.fr ET presseagence.fr**.
- **R4** Ne jamais citer un concurrent (EventsEye, TradeFairDates) comme source.
- **R5** Ne pas sourcer ce qui va de soi (dates, lieu, tarifs sur le site officiel).
- **R6** Une seule mention de source quand tous les chiffres viennent du même organisateur (pas répéter après chaque bullet).
- **R7** Ne pas sourcer l'organisateur, la fréquence, le lieu.

### B. Données non disponibles

- **R8** Supprimer plutôt qu'afficher « donnée non disponible » (exception : absence informative).
- **R9** Pas de tableau budget si aucun chiffre.
- **R10** Supprimer la sous-section « Taux de fidélisation ».
- **R11** « Nouveautés » et « Prix » : afficher seulement si rempli (vérifier le site avant de conclure à l'absence).
- **R12** Vérifier les horaires sur le site avant « non disponible ».
- **R13** Pas de « la liste sera publiée à l'approche » → lien direct page exposants.

### C. Exactitude et vérification

- **R14** Résoudre les contradictions avant de publier (vérifier le site officiel ; conflit persistant → alerte interne, pas texte).
- **R15** Corriger la fréquence en base si erronée (ex. « ponctuel » vs « triennal »). Action DB, pas seulement éditoriale.
- **R16** Date du prochain salon : souvent déjà annoncée, chercher avant d'écrire « non annoncée ».
- **R17** Ne pas attribuer le chiffre global d'un méta-salon à un composant (Idéobain ≠ 135 000 du Mondial du Bâtiment).
- **R18** Parcourir le site du salon à fond avant de rédiger (co-organisateur, prix, RSE souvent absents des CP indexés).

### D. Contenu éditorial

- **R19** Toujours organisateur + fréquence dans le bloc identité.
- **R20** Indiquer le co-organisateur s'il existe (parcourir home/footer/à propos).
- **R21** La note RSE s'appuie sur le site du salon (page « Nos engagements »/RSE), pas sur une inférence.
- **R22** Ajouter un bloc RSE à chaque fiche.
- **R23** Si les engagements RSE ne sont pas vérifiables publiquement → alerte interne, pas affirmation en texte.
- **R24** Conférences : donner l'historique de l'édition précédente si la suivante n'est pas publiée.
- **R25** Ne pas accoler nombre de jours et nombre de visiteurs.

### E. Ton et formulations

- **R26** Ne jamais utiliser « revendiqué » (péjoratif) → « affiché », « positionné ».
- **R27** Saut de ligne quand on change de sujet (« Communauté & réseaux » : presse sur une nouvelle ligne ; bloc RSE : un sujet = un paragraphe).
- **R28** Synthétique, pas de redite entre blocs.
- **R29** Jamais de contrainte géographique sur les prestataires.

### F. Navigation et liens

- **R30** Logistique → pointer vers la fiche lieu.
- **R31** Exposants notables → lien page exposants officielle.
- **R32** Rendre organisateur et lieu cliquables vers leur page Agoris dédiée (feature technique).
- **R33** Les commentaires internes (« à recouper via retours exposants »...) ne doivent jamais apparaître dans la fiche → alertes admin.

---

## PARTIE II — RR1 à RR30 (Dream cohortes 1-5)

### RR1-RR17 (cohortes 1-4bis, 31 fiches)

- **RR1** Vérification dernière édition avant écriture : fetch home du site officiel pour identifier dernière édition bilantée et prochaine annoncée. Distinguer chiffres OJS/audités des projections marketing.
- **RR2** Anti-fabrication d'exposants/partenaires : n'inclure que les exposants/partenaires explicitement listés sur la page officielle 2026. Pas de « présence régulière » non confirmée.
- **RR3** Anti-création de slogans/baselines : ne jamais créer ou paraphraser un wording marketing. Si la home ne le porte pas verbatim, ne pas l'inclure.
- **RR4** Convention sources implicites : ne pas écrire « (source : organisateur) ». Footer générique : *« Toutes les données qui ne mentionnent pas la source proviennent du site de l'organisateur. »*
- **RR5** L'Essentiel obligatoire : Site officiel + Organisateur (entité légale) + Co-organisateur (si applicable, distinct) + Fréquence + Lieu (lien interne) + Dates édition prochaine.
- **RR6** Organisateur ≠ opérateur événementiel : organisateur institutionnel (FHF, AMF, Bordeaux Technowest) dans `organizer_name`, opérateur (GL Events, Comexposium, BEAM, Infopro Digital) dans `co_organizer_name`.
- **RR7** Numérotation d'édition vérifiée : avant « Xe édition », vérifier la séquence. Si non vérifié, écrire « édition 2026 » sans numéro.
- **RR8** Dates fetchées sur l'URL officielle : title tag ou home. Snippets Google (SERP) souvent obsolètes.
- **RR9** Cohérence jour-de-semaine vérifiée : 20 octobre 2027 = mardi, etc.
- **RR10** Salon renommé → clarifier l'identité actuelle dans L'Essentiel (slug ancien Paris Healthcare Week, Europack, Midest, Numeriquest → identité actuelle SantExpo, Prod&Pack, Global Industrie, THCon).
- **RR11** Lieux liés en interne : pointer vers `/lieux/[slug]`. Si venue absent de `venues`, créer en migration.
- **RR12** Liens externes target=_blank (implémenté côté composant MDX).
- **RR13** Image hero alignée sur édition courante : si l'image affiche les dates d'une édition précédente, ne pas l'afficher.
- **RR14** Anti-sur-correction en pass de correction : ne PAS retirer un fait juste parce qu'il n'est pas trouvé sur la home. Vérifier sources alternatives (sous-pages, presse spé crédible) avant retrait.
- **RR15** Rebranding non confirmé : ne pas affirmer (ex. « Paris Builders Show » inventé sur Mondial du Bâtiment 2026).
- **RR16** Nature institutionnelle des sigles vérifiée (ex. ANSSI = agence gouvernementale, pas labo recherche).
- **RR17** Numérotation incluant l'année de création : événement créé en N + édition en N = 1re édition de N (pas édition 0). Ex. THCon créé 2017 = 1re éd 2017, 2018 = 2e.

### RR18-RR24 (cohorte 5 pass-1, 53 fiches)

- **RR18** Lieu obligatoirement fetché sur la page « infos pratiques » du site officiel. Ne jamais reproduire le lieu du brief sans vérification.
- **RR19** Vérifier systématiquement les rachats / changements opérateur post-2020 via footer / mentions légales + presse spé si récent.
- **RR20** Cycle biennal années impaires : pas d'éd année paire. Vérifier le rythme (annuel / biennal pair / biennal impair) AVANT d'écrire les dates.
- **RR21** Cible vs bilan réalisé : distinction obligatoire. Préfixer « cible » ou « annoncé » si la source est marketing pré-événement, vs « audité/OJS/bilan » post-événement.
- **RR22** Libellé officiel des awards / prix verbatim. Citer **textuellement** depuis le site organisateur. Ne pas paraphraser ni traduire.
- **RR23** Historique sans source primaire = à retirer. Pas de date de création sans source vérifiée (Wikipédia, page « About »). Sinon « fin années X » ou retirer.
- **RR24** Reviewer doit citer URL source pour chaque « à corriger ». Pas d'affirmation sans citation.

### RR25-RR30 (cohorte 5 pass-2, 51 fiches)

- **RR25** Anti-sur-correction du reviewer pass-1. Reviewer pass-1 doit citer URL contradictoire pour chaque « à corriger ». Sans URL, pass-2 retest sur sources alternatives avant de valider la suppression.
- **RR26** Pays invités / partenaires : vérifier l'année exacte (N vs N-1 vs N+1) via communiqué officiel de l'édition concernée, pas d'extrapolation.
- **RR27** Vérifier prénoms et titres exacts sur LinkedIn / page « Équipe » du site officiel. Erreur de prénom = risque crédibilité massif.
- **RR28** Confusion de programme entre salons concurrents : vérifier que les programmes RSE / awards cités appartiennent bien au salon, pas à un concurrent (ex. « Econogy » = Messe Frankfurt, pas Première Vision).
- **RR29** Tarifs / chiffres exposants : « indicatif sectoriel » obligatoire si non publié officiellement. Jamais affirmer un tarif chiffré sans URL site officiel.
- **RR30** Présidents / curateurs / jurys : changent à chaque édition. Toujours préciser l'année (2025 vs 2026 vs 2027) ou ne pas affirmer.

### RR31-RR36 (cohorte 6, 29 fiches + 42 MAJEUR détectées)

- **RR31** **Comexposium en sortie 2024-2025**. Pour tout salon attribué à Comexposium dans le brief, vérification renforcée mentions légales actuelles. 5 transferts détectés : SIMA + SITEVI → AgriVitiEvents (avril 2025) ; Europain → GL Events + Ekip (janvier 2025, rebrand Sirha Bake & Snack) ; Innov-Agri → Groupe NGPA ; Vinitech-Sifel → BEAM (octobre 2022).
- **RR32** **Slug DB stale**. Un slug DB peut référencer une édition obsolète (année différente de la prochaine édition). Maintenir slug pour SEO mais clarifier dans L'Essentiel. Ex. : sia-paris-2026 → édition 2027, egast-strasbourg-2027 → édition 2028, world-nuclear-exhibition-2026 → édition 2027.
- **RR33** **Vérifier existence autonome avant écriture**. Plusieurs salons historiques fusionnés : Smart Industries / Industrie / Midest / Tolexpo → Global Industrie (2018) ; E-Commerce Paris + Equipmag → Paris Retail Week (2015) → NRF (2025) ; Europain → Sirha Bake & Snack (2025) ; FIC → Forum InCyber Europe (2024). Si fusionné : fiche LEGACY SEO courte + redirect 301.
- **RR34** **Doublons sémantiques de slugs DB**. Fuzzy match `tokens-shared` entre slugs DB sans MDX et MDX existants avant cohorte. Ex. : equiphotel ↔ equip-hotel, mif-expo-paris ↔ mif-expo, secuexpo ↔ expoprotection. DELETE doublon DB + redirect 301 vers canonique.
- **RR35** **Cycle bisannuel décalé par Covid 2020**. Pour bisannuels créés avant 2020, vérifier l'historique 2018-2021 (présence/absence report Covid) avant d'affirmer "années paires/impaires". Ex. WNE : paires (2014/16/18) puis impaires (2021/23/25/27).
- **RR36** **Itinérance des lieux : 3 cas**. (1) Lieu fixe (Eurosatory Villepinte) ; (2) Alternance binaire pair/impair (Global Industrie Paris/Lyon, Natexpo Lyon/Paris, Vinitech-Sifel/SITEVI) ; (3) Itinérance complète (Terres de Jim, Innov-Agri changent de site chaque édition). Pour itinérants : ne JAMAIS reproduire le lieu précédent sans vérification site officiel.

---

## Conventions transversales Nicolas (2026-05-31)

1. **Convention sources** : si « source : organisateur » → ne pas l'afficher. Footer générique automatique.
2. **L'Essentiel** doit toujours contenir : Site internet + Organisateur + Co-organisateur (si applicable) + Fréquence + Lieu + Dates.
3. **Organisateur et co-organisateur séparés** : champs distincts, chacun lié à sa page organisateur.

---

## Patterns d'erreurs récurrents (catalogue)

- **Pattern A** Confusion édition (RR1, RR7, RR21)
- **Pattern B** Fabrication exposants/partenaires (RR2)
- **Pattern C** Confusion organisateur / opérateur / co-orga (RR6, RR19)
- **Pattern D** Faits dépréciés (timeline obsolète)
- **Pattern E** Lieux/Halls/Dates (RR18)
- **Pattern F** Chiffres marketing présentés comme OJS (RR21)
- **Pattern G** Sigles, libellés et noms exacts (RR22)
- **Pattern H** Confusion structurelle slug vs identité actuelle (RR10)
- **Pattern I** Sources fantômes (RR4)
- **Pattern J** Sur-correction reviewer (RR14, RR24, RR25)

---

## Sources

- R1-R33 : `dreaming-orchestrator/tracks/agoris-fiches/snapshots/2026-05-29-1659/règles/doc-33-regles-nicolas.md`
- RR1-RR30 : `dreaming-orchestrator/tracks/agoris-fiches/observations/MASTER-patterns-RR-cohortes-1-5.md`
- Brief writer cohorte 5 (RR1-RR17 seuls) : `tasks/writer-brief-cohorte-5-rr-rules.md`

**Mise à jour** : ajouter RR31+ à la fin de la partie II. Ne pas réécrire l'existant.
