import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { siteConfig } from "@/lib/config";
import { GoogleAnalytics } from "@/components/google-analytics";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn(inter.variable, fraunces.variable)}>
      <body className="flex min-h-screen flex-col bg-sable text-prune font-sans antialiased">
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
      </body>
    </html>
  );
}
