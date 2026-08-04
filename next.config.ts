import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Plugin next-intl : pointe vers la config de requete (resolution locale +
// chargement des messages). Cf. src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Migration "slugs sans année" (2026-06-12) : 301 ancien slug-année -> slug de
// base, générés par scripts/diag-slug-year-apply.ts. Fichier committé, ne pas
// éditer à la main.
const slugYearRedirects: { source: string; destination: string }[] = JSON.parse(
  readFileSync(join(__dirname, "redirects-slug-year.json"), "utf8")
);

// Audit catalogue passé (2026-06-13) : 301 des fiches fantômes/doublons dépubliées
// et des slugs renommés (ville corrigée). Généré, ne pas éditer à la main.
const auditCatalogueRedirects: { source: string; destination: string }[] = JSON.parse(
  readFileSync(join(__dirname, "redirects-audit-catalogue.json"), "utf8")
);

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: false,
  async redirects() {
    // 301 permanents pour préserver l'indexation des anciennes URLs indexées
    // par Google quand le slug MDX a changé (rebrand, year shift, etc.).
    // Depuis la migration "slugs sans année", les destinations ci-dessous
    // pointent vers les slugs de base (pas de chaînes de 301).
    return [
      ...slugYearRedirects.map((r) => ({ ...r, permanent: true })),
      ...auditCatalogueRedirects.map((r) => ({ ...r, permanent: true })),
      // Doublon venues fusionné le 2026-06-12 (chantier couverture lieux)
      {
        source: "/lieux/grand-palais-paris",
        destination: "/lieux/grand-palais",
        permanent: true,
      },
      // Cohorte 8 (2026-06-13) : doublons / salons disparus / renommages
      {
        // doublon sémantique de la canonique jec-world
        source: "/salons/jec-world-paris",
        destination: "/salons/jec-world",
        permanent: true,
      },
      {
        // Salon du Meuble de Paris absorbé par Maison&Objet en 2016
        source: "/salons/meuble-paris",
        destination: "/salons/maison-objet-paris",
        permanent: true,
      },
      {
        // fiche fantôme MAP Pro remplacée par le vrai salon Sirha Méditerranée
        source: "/salons/map-pro-marseille",
        destination: "/salons/sirha-mediterranee",
        permanent: true,
      },
      {
        // Djazagro se tient à Alger, pas à Paris : slug réaligné
        source: "/salons/djazagro-paris",
        destination: "/salons/djazagro-alger",
        permanent: true,
      },
      // Audit find-next-edition (2026-06-13)
      {
        // ExpoBiogaz est itinérant : Bordeaux n'a jamais été une édition
        source: "/salons/expobiogaz-bordeaux",
        destination: "/salons/expobiogaz",
        permanent: true,
      },
      {
        // Vinexpo Paris fusionné avec Wine Paris (Vinexposium, même édition)
        source: "/salons/vinexpo-paris",
        destination: "/salons/wine-paris",
        permanent: true,
      },
      {
        // EquipMag absorbé par Paris Retail Week (puis NRF Retail's Big Show Europe)
        source: "/salons/equipmag-paris",
        destination: "/salons/paris-retail-week",
        permanent: true,
      },
      // Cohorte 9 (2026-06-13) : doublons / marques absorbées détectés
      {
        // Metal Expo n'est autonome qu'à partir de 2027 : composante d'EquipBaie Metalexpo en 2026
        source: "/salons/metal-expo-paris",
        destination: "/salons/equipbaie-metalexpo-paris",
        permanent: true,
      },
      {
        // Salon de la Maroquinerie absorbé par Première Vision en 2014 (Leather Hub)
        source: "/salons/maroquinerie-paris",
        destination: "/salons/premiere-vision-paris",
        permanent: true,
      },
      {
        // Beyond Beauty Paris : marque éteinte (dernière édition 2018), pas de successeur direct
        source: "/salons/beyond-beauty-paris",
        destination: "/secteurs/cosmetique-beaute",
        permanent: true,
      },
      // Audit upcoming passe 2 (2026-06-13) : fantôme + renommages de slug
      {
        // IPA Nantes disparu, successeur sectoriel = SIAL Paris
        source: "/salons/ipa-nantes",
        destination: "/salons/sial-paris",
        permanent: true,
      },
      {
        // Parabère Forum se tient à Nice, pas Paris
        source: "/salons/parabere-forum-paris",
        destination: "/salons/parabere-forum-nice",
        permanent: true,
      },
      {
        // Tech'Élevage à La Roche-sur-Yon (le Parc Équestre de Lamotte-Beuvron accueille le Game Fair)
        source: "/salons/tech-elevage-lamotte-beuvron",
        destination: "/salons/tech-elevage-la-roche-sur-yon",
        permanent: true,
      },
      // Cohortes 1-4 BTP/bois (cf. migration 20260528000000)
      {
        source: "/salons/artibat-rennes-2026",
        destination: "/salons/artibat-rennes",
        permanent: true,
      },
      {
        source: "/salons/nordbat-lille-2026",
        destination: "/salons/nordbat-lille",
        permanent: true,
      },
      {
        source: "/salons/eurobois-lyon-2026",
        destination: "/salons/eurobois-lyon",
        permanent: true,
      },
      // Cohorte 5 + index legacy (audit 2026-06-01 : 11 slugs GSC → canonique MDX)
      // (cfia-toulouse-2026 -> cfia-rennes-2027 retiré le 2026-06-11 : CFIA
      // Toulouse est un salon distinct du CFIA Rennes (biennal années paires,
      // MEETT, source toulouse.cfiaexpo.com) ; le redirect shadowait une
      // vraie fiche publiée.)
      {
        source: "/salons/innorobo-paris-2026",
        destination: "/salons/innorobo-by-sido",
        permanent: true,
      },
      {
        source: "/salons/jec-world-paris-2026",
        destination: "/salons/jec-world",
        permanent: true,
      },
      {
        source: "/salons/maison-et-objet-paris-2026",
        destination: "/salons/maison-objet-paris",
        permanent: true,
      },
      {
        source: "/salons/salon-immobilier-entreprise-paris-2026",
        destination: "/salons/simi",
        permanent: true,
      },
      // (3 entrées cohorte 5 retirées le 2026-06-11 : elles formaient des
      // boucles infinies avec les redirects inverses de l'audit doublons
      // 2026-06-04 : sia-paris, salon-mondial-tourisme, santexpo.
      // ERR_TOO_MANY_REDIRECTS constaté en prod sur les 3 fiches canoniques.)
      {
        source: "/salons/sandwich-and-snack-show-2026",
        destination: "/salons/snack-show",
        permanent: true,
      },
      {
        source: "/salons/solscope-lyon-2026",
        destination: "/salons/solscope",
        permanent: true,
      },
      {
        source: "/salons/solutions-rh-paris-2026",
        destination: "/salons/solutions-rh",
        permanent: true,
      },
      {
        source: "/salons/who-s-next-paris-2026",
        destination: "/salons/whos-next-paris",
        permanent: true,
      },
      // Cohorte 6 DB cleanup (audit 2026-06-01 batch 1+2) : doublons DB
      // ↔ MDX existants. Voir migration 20260601500000_cohorte6_db_cleanup.
      {
        source: "/salons/equiphotel-paris-2026",
        destination: "/salons/equip-hotel-paris",
        permanent: true,
      },
      {
        source: "/salons/mif-expo-paris-2026",
        destination: "/salons/mif-expo",
        permanent: true,
      },
      {
        source: "/salons/solutrans-lyon-2027",
        destination: "/salons/solutrans",
        permanent: true,
      },
      {
        source: "/salons/sitl-paris-2026",
        destination: "/salons/sitl",
        permanent: true,
      },
      {
        source: "/salons/cfia-rennes-2026",
        destination: "/salons/cfia-rennes",
        permanent: true,
      },
      {
        source: "/salons/cosmetic-360-paris-2026",
        destination: "/salons/cosmetic-360",
        permanent: true,
      },
      // Europain → rebrandé Sirha Bake & Snack depuis 2026 (rachat GL Events
      // + Ekip à Comexposium janv 2025). MDX consolidé sur sirha-bake-snack-2028.
      {
        source: "/salons/europain-paris-2026",
        destination: "/salons/sirha-bake-snack",
        permanent: true,
      },
      // Cohorte 6 DB cleanup final (audit 2026-06-01 batch 3-6) :
      // legacy SEO + doublons semantiques. Voir migration
      // 20260601600000_cohorte6_db_cleanup_final.
      {
        source: "/salons/smart-industries-2026",
        destination: "/salons/global-industrie-lyon",
        permanent: true,
      },
      {
        source: "/salons/ecommerce-paris-2026",
        destination: "/salons/paris-retail-week",
        permanent: true,
      },
      {
        source: "/salons/industrie-lyon-2026",
        destination: "/salons/global-industrie-lyon",
        permanent: true,
      },
      {
        source: "/salons/salon-hvac-paris-2026",
        destination: "/salons/interclima",
        permanent: true,
      },
      {
        source: "/salons/secuexpo-paris-2026",
        destination: "/salons/expoprotection",
        permanent: true,
      },
      // Audit doublons 2026-06-04 : 9 fiches fusionnees vers leurs canoniques
      {
        source: "/salons/big-data-paris-2026",
        destination: "/salons/big-data-ai-paris",
        permanent: true,
      },
      // (sia-paris-2027 -> sia-paris-2026 INVERSÉ le 2026-06-11 : la fiche
      // porte l'édition 2027 (27/02-07/03/2027, salon-agriculture.com), slug
      // DB renommé sia-paris-2027 par scripts/diag-redirect-slug-cleanup.ts.)
      {
        source: "/salons/sia-paris-2026",
        destination: "/salons/sia-paris",
        permanent: true,
      },
      {
        source: "/salons/salon-mondial-tourisme-2026",
        destination: "/salons/salon-mondial-du-tourisme-paris",
        permanent: true,
      },
      // (doublon salon-immobilier-entreprise-paris-2026 -> simi-2026 retiré,
      // déjà présent en cohorte 5 ci-dessus)
      {
        source: "/salons/vivatech-paris-2026",
        destination: "/salons/vivatech",
        permanent: true,
      },
      {
        source: "/salons/congresmaire-paris-2026",
        destination: "/salons/smcl",
        permanent: true,
      },
      {
        source: "/salons/paris-healthcare-week-2026",
        destination: "/salons/santexpo-paris",
        permanent: true,
      },
      {
        source: "/salons/sido-lyon-2026",
        destination: "/salons/innorobo-by-sido",
        permanent: true,
      },
      {
        source: "/salons/pollutec-paris-2026",
        destination: "/salons/pollutec-lyon",
        permanent: true,
      },
      // Passe anciens noms GSC (2026-08-04) : le slug je-m-export-paris était
      // une erreur de données (la fiche est Go Entrepreneurs, ex-Salon des
      // Entrepreneurs ; aucun événement "Je m'Exporte" n'existe). Slug DB
      // renommé par scripts/diag-anciens-noms-gsc-apply.ts ; la destination de
      // je-m-export-paris-2026 dans redirects-slug-year.json est corrigée en
      // conséquence (pas de chaîne de 301).
      {
        source: "/salons/je-m-export-paris",
        destination: "/salons/go-entrepreneurs-paris",
        permanent: true,
      },
      {
        source: "/en/salons/je-m-export-paris",
        destination: "/en/salons/go-entrepreneurs-paris",
        permanent: true,
      },
      // 12 guides éditoriaux Nicolas (2026-07-23) : preparer-stand-salon-professionnel.mdx
      // remplacé + budget-salon-professionnel.mdx renommé/étoffé en budget-stand-salon-professionnel.mdx
      {
        source: "/blog/budget-salon-professionnel",
        destination: "/blog/budget-stand-salon-professionnel",
        permanent: true,
      },
      // Variante EN : l'URL est référencée dans le sitemap EN (PR #65), éviter un 404 sec
      {
        source: "/en/blog/budget-salon-professionnel",
        destination: "/en/blog/budget-stand-salon-professionnel",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withNextIntl(withMDX(nextConfig));
