import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { AuthButton } from "@/components/auth-button";
import { MobileNav } from "@/components/mobile-nav";
import { AgorisMark } from "@/components/agoris-mark";

export function Header() {
  return (
    <header className="border-b border-border bg-sable">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — accueil`}
        >
          <AgorisMark className="h-7 w-7" />
          <span className="font-serif text-2xl font-normal tracking-[-0.015em] text-prune">
            {siteConfig.name}
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </span>
        </Link>

        {/* Desktop nav — caché sur mobile */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href="/salons"
            className="text-muted transition-colors hover:text-prune"
          >
            Salons
          </Link>
          <Link
            href="/prestataires"
            className="text-muted transition-colors hover:text-prune"
          >
            Prestataires
          </Link>
          <Link
            href="/lieux"
            className="text-muted transition-colors hover:text-prune"
          >
            Lieux
          </Link>
          <Link
            href="/blog"
            className="text-muted transition-colors hover:text-prune"
          >
            Blog
          </Link>
          <AuthButton />
        </nav>

        {/* Mobile nav — burger menu, visible uniquement sur mobile */}
        <MobileNav>
          <AuthButton />
        </MobileNav>
      </div>
    </header>
  );
}
