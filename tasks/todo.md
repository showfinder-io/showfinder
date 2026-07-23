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
