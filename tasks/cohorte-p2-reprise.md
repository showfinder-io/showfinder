# Reprise : cohorte P2 de la shortlist 2 (état au 2026-09-25 soir)

30 fiches P2 de `tasks/cohorte-trafic-shortlist-2.md`, en 4 lots. Brief complet : `handoff/cohorte-trafic/BRIEF-sl2-p2.md` (hors git, dossier handoff ignoré). Handoffs : `handoff/cohorte-trafic/<slug>.json`, reviews : `handoff/cohorte-trafic/reviews-sl2-p2/<slug>.pass{1,2}.md`, états avant correction : `handoff/cohorte-trafic/_prev/`.

## Pipeline par fiche

writer (Opus) → pass-1 (Sonnet) → correcteur si corrections (Sonnet) → pass-2 (Sonnet) → correcteur si corrections → traducteur EN (Sonnet) → insertion draft → vérif locale → publish.

- Contrôle automatique à chaque étape : `./node_modules/.bin/tsx scripts/diag-cohorte-p2-check.mts [--en] <slug>` (schéma, enums, secteurs, liens internes, compilation MDX, tirets cadratins, longueurs SEO).
- Insertion : `./node_modules/.bin/tsx --env-file=.env.local scripts/diag-cohorte-trafic-apply.ts [--apply|--publish] <slugs>` (draft d'abord, `--publish` ensuite, IndexNow automatique au publish). Le script reporte maintenant les coordonnées du lieu sur la fiche et sur les lieux créés.
- Prompts : chaque agent lit le BRIEF ; consigne ajoutée le 2026-09-25 après incident : aucune donnée personnelle (e-mail de l'utilisateur) envoyée à un service tiers, User-Agent Nominatim générique.

## Lot A (8 fiches, janvier à début mars 2027)

| slug | état |
|---|---|
| chr-pro-expo-grand-est | PRÊT (pass-1 et pass-2 OK, EN fait) |
| salon-see | PRÊT |
| congres-atec-its-france | PRÊT (nom retenu « Congrès Mobil'in Pulse (ex-ATEC ITS France) ») |
| premiere-classe | PRÊT. Champs sur la session du 2-5 octobre 2026 : PUBLIER AVANT LE 2 OCTOBRE, sinon la fiche affiche une session passée |
| iode | PRÊT |
| urbest | pass-2 OK. Reste : spot-fix optionnel seo_title 61 car. → « Urbest 2027 : salon des maires du Grand Est, 13-14 janv. » (56 car.), puis traduction EN |
| bisou | pass-2 OK avec 2 MINEUR (footer BudgetTable à harmoniser avec le tarif d'angle reformulé ; exposants nommés attribués « à l'édition 2027 » non vérifiable, neutraliser). Reste : correcteur, puis traduction EN |
| rencontres-amrae | pass-1 : 1 MINEUR (seo_title 62 car.) + 1 spot-fix (règle mal citée dans alerts). Reste : correcteur, pass-2, traduction EN |

Puis : insertion draft des 8, `npm run build`, contrôle local (`preview_start agoris-prod-local`, pages FR/EN 200, title, H1, MDX rendu), `--publish`, PR, Request Indexing GSC.

Nouveaux lieux créés par le lot A : docks-de-paris (SEE), parc-expo-chorus-vannes (IODE), beffroi-de-montrouge (Mobil'in Pulse), jardin-des-tuileries (Premiere Classe), centre international de Deauville (AMRAE).

## Lots B, C, D (slugs vérifiés sans collision, cadrage dans la shortlist, section P2)

- Lot B (mars 2027) : one-to-one-retail-ecommerce (Monaco, site dédié en 403), congres-des-audioprothesistes, minalogic-business-meetings, contaminexpo, c-brand, shop-le-salon, enviropro-grand-ouest, sitem
- Lot C (avril-juin 2027) : paris-cafe-festival, tech-for-industry-show, france-air-expo, cycl-eau-bordeaux, sepem-martigues (nom officiel « SEPEM Martigues », étiquette Sud-Est, La Halle de Martigues, 8-9 juin 2027), documation, digital-workplace-paris
- Lot D (fin juin 2027 à 2028) : euroforest, enviropro-toulouse, salon-funeraire, composites-meetings-europe, vs-pack, enviropro-sud-ouest, enviropro-nord

Leçon du lot A : le cadrage de la shortlist s'est trompé plusieurs fois (co-localisation Premiere Classe / Who's Next fausse, BISOU à Marseille depuis 2022 et non 2027, ATEC ITS renommé Mobil'in Pulse). Les writers doivent traiter le cadrage comme une piste, jamais comme une source.
