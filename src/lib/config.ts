export const siteConfig = {
  name: "Showfinder",
  description:
    "L'annuaire intelligent des salons professionnels en France : trouvez les bons salons, organisez votre stand, développez votre business.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://showfinder-amber.vercel.app",
  locale: "fr-FR",
} as const;
