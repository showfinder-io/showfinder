# Reprise : cohorte P2 de la shortlist 2 (état au 2026-09-26)

30 fiches P2 de `tasks/cohorte-trafic-shortlist-2.md`, en 4 lots. Brief complet : `handoff/cohorte-trafic/BRIEF-sl2-p2.md` (hors git, dossier handoff ignoré). Handoffs : `handoff/cohorte-trafic/<slug>.json`, reviews : `handoff/cohorte-trafic/reviews-sl2-p2/<slug>.pass{1,2}.md`, états avant correction : `handoff/cohorte-trafic/_prev/`.

## Pipeline par fiche

writer (Opus) → pass-1 (Sonnet) → correcteur si corrections (Sonnet) → pass-2 (Sonnet) → correcteur si corrections → traducteur EN (Sonnet) → insertion draft → vérif locale → publish.

- Contrôle automatique à chaque étape : `./node_modules/.bin/tsx scripts/diag-cohorte-p2-check.mts [--en] <slug>` (schéma, enums, secteurs, liens internes, compilation MDX, tirets cadratins, longueurs SEO).
- Insertion : `./node_modules/.bin/tsx --env-file=.env.local scripts/diag-cohorte-trafic-apply.ts [--apply|--publish] <slugs>` (draft d'abord, `--publish` ensuite, IndexNow automatique au publish). Le script reporte maintenant les coordonnées du lieu sur la fiche et sur les lieux créés.
- Prompts : chaque agent lit le BRIEF ; consigne ajoutée le 2026-09-25 après incident : aucune donnée personnelle (e-mail de l'utilisateur) envoyée à un service tiers, User-Agent Nominatim générique.

## Lot A (8 fiches) : PUBLIÉ le 2026-09-26

chr-pro-expo-grand-est, salon-see, congres-atec-its-france (nom retenu « Congrès Mobil'in Pulse (ex-ATEC ITS France) »), premiere-classe (session du 2-5 octobre 2026), iode, urbest, bisou, rencontres-amrae. Toutes passées pass-1 et pass-2, traduites en EN, contrôle automatique OK, pages FR/EN en 200 sur le serveur de prod local, IndexNow 202 (16 URL).

Corrections finales : urbest seo_title raccourci (spot-fix pass-2) ; bisou footer BudgetTable harmonisé et exposants datés de la consultation (fin septembre 2026) au lieu de « édition 2027 » ; rencontres-amrae seo_title raccourci et référence de règle corrigée dans alerts, pass-2 BON sans correction.

Nouveaux lieux créés : docks-de-paris, beffroi-de-montrouge, jardin-des-tuileries, parc-expo-chorus-vannes, centre-international-de-deauville.

Reste : Request Indexing GSC des 8 fiches ; premiere-classe devra être roulée après le 5 octobre (routine roll).

## Lot B (8 fiches) : PUBLIÉ le 2026-09-26

one-to-one-retail-ecommerce, congres-des-audioprothesistes, minalogic-business-meetings, contaminexpo, c-brand, shop-le-salon, enviropro-grand-ouest, sitem. Writers Opus, pass-1 et pass-2 Sonnet, traduction EN, contrôle automatique OK, pages FR/EN en 200 sur le serveur de prod local, IndexNow 202 (16 URL). Aucun lieu créé.

Écarts au cadrage relevés par les writers : numéro d'édition Audioprothésistes non affiché (null, pas « 47e ») ; One to One 16e et non 15e (le site affiche 16ème en FR et 17th en EN, 16 retenu d'après le Grimaldi Forum) ; Minalogic « +500 / +1 400 » remplacés par le bilan 2026 (440 participants, 1 247 rendez-vous) ; ContaminExpo bisannuel (années impaires) avec bilans 2023 et 2025 publiés ; SITEM bilan 2026 publié (4 816 visiteurs, 175 exposants) ; SHOP! Le Salon ex-salon MPV, pas d'édition en 2024 ; ENVIROpro « 300+ exposants » = texte gabarit, écarté.

Décisions Julien 2026-09-26 : ENVIROpro Grand-Ouest `frequency` = null (éditions 2022, 2024, 2025, 2027 : rythme irrégulier, la fiche n'affiche pas de fréquence ; `diag-cohorte-p2-check.mts` admet désormais null) ; édition « ENVIROpro Grand-Ouest Rennes » (Glaz Arena, 17-18 juin 2028) : fiche distincte ou bascule à décider plus tard, mentionnée au conditionnel.

Liens croisés RR37 ajoutés à la publication : c-brand ↔ shop-le-salon (co-localisés, Pavillon 5).

Reste : Request Indexing GSC des 8 fiches (file D14 de tasks/todo.md).

## Lots C, D (slugs vérifiés sans collision, cadrage dans la shortlist, section P2)

- Lot C (avril-juin 2027) : paris-cafe-festival, tech-for-industry-show, france-air-expo, cycl-eau-bordeaux, sepem-martigues (nom officiel « SEPEM Martigues », étiquette Sud-Est, La Halle de Martigues, 8-9 juin 2027), documation, digital-workplace-paris
- Lot D (fin juin 2027 à 2028) : euroforest, enviropro-toulouse, salon-funeraire, composites-meetings-europe, vs-pack, enviropro-sud-ouest, enviropro-nord

Leçon du lot A : le cadrage de la shortlist s'est trompé plusieurs fois (co-localisation Premiere Classe / Who's Next fausse, BISOU à Marseille depuis 2022 et non 2027, ATEC ITS renommé Mobil'in Pulse). Les writers doivent traiter le cadrage comme une piste, jamais comme une source.
