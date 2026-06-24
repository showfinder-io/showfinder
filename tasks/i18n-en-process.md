# Process i18n : passage du site en anglais (en-GB)

> Validé par Julien le 2026-06-24. Objectif : alimenter le flywheel 1 (trafic) en ouvrant le site à l'audience européenne anglophone.

## Décisions actées
- **Routing** : sous-chemin `/en` (FR par défaut sans préfixe). Une seule autorité de domaine.
- **Langue** : anglais britannique (en-GB), cible Europe. Orthographe UK (colour, organise, -ise).
- **Terme métier** : "salon" -> **"trade show" / "trade fair"**. La marque reste "Agoris". L'UI et le contenu disent "trade show". ("salon" en anglais = coiffure/beauté, mauvais SEO.)
- **Review** : traducteur LLM + reviewer LLM + checks automatiques + relecture HUMAINE seulement sur les pages phares (home, top 5 secteurs, top fiches trafic GSC). Pas de relecture humaine systématique.
- **Périmètre du lancement** : TOUT le site traduit + relu AVANT d'activer le sélecteur EN. Le toggle reste masqué tant que le corpus n'est pas complet.

## Séquencement (dépendances)
Phase 0 (socle) GATE Phase 2 (le data model EN doit exister avant de traduire). Phase 1 et le glossaire peuvent se faire en parallèle de Phase 0.

### Phase 0 — Socle infra (séquentiel, prérequis)
- Installer + configurer **next-intl** (absent aujourd'hui), routing locale `/en`.
- hreflang réciproque + canonical par locale + sitemap par locale + robots.
- Sélecteur **FR | EN** en haut à droite du header, persistant (cookie/localStorage), MASQUÉ tant que le corpus EN n'est pas complet (flag d'activation).
- Data model EN : colonnes `editorial_mdx_en`, `description_en`, `seo_title_en`, `seo_description_en` sur `salons`, `sectors`, `venues` (migration SQL). Fallback : si `_en` nul, on n'affiche pas la page en EN (ou fallback FR signalé) selon politique finale.
- Fixer le glossaire/termbase en-GB (voir plus bas).

### Phase 1 — UI statique (parallélisable avec Phase 0)
- Extraire toutes les chaînes FR en dur (composants + pages) dans `messages/fr.json`.
- Traduire en `messages/en.json` (en-GB) via LLM + review.

### Phase 2 — Contenu éditorial (la tâche longue, en éventail)
Pipeline writer/reviewer (workflow connu, fan-out sur N agents, prioriser par trafic GSC même si on publie tout d'un coup) :
1. **Traducteur** (LLM, en-GB) : traduit editorial_mdx/description/seo. Préserve markdown, liens internes (le template réécrit `/salons/x` -> `/en/salons/x`, le MDX garde le slug FR), faits/chiffres, glossaire. Ne traduit QUE les fiches fiables (règle #13, fiches avec MDX).
2. **Reviewer** (LLM, QA) : fidélité (aucun fait ajouté/retiré), orthographe britannique, cohérence terminologique vs glossaire, intégrité des liens, détecteur de FR résiduel.
3. **Checks automatiques** : linter orthographe UK, vérif liens, détecteur de français non traduit, sanity longueur.
4. **Application DB** + relecture humaine sur pages phares uniquement.

## Glossaire/termbase en-GB (seed, à compléter)
- salon (événement) -> trade show / trade fair
- exposant -> exhibitor
- visiteur -> visitor / attendee
- stand -> stand (UK) [ne pas traduire en "booth" qui est US]
- prestataire -> service provider / supplier
- organisateur -> organiser (UK, -er pas -or)
- secteur -> sector / industry
- fiche salon -> trade show listing / profile
- Agoris, noms de salons, noms de lieux : NE PAS traduire.
- Orthographe : -ise (organise, specialise), -our (colour, behaviour), -re (centre, theatre), -lled (cancelled, labelled).

## Parallélisation
- Sequentiel : Phase 0 infra (routing + data model) d'abord.
- En parallèle pendant Phase 0 : Phase 1 (extraction strings) + finalisation glossaire.
- Phase 2 : fan-out massif (pipeline par fiche), une fois le data model EN en place.

## Points encore ouverts
- Politique de fallback exacte pour une page sans `_en` (cacher en EN vs servir FR avec hreflang) : à trancher en Phase 0.
- Faut-il traduire le blog MDX (dans /content) en plus du contenu DB ? À confirmer.
