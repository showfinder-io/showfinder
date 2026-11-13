# idee-fixe : OK

Seconde relecture indépendante, 2026-11-13. Page publiée relue en direct (FR et EN, JSON-LD) avant lecture du rapport de première passe.

## Constats
- Identité : registre SIREN 353186505 "IDEE FIXE", créée 1990-02-01, ZA du Croissant, rue du Poirier 50380 Saint-Pair-sur-Mer, active (recherche-entreprises.api.gouv.fr). Mentions légales du site : "Siège social : ST PAIR SUR MER rue du poirier – 50380 Saint-Pair-Sur-Mer" (https://www.ideefixe.fr/mentions-legales/). Page contact : "Granville ZA du Croissant, rue du poirier 50380 Saint-Pair-Sur-Mer (siège) 02 33 49 38 04" (https://www.ideefixe.fr/contact). JSON-LD publié : addressLocality Saint-Pair-sur-Mer, postalCode 50380, foundingDate 1990, telephone 02 33 49 38 04, pas d'e-mail. Conforme.
- Téléphone 02 33 49 38 04 : numéro du siège sur /contact. Conforme. L'e-mail fpicot@ideefixe.fr n'existe nulle part sur ideefixe.fr (grep sur accueil, contact, agence, engagements, mentions) ; il vient de la fiche LEADS (https://leads-france.com/agences/idee-fixe/). Son absence du JSON-LD est correcte.
- Texte FR, affirmation par affirmation :
  - "depuis 1990" : "Conception et fabrication de stands sur-mesure et agencements d'espaces depuis 1990" (accueil).
  - "Paris, Granville et Nantes" : "présente à Paris, Granville et Nantes" (https://www.ideefixe.fr/lagence-idee-fixe/).
  - "fabrication internalisée dans les ateliers ... en Normandie" : "Dans nos ateliers en Normandie, nos artisans donnent vie à vos projets" et "Internalisation : Tout est maitrisé et intégré" (/lagence-idee-fixe/).
  - éphémère (stands sur-mesure, pop-up stores) / durable (bureaux, showrooms, hotels, restaurants) : /lagence-idee-fixe/. "commerces" : menu "Agencement de commerces".
  - "luxe, agroalimentaire, industrie ou santé" : rubriques du site "Agroalimentaire", "Industrie", "Luxe & Cosmétique", "Santé" (https://www.ideefixe.fr/les-realisations-idee-fixe/) ; la fiche LEADS liste "agroalimentaire, industrie, services, santé, vins, spiritueux & luxe".
  - "France, en Europe et à l'international" : "Nos différents bureaux nous permettent de vous accompagner en France, en Europe et l'International" (/lagence-idee-fixe/).
  - "certifiée ISO 20121" : "nous sommes certifiés ISO 20121 par l'AFNOR" (https://www.ideefixe.fr/les-engagements-idee-fixe/).
  - Aucune mention de Leads, aucune référence client, aucun chiffre : P5, P7, P8 respectés.
- FR et EN : mêmes faits, même ordre, mêmes interdits. specialties, founded_year 1990, memberships leads_france (confirmé : "Idée Fixe est membre du Leads" sur le site) conformes.
- Zone d'intervention "France, Europe et international" : verbatim du site.
- Catégorie standiste : confirmée (conception, fabrication, installation et démontage de stand).

## Remarques non bloquantes
- EN : "Normandie" laissé en français ; l'exonyme anglais est "Normandy". Le choix est défendable (P19, noms propres non traduits), à trancher.
- Le département ne se lit pas sur la page publiée (le JSON-LD n'a que ville et code postal). Je n'ai pas interrogé la base : à vérifier que department = 50 (le rapport de première passe le fixe à 50).
- JSON-LD `image` pointe vers un fichier hébergé chez leads-france.com (https://leads-france.com/wp-content/uploads/2021/04/Capturebig-1-700x562.jpg) : hotlink vers un tiers, hors sujet de cette relecture.
- La page /mentions-legales/ du site affiche "Téléphone : +33 1 4026 3241", numéro sans cohérence avec le reste (probablement celui du prestataire du site) : non repris, bien.

## Désaccords avec la passe 1
Aucun. Les corrections annoncées (ville, code postal, e-mail à null, retrait de la mention Leads) sont bien visibles sur la page publiée, pas de retard de cache.
