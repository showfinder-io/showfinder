# Règles de rédaction : seo_title / seo_description, test CTR 48 (Agoris)

Contexte : ces fiches Agoris (agoris.io, guide indépendant des salons pro) sont en position 5 à 12 sur Google mais cliquées à moins de 1 %. Le classement Jev montre que 92 % des impressions viennent de requêtes navigationnelles (nom du salon, sigle, nom + année, nom + ville). Le site officiel est au-dessus. Le titre doit donner une raison de cliquer sur Agoris plutôt que sur l'officiel : une vue de décision indépendante (dates et lieu exacts, à qui s'adresse le salon, profil des visiteurs, ce qu'il faut savoir pour exposer ou y aller), formulée sans copier le site officiel.

## Contraintes dures (un manquement = rejet)
1. **Zéro fait hors source.** Tout fait (date, lieu, ville, chiffre, profil de visiteurs, nombre d'exposants, prix, numéro d'édition, organisateur) doit figurer dans le bloc « Données en base » ou dans le MDX éditorial du dossier. Rien de mémoire, rien du web. Un chiffre du MDX garde son qualificatif (« annoncé », « cible », « indicatif ») s'il en a un ; dans le doute, ne pas mettre de chiffre.
2. **Prix / budget exposant** : seulement si un montant figure dans le MDX ; sinon on peut évoquer le sujet sans chiffre (« budget exposant », « conseils pour exposer ») uniquement si le MDX contient une section correspondante.
3. **Requête dominante en tête** : le title commence par le nom du salon tel que tapé dans la requête navigationnelle la plus forte (sigle ou nom), suivi de l'année de l'édition en base.
4. Longueur : title 45 à 60 caractères (Google coupe vers 580 px) ; description 130 à 155 caractères.
5. **Jamais d'em dash (—) ni de demi-cadratin (–)** dans le texte. Deux-points, virgules, points. Le séparateur « | » est permis une fois au plus.
6. FR : accents et typographie française (espace avant « : », abréviations de mois cohérentes). EN : anglais naturel, noms propres français conservés.
7. Pas de superlatifs non sourcés (« incontournable », « n°1 »), pas de « Agoris Certified », pas de score, pas de « site officiel » (on n'est pas l'officiel), pas de promesse que la page ne tient pas : chaque élément annoncé doit exister dans le MDX.
8. Le nom « Agoris » n'est pas nécessaire dans le title (le site name s'affiche déjà).
9. Différent du title actuel de façon substantielle (pas un simple réordonnancement), sinon le test ne mesure rien.

## Sortie attendue
Tableau JSON : [{ "page", "field_title", "field_description", "title", "description", "sources": ["fait → où il est dans le dossier"] }]
10. **Rien qui périme pendant la mesure** : la mesure court jusqu'à fin décembre 2026. Un tarif, une échéance ou une offre datés qui expirent avant le 2026-12-31 sont interdits (ils deviendraient faux en SERP).
11. Un chiffre d'une édition passée doit porter son année (« en 2025 ») et correspondre exactement au MDX ; si le MDX se contredit sur ce chiffre, il est interdit.
