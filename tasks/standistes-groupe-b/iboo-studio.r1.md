# iboo-studio : CORRECTIONS

Relecteur 1 (2026-11-13). Sources re-fetchées : site officiel et registre recherche-entreprises.api.gouv.fr.

## Constats

- MINEUR : EN « projects carried out for export » est un calque maladroit de « réalisés à l'export ». Reformulé en « more than 150 export projects, in 25 countries ». Citation : https://iboostudio.com/international/ « PLUS DE CENT CINQUANTE PROJETS RÉALISÉS À L’EXPORT, DANS 25 PAYS, SUR LES 5 CONTINENTS ».
- Vérifié sans écart : registre SIREN 444232508, I-BOO STUDIO, créée 2002-10-30, active, siège 7 rue Georges Clemenceau 56400 Auray. https://iboostudio.com/le-studio/ « Ses fondateurs, Emmanuelle et Hervé Bossard, architectes d’intérieur » et « créer leur propre agence Iboo Studio en 2002 ». https://iboostudio.com/360-2/ : production, « Transport et stockage », « Montage et démontage », catering, gardiennage, hôtes et hôtesses. https://iboostudio.com/stands-et-dispositifs-digitaux/ « Stand virtuel ou hybride, 3D temps réel et réalité augmentée ». https://iboostudio.com/succes-story-2/ : Zodiac Aerospace « de 2005 à 2017 », « 7 salons Batimat successifs » (Mantion), Gican « Pavillon Collectif » : trois références, sans adjectif. Téléphone 02 97 58 33 71 (page contact). Aucune adresse e-mail dans le HTML de l'accueil, de la page contact ni des mentions légales : e-mail reste null (la fiche reste sans e-mail, téléphone suffisant).
- Remarque : « Morbihan » n'est pas écrit sur le site, mais c'est le département 56 du code postal du registre : fait de géographie, non retenu comme anomalie.
- Alerte hors json : website_url en base est en http://, le site sert https://iboostudio.com/ (champ non touché).
- FR/EN cohérents, 839 caractères FR.

```json
{
  "slug": "iboo-studio",
  "set": {
    "description": "Iboo Studio est une agence de design de stands basée à Auray (Morbihan), créée en 2002 par Emmanuelle et Hervé Bossard, architectes d'intérieur. Elle conçoit des stands traditionnels menuisés sur mesure, des stands éco-modulables réutilisables d'un salon à l'autre et des pavillons collectifs pour les regroupements d'entreprises, et prend en charge la production, le transport, le montage, le démontage et le stockage. Elle propose aussi des services sur le salon (hôtesses, catering, gardiennage) et des dispositifs digitaux (stand virtuel ou hybride, réalité augmentée). L'agence fait état de plus de 150 projets réalisés à l'export, dans 25 pays. Ses réalisations publiées comptent le stand de Zodiac Aerospace au salon aéronautique du Bourget de 2005 à 2017, sept salons Batimat pour Mantion et des pavillons collectifs pour le Gican.",
    "description_en": "Iboo Studio is a stand design agency based in Auray (Morbihan), founded in 2002 by Emmanuelle and Hervé Bossard, both interior architects. It designs traditional bespoke joinery stands, eco-modular stands that can be reused from one trade show to the next, and collective pavilions for groups of companies, and handles production, transport, build, dismantling and storage. It also offers on-site services (hosts and hostesses, catering, security) and digital solutions (virtual or hybrid stand, augmented reality). The agency reports more than 150 export projects, in 25 countries. Its published projects include Zodiac Aerospace's stand at the Le Bourget air show from 2005 to 2017, seven Batimat shows for Mantion and collective pavilions for Gican."
  }
}
```
