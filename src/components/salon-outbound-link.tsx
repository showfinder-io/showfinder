"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type SalonOutboundLinkProps = {
  slug: string;
  destination: "website" | "organizer";
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wrapper Client Component pour les liens externes sortants depuis une fiche
 * salon. Existe uniquement pour pouvoir attacher un onClick côté client : la
 * page parent /salons/[slug] est un Server Component (SSG via
 * generateStaticParams), donc onClick y est interdit.
 */
export function SalonOutboundLink({
  slug,
  destination,
  href,
  children,
  className,
}: SalonOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent("salon_outbound_click", { slug, destination })
      }
    >
      {children}
    </a>
  );
}
