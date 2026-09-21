# Brief pipeline éditorial prestataires

> Règles : `tasks/regles-edito-prestataires-v1.md` (P1 à P34), à lire en entier avant d'écrire.
> Pipeline : dossier figé (script) → writer → contrôle mécanique (script) → reviewer pass-1
> → corrections → pass-2 sur les pages à enjeu → traduction EN → insertion par la boucle principale.
> Tous les fichiers de travail vivent dans `handoff/prestataires/` (hors git).

## Rôle WRITER (un lot de fiches)

Pour chaque slug du lot :

1. Lire `handoff/prestataires/dossiers/<slug>.json` en entier : `site_pages[].text` (site officiel),
   `directory.text` (fiche LEADS France ou Prestalians), `legal_unit` (registre des entreprises),
   `current_description` (texte actuel en base, à remplacer). Tu ne navigues PAS sur le web (P2).
2. Écrire `handoff/prestataires/out/<slug>.json`, exactement ce format :

```json
{
  "slug": "adexpo",
  "status": "ok",
  "display_name": "adEXPO",
  "description_fr": "Un ou deux paragraphes de texte brut, 600 à 800 caractères visés (P15, P16).",
  "specialties": [
    { "label": "stands sur mesure", "evidence": { "url": "https://...", "quote": "verbatim du dossier" } }
  ],
  "founded_year": { "value": 1989, "evidence": { "source": "api" } },
  "zone_intervention": { "value": "France et Europe", "evidence": { "url": "https://...", "quote": "verbatim" } },
  "memberships": ["leads_france"],
  "claims": [
    { "claim": "Atelier de fabrication intégré à Reims", "evidence": { "url": "https://...", "quote": "verbatim" } }
  ],
  "alerts": ["Tout doute, incohérence entre sources, identité incertaine, site pauvre : ici, jamais dans le texte"]
}
```

   - `claims` : une entrée par affirmation factuelle de la description (métier, ville, prestations,
     secteurs servis, atelier, groupe d'appartenance, références publiées...). Une phrase de la
     description sans claim correspondant est une phrase à supprimer.
   - `quote` : copié-collé depuis le dossier, 20 à 260 caractères (8 minimum pour une spécialité),
     sans retouche. Le contrôle mécanique cherche la citation telle quelle dans le dossier.
   - `founded_year` : `{"source":"api"}` uniquement si `legal_unit.match` est non nul (année de
     `date_creation`) ; `{"source":"site","url","quote"}` si le site l'écrit ; sinon `null`. Si le
     site et le registre divergent, le site prime et l'écart va dans `alerts` (P21).
   - `zone_intervention` : `null` si le site ne déclare rien (P13, P22).
   - `memberships` : d'après `directory.source` du dossier (`LEADS France` → `leads_france`,
     `Prestalians` → `prestalians`), liste vide sinon.
   - `display_name` : graphie du site officiel (P18). Dans le doute, garder `company_name`.
   - `status` : `"matiere_insuffisante"` si le dossier ne permet pas 400 caractères honnêtes
     (site vide, en JavaScript, hors sujet). Livrer alors ce qui est prouvable, même court (P15).
3. Lancer le contrôle mécanique sur ton lot et corriger jusqu'à ce qu'il passe :
   `./node_modules/.bin/tsx scripts/diag-providers-lint.ts --only slug1,slug2,...`
   Ne jamais contourner une erreur de citation en retouchant la citation : soit tu trouves le bon
   verbatim dans le dossier, soit tu retires l'affirmation.

Rappels qui font les MAJEUR les plus fréquents : aucun superlatif (P10), aucune référence client
hors page réalisations du site (P7), aucun chiffre sans verbatim (P8), troisième personne (P11),
ne pas recopier l'annuaire (P17), « basé à » et jamais de restriction géographique inventée (P13).

## Rôle REVIEWER pass-1 (même lot, contexte vierge)

Pour chaque slug : lire le dossier ET la sortie writer, puis re-fetcher la page d'accueil du site
officiel (WebFetch) pour confirmer l'identité de l'entreprise (P33 : ville ou code postal cohérent,
pas un homonyme) et l'actualité des faits. Écrire `handoff/prestataires/reviews/pass1/<slug>.json` :

```json
{
  "slug": "adexpo",
  "identity_confirmed": true,
  "verdict": "ok | corrections | bloquant",
  "findings": [
    { "severity": "MAJEUR | mineur", "rule": "P7", "sentence": "phrase visée", "problem": "...",
      "proof_url": "URL qui contredit ou page où l'info manque", "proof_quote": "passage", "fix": "correction proposée" }
  ]
}
```

Règles du reviewer : verdict phrase par phrase ; tout « à corriger » porte sa preuve (P31) ; pas de
suppression sans preuve contraire (anti-sur-correction) ; liste des MAJEUR d'office en P32.
`bloquant` = identité non confirmée ou site qui n'est pas celui de l'entreprise : la fiche sort du lot.

## Rôle CORRECTEUR

Appliquer les findings de pass-1 dans `out/<slug>.json` (description, claims, données structurées),
sans rien ajouter qui ne soit prouvé par le dossier, puis relancer le contrôle mécanique sur le lot.
Un finding contesté (preuve du reviewer insuffisante) n'est pas appliqué : le noter dans `alerts`.

## Rôle REVIEWER pass-2 (pages à enjeu)

Même grille que pass-1, contexte vierge, sur la version corrigée. Sortie dans
`handoff/prestataires/reviews/pass2/<slug>.json`. Vérifie en plus que les corrections de pass-1
n'ont pas introduit d'erreur ni supprimé un fait prouvé.

## Rôle TRADUCTEUR

Ajouter `description_en` dans `out/<slug>.json` : traduction fidèle en anglais britannique, mêmes
faits, mêmes interdits (P19). Noms propres, labels, villes non traduits. Pas de tiret long.
Relancer le contrôle mécanique sur le lot.
