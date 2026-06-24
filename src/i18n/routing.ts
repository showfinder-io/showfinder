import { defineRouting } from "next-intl/routing";

/**
 * Configuration de routing i18n (next-intl).
 *
 * Decisions actees (Phase 0) :
 * - FR par defaut, a la RACINE, SANS prefixe (preserve tout le SEO existant).
 * - EN sous le sous-chemin /en uniquement.
 * - localePrefix "as-needed" : seul l'EN porte un prefixe, jamais le FR.
 *
 * IMPORTANT : ne pas changer defaultLocale ni passer en "always" sans audit
 * SEO complet, sous peine de casser les URLs FR live indexees par Google.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
