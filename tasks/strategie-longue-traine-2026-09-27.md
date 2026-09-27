# Trafic et taille des salons : analyse et stratégie longue traîne (2026-09-27)

Question de Julien : a-t-on plus de trafic sur les petits salons que sur les gros, parce que la concurrence y est plus faible ? Si oui, quelle stratégie longue traîne ?

Données (dossier local, git-ignoré : `audits/traffic-vs-size-2026-09-27/`, scripts `scripts/diag-traffic-audit-*`) : Search Console 90 jours (26 juin au 23 septembre 2026) sur les 260 fiches publiées FR + EN, taille = `estimated_exhibitors` en base (231 fiches renseignées), volumes Google Ads France du nom de chaque salon (3 variantes : nom, nom + 2027, salon + nom) et 60 SERP Google "nom 2027" (20 gros, 20 médians, 20 petits) via DataForSEO (0,47 USD).

## Verdict

**En volume brut : non.** La taille ne prédit pas le trafic (corrélation de rang exposants/clics : -0,05). Les petits salons n'apportent pas plus de clics que les gros ; la médiane est de 1 à 2 clics en 90 jours quelle que soit la tranche.

**Sur le mécanisme de concurrence : oui, nettement.** Plus le salon est gros ou recherché, moins on capte la demande :

| Exposants | Fiches | Position FR moyenne | CTR FR | Recherches/mois (médiane) | Part de la demande captée |
|---|---|---|---|---|---|
| 100-299 | 90 | 8,9 | 2,5 % | 245 | 0,4 % |
| 300-999 | 85 | 10,5 | 1,3 % | 410 | 0,1 % |
| 1000 et plus | 48 | 12,0 | 0,9 % | 1 345 | proche de 0 % |

- Position dégradée avec la taille (rang +0,28) et avec le volume de recherche (+0,26) ; part captée en baisse avec le volume (-0,18).
- SERP "nom 2027" : sur les 20 plus gros salons, Agoris n'est dans le top 20 que 3 fois (position médiane 19). Sur les 20 médians : 9 fois, position médiane 3. Le site officiel est premier partout.
- Qui occupe le top 10 : réseaux sociaux (Facebook, LinkedIn, Instagram), EventsEye, puis des agrégateurs faibles (exposale, salonsenfrance, nsalons, foiresinfo). Les concurrents historiques cités dans CLAUDE.md sont quasi absents des SERP françaises : 10times dans 2 top 10 sur 60, ExpoDatabase dans aucun, contre 16 pour EventsEye.

**Ce qui fait vraiment le trafic : les salons de niche à demande moyenne.** Le trafic est très concentré (top 10 des fiches = 59 % des clics, top 30 = 80 %), et ce top est fait de salons de 150 à 350 exposants, de 40 à 750 recherches par mois, où Agoris se classe entre la 4e et la 7e place derrière le seul site officiel : Terres de Jim (451 clics, 20 % de la demande captée), AD2S, Salon de l'Herbe, Tech&Bio, Tech Ovin, Tech Élevage. **L'agriculture fait 46 % des clics avec 10 % des fiches** (26 fiches, 1 099 clics, 42 clics par fiche contre 8 pour l'industrie, deuxième secteur).

## Limites

- Fenêtre de 90 jours qui couvre l'été et septembre : les salons tenus pendant la fenêtre (Terres de Jim, Tech Ovin, Salon de l'Herbe) sont avantagés. Le pic de trafic suit la date du salon ; une lecture sur 12 mois reste à faire.
- Volumes Google Ads arrondis par tranches : une part captée supérieure à 100 % (Salon de l'Herbe) montre que ce sont des ordres de grandeur.
- 78 % des clics sont anonymisés par Google au niveau requête : l'analyse des intentions ne porte que sur 528 clics sur 2 410. Parmi eux, "nom + année" fait 84 % des clics ; "exposants", "dates", "billetterie" sont marginaux.
- Google seulement : Bing (17 % des sessions GA4) n'est pas mesuré.

## Stratégie proposée

1. **Choisir les fiches à créer selon la concurrence, pas selon la taille.** Avant chaque rédaction, mesurer le volume du nom et la SERP (environ 0,01 USD par salon) et prioriser les salons de 50 à 2 000 recherches par mois dont la SERP n'a que le site officiel et des acteurs faibles. Ne plus investir de fiche nouvelle sur un géant où l'on sera hors top 20. À appliquer tout de suite à la shortlist 3 et aux lots C et D de la shortlist 2.
2. **Doubler sur les filières "terrain" où le modèle marche.** Agriculture et élevage d'abord : salons techniques en plein champ, filières animales et végétales, salons régionaux, avec un maillage interne fort entre fiches et une page secteur agriculture enrichie (calendrier annuel). Puis tester le même modèle sur des filières proches, peu couvertes par les agrégateurs : forêt et bois, viticulture technique, maritime, BTP régional.
3. **Pages hubs génériques de longue traîne**, du type "salons agricoles 2027", "salons élevage septembre", "salons professionnels Bretagne 2027" (secteur x période, secteur x région). La baseline GSC d'août contenait déjà 249 requêtes génériques (1 873 impressions, dont "salon agroalimentaire" 123, "salon logistique" 98, "salon du bâtiment" 70). À dimensionner avec DataForSEO avant de construire, et seulement là où au moins quelques fiches solides existent (même règle anti thin-content que les pages villes).
4. **Gros salons déjà en base : ne pas se battre sur "nom 2027".** Les intentions secondaires (exposants, plan, budget de stand, hébergement) sont aujourd'hui marginales dans les données ; à mesurer avant d'y investir. Priorité basse.

## Phase 0 faite le 2026-09-27

- Scoring des 58 candidats : voir la section "Ordre de rédaction" de `tasks/cohorte-trafic-shortlist-3.md` (17 en tier A, 24 en tier C à moins de 30 recherches par mois). Classement des 579 résultats de SERP fait par Jev (TypeSafe) et non par un LLM, conformément à la règle coût.
- Hubs génériques (axe 3) : les requêtes secteur ont un vrai volume ("salon agricole" 6 600, largement tiré par le Salon de l'Agriculture grand public ; "salon tourisme" 1 600 ; "salon industrie" 1 000 ; "salon franchise" 880 ; "salon de l'élevage" 720 ; "salon du bâtiment" 320 ; "salon btp" 260). Les requêtes purement temporelles ou géographiques ("salon professionnel 2027", "agenda salons 2027", "salons professionnels bretagne") sont à 0-10 recherches : pas de hub temporel ou régional pur. L'axe 3 se réduit donc à renforcer les pages secteur existantes sur leur requête "salon <secteur>", en priorité tourisme, industrie, franchise, élevage, bâtiment.
- Pistes catalogue remontées par les gabarits, non vérifiées : Medintechs, Energies+ (absents du catalogue).

Prochaine étape d'origine (faite) : phase 0 chiffrée (DataForSEO, moins de 5 USD) : score volume x concurrence des 44 salons de la shortlist 3 et des 14 des lots C et D, et volumes des gabarits de hubs génériques (secteurs x périodes x régions).
