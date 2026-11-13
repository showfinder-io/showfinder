# arc-et-typ : CORRECTIONS

Relu le 2026-11-13. Le site a été refait depuis le dossier du 2026-09-21 (mentions légales mises à jour le 14 octobre 2026) : plusieurs affirmations de la description ne s'y trouvent plus.

## Identité
- Registre (https://recherche-entreprises.api.gouv.fr/search?q=arc%20et%20typ) : SIREN 444459283 "ARC ET TYP", créée le 2002-12-02, siège 15 rue Hégésippe Moreau 75018 Paris, active. L'autre "ARC & TYP" (SIREN 344811757, Mérignac) est radiée : homonyme sans lien.
- Mentions légales https://arcettyp.com/mentions-legales/ : "ARC ET TYP Société par actions simplifiée (SAS) ... Agencement d'espaces de vente, conception de stands et décoration d'intérieur. Siège social : 15 rue Hégésippe Moreau, 75018 Paris ... SIREN : 444 459 283". Identité confirmée. Remarque : même adresse de siège qu'Équateur Expo dans la base (sans conséquence ici).

## Adresse et contacts
- city Paris, postal_code 75018, department 75 : confirmés (registre et mentions légales).
- Téléphone 01 42 46 75 53 et e-mail contact@arcettyp.com : https://arcettyp.com/contact/ "Paris, France 43, rue Ganneron, 75018 Paris 01 42 46 75 53 contact@arcettyp.com" et mentions légales. OK.

## Description : constats
1. MAJEUR, à retirer : "issus notamment de l'École Boulle et de l'ENSAAMA Olivier de Serres" et "une équipe pluridisciplinaire de profils marketing, communication, design et architectes". Aucune de ces écoles ni cette composition d'équipe n'apparaît sur https://arcettyp.com/a-propos/, /services/, /projets/, l'accueil (recherche exhaustive : "Boulle", "ENSAAMA", "Olivier de Serres" absents).
2. MAJEUR, à retirer : "environ 300 projets par an en Europe, en Asie, au Moyen-Orient et sur le continent américain". "300 projets", "Asie", "Moyen-Orient", "Amériques" sont absents du site actuel (P8 : chiffre sans citation). Le site dit seulement "Depuis plus de 20 ans" et "Présente à Paris, Bordeaux et Dubaï" (https://arcettyp.com/a-propos/).
3. MAJEUR, à retirer (P7) : "un stand pour SNCF Top Resa, un agencement pour MINI et une réalisation pour AIXAM au Mondial de l'Auto". "SNCF", "Top Resa", "AIXAM" et "Mondial de l'Auto" sont absents de https://arcettyp.com/projets/ (qui liste d'autres clients, par exemple "Andros SIRHA", "Ministère des Armées Eurosatory", "Porsche Salon de l'auto"). Je n'en reprends aucun : le type de prestation par client n'est pas lisible sur la liste (P7, dans le doute rien). Julien peut en ajouter deux ou trois s'il les fait relire sur les pages projets.
4. MAJEUR, à retirer : "avec une présence également à Bordeaux et Aix-en-Provence". Le site dit "Présente à Paris, Bordeaux et Dubaï" ; "Aix" n'apparaît nulle part. Dubaï remplace Aix-en-Provence.
5. À corriger : "agence d'architecture parisienne" : le site se décrit comme "agence de design expérientiel" (méta-description) et les mentions légales disent "Agencement d'espaces de vente, conception de stands et décoration d'intérieur". Formulation reprise des mentions légales.
6. "Fondée en 2002" : registre 2002-12-02 et site "Depuis plus de 20 ans". OK. "agencements pérennes" : accueil "Éphémère ou pérenne". OK.
7. Ajout vérifié : "médaille Gold EcoVadis" (https://arcettyp.com/a-propos/ "Récompensée par la médaille Gold EcoVadis" ; accueil "Médaille d'Or EcoVadis", "score de 75 % ... janvier 2025, soit une catégorie GOLD"). Libellé exact conservé, sans chiffre.
8. Quatre expertises : https://arcettyp.com/services/ "Conseil & Performance", "Stratégie & Narration", "Design & Graphisme", "Ingénierie & Technique" (accueil : "CONSEIL ET PERFORMANCE", "STRATÉGIE ET NARRATION", "DESIGN ET GRAPHISME", "INGÉNIERIE ET PRODUCTION"). Types de projets : https://arcettyp.com/agence-amenagement-stand/ "Stands de salon, showrooms, espaces événementiels et corners retail".

## Données structurées
- specialties : "pop-up store" est absent du site (recherche "pop-up" sur toutes les pages : aucun résultat), à retirer. "conception de stands et agencements" reformulé en deux libellés du site. Showrooms : pages "aménagement showroom" du site.
- zone_intervention "Europe, Asie, Moyen-Orient et Amériques" (hors champs du JSON demandé) : non soutenue par le site, à passer à null.
- founded_year 2002 : OK. memberships leads_france : conservé. category standiste : OK ("Standiste Paris" en tête de l'accueil, "conception de stands" aux mentions légales).

```json
{
  "slug": "arc-et-typ",
  "set": {
    "zone_intervention": null,
    "description": "Arc et Typ est une agence parisienne d'agencement d'espaces de vente et de conception de stands, dont le siège est dans le 18e arrondissement de Paris (75018). Fondée en 2002, elle conçoit des stands de salon, des showrooms, des espaces événementiels et des corners retail, en projets éphémères comme pérennes. Son offre réunit quatre expertises présentées sur son site : conseil et performance, stratégie et narration, design et graphisme, ingénierie et production. L'agence indique être présente à Paris, à Bordeaux et à Dubaï. Elle a obtenu la médaille Gold EcoVadis.",
    "description_en": "Arc et Typ is a Paris-based agency specialising in the fit-out of retail spaces and the design of stands, with its head office in the 18th arrondissement of Paris (75018). Founded in 2002, it designs trade show stands, showrooms, event spaces and retail corners, as both ephemeral and permanent projects. Its offer brings together four areas of expertise presented on its website: consulting and performance, strategy and storytelling, design and graphics, engineering and production. The agency states that it is present in Paris, Bordeaux and Dubai. It has been awarded the EcoVadis Gold medal.",
    "specialties": [
      "conception de stands",
      "showrooms",
      "agencement d'espaces de vente",
      "design événementiel"
    ]
  }
}
```
