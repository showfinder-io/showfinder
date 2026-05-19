import { cn } from "@/lib/utils";

type AgorisMarkProps = {
  className?: string;
  variant?: "duo" | "mono";
  ariaLabel?: string;
};

/**
 * Symbole Agoris — 5 points Prune autour d'un point central + sommet Ocre.
 * Variants :
 *  - "duo" : Prune (points externes) + Ocre (sommet + centre). Lecture sur fond Sable, Ivoire, Papier.
 *  - "mono" : tous les points en currentColor. Utile sur fond Prune ou Ocre où la version duo perd du contraste.
 *
 * Le viewBox est 100×100, scale via className (`h-* w-*`). Tailles recommandées :
 *  - 24px : favicon / nav mobile
 *  - 44px : nav desktop / inline avec wordmark
 *  - 80px : header XL / hero
 *  - 160px : app icon / placeholder pattern
 */
export function AgorisMark({
  className,
  variant = "duo",
  ariaLabel,
}: AgorisMarkProps) {
  const isDuo = variant === "duo";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-6 w-6", className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      {/* Sommet : ocre en duo, currentColor en mono */}
      <circle
        cx="50"
        cy="28"
        r="5.5"
        className={isDuo ? "fill-ocre" : "fill-current"}
      />
      {/* 4 points externes Prune */}
      <circle cx="71" cy="43" r="5" className={isDuo ? "fill-prune" : "fill-current"} />
      <circle cx="29" cy="43" r="5" className={isDuo ? "fill-prune" : "fill-current"} />
      <circle cx="63" cy="68" r="5" className={isDuo ? "fill-prune" : "fill-current"} />
      <circle cx="37" cy="68" r="5" className={isDuo ? "fill-prune" : "fill-current"} />
      {/* Centre Ocre (le « point Agoris ») */}
      <circle
        cx="50"
        cy="51"
        r="3"
        className={isDuo ? "fill-ocre" : "fill-current"}
      />
    </svg>
  );
}
