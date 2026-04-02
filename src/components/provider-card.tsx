import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import type { ProviderRow } from "@/lib/queries";
import { MapPin, BadgeCheck, Star } from "lucide-react";

type ProviderCardProps = {
  provider: ProviderRow;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  const isPremium = provider.subscription_tier === "premium";

  return (
    <article
      className={`group rounded-lg border bg-white p-6 transition-shadow hover:shadow-md ${
        isPremium ? "border-amber-200 border-t-2 border-t-amber-400" : "border-border"
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Nom + badges */}
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
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              Premium
            </span>
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
