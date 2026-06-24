import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Convention catalogue de messages (Phase 1+) :
 *   messages/<locale>/<namespace>.json
 *
 * Un fichier = un namespace = une zone UI.
 * Namespaces actifs :
 *   - common            : chaînes transversales (pagination, auth, certified)
 *   - nav               : header navigation
 *   - footer            : footer complet (liens, newsletter)
 *   - language-switcher : sélecteur FR/EN
 *   - home              : page d'accueil (hero, sections)
 *   - card              : salon-card, provider-card, venue-card
 *   - filters           : salon-filters-sidebar, sort-bar, provider-sort-bar, venue-sort-bar
 *
 * Namespaces réservés pour fan-out ultérieur (Phase 1 partie 2+) :
 *   - salons        : /salons listing + fiche /salons/[slug]
 *   - sectors       : /secteurs listing + fiche /secteurs/[slug]
 *   - venues        : /lieux listing + fiche /lieux/[slug]
 *   - providers     : /prestataires listing + fiche /prestataires/[slug]
 *   - blog          : /blog listing + article /blog/[slug]
 *   - contact       : /contact + formulaire
 *   - legal         : mentions, confidentialite, cookies
 *   - methodologie  : /methodologie
 *   - not-found     : page 404
 *
 * Pour ajouter un namespace : créer messages/<locale>/<namespace>.json
 * dans les deux locales, puis l'ajouter à NAMESPACES ci-dessous.
 * Le fan-out parallèle (plusieurs agents en simultané) ne crée pas de conflit
 * car chaque agent ne touche qu'un seul fichier par locale.
 */

const NAMESPACES = [
  "common",
  "nav",
  "footer",
  "language-switcher",
  "home",
  "card",
  "filters",
  // Pré-enregistrés pour le fan-out Phase 1 partie 2 (fichiers créés par les
  // agents de zone ; un namespace sans fichier est ignoré silencieusement).
  "salons",
  "salon-detail",
  "sectors",
  "venues",
  "providers",
  "blog",
  "contact",
  "legal",
  "methodologie",
  "not-found",
  "organisateurs",
] as const;

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const merged: Record<string, unknown> = {};

  await Promise.all(
    NAMESPACES.map(async (ns) => {
      try {
        const mod = (
          await import(`../../messages/${locale}/${ns}.json`)
        ).default as Record<string, unknown>;
        merged[ns] = mod;
      } catch {
        // Namespace non encore traduit dans cette locale : ignoré silencieusement.
        // Les clés manquantes apparaissent en console next-intl (dev uniquement).
      }
    })
  );

  return merged;
}

/**
 * Configuration par requête : résout la locale et charge le catalogue fusionné
 * depuis messages/<locale>/*.json. Si la locale demandée est invalide, on
 * retombe sur la locale par défaut (FR).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
