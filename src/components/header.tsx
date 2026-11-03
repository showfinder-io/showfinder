import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { MobileNav } from "@/components/mobile-nav";
import { AgorisMark } from "@/components/agoris-mark";
import { HeaderAccount, MobileAccount } from "@/components/header-account";
import { NavLinks } from "@/components/nav-links";
import { LanguageSwitcher } from "@/components/language-switcher";

/**
 * Header Hero V1 refondu — grid 3 colonnes (brand | nav-center | nav-right).
 * - brand : symbole 44px + wordmark Fraunces 30px (Agoris.)
 * - nav-center : 5 liens Inter 14px weight 500, underline ocre 2px sur active
 * - nav-right : admin-pill ocre uppercase mono (si admin/editor) + user-chip,
 *   lus côté client (HeaderAccount) pour garder les pages statiques
 */
export async function Header() {
  const t = await getTranslations("nav");

  const NAV_LINKS = [
    { href: "/salons", label: t("salons") },
    { href: "/lieux", label: t("lieux") },
    { href: "/secteurs", label: t("secteurs") },
    { href: "/prestataires", label: t("prestataires") },
    { href: "/blog", label: t("blog") },
  ] as const;

  return (
    <header className="border-b border-border bg-sable">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-5 md:px-14">
        <Link
          href="/"
          className="flex items-center gap-3.5 transition-opacity hover:opacity-80"
          aria-label={t("homeAriaLabel")}
        >
          <AgorisMark className="h-11 w-11" />
          <span
            className="font-serif text-[30px] font-normal leading-none tracking-[-0.015em] text-prune"
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {siteConfig.name}
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </span>
        </Link>

        <NavLinks links={NAV_LINKS} />

        <div className="flex items-center justify-end gap-4">
          <LanguageSwitcher />

          <div className="hidden items-center gap-4 md:flex">
            <HeaderAccount />
          </div>

          <MobileNav>
            <MobileAccount />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
