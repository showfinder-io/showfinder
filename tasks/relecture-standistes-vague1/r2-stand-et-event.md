# r2-stand-et-event : CORRECTIONS

Relu le 2026-11-13. Méthode de la relecture de référence du 2026-11-12 (site officiel re-fetché, registre, base).

## Identité
- Registre (https://recherche-entreprises.api.gouv.fr/search?q=R2%20STAND%20ET%20EVENT) : SIREN 522816339 "R2 STAND & EVENT", créée le 2010-06-01, 26 rue de l'Orillon 75011 Paris, active. Établissement lyonnais distinct : SIREN 942820796 "R2 STAND & EVENT LYON", créé le 2025-04-01, 3 rue de Genève 69006 Lyon, actif.
- Site https://www.r2-stand.com/ répond (200). JSON-LD Organization : legalName "R2 Stand & Event", foundingDate "2010-06-03", PostalAddress "26 RUE DE L'ORILLON", "PARIS", "75011", vatID FR60522816339. Pas un homonyme.

## Adresse et contacts
- city Paris, postal_code 75011, department 75 : confirmés (registre et JSON-LD).
- Téléphone 01 46 99 92 60 : le site publie "+33 146 999 260" (https://www.r2-stand.com/contact/, JSON-LD contactPoint). Même numéro. OK.
- E-mail hello@r2stand-event.com : publié sur https://www.r2-stand.com/contact/ et dans le JSON-LD. OK.

## Description (affirmation par affirmation)
- "Basée à Paris, avec une agence à Lyon" : https://www.r2-stand.com/contact/ "R2 Stand & Event 26 rue de l'Orillon 75011 Paris, France R2 Stand Lyon 3 rue de Genève 69006 Lyon, France". OK.
- "stands sur mesure, stands modulaires, pavillons ou chalets" : accueil, menu "Stands sur-mesure / Stands modulaires / Pavillons / chalets". OK.
- "conception graphique et technique, fabrication, montage, logistique et stockage" : accueil "De la conception graphique et technique au montage en passant par la fabrication, la logistique et le stockage". OK.
- "salons professionnels, foires et expositions" : accueil "salons professionnels, expos ou foires". OK.
- "agencement retail" : accueil "Retail & Agencement Mettre en valeur vos produits et services". OK.
- "intervient partout en France et à l'international" : accueil "R2 Stand intervient partout en France, et à l'international". OK.
- MINEUR, à corriger : "l'organisation de salons et d'événements B2B". La page https://www.r2-stand.com/organisation-salons/ dit "Organisateur de salon professionnels et grand public en France et à l'International". "B2B" n'est pas dans le texte du site et exclut le grand public. Remplacé par "salons professionnels et grand public".
- Aucune référence client, aucun chiffre, aucun superlatif, aucune certification dans le texte. Rien d'autre à retirer.

## Données structurées
- specialties : "stands sur-mesure", "stands modulaires", "pavillons / chalets", "organisation de salons", "agencement retail" : toutes présentes dans le menu du site. OK.
- founded_year null : le registre donne 2010-06-01 et le JSON-LD "foundingDate":"2010-06-03" (P21). Proposé : 2010.
- memberships leads_france : non vérifiable ici (donnée de fichier annuaire), conservé.
- category standiste : OK (conception, fabrication, montage de stands).

```json
{
  "slug": "r2-stand-et-event",
  "set": {
    "description": "Basée à Paris, avec une agence à Lyon, R2 Stand et Event conçoit et fabrique des stands sur mesure, des stands modulaires et des pavillons ou chalets pour les salons professionnels, foires et expositions. L'entreprise prend en charge la conception graphique et technique, la fabrication, le montage, la logistique et le stockage des projets. Elle propose également de l'agencement retail, pour mettre en valeur les produits et services de ses clients, ainsi que l'organisation de salons professionnels et grand public. R2 Stand et Event intervient partout en France et à l'international.",
    "description_en": "Based in Paris, with an office in Lyon, R2 Stand et Event designs and manufactures custom-made stands, modular stands, and pavilions or chalets for trade shows, fairs and exhibitions. The company handles graphic and technical design, manufacturing, assembly, logistics and storage for each project. It also offers retail fit-out services, to showcase clients' products and services, as well as the organisation of trade shows for professionals and the general public. R2 Stand et Event operates throughout France and internationally.",
    "founded_year": 2010
  }
}
```
