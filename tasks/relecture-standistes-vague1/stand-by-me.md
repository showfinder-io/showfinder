# stand-by-me : CORRECTIONS

Relecture du 2026-11-13. Le site a été refondu (Next.js, https://www.standbyme.fr/fr) depuis la fiche de septembre : l'e-mail de la base n'y figure plus et le siège légal est au Thor, pas à Paris.

## Identité
- Site répond (http redirige vers https://www.standbyme.fr/fr, 200). Politique de confidentialité : "Stand By Me, Société par actions simplifiée (SAS), Siège social : 210 Avenue De La Cigalière, 84250 Le Thor" (https://www.standbyme.fr/fr/politique-de-confidentialite).
- Registre : SIREN 504157686 "STAND BY ME", créée le 2008-05-01, 210 avenue de la Cigalière 84250 Le Thor, active. Les autres "STAND BY ME" du registre (Luzarches, Le Haillan, Saint-Jean-les-Deux-Jumeaux, Paris 20e cessée) sont des homonymes sans rapport.

## 1. Adresse : city, postal_code, department
Base : city Paris, postal_code null, department 75. Le registre et la politique de confidentialité donnent le siège au Thor (84250, département 84). Le site publie aussi un bureau parisien : "Localisation 57 Rue de l'Ourcq, 75019 Paris" et "210 avenue de la Cigalière, 84250 Le Thor" (https://www.standbyme.fr/fr). P4 : le registre fait foi pour le siège ; Paris reste dit dans le texte ("avec des locaux à Paris et au Thor").
Correction : city "Le Thor", postal_code "84250", department "84".
Conséquence à arbitrer par Julien : la fiche sort du comptage des standistes d'Île-de-France / Paris (le site se vend pourtant comme "Standiste Paris"). Si Julien préfère garder Paris (agence secondaire), le texte reste juste ; seul le code postal 75019 serait alors à ajouter. Choix par défaut ici : siège du registre.

## 2. Contacts
- Téléphone 06 11 27 16 90 : présent dans le JSON-LD du site ("telephone":"+33611271690", https://www.standbyme.fr/fr). Gardé. Le site affiche par ailleurs le contact commercial 06 50 50 92 88.
- E-mail jb.balaresque@standbyme.fr : introuvable sur le site (accueil, /realisations, /savoir-faire, /outdoor, confidentialité). Le site publie "Contact projet projets@standbyme.fr" et la politique de confidentialité "Email : projets@standbyme.fr". Correction : email "projets@standbyme.fr".

## 3. Description (FR et EN), affirmation par affirmation
- "conçoit des stands sur mesure pour les salons professionnels" : "Stand sur mesure pour salons professionnels - conception, fabrication, montage et démontage" (accueil). OK.
- "Au service de projets depuis 2008" : "Au service de projets ambitieux depuis 2008" (accueil). OK, et registre 2008-05-01.
- "conception et la modélisation, la production et la construction en atelier" : "Nos stands sont produits dans nos ateliers" ; "jusqu'à la modélisation 3D" (https://www.standbyme.fr/fr/savoir-faire). OK.
- "logistique et l'installation sur site, du transport au démontage" : "Du transport au montage, notre équipe coordonne chaque étape directement sur site, puis assure le démontage" (savoir-faire). OK.
- "personnel d'accueil, régie technique, captation photo et vidéo" : "besoin de personnel d'accueil, d'un service de catering, d'un DJ, d'une régie technique, ou encore de captation photo/vidéo" (savoir-faire). OK.
- "en France et à l'international" : "accompagne les marques en France et à l'international" (accueil). OK.
- "a engagé un processus de labellisation ISO 20121" : "Un processus de normalisation engagé vers une labellisation ISO 20121 d'ici 2025" (savoir-faire). Texte conforme, mais l'échéance annoncée (2025) est passée et le site ne dit pas si c'est obtenu. Mineur, non corrigé : ne surtout pas écrire "certifiée". À re-vérifier à la prochaine passe.
- Références Saint Gobain (SIAE), Databricks (NRF Europe), Yoplait (Japan Expo) : publiées sur https://www.standbyme.fr/fr/realisations ("SAINT GOBAIN SIAE - 2025 Le Bourget", "DATABRICKS NRF Europe - 2025", "YOPLAIT Japan Expo - 2025"). OK (P7).
- Anglais : fidèle ("premises in Paris and in Le Thor"). OK.

## 4. founded_year, specialties, memberships, catégorie
- founded_year 2008 : OK. specialties : les quatre intitulés sont les quatre onglets de /savoir-faire. memberships leads_france : "Le dirigeant de Stand By Me est membre actif du bureau du LEADS" (savoir-faire). OK. Catégorie standiste : OK.

## Remarque hors lot
Le JSON-LD du site affiche "priceRange":"€€€" et "Standiste expert" : ne rien reprendre (P9, P10).

## Corrections à appliquer
```json
{"slug": "stand-by-me", "set": {"city": "Le Thor", "postal_code": "84250", "department": "84", "email": "projets@standbyme.fr"}}
```
