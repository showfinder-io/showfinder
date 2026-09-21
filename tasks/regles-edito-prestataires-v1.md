# Règles édito prestataires Agoris : référentiel v1

> Pendant du référentiel salons (`tasks/regles-edito-agoris-v1.md`), pour les fiches
> `/prestataires/[slug]` et les pages hub métier x zone.
> Date : 2026-09-21. À injecter in extenso dans le brief writer et le brief reviewer.
> Les règles salons qui s'appliquent telles quelles sont citées par leur numéro (R26, RR3...).

**Pourquoi ce référentiel** : les fiches prestataires parlent d'entreprises réelles, qui liront
leur fiche. Une spécialité inventée, une référence client fausse ou un superlatif gratuit nous
coûte la relation commerciale (Premium) et la crédibilité d'institution qui audite. Cause racine
déjà vécue : seed d'avril 2026, 18 prestataires inventés par LLM (migration 20260723000000).

---

## A. Sources (P1 à P6)

- **P1** Sources admises, par ordre de priorité : (1) site officiel du prestataire, (2) sa fiche
  LEADS France ou Prestalians, (3) API annuaire-entreprises.data.gouv.fr (date de création,
  commune, code postal du siège). Rien d'autre. Pas de presse, pas de LinkedIn, pas d'avis Google.
- **P2** Le writer travaille UNIQUEMENT sur le dossier source figé (`handoff/prestataires/dossiers/<slug>.json`).
  Il ne navigue pas. Une information absente du dossier n'existe pas.
- **P3** Chaque affirmation factuelle de la sortie porte sa preuve : URL de la page + citation
  verbatim (copiée caractère pour caractère depuis le dossier, 40 à 200 caractères). Le contrôle
  mécanique rejette toute citation introuvable dans le dossier.
- **P4** Divergence entre sources : le site officiel prime (RR40). Divergence sur la ville : le
  siège de l'API annuaire-entreprises fait foi pour le code postal, le site officiel pour les
  agences secondaires.
- **P5** Ne jamais citer LEADS France, Prestalians ou un autre annuaire comme source dans le texte
  (R4). L'appartenance à la fédération est une donnée structurée (champ `memberships`), pas une phrase.
- **P6** Aucune source affichée dans la description (RR4). Les preuves vivent dans le JSON de
  production, archivé dans `handoff/prestataires/`.

## B. Ce qu'on n'écrit jamais (P7 à P14)

- **P7** Pas de référence client, de marque ou de salon « réalisé pour » sauf si le site officiel
  la publie sur une page réalisations/références ET que la citation verbatim le prouve. Maximum
  trois, sans adjectif. Dans le doute, rien.
- **P8** Pas de chiffre (effectif, m2 d'atelier, nombre de stands par an, chiffre d'affaires) sans
  citation verbatim du site officiel. Jamais de chiffre issu de l'API entreprises autre que
  l'année de création.
- **P9** Pas de prix, de fourchette tarifaire ni de délai.
- **P10** Pas de superlatif ni de jugement : leader, expert reconnu, incontournable, référence,
  meilleur, premium, haut de gamme, innovant, unique, sur-mesure de qualité, passion, savoir-faire
  d'exception. Agoris décrit, il ne vante pas. « Spécialiste de » n'est admis que si le site
  emploie lui-même ce positionnement pour ce segment précis.
- **P11** Pas de slogan ni de baseline reprise ou paraphrasée (RR3). Pas de « nous », pas de
  discours rapporté : la fiche est écrite à la troisième personne, au présent.
- **P12** Pas de certification, label ou engagement RSE sans citation verbatim qui le nomme
  exactement (ISO 20121, ISO 14001, EcoVadis...). Libellé exact, jamais traduit (RR22).
- **P13** Pas de contrainte géographique inventée (R29). « Basé à X » est un fait ; « intervient
  uniquement en » ne s'écrit jamais. La zone d'intervention n'est renseignée que si le site la
  déclare (« France entière », « Europe », « Grand Ouest »...), verbatim à l'appui.
- **P14** Jamais « revendique » (R26). Pas de tiret long ni demi-cadratin, pas de point médian.
  Accents français complets. Pas de gras, pas de liste, pas de lien, pas de JSX : la description
  est un texte brut d'un seul paragraphe (deux au maximum).

## C. Forme de la description (P15 à P19)

- **P15** Longueur : cible 600 à 800 caractères, plancher 400, plafond 850. **Jamais de
  remplissage** : si le dossier ne permet pas 400 caractères honnêtes, le writer livre
  `status: "matiere_insuffisante"` avec ce qu'il a, et la fiche reste en noindex.
