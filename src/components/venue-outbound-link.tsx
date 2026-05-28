"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type VenueOutboundLinkProps = {
  slug: string;
  destination: "website" | "google_maps";
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wrapper Client Component pour les liens externes sortants depuis une fiche
 * lieu. Existe uniquement pour pouvoir attacher un onClick côté client : la
 * page parent /lieux/[slug] est un Server Component (SSG via
 * generateStaticParams), donc onClick y est interdit.
 */
export function VenueOutboundLink({
  slug,
  destination,
  href,
  children,
  className,
}: VenueOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent("venue_outbound_click", { slug, destination })
      }
    >
      {children}
    </a>
  );
}
