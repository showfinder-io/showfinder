# pech-up : writer (2026-11-13)

État en base : description FR 106 mots, EN 105 mots, téléphone et e-mail présents. Mais les deux coordonnées ne sont pas celles que le site publie (voir Données structurées), et la description contient une mention d'annuaire interdite (« fait partie du réseau LEADS France », P5) et un fait non retrouvé (« Elle intervient à Eurexpo Lyon »). Réécriture complète.

## Identité

- Registre (q=884382367) : SIREN 884382367, PECH'UP, créée le 2020-06-04, active, siège 29 RUE DU RAVE 69390 MILLERY, NAF 43.32C.
- Mentions légales https://pechup.fr/mentions-legales/ : « PECH’UP / SARL au capital de 5000 € », « RCS Lyon 88438236700024 », « Siège social : 20 Rue du Rave– 69390 Millery – France » (numéro de rue 20 sur le site, 29 au registre : sans effet sur ville et CP).
- Pied de page de toutes les pages : « Pech’Up / 92 Rte des Varennes / 69700 Beauvallon / 04 37 22 06 58 / contact@pechup.fr ». Beauvallon = adresse d'exploitation affichée ; P4 : le siège du registre fait foi (décision déjà tranchée dans tasks/relecture-agent-prestataires-2026-11-12.md, point 6). City/CP/département inchangés : Millery, 69390, 69.

## Sources et citations

1. Standiste, siège Millery : registre + mentions légales ci-dessus ; https://pechup.fr/ titre « Standiste à Lyon – Conception de Stands Sur-Mesure | PECH'UP »
2. Adresse à Beauvallon : pied de page « 92 Rte des Varennes / 69700 Beauvallon »
3. Créée en 2020 par Lydie et François : https://pechup.fr/qui-sommes-nous/ « PECH’UP, c’est tout d’abord l’histoire de Lydie, une femme passionnée par l’événementiel, qui a longtemps évolué dans de grandes structures. » ; « François, menuisier de métier, lui propose son aide. » ; « En 2020, PECH’UP naît. » ; registre 2020-06-04.
4. Stands modulaires réutilisables : https://pechup.fr/nos-realisations/ « Stands modulaires : adaptables, réutilisables, parfaits pour vos salons en série. »
5. Stands hybrides et atelier de menuiserie intégré : https://pechup.fr/stand-dexposition/ « Notre force réside dans notre capacité à combiner l’intelligence du stand modulable » ; « Le sur-mesure , via notre atelier de menuiserie intégré, nous offre la liberté de créer des éléments uniques »
6. (non repris dans le texte final, faute de place) Bureau d'études et simulation 3D : https://pechup.fr/stand-dexposition/ « Notre bureau d’étude interne imagine des stands à forte valeur ajoutée » ; https://pechup.fr/ « PECH’UP vous offre une simulation 3D de votre futur stand avant la mise en production. »
7. 9 à 300 m², vente ou location : https://pechup.fr/ « Un accompagnement clé en main : design, fabrication, exposition, stockage. De la vente, à la location, pour des stands de 9 à 300 m² éco conçus. »
8. Stockage entre deux salons : https://pechup.fr/stand-dexposition/ « Stockage : nous assurons le stockage de votre matériel entre deux événements »
9. Aménagements : https://pechup.fr/nos-realisations/ « Aménagements d’espaces : showrooms, corners, halls d’accueil… chaque m² optimisé. »
10. Toute la France : https://pechup.fr/ (FAQ) « Nous intervenons sur l’ensemble du territoire français, y compris à Paris, Lyon, Marseille, Lille ou encore Bordeaux. »
11. Références (page réalisations https://pechup.fr/nos-realisations/, P7, trois maximum) : « REHAU – ARTIBAT 2025 – 54M2 » ; « WURTH ELEKTRONIK – GLOBAL INDUSTRIE 2025 – 49M2 » ; « FEDERATION FRANCAISE DE LA MOTO – SALON DU 2 ROUES 2026 – 108M2 ». (L'ancienne référence « B Mesure » reste publiée, « B MESURE – GLOBAL INDUSTRIE 2025 », remplacée par la plus récente pour rester à trois.)

## Données structurées

- phone : « 04 37 22 06 58 » à la place de « 06 67 47 72 46 ». Le site affiche partout « 04 37 22 06 58 » (pied de page, et https://pechup.fr/contact/ « Téléphone : 04 37 22 06 58 »). Le 06 67 47 72 46 n'apparaît qu'en cible cachée du lien (`href="tel:0667477246"` sous le texte 04 37 22 06 58) : non affiché, donc non retenu.
- email : « contact@pechup.fr » à la place de « lydie.pechmalbec@pechup.fr ». https://pechup.fr/contact/ « Mail : contact@pechup.fr » ; l'adresse nominative n'apparaît sur aucune page du site (0 occurrence dans les 9 pages lues) : donnée personnelle non sourcée, à retirer.
- specialties : ajout de « location de stand » (https://pechup.fr/ « PECH’UP propose des formules flexibles d’achat ou de location de stand. »). Les quatre existants restent prouvés.
- zone_intervention « France » : inchangé (FAQ ci-dessus).
- founded_year 2020 : inchangé (registre et site).
- memberships ["leads_france"] : inchangé (le pied de page renvoie vers leads-france.com) ; la mention sort du texte (P5).

## Alertes

- Le site emploie « premium », « haut de gamme », « finition irréprochable » : non repris (P10).
- Avis Google affichés sur le site (Trustindex) : non utilisés (P1).

```json
{
  "slug": "pech-up",
  "set": {
    "description": "Pech'Up est un standiste dont le siège est à Millery (Rhône), avec une adresse d'exploitation à Beauvallon. Créée en 2020 par Lydie, venue de l'événementiel, et François, menuisier, l'entreprise conçoit des stands modulaires, réutilisables d'un salon à l'autre, et des stands hybrides qui associent une structure modulaire à des éléments sur mesure fabriqués dans son atelier de menuiserie intégré. Les stands, de 9 à 300 m², sont proposés à la vente ou à la location, avec stockage entre deux salons. Pech'Up réalise aussi des aménagements de showrooms, corners et halls d'accueil, et intervient dans toute la France. Ses réalisations publiées comptent des stands pour Rehau à Artibat 2025, Würth Elektronik à Global Industrie 2025 et la Fédération française de la moto au Salon du 2 Roues 2026.",
    "description_en": "Pech'Up is an exhibition stand company headquartered in Millery (Rhône), with an operating address in Beauvallon. Founded in 2020 by Lydie, who came from the events industry, and François, a joiner, the company designs modular stands that can be reused from one trade show to the next, and hybrid stands that combine a modular structure with bespoke elements made in its in-house joinery workshop. Stands from 9 to 300 m² are available to buy or to rent, with storage between shows. Pech'Up also fits out showrooms, corners and reception areas, and works throughout France. Its published projects include stands for Rehau at Artibat 2025, Würth Elektronik at Global Industrie 2025 and the Fédération française de la moto at the Salon du 2 Roues 2026.",
    "phone": "04 37 22 06 58",
    "email": "contact@pechup.fr",
    "specialties": ["stand modulaire", "stand hybride", "aménagement d'espace", "location de stand", "écoresponsabilité"]
  }
}
```