- **P16** Ordre : (1) qui est l'entreprise et son métier en une phrase, avec la ville du siège ;
  (2) ce qu'elle fait concrètement (types de stands ou de prestations, internalisation atelier /
  conception / pose si déclarée) ; (3) pour qui et où (secteurs ou types d'événements déclarés,
  zone déclarée) ; (4) un fait distinctif vérifiable s'il existe (année de création, atelier
  intégré, appartenance à un groupe nommé).
- **P17** La description doit être rédigée, pas reformulée phrase à phrase depuis l'annuaire
  source. Le reviewer compare avec le texte LEADS/Prestalians du dossier : plus de deux segments
  de 8 mots identiques consécutifs = MAJEUR.
- **P18** Première occurrence du nom : graphie du site officiel (casse comprise). Le writer
  propose `display_name` ; s'il ne peut pas trancher (logo seul, tout en capitales partout), il
  garde la graphie actuelle et le signale.
- **P19** Version anglaise : traduction fidèle, mêmes faits, mêmes interdits. Noms propres,
  labels et villes non traduits.

## D. Données structurées produites avec la description (P20 à P23)

- **P20** `specialties` : 2 à 6 libellés courts en minuscules, tirés du vocabulaire du site
  (« stands sur mesure », « stands modulaires », « agencement de showrooms », « mobilier
  événementiel », « régie vidéo »). Chacun prouvé par une citation.
- **P21** `founded_year` : uniquement depuis l'API annuaire-entreprises (date de création de
  l'unité légale) ou une mention explicite du site (« depuis 1976 »). En cas d'écart (reprise,
  changement de structure), le site prime et l'écart est signalé en alerte. Sinon null.
- **P22** `zone_intervention` : verbatim déclaré (P13), sinon null.
- **P23** `memberships` : `leads_france` et/ou `prestalians`, d'après la présence de la fiche
  annuaire dans le dossier. Rien d'autre en v1.

## E. Pages hub métier x zone (P24 à P29)

- **P24** Un hub parle du métier dans la zone, pas des entreprises une à une : la liste est
  générée par le template (RR37 : ne pas dupliquer le maillage automatique dans le texte).
- **P25** Contenu : introduction de 1 000 à 1 500 caractères + 3 ou 4 questions/réponses courtes
  (300 à 500 caractères chacune). Texte en MDX simple : paragraphes, `##`, liens internes. Pas de
  JSX, pas de `<` brut, pas de table pipe (contraintes du MDX en base).
- **P26** Faits admis dans un hub : nombre de prestataires référencés dans la zone (fourni par le
  dossier, jamais estimé), lieux d'exposition de la zone présents en base (liés vers
  `/lieux/[slug]`), salons de la zone présents en base et publiés (liés vers `/salons/[slug]`,
  fiche canonique uniquement). Tout autre chiffre est interdit (P8, P9 : ni prix ni délais).
- **P27** Conseils de choix : généraux et vérifiables par le bon sens du métier (demander le plan
  technique, vérifier qui monte le stand, anticiper le règlement du parc). Aucune statistique,
  aucun « en moyenne », aucun « la plupart des exposants ».
- **P28** Ne jamais classer ni recommander un prestataire dans le texte. L'ordre d'affichage est
  celui du template (Premium, vérifiés, alphabétique).
- **P29** « Basés en » et jamais « qui interviennent en » (P13). Un hub de zone liste les
  entreprises dont le siège est dans la zone ; le texte rappelle en une phrase que la plupart des
  standistes se déplacent.

## F. Review (P30 à P34)

- **P30** Le reviewer travaille en contexte vierge, avec le dossier ET un re-fetch du site
  officiel. Verdict par affirmation : OK / mineur / MAJEUR.
- **P31** Tout « à corriger » cite l'URL et le passage qui contredit (RR24). Sans preuve
  contraire, pas de suppression (RR14, RR25 : anti-sur-correction).
- **P32** MAJEUR d'office : fait sans preuve, référence client non publiée, chiffre non sourcé,
  superlatif (P10), certification non verbatim, confusion avec une entreprise homonyme, ville
  ou métier faux, recopie de l'annuaire (P17).
- **P33** Vérification d'identité : le reviewer confirme que le site du dossier est bien celui de
  l'entreprise de la fiche (ville ou code postal cohérent avec le fichier source, mentions
  légales si présentes). Homonymes = MAJEUR bloquant, la fiche sort du lot.
- **P34** Deuxième review (pass-2) obligatoire sur : les fiches du lot test d'indexation, toute
  fiche ayant reçu un MAJEUR en pass-1, tous les hubs.

---

**Mise à jour** : ajouter P35+ à la fin. Ne pas réécrire l'existant. Les patterns d'erreur
observés pendant le premier lot alimentent une section « Patterns » comme côté salons.
