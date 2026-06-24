import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Middleware next-intl : gere la negociation de locale et le routing /en.
 *
 * Avec localePrefix "as-needed", le FR reste a la racine (aucun /fr) et seul
 * l'EN porte le prefixe /en. Les URLs FR existantes ne sont donc pas touchees.
 */
export default createMiddleware(routing);

/**
 * Le matcher EXCLUT volontairement :
 * - /api          : routes API (restent a la racine, hors i18n)
 * - /_next /_vercel : internes Next/Vercel
 * - les routes app-internes NON localisees qui vivent a la racine
 *   (/admin, /auth, /connexion, /inscription, /alertes)
 * - tout chemin contenant un "." (fichiers statiques : sitemap.xml,
 *   robots.txt, opengraph-image, favicon.ico, *.png, etc.)
 *
 * Resultat : le middleware ne s'execute que sur les pages publiques
 * localisables, sans jamais perturber l'infra existante.
 */
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|admin|auth|connexion|inscription|alertes|.*\\..*).*)",
  ],
};
