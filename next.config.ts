import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: false,
  async redirects() {
    // 301 permanents pour préserver l'indexation des anciennes URLs indexées
    // par Google quand le slug MDX a changé (rebrand, year shift, etc.).
    return [
      // Cohortes 1-4 BTP/bois (cf. migration 20260528000000)
      {
        source: "/salons/artibat-rennes-2026",
        destination: "/salons/artibat-rennes-2027",
        permanent: true,
      },
      {
        source: "/salons/nordbat-lille-2026",
        destination: "/salons/nordbat-lille-2028",
        permanent: true,
      },
      {
        source: "/salons/eurobois-lyon-2026",
        destination: "/salons/eurobois-lyon-2028",
        permanent: true,
      },
      // Cohorte 5 + index legacy (audit 2026-06-01 : 11 slugs GSC → canonique MDX)
      {
        source: "/salons/cfia-toulouse-2026",
        destination: "/salons/cfia-rennes-2027",
        permanent: true,
      },
      {
        source: "/salons/innorobo-paris-2026",
        destination: "/salons/innorobo-by-sido-2026",
        permanent: true,
      },
      {
        source: "/salons/jec-world-paris-2026",
        destination: "/salons/jec-world-2026",
        permanent: true,
      },
      {
        source: "/salons/maison-et-objet-paris-2026",
        destination: "/salons/maison-objet-paris-2026",
        permanent: true,
      },
      {
        source: "/salons/salon-immobilier-entreprise-paris-2026",
        destination: "/salons/simi-2026",
        permanent: true,
      },
      {
        source: "/salons/salon-mondial-du-tourisme-paris-2026",
        destination: "/salons/salon-mondial-tourisme-2026",
        permanent: true,
      },
      {
        source: "/salons/sandwich-and-snack-show-2026",
        destination: "/salons/snack-show-2026",
        permanent: true,
      },
      {
        source: "/salons/santexpo-paris-2026",
        destination: "/salons/paris-healthcare-week-2026",
        permanent: true,
      },
      {
        source: "/salons/sia-paris-2026",
        destination: "/salons/sia-paris-2027",
        permanent: true,
      },
      {
        source: "/salons/solscope-lyon-2026",
        destination: "/salons/solscope-2027",
        permanent: true,
      },
      {
        source: "/salons/solutions-rh-paris-2026",
        destination: "/salons/solutions-rh-2026",
        permanent: true,
      },
      {
        source: "/salons/who-s-next-paris-2026",
        destination: "/salons/whos-next-paris-2026",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
