# Cohorte shortlist 5 : progress

## Tâche

Préparer et publier la cohorte suivante du catalogue (shortlist 5), avec le même processus que les shortlists 1 à 4 : recherche, vérification sur source primaire, scoring, validation de Julien, rédaction writer + 2 reviewers, insertion en `draft`, publication en bloc, PR, Request Indexing.

Session lancée le 2026-10-29 depuis la session chantiers trafic (chantier 4 sur 5). Branche `feat/jz-cohorte-sl5` (depuis main après merge de #159).

## Critères de fin (écrits avant de commencer)

1. Shortlist 5 écrite dans `tasks/cohorte-trafic-shortlist-5.md`, avec confirmés, rejetés et non vérifiables, chacun avec sa raison.
2. Shortlist validée par Julien AVANT toute rédaction (validation notée ici, avec date et arbitrages).
3. Chaque fiche publiée :
   - salon réel, absent du catalogue (dédoublonnage par Jev contre les 434 lignes en base, tous statuts) ;
   - prochaine édition lue sur source primaire (site officiel, organisateur ou calendrier du lieu), citation verbatim et URL conservées ; décision « réel et à venir » rendue par Jev sur la page capturée ;
   - passée par writer (Opus) + review pass-1 + corrections + review pass-2 (Sonnet), verdict BON POUR PUBLICATION, référentiel `tasks/regles-edito-agoris-v1.md` ;
   - insérée en `draft`, puis passée en `published` en un seul bloc après vérification ;
   - FR + EN, URLs FR et EN en 200 en prod.
4. `npm run build` vert, PR vers main, CI verte, merge.
5. Request Indexing GSC des fiches prioritaires (éditions les plus proches), toasts vus ; le reste en file D14 de `tasks/todo.md`.
6. `tasks/todo.md` et ce fichier à jour, rejets et raisons compris.

Hors périmètre, à ne pas toucher : fiches existantes en position 11-20 (chantier 3) et les 48 pages du test CTR (chantier 1, liste dans `tasks/ctr-test-48/liste-figee.md` sur la branche `claude/jz-ctr-test-48-fa3e32`). Une shortlist ne crée que des fiches neuves : aucune fiche existante n'est modifiée.

## Plan

### Taille du lot

Cible : 30 à 40 fiches publiées. Recherche visée : 70 à 90 candidats bruts, pour environ 50 vérifiés. SL4 : 96 vérifiés, 72 confirmés, 58 publiés.

### Fenêtre et priorité

- Priorité 1 : éditions du 1er janvier au 30 avril 2027 (2 à 6 mois), pour capter le pic de recherche qui précède le salon. Une fiche publiée début novembre a 6 à 8 semaines pour s'indexer avant le pic d'une édition de janvier-février.
- Priorité 2 : mai à décembre 2027, seulement si la demande est forte.
- Hors fenêtre : avant le 1er décembre 2026 (pic déjà passé ou trop proche), et après 2028.

### Sources candidates

1. GSC 90 jours (2026-07-30 au 2026-10-27, 14 876 couples requête/page) : FAIT. Aucun gap nommé significatif : les requêtes à fort volume portent sur des salons déjà en base sous une autre graphie (Innov-Agri, Terres de Jim, Tech Élevage, ChangeNow, Web Summit). Seul gap net : « salon des caves particulières paris » (67 imp), grand public, à évaluer. Confirme la mémoire : la demande nommée est couverte, la shortlist 5 élargit l'offre.
2. Recherche par sous-agents Sonnet à angles distincts (6 agents, lancés depuis la boucle principale, curl d'abord, WebSearch parcimonieux) :
   - calendriers des parcs et centres de congrès, janvier-avril 2027 (au navigateur, un seul agent) ;
   - agriculture, élevage, viticulture, forêt, maritime (filières où le modèle Agoris marche : 46 % des clics) ;
   - industrie, BTP régional, énergie, environnement ;
   - santé et congrès médicaux avec exposition lisible ;
   - tech, numérique, services B2B, RH, marketing, franchise ;
   - agroalimentaire, CHR, commerce, tourisme, mode, luxe.
3. Reliquats à revérifier : non vérifiables de SL4 (Midi Mat x3, Mondial Secours Bordeaux 2027, Ceramic Network, SFAP, RICAI, Top Transport Saint-Malo, SPIE Photonics 2028), suites D13bis (batinov-lyon en draft, Sirha Made ex MDD Expo, RSD3 Valence), pistes des gabarits (Medintechs, Energies+), Salon des Caves Particulières.

Exclusions : `handoff/shortlist-5/exclusions.json` (434 lignes du catalogue tous statuts + écartés des shortlists précédentes).

### Critères de sélection

Éligibilité (bloquant) : salon réel avec exposants, dominante B2B, en France (Monaco accepté), congrès seulement avec exposition lisible, prochaine édition lue sur source primaire (dates, ville, lieu), absent du catalogue.

Classement : score = volume de recherche mensuel France du nom (DataForSEO Google Ads, variantes nom / nom + année / salon + nom) corrigé par la concurrence de la SERP « nom 2027 » (méthode du 2026-09-27 : on vise 50 à 2 000 recherches/mois avec une SERP où seuls le site officiel et des acteurs faibles se placent), puis bonus d'imminence (édition janvier-avril 2027). Les impressions GSC comptent quand elles existent. Les géants (SERP saturée, Agoris hors top 20 attendu) sont rétrogradés.

### Répartition Jev / LLM (règle coût)

- Jev (TypeSafe) : « ce candidat est-il le même salon qu'une fiche existante ? » (candidat vs fiches proches du catalogue) ; « le salon est-il réel et son édition à venir dans la fenêtre, d'après le texte capturé de la page officielle ? » ; classement des résultats de SERP (officiel, agrégateur, social, hors sujet). Ce sont des décisions typées.
- LLM (sous-agents) : recherche web ouverte, capture des pages, rédaction et reviews.
- Script : volumes DataForSEO, SERP, calcul du score, dédoublonnage lexical préalable.

## Fait

- 2026-10-29 : PR #159 (shortlist 4) mergée, CI verte (squash 5c6013f). Branche `feat/jz-cohorte-sl5` créée depuis main.
- 2026-10-29 : catalogue exporté (434 lignes : 385 publiées, 48 drafts, 1 annulée) dans `handoff/shortlist-5/catalogue.json` ; exclusions construites.
- 2026-10-29 : analyse GSC 90 jours, voir Sources 1.
- 2026-10-29 : 7 agents de recherche terminés (fichiers `handoff/shortlist-5/candidats-*.md`) : 55 lignes, 45 candidats uniques consolidés dans `handoff/shortlist-5/items.json`. Tous sous leur cible (5 à 9 retenus) : catalogue déjà saturé sur les grands portefeuilles.
- 2026-10-29 : `scripts/diag-sl5-pipeline.py` exécuté : dedup Jev (aucun doublon, max 0,48), capture curl (44/45 pages, Itechmer en 500, Mondial Secours via pdftotext), vérification Jev (37 avec édition à venir et dates concordantes ≥ 0,85), volumes + SERP DataForSEO (0,18 USD), `scoring.csv`.
- 2026-10-29 : proposition écrite dans `tasks/cohorte-trafic-shortlist-5.md` : lot 1 de 23 fiches, lot 2 de 12, 10 écartés.

## Décisions

(en attente : validation de la shortlist par Julien ; arbitrages demandés : périmètre lot 1 seul ou lots 1+2, Vapexpo oui/non, rédaction par workflow)

## Problèmes ouverts

- Rédaction de 30 à 40 fiches = environ 120 à 160 appels d'agents (writer, 2 reviews, corrections, EN). Les cohortes précédentes passaient par un workflow ; à confirmer avec Julien au moment de la validation.

## Prochaine action

Attendre la validation de Julien sur `tasks/cohorte-trafic-shortlist-5.md`, puis lancer la rédaction (writer + 2 reviewers).
