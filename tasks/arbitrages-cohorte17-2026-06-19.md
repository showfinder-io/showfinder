# Cohorte 17 - clôture annuaire (2026-06-19)

Dernière cohorte (5 demandées, 4 publiées + 1 dépubliée). **Annuaire bouclé : 192 fiches publiées, 192 enrichies (100 %).**

## Fiches publiées (4)

| slug | catégorie | édition | correction notable |
|------|-----------|---------|--------------------|
| all4customer-paris | salon_professionnel | 2027 (23-25 mars) | fusion Stratégie Clients + E-Marketing (Weyou Group) ; 15 996 visiteurs / 233 exposants ; secteur tech-numérique |
| open-energies-lyon | salon_professionnel | **2028** (biennal pair) | GL events ; alterne avec BePositive ; lie bepositive-lyon + expobiogaz (RR37) ; secteur énergie-environnement |
| medi-nov-connection-lyon | **congres** | 2026 (1-2 juil) | convention d'affaires medtech ; organisateur réel **Proximum SAS (Comexposium)** (pas Lyonbiopole) ; venue Centre de Congrès de Lyon ; secteur santé-pharma |
| reeduca-paris | salon_professionnel | 2026 (17-19 sept) | organisateur **RX France** ; Porte de Versailles ; secteur santé-pharma |

Catégories validées Julien (2026-06-19) : medi-nov = congres ; reeduca = salon_professionnel (corrige 'congres' erroné en base). `category_to_confirm=false` posé sur les 4. Secteurs déjà reliés en base (vérifié).

## Dépublication : batinov-lyon (RR33, salon dormant)

Décision Julien : **dépublier**. Le pipeline a établi (sans rien inventer) :
- Lancé 2016 par GL Events (alternance avec BePositive), **aucune édition confirmée depuis**, **pas de site officiel actif**.
- Les dates circulant sur les agrégateurs (neventum 23-25 mars 2027) sont **fabriquées** (incohérentes avec BePositive 2027).

Action : `status` -> `draft`, pas d'editorial_mdx. Aucun impact SEO (la fiche était déjà sans editorial_mdx donc noindex, jamais indexée). Pas de 301 (option legacy écartée). Le handoff legacy est conservé dans `handoff/cohorte-17-batinov/` pour mémoire. Reconfirmer auprès de GL Events si une édition Batinov revenait.

## Scripts d'intégration

- `diag-cohorte16-apply.ts --dir=handoff/cohorte-17-review --apply` (editorial_mdx + db_updates des 4).
- `diag-cohorte17-fixup.ts --apply` (catégorie + category_to_confirm=false + venue_id medi-nov/reeduca + dépublication batinov ; secteurs déjà présents).

## Bilan global (cohortes 15-16-17)

23 fiches produites en 3 jours (9 + 10 + 4), 1 dédup (pcd-congress), 1 dépublication (batinov). **Annuaire Agoris à 100 % de fiches enrichies.**
