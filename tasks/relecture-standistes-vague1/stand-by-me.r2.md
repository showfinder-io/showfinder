# stand-by-me : OK

Seconde relecture indépendante, 2026-11-13. Texte FR/EN et JSON-LD relus en prod (www.agoris.io, FR et /en) : l'état en base est celui de la passe 1 après correction (city Le Thor, postal_code 84250, email projets@standbyme.fr), le cache a rattrapé la base.

## Identité et adresse
- Registre (recherche-entreprises.api.gouv.fr) : SIREN 504157686 STAND BY ME, créée le 2008-05-01, 210 avenue de la Cigalière 84250 Le Thor, active. Les autres "STAND BY ME" (Luzarches, Le Haillan, Saint-Jean-les-Deux-Jumeaux, Paris 20e cessée) sont des homonymes.
- https://www.standbyme.fr/fr/politique-de-confidentialite : "Forme juridique : Société par actions simplifiée (SAS) Siège social : 210 Avenue De La Cigalière, 84250 Le Thor". Siège au Thor confirmé. Bureau parisien : "57 Rue de l'Ourcq, 75019 Paris" (accueil), donc "locaux à Paris et au Thor" est exact.
- JSON-LD Agoris : addressLocality Le Thor, postalCode 84250, foundingDate 2008, telephone, email projets@standbyme.fr, areaServed "France et international". Cohérent.

## Texte FR et EN, affirmation par affirmation
- "conçoit des stands sur mesure pour les salons professionnels", "depuis 2008" : accueil, "Au service de projets ambitieux depuis 2008". OK.
- conception et modélisation, production en atelier, logistique du transport au démontage : https://www.standbyme.fr/fr/savoir-faire ("modélisation 3D", "Nos stands sont produits dans nos ateliers", "Du transport au montage ... puis assure le démontage"). OK.
- personnel d'accueil, régie technique, captation photo et vidéo : même page ("personnel d'accueil, ... d'une régie technique, ... captation photo/vidéo"). OK.
- "en France et à l'international" : accueil. OK.
- ISO 20121 : savoir-faire, "Un processus de normalisation engagé vers une labellisation ISO 20121 d'ici 2025". Formulation du texte ("a engagé un processus") conforme et non surdite. Réserve non bloquante : l'échéance 2025 est passée et le site n'annonce pas d'obtention ; à re-vérifier au prochain passage, ne jamais écrire "certifiée".
- Références Saint Gobain (SIAE), Databricks (NRF Europe), Yoplait (Japan Expo) : https://www.standbyme.fr/fr/realisations ("SAINT GOBAIN SIAE - 2025 Le Bourget", "DATABRICKS NRF Europe - 2025", "YOPLAIT Japan Expo - 2025 Paris, Nord Vill..."). Trois références, P7 respecté.
- EN fidèle, mêmes faits. Pas de tiret long ni point médian (contrôle automatique sur FR et EN), longueurs 697 et 611 caractères. Aucun segment de 8 mots identique au texte LEADS ou à l'ancienne description (contrôle automatique).

## Données structurées
- founded_year 2008 : registre + site. specialties : les quatre onglets de /savoir-faire. memberships leads_france : fiche LEADS du dossier (https://leads-france.com/agences/stand-by-me/) et mention du site. zone_intervention "France et international" : accueil, "en France et à l'international". Catégorie standiste OK.

## Désaccords / nuances par rapport à la passe 1
- Téléphone 06 11 27 16 90 : la passe 1 l'a gardé car il est dans le JSON-LD du site. Je confirme : "telephone":"+33611271690" est bien dans le JSON-LD de https://www.standbyme.fr/fr (et c'est le numéro de la fiche LEADS). Nuance : le site n'affiche en clair que le 06 50 50 92 88 (en-tête de chaque page et "Contact commercial", https://www.standbyme.fr/fr). Deux numéros officiels, l'un visible, l'autre en données structurées. Pas d'erreur, pas de correction imposée ; si Julien préfère le numéro que le visiteur voit sur le site, le changer pour 06 50 50 92 88.
- Le JSON-LD du site porte aussi adresse Paris 75019, "priceRange":"€€€", "Standiste expert" : rien repris côté Agoris (bien). La passe 1 le note déjà.
- Sinon, accord complet avec la passe 1.

## Corrections à appliquer
Aucune (les corrections de la passe 1 sont déjà en base et visibles en prod).
