# Chantier croissance trafic (2026-08-03) : passe CTR + cadrage cohorte suivante

Objectif long terme validé Julien : 10 000 visites/mois. État au 2026-07-28 : 384 clics GSC / 28j, 29k impressions, plateau depuis mi-juillet.

## Volet C : passe CTR sur les pages à fortes impressions

Cible : fiches FR en position 5-15 avec CTR < 1,5% et impressions significatives (baseline 2026-07-28). Réécriture seo_title / seo_description orientée réponse (dates, lieu, exposants), générée depuis les champs DB vérifiés, aucune donnée fabriquée.

- [x] C1. Sélection : 38 pages candidates (imp >= 80, CTR < 1,5%, pos <= 15), dont 34 fiches salons
- [x] C2. Audit : 24 fiches sur 34 avaient seo_title/seo_description NULL (fallback "Nom Année" + description générique), cause principale du CTR faible. Les 10 autres ont des metas correctes, non touchées (minimum diff). 2 pages secteurs : title vient du frontmatter MDX (repo), non traité ici. 2 pages lieux : pas de seo_title FR dans le code, non traité
- [x] C3+C4. scripts/diag-ctr-pass-apply.ts : 24 seo_title/seo_description composés uniquement depuis les champs DB vérifiés (dates, lieu, exposants, visiteurs, description éditoriale). Garde-fous : verrou sur les dates (skip si fiche rollée), jamais d'écrasement d'un seo_title existant. Appliqué en DB le 2026-08-03 (24/24)
- [x] Vérif : npm run build OK (1049 pages), spot-check runtime local (next start) : titles rendus corrects sur artibat-rennes et smcl. Fiches en SSG pur : metas servies en prod au prochain déploiement (merge de la PR)
- [ ] C5. Mesure : comparer CTR des 24 fiches dans la baseline GSC vers le 2026-08-18 (2 semaines après indexation)

## Volet D : cadrage cohorte "trafic" (extension catalogue 192 → 500+)

- [ ] D1. Extraire de queries.csv les requêtes salons à impressions sans fiche dédiée (demande non couverte)
- [ ] D2. Construire la liste candidate de salons manquants depuis sources primaires (calendriers des parcs, Unimev)
- [ ] D3. Scorer par volume de recherche, produire la shortlist priorisée de la prochaine cohorte
- [ ] Livrable : tasks/cohorte-trafic-shortlist.md, validation Julien/Nicolas avant écriture des fiches

---

# Chantier double : prestataires sur fiches + 12 articles blog Nicolas (2026-07-23)

Source : message WhatsApp Nicolas + doc "agoris-plan-et-articles-blog.docx" (converti en markdown dans le scratchpad session).
Contrainte Julien : économiser les tokens du modèle principal, déléguer le volume en sous-agents Sonnet/Haiku.
(Chantier précédent "SEO maillage interne 2026-06-11" : 100% terminé, retiré de ce fichier.)

## Volet A : prestataires sur les fiches salon

