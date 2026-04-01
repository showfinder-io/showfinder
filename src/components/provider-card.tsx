import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import type { ProviderRow } from "@/lib/queries";
import { MapPin, BadgeCheck } from "lucide-react";

type ProviderCardProps = {
  provider: ProviderRow;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3">
        {/* Nom + verified */}
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-lg font-bold tracking-tight">
            <Link
              href={`/prestataires/${provider.slug}`}
              className="hover:text-accent transition-colors"
            >
              {provider.company_name}
            </Link>
          </h3>
          {provider.is_verified && (
            <BadgeCheck className="h-4 w-4 text-accent" />
          )}
        </div>

        {/* Catégorie */}
        <CategoryBadge category={provider.category} />

        {/* Ville + couverture */}
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {provider.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{provider.city}</span>
            </div>
          )}
          {provider.coverage_radius_km && (
            <span>Rayon : {provider.coverage_radius_km} km</span>
          )}
        </div>

        {/* Description (tronquée) */}
        {provider.description && (
          <p className="line-clamp-2 text-sm text-muted">
            {provider.description}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/prestataires/${provider.slug}`}
          className="mt-1 inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Voir le profil &rarr;
        </Link>
      </div>
    </article>
  );
}
