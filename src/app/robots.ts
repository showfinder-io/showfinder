import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // "/" autorise la racine FR ET le sous-chemin /en (qui herite de "/").
      // En Phase 0 l'EN est gate (404/noindex) tant que I18N_EN_ENABLED est
      // false, donc rien d'indexable n'est expose sous /en pour l'instant.
      allow: "/",
      disallow: ["/admin", "/api", "/auth", "/connexion", "/inscription", "/alertes"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
