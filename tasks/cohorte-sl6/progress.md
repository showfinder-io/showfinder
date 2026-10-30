# Progress : shortlist 6 (cohorte trafic)

## Tâche

Go Julien du 2026-10-30 : produire la shortlist 6 (objectif 50 fiches), recherche + scoring + vérification, puis arbitrage de Julien AVANT toute rédaction. Rédaction et publication hors du go actuel.

## Critères de fin de cette étape

- `tasks/cohorte-trafic-shortlist-6.md` : candidats confirmés sur source primaire, ordre de rédaction par score, rejets motivés.
- `handoff/shortlist-6/cadrage/<slug>.json` pour chaque confirmé.
- Cas limites listés pour arbitrage (grand public, itinérants, séries).
- Si moins de 50 confirmés : le dire avec le nombre réel, ne pas assouplir les critères.

## Critères de fin de la rédaction (go Julien 2026-10-30 : 22 fiches tier A et B)

1. Chaque fiche : writer Opus, pass-1 Sonnet avec correction, pass-2 Sonnet indépendante avec correction et traduction EN, aucun MAJEUR ouvert, ou abandon motivé.
2. `diag-cohorte-p2-check.mts --en` à 0 erreur sur toutes les fiches, contrôle Jev « le corps décrit-il ce salon » sur chaque corps FR et EN.
3. Insertion en draft puis publication en bloc, IndexNow, URLs FR et EN en 200 en prod.
4. `tasks/todo.md` et ce fichier à jour, PR mergée, CI verte. Request Indexing GSC en file.

## Sorties

- `handoff/shortlist-6/BRIEF.md`, `exclusions.json`, `published-slugs.json`
- `handoff/shortlist-6/candidats-<angle>.md` (un par agent)

## Fait

- Le lot s'appelait shortlist 5 jusqu'au 2026-10-30 : une autre session a publié une shortlist 5 de 35 fiches le 2026-10-29 (PR 174), renommé en shortlist 6. Ses fiches étaient déjà exclues (catalogue live, 0 slug proposé déjà publié, contrôle du 2026-10-30).
- 8 livrables de recherche, consolide.json (56 candidats, 41 à revoir), 81 entrées vérifiées : 60 confirmées, 10 rejetées, 11 non vérifiables.
- Scoring : audits/scoring-candidats-sl6-2026-10-30/, 0,48 USD.
- Livrable : tasks/cohorte-trafic-shortlist-6.md, 60 cadrages, un par confirmé.

## Décisions

- 2026-10-30, Julien : 22 fiches tier A et B, choix par défaut de la shortlist 6. Sous-agents en vagues plutôt que l'outil Workflow, non demandé explicitement.

- Jev pour classer les SERP. Vérification faite par agents Sonnet et non par Jev : la SL5 a un pipeline Jev (scripts/diag-sl5-pipeline.py) non vu au lancement.
- Précédents appliqués par défaut : Solutions CSE en fiche série, éditions de décembre à faible demande écartées, grand public sans angle exposant écarté.

## Problèmes ouverts

- Les 20 tier C restent à décider après mesure de la shortlist 5.

## Rédaction et publication (2026-10-30)

- 22 writers Opus, 22 pass-1 et 22 pass-2 Sonnet, 3 agents par fiche, un dossier temporaire par agent. Aucun écrasement constaté : slug vérifié sur les 22 avant insertion, contrôle Jev à 0,93 ou plus sur 44 corps.
- Coût mesuré : environ 15,8 M de tokens de sous-agents, soit 0,72 M par fiche.
- Check `diag-cohorte-p2-check.mts --en` : 0 erreur. Insertion en draft relue en base, publication en bloc, IndexNow 200, 44 URLs 200 en prod.
- Lieux créés : quai-saint-malo, oceanice-nice, parc-des-expositions-de-lorient, chateau-de-baville, centre-congres-pierre-baudis, port-camargue, rochexpo-la-roche-sur-foron, base-sous-marine-saint-nazaire, port-des-minimes-la-rochelle, isara-agrapole-lyon. Sans lieu : handica, international-multihull-show. Dates à confirmer : handica, enviropro-martigues.

## Prochaine action

Request Indexing GSC de journees-sfnv puis ricai au prochain quota, puis la file de tasks/todo.md (D23, D24).
