# progress : chantiers croissance du 2026-11-12

## Tâche

Décisions Julien du 2026-11-12 sur les propositions de croissance :
1. Section « Infos pratiques » sur 10 % des fiches salon (44), en amélioration éditoriale, sans mesure (le test contrôlé a été abandonné : voir « Décisions »).
2. Relecture du lot test SEO prestataires par un agent au lieu de Nicolas (todo G14), puis hubs standistes.
4. Shortlist 7 de nouvelles fiches, à proposer à Julien.
5. Relecture des 30 fiches EN les plus vues.
6. Cache de build en CI.

## Critères de fin

- 1 : 44 fiches avec section « Infos pratiques » sourcée, FR et EN, en base, passées par writer Opus + 2 reviews Sonnet + correcteur-traducteur, dry-run sans REJET, vérifiées en prod après déploiement.
- 2 : rapport de relecture écrit, corrections appliquées par le process writer + reviewers, feu vert ou non pour Request Indexing.
- 4 : tasks/cohorte-trafic-shortlist-7.md écrit, en attente d'arbitrage Julien (rien publié).
- 5 : propositions de titres et descriptions EN et corrections MDX EN, relues, puis appliquées.
- 6 : FAIT (PR #186 mergée).

## Sorties

- tasks/infos-pratiques/groupes*.json, reference*.json|md, mesure.ts : test contrôlé abandonné, conservé pour mémoire.
- tasks/infos-pratiques/selection-edito.json : les 44 fiches (scripts/diag-edito-infos-pratiques-export.ts).
- handoff/edito-infos-pratiques-2026-11-12/ (gitignoré) : BRIEF.md, input/, writer/, review/, final/.
- tasks/relecture-agent-prestataires-2026-11-12.md (à venir).
- tasks/cohorte-trafic-shortlist-7.md (à venir).
- handoff/edito-en-2026-11-12/ (à venir).

## Fait

- Analyse GSC + GA4 (fenêtres 2026-09-15/10-12 et 2026-10-13/11-09) : rapport dans le scratchpad de la session ; sessions GA4 3 992 -> 5 038 (+26 %), fiches salons 94 % des clics, EN 17 % des clics.
- Test contrôlé infos pratiques : seules 11 fiches ont au moins 20 impressions logistiques après exclusions ; sur elles, le CTR des requêtes logistiques (2,7 à 5,4 %) dépasse le CTR global (1,0 à 2,2 %). Hypothèse non soutenue, test abandonné.
- 44 fiches sélectionnées (éditions à venir, impressions FR+EN, hors test CTR 48, volet K, 20 fiches refaites les 11-12 nov., top 30 EN) et exportées.
- Cache CI : PR #186 mergée ; référence des 4 runs précédents : 3,6 à 4,5 min.

## Décisions

- Pas de test contrôlé sur les infos pratiques (puissance quasi nulle, hypothèse contredite) ; amélioration éditoriale sans mesure attendue.
- Les fiches des tests en cours sont exclues du lot jusqu'à leurs mesures (26-30 novembre).
- Le top 30 EN est exclu du lot infos pratiques pour éviter deux réécritures concurrentes du même MDX EN.

## Problèmes ouverts

- Paris Design Week : dates 2027 à lire par Julien (Incapsula).
- Alertes des lots du 11-12 novembre listées en E9bis de tasks/todo.md.

## Prochaine action

Appliquer scripts/diag-prestataires-relecture-2026-11-12-apply.ts dès que les 301 magnum et expocom répondent en prod, puis Request Indexing des fiches prestataires au feu vert et des fiches refaites. 44/44 fiches infos pratiques et relecture EN appliquées le 2026-11-12 (voir tasks/todo.md, section « Chantiers croissance du 2026-11-12 »).
