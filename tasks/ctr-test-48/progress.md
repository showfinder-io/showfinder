# Test CTR 48 : progress

## Tâche

Test de CTR mesurable sur les fiches très vues mais peu cliquées (impr. >= 500, pos. <= 12, CTR < 1 %, fenêtre GSC 2026-09-30 → 2026-10-27). Nouveaux `seo_title` / `seo_description` (et `_en` si la page EN est dans le lot), mesure à J+28.

## Critères de fin

1. Liste figée dans `tasks/ctr-test-48/liste-figee.md` : **fait** (48 pages, 52 403 impr., 309 clics, CTR 0,59 %).
2. Référence mesurée par page (clics, impr., CTR, position, 28 j) : **fait** (`baseline-2026-09-30_2026-10-27.json`).
3. Diagnostic par page : top requêtes classées navigationnelle / informationnelle / transactionnelle par Jev, éditions passées exclues.
4. Nouveaux titres et descriptions passés par le process writer + 2 reviewers, zéro donnée factuelle absente de la base, pas d'em dash, accents vérifiés.
5. Titres déployés en prod : migration appliquée, PR mergée, date de déploiement vérifiée via le statut Vercel du commit, et titre lu dans le HTML de prod sur un échantillon.
6. Mesure J+28 inscrite dans `tasks/todo.md` avec sa date et sa règle de décision.

## Plan

1. Liste + référence (fait, script `scripts/diag-ctr-test-48-baseline.ts`).
2. Diagnostic : requêtes de chaque page (déjà exportées), classement par Jev. Étape de jugement typé = Jev ; rédaction des titres = LLM (writer + reviewers), car c'est de l'écriture.
3. Rédaction : 1 writer + 2 reviewers sur les pages traitées, à partir des seules données en base (dates, lieu, ville, exposants/visiteurs si renseignés, contenu MDX déjà validé).
4. Application : migration SQL `UPDATE salons SET seo_title…` (et `venues` pour les lieux si gardés), `npm run build`, PR vers main, merge CI verte, date de déploiement relevée.
5. Mesure à J+28 (fenêtre : lendemain du déploiement + 27 jours, lisible à J+31 à cause du délai GSC) et décision page par page.

## Décisions (à valider par Julien)

- **D1. Exclusion des 7 éditions passées** (sommet-elevage-clermont, mondial-auto-paris, gazelec-paris, les-assises-de-la-securite-monaco, architect-at-work-paris, tranofiliere-paris, ad2s-bordeaux ; 12 073 impr.) : on ne les touche pas, elles servent seulement d'observation. Leurs impressions vont s'effondrer après l'événement, elles fausseraient toute moyenne.
- **D2. Groupe témoin (recommandé).** Un avant/après brut sur des fiches salons est confondu par la saisonnalité : 18 des 41 fiches restantes ont leur salon pendant la fenêtre de mesure, où la demande et le mix de requêtes changent fortement (les requêtes « dates » montent avant l'événement, « programme / plan » pendant). Proposition : tirage aléatoire stratifié (salon pendant la mesure / après) en deux moitiés, ~20 pages réécrites, ~20 témoins inchangés. Règle du juge fixe : on garde les nouveaux titres si la variation de CTR du groupe traité est >= celle du groupe témoin ; page par page, on revient sur les pages dont le CTR baisse alors que le témoin monte. Alternative : tout réécrire (41 pages) et comparer avant/après brut, plus d'effet potentiel mais mesure non interprétable.
- **D3. Pages lieux** (`/lieux/parc-expo-chalons`, `/lieux/grande-halle-d-auvergne`, `/en/lieux/paris-le-bourget`) : elles recoupent le chantier « CTR prestataires et lieux ». Proposition : les laisser à ce chantier et les retirer de ce test (elles sont encore figées dans la liste pour que personne ne les touche par erreur ; à lever si D3 validée).
- **D4. Pages EN** (`/en/salons/amwc`, `jdp-paris`, `satis`, `museum-connections`, `congres-sofcot`) : on ne modifie que la variante présente dans le lot (le `_en` seul si seule la page EN y est).
- **D5. Position.** Le CTR dépend de la position ; la mesure J+28 rapporte la position de chaque page, et une page dont la position bouge de plus de 2 rangs est signalée comme non concluante plutôt que jugée.

## Problèmes ouverts

- Google réécrit parfois les titres affichés : le `<title>` déployé n'est pas garanti dans la SERP. Mesure de CTR quand même, c'est ce qui compte.
- « Budget exposant » : angle demandé, mais à n'utiliser que si le prix est en base ou dans le MDX validé (BudgetTable). Sinon, pas de chiffre.
- Le roll 2027 automatique ne touche pas le SEO (règle 14e) mais peut changer les dates d'une fiche éligible pendant la mesure : à surveiller dans `tasks/roll-2027/journal.json`.

## Prochaine action

Validation de Julien sur D1 à D5, puis classement Jev des requêtes.
