# Chantier page 2 → page 1 (chantier trafic n°3)

## Tâche

Faire monter en première page les pages qui stagnent en position 11-20 (GSC). Session lancée le 2026-10-29, branche `claude/jz-page2-page1-b7ba84`.

## Critères de fin (écrits avant de commencer)

1. **Référence figée** : liste des pages en position 11-20 sur la fenêtre 2026-09-30 → 2026-10-27, moins les 48 pages gelées par le chantier 1 (test CTR), avec impressions, clics, position et requêtes principales par page. Fait : `reference.md` (lisible) et `reference.json` (machine).
2. **Priorisation tracée** : chaque couple (page, requête en 11-20) avec au moins 5 impressions passe un jugement Jev « la page répond-elle à cette requête » ; la liste prioritaire (potentiel × pertinence) est écrite dans `priorisation.md` avec les verdicts.
3. **Lots prioritaires déployés en production** : pour chaque lot, `npm run build` vert, PR vers main (`gh pr create --body-file`), CI verte, merge, statut Vercel du commit de merge en succès (via `gh api`, pas de grep HTML).
4. **Request Indexing** de chaque page modifiée, quota ~10/jour, suivi page par page dans `tasks/todo.md` (toast vu ou « déjà indexée »).
5. **Mesure J+28 inscrite** dans `tasks/todo.md` : date, commande exacte (`scripts/diag-page2-page1-export.ts <début> <fin>`), métriques comparées (position et clics par page, pages touchées contre pages non touchées de la même liste comme témoin).

Non-critères : pas d'obligation de résultat sur la position (mesurée à J+28, pas garantie).

## Référence (mesurée le 2026-10-29)

- Fenêtre GSC 2026-09-30 → 2026-10-27, `sc-domain:agoris.io`, type web.
- Bande « position 11-20 » = position moyenne arrondie, soit [10,5 ; 20,5[ : 193 pages, 39 803 impressions (recoupe le chiffre du brief). Gel chantier 1 = impressions ≥ 500, position ≤ 12, CTR < 1 % : 48 pages, dont 4 dans la bande.
- **Liste figée : 189 pages, 37 535 impressions, 253 clics, CTR 0,67 %.** Détail dans `reference.md`.
- Répartition : 86 fiches salon FR, 45 fiches salon EN, 21 pages lieu (12 FR, 9 EN), 14 secteurs (9 FR, 5 EN), 8 villes, 7 prestataires, 8 blog.
- Données requête : seules 15 240 impressions sur 37 535 (40,6 %) sont attribuées à une requête (anonymisation GSC). Les requêtes où la page est elle-même en 11-20 pèsent 2 665 impressions ; 35 pages en portent au moins 20, 70 pages n'en portent aucune de visible.
- Cannibalisation candidate (une autre URL Agoris reçoit ≥ 5 impressions sur la même requête) : 21 pages.

## Plan

1. Priorisation (étape 2 du brief) :
   - **Jev** : jugement typé « la page répond-elle à cette requête » (oui / partiellement / non + intention : salon, lieu, prestataire, date périmée…) sur les couples page × requête ≥ 5 impressions. C'est une décision structurée, elle passe par Jev, pas par un LLM.
   - **Pas Jev** : le potentiel (somme d'impressions) et la détection de cannibalisation sont du calcul déterministe sur l'export GSC.
2. Levier 1, maillage interne (le moins cher) : mesurer d'abord les liens entrants actuels de chaque page prioritaire (hubs secteurs, villes, lieux, fiches similaires, blog) par lecture du code et du HTML rendu, puis ajouter des liens depuis les hubs et fiches pertinents. Code déterministe, pas de LLM.
3. Levier 2, enrichissement MDX des fiches prioritaires dont l'écart vient du contenu (requête légitime non couverte) : faits sourcés uniquement (règle 13), process writer + 2 reviewers de `tasks/regles-edito-agoris-v1.md`, contraintes MDX de la liste blanche. Rédaction par LLM (writer Opus, reviewers Sonnet), sources primaires obligatoires.
4. Levier 3, cannibalisation : pour les 21 pages candidates, décider page canonique par requête (lien, ancre, title) ; pas de redirection sans validation.
5. Lots, build, PR, merge à CI verte, Request Indexing, entrée J+28 dans `tasks/todo.md`.

## Décisions

- 2026-10-29 : bande 11-20 = position arrondie [10,5 ; 20,5[, parce que c'est la définition qui redonne les 193 pages et 39 803 impressions du brief.
- 2026-10-29 : la liste est figée sur l'export du jour ; elle ne sera pas recalculée en cours de chantier (sinon la mesure J+28 n'a plus de référence stable).

## Problèmes ouverts (à valider par Julien)

- **Recouvrement avec le chantier 2** (CTR prestataires et lieux) : 28 pages de la liste sont des `/lieux` ou `/prestataires`. Proposition : les exclure du périmètre modifiable ici (ils restent dans la référence comme témoin).
- **Pages EN** (69 pages) : proposition de les garder dans la liste, mais de ne les toucher que par ricochet (MDX EN des fiches FR enrichies, maillage commun).
- **Plafond du chantier** : si toute la liste passait en positions 4-10 au CTR observé de cette bande (1,38 %), on obtiendrait ~518 clics / 28 j contre 253, soit environ +265. Estimation à partir des moyennes, non confirmée. À comparer avec l'écart de ~5 300 sessions vers l'objectif 10 000.

## Prochaine action

Attendre la validation de Julien sur la liste figée et les deux exclusions proposées, puis lancer la priorisation Jev.
