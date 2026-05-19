import { cn } from "@/lib/utils";
import { AgorisMark } from "@/components/agoris-mark";

type PatternAgorisProps = {
  className?: string;
  label?: string;
  showLabel?: boolean;
};

/**
 * Placeholder visuel quand une fiche n'a pas d'image de couverture.
 * Fond Sable + symbole Agoris central (duo Prune/Ocre) + label optionnel.
 */
export function PatternAgoris({
  className,
  label,
  showLabel = true,
}: PatternAgorisProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-sable px-6 py-8",
        className
      )}
      aria-hidden="true"
    >
      <AgorisMark className="h-20 w-20 sm:h-24 sm:w-24" />
      {showLabel && label && (
        <span className="text-center font-serif text-lg font-medium tracking-tight text-prune/70 sm:text-xl">
          {label}
        </span>
      )}
    </div>
  );
}
