# Référence du trafic venant des assistants IA, 2026-10-28

Source : GA4 `properties/530912583` (Data API v1beta), période 2026-08-01 au 2026-10-28, extraction du 2026-10-29 par `scripts/diag-trafic-ia.ts`. GSC : `sc-domain:agoris.io`, même période (les derniers jours GSC sont encore incomplets). Chiffres observés uniquement, aucune extrapolation. Décision du 2026-10-29 : on mesure, pas de chantier de contenu dédié.

## Définition retenue

Une session est « IA » si son medium est `ai-assistant` ou si sa source correspond à un assistant connu (chatgpt, openai, gemini, perplexity, claude, copilot, you.com, mistral, deepseek, grok, meta.ai, poe, phind, kagi, qwen, kimi, doubao, ernie, manus). Le script liste toutes les sources retenues, la liste des 25 premières sources non retenues est imprimée pour repérer un assistant oublié. Aucun n'a été trouvé dans cette extraction.

Sources retenues (sessions sur la période) : chatgpt.com / ai-assistant 598, gemini.google.com / ai-assistant 39, perplexity / (not set) 32, perplexity.ai / ai-assistant 29, copilot.com / (not set) 9, claude.ai / ai-assistant 5, gemini / ai-assistant 5, copilot.com / ai-assistant 5, openai / (not set) 4, gemini / (not set) 3, chatgpt.com / (none) 1, chatgpt.com / referral 1, doubao.com / referral 1. Total 732.

## Sessions par semaine

Semaines ISO (lundi). La première (2 jours) et la dernière (3 jours) sont partielles. ChatGPT regroupe chatgpt.com sous tous ses medium ; Autres = openai + doubao.

| Semaine (lundi) | Jours | Total site | IA | Part | ChatGPT | Gemini | Perplexity | Copilot | Claude | Autres |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-07-27 | 2 | 37 | 1 | 2,7 % | 1 | 0 | 0 | 0 | 0 | 0 |
| 2026-08-03 | 7 | 192 | 24 | 12,5 % | 8 | 1 | 15 | 0 | 0 | 0 |
| 2026-08-10 | 7 | 164 | 9 | 5,5 % | 6 | 1 | 1 | 0 | 1 | 0 |
| 2026-08-17 | 7 | 243 | 24 | 9,9 % | 19 | 0 | 3 | 1 | 1 | 0 |
| 2026-08-24 | 7 | 430 | 40 | 9,3 % | 36 | 1 | 1 | 2 | 0 | 0 |
| 2026-08-31 | 7 | 624 | 54 | 8,7 % | 39 | 3 | 7 | 1 | 2 | 2 |
| 2026-09-07 | 7 | 949 | 61 | 6,4 % | 53 | 2 | 5 | 0 | 0 | 1 |
| 2026-09-14 | 7 | 947 | 77 | 8,1 % | 62 | 9 | 2 | 4 | 0 | 0 |
| 2026-09-21 | 7 | 788 | 50 | 6,3 % | 41 | 6 | 1 | 1 | 1 | 0 |
| 2026-09-28 | 7 | 1 015 | 87 | 8,6 % | 73 | 4 | 9 | 1 | 0 | 0 |
| 2026-10-05 | 7 | 1 174 | 88 | 7,5 % | 75 | 4 | 6 | 3 | 0 | 0 |
| 2026-10-12 | 7 | 1 401 | 67 | 4,8 % | 54 | 3 | 7 | 1 | 0 | 2 |
| 2026-10-19 | 7 | 1 058 | 106 | 10,0 % | 94 | 10 | 2 | 0 | 0 | 0 |
| 2026-10-26 | 3 | 588 | 44 | 7,5 % | 39 | 3 | 2 | 0 | 0 | 0 |

Cumul sur la période : 9 610 sessions au total, 732 IA (7,6 %) : ChatGPT 600, Perplexity 61, Gemini 47, Copilot 14, Claude 5, autres 5.

Quinzaines de contrôle (réconcilient avec le point du 2026-10-29) : 01-14/10, IA 149 (6,1 % de 2 428), dont chatgpt.com / ai-assistant 124, perplexity.ai / ai-assistant 11, gemini.google.com / ai-assistant 6. 15-28/10, IA 197 (8,6 % de 2 296), dont chatgpt.com / ai-assistant 171, gemini.google.com / ai-assistant 15, perplexity.ai / ai-assistant 8.

## Engagement, période entière

| Segment | Sessions | Part du total | Taux d'engagement | Pages vues / session |
|---|---|---|---|---|
| IA (toutes sources) | 732 | 7,6 % | 58,1 % | 1,98 |
| chatgpt.com / ai-assistant | 598 | 6,2 % | 60,2 % | 2,04 |
| gemini.google.com / ai-assistant | 39 | 0,4 % | 64,1 % | 1,72 |
| perplexity / (not set) | 32 | 0,3 % | 18,8 % | 1,22 |
| perplexity.ai / ai-assistant | 29 | 0,3 % | 48,3 % | 1,21 |
| google / organic | 5 317 | 55,3 % | 55,5 % | 1,33 |
| Total site | 9 610 | 100 % | 51,9 % | 1,37 |

Les autres sources IA ont moins de 10 sessions chacune : trop peu pour lire un taux. Sur 01-14/10 puis 15-28/10, le taux d'engagement IA passe de 47,0 % à 61,4 % et les pages vues par session de 1,45 à 1,76 (google/organic : 56,0 % puis 57,5 %, 1,38 puis 1,30). Les 56 sessions IA avec landing page « (not set) » (sans page vue, 1,8 % d'engagement) comptent dans ces moyennes. Elles font 7,7 % des sessions IA ; tous canaux, les landing « (not set) » font 602 sessions sur 9 610 (6,3 %).

