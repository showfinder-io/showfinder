# Trafic venant des assistants IA : référence et suivi

## Tâche
Établir la référence du trafic GA4 venant des assistants IA (depuis le 2026-08-01) et un moyen simple de la suivre. Mesure seule : aucun chantier de contenu dédié (décision Julien 2026-10-29). Lecture seule sur GA4, GSC, base et code applicatif.

## Critères de fin (écrits avant de commencer)
1. `scripts/diag-trafic-ia.ts` tourne de bout en bout depuis le repo (`./node_modules/.bin/tsx`) et écrit ses sorties CSV dans `audits/trafic-ia-<date>/`.
2. Sessions par semaine ISO et par source IA depuis le 2026-08-01, avec la part du total de sessions. Toute source au medium `ai-assistant` ou au referrer d'assistant connu est listée, aussi celles hors liste attendue.
3. Pages d'entrée principales du trafic IA (sessions par landing page).
4. Taux d'engagement et pages vues par session du trafic IA, comparés à google/organic sur la même période.
5. Trafic IA possiblement tombé en direct (utm_source ou referrer d'assistant sur des sessions `(direct)`) vérifié et signalé, sans double comptage avec les sources IA.
6. `tasks/trafic-ia/baseline-2026-10.md` : chiffres observés uniquement, aucune extrapolation ni prévision chiffrée, avec la ligne « pages d'entrée IA faibles en GSC ».
7. `tasks/todo.md` : mesure mensuelle avec la commande exacte.
8. `npm run build` OK, PR vers main, CI verte, merge.
Aucun critère n'est assoupli pour obtenir un pass : un écart reste écrit tel quel.

## Sorties (chemins exacts)
- tasks/trafic-ia/progress.md
- tasks/trafic-ia/baseline-2026-10.md
- scripts/diag-trafic-ia.ts
- tasks/todo.md (section mesure mensuelle)

## Fait
- Script exécuté, CSV dans audits/trafic-ia-2026-10-28/ (non versionné). Quinzaines 01-14/10 et 15-28/10 : 124 et 171 sessions chatgpt.com / ai-assistant, conforme au point du 2026-10-29.
- Référence écrite, mesure mensuelle inscrite dans tasks/todo.md (volet J).
- npm run build OK (2006 pages) avec l'environnement du checkout principal.

## Décisions
- Accès GA4 par le jeton `~/Projects/glyphe/.secrets/google-oauth-token-gsc-ga4.json`, Data API v1beta uniquement (Admin API non fiable).

## Problèmes ouverts
(aucun)

## Prochaine action
PR mergée, puis première mesure mensuelle le 2026-11-30.
