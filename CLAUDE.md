# CLAUDE.md — Agoris

> Le forum des salons | agoris.io
> "Le bon salon ne se trouve pas. Il se reconnaît."

---

## Contexte projet

Agoris est le forum des salons professionnels : un annuaire intelligent ciblant les exposants B2B qui cherchent les bons salons pour leur développement commercial. Le projet combine une expérience "Editorial Tech" (autorité institutionnelle + interface SaaS moderne), un écosystème de prestataires locaux (standistes, traiteurs, AV, hébergement), et du contenu éditorial expert. Agoris audite, classe et certifie les salons B2B par filière.

Le POC démarre sur le marché français (~1 200 à 1 375 salons/an). L'internationalisation (Allemagne, UK, Benelux) viendra en Phase 2 une fois le modèle validé.

### Pourquoi la France d'abord

- La marketplace prestataires est intrinsèquement locale : un standiste à Lyon ne sert pas un salon à Dubaï
- Nicolas a son réseau de prestataires (stands, impression) en France
- Le SEO est ciblé : une langue, un domaine, des requêtes bien identifiées
- Les sources de données sont accessibles : Unimev, CCI, sites des parcs d'expositions

### Positionnement concurrentiel

Les concurrents (10times.com, EventsEye.com, ExpoDataBase, TradeFairDates) partagent les mêmes défauts : interfaces surchargées ou datées, aucun écosystème de prestataires, zéro contenu éditorial à valeur ajoutée. Le vrai différenciateur de Agoris est la marketplace de prestataires locaux rattachée à chaque salon, combinée à du contenu éditorial expert que les annuaires purement data ne peuvent pas répliquer.

---

## Direction UX : "The Clean Cut" — Identité Agoris

### Philosophie : divulgation progressive

Le principe directeur est "Show me the gold, hide the dirt." L'utilisateur (marketeur B2B, CRO, directeur commercial) ne veut pas un annuaire, il veut un outil d'aide à la décision. On affiche peu de choses, mais des choses de qualité.

Trois niveaux d'information :

- **Niveau 1 (immédiat)** : l'essentiel vital : dates, lieu, taille, badge Agoris Certified, tags éditoriaux
- **Niveau 2 (au clic)** : détails logistiques, stats détaillées, contenu éditorial
- **Niveau 3 (action)** : marketplace de prestataires (drawer latéral, pas une page séparée)

### Identité visuelle : "Prune & Ocre Saturé"

L'utilisateur doit avoir l'impression de consulter une institution qui audite et certifie, pas un annuaire. Le Prune porte la voix institutionnelle (structure, autorité). L'Ocre n'arrive qu'en ponctuation business (certification, score, KPI, hover). Le Sable Doux crée le confort de lecture.

**Palette de couleurs (3 tokens + 1 énergie) :**

| Rôle | Nom | Code | Usage | Part |
|------|-----|------|-------|------|
| Fond principal | Sable Doux | `#EEE7D4` | Fond de page, arrière-plans | 80% |
| Structure | Prune Profond | `#3B1F33` | Wordmark, headlines, texte courant, bordures | 18% |
| Énergie | Ocre Saturé | `#E2A02E` | Badges certifiés, scores, KPI, hover. JAMAIS plus de 2% de la surface | 2% |
| Cartes / fiches | Papier | `#FFFFFF` | Cartes salon, fiches, surfaces de contenu | variable |

**Règles d'application strictes :**

