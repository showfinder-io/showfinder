import { cn } from "@/lib/utils";

type PatternAgorisProps = {
  className?: string;
  showWordmark?: boolean;
  label?: string;
};

/**
 * Placeholder visuel utilisé quand une fiche salon n'a pas d'image de couverture.
 * Fond Sable + grille de points Prune translucide + wordmark "Agoris" optionnel.
 * Conçu pour s'adapter à tout container : passer une hauteur via className.
 */
export function PatternAgoris({
  className,
  showWordmark = true,
  label = "Agoris",
}: PatternAgorisProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-sable",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full text-prune/10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pattern-agoris-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern-agoris-dots)" />
      </svg>
      {showWordmark && (
        <span className="relative font-serif text-2xl font-semibold tracking-tight text-prune/60 sm:text-3xl">
          {label}
        </span>
      )}
    </div>
  );
}
