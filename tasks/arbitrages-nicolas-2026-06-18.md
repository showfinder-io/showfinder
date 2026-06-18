# Cohorte 15 - arbitrages & intégration (2026-06-18)

9 fiches publiées (writer Opus + 2 reviewers Sonnet) + 1 dédup. Toutes `status=published`, `editorial_mdx` en DB.

## Fiches publiées (rolls d'édition)

| slug | édition | correction DB majeure |
|------|---------|------------------------|
| solar-solutions-international-amsterdam | 2027 (15e) | rebranding **Solar Solutions -> Sustainable Solutions** (name + organizer + website roulés) |
| playtime-paris | 2026 (session été, 27-29 juin) | fréquence annuel -> **semestriel** (2 sessions/an) ; organizer Playtime -> **Picaflor** |
| adf-pcd-paris | 2027 (3-4 fév) | co-orga **FEA** ; chiffres = Paris Packaging Week semaine complète (cf arbitrage 1) |
| food-hotel-tech-paris | 2027 (10e) | racheté par **Easyfairs** (avr. 2026) |
| salon-bois-energie | 2027 (Nantes, 3-4 fév) | organizer Bois Energie SAS -> **BEES SAS** ; visiteurs 7000 -> **3000** |
| elearning-expo-paris | 2027 (9-10 juin) | organizer Weyou -> **Infopromotions** ; fiche refaite (structure v3 + maillage interne solutions-rh / learning-technologies-paris) |
| sepag | **2028** (biennal années paires) | organizer "Comexposium" FAUX -> **CCI Drôme + Ardèche** ; dates 2028 non encore publiées (null) |
| cosmetagora-paris | 2027 (19e) | organizer -> **Société Française de Cosmétologie** |
| hacking-health-strasbourg | 2027 | organizer -> **Health Factory + OpenCare Lab** ; visiteurs 1500 -> **400+** |

## Dédup

- **pcd-congress-paris** = doublon de adf-pcd-paris (même réalité : section PCD de la Paris Packaging Week, le "congrès" = talk stages internes, pas un événement autonome). DELETE en DB + 301 `/salons/pcd-congress-paris` -> `/salons/adf-pcd-paris` (redirects-audit-catalogue.json).

## Arbitrages Julien (2026-06-18)

1. **adf-pcd** : on garde la fiche telle quelle, chiffres = Paris Packaging Week semaine complète (14 442 visiteurs / 915 exposants). Risque R17 (chiffre méta-salon attribué à un composant) assumé : la fiche couvre ADF&PCD au sein de la PPW.
2. **sepag** : on publie malgré l'édition lointaine (2028, biennal).
3. **RSE** : voir ci-dessous (cause + correctif RR42).
4. **solar** : on renomme le champ `name` en "Sustainable Solutions Amsterdam (ex-Solar Solutions)".

## RSE : cause racine + correctif durable (RR42)

Bloc RSE faible sur 6/9 fiches au 1er run. Cause : (a) profil longue-traîne (petits salons sans page RSE propre) ; (b) surtout, trou de méthode : les writers cherchaient une page RSE sur le site de l'événement mais pas le **programme RSE du groupe organisateur** ni l'**ISO 20121** ni la **RSE du lieu**. Preuve : adf-pcd et food-hotel-tech (même organisateur Easyfairs) avaient un bloc RSE de qualité inégale. Repasse RSE effectuée : 6 blocs re-sourcés (Easyfairs "Act for the Future", Weyou Group, CCI "Dynamic R", Viparis ISO 20121, Expo Greater Amsterdam Green Key, etc.). Règle **RR42** ajoutée à `regles-edito-agoris-v1.md` (vérifier 4 niveaux de sources RSE par défaut).

## À surveiller (J+7 / J+30)

- sepag : actualiser dates dès annonce officielle 2028 sur rsd3.fr.
- adf-pcd / food-hotel-tech : co-localisations et hall à reconfirmer à l'approche.
- Indexation : pousser les 9 fiches en priorité (cf tasks/gsc-request-indexing-2026-06-18.md).
