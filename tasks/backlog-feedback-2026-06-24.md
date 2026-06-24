# Backlog feedback Nicolas/Julien — 2026-06-24

Items remontés hors session idéation engagement. Non priorisés, à cadrer.

## UI — Fiche salon
- [x] Secteurs peu lisibles : affordance hover ajoutée (lift + ombre + brightness au survol, ring au focus clavier) sur la pill cliquable (SectorBadge). FAIT 2026-06-24, attend deploy.

## Admin > Salons
- [ ] Exporter les salons en CSV
- [ ] Champ Pays = menu déroulant (au lieu de saisie libre)
- [ ] Administration des secteurs depuis l'admin : sélection multiple de secteurs (M:N salon_sectors)
- [ ] Champ Lieu/Venue = menu déroulant sur la table venues (éviter d'inventer des lieux)
- [ ] Champ Organisateur = menu déroulant + gestion des organisateurs (table dédiée à créer ?)

## Admin > Venues
- [ ] Exporter les venues en CSV

## Public — Acquisition fiches (organisateurs)
- [ ] CTA "Vous ne voyez pas votre événement ? Ajoutez-le" : formulaire public permettant à un organisateur de remplir les champs d'une fiche salon directement.
- [ ] Workflow de modération : ces soumissions arrivent en status=draft/pending et doivent être approuvées avant mise en ligne (cf règle #13 : jamais de published non vérifié).

## Contact
- [x] Page /contact : accents corrigés dans contact-form.tsx (le coupable : "repondons", "ouvrees", "Ecrire a"). page.tsx était déjà correct. Event contact_form_submit câblé au passage. FAIT 2026-06-24, attend deploy.

## Signaux mineurs audit secteurs
- [x] Mentions bijouterie-horlogerie (Mode et Textile) + nautisme (Sport et Outdoor) dans les descriptions secteurs, accents corrigés. FAIT 2026-06-24, LIVE (DB). Migration 20260624010000.

## En attente (séparé)
- Migration secteurs Automobile + Art et Culture : APPLIQUÉE en base le 2026-06-24 (REST). Visible live au prochain déploiement (SSG). Fichier : supabase/migrations/20260624000000_create_sectors_automobile_art_culture.sql
