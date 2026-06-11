# SEO : maillage interne + correctifs techniques (2026-06-11)

Audit via skill seo-geo. Base technique saine (canonicals 80%, sitemap filtré qualité, JSON-LD Event/Place/Breadcrumb). Chantier : maillage interne entre fiches + trous techniques.

## Maillage interne

- [x] Footer : ajouter lien /secteurs dans la colonne Produit (absent, alors que Salons/Lieux/Prestataires/Blog y sont)
- [x] Fiche salon : ville cliquable vers /villes/[slug] + breadcrumb à 3 niveaux (Salons / Ville / Salon, visuel + JSON-LD)
- [x] Fiche salon : bloc "Explorer" sous Salons similaires (liens hub : tous les salons du secteur, tous les salons de la ville)
- [x] Page ville : bloc secteurs représentés (badges → /secteurs/[slug])
- [x] Page ville : bloc lieux d'exposition de la ville (→ /lieux/[slug]) (nouvelle query getVenuesByCity)
- [x] Page ville : bloc autres villes principales (→ /villes/[slug], pas d'index /villes donc maillage horizontal indispensable)
- [x] Page secteur : bloc villes de la filière (→ /villes/[slug]) + autres filières (→ /secteurs/[slug])
- [x] Page lieu : lien vers la page ville (/villes/[slug])

## Correctifs techniques

- [x] Canonical manquant : /contact, /mentions, /confidentialite, /cookies
- [x] Bug title /contact : "| Agoris" en dur + template root = doublon
- [x] Sitemap : ajouter pages villes (seuil : ≥ 3 salons publiés), pages légales + contact (priority 0.3)
- [x] Pages villes : robots conditionnel (index si ≥ 3 salons, sinon noindex,follow) : cohérent avec la politique qualité du site (salons MDX only, lieux riches only)
- [x] Pages villes : meta description enrichie (nb de salons, promesse)
- [x] JSON-LD ItemList sur pages villes et secteurs (GEO : listes citables par les LLMs)

## Vérification (definition of done)

- [x] npm run build OK : 565 pages SSG, 0 erreur. npm run lint : 0 erreur (32 warnings préexistants)
- [x] Spot-check HTML rendu (serveur prod local, port 3457) :
  - Fiche salon big-data-ai-paris-2026 : 3 liens /villes/paris (breadcrumb + header + explorer), 2 liens /secteurs/tech-numerique, BreadcrumbList JSON-LD à 4 niveaux avec la ville
  - /villes/lyon : 11 badges secteurs, lien lieu, 8 autres villes, ItemList JSON-LD
  - /secteurs/btp-construction : 6 liens villes, bloc autres filières, ItemList JSON-LD
  - /lieux/paris-expo-porte-de-versailles : lien /villes/paris
  - Canonicals présents sur /contact, /mentions, /cookies, /confidentialite ; title contact sans doublon
  - Sitemap : 176 URLs dont pages villes (lyon, paris, nantes, ...) + 4 pages annexes

## Review

- Décision (hypothèse posée, ajustable) : seuil d'indexabilité des pages ville fixé à 3 salons publiés (CITY_INDEX_MIN_SALONS dans lib/config.ts). En dessous : noindex,follow + hors sitemap, pour éviter le thin content. Cohérent avec la politique existante (salons indexables si MDX, lieux si fiche riche, secteurs si MDX).
- Constat data (hors scope, à traiter côté DB) : le sitemap expose /villes/munich (salons étrangers en base ?) et /villes/villepinte distinct de Paris. À harmoniser dans les données salons.city.
- Le canonical homepage rendu sans trailing slash est une normalisation Next (trailingSlash:false) : équivalent strict pour Google sur la racine, pas d'action.
- Pages secteur : la liste des villes est dérivée des salons affichés (pageSize 20 existant). Si une filière dépasse 20 salons, les villes du reste ne sont pas listées : limitation acceptée au POC.

---

# Cleanup data salons.city + boucles redirects (2026-06-11)

Suite du constat data de l'audit SEO du matin (/villes/villepinte et /villes/munich dans le sitemap).

## Décisions

- [x] Salons étrangers (16 publiés, dont 3 à Munich) : décision Julien = ne rien changer, on assume l'international, /villes/munich reste indexée
- [x] Convention city="Paris" pour le parc Paris Nord Villepinte (le lieu précis est porté par venue_id -> /lieux/paris-nord-villepinte)

## Exécution (script scripts/diag-city-cleanup-villepinte.ts, 10 lignes)

- [x] city Villepinte -> Paris : japan-expo-paris-2026, intermat-paris-2027, comic-con-france-2026, jec-world-2026, maison-objet-paris-2026, sitl-2026
- [x] intermat-paris-2027 : venue_id null -> Paris Nord Villepinte
- [x] midest-2026 : venue texte "Paris Nord Villepinte" -> "Eurexpo Lyon" (alignement migration cohorte4 GI Lyon 2027)
- [x] "Doublons" /lieux/paris-nord-villepinte : PAS des doublons mais des paires d'éditions.
  - jec-world-paris-2026 = édition 2027 (2-4 mars 2027, source jec-world.events) sous slug 2026, shadowée par le 301 du 1er juin -> slug renommé jec-world-paris-2027 + end_date corrigée
  - maison-et-objet-paris-2026 = édition janvier 2026 (Pulse = édition septembre, confirmé maison-objet.com) ; passée, shadowée par le 301 -> draft, redirect conservé
- [x] Boucles de redirects découvertes et corrigées dans next.config.ts : sia-paris-2026, salon-mondial-du-tourisme-paris-2026, santexpo-paris-2026 (entrées cohorte 5 du 1er juin en conflit avec les inverses du 4 juin, ERR_TOO_MANY_REDIRECTS confirmé en prod) + 1 entrée dupliquée simi retirée

## Reste à faire (hors scope, tracké)

- [x] Même famille slug/édition à auditer : sia-paris-2026 (dates 2027), solutions-rh-paris-2026 (dates 2027, shadowée), who-s-next-paris-2026 (édition janvier shadowée) -> traité dans le chantier ci-dessous

---

# Cohérence slugs / redirects : fiches publiées shadowées (2026-06-11, soir)

Suite du "Reste à faire" du cleanup Villepinte. Détection systématique via le nouveau scripts/diag-redirect-coherence.ts (lecture seule) : 6 fiches publiées shadowées par un 301 de next.config.ts, 0 boucle restante, 23 fiches publiées avec slug à année désynchronisée de edition_year.

## Décisions (toutes vérifiées sur sources officielles, agents web du 2026-06-11)

- [x] Pas de renommage de masse des slugs désynchronisés non shadowés : l'éditorial de global-industrie-lyon-2025 documente le slug legacy comme "conservé pour stabilité URL" (décision éditoriale), et la vérification web montre que cette famille cache des erreurs de données plus profondes (cf. follow-ups). On ne renomme que les fiches shadowées roulées + sia (cas briefing).
- [x] Précédents appliqués : fiche shadowée portant l'édition suivante -> renommage slug + 301 (précédent jec-world) ; fiche shadowée édition passée ou doublon de marque -> draft, redirect conservé (précédents maison-et-objet, europain).

## Exécution (script scripts/diag-redirect-slug-cleanup.ts + next.config.ts)

- [x] sia-paris-2026 -> slug sia-paris-2027 (SIA 2027 : 27/02-07/03/2027 confirmé salon-agriculture.com). Redirect sia-paris-2027 -> sia-paris-2026 INVERSÉ dans next.config.ts (sinon boucle).
- [x] solutions-rh-paris-2026 -> slug solutions-rh-paris-2027 (même salon que solutions-rh-2026, organisateur Infopromotions ; édition 2027 : 9-10/06/2027 confirmé solutions-ressources-humaines.fr ; édition 2026 passée : 8-9/04/2026). Redirect existant conservé (vieille URL -> fiche éditoriale 2026).
- [x] who-s-next-paris-2026 (édition janvier 2026, passée) -> draft + correction dates : 17-19/01/2026 (wsn-events.com, la base disait 24-26/01 à tort). Redirect conservé.
- [x] innorobo-paris-2026 -> draft : fiche fantôme, le salon autonome a disparu (dernière édition 2018, innorobo.com figé ; seul Innorobo by SIDO existe, 16-17/09/2026 Lyon). Redirect conservé.
- [x] sandwich-and-snack-show-2026 -> draft : rebrand "Snack Show" confirmé (sandwichshows.com 301 vers snackshow.com), doublon de marque ; l'édition 2027 (24-25/03/2027 confirmée) sera portée par le roll de snack-show-2026. Redirect conservé.
- [x] solscope-lyon-2026 -> draft : pas d'édition 2026, salon biennal années impaires (2025, 2027, solscope.fr). Redirect conservé.
- [x] cfia-toulouse-2026 : salon RÉEL distinct du CFIA Rennes (biennal années paires, MEETT). Redirect erroné cfia-toulouse-2026 -> cfia-rennes-2027 RETIRÉ de next.config.ts (il shadowait une vraie fiche). end_date corrigée 23 -> 24/09/2026 (toulouse.cfiaexpo.com, ria.fr).
- [x] Hors briefing, vérifiés faux et publiés (drafts conservateurs) : autonomy-paris-2026 (salon mort, rebrandé Global Decarbonization Expo puis disparu), in-cosmetics-global-paris-2026 (édition 2027 à Barcelone, pas Paris : le roll a fabriqué un évènement "Paris 2027" inexistant).
- [x] heavent-cannes-2026 : dates corrigées 30-31/03/2027 -> 3-4/03/2027 (heavent-one-to-one-meetings.fr).

## Vérification (definition of done)

- [x] Script idempotent exécuté (relance = 0 ligne), diag-redirect-coherence rerun : 0 fiche publiée shadowée, 0 boucle
- [x] npm run build OK + serveur prod local (port 3100) : 308 vers les bonnes cibles avec final 200 partout, 200 sur les fiches dé-shadowées (cfia-toulouse-2026) et renommées (sia-paris-2027, solutions-rh-paris-2027), 404 sur les 2 drafts sans redirect (autonomy, in-cosmetics)

## Follow-ups data (vérifiés sur sources officielles, à traiter avec Nicolas)

- [ ] solscope-2027 (fiche éditoriale) : "juin 2027" confirmé par solscope.fr mais jours exacts (15-16) et lieu NON confirmés ; le site dit "tous les 2 ans dans une ville différente"
- [ ] it-partners-paris-2026 : le salon quitte Disneyland pour Paris La Défense Arena (Nanterre) en 2027 (itpartners.fr) -> venue/city à mettre à jour
- [ ] europack-euromanut-lyon-2026 : rebrandé Prod&Pack (prodandpack.com), 16-18/11/2027 Eurexpo -> renommage fiche à décider
- [ ] parabere-forum-paris-2026 : édition 2027 à NICE, pas Paris (parabereforum.com) -> city à corriger
- [ ] je-m-export-paris-2026 : existence NON confirmée (absent de l'agenda Classe Export ; coïncidence de dates exactes avec GO Entrepreneurs Paris 28-29/04/2027) ; fiche avec éditorial, décision à prendre côté process writer
- [ ] midest-2026 : Midest n'existe plus en autonome (midest.com 301 vers global-industrie.com), univers sectoriel de GI Lyon 2027 -> fusion/draft à décider
- [ ] les-thermalies-paris-2026, franchise-expo-paris-2026, learning-technologies-paris-2026, laval-virtual-2026, carrefour-de-leau-rennes-2026, pharmapack-paris-2026, hyvolution-paris-2026, world-nuclear-exhibition-2026 (biennal impair confirmé), workspace-expo-paris-2026 (devient "Workspace Paris"), egast-strasbourg-2027, enerj-meeting-paris-2026, global-industrie-lyon-2025 : dates de début confirmées conformes ; reste la question de fond du renommage des slugs à année legacy (convention "slug stable" vs renommage + 301) à trancher avec Nicolas
- [x] Cause racine : scripts/find-next-edition.ts roule les fiches en place (dates/edition_year) sans renommer le slug ni vérifier ville/existence de l'édition suivante (cas in-cosmetics Barcelone fabriqué en "Paris 2027") -> garde-fous livrés (PR #28, mergée sur main le 2026-06-12). Précision : le script lui-même ne faisait aucun UPDATE (le dégât venait de l'application du CSV, hors repo) ; sa sortie est désormais un CSV avec verdict ok/verifier/ne_pas_rouler (périodicité, ville/lieu, locked_fields) + un SQL à relire qui pose alert_flag/notes_internes au lieu de rouler les cas douteux

---

# Migration slugs sans année (2026-06-12)

Décision Julien 2026-06-12 : plus d'année dans les slugs salons. La fiche est la fiche canonique de la série, l'année vit dans les données (edition_year, dates, seo_title). Diagnostic scripts/diag-slug-migration.ts : 238 fiches publiées, 238 séries, 0 archive, 0 collision, 31 redirects existants à réécrire, 184 liens MDX, 0 shadowing.

## Exécution

- [x] scripts/diag-slug-year-apply.ts : renommage des 238 slugs en DB (idempotent) + réécriture des liens /salons/ dans les editorial_mdx (salons, venues, sectors) + émission de redirects-slug-year.json (238 x 301 ancien -> nouveau)
- [x] next.config.ts : import des redirects générés + réécriture des 31 destinations existantes vers les slugs de base (pas de chaînes de 301)
- [x] Placeholder admin secteurs : exemple sial-paris-2026 -> sial-paris
- [x] CLAUDE.md : convention slug sans année (modèle de données + URLs propres)
- [x] regles-edito-agoris-v1.md : convention slug sans année pour les cohortes 7+
- [x] content/salons/*.mdx legacy : non rendus (lecture DB depuis migration 20260601800000), non touchés

## Vérification (definition of done)

- [x] Script rejoué = 0 ligne modifiée ; diag-redirect-coherence : 0 shadowée, 0 boucle, 0 destination absente
- [x] Build + serveur local : ancien slug 308 -> nouveau 200 (échantillon), vieux redirects config 308 -> base en 1 saut, sitemap sans années
- [x] Après merge : vérif prod OK (308 un saut, canonicals sans année, sitemap 0 année, liens MDX réécrits). Reste : Request Indexing GSC manuel sur les fiches prioritaires
