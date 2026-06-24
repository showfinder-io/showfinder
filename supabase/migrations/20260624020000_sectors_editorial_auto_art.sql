-- ============================================================
-- Chapeaux éditoriaux des secteurs Automobile + Art et Culture
-- ============================================================
-- Production via méthode établie (writer Opus 4.8 + reviewer Sonnet,
-- fact-check sources officielles). Rend les 2 pages /secteurs indexables
-- (sitemap = secteurs avec editorial_mdx non nul).
-- Déjà appliqué en prod via REST le 2026-06-24, versionné ici pour
-- reproductibilité (db reset / sync Nicolas).
--
-- Inclut aussi un spot-fix data : Equip Auto Paris organisé par Comexposium
-- (et non GL Events). Le MDX de la fiche equip-auto-paris a été corrigé
-- séparément via REST (remplacement ciblé, non rejoué ici car volumineux).
-- ============================================================

BEGIN;

UPDATE sectors
SET editorial_mdx = 'La filière automobile française vit une transformation profonde : électrification des gammes, montée de la connectivité, pression sur les coûts de l''après-vente et bascule vers les nouvelles mobilités. Pour un exposant, l''erreur la plus fréquente est de confondre le secteur automobile avec la [logistique et le transport](/secteurs/logistique-transport). Le premier couvre la conception, la fabrication et l''entretien des véhicules (équipementiers, fournisseurs de rang 1 et 2, réparateurs, distributeurs de pièces) ; le second couvre l''acheminement des marchandises (supply chain, entreposage, messagerie). Un fournisseur de pièces de rechange et un éditeur de logiciel d''optimisation de tournées ne s''adressent pas aux mêmes acheteurs.

Le choix du salon dépend d''abord de ce que l''on vend et à qui. Quatre segments structurent la filière : les équipementiers et la première monte (qui vendent aux constructeurs), l''après-vente et la rechange (qui vendent aux réparateurs et distributeurs), le véhicule industriel et utilitaire (poids lourds, bus, urbain), et la mobilité durable (recharge, micromobilité, services). Le grand salon vitrine et les salons strictement professionnels ne jouent pas le même rôle commercial.

## Le salon vitrine en France

Le [Mondial de l''Auto Paris](/salons/mondial-auto-paris) est le rendez-vous historique de l''automobile en France, organisé tous les deux ans en octobre (années paires) à [Paris Expo Porte de Versailles](/lieux/paris-expo-porte-de-versailles) par la PFA (Plateforme Automobile). Prochaine édition : 12 au 18 octobre 2026. C''est avant tout une vitrine grand public, dédiée aux lancements de modèles et à la relation marque-consommateur. Pour un exposant B2B, il conserve un intérêt réel mais ciblé : présence presse, relations avec les flottes d''entreprise, visibilité auprès des équipementiers et des donneurs d''ordres. Ce n''est pas un salon de sourcing pour la rechange ou l''outillage : sa logique est l''image et le lancement, pas la transaction d''atelier.

## Les piliers B2B

[Equip Auto Paris](/salons/equip-auto-paris) est le salon de référence de l''après-vente et des services pour la mobilité, organisé tous les deux ans (années impaires) à [Paris Expo Porte de Versailles](/lieux/paris-expo-porte-de-versailles) par Comexposium. Prochaine édition : 12 au 16 octobre 2027. Il couvre l''ensemble de la chaîne de l''après-vente : pièces de rechange, équipement d''atelier, outillage, diagnostic, pneumatique, carrosserie-peinture, lavage et services de mobilité. C''est le rendez-vous des distributeurs, réparateurs, centres-autos et plateformes de pièces. Pour un fournisseur de rechange ou d''équipement de garage visant le marché français, c''est le salon de sourcing prioritaire.

[Solutrans](/salons/solutrans) est le salon international du véhicule industriel, urbain et de la mobilité de demain, organisé tous les deux ans (années impaires) en novembre à [Eurexpo Lyon](/lieux/eurexpo-lyon) par Comexposium. Prochaine édition : 16 au 20 novembre 2027. Il s''adresse à la filière du poids lourd, du véhicule utilitaire, de la carrosserie industrielle et du transport routier de marchandises et de voyageurs. C''est le point de rencontre des constructeurs de VI, des carrossiers, des équipementiers et des transporteurs. Pour un acteur du véhicule industriel, il n''a pas d''équivalent en France.

La mobilité durable urbaine (recharge électrique, micromobilité, services de mobilité partagée) constitue un segment à part, plus jeune et encore mouvant. Un exposant positionné sur ces nouvelles mobilités doit arbitrer entre les espaces dédiés des grands salons généralistes et les événements spécialisés émergents.

## Les grands salons européens

L''Allemagne reste le cœur industriel de l''automobile européenne et concentre deux rendez-vous internationaux structurants.

IAA Mobility (Munich, biennal en septembre, organisé par la VDA, fédération allemande de l''automobile) a succédé au salon de Francfort comme grande vitrine continentale, désormais centrée sur la mobilité au sens large : véhicules, recharge, vélo, services urbains. L''édition 2025 a réuni plus de 700 exposants et un public se comptant en centaines de milliers de visiteurs. La prochaine édition est annoncée du 7 au 12 septembre 2027. C''est le benchmark européen pour qui veut prendre le pouls de la transition de la filière.

Automechanika Francfort (biennal en septembre, Messe Frankfurt) est le plus grand salon mondial de l''après-vente automobile, pendant international d''Equip Auto. Il couvre l''ensemble de la chaîne de la rechange, de la réparation et de l''équipement d''atelier, et attire des milliers d''exposants de plus de 170 pays. Prochaine édition annoncée du 8 au 12 septembre 2026. Pour un fournisseur de rechange ambitionnant l''export, c''est la place de marché de référence.

