import Link from "next/link";

type SectorBadgeProps = {
  slug: string;
  name: string;
  linked?: boolean;
  /**
   * Variante visuelle :
   *  - "filled" (défaut) : couleur sectorielle saturée + texte Ivoire (MVP).
   *  - "outline" : bordure Prune + texte Prune, fond transparent.
   *    Utilisé sur les cards Hero V1 — design plus éditorial, moins saturé.
   */
  variant?: "filled" | "outline";
};

/**
 * Palette sectorielle MVP — 4 secteurs prioritaires figés (go-to-market).
 * Les autres secteurs utilisent la couleur Default (Prune muted) en attendant
 * d'être figés au cas par cas.
 *
 * Règle : ne jamais utiliser ces couleurs hors étiquetage (pills, dots, filtres).
 * L'Ocre #E2A02E reste réservé à Agoris (CTA, score, point wordmark).
 * Texte des pills toujours en Ivoire pour contraste sur fond couleur.
 */
const SECTOR_COLORS: Record<string, string> = {
  agriculture: "bg-sector-agriculture text-ivoire border-sector-agriculture/30",
  "sante-pharma": "bg-sector-sante text-ivoire border-sector-sante/30",
  "tech-numerique": "bg-sector-tech text-ivoire border-sector-tech/30",
  "tourisme-hotellerie":
    "bg-sector-tourisme text-ivoire border-sector-tourisme/30",
};

const DEFAULT_COLORS =
  "bg-sector-default text-ivoire border-sector-default/30";

export function getSectorColorClasses(slug: string): string {
  return SECTOR_COLORS[slug] ?? DEFAULT_COLORS;
}

/** Bordure gauche colorée pour une carte salon (utilisée par SalonCard si besoin). */
export function getSectorBorderColor(slug: string): string {
  const map: Record<string, string> = {
    agriculture: "border-l-sector-agriculture",
    "sante-pharma": "border-l-sector-sante",
    "tech-numerique": "border-l-sector-tech",
    "tourisme-hotellerie": "border-l-sector-tourisme",
  };
  return map[slug] ?? "border-l-sector-default";
}

export function SectorBadge({
  slug,
  name,
  linked = true,
  variant = "filled",
}: SectorBadgeProps) {
  const className =
    variant === "outline"
      ? // Outline éditorial : bordure + texte Prune, fond transparent, typo mono uppercase.
        // Utilisé sur les cards Hero V1 pour un rendu moins saturé que le filled MVP.
        "inline-block rounded-full border border-prune bg-transparent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-prune transition-colors hover:bg-prune/5"
      : `inline-block rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-90 ${getSectorColorClasses(
          slug
        )}`;

  if (linked) {
    return (
      <Link href={`/secteurs/${slug}`} className={className}>
        {name}
      </Link>
    );
  }

  return <span className={className}>{name}</span>;
}
