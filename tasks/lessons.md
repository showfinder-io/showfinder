
## 2026-06-11 : boucles de redirects next.config.ts

Le commit du 2026-06-04 (merge doublons) a ajouté des redirects inverses de ceux du 2026-06-01 sans retirer les anciens : 3 boucles infinies en prod (sia-paris, salon-mondial-tourisme, santexpo), fiches canoniques inaccessibles pendant 7 jours. Leçon : avant d'ajouter un redirect, grep le slug source ET destination dans les redirects existants pour détecter les inversions. Idéalement, ajouter un test qui suit chaque chaîne de redirects et échoue si elle dépasse 2 sauts ou boucle.

## 2026-06-11 : "doublon" n'est pas toujours un doublon

jec-world-paris-2026 / jec-world-2026 et maison-et-objet / maison-objet ressemblaient à des doublons sur /lieux/paris-nord-villepinte. En réalité : paires d'éditions (2026 passée + 2027 roulée par find-next-edition sans renommage de slug ; éditions janvier + septembre pour M&O). Vérifier dates + edition_year + sources officielles avant de merger.
