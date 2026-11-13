# merci-gustave : NE PAS OUVRIR

Relu le 2026-11-13. L'entreprise existe et fait des stands, mais elle n'a pas d'entité française et son siège est au Canada : la fiche (ville Paris, département 75, rangée dans les standistes "dont le siège est en France" des hubs) ne peut pas être ouverte à l'indexation en l'état. Même cas que Pico International France dans la relecture de référence (point tranché 2).

## Identité
- Mentions légales https://mercigustave.co/mentions-legales/ : "Merci Gustave Inc ... Responsable éditorial : David Lucion. Siège social : 108 Rue Les Bouleaux, Laval QC, H7R 1E2, Canada". Le JSON-LD du site porte aussi "Merci Gustave Inc". Aucune adresse, aucun SIREN, aucun RCS français sur le site.
- Registre français (https://recherche-entreprises.api.gouv.fr/search?q=merci%20gustave, et q=lucion, q=booth%20company) : aucune entité active. Seule homonyme : MERCI GUSTAVE SAS, SIREN 522069103, 53 bd Ornano 93200 Saint-Denis, NAF 46.49Z (commerce de gros), radiée le 2016-11-08 : sans rapport avec l'agence (le site date de 2019 et la fiche n'en dépend pas). Aucune société dirigée par David Lucion liée à l'agence.
- Le site répond (200). La seule mention de Paris est une déclaration : https://mercigustave.co/agence/ "Merci Gustave est une agence de design de stand basée à Paris et Montréal". Pas d'adresse parisienne publiée, nulle part (accueil, /agence/, /contact/, mentions légales).

## Constats sur la fiche
1. city "Paris", department "75", postal_code null : non prouvés par une source adressable (P4 : le registre fait foi pour le siège ; ici le siège légal est à Laval, Canada). Les hubs comptent la fiche parmi les standistes dont le siège est en France : faux.
2. Téléphone 06 85 85 14 19 : OK, https://mercigustave.co/contact/ "Tel : +33 6 85 85 14 19" (le site publie aussi +1 450 700 1878 et +1 (367) 321-1982).
3. E-mail gustave@mercigustave.co : ABSENT du site. Le site publie contact@mercigustave.co (mentions légales). À remplacer si la fiche est un jour ouverte.
4. Description, passages vérifiés OK : "quatre familles de produits" (menu : Stand modulaire, Stand tubulaire, Stand nomade, Accessoires) ; laminage sur bois en 1996, Duo Display au Canada en 2008, développement du stand modulaire et de l'impression numérique sur textile, création de sa structure en 2019 pour les exposants français vers l'Amérique du Nord (https://mercigustave.co/agence/, FAQ "Quelle est l'histoire de Merci Gustave ?") ; regroupement de The Booth Company et The Portable Company sous Merci Gustave (même page) ; clin d'oeil à Gustave Eiffel (https://mercigustave.co/agence/) ; "France, Europe et Amérique du Nord" (pied de page : "en France, en Europe et en Amérique du Nord").
   - "avec des bureaux à Paris et à Montréal" : le site dit "basée à Paris et Montréal" : attribuable au site, mais la formulation doit être "se présente comme basée à Paris et Montréal" tant qu'aucune adresse n'est publiée.
   - "Le nom de l'agence est un clin d'œil à Gustave Eiffel" : OK.
5. founded_year 2019 : cohérent avec le texte du site (création de sa structure en 2019), pas de registre. Admissible (P21).

## Décision
NE PAS OUVRIR (matière insuffisante sur la localisation française, entité canadienne). Garder la fiche en noindex et la sortir du comptage des hubs "siège en France" (catégorie `autre` ou exclusion, comme Pico). Si Julien tranche de la garder malgré tout : city/postal_code/department à vider (null), email à "contact@mercigustave.co", description à reformuler avec "se présente comme basée à Paris et Montréal" et "siège au Canada" ; ce n'est pas proposé ici en bloc JSON car la décision de fond (présence française réelle) lui revient.
