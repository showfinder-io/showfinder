import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProviderCategoryBadge } from "@/components/provider-category-badge";
import type { ProviderRow } from "@/lib/queries";

type ProviderCardProps = {
  provider: ProviderRow;
};

/**
 * Card prestataire — refonte V1 Agoris (mai 2026).
 * Aligné sur le pattern SalonCard pour cohérence visuelle :
 *  - top : pill catégorie (filled) + eyebrow mono "PREMIUM" (à droite, si premium)
 *  - titre Fraunces 28px (nom entreprise) + ville Inter 14px text-muted
 *  - description Inter 14px text-prune/70 line-clamp-2
 *  - bottom : "Audité par Agoris" en mono small caps si is_verified
 *  - hover : fond ivoire chaud (#FBF7EA) + translateY(-2px) + arrow ocre bottom-right
 */
export async function ProviderCard({ provider }: ProviderCardProps) {
  const t = await getTranslations("card.provider");

  const isPremium = provider.subscription_tier === "premium";

  return (
    <article className="group relative rounded-lg bg-ivoire transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FBF7EA]">
      <Link
        href={`/prestataires/${provider.slug}`}
        className="flex h-full flex-col gap-5 rounded-lg p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable"
        aria-label={provider.company_name}
      >
        <div className="flex items-baseline justify-between gap-3">
          <ProviderCategoryBadge category={provider.category} variant="filled" />
          {isPremium && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#C8801F]">
              {t("premium")}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.015em] text-prune">
            {provider.company_name}
          </h3>
          {provider.city && (
            <p className="mt-2 text-sm leading-[1.4] text-muted">
              {provider.city}
            </p>
          )}
        </div>

        {provider.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-prune/70">
            {provider.description}
          </p>
        )}

        {provider.is_verified && (
          <div className="mt-auto border-t border-border pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-prune/60">
              {t("auditedBy")}
            </span>
          </div>
        )}
      </Link>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-7 -translate-x-1.5 font-serif text-xl text-ocre opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      >
        →
      </span>
    </article>
  );
}
