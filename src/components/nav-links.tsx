"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

type NavLinksProps = {
  links: ReadonlyArray<NavLink>;
};

/**
 * Nav center du header — composant client pour gérer l'active state via usePathname.
 * Lien actif = underline Ocre 2px (signature Agoris).
 * Détection : si le pathname commence par le href du lien (sauf "/" exact).
 */
export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-center gap-10 md:flex">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "relative pb-1.5 text-[14px] font-medium tracking-[0.01em] text-prune transition-colors before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-ocre before:content-['']"
                : "relative pb-1.5 text-[14px] font-medium tracking-[0.01em] text-muted transition-colors hover:text-prune"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
