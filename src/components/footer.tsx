"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import { AgorisMark } from "@/components/agoris-mark";

/**
 * Footer Agoris — variante "rupture" sur fond Prune.
 *
 * Structure :
 *  - Top : symbole + wordmark + signature + newsletter inline (droite)
 *  - Milieu : 3 colonnes (Produit / Société / Légal) avec eyebrows mono ocre
 *  - Bas : copyright + "Fait à Paris."
 *
 * Touche éditoriale : point ocre sur "Agoris." ET sur "Paris.".
 */

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ocre/80">
      {children}
    </p>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[14px] text-sable/75 transition-opacity hover:text-sable hover:opacity-100"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const PRODUIT_LINKS = [
    { href: "/salons", label: tNav("salons") },
    { href: "/secteurs", label: tNav("secteurs") },
    { href: "/lieux", label: tNav("lieux") },
    { href: "/prestataires", label: tNav("prestataires") },
    { href: "/blog", label: tNav("blog") },
  ];

  const SOCIETE_LINKS = [
    { href: "/methodologie", label: tNav("methodologie") },
    { href: "/contact", label: tNav("contact") },
  ];

  const LEGAL_LINKS = [
    { href: "/mentions", label: t("mentions") },
    { href: "/confidentialite", label: t("confidentialite") },
    { href: "/cookies", label: t("cookies") },
  ];

  return (
    <footer className="bg-prune text-sable">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-8 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <AgorisMark
              className="h-20 w-20"
              variant="mono"
              ariaLabel=""
            />
            <p
              className="mt-6 font-serif text-[40px] font-normal leading-none tracking-[-0.015em] text-sable"
              style={{ fontVariationSettings: "'opsz' 36" }}
            >
              {siteConfig.name}
              <em className="not-italic text-[1.1em] leading-none text-ocre">
                .
              </em>
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-sable/75">
              {t("tagline")}
            </p>
          </div>

          <div className="md:max-w-sm md:flex-1 md:pl-10">
            <ColumnLabel>{t("newsletter")}</ColumnLabel>
            <p className="mt-3 text-[14px] text-sable/75">
              {t("newsletterPitch")}
            </p>
            <form
              action=""
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex items-center gap-2 border-b border-sable/25 pb-2 focus-within:border-ocre"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                {t("newsletterEmailLabel")}
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder={t("newsletterPlaceholder")}
                autoComplete="email"
                className="flex-1 bg-transparent text-[14px] text-sable placeholder:text-sable/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label={t("newsletterSubmit")}
                className="text-ocre transition-opacity hover:opacity-80"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="my-14 h-px bg-sable/15" />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <ColumnLabel>{t("produit")}</ColumnLabel>
            <ul className="mt-5 space-y-3">
              {PRODUIT_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          <div>
            <ColumnLabel>{t("societe")}</ColumnLabel>
            <ul className="mt-5 space-y-3">
              {SOCIETE_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          <div>
            <ColumnLabel>{t("legal")}</ColumnLabel>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>
        </div>

        <div className="my-14 h-px bg-sable/15" />

        <div className="flex flex-col items-start justify-between gap-3 text-[13px] text-sable/60 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {siteConfig.name}
            <em className="not-italic text-[1.1em] leading-none text-ocre">
              .
            </em>
          </p>
          <p>
            {t("madeIn")}
            <em className="not-italic text-[1.1em] leading-none text-ocre">
              .
            </em>
          </p>
        </div>
      </div>
    </footer>
  );
}
