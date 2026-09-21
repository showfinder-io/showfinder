import { defineRouting } from "next-intl/routing";

/**
 * Configuration de routing i18n (next-intl).
 *
 * Decisions actees (Phase 0) :
 * - FR par defaut, a la RACINE, SANS prefixe (preserve tout le SEO existant).
 * - EN sous le sous-chemin /en uniquement.
 * - localePrefix "as-needed" : seul l'EN porte un prefixe, jamais le FR.
 * - localeDetection false : l'URL decide de la langue, jamais Accept-Language ni
 *   le cookie NEXT_LOCALE. Avec la detection active, toute URL FR repondait 307
 *   vers /en aux clients annoncant l'anglais : l'index de Brave (donc Claude) ne
 *   contenait que les pages /en, et les Francais a navigateur anglais etaient
 *   envoyes de force sur la version anglaise (constat du 2026-09-21).
 *
 * IMPORTANT : ne pas changer defaultLocale ni passer en "always" sans audit
 * SEO complet, sous peine de casser les URLs FR live indexees par Google.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
