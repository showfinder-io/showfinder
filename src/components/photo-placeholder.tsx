import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

type PhotoPlaceholderProps = {
  /**
   * Ratio recommandés selon le contexte :
   * - "16/9" : banner / hero image
   * - "3/2"  : hero
   * - "4/5"  : portrait card
   */
  ratio?: "16/9" | "3/2" | "4/5" | "1/1";
  /** Label court affiché entre crochets, ex: "salon prof.", "lieu", "prestataire". */
  label?: string;
  /** Fond Prune (sections sombres) ou Sable (default, sections claires). */
  variant?: "sable" | "prune";
  className?: string;
};

/**
 * Placeholder photo "Agoris" — bloc plein avec légende mono entre crochets.
 * Remplace volontairement les stock photos type Unsplash (incohérent avec
 * l'esthétique). À utiliser tant qu'on n'a pas encore les photos d'ambiance.
 *
 * Format : `[ Photo · {label} · à venir ]` en font-mono uppercase.
 */
export async function PhotoPlaceholder({
  ratio = "16/9",
  label = "salon prof.",
  variant = "sable",
  className,
}: PhotoPlaceholderProps) {
  const t = await getTranslations("common");
  const surface =
    variant === "prune"
      ? "bg-prune text-papier/55"
      : "bg-sable text-prune/45";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        surface,
        className
      )}
      style={{ aspectRatio: ratio }}
      aria-hidden="true"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.15em]">
        {t("photoPlaceholder", { label })}
      </span>
    </div>
  );
}
