# Brief writer — Cohorte 5 (post-Dream RR1-RR17)

Ce document consolide les règles d'écriture pour la prochaine cohorte de fiches Agoris. Il est destiné à être injecté tel quel dans le prompt-system du writer-agent, en complément des règles éditoriales Nicolas R1-R33.

## Workflow obligatoire (architecture 2-agents)

1. **Writer-agent** : recherche web sourcée + production MDX
2. **Reviewer-agent indépendant** : fetch site officiel + cross-check chaque fait
3. **Writer applique les corrections** ciblées (pas de réécriture massive)
4. **2e reviewer-pass** (si fiche haute-valeur) : valide les corrections
5. **Publication** + observation Dream pour les findings

## Règles RR1-RR17 (issues du Reviewer Pass 31 fiches)

### RR-1. Vérification dernière édition avant écriture
Fetcher la home du site officiel pour identifier la dernière édition bilantée et la prochaine édition annoncée. Distinguer les chiffres OJS / audités des projections marketing.

### RR-2. Anti-fabrication d'exposants et partenaires
N'inclure que les exposants et partenaires explicitement listés sur la page partenaires / page exposants officielle. Pas de "présence régulière" pour des marques non confirmées.

### RR-3. Anti-création de slogans / baselines
Ne jamais créer ou paraphraser un slogan / baseline / wording marketing. Si la home ne le porte pas verbatim, ne pas l'inclure. *Exemple d'erreur évitée : "Positivons l'industrie" inventé sur Midest alors que la home dit "La voix et les solutions de l'industrie".*

### RR-4. Convention sources implicites
Ne pas écrire "(source : organisateur)". Le footer de la fiche indique déjà que les données proviennent du site organisateur sauf mention explicite. Citer uniquement les sources autres que le site organisateur (presse spécialisée, OJS audité, communiqués FHF, ministère, etc.).

### RR-5. L'Essentiel obligatoire
L'Essentiel doit toujours contenir :
- Site web officiel
- Organisateur (entité légale)
- Co-organisateur (si applicable, entité distincte)
- Fréquence
- Lieu (avec lien interne vers `/lieux/[slug]`)
- Dates édition prochaine

### RR-6. Organisateur ≠ opérateur événementiel
Distinguer l'organisateur institutionnel (qui porte le salon et son éditorial : FHF pour SantExpo, AMF pour Congrès des Maires, Bordeaux Technowest pour UAV Show) de l'opérateur événementiel (GL Events, Comexposium, BEAM, Infopro Digital). Le premier va dans `organizer_name`, le second dans `co_organizer_name`.

### RR-7. Numérotation d'édition vérifiée
Avant d'écrire un numéro d'édition (Xe), vérifier la séquence sur le site officiel ou les communiqués historiques. Si non vérifié, écrire "édition 2026" sans numéro. *Exemple : Salon du Chocolat 2025 = 30e (anniversaire), donc 2026 = 31e — toujours vérifier la séquence avant correction.*

### RR-8. Dates de prochaine édition fetchées sur l'URL officielle
Toujours fetcher le title tag ou la home du site officiel pour les dates de la prochaine édition. Les snippets Google (SERP) peuvent être obsolètes. *Exemple : BePositive 2027 affiché en SERP "23-25 mars", title site officiel "31 mars-2 avril".*

### RR-9. Cohérence jour-de-semaine vérifiée
Pour les dates citées (ex. "20-22 octobre 2027"), vérifier la cohérence jour-de-semaine. 20 octobre 2027 = mardi, 22 octobre = jeudi.

### RR-10. Salon renommé ou intégré : clarifier l'identité actuelle
Si le slug porte un nom ancien (Paris Healthcare Week, Europack Euromanut CFIA, Midest, Numeriquest), L'Essentiel doit clarifier immédiatement la nouvelle identité (SantExpo, Prod&Pack, Global Industrie, THCon) et le millésime du rebranding.

### RR-11. Lieux liés en interne
Le lieu doit pointer vers `/lieux/[slug]`. Si le venue n'existe pas dans la table `venues`, le créer en migration plutôt que d'écrire un texte libre.

### RR-12. Liens externes target=_blank
Tous les liens externes dans le MDX (RSE, site officiel partenaire, etc.) ouvrent dans une nouvelle fenêtre. Implémenté côté composant MDX.

### RR-13. Image hero alignée sur l'édition courante
Si l'image hero affiche des dates d'une édition précédente, ne pas l'afficher. Heuristique côté UI à mettre en place.

### RR-14. Anti-sur-correction en pass de correction
Lors d'une 2e passe sur une fiche corrigée précédemment, ne PAS retirer un fait juste parce qu'il n'est pas trouvé sur la page d'accueil du site officiel. Toujours vérifier sur les sources alternatives (sous-pages officielles, presse spécialisée crédible comme agro-media.fr / Light ZOOM Lumière / architecturebois.fr) avant de retirer une mention. *Exemple : "Showroom 800 m²" Europack retiré à tort en pass 1 alors que sourcé agro-media + lyon-entreprises + presseagence.*

### RR-15. Rebranding non confirmé : ne pas affirmer
Ne pas inventer de rebranding marketing. *Exemple : "Paris Builders Show" présenté comme nom officiel du Mondial du Bâtiment 2026 dans 4 fiches alors qu'aucune source officielle ne le confirme.*

