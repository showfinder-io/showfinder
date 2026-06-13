# Arbitrages Nicolas en attente (session data 2026-06-13)

Décisions accumulées pendant l'assainissement du catalogue + cohortes 8-12. Non bloquantes (contenu publié), à trancher avec Nicolas. Quand tranché : appliquer en base (script diag-*) + cocher.

## Fréquences hors enum

- [ ] **congres-hr-paris** : salon **semestriel** (2 éditions/an, avril + novembre). L'enum frequency ne couvre que annuel/bisannuel/triennal/ponctuel. Décision : étendre l'enum avec `semestriel`, ou laisser `annuel` (faux mais le moins gênant) ? Si extension : migration idempotente comme pour `triennal`.

## Identité / périmètre de fiche

- [ ] **cloud-expo-europe-paris** : ce n'est pas un salon autonome mais un **pavillon de Tech Show Paris**. Renommé éditorialement "Cloud & AI Infrastructure Paris". Décision : garder une fiche dédiée, ou dépublier + 301 vers la fiche Tech Show / fusionner ?
- [ ] **world-of-concrete-europe-paris** : sous-ensemble d'**Intermat** (pas autonome). Publié en fiche dédiée (présentée comme composante d'Intermat). Décision : garder dédiée ou 301 vers intermat-paris ?
- [ ] **parabere-forum-nice** : secteur actuel `tourisme-hotellerie` inadapté (forum gastronomie/alimentation/nutrition). Aucun secteur Agoris ne colle parfaitement. Décision taxonomie : reclasser (agroalimentaire ?) ou créer un secteur.
- [ ] **regal-toulouse** (dépublié, en pause depuis 2025) : c'est un salon **grand public** (pas B2B comme le disait la DB). Décision : republier en `category=grand_public` quand une édition est reconfirmée, ou sortir du périmètre Agoris (Agoris = salons pros) ?

## category à confirmer

- [ ] **salon-copropriete-paris** : mixte pro / grand public, à trancher.
- [ ] **24 fiches `category_to_confirm=true`** issues du backfill LLM (review admin) : cas limites type CES Las Vegas (pro ou grand public ?), power-gen, etc. Liste dans l'admin.

## Slugs itinérants (renommage + 301 à décider)

- [ ] **biofit-lille** : BioFIT est itinérant (Strasbourg/Marseille/Lille selon l'année), le slug fige "lille". Migrer vers `biofit` (sans ville, comme expobiogaz) + 301 ?

## Numéro d'édition (sources divergentes)

- [ ] **gazelec-paris** : congresgazelec.com affiche "17e édition" 2026, filiere-3e.fr "15e anniversaire" 2025 (donnerait 16e). Non affiché dans le MDX (RR7). À trancher avec l'organisateur.

## Chiffres venues à reconfirmer (surfaces issues d'agrégateurs tiers)

- [ ] Surfaces sourcées sur abcsalles.com / paris-art.com (pas le site officiel), à confirmer : **centre-des-congres-reims**, **espace-champerret** (8 450 m²), **maison-de-la-mutualite** (2 998 m²), **palais-de-tokyo** (22 000 m²).
- [ ] **maison-de-la-mutualite** : plus aucun salon rattaché (parabère déménagé à Nice). Garder la fiche lieu en prévision, ou dépublier ?

## Actions à ta main (hors Nicolas)

- [ ] **Request Indexing GSC** sur le contenu publié/corrigé de la session.
- [ ] Reste **~18 fiches "à venir" vierges** (avant cohorte 12) + **~39 passées** à éditorialiser au fil des rolls.
