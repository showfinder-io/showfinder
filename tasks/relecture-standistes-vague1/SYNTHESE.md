# Vague 1 des standistes : relecture et ouverture, 2026-11-13

Go Julien du 2026-11-13. Périmètre retenu (choix de la session, la liste G15 ne fixait pas la vague) : les 12 standistes du groupe A de `tasks/prestataires-g15-2026-11-12.md` situés à Paris (75) et dans le Rhône (69), c'est-à-dire déjà listés par les hubs standistes-paris et standistes-lyon.

Méthode : celle de `tasks/relecture-agent-prestataires-2026-11-12.md` (site officiel relu en direct, registre recherche-entreprises.api.gouv.fr), 3 relecteurs Sonnet, un rapport par fiche dans ce dossier. Base avant corrections : `base-2026-11-13.json`. Application : `scripts/diag-standistes-vague1-apply.ts` (--apply puis --open, IndexNow 20 URLs). Contrôle croisé fait à la main au registre pour idee-fixe (SIREN 353186505, Saint-Pair-sur-Mer), stand-by-me (504157686, Le Thor) et equateur-expo (398814376 cessée le 2026-06-17, activité sous ACTIVISE 404906836, même adresse).

## Résultat

| Fiche | Verdict | Corrections | Ouverte |
|---|---|---|---|
| r2-stand-et-event | CORRECTIONS | « salons et événements B2B » remplacé par la formule du site, founded_year 2010 | oui |
| merci-gustave | NE PAS OUVRIR | siège légal Merci Gustave Inc (Laval, Québec), aucune entité française active, adresse parisienne non publiée | non |
| agence-procept | OK | | oui |
| arc-et-typ | CORRECTIONS | site refait : retrait de 4 affirmations disparues (écoles, 300 projets par an, références SNCF/MINI/AIXAM, Aix-en-Provence), ajouts sourcés (EcoVadis Gold, expertises), spécialités, zone_intervention à null | oui |
| cap-linea | OK | | oui |
| idee-fixe | CORRECTIONS | siège Saint-Pair-sur-Mer (50), e-mail nominatif retiré, « membre du Leads » retiré du texte (P5) | oui |
| equateur-expo | CORRECTIONS | téléphone et e-mail introuvables sur le site, passés à null | non : plus aucun contact, critère groupe B |
| la-p-tite-histoire | CORRECTIONS | founded_year 2006 (date de l'entité) à null, le site dit « début des années 2000 » ; accueil du site en « Coming Soon » | oui |
| square-meters-paris | OK | | oui |
| stand-by-me | CORRECTIONS | siège Le Thor (84) au registre et dans la politique de confidentialité, e-mail nominatif remplacé par projets@standbyme.fr | oui |
| media-product | CORRECTIONS | téléphone remplacé par celui du site, e-mail introuvable à null, graphie Saint-Bonnet-de-Mure | oui |
| laps-concept | CORRECTIONS | e-mail remplacé par celui du site (contact@laps-evenements.com) | oui |

Bilan : 10 fiches ouvertes à l'indexation, 2 restent en noindex.

## Seconde relecture indépendante (même jour)

Rapports `<slug>.r2.md` (3 relecteurs Sonnet, contrôle de l'état en prod, sans lire la passe 1 avant leur propre vérification). 7 OK sans correction, 4 corrections appliquées par le même script (les blocs json de r2 s'ajoutent à ceux de r1) :
- agence-procept : ligature « met en œuvre » ;
- square-meters-paris : zone_intervention « International » remplacée par la formule du site « France et à l'international » ;
- laps-concept : « depuis vingt ans » attribué au site (entité légale créée en 2016 au registre) ;
- equateur-expo : téléphone 01 42 46 75 53 publié sur https://equateur-expo.fr/standiste-paris/ (lien tel:, vérifié par la session), manqué par la passe 1. La fiche a donc un contact et est ouverte (11e fiche).

Bilan final : 11 fiches ouvertes, merci-gustave en noindex et sortie des hubs.

Request Indexing GSC (Chrome) le 2026-11-13 : r2-stand-et-event soumise (« Indexing requested »), puis « Quota Exceeded » dès agence-procept. Reste à soumettre au prochain quota : agence-procept, arc-et-typ, cap-linea, idee-fixe, equateur-expo, la-p-tite-histoire, square-meters-paris, stand-by-me, media-product, laps-concept. IndexNow fait pour les 11 (FR et EN), fiches au sitemap.

Remarques non bloquantes de la passe 2 : sur les pages EN, zone d'intervention et spécialités restent en français (r2-stand-et-event, cap-linea, agence-procept, et « Normandie » chez idee-fixe) ; stand-by-me annonce une certification ISO 20121 « d'ici 2025 », échéance dépassée, à revérifier ; la-p-tite-histoire reprend deux segments quasi verbatim du site.

## Effets de bord

- Hubs : idee-fixe (50) et stand-by-me (84) sortent du hub standistes-paris par le filtre départemental (le hub compte les fiches par département).
- merci-gustave : TRANCHÉ par Julien le 2026-11-13, sortie des hubs comme Pico (category standiste -> autre, e-mail remplacé par contact@mercigustave.co, scripts/diag-merci-gustave-hors-hubs-2026-11-13.ts). Reste en noindex ; ville Paris et département 75 toujours non prouvés en base.
- stand-by-me : le site affiche aussi un bureau dans le 75019 ; la base suit le siège (P4).

## Reste

- Mesure de la vague à 4-6 semaines (GSC) avant la vague 2.
- equateur-expo : trouver un contact publié ou laisser en noindex. merci-gustave : décision Julien (sortie des hubs, catégorie, ou retrait).