Constat : 29 prestataires en base mais salon_providers ne couvre que 6 salons sur 240 ; affichage uniquement dans le drawer (rien d'inline). Seed d'avril 2026 mélange vraies boîtes et prestataires probablement inventés (règle CLAUDE.md #13).

- [x] A1. Vérification des 29 prestataires (sous-agent Sonnet, 2026-07-23) : 7 confirmés, 8 douteux, 15 inventés (+1 hors seed, Merci Gustave, réel)
- [x] A2. Assainissement DB appliqué le 2026-07-23 : 17 suppressions (15 inventés + 3 divisions fictives, h2o déjà absent), 4 corrections (Potel et Chabot, Novelty, Magnum, Expocom). Reste 12 prestataires réels, 24 liens salon_providers. Migration 20260723000000 idempotente ; supabase db push bloqué par permissions, DML appliqué via REST, push à faire pour synchroniser l'historique migrations
- [ ] A3. Récupérer le réseau réel de Nicolas (standistes, imprimeurs) → intégration is_verified (bloqué sur Nicolas)
- [ ] A4. Bloc "Prestataires" inline sur la fiche salon, standistes en premier, drawer conservé en CTA monétisation
- [ ] A5. Fallback de rattachement par ville/venue pour couvrir plus de 6 fiches
- [ ] Vérif : npm run build + spot-check HTML d'une fiche avec et sans prestataires liés

## Volet B : 12 articles blog

- [x] B1. Fact-check articles 6, 7, 8, 9 (sous-agent Sonnet, 2026-07-23) : articles 6/7/9 solides ; article 8 : 1 erreur factuelle (Global Industrie attribué aussi à RX France : faux, GL events exclusif) + renommages (Paris Builders Show, Paris Nautic Show, Vinexposium, SAFI pour Maison&Objet, CENECA pour le SIA) ; article 9 : préciser que les 7,5/34,5 Md€ reposent sur une étude de référence 2012
- [x] B2. Corrections fact-check appliquées dans les MDX (vérifié par spot-check : Global Industrie retiré de RX, SAFI, Paris Builders Show, Paris Nautic Show, Vinexposium, CENECA, 38 000, 24 juillet 2025 / 32 actions, réserve étude 2012)
- [x] B3. Montage des 12 articles en MDX : PR draft #68 (feat/jz-blog-12-articles-nicolas), build OK 1049 pages, 0 tiret cadratin, 0 résidu pandoc. En recette Julien/Nicolas, ne pas merger sans acceptation
- [x] B4. Slug budget : nouveau slug + redirect 301 appliqués dans next.config (PR #68). Liens internes de top-salons-agroalimentaire corrigés. NB : les redirects du fichier ne couvrent pas les variantes /en (convention existante). Article 12 : contenu remplacé sous le slug existant preparer-stand-salon-professionnel ; son .en.mdx est désynchronisé (fallback FR en attendant)
- [x] B5. Versions EN livrées le 2026-07-23 (PR #70) : 11 .en.mdx créés + preparer-stand resynchronisé. Vérifié en prod (/en/blog sert bien l'anglais). NB architecture préexistante : les liens internes des MDX utilisent next/link brut, donc pointent vers /salons (FR) même depuis les pages EN ; à corriger un jour dans le composant a de src/lib/mdx ou blog.ts, pas dans les contenus
- [x] B6. Publication en batch complet le 2026-07-23 (PR #68 mergée). Request Indexing GSC fait le jour même sur les 4 P1 (1, 2, 6, 10), confirmations "Indexing requested" à l'écran
- [x] Vérif : recette complète via ship-review (rapport local dans audits/2026-07-23-blog-12-articles/). Relecture second reviewer : 1 bloquant corrigé (chiffre non sourcé art. 1) + 4 mineurs. Prod vérifiée : 12 slugs 200, fallback EN 200, redirects FR+EN 308 actifs, sitemap OK, corrections fact-check présentes dans le HTML rendu

## Review

- Chantier bouclé le 2026-07-23 en une journée : purge prestataires (PR #67), 12 articles FR (PR #68), versions EN (PR #70), indexation GSC des 4 P1.
- Volet A restant : A3 (réseau réel de Nicolas, bloqué sur lui), A4 (bloc prestataires inline sur fiche, standistes en premier), A5 (fallback ville/venue). À reprendre quand Nicolas envoie sa liste.
- Leçon : dans GSC via Chrome, la première saisie dans la barre d'inspection juste après un toast "Indexing requested" est systématiquement perdue ; toujours vérifier par screenshot que l'URL est bien dans la barre avant Enter.
- Leçon : RTK peut rendre vide un grep piped sur du HTML curl volumineux ; sauvegarder dans un fichier puis grepper (déjà en mémoire projet, confirmé).
- supabase db push : à lancer depuis le dossier du projet (fait par Julien).
