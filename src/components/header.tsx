import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { AuthButton } from "@/components/auth-button";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  return (
    <header className="border-b border-border bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          {siteConfig.name}
        </Link>

        {/* Desktop nav — caché sur mobile */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/salons"
            className="text-muted transition-colors hover:text-ink"
          >
            Salons
          </Link>
          <Link
            href="/prestataires"
            className="text-muted transition-colors hover:text-ink"
          >
            Prestataires
          </Link>
          <Link
            href="/blog"
            className="text-muted transition-colors hover:text-ink"
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
