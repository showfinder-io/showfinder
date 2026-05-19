import { PROVIDER_CATEGORY_LABELS } from "@/lib/queries";

type ProviderCategoryBadgeProps = {
  category: string;
  /**
   * Variante visuelle :
   *  - "filled" (défaut) : couleur sectorielle saturée + texte Ivoire (pendant de SectorBadge filled).
   *  - "outline" : bordure Prune + texte Prune, fond transparent, typo mono uppercase tracking
   *    (pendant de SectorBadge outline — utilisé sur les cards éditoriales).
   */
  variant?: "filled" | "outline";
};

/**
 * Palette catégories prestataires Agoris — pendant des secteurs.
 * Slugs (côté DB) → token Tailwind correspondant dans globals.css.
 *
 * Seuls les slugs présents en DB (enum `provider_category`) sont mappés ici.
 * Les autres tokens (mobilier, signaletique, securite, animation, rh) existent
 * en CSS en anticipation, mais ne sont pas câblés tant que l'enum DB n'est pas étendu.
 *
 * Mapping métier `transport` → palette `logistique` (cohérence éditoriale).
 */
const CATEGORY_COLORS: Record<string, string> = {
  standiste:
    "bg-provider-standiste text-ivoire border-provider-standiste/30",
  av_technique:
    "bg-provider-av text-ivoire border-provider-av/30",
  traiteur:
    "bg-provider-traiteur text-ivoire border-provider-traiteur/30",
  hebergement:
    "bg-provider-hebergement text-ivoire border-provider-hebergement/30",
  photographe:
    "bg-provider-photo text-ivoire border-provider-photo/30",
  transport:
    "bg-provider-logistique text-ivoire border-provider-logistique/30",
};

const DEFAULT_COLORS =
  "bg-provider-default text-ivoire border-provider-default/30";

export function getProviderCategoryColorClasses(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLORS;
}

export function ProviderCategoryBadge({
  category,
  variant = "filled",
}: ProviderCategoryBadgeProps) {
  const label = PROVIDER_CATEGORY_LABELS[category] ?? category;

  const className =
    variant === "outline"
      ? "inline-block rounded-full border border-prune bg-transparent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-prune transition-colors hover:bg-prune/5"
      : `inline-block rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-90 ${getProviderCategoryColorClasses(
          category
        )}`;

  return <span className={className}>{label}</span>;
}
