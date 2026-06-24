/**
 * Drapeau d'activation de la locale anglaise.
 *
 * Tant que le corpus EN n'est pas traduit et relu (Phases 1 et 2), l'anglais
 * NE DOIT PAS etre expose :
 * - le selecteur de langue reste masque,
 * - les pages /en renvoient un noindex et un 404 (cf. layout [locale]),
 *   pour ne pas exposer du contenu FR sous une URL EN aupres de Google.
 *
 * Passer a `true` UNIQUEMENT quand tout le site est traduit et relu.
 * Defaut Phase 0 : false.
 */
export const I18N_EN_ENABLED = false;

/**
 * Map locale -> code BCP 47 utilise pour les balises hreflang.
 * EN cible l'anglais britannique (en-GB), pas en-US.
 */
export const HREFLANG_BY_LOCALE = {
  fr: "fr-FR",
  en: "en-GB",
} as const;
