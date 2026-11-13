# idee-fixe : CORRECTIONS

Relu le 2026-11-13 : site officiel (https://www.ideefixe.fr/, /contact/, /mentions-legales/, /lagence-idee-fixe/, /les-engagements-idee-fixe/, /les-realisations-idee-fixe/, /stand-sur-mesure/fabrication-stand-sur-mesure/), registre, page publiée https://www.agoris.io/prestataires/idee-fixe (noindex, follow).

1. Identité : registre SIREN 353186505 "IDEE FIXE", créée le 1990-02-01, ZA du Croissant, rue du Poirier 50380 Saint-Pair-sur-Mer, active. Les autres "Idée Fixe" du registre (Villemur-sur-Tarn, Dinan, Lille...) sont des homonymes sans lien. Le site répond.
2. Adresse (erreur de base) : city "Paris", 75015, 75. Le siège est à Saint-Pair-sur-Mer (zone de Granville). Preuves : page contact, "Granville ZA du Croissant, rue du poirier 50380 Saint-Pair-Sur-Mer (siège) 02 33 49 38 04" (https://www.ideefixe.fr/contact/) ; mentions légales, "Siège social : ST PAIR SUR MER rue du poirier 50380 Saint-Pair-Sur-Mer" (/mentions-legales/) ; registre identique. Paris (4 rue de l'Armorique 75015) est une agence, pas le siège (P4 : le registre fait foi pour le siège). Correction : city "Saint-Pair-sur-Mer", postal_code "50380", department "50". Conséquence : la fiche sort du hub standistes-paris (le JSON-LD publie aujourd'hui Paris).
3. Contacts :
   - téléphone 02 33 49 38 04 : numéro du siège sur /contact/. Conforme.
   - e-mail "fpicot@ideefixe.fr" : introuvable sur le site (pas de mailto, formulaire seul). Passer à null.
4. Description :
   - "depuis 1990" : "Conception et fabrication de stands sur-mesure et agencements d'espaces depuis 1990" (accueil) ; registre 1990-02-01.
   - "équipes à Paris, à Granville et à Nantes" : "présente à Paris, Granville et Nantes" (/lagence-idee-fixe/).
   - "fabrication internalisée dans les ateliers de l'agence en Normandie" : "Fabrication 100 % française dans nos ateliers en Normandie" (/les-engagements-idee-fixe/) et "Idée Fixe dispose de son propre atelier de fabrication" (page fabrication).
   - "architecture éphémère, comme des stands sur mesure et des pop-up stores ... architecture durable pour des bureaux, des commerces, des hôtels et des restaurants" : "Ephémère : stands sur-mesure, pop-up stores ... Durable : bureaux, showrooms, hotels, restaurants" (/lagence-idee-fixe/).
   - "luxe, agroalimentaire, industrie ou santé" : "dans tous les univers professionnels : luxe, agroalimentaire, industrie, vins et spiritueux, santé" (/les-realisations-idee-fixe/).
   - "France, Europe et à l'international" : "en France, en Europe et l'International" (/lagence-idee-fixe/).
   - "certifiée ISO 20121" : "Agence certifiée ISO 20121" (pied de page) ; "certifiés ISO 20121 par l'AFNOR" (/les-engagements-idee-fixe/). Conforme.
   - "membre du réseau Leads" : exact sur le site ("Idée Fixe est membre du Leads"), mais P5 interdit la mention dans le texte (donnée déjà portée par `memberships`), comme corrigé pour alphaexpo dans la relecture du 2026-11-12. À retirer.
   - Aucune référence client citée : P7 sans objet.
5. founded_year 1990 (site et registre) ; specialties cohérentes ("Stand sur-mesure", "Pop-up stores", "Agencement d'établissements de santé", agencement durable) ; memberships leads_france confirmé.
6. Catégorie : standiste (conception, fabrication, installation de stands) : confirmé.

```json
{"slug": "idee-fixe", "set": {"city": "Saint-Pair-sur-Mer", "postal_code": "50380", "department": "50", "email": null, "description": "Idée Fixe conçoit et fabrique des stands et des agencements d'espaces depuis 1990, avec des équipes à Paris, à Granville et à Nantes. La fabrication est internalisée dans les ateliers de l'agence en Normandie. Elle conçoit aussi bien des projets d'architecture éphémère, comme des stands sur mesure et des pop-up stores, que des projets d'architecture durable pour des bureaux, des commerces, des hôtels et des restaurants. L'agence est intervenue dans des univers comme le luxe, l'agroalimentaire, l'industrie ou la santé, et accompagne ses clients en France, en Europe et à l'international. Elle est certifiée ISO 20121.", "description_en": "Idée Fixe has designed and manufactured stands and space fit-outs since 1990, with teams in Paris, Granville and Nantes. Manufacturing is carried out in-house, in the agency's workshops in Normandie. It designs both ephemeral architecture projects, such as bespoke stands and pop-up stores, and sustainable architecture projects for offices, shops, hotels and restaurants. The agency has worked across fields such as luxury, agri-food, industry and healthcare, and supports its clients in France, Europe and internationally. It is certified ISO 20121."}}
```
