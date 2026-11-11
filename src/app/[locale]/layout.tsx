import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { I18N_EN_ENABLED } from "@/lib/i18n/config";
import { RootDocument, rootMetadata } from "@/components/root-document";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Layout racine des pages publiques : porte le <html> avec la locale du
// segment, connue au build, pour que les pages restent statiques. Les routes
// app-internes ont leur propre layout racine (src/app/(internal)/layout.tsx).
export const metadata = rootMetadata;

// Rendu statique, régénéré au plus toutes les heures : les écritures en base
// (admin, roll-apply) apparaissent sans redéploiement.
export const revalidate = 3600;

// SSG : pre-rendre les deux locales.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Locale inconnue -> 404.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Gate Phase 0 : tant que le corpus EN n'est pas pret, /en renvoie 404.
  // Evite d'exposer du contenu FR sous une URL EN aupres de Google.
  if (locale === "en" && !I18N_EN_ENABLED) {
    notFound();
  }

  // Active le rendu statique conscient de la locale pour ce sous-arbre.
  setRequestLocale(locale);

  return <RootDocument locale={locale}>{children}</RootDocument>;
}
