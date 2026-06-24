import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { routing, type AppLocale } from "@/i18n/routing";
import { HREFLANG_BY_LOCALE, I18N_EN_ENABLED } from "@/lib/i18n/config";

/**
 * Helper SEO i18n partage : construit l'objet `alternates` (canonical +
 * hreflang reciproques) pour une page donnee, de maniere uniforme sur tout le
 * site. A reutiliser dans CHAQUE generateMetadata pour eviter les oublis de
 * hreflang.
 *
 * Convention de routing (cf. src/i18n/routing.ts) :
 * - FR = racine, sans prefixe : https://www.agoris.io/salons/sial-paris
 * - EN = sous-chemin /en      : https://www.agoris.io/en/salons/sial-paris
 *
 * Regles hreflang produites pour CHAQUE page :
 * - fr-FR    -> URL FR
 * - en-GB    -> URL EN
 * - x-default -> URL FR (le FR est la version de reference)
 * - canonical -> la page se canonicalise sur ELLE-MEME dans sa propre locale.
 *
 * @param path  Chemin SANS prefixe de locale et SANS domaine. Doit commencer
 *              par "/" (ex : "/", "/salons", "/salons/sial-paris"). Peut
 *              inclure une query string (ex : "/salons?sector=industrie&page=2")
 *              pour les pages de listing filtrees/paginees qui doivent
 *              s'auto-canonicaliser avec leurs parametres.
 * @param locale Locale de la page courante (defaut : FR).
 */
export function buildAlternates(
  path: string,
  locale: AppLocale = routing.defaultLocale
): Metadata["alternates"] {
  // Separer le chemin de l'eventuelle query string : la query est conservee
  // telle quelle sur toutes les URLs de locale.
  const [rawPath, rawQuery = ""] = path.split("?");
  const query = rawQuery ? `?${rawQuery}` : "";

  // Normalisation : un seul slash de tete, pas de slash final parasite
  // (sauf la racine "/").
  const normalized =
    rawPath === "/" || rawPath === ""
      ? ""
      : `/${rawPath.replace(/^\/+/, "").replace(/\/+$/, "")}`;

  // URLs absolues par locale. Le FR n'a jamais de prefixe, l'EN porte "/en".
  const frUrl =
    (`${siteConfig.url}${normalized || "/"}`.replace(/\/$/, "") || siteConfig.url) +
    query;
  const enUrl = `${siteConfig.url}/en${normalized}${query}`;

  const urlByLocale: Record<AppLocale, string> = {
    fr: frUrl,
    en: enUrl,
  };

  // Phase 0 : tant que l'EN est gate (I18N_EN_ENABLED = false), on n'emet PAS
  // de hreflang en-GB. Les URLs /en renvoient 404 ; pointer un hreflang vers
  // une 404 serait une erreur SEO. On garde donc fr-FR + x-default (FR
  // auto-referent, parfaitement valide). Quand l'EN est active, on emet le set
  // reciproque complet.
  const languages: Record<string, string> = I18N_EN_ENABLED
    ? {
        [HREFLANG_BY_LOCALE.fr]: frUrl,
        [HREFLANG_BY_LOCALE.en]: enUrl,
        // x-default pointe vers la version FR (reference du site).
        "x-default": frUrl,
      }
    : {
        [HREFLANG_BY_LOCALE.fr]: frUrl,
        "x-default": frUrl,
      };

  return {
    // La page se canonicalise sur sa propre URL dans sa locale.
    canonical: urlByLocale[locale],
    languages,
  };
}
