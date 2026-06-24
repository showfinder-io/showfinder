import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

type AgorisCertifiedBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

/**
 * Badge "Agoris Certified" : fond Ocre + texte Prune (ratio ~5.7:1, conforme WCAG AA).
 * Apparaît UNIQUEMENT quand `salon.is_agoris_certified === true`.
 *
 * Règle : ne jamais utiliser ce composant pour décorer un autre type d'élément.
 * Le badge garde sa valeur par sa rareté.
 *
 * "Agoris Certified" est un nom de marque : le texte visible est identique en FR et EN.
 * Seul l'aria-label est traduit.
 */
export async function AgorisCertifiedBadge({
  className = "",
  size = "sm",
}: AgorisCertifiedBadgeProps) {
  const t = await getTranslations("card.salon");

  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const text = size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-ocre ${padding} ${text} font-medium uppercase tracking-wider text-prune ${className}`}
      aria-label={t("certifiedAriaLabel")}
    >
      <ShieldCheck className={`${iconSize} shrink-0`} aria-hidden="true" />
      Agoris Certified
    </span>
  );
}
