# progress : shortlist 7 et suites du 2026-11-12 (fichier de reprise)

Écrit le 2026-11-12 au soir pour reprendre dans une session neuve (la session d'origine dépassait 900K tokens de contexte).

## Tâche

Go Julien du 2026-11-12 :
1. Shortlist 7 (tasks/cohorte-trafic-shortlist-7.md) : rédiger et publier les tiers A et B, soit 16 fiches (Build It Summit écarté : édition de décembre 2026 à faible demande ; Patrimonia Lyon en fiche séparée de patrimonia-paris ; La Napoule Boat Show en salon_grand_public avec category_to_confirm).
2. Prestataires : appliquer scripts/diag-prestataires-relecture-2026-11-12-apply.ts une fois les 301 magnum-lyon et expocom-paris actives ; puis relire la première vague de 10 à 15 standistes du groupe A (tasks/prestataires-g15-2026-11-12.md) avant de les ouvrir à l'indexation (go Julien : ouvrir par vagues après relecture, pas en bloc).
3. Request Indexing des fiches refaites les 11-12 nov. (lots roll, infos pratiques) par paquets de 10.

## Critères de fin (shortlist 7, repris de la SL6)

Chaque fiche : writer Opus, pass-1 Sonnet avec correction, pass-2 Sonnet indépendante avec correction et traduction EN, aucun MAJEUR ouvert, `./node_modules/.bin/tsx scripts/diag-cohorte-p2-check.mts --en <slug>` à 0 erreur. Puis insertion en draft, vérification, publication en bloc (scripts/diag-cohorte-trafic-apply.ts --apply puis --publish), IndexNow, URLs FR et EN en 200 en prod. todo à jour, PR mergée.

## Sorties

- Fiches : handoff/cohorte-trafic/<slug>.json (gitignoré). Reviews : handoff/cohorte-trafic/reviews-sl7/<slug>.pass1.md et .pass2.md.
- Briefs : handoff/shortlist-7/BRIEF-WRITER.md et BRIEF-REVIEW.md. Slugs publiés : handoff/cohorte-trafic/published-slugs-2026-11-12.json.
- Slugs : drive-to-zero, reuse-economy-expo, ibs-paris, techsolutions, congres-experts-comptables, patrimonia-lyon, human-day, le-practice, future-intelligence, fintech-revolution, datacloud-global-congress, sportel-monaco, ipem-wealth, ipem-global, salon-agro-hauts-de-france, la-napoule-boat-show.

## Fait (vérifié par la présence des fichiers le 2026-11-12)

- 16/16 writers et 16/16 pass-1 faits (reviews-sl7/*.pass1.md, corrections appliquées, check sans --en à 0 erreur selon les agents).
- Pass-2 + EN FAITS pour future-intelligence, fintech-revolution, human-day, le-practice, ibs-paris, techsolutions, congres-experts-comptables (tarifs APAR « Edition 2026 » rétablis et datés), patrimonia-lyon, drive-to-zero, reuse-economy-expo, ipem-wealth, ipem-global, salon-agro-hauts-de-france, la-napoule-boat-show, datacloud-global-congress (prix des pass reformulés en relevé daté du 12/11/2026) et sportel-monaco (16/16) (check --en OK ; human-day : organizer_name « Human DAY », Hippocampus Events non confirmé par source primaire, reporté dans alerts seulement).
- 2026-11-13 : check --en relancé sur datacloud et sportel, OK. Les 16 fiches sont prêtes à insérer.
- Corrections signalées : siane-toulouse et solscope en base (dates + textes). PR #189 (script lot3 + todo) ouverte, à merger après CI verte.
- 2026-11-13 : 16/16 insérées en draft (contrôle base : champs identiques aux handoffs, lieux et secteurs présents, aucun tiret cadratin), puis publiées ; IndexNow 32 URLs (HTTP 200) ; 32/32 URLs FR et EN en 200 en prod (index, follow). 4 lieux créés : station-f, palais-des-sports-robert-charpentier-issy, artois-expo, port-la-napoule (aucun doublon en base avant création).
- 2026-11-13 : liens croisés RR37 appliqués par scripts/diag-crosslinks-apply.ts (handoff/cohorte-trafic/crosslinks-sl7/, second dry-run à 0) : ipem-wealth et ipem-global (À retenir + Communauté, FR et EN), ibs-paris et techsolutions (paragraphe « mêmes dates, même site », sans association affirmée). Visibles en prod à la revalidation ISR (1 h) ou au déploiement suivant.
- 2026-11-13 : prestataires, 308 magnum-lyon et expocom-paris actives FR et EN ; scripts/diag-prestataires-relecture-2026-11-12-apply.ts --apply : 49 champs écrits, second dry-run à 0.
- 2026-11-13 : PR showfinder-io/showfinder#190 squash-mergée (CI verte), déploiement Vercel du commit e36408f en succès. Contrôle post-déploiement : /prestataires/magnum et /prestataires/expocom en 200 FR et EN (le 404 FR de cache ISR a disparu) ; liens croisés présents dans le HTML de prod FR et EN (ipem-wealth et ipem-global : 2 liens chacune, ibs-paris et techsolutions : 1 lien chacune ; en EN les liens sont rendus en /salons/..., comme les liens MDX existants).

## Décisions et points de vigilance

- Pass-1 a retiré les BudgetTable aux montants inventés (drive-to-zero, reuse, ibs, techsolutions, experts-comptables, patrimonia-lyon) : vérifier en pass-2 qu'aucun montant non sourcé ne subsiste, SEO compris.
- human-day : pass-1 a mis « Hippocampus Events » comme organisateur sur un rapprochement indirect (agrégateur + registre). Règle : garder la marque affichée par le site si aucune source primaire ne nomme la société.
- techsolutions : le site écrit « Mercredi 5 / Jeudi 6 octobre 2027 », or le 5 octobre 2027 est un mardi ; dates sans jour de semaine, incohérence signalée.
- datacloud : prix des pass datés de mi-novembre 2026, à relire si publication après le 11/12/2026.
- IPEM : lier ipem-wealth et ipem-global entre eux après publication (aucune n'était dans published-slugs) ; idem ibs-paris et techsolutions si co-localisation retenue.

## Problèmes ouverts

- Relecture de la vague 1 des standistes du groupe A (tasks/prestataires-g15-2026-11-12.md) : seulement sur go Julien.
- metal-expo-paris : brouillon réécrit (handoff/edito-lot3-2026-11-12/writer/), à relire puis publier en retirant le 301 /salons/metal-expo-paris -> /salons/batimat de next.config.ts. Proposé à Julien le 2026-11-13, pas fait.
- 301 EN manquant : /en/salons/solscope-lyon-2026 -> /en/salons/solscope. Proposé à Julien le 2026-11-13, pas fait.
- Paris Design Week : dates 2027 à lire par Julien (Incapsula).
- Request Indexing GSC des 16 fiches de la shortlist 7 et des fiches refaites les 11-12 nov.

## Prochaine action

Shortlist 7 terminée. Prochaine action, sur décision de Julien : Request Indexing GSC des 16 fiches (paquets de 10), puis les points ouverts ci-dessus.