## Pages d'entrée

732 sessions IA sur 248 landing pages. Répartition par type de page (sessions IA) : fiches salons FR 264, secteurs FR 143, fiches salons EN 135, « (not set) » 56, secteurs EN 39, villes FR 33, prestataires 18, villes EN 10, accueil 9, blog 7, lieux 6 (FR) et 5 (EN), divers 5.

Top 10 : /secteurs/btp-construction 34 (chatgpt), /villes/paris 33 (chatgpt), /salons 25 (chatgpt, engagement 20 %), /secteurs/agriculture 21, /salons/paris-design-week 20 (19 perplexity / (not set), engagement 10 %, 1,00 page vue), /salons/mondial-auto-paris 14 (perplexity.ai), /secteurs/tourisme-hotellerie 13, /secteurs/sante-pharma 11, /salons/seminaire-expo 11, /en/salons/cosmoprof-bologna 10. Liste complète : `audits/trafic-ia-2026-10-28/ia-pages-entree.csv` (non versionné, régénérable par le script).

## Trafic IA en direct ou classé ailleurs

- Sessions `(direct)` : 1 575. Aucune n'a d'utm dans sa landing page (0 avec `utm_source`, donc 0 avec `utm_source=chatgpt.com`). GA4 range le trafic `utm_source=chatgpt.com` sous la source chatgpt.com, pas en direct.
- Référent d'assistant (page_referrer) sur une session non classée IA : 3 sessions seulement. Une `(direct)` avec référent `https://gemini.google.com/`, une `(not set)` avec référent `https://gemini.google.com/`, une `(direct)` avec référent interne `https://www.agoris.io/secteurs/immobilier?utm_source=chatgpt.com`. Ces 3 sessions ne sont pas dans les 732 : si on les ajoutait, ce serait 735. Aucun double comptage.
- Limite : un assistant qui n'envoie ni référent ni utm tombe en `(direct)` sans trace, et un clic depuis l'IA de Bing ou de Google est compté en `bing / organic` (1 341 sessions) ou `google / organic`. Ces volumes ne sont pas mesurables avec GA4 et ne sont pas inclus.

## Pages d'entrée IA aussi faibles en GSC

Lecture : contenu cité ou recommandé par les LLM mais peu trouvé sur Google. Seuil de lecture posé pour cette note : au moins 5 sessions IA sur la période et au plus 5 clics GSC sur la même période. 19 pages passent ce seuil, 185 sessions IA (25 % des 732). Parmi les pages à au moins 5 sessions IA (29 pages, 331 sessions), les 10 autres ont plus de 5 clics GSC.

| Page | Sessions IA | Clics GSC | Impressions GSC | Position moyenne |
|---|---|---|---|---|
| /salons | 25 | 3 | 67 | 44,8 |
| /secteurs/agriculture | 21 | 4 | 392 | 7,6 |
| /secteurs/tourisme-hotellerie | 13 | 4 | 468 | 19,4 |
| /secteurs/sante-pharma | 11 | 2 | 85 | 8,1 |
| /salons/seminaire-expo | 11 | 4 | 413 | 6,3 |
| /en/salons/cosmoprof-bologna | 10 | 1 | 207 | 20,9 |
| /en/secteurs/btp-construction | 10 | 0 | 126 | 7,7 |
| /secteurs/cosmetique-beaute | 10 | 3 | 468 | 12,7 |
| /en/villes/paris | 9 | 0 | 77 | 31,6 |
| /secteurs/energie-environnement | 9 | 5 | 773 | 36,3 |
| /en/secteurs/cosmetique-beaute | 8 | 0 | 334 | 13,6 |
| /en/salons/solscope | 7 | 0 | 48 | 6,2 |
| /en/salons/cosmetic-360 | 7 | 2 | 80 | 7,9 |
| /en/salons/bijorhca-paris | 6 | 0 | 89 | 7,5 |
| /en/secteurs/agriculture | 6 | 1 | 101 | 6,9 |
| /prestataires/prestataires-audiovisuel-paris | 6 | 2 | 976 | 56,7 |
| /secteurs/rh-formation | 6 | 5 | 303 | 37,2 |
| /secteurs/automobile | 5 | 0 | 160 | 21,9 |
| /en/salons/bioket | 5 | 3 | 256 | 5,6 |

Constat brut : 9 de ces 19 pages sont en anglais (`/en/`) et 10 sont des pages secteurs (FR et EN). Pas d'interprétation causale ici. À l'inverse, des pages d'entrée IA sont aussi fortes en GSC, par exemple /salons/tech-elevage-la-roche-sur-yon (9 sessions IA, 96 clics) et /salons/mondial-auto-paris (14 sessions IA, 46 clics).

## Limites de lecture

- Données observées, aucune prévision. Les semaines partielles (début et fin) ne se comparent pas aux autres.
- Les volumes par source hors ChatGPT sont petits (quelques sessions par semaine) : une variation de 5 sessions fait changer la part de plusieurs points.
- Le total site passe de 192 à 1 401 sessions par semaine sur la période : la part IA est un ratio, pas un volume. Les volumes IA ont aussi augmenté (de 24 à 106 sessions par semaine entre le 2026-08-03 et le 2026-10-19).
- Pas de lecture du comportement de conversion : les events GA4 de l'annexe `tasks/ga4-config-engagement-2026-06-24.md` n'ont pas été croisés ici.
