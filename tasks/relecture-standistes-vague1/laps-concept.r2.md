# laps-concept : CORRECTIONS

Seconde relecture indépendante, 2026-11-13. Texte FR/EN et JSON-LD relus en prod : email contact@laps-evenements.com, telephone 04 26 00 91 38, Genas 69740. La correction de la passe 1 (email) est bien en base.

## Identité et adresse
- https://www.laps-evenements.fr/mentions-legales/ : "Propriétaire : Alain Françon - SARL 82223385400014 - 12 rue Lionel Terray 69740 Genas" ; ce site est le même que laps-concept.fr (même menu, même en-tête "Laps Concept").
- Registre : SIREN 822233854 LAPS EVENEMENTS, SARL, créée le 2016-08-01, 12 rue Lionel Terray 69740 Genas, active (43.32C, dirigeant Alain Françon). Le nom légal diffère du nom de la fiche, normal (nom du site).
- https://www.laps-concept.fr/nous-contacter/ : "À deux pas d'Eurexpo (Lyon) Nos bureaux sont situés, 12, Rue Lionel Terray, 69740 Genas", "Téléphone 04.26.00.91.38", "E-mail contact@laps-evenements.com". Adresse, téléphone, e-mail OK.

## Texte FR et EN, affirmation par affirmation
- "agence d'agencement et de conception de stands" : titre du site "Spécialistes en agencement et en solutions d'expositions. Stands, Showrooms...". OK.
- "Laps Agencement ... bureaux, magasins et showrooms" : https://www.laps-concept.fr/ce-que-laps-agencement-peut-faire-pour-vous/, "nous sommes spécialisés depuis 20 ans dans l'agencement ... vos bureaux, vos magasins et vos showrooms". Voir correction 1 pour "depuis vingt ans".
- ébénisterie, menuiserie, métallerie, compagnons qualifiés en fabrication et en pose : même page ("Nos savoir-faire sont nombreux : ébénisterie, menuiserie, métallerie ...", "Compagnons qualifiés en fabrication et en pose"). "Interne" est une déduction raisonnable (fiche LEADS : "bureau d'étude et menuiserie intégrés"), acceptée.
- "Laps Événements ... conçoit des stands" : /ce-que-laps-evenements-peut-faire-pour-vous/ ("concevoir et réaliser", "du début à la fin de vos projets d'exposition"). Nuance : plusieurs réalisations de la page d'accueil sont "Conception GL EVENTS, fabrication et montage: LAPS EVENEMENTS" ; "conçoit" reste exact car d'autres lignes disent "Conception, fabrication et montage".
- Easy Expo : https://www.laps-concept.fr/catalogue-de-stands-modulaires/, "Laps évènment c'est aussi une marque de stands modulaires, découvrez Easy Expo". OK.
- Références : https://www.laps-concept.fr/nos-realisations/ publie "TOTAL - Salon EVS32 - Lyon 2019" et "HANKOOK - Solutrans 2023". Deux références, P7 OK.
- EN fidèle. Pas de tiret long ni point médian, 590 et 553 caractères. Aucun segment de 8 mots identique au texte LEADS ou à l'ancienne description.

## Constat 1 : "depuis vingt ans" affirmé sans réserve
Passage FR : "Sous la marque Laps Agencement, elle réalise depuis vingt ans l'aménagement de bureaux...". Le site le dit bien ("spécialisés depuis 20 ans", /ce-que-laps-agencement-peut-faire-pour-vous/), mais l'entité légale du site (LAPS EVENEMENTS) est créée en 2016 au registre (10 ans), et aucune source ne relie "20 ans" à une entité antérieure. C'est le cas P21/P4 d'un écart site contre registre : la fiche doit attribuer la déclaration (précédent : alphaexpo, "fondée en 2004" attribué au site). Correction : "elle indique réaliser depuis vingt ans" (FR) et "it states that it has been fitting out ... for twenty years" (EN). founded_year reste null (bon choix de la passe 1).

## Désaccords / nuances par rapport à la passe 1
- Désaccord : la passe 1 classe la phrase "depuis vingt ans" OK sans noter l'écart avec le registre (2016) ; je la juge à attribuer.
- Accord sur l'email, sur l'identité, sur les références, sur founded_year null, sur la catégorie.
- memberships leads_france : fiche LEADS du dossier existe (https://leads-france.com/agences/laps-concept/, statut 200).

## Corrections à appliquer
```json
{"slug":"laps-concept","set":{"description":"Laps Concept est une agence d'agencement et de conception de stands, basée à Genas dans le Rhône, à deux pas d'Eurexpo Lyon. Sous la marque Laps Agencement, elle indique réaliser depuis vingt ans l'aménagement de bureaux, de magasins et de showrooms, avec un savoir-faire interne en ébénisterie, menuiserie et métallerie assuré par des compagnons qualifiés en fabrication et en pose. Sous la marque Laps Événements, elle conçoit des stands et propose aussi une marque de stands modulaires, Easy Expo. Elle a notamment réalisé des stands pour Total au salon EVS32 à Lyon et pour Hankook au Solutrans.","description_en":"Laps Concept is a stand design and fit-out agency, based in Genas in the Rhône, a stone's throw from Eurexpo Lyon. Under the Laps Agencement brand, it states that it has been fitting out offices, shops and showrooms for twenty years, with in-house expertise in cabinetmaking, joinery and metalwork carried out by qualified craftsmen in manufacturing and installation. Under the Laps Événements brand, it designs stands and also offers a modular stand brand, Easy Expo. It has notably built stands for Total at the EVS32 trade show in Lyon and for Hankook at Solutrans."}}
```
