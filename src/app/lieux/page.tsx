import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getVenues } from "@/lib/queries";
import { formatNumber } from "@/lib/format";
import { MapPin, Maximize2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Lieux d'exposition en France",
  description: `Découvrez les principaux lieux d'exposition et parcs des expositions en France sur ${siteConfig.name}. Trouvez les salons par lieu.`,
};

export default async function LieuxPage() {
  const venues = await getVenues();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Lieux d&apos;exposition
      </h1>
      <p className="mt-2 text-muted">
        {venues.length} lieu{venues.length > 1 ? "x" : ""} répertorié
        {venues.length > 1 ? "s" : ""}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Link
            key={venue.id}
            href={`/lieux/${venue.slug}`}
            className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-bold tracking-tight group-hover:text-accent transition-colors">
              {venue.name}
            </h2>

            <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{venue.city}</span>
              </div>
              {venue.total_surface_sqm && (
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="h-4 w-4" />
                  <span>{formatNumber(venue.total_surface_sqm)} m²</span>
                </div>
              )}
            </div>

            {venue.description && (
              <p className="mt-3 text-sm text-muted line-clamp-3">
                {venue.description}
              </p>
            )}

            <span className="mt-4 inline-flex items-center text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
              Voir les salons &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
