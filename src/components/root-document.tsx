import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

// Document HTML commun aux deux layouts racine : src/app/[locale]/layout.tsx
// (pages publiques, rendu statique) et src/app/(internal)/layout.tsx (admin,
// connexion, inscription, alertes). Le layout racine unique lisait la locale
// via getLocale() (en-têtes de requête), ce qui rendait tout le site dynamique
// (incident quota CPU Vercel du 2026-11-02). La locale arrive désormais en
// paramètre, connue au build.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Fraunces variable font : axe `opsz` déclaré explicitement (optical-size).
// Pas de SOFT/WONK pour minimiser le payload font et préserver le LCP au POC.
// Si on a besoin du wonkiness pour des titres très expressifs plus tard, on ajoutera ici.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
});

// JetBrains Mono : labels, coordonnées GPS, méta visuels SalonVisual/VenueVisual.
// Poids 400 + 500 (cf. brief visuels).
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // Icons : 3 fichiers statiques en /public, pas de route dynamique.
  // Safari macOS a un cache favicon agressif et déteste les routes app/icon.tsx
  // qui servent en `Cache-Control: max-age=...`. Standard Apple = .ico + 32px PNG + 180px Apple.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Bing Webmaster Tools : balise msvalidate.01, uniquement si l'env est
  // renseignée (facultatif si le site est importé depuis Google Search Console).
  ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? { verification: { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } }
    : {}),
};

export async function RootDocument({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  // Messages passes EXPLICITEMENT au provider client : sans ca, les composants
  // client du Header/Footer (mobile-nav, footer, selecteur) ne recoivent pas les
  // messages de la locale et retombent en FR sur /en.
  const messages = await getMessages({ locale });
  return (
    <html lang={locale} className={cn(inter.variable, fraunces.variable, jetbrainsMono.variable)}>
      <body className="flex min-h-screen flex-col bg-sable text-prune font-sans antialiased">
        {/* Provider i18n : le Header (et son selecteur de langue) ainsi que
            le Footer ont besoin du contexte next-intl. Les routes internes
            passent la locale FR (cf. src/app/(internal)/layout.tsx). */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        <GoogleAnalytics />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#F7F2E6",
              color: "#3B1F33",
              border: "1px solid rgba(59,31,51,0.10)",
              borderLeft: "3px solid var(--state-color, #3B1F33)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "4px",
            },
            className: "agoris-toast",
          }}
        />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