- **Prune = institution.** Wordmark, points externes du signe, headlines, texte courant, bordures. Le Prune porte la voix institutionnelle.
- **Ocre = signal.** Centre du signe, badge "Agoris Certified", score en exergue, KPI, hover. La couleur des affaires qui se concluent. N'apparaît que pour valider une décision ou souligner une performance.
- **JAMAIS d'Ocre en mélange à parts égales.** L'Ocre ne couvre jamais plus de 2% d'un écran. C'est l'or sur le drapeau, pas le drapeau.
- **ACCESSIBILITÉ CRITIQUE :** L'Ocre `#E2A02E` sur fond Sable `#EEE7D4` a un ratio de contraste d'environ 2.3:1, bien en dessous du WCAG AA (4.5:1). L'Ocre ne peut PAS être utilisé pour du texte sur fond Sable. Utiliser uniquement : (1) en fond de badge avec texte Prune dessus, (2) sur fond Prune, (3) comme accent décoratif non-textuel. Pour tout texte, utiliser Prune sur Sable ou Prune sur Papier.

**Typographie :**

| Usage | Police | Détails |
|-------|--------|---------|
| Display / titres | Fraunces | Serif de caractère, variable weight. Taille 144/64/64 selon contexte |
| Texte courant / labels | Inter | Sans-serif géométrique. 400 weight, tailles 16/26 |
| Chiffres / stats importants | Fraunces semi-bold | Taille plus grande, en Ocre si sur fond Prune |

Le contraste Serif historique (Fraunces) + Sans-serif tech (Inter) est la signature visuelle d'Agoris.

**Configuration Fraunces (next/font/google) :** Déclarer explicitement les axes variables `{ axes: ['SOFT', 'WONK', 'opsz'] }` pour éviter de charger des subsets inutiles et préserver le LCP.

**Tone of voice :** posé, arbitral. Photos : clair-obscur, architectures. Pas de stock photo générique.

### Composant clé : la Carte Salon

