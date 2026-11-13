# agence-procept : CORRECTIONS

Relu le 2026-11-13, seconde passe indépendante. Texte en base lu sur https://www.agoris.io/prestataires/agence-procept et /en/ (JSON-LD : Paris, 75007, +33 1 88 33 57 57, contact@procept.co, foundingDate 2016).

## Identité et registre
- https://recherche-entreprises.api.gouv.fr/search?q=PROCEPT%20114%20rue%20de%20Grenelle : SIREN 822593703 "PROCEPT EVENT", créée le 2016-09-07, 114 rue de Grenelle 75007 Paris, NAF 74.10Z, dirigeant CASSIN, active. Les autres "PROCEPT" (Vermelles, Mareil-Marly...) sont des homonymes.
- Site https://www.agence-procept.com/ (200) : "114 rue de Grenelle 75007, Paris", "Procept Event". Identité confirmée.

## Contacts
- https://www.agence-procept.com/contact/ : "+33 (0)1.88.33.57.57", "contact@procept.co", "114 rue de Grenelle 75007, Paris". Concordance.

## Description FR et EN, affirmation par affirmation
- "agence d'architecture événementielle" : accueil "ARCHITECTURE ÉVÉNEMENTIELLE". OK.
- "114 rue de Grenelle à Paris (75007)" : contact et pied de page. OK.
- "Fondée en 2016 par Alexis Cassin" : https://www.agence-procept.com/a-propos/ "Fondée en 2016 par Alexis Cassin" ; registre 2016-09-07. OK.
- "agencement, installation générale et salons & stands sont les trois catégories" : https://www.agence-procept.com/realisations/ filtres "Agencement / installation générale / Salons & stands". OK.
- "industrie, finance, art, sport, mode et luxe" : /a-propos/ "issus de divers secteurs tels que l'industrie, la finance, l'art, le sport, la mode et le luxe". OK.
- "certifiée ISO 20121, norme de management responsable des événements" : /a-propos/ "Procept est certifiée ISO 20121, norme internationale de management responsable des événements" ; https://www.agence-procept.com/construire-l-evenement-durable/ "En 2025, notre agence a obtenu la certification ISO 20121 ... délivrée par Bureau Veritas". Libellé exact (P12). La coquille "ISO 2021" de l'accueil est un défaut du site.
- "intervient en France et à l'international" : accueil "Procept développe vos projets en France et à l'international". OK.
- Aucun chiffre, client, prix, superlatif. 566 caractères. Aucun segment de 8 mots commun avec le dossier.
- EN : fidèle. "sustainable event management" pour "management responsable des événements" est acceptable (intitulé ISO 20121 : event sustainability management).

## Défaut trouvé (non vu en passe 1)
- MINEUR, orthographe : la description FR écrit "met en oeuvre" avec "oe" séparé. La règle accents et typographie française impose la ligature : "met en œuvre". Seul "oeuvre" est concerné, le reste du texte est correct (recherche de tous les "oe" dans FR et EN). Description FR à corriger, le reste identique.

## Données structurées
- founded_year 2016 (registre + site), specialties (catégories et bandeau du site), memberships LEADS France, category standiste (rubrique "Salons & stands" : EDEX, MIPIM, SIAE...) : OK. Positionnement mixte, acceptable.

## Désaccords avec la passe 1
Verdict passe 1 "OK" : contenu factuel d'accord à 100 %, seul désaccord la ligature "oeuvre" (mineur).

```json final
{
  "slug": "agence-procept",
  "set": {
    "description": "Agence Procept est une agence d'architecture événementielle installée 114 rue de Grenelle à Paris (75007). Fondée en 2016 par Alexis Cassin, elle conçoit et met en œuvre des projets d'architecture événementielle : agencement, installation générale et salons & stands sont les trois catégories de réalisations présentées sur son site. L'agence travaille pour des clients de secteurs variés : industrie, finance, art, sport, mode et luxe. Elle est certifiée ISO 20121, norme de management responsable des événements. Procept intervient en France et à l'international."
  }
}
```
