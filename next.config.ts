import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: false,
  async redirects() {
    // Slugs cohorte 1 BTP corrigés vers l'édition réelle (cf. migration
    // 20260528000000). 301 pour préserver l'indexation des anciennes URLs.
    return [
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
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