Chaque salon dans les listes est présenté dans une carte fond Papier (#FFFFFF) contenant :

1. **Tag sectoriel** : badge avec couleur désaturée (ex: "Industrie / Manufacturing"), discret
2. **Badge "Agoris Certified"** : en Ocre, uniquement si le salon est certifié par l'équipe
3. **Nom et édition** : en Fraunces, ex: "Global Industrie 2026 · Lyon Eurexpo"
4. **Triptyque vital** : Dates | Visiteurs | Exposants (en Inter, taille réduite)
5. **Stats clés** : nombre de prestataires accrédités (donnée vérifiable)

**IMPORTANT — Ce qu'on n'affiche PAS au POC :**

- Pas de "Score Agoris" chiffré (94/100 etc.) tant qu'il n'y a pas de méthodologie publiée et un comité éditorial réel. Le badge "Agoris Certified" (binaire : vérifié ou non) suffit.
- Pas de "CA médian généré" ou de données financières non sourcées. Si la donnée n'existe pas de manière vérifiable, elle ne s'affiche pas.
- Pas de micro-stats au hover ("+12% de ROI") : données non disponibles et hover inexistant sur mobile.

Le scoring et les données financières enrichies viendront en Phase 3 quand le comité éditorial et les données le permettront.

### Couleurs sectorielles (badges)

Les 15 couleurs sectorielles pour les tags de catégorie doivent être **désaturées** (tonalités "sourdes") pour ne pas entrer en conflit avec le Prune et l'Ocre. Palette de badges à définir, mais principe : pastels chauds, jamais saturés, texte Prune dessus.

### Sections à fond Prune ("Dark Mode Business")

Utiliser le fond Prune Profond (#3B1F33) avec texte Sable/Papier pour les sections à forte densité de données : tableaux comparatifs, blocs de prix, sections éditoriales "deep dive". Cela crée un contraste visuel qui signale "ici, on parle sérieusement". Usage ponctuel, pas de dark mode complet.

### Fiche salon : le modèle "One-Pager"

La fiche salon n'est PAS une page de 3 km. C'est une vue structurée en blocs clairs avec marges généreuses :

1. **Header ("Le Pitch")** : une phrase de 10-15 mots en Fraunces qui définit le salon + logo + dates + lieu + badge Agoris Certified si applicable
2. **Bloc "Quick Stats"** : chiffres VÉRIFIABLES uniquement (nombre d'exposants, nombre de visiteurs, surface, prestataires accrédités). Chiffres en Fraunces semi-bold. Si la donnée n'existe pas, ne pas l'afficher. Fond Sable Doux.
3. **Bloc visuel** : image de couverture unique de qualité. Filtre colorimétrique chaud optionnel pour cohérence. Placeholder élégant (fond Sable + pattern points Agoris) si pas de photo.
4. **Bloc "Essentiel"** : description éditoriale en Inter, secteurs, fréquence, site officiel, accès transport
5. **Bouton "Organiser mon stand"** : en Ocre sur fond Prune. Ouvre un drawer latéral sur desktop, un bottom sheet (ou modal plein écran) sur mobile. C'est le point de monétisation. Le composant `ProviderDrawer` existant doit être audité pour sa responsivité mobile.
6. **Bloc "Avis d'exposants"** : avis vérifiés, note moyenne
7. **Bloc "Salons similaires"** : recommandations par secteur/géographie

### Recherche : simple et efficace

Au POC, PAS de recherche par objectif ("Notoriété / Leads / Networking"). La recherche reste factuelle :

- Barre de recherche centrale proéminente, fond Papier, bordure Prune fine
- Filtres principaux : secteur + ville/région + période (mois ou trimestre)
- Filtre secondaire (moins proéminent, en bas) : catégorie (pro / grand public / congrès / autre). Déjà livré en P1.C, conserver.
- Résultats en cartes uniformes (pas de grille asymétrique au POC), triables par date ou par pertinence
- Espacement généreux entre les cartes (marges de sécurité : la rareté crée la valeur)

### Principes UX non négociables

- **Zéro surcharge cognitive** : si une information n'aide pas à la décision, elle n'apparaît pas au Niveau 1
- **Calm Tech** : le site ne crie pas, il informe. Palette Prune/Sable, espacement généreux, pas d'animations gratuites
- **Mobile-first absolu** : la carte salon et la fiche salon doivent être irréprochables sur mobile (cas d'usage principal : marketeur en déplacement)
- **Curateur, pas collecteur** : afficher peu mais bien. Un salon sans données fiables a un placeholder propre, pas un champ vide
- **Marges généreuses** : le whitespace (sablespace ?) est un choix éditorial, pas un vide à combler

---

## Co-construction : deux contributeurs

**CONTRAINTE CRITIQUE.** Ce projet est co-construit par Julien Zakoian et Nicolas. Les deux contribuent au code en parallèle.

### Workflow Git

- **Repo** : GitHub (privé)
- **Branches** : `main` (production), `develop` (intégration), feature branches
- **Nommage des branches** : `feat/[initiales]-[description]`, `fix/[initiales]-[description]`, `chore/[initiales]-[description]`
  - Exemples : `feat/jz-search-filters`, `feat/nc-fiche-salon`
- **Commits** : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Merges** : PR obligatoire vers `develop`, review croisée quand possible
- **CI/CD** : GitHub Actions (lint + build + déploiement auto sur Vercel au merge dans `main`)

---

## Stack technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | Next.js 14+ (App Router) | SSR/SSG pour le SEO, React pour l'UX, déploiement Vercel natif |
| Langage | TypeScript | Typage fort, meilleure collaboration à deux |
| Base de données | Supabase (PostgreSQL) | Auth intégrée, API auto, temps réel, tier gratuit généreux |
| Accès données | Supabase JS client (direct) | PAS de Prisma. Supabase JS + RLS + Edge Functions couvrent nos besoins |
| Styling | Tailwind CSS v4 | Rapid prototyping, design system cohérent |
| UI Components | shadcn/ui (Base UI) | Composants accessibles, personnalisables, pas de vendor lock-in |
| Déploiement | Vercel | Zero-config pour Next.js, preview branches, analytics |
| Search | PostgreSQL full-text (puis Algolia si besoin) | Commencer simple, scaler si nécessaire |
| Auth | Supabase Auth (OAuth Google + email) | Intégration native, pas de code custom |
| Storage images | Supabase Storage ou Cloudinary | Upload fiches salons, logos prestataires |
| Analytics | Vercel Analytics + PostHog | Web analytics + product analytics (events) |
| i18n | next-intl | Prêt pour l'international dès le départ |
| Blog | MDX (dans /content) | Contenu éditorial intégré au repo |

---

## Structure du repo

```
/
├── src/
│   ├── app/              # App Router (pages, layouts, routes API)
│   ├── components/       # Composants réutilisables
│   ├── lib/              # Utilitaires, helpers, configs
│   ├── types/            # Types TypeScript partagés
│   └── styles/           # Globals CSS, Tailwind config
├── public/               # Assets statiques
├── content/              # Contenu blog (MDX)
├── supabase/             # Migrations SQL, seeds, Edge Functions
├── scripts/              # Scripts utilitaires (scraping, import data)
├── CLAUDE.md             # Ce fichier
├── CONTRIBUTING.md       # Guide de contribution
├── .env.example          # Variables d'environnement
└── README.md             # Documentation projet
```

---

## Commandes de développement

```bash
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run lint             # Linter TypeScript + ESLint
npx supabase start       # Démarrer Supabase local (Docker)
npx supabase db reset    # Réinitialiser la base locale avec seeds
npx supabase migration new [name]  # Créer une migration SQL
npx supabase db push     # Pousser les migrations vers la base distante
```

---

## Modèle de données (POC)

### Salon (table: salons)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Identifiant unique |
| slug | VARCHAR UNIQUE | URL-friendly SANS année (ex: sial-paris). Convention 2026-06-12 : la fiche est la fiche canonique de la série, l'année vit dans edition_year/dates/seo_title. Le slug ne roule jamais. Un slug avec année n'est admis que pour une archive d'édition passée coexistant avec la canonique. |
| name | VARCHAR | Nom officiel du salon |
| edition_year | INT | Année de l'édition |
| description | TEXT | Description éditoriale (pas le copier-coller du site officiel). Passe éditoriale LLM + review humaine prévue en S5+. |
| *(secteurs)* | *(table salon_sectors, M:N)* | Relation many-to-many existante via table de jointure. NE PAS remplacer par un VARCHAR[]. |
| category | ENUM | pro, grand_public, congres, autre. Filtre existant (P1.C), conserver. |
| category_to_confirm | BOOLEAN | Flag admin pour vérification catégorie. Conserver. |
| start_date / end_date | DATE | Dates de l'édition |
| dates_confirmed | BOOLEAN | Flag indiquant si les dates sont confirmées par l'organisateur (P1.D). Conserver. |
| city | VARCHAR | Ville |
| venue | VARCHAR | Lieu (ex: Paris Nord Villepinte) |
| venue_lat / venue_lng | FLOAT | Coordonnées géo (pour carte et proximité) |
| country | VARCHAR (ISO 3166) | Pays (FR pour le POC) |
| website_url | VARCHAR | Site officiel du salon |
| organizer_name | VARCHAR | Nom de l'organisateur |
| organizer_email | VARCHAR | Contact organisateur |
| frequency | ENUM | annuel, bisannuel, ponctuel |
| estimated_exhibitors | INT (nullable) | Nombre d'exposants estimé |
| estimated_visitors | INT (nullable) | Nombre de visiteurs estimé |
| is_premium | BOOLEAN | Fiche premium (organisateur payant) |
| is_agoris_certified | BOOLEAN | Badge "Agoris Certified". Critère POC (décision manuelle Nicolas) : dates confirmées, lieu confirmé, nb exposants sourcé, description éditoriale rédigée. Premier batch : 20-30 salons max. La rareté du badge en fait la valeur. |
| status | ENUM | draft, published, cancelled, postponed |
| logo_url | VARCHAR | Logo du salon |
| cover_image_url | VARCHAR | Image de couverture |
| created_at / updated_at | TIMESTAMP | Métadonnées |
| seo_title / seo_description | VARCHAR | Méta SEO custom |

### Prestataire (table: providers)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Identifiant unique |
| slug | VARCHAR UNIQUE | URL-friendly |
| company_name | VARCHAR | Raison sociale |
| category | ENUM | standiste, traiteur, av_technique, photographe, transport, hebergement, autre |
| description | TEXT | Présentation du prestataire |
| city | VARCHAR | Ville de base |
| coverage_radius_km | INT | Rayon d'intervention |
| website_url / phone / email | VARCHAR | Coordonnées |
| logo_url | VARCHAR | Logo |
| is_verified | BOOLEAN | Vérifié par l'équipe |
| subscription_tier | ENUM | free, premium |
| avg_rating | FLOAT | Note moyenne (calculée) |
| review_count | INT | Nombre d'avis |

### Avis (table: reviews)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Identifiant unique |
| target_type | ENUM | salon, provider |
| target_id | UUID (FK) | Référence salon ou prestataire |
| user_id | UUID (FK) | Auteur de l'avis |
| rating | INT (1-5) | Note |
| title | VARCHAR | Titre de l'avis |
| body | TEXT | Contenu |
| role | ENUM | exposant, visiteur, organisateur |
| is_verified | BOOLEAN | Avis vérifié |

### Lien Salon-Prestataire (table: salon_providers)

Table de jointure : associe des prestataires recommandés à chaque salon. Champ `is_featured` pour les prestataires premium mis en avant sur la fiche.

### Tags éditoriaux (table: salon_tags)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Identifiant unique |
| salon_id | UUID (FK) | Référence salon |
| label | VARCHAR | Texte du tag (ex: "Fort taux de décideurs", "Rising Star 2026") |
| category | ENUM | audience, trend, value, sector |
| color | VARCHAR | Code couleur du badge (optionnel) |

Les tags sont curatés manuellement par l'équipe. Pas de scoring automatique au POC.

---

## Architecture des pages

| Route | Page | Contenu clé |
|-------|------|-------------|
| `/` | Accueil | Barre de recherche, salons à venir, secteurs populaires, CTA |
| `/salons` | Liste des salons | Filtres (secteur, ville, mois), tri, pagination, vue carte optionnelle |
| `/salons/[slug]` | Fiche salon | Infos complètes, prestataires associés, avis, CTA contact organisateur |
| `/secteurs/[slug]` | Page secteur | Tous les salons d'un secteur, contenu éditorial, SEO longue traîne |
| `/villes/[slug]` | Page ville | Tous les salons d'une ville, carte, prestataires locaux |
| `/prestataires` | Annuaire prestataires | Recherche par catégorie, ville, avis |
| `/prestataires/[slug]` | Fiche prestataire | Présentation, avis, salons couverts, CTA contact |
| `/blog` | Blog / Guides | Contenu éditorial expert (guides exposants, benchmarks) |
| `/blog/[slug]` | Article | Contenu long-form, SEO éditorial |
| `/a-propos` | A propos | Présentation du projet, équipe, proposition de valeur |
| `/contact` | Contact | Formulaire contact, CTA organisateurs et prestataires |

### Fiche salon : le coeur du produit

Voir la section "Direction UX : The Clean Cut — Identité Agoris" pour la structure détaillée. En résumé, la fiche suit le modèle "One-Pager" avec divulgation progressive :

1. Header (pitch en Fraunces + logo + dates + lieu + badge Agoris Certified)
2. Quick Stats sur fond Sable (chiffres vérifiables uniquement, en Fraunces semi-bold)
3. Bloc visuel (image de couverture avec colorimétrie chaude, placeholder pattern Agoris si absente)
4. Essentiel (description éditoriale en Inter, secteurs, accès, site officiel)
5. Bouton "Organiser mon stand" (Ocre sur Prune, ouvre drawer latéral prestataires)
6. Avis d'exposants
7. Salons similaires

Le drawer prestataires est le point de monétisation principal de la fiche.

---

## Stratégie SEO

### Architecture SEO-first

- Une page par salon = des centaines de pages indexables dès le lancement (objectif : 300+ salons au POC)
- Pages secteurs et pages villes pour les requêtes type "salons agroalimentaire France 2026", "salons professionnels Lyon"
- Blog éditorial pour les requêtes transactionnelles : "budget stand salon professionnel", "comment choisir un salon B2B", "ROI salon professionnel"
- Schema.org markup (Event, Organization, Review) sur chaque fiche
- Sitemap XML dynamique généré automatiquement
- Meta title/description dynamiques mais personnalisables par fiche
- URLs propres et pérennes : `/salons/sial-paris` (sans année : l'URL capitalise l'autorité d'édition en édition), `/secteurs/agroalimentaire`, `/villes/lyon`

### Contenu éditorial différenciant

Le vrai levier SEO n'est pas l'annuaire (10times a 15+ ans d'avance). C'est le contenu éditorial expert :

- Guides sectoriels : "Les 15 salons incontournables pour l'agroalimentaire en 2027"
- Comparatifs de lieux d'exposition : superficie, coût, accessibilité
- Guides pratiques : "Préparer son stand en 30 jours : checklist complète"
- Retours d'expérience exposants (UGC éditorial)
- Benchmarks de coûts : prix de stands, coût moyen par m²

---

## Plan d'exécution

### État actuel (déjà livré)

- Projet Next.js + Supabase + Tailwind v4 + shadcn (Base UI) fonctionnel et déployé sur Vercel
- 196 fiches salons en base
- Pages : accueil, liste salons avec filtres (secteur, ville, période, catégorie P1.C), fiche salon
- Auth Supabase, composant ProviderDrawer existant
- Champs existants à conserver : category, category_to_confirm, dates_confirmed

### Rebrand Agoris : plan en 5 sessions

| Session | Scope | Bénéfice |
|---------|-------|----------|
| S1 : Design tokens & typo | Palette Sable/Prune/Ocre/Papier dans Tailwind config, fonts Fraunces + Inter, refonte global layout (nav, footer), placeholder pattern Agoris | Identité visuelle posée, base pour tout le reste |
| S2 : Carte salon & page liste | Refonte SalonCard (modèle épuré), liste /salons avec marges généreuses, badges Agoris Certified, tags sectoriels désaturés | Le composant le plus visible utilisateur |
| S3 : Fiche salon One-Pager | Refonte /salons/[slug] : Header pitch + Quick Stats vérifiables + Bloc visuel + Essentiel + Drawer prestataires (bottom sheet mobile) + Avis + Similaires | Le coeur du produit |
| S4 : Pages secteurs / villes / homepage | Refonte homepage (calm tech), pages /secteurs/[slug] et /villes/[slug] enrichies | SEO + pages d'atterrissage |
| S5 : Migration is_agoris_certified + admin | Migration DB, sélection manuelle premier batch certified (~20-30 salons), toggle admin, harmonisation styles admin | Permet d'utiliser le badge |

### Chantiers parallèles (hors sessions principales)

- Passe éditoriale des descriptions : script LLM (Claude API) avec ton éditorial défini + review humaine Nicolas
- Long-tiret cleanup : script grep + replace contrôlé sur les descriptions existantes
- Audit responsive du ProviderDrawer (desktop : drawer latéral, mobile : bottom sheet)
- Introduction branche develop + workflow PR

### Phase ultérieure : Croissance

- Espace organisateur : "Réclamez votre fiche", dashboard de stats, upgrade Premium
- Espace prestataire : gestion profil, réponse aux avis, analytics
- Recherche avancée : filtres multi-critères, recherche géographique (carte)
- Enrichissement éditorial : guides, comparatifs, contenu SEO longue traîne
- Partenariats fédérations (Unimev, CCI)
- Outreach organisateurs : démarrage de la commercialisation Premium
- Score Agoris chiffré (quand méthodologie + comité éditorial + données le permettent)

---

## Conventions de code

### TypeScript

- `strict: true` dans tsconfig. Pas de `any` sauf cas exceptionnel documenté.
- Composants React : functional components uniquement, hooks, pas de classes.
- Imports : chemins relatifs pour les composants locaux, alias `@/` pour `src/`.

### Nommage

- Fichiers : `kebab-case` (ex: `salon-card.tsx`)
- Composants : `PascalCase` (ex: `SalonCard`)
- Variables et fonctions : `camelCase`, en anglais
- Branches : `feat/[initiales]-[description]`
- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

### Contenu utilisateur

- Toujours inclure les accents français dans tout texte destiné à l'utilisateur (é, è, ê, à, ù, ç, etc.)
- Ne jamais utiliser de longs tirets (—) dans le contenu. Remplacer par des deux-points, points ou virgules.
- Commentaires dans le code en français. Noms de variables et fonctions en anglais.

### Tests

- Vitest pour les unit tests
- Playwright pour les E2E (Phase 2+)

### Design tokens (Tailwind)

Configurer dans `tailwind.config.ts` :

```js
colors: {
  sable: '#EEE7D4',       // Fond principal (80%)
  prune: '#3B1F33',       // Structure, texte, institution (18%)
  ocre: '#E2A02E',        // Énergie, badges, CTA (2% max)
  papier: '#FFFFFF',      // Cartes, fiches
}
```

- Variables CSS correspondantes : `--color-sable`, `--color-prune`, `--color-ocre`, `--color-papier`
- Font display/titres : `font-serif` → Fraunces (via next/font Google Fonts, variable weight)
- Font body : `font-sans` → Inter (via next/font Google Fonts)
- **WCAG :** ne JAMAIS utiliser Ocre comme couleur de texte sur fond Sable. Ocre uniquement en fond de badge (texte Prune dessus) ou sur fond Prune.

---

## Règles strictes pour Claude Code

1. **Ne JAMAIS modifier la base de données sans migration SQL.** Toujours créer une migration via `npx supabase migration new [name]`.
2. **Ne JAMAIS hardcoder d'URL ou de clés.** Toujours utiliser les variables d'environnement.
3. **Toujours créer les composants dans `src/components/`** et les réutiliser.
4. **Privilégier le SSG** (`generateStaticParams`) pour les pages salon et secteur.
5. **Chaque page doit avoir ses `metadata` exportées** (title, description, openGraph).
6. **Ne jamais supprimer de code existant** sans explication claire.
7. **Pas de données fabriquées ou estimées dans les seeds** : chaque salon doit correspondre à un événement réel vérifiable.
8. **En cas de doute sur le scope, demander avant d'implémenter.**
9. **Mobile-first** : tout composant doit être responsive, mobile d'abord.
10. **Performance** : temps de chargement cible < 2s sur mobile 4G.
11. **WCAG Ocre :** ne JAMAIS générer `text-ocre` sur fond `bg-sable`. L'Ocre ne sert que pour : fond de badge (texte Prune dessus), texte sur fond Prune, accents décoratifs non-textuels. Envisager un lint rule ou un utilitaire Tailwind pour enforcer.
12. **PAS de Prisma.** Utiliser exclusivement le client Supabase JS pour l'accès données. Ne jamais introduire Prisma dans le projet.

---

## Variables d'environnement (.env.example)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Agoris

# Analytics (Phase 2)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Maps (Phase 2)
NEXT_PUBLIC_MAPBOX_TOKEN=
```

---

*Document confidentiel : Julien Zakoian & Nicolas | Avril 2026*