## Au-delà des salons

Plusieurs organisations structurent les échanges de la filière hors calendrier salon. La PFA (Plateforme Automobile) fédère constructeurs et équipementiers autour des enjeux de filière. La FIEV (Fédération des Industries des Équipements pour Véhicules) représente les équipementiers, tandis que la FEDA porte la voix de la distribution de pièces de rechange. Côté véhicule industriel et transport, la FNTR et l''OTRE animent la profession des transporteurs. Ces fédérations organisent journées techniques, commissions et conférences qui anticipent souvent les évolutions réglementaires (normes d''émissions, droit à la réparation, recyclage des batteries) avant qu''elles ne se traduisent sur les stands.',
    editorial_updated_at = '2026-06-24T00:00:00+00:00'
WHERE slug = 'automobile';

UPDATE sectors
SET editorial_mdx = 'Le marché de l''art et de la culture repose sur une économie de transactions souvent invisible au grand public : c''est entre galeries, marchands, éditeurs, collectionneurs institutionnels et acheteurs professionnels que se joue l''essentiel. Pour un exposant, une foire d''art n''est pas une exposition : c''est une place de marché où se concluent des ventes, se nouent des relations avec des collectionneurs et se construit la cote des artistes représentés. La logique est commerciale avant d''être esthétique.

Le choix du rendez-vous dépend du segment et du positionnement. Une galerie d''art contemporain, un éditeur de livres cherchant à céder des droits, un photographe représenté par une galerie et un atelier de métiers d''art ne visent ni les mêmes acheteurs ni les mêmes circuits de prescription. Paris s''est imposée ces dernières années comme une capitale du marché de l''art, ce qui densifie son calendrier de foires professionnelles.

## Les foires de référence en France

[Paris Photo](/salons/paris-photo) est la première foire internationale dédiée à la photographie, organisée chaque année en novembre au [Grand Palais](/lieux/grand-palais) par RX France. Elle réunit galeries, éditeurs spécialisés et marchands du monde entier autour de la photographie d''auteur, du tirage de collection et du livre photographique. Pour une galerie ou un éditeur photo, c''est le rendez-vous prescripteur majeur, fréquenté par les collectionneurs et les institutions.

[Art Paris](/salons/art-paris) est la foire d''art moderne et contemporain de la capitale, organisée chaque année en avril au [Grand Palais](/lieux/grand-palais) par France Conventions. Elle se distingue par un positionnement à la fois international et attentif à la scène française et régionale, ce qui en fait une porte d''entrée pour les galeries émergentes autant qu''un rendez-vous établi pour les collectionneurs.

[Festival du Livre de Paris](/salons/festival-livre-paris) est le grand rendez-vous de la filière édition, organisé chaque année en avril au [Grand Palais](/lieux/grand-palais) par le Syndicat national de l''édition (via Paris Livres Événements). Au-delà de sa dimension publique, il constitue un lieu de travail professionnel : cessions de droits, co-éditions, rencontres entre éditeurs, agents et libraires. Pour un acteur de l''édition, c''est le point de contact privilégié avec l''écosystème français du livre.

Le [Salon Photo & Vidéo](/salons/salon-photo-paris), organisé chaque année en octobre à la [Grande Halle de la Villette](/lieux/grande-halle-villette) par Comexposium, complète ce panorama côté équipement et technique de l''image : il s''adresse aux constructeurs, distributeurs et professionnels de la prise de vue plutôt qu''au marché de la photographie de collection.

## Les grands rendez-vous internationaux

Paris accueille désormais Art Basel Paris (Grand Palais, en octobre), qui a succédé à Paris+ par Art Basel. Adossée à la marque suisse de référence du marché de l''art, c''est la foire qui draine les galeries et les collectionneurs internationaux de premier plan dans la capitale. Art Basel décline par ailleurs ses éditions à Bâle, Miami Beach, Hong Kong et Qatar, formant le réseau le plus structurant du marché mondial de l''art.

Frieze London (Regent''s Park, en octobre) est l''autre grand pôle européen de l''art contemporain, doublé de Frieze Masters pour l''art ancien et moderne. Pour une galerie ambitionnant le marché anglophone et la clientèle internationale présente à Londres, c''est un passage déterminant. Côté photographie, Photo London (Londres, en mai) est la foire britannique de référence du médium.

## Au-delà des salons

Le marché de l''art et de la culture se structure aussi hors foires. Les métiers d''art disposent de leur propre vitrine professionnelle avec la biennale Révélations, organisée par Ateliers d''Art de France au Grand Palais, qui réunit créateurs, ateliers et galeries spécialisées dans la création contemporaine d''objets d''art. La filière musicale professionnelle a, elle, son rendez-vous d''affaires avec MaMA Music & Convention à Paris, qui combine convention (labels, booking, éditeurs, distribution, droits) et programmation de découvertes : c''est le point de rencontre du marché de la musique enregistrée et du spectacle vivant. Plus largement, syndicats professionnels (Comité professionnel des galeries d''art, Syndicat national de l''édition) et institutions publiques animent un réseau de rencontres et de commissions qui prolongent, hors calendrier des foires, les échanges entre acteurs du secteur.',
    editorial_updated_at = '2026-06-24T00:00:00+00:00'
WHERE slug = 'art-culture';

-- Spot-fix organisateur (source : communiqué officiel Equip Auto Paris 2027)
UPDATE salons
SET organizer_name = 'Comexposium'
WHERE slug = 'equip-auto-paris';

COMMIT;
