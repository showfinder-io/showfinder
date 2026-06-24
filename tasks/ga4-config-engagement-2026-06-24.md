# GA4 — Config engagement Agoris (2026-06-24)

Ce document liste les actions exactes à effectuer manuellement dans l'interface Google Analytics 4
pour tirer parti des events déjà câblés dans le code.
Aucune modification de code n'est requise : tout est déjà envoyé via `trackEvent()`.

---

## 1. Inventaire complet des events — état au 2026-06-24

| Event GA4          | Statut code       | Fichier(s)                                                           | Params envoyés                                              |
|--------------------|-------------------|----------------------------------------------------------------------|-------------------------------------------------------------|
| search_submit      | Câblé             | src/components/hero.tsx:93                                           | query, source                                               |
| filter_change      | Câblé (2026-06-24)| src/components/salon-filters-sidebar.tsx (updateParam + toggleSector)| filter_name, filter_value, action (sector uniquement)       |
| salon_outbound_click | Câblé           | src/components/salon-outbound-link.tsx:34                            | slug, destination                                           |
| venue_outbound_click | Câblé           | src/components/venue-outbound-link.tsx:34                            | slug, destination                                           |
| provider_drawer_open | Câblé           | src/components/provider-drawer.tsx:85                                | salon_slug                                                  |
| alert_subscribe    | Câblé             | src/components/alert-subscribe.tsx:34                                | type, slug                                                  |
| quote_request_submit | Câblé (2026-06-24)| src/components/quote-request.tsx                                   | provider_name                                               |
| contact_form_submit | Câblé            | src/app/contact/contact-form.tsx:21                                  | method                                                      |
| review_submit      | Câblé (2026-06-24)| src/components/review-form.tsx                                       | target_type, target_id                                      |
| signup_attempt     | Câblé             | src/app/inscription/page.tsx:38,52                                   | method, success                                             |
| login_attempt      | Câblé             | src/app/connexion/page.tsx:30,44                                     | method, success                                             |

Note : `quote_request_submit` et `review_submit` sont des clic sur un lien `mailto:` (pas encore
de vrai formulaire en ligne). L'event se déclenche au clic sur "Ecrire a hello@agoris.io" /
"Envoyer mon avis par email". Quand ces flows seront branchés sur de vraies APIs, le tracking
devra être déplacé sur la confirmation de soumission (réponse 200).

---

## 2. Key Events (Conversions)

Dans GA4 : Admin > Events > cocher "Marquer comme événement clé" pour chaque event ci-dessous.

| Event                | Raison métier                                                    |
|----------------------|------------------------------------------------------------------|
| alert_subscribe      | Intention de suivi fort : l'utilisateur veut être rappelé        |
| contact_form_submit  | Lead direct (organisateur ou prestataire potentiel)              |
| quote_request_submit | Conversion commerciale : mise en relation prestataire            |
| provider_drawer_open | Signal d'intention exposant (étape clé de l'entonnoir)           |
| search_submit        | Activation : premier geste de découverte du catalogue            |

Ne pas marquer `signup_attempt` et `login_attempt` comme Key Events : ce sont des events
diagnostiques (le param `success` booléen permet de filtrer les échecs).

---

## 3. Exploration Entonnoir — "Parcours découverte vers intention"

Dans GA4 : Explorer > Entonnoir (Funnel Exploration).

Nom suggéré : "Découverte vers intention exposant"

Etapes :
1. page_view (event GA4 automatique)
2. search_submit
3. provider_drawer_open OU alert_subscribe (étape avec condition OR)

Configuration :
- Type : Entonnoir ouvert (open funnel) — les utilisateurs peuvent entrer à n'importe quelle étape
- Fenêtre de temps : 30 jours glissants
- Segmentation optionnelle : comparer "mobile" vs "desktop" (dimension Device Category)

Lecture attendue : taux de conversion search_submit → provider_drawer_open. Si ce taux est faible,
les fiches prestataires ne convainquent pas après la recherche.

---

## 4. Audience "Intention exposant"

Dans GA4 : Admin > Audiences > Nouvelle audience.

Nom : "Intention exposant"
Condition (OR) :
- L'utilisateur a déclenché l'event `provider_drawer_open` dans les 30 derniers jours
- OU l'utilisateur a déclenché l'event `quote_request_submit` dans les 30 derniers jours

Durée d'appartenance : 30 jours.
Utilisation : remarketing Google Ads, segmentation dans les rapports Explorer, export vers PostHog.

---

## 5. Dimensions personnalisées (Custom Dimensions)

Dans GA4 : Admin > Custom Definitions > Custom Dimensions.
Scope : Event pour tous.

| Nom de la dimension      | Nom de paramètre GA4 | Events concernés                        |
|--------------------------|----------------------|-----------------------------------------|
| Filtre appliqué          | filter_name          | filter_change                           |
| Valeur du filtre         | filter_value         | filter_change                           |
| Slug du salon            | salon_slug           | provider_drawer_open, alert_subscribe   |
| Slug destination         | destination          | salon_outbound_click, venue_outbound_click |
| Requête de recherche     | query                | search_submit                           |
| Type de cible (avis)     | target_type          | review_submit                           |
| Nom du prestataire       | provider_name        | quote_request_submit                    |

Ces dimensions permettent de croiser les events avec les données métier dans les rapports Explorer.
Exemple : "Quels sont les filter_name les plus utilisés ?" ou "Quels salon_slug génèrent le plus de provider_drawer_open ?"

---

## 6. Paramétrage engagement (hors events custom)

### Sessions engagées
GA4 définit une session engagée si l'une des conditions suivantes est vraie :
- Durée > 10 secondes
- 2 pages vues ou plus
- Au moins 1 événement de conversion

Pour Agoris, ce seuil par défaut est adapté. Ne pas modifier.

### Rétention des données
Admin > Data Settings > Data Retention.
Passer de 2 mois (défaut) à 14 mois pour avoir de l'historique inter-saison (les salons sont annuels).

### Signaux Google
Admin > Data Collection > Google Signals : activer si pas encore fait.
Permet le cross-device et les audiences remarketing.

### Taux de rebond
Le taux de rebond GA4 est l'inverse du taux de sessions engagées. Avec les events custom câblés,
un utilisateur qui fait une recherche (search_submit) sera automatiquement compté comme session
engagée, ce qui reflète mieux la réalité qu'un simple temps passé sur la page.

---

## 7. Rapport de suivi recommandé (hebdomadaire)

Dans GA4 : Rapports > Explorer > Table simple.

Lignes : event_name
Colonnes : Nombre d'events (7 derniers jours vs 7 jours précédents)
Filtre : Inclure uniquement les events de l'union AgorisEvent (exclure les events GA4 automatiques
comme scroll, click, session_start, etc.)

Ce rapport donne la santé hebdomadaire de l'engagement en une vue.
