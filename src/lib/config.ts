export const siteConfig = {
  name: "Agoris",
  description:
    "Agoris, l'annuaire décisionnel des salons professionnels en France : dates, lieux, exposants, secteurs. 190+ salons B2B référencés, fiches à jour.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.agoris.io",
  locale: "fr-FR",
} as const;

// Seuil d'indexabilité des pages ville : en dessous de N salons publiés, la
// page est trop mince pour Google → noindex,follow + hors sitemap. Cohérent
// avec la politique du site (salons avec MDX only, lieux riches only).
export const CITY_INDEX_MIN_SALONS = 3;
