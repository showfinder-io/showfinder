# Cohorte 16 - arbitrages & intégration (2026-06-19)

10 fiches publiées (writer Opus + 2 reviewers Sonnet). Toutes `status=published`, `editorial_mdx` en DB. Pas de dédup. Cohorte "longue traîne" : gros événements internationaux dont les données DB (site, dates, chiffres) étaient vides, enrichies depuis les sites officiels.

## Fiches publiées (rolls + corrections)

| slug | édition | correction DB majeure |
|------|---------|------------------------|
| silmo-paris | 2026 (25-28 sept) | organizer **Comexposium** ; venue **Paris Nord Villepinte** (relié) ; 33 358 visiteurs 2025 |
| ish-francfort | 2027 (15-19 mars) | bisannuel impair ; 163 157 visiteurs 2025 (audité), 2 183 exposants |
| hannover-messe | 2027 (5-8 avr) | pays partenaire **Espagne** 2027 ; ~110 000 visiteurs (communiqués, non FKM) |
| smarter-e-europe-munich | 2026 (23-25 juin, imminent) | ombrelle 4 salons ; 107 000 visiteurs / 2 737 exposants 2025 |
| e-world-essen | 2027 (16-18 fév) | co-org **con\|energy** ; 1 136 exposants / 37 000 visiteurs 2026 |
| bim-world-paris | 2027 (31 mars-1er avr) | **LIEU FAUX en base** : La Défense Arena -> **Paris Expo Porte de Versailles** (RR18/RR40) ; organizer **Beyond Event SAS** ; venue_id corrigé |
| medteclive-stuttgart | **2028** (2-4 mai) | itinérant Stuttgart (paires) / Nuremberg (impaires) -> prochaine Stuttgart 2028 ; org **MedtecLIVE GmbH** (NürnbergMesse) |
| salon-infirmier-paris | 2027 (40e) | org **Quinze Mai** ; venue Porte de Versailles (relié) ; dates mars 2027 non confirmées (null) |
| congres-adf-paris | 2026 (24-28 nov) | placeholder **"POPOPOP"** repéré et corrigé ; co-org "Comident" non confirmé retiré ; thème TOOTH_BEAT ; ~28 000 participants |
| medfit-marseille | 2026 (10-11 déc, 10e) | itinérant Parc Chanot ; visiteurs 900 -> **700+** ; co-org Clubster NHL/Medicalps/BioValley |

## Arbitrage Nicolas requis

- **MedFIT catégorie** : MedFIT est une **convention d'affaires B2B** (partnering one-to-one, Start-up Slams), pas un salon à stands. Le pipeline propose la catégorie **`congres`**. `category_to_confirm=true` conservé. La catégorie n'a PAS été modifiée automatiquement (hors whitelist du script apply) : décision Nicolas à trancher.

## Corrections d'intégration appliquées

- **venue_id reliés** pour 5 fiches dont le lieu n'était pas relié en base (script `diag-cohorte16-venuefix.ts`) : congres-adf -> Palais des Congrès de Paris ; medfit -> Parc Chanot Marseille ; silmo -> Paris Nord Villepinte ; salon-infirmier + bim-world -> Paris Expo Porte de Versailles (bim-world : correction du lieu erroné La Défense).
- Dates non confirmées mises à null : salon-infirmier (2027). Chiffres assainis : medfit (700).

## À surveiller

- salon-infirmier : dates exactes mars 2027 à actualiser dès annonce.
- hannover-messe : chiffres non audités FKM (communiqués organisateur).
- medteclive : confirmer ville/lieu de l'édition 2028 à l'approche (itinérant).
- Indexation : pousser les 10 fiches en priorité (tasks/gsc-request-indexing-2026-06-19.md).