### RR-16. Nature institutionnelle des sigles vérifiée
Toujours vérifier la nature institutionnelle d'un acronyme avant de le classer. *Exemple : l'ANSSI est une agence gouvernementale, pas un laboratoire de recherche.*

### RR-17. Numérotation d'édition incluant l'année de création
Si un événement est créé en année N et qu'une édition s'est tenue en N, c'est la **1re édition de N**, pas l'édition 0. *Exemple : THCon créé en 2017 = 1re édition 2017, 2018 = 2e édition.*

## Patterns d'erreurs identifiés à éviter

### 1. Confusion entre éditions
- Chiffres marketing récents attribués à des éditions passées (et vice-versa)
- Bilans post-événement ignorés au profit de projections
- Numérotation d'édition non vérifiée

### 2. Inventions de partenaires et exposants
- Listes inventées (Adelphe, IPC, Coboteam pour Europack ; FFPV pour EquipBaie)
- "Présence régulière" pour des marques non confirmées
- Sponsors prestigieux invoqués sans vérification (KKR pour Vivatech, KPMG pour ChangeNOW)

### 3. Confusion organisateur / opérateur / co-organisateur
- "Hôpital Expo SAS" pour HôpitalExpo (entité inexistante)
- "Produrable" pour Produrable (réel = Groupe AEF)
- "Kortrijk Xpo" pour Architect@Work Lyon (réel = Expo Conseil)

### 4. Faits dépréciés
- Ministres plus en poste (Stéphanie Rist → Catherine Vautrin)
- Thèmes annuels obsolètes
- "Donnée non disponible RSE" alors que certification ISO 20121 existe

### 5. Lieux / Halls / Dates
- Hall faux pour les éditions anniversaires (Vivatech Hall 1 → Hall 7 ; Hyvolution Halls 4+6 → Hall 1)
- Dates copiées d'une édition à l'autre (Artibat dates 2025 pour 2027 ; Batimat 17-19 oct → 28 sept-1er oct)

### 6. Chiffres marketing vs OJS
- "OJS" mentionné sans citation directe d'un audit
- Tarifs présentés comme publiés alors que site officiel dit "bientôt disponible"

### 7. Sigles, libellés et noms exacts
- "Performance industrielle" → "Performance et efficience industrielle" (Midest)
- "Trophées Innovation SantExpo" → "Trophées Innovation Fonds FHF"
- "Innovation Arena" → "Arène de l'Innovation" (Congrès des Maires)
- "Holberton School" → "Holberton Actual Digital School" (THCon)

### 8. Confusion structurelle
- Salons renommés non détectés
- Pavillon présenté comme salon autonome
- Salon co-localisé confondu avec salon principal

## Sources autorisées (priorité décroissante)

1. **Site officiel de l'organisateur** (home, sous-pages, page partenaires, page exposants, page tarifs, page RSE)
2. **OJS** (Office de Justification des Statistiques)
3. **Communiqués officiels** (FHF, AMF, syndicats représentés)
4. **Ministères et agences gouvernementales** (Ministère Santé, ADEME, ANSSI...)
5. **Presse spécialisée crédible** : Le Moniteur, Le Quotidien du Médecin, Premium Beauty News, Architecture Bois Magazine, Light ZOOM Lumière, agro-media.fr, lechodelabaie.fr, batirama.com, batiweb.com
6. **Wikipedia FR** (pour historique uniquement)

## Sources interdites (R5-R6 de Nicolas)

- mediaproduct.fr
- presseagence.fr (sauf si confirmé comme source d'organisateur)
- eventseye.com
- tradefairdates.com
- fil-d-actu-bati...
- cantonfair.net
- tradefest.io (pour les tarifs)

## Mission writer (étape 1 du workflow)

Pour chaque fiche :
1. Fetch home + page exposants + page partenaires + page tarifs + page RSE du site officiel
2. Fetch 2-3 sources presse spécialisées récentes (post-2024) confirmées
3. Identifier la dernière édition bilantée (chiffres réels) vs la prochaine édition annoncée (projections)
4. Produire le MDX avec L'Essentiel complet (RR-5), organisateur ≠ co-organisateur (RR-6), sources explicites uniquement quand non-organisateur (RR-4), exposants/partenaires sourcés (RR-2)
5. Auto-check RR-1 à RR-17 avant transmission au reviewer

## Mission reviewer (étape 2 du workflow)

Pour chaque fiche produite par le writer :
1. Fetch indépendamment le site officiel
2. Pour chaque fait factuel cité : confirmer / contredire / non vérifiable
3. Détecter les patterns d'erreurs identifiés (RR-1 à RR-17)
4. Output structuré : ✅ Validé / ⚠️ Discrepancy (MAJEUR/MINEUR) / ❌ Non vérifiable / 💡 Spot-fix recommandé

## À retenir pour la cohorte 5

Les patterns d'erreurs writer-agent ont été identifiés et codifiés. Les 17 règles RR sont actionnables immédiatement. La précision factuelle attendue : ≥ 95 % sans Nicolas, ≥ 99 % avec validation Nicolas.
