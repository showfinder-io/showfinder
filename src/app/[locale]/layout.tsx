import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { I18N_EN_ENABLED } from "@/lib/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// SSG : pre-rendre les deux locales. Le <html> et Header/Footer restent dans
// le layout racine (src/app/layout.tsx) pour ne pas casser les routes
// app-internes. Ce layout n'ajoute QUE le contexte i18n.
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

  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
