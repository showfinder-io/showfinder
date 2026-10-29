# Test CTR 48 : progress

## Tâche

Test de CTR mesurable sur les fiches très vues mais peu cliquées (impr. >= 500, pos. <= 12, CTR < 1 %, fenêtre GSC 2026-09-30 → 2026-10-27). Nouveaux `seo_title` / `seo_description` (et `_en` si la page EN est dans le lot), mesure à J+28.

## Critères de fin

1. Liste figée dans `tasks/ctr-test-48/liste-figee.md` : **fait** (48 pages, 52 403 impr., 309 clics, CTR 0,59 %).
2. Référence mesurée par page (clics, impr., CTR, position, 28 j) : **fait** (`baseline-2026-09-30_2026-10-27.json`).
3. Diagnostic par page : top requêtes classées navigationnelle / informationnelle / transactionnelle par Jev, éditions passées exclues : **fait** (`intentions-jev.json`, jev-1.14.0).
4. Nouveaux titres et descriptions passés par le process writer + 2 reviewers, zéro donnée factuelle absente de la base, pas d'em dash, accents vérifiés : **fait** (`titres.json`).
5. Titres déployés en prod : migration appliquée, PR mergée, date de déploiement vérifiée via le statut Vercel du commit, et titre lu dans le HTML de prod sur un échantillon.
6. Mesure J+28 inscrite dans `tasks/todo.md` avec sa date et sa règle de décision.

## Plan

1. Liste + référence (fait, script `scripts/diag-ctr-test-48-baseline.ts`).
2. Diagnostic : requêtes de chaque page (déjà exportées), classement par Jev. Étape de jugement typé = Jev ; rédaction des titres = LLM (writer + reviewers), car c'est de l'écriture.
3. Rédaction : 1 writer + 2 reviewers sur les pages traitées, à partir des seules données en base (dates, lieu, ville, exposants/visiteurs si renseignés, contenu MDX déjà validé).
4. Application : migration SQL `UPDATE salons SET seo_title…` (et `venues` pour les lieux si gardés), `npm run build`, PR vers main, merge CI verte, date de déploiement relevée.
5. Mesure à J+28 (fenêtre : lendemain du déploiement + 27 jours, lisible à J+31 à cause du délai GSC) et décision page par page.

## Décisions (validées par Julien le 2026-10-29 : « Oui, avec témoin »)

