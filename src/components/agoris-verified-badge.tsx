import { ShieldCheck } from "lucide-react";

type AgorisVerifiedBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

/**
 * Badge "Agoris Verified" : fond Ocre + texte Prune (ratio ~5.7:1, conforme WCAG AA).
 * Apparaît UNIQUEMENT quand `salon.is_agoris_verified === true` (champ posé en S5).
 * Tant que la migration `is_agoris_verified` n'est pas appliquée, ce badge n'est jamais rendu.
 *
 * Règle : ne jamais utiliser ce composant pour décorer un autre type d'élément.
 * Le badge garde sa valeur par sa rareté.
 */
export function AgorisVerifiedBadge({
  className = "",
  size = "sm",
}: AgorisVerifiedBadgeProps) {
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-ocre ${padding} ${text} font-medium uppercase tracking-wider text-prune ${className}`}
      aria-label="Salon certifié Agoris Verified"
    >
      <ShieldCheck className={`${iconSize} shrink-0`} aria-hidden="true" />
      Agoris Verified
    </span>
  );
}
