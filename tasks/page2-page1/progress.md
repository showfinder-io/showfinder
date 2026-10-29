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

- 2026-10-29 (validé par Julien) : liste figée OK. Les 28 pages `/lieux` et `/prestataires` sont hors périmètre modifiable (chantier 2), gardées comme témoin. Les 69 pages EN ne sont touchées que par ricochet (MDX EN des fiches FR enrichies, maillage commun).

## Fait

- 2026-10-29 : référence figée (commit 4dc2beb).
- 2026-10-29 : jugement Jev des 176 couples page × requête ≥ 3 impressions (seuil abaissé de 5 à 3 : 88 % des impressions en bande au lieu de 76 %, coût négligeable), 153 616 tokens en entrée. Potentiel utile 1 585 impressions sur 53 pages. Détail et tableau dans `priorisation.md`.
- 2026-10-29 : liens entrants relevés sur les 510 pages FR de production (`inlinks-2026-10-29.json`). Deux défauts structurels : hub secteur plafonné à 20 salons sans pagination, bloc « salons similaires » qui concentre les liens sur les salons les plus proches dans le temps (voir `priorisation.md`).
- 2026-10-29 : cannibalisation : rien à corriger (paires FR/EN, innov-agri-ondes déjà redirigée).
- 2026-10-29 (go Julien « Oui, tout le site ») : lot maillage codé. Hub secteur : 20 cartes puis liste compacte de tous les autres salons de la filière. Similaires : à venir d'abord, puis secteurs partagés, même ville, départage par hash stable. Chantier 1 prévenu par message. `npm run build` vert. Recrawl du build local (`inlinks-local-apres.json`) : fiches sans lien depuis un hub secteur 99 → 17 (dont comic-con-france et japan-expo-paris, sans secteur en base, le reste = anciens slugs redirigés) ; fiches sans lien depuis une autre fiche 182 → 71 ; maximum de liens « similaires » reçus 80 → 14.
- 2026-10-29 : migration `20261029000000_sector_pop_culture_salons.sql` (comic-con-france et japan-expo-paris → art-culture). Écriture en base refusée par le contrôle de sécurité de la session : à appliquer par Julien avec `scripts/diag-sector-pop-culture-apply.ts --apply` (dry-run vérifié : 2 liens à créer).

- 2026-10-29 : PR #167 mergée (squash 217f741), CI verte après correction d'un `any` dans le script Jev ; statut Vercel success à 15:11 UTC, liste compacte vue dans le HTML de prod. Chantier 1 prévenu de la date.
- 2026-10-29 : lot MDX. Seule fiche prioritaire actionnable : foire-agricole-tarbes (dates 2027 en base, MDX sur 2026). Les autres pages en tête ont une édition 2027 non annoncée (comic-con-france, sfar-congres-paris, paris-games-week) ou en arbitrage roll (architect-at-work-lyon, mai 2028). Process : writer Opus (refresh-pret), reviewer 1 (5 corrections), reviewer 2 (3 corrections), arbitrage éditeur (budget 750 000 € et subventions retirés faute de source primaire, surface non rattachée à 2027), correcteur-traducteur FR+EN. Dry-run `diag-edito-roll-2027-apply.ts --dir handoff/page2-page1-edito` OK. Écriture en base : à lancer par Julien (todo K3).
- 2026-10-29 : Request Indexing /secteurs/tech-numerique (toast vu). Suivi dans `tasks/todo.md`, volet K.
- 2026-10-29 : mesure J+28 inscrite (todo K6, le 2026-11-30, fenêtre 2026-10-30 → 2026-11-26).

- 2026-10-29 : K2 et K3 appliqués par Julien, vérifiés (dry-runs à vide, pages de prod à jour). Request Indexing de /salons/foire-agricole-tarbes et /secteurs/art-culture (toasts vus).

## Problèmes ouverts

- Maillage site entier : affecte aussi les 38 pages du test CTR du chantier 1 (décision Julien 2026-10-29, chantier 1 prévenu, date de déploiement à lui transmettre).

- **Plafond du chantier** : si toute la liste passait en positions 4-10 au CTR observé de cette bande (1,38 %), on obtiendrait ~518 clics / 28 j contre 253, soit environ +265. Estimation à partir des moyennes, non confirmée. À comparer avec l'écart de ~5 300 sessions vers l'objectif 10 000.

## Prochaine action

Request Indexing de la file K4 au fil du quota (prochaine : /secteurs/agroalimentaire), puis mesure K6 le 2026-11-30.
