import { cn } from "@/lib/utils";

type SectionTitleProps = {
  children: React.ReactNode;
  /** Eyebrow optionnel en mono uppercase au-dessus du titre. */
  eyebrow?: string;
  /** Taille typo du titre. Défaut : "lg" (h2 sur landing). */
  size?: "md" | "lg" | "xl";
  /** Variante Sable (par défaut) ou Sable-on-Prune (texte clair sur fond foncé). */
  variant?: "on-sable" | "on-prune";
  /** Tag sémantique. Défaut h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Désactiver le point ocre final (rare : titres techniques admin, etc.). */
  hideDot?: boolean;
};

const sizeClasses = {
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl",
};

/**
 * Titre de section Agoris — signature point ocre final.
 * Discipline : un point ocre par titre principal, jamais dans les sous-titres
 * ni les titres de cards. Cf. CLAUDE.md #1.
 */
export function SectionTitle({
  children,
  eyebrow,
  size = "lg",
  variant = "on-sable",
  as: Tag = "h2",
  className,
  hideDot = false,
}: SectionTitleProps) {
  const titleColor = variant === "on-prune" ? "text-papier" : "text-prune";
  const eyebrowColor =
    variant === "on-prune" ? "text-ocre" : "text-muted";

  return (
    <div className={className}>
      {eyebrow && (
        <p
          className={cn(
            "font-mono text-[11px] font-semibold uppercase tracking-[0.22em]",
            eyebrowColor
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "mt-3 font-serif font-normal tracking-[-0.015em]",
          sizeClasses[size],
          titleColor
        )}
      >
        {children}
        {!hideDot && (
          <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
        )}
      </Tag>
    </div>
  );
}