- **D1. Exclusion des 7 éditions passées** (sommet-elevage-clermont, mondial-auto-paris, gazelec-paris, les-assises-de-la-securite-monaco, architect-at-work-paris, tranofiliere-paris, ad2s-bordeaux ; 12 073 impr.) : on ne les touche pas, elles servent seulement d'observation. Leurs impressions vont s'effondrer après l'événement, elles fausseraient toute moyenne.
- **D2. Groupe témoin (recommandé).** Un avant/après brut sur des fiches salons est confondu par la saisonnalité : 18 des 41 fiches restantes ont leur salon pendant la fenêtre de mesure, où la demande et le mix de requêtes changent fortement (les requêtes « dates » montent avant l'événement, « programme / plan » pendant). Proposition : tirage aléatoire stratifié (salon pendant la mesure / après) en deux moitiés, ~20 pages réécrites, ~20 témoins inchangés. Règle du juge fixe : on garde les nouveaux titres si la variation de CTR du groupe traité est >= celle du groupe témoin ; page par page, on revient sur les pages dont le CTR baisse alors que le témoin monte. Alternative : tout réécrire (41 pages) et comparer avant/après brut, plus d'effet potentiel mais mesure non interprétable.
- **D3. Pages lieux** (`/lieux/parc-expo-chalons`, `/lieux/grande-halle-d-auvergne`, `/en/lieux/paris-le-bourget`) : elles recoupent le chantier « CTR prestataires et lieux ». Proposition : les laisser à ce chantier et les retirer de ce test (elles sont encore figées dans la liste pour que personne ne les touche par erreur ; à lever si D3 validée).
- **D4. Pages EN** (`/en/salons/amwc`, `jdp-paris`, `satis`, `museum-connections`, `congres-sofcot`) : on ne modifie que la variante présente dans le lot (le `_en` seul si seule la page EN y est).
- **D5. Position.** Le CTR dépend de la position ; la mesure J+28 rapporte la position de chaque page, et une page dont la position bouge de plus de 2 rangs est signalée comme non concluante plutôt que jugée.

## Fait

- 2026-10-29 : liste figée, référence (`baseline-*.json`, `queries-*.json`), commit 07827ba.
- 2026-10-29 : tirage reproductible (`scripts/diag-ctr-test-48-split.mjs`, graine `ctr-test-48-2026-10-29`, `groupes.json`). Traités : 19 pages, 16 511 impr., 76 clics, CTR 0,46 %. Témoins : 19 pages, 22 089 impr., 131 clics, CTR 0,59 %. Exclues : 7 éditions passées + 3 lieux (rendus à la session ctr-prest-lieux, message envoyé).
- 2026-10-29 : classement Jev (`scripts/diag-ctr-test-48-jev.mjs`) des requêtes couvrant 80 % des impressions de chaque page (20 max), 38 pages. Sur 16 010 impressions classées : navigationnelle 92 %, informationnelle 6,5 %, transactionnelle 1 %, hors sujet 0,6 %. 31 requêtes à confiance < 0,6 (variantes génériques type « congrès urologie 2026 »), sans effet sur le constat.

- 2026-10-29 : writer (1 passe, `writer-out.json`) puis 2 reviewers indépendants (`review-A.json` : 9 à corriger dont 1 grave ; `review-B.json` : 5 à corriger). Corrections consolidées sur 11 pages (`titres.json`) : tarifs datés qui expirent pendant la mesure retirés (CPLF 440 € au 12 nov., badges Euronaval, 460 € Paris Santé Femmes, badge gratuit SMCL), dates remises dans les titles de SOFINS et JFHOD, nom tapé en tête pour le CFP (« congrès de psychiatrie »), « annoncé » respecté sur Prod&Pack, année ajoutée aux chiffres passés (Museum Connections). Chaque fait modifié revérifié par grep dans le dossier de la page. Longueurs : titles 54-60, descriptions 138-155, aucun tiret long.
- 2026-10-29 15:04 UTC : 19 fiches mises à jour en base via `scripts/ctr-test-48-apply.ts` et relues (contrôle OK). Migration versionnée avec rollback : `supabase/migrations/20261029000000_ctr_test_48_seo_titles.sql`. Les fiches sont en SSG : les nouvelles metas ne sont servies qu'au déploiement prod suivant.
- 2026-10-29 : `npm run build` OK.
- Note : energaia-montpellier avait été retitrée le 2026-09-25 (passe CTR n°2, todo C6) ; sa mesure C6 est donc arrêtée au 2026-10-27.

## Constat du diagnostic

Ces pages sont vues sur des requêtes de marque où le site officiel est en tête : le CTR bas est en grande partie structurel. Le levier testable est un titre qui promet ce que l'officiel ne donne pas (vue indépendante : à qui s'adresse le salon, dates et lieu exacts, conseils pour exposer). Attendu réaliste : un gain modeste, d'où le témoin pour le distinguer du bruit.

## Problèmes ouverts

- Google réécrit parfois les titres affichés : le `<title>` déployé n'est pas garanti dans la SERP. Mesure de CTR quand même, c'est ce qui compte.
- « Budget exposant » : angle demandé, mais à n'utiliser que si le prix est en base ou dans le MDX validé (BudgetTable). Sinon, pas de chiffre.
- Le roll 2027 automatique ne touche pas le SEO (règle 14e) mais peut changer les dates d'une fiche éligible pendant la mesure : à surveiller dans `tasks/roll-2027/journal.json`.

- **Maillage interne modifié pendant le test (chantier 3, page2-vers-page1, validé par Julien le 2026-10-29)** : hubs secteurs non plafonnés + « salons similaires » par proximité thématique, site entier. Touche traités et témoins de la même façon (le témoin absorbe l'effet commun), mais peut déplacer des positions : appliquer D5 et noter la date de déploiement prod que la session chantier 3 communiquera.

## Prochaine action

PR vers main, merge CI verte, relever la date de déploiement prod (statut Vercel du commit) et vérifier les titles dans le HTML de prod.
