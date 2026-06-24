import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Configuration par requete : resout la locale et charge le catalogue de
 * messages correspondant. Si la locale demandee est invalide, on retombe sur
 * la locale par defaut (FR).
 *
 * Phase 0 : seuls les messages header/nav/footer/switcher sont peuples.
 * L'extraction complete des chaines est la Phase 1.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
