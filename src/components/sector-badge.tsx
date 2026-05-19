import Link from "next/link";

type SectorBadgeProps = {
  slug: string;
  name: string;
  linked?: boolean;
};

// Palette désaturée "pastels chauds" conforme au brief Agoris.
// Texte Prune partout pour uniformité éditoriale. Bordure assortie discrète.
// Voir CLAUDE.md → "Couleurs sectorielles (badges)".
const SECTOR_COLORS: Record<string, string> = {
  agroalimentaire: "bg-stone-100 text-prune border-stone-300/60",
  agriculture: "bg-yellow-50 text-prune border-yellow-200/70",
  "btp-construction": "bg-orange-50 text-prune border-orange-200/70",
  "tech-numerique": "bg-slate-100 text-prune border-slate-300/60",
  industrie: "bg-zinc-100 text-prune border-zinc-300/60",
  "sante-pharma": "bg-rose-50 text-prune border-rose-200/70",
  "mode-textile": "bg-fuchsia-50 text-prune border-fuchsia-200/70",
  "tourisme-hotellerie": "bg-sky-50 text-prune border-sky-200/70",
  "energie-environnement": "bg-emerald-50 text-prune border-emerald-200/70",
  "defense-securite": "bg-neutral-100 text-prune border-neutral-300/60",
  "cosmetique-beaute": "bg-pink-50 text-prune border-pink-200/70",
  "logistique-transport": "bg-amber-50 text-prune border-amber-200/70",
  "decoration-habitat": "bg-orange-100/70 text-prune border-orange-200/70",
  "franchise-commerce": "bg-yellow-100/80 text-prune border-yellow-200/70",
  "rh-formation": "bg-purple-50 text-prune border-purple-200/70",
};

const DEFAULT_COLORS = "bg-papier text-prune border-border";

export function getSectorColorClasses(slug: string): string {
  return SECTOR_COLORS[slug] ?? DEFAULT_COLORS;
}

/** Renvoie la couleur de bordure gauche Tailwind pour un secteur (utilisé par SalonCard) */
export function getSectorBorderColor(slug: string): string {
  const map: Record<string, string> = {
    agroalimentaire: "border-l-emerald-400",
    agriculture: "border-l-lime-400",
    "btp-construction": "border-l-orange-400",
    "tech-numerique": "border-l-blue-400",
    industrie: "border-l-slate-400",
    "sante-pharma": "border-l-rose-400",
    "mode-textile": "border-l-purple-400",
    "tourisme-hotellerie": "border-l-cyan-400",
    "energie-environnement": "border-l-teal-400",
    "defense-securite": "border-l-zinc-400",
    "cosmetique-beaute": "border-l-pink-400",
    "logistique-transport": "border-l-amber-400",
    "decoration-habitat": "border-l-indigo-400",
    "franchise-commerce": "border-l-yellow-400",
    "rh-formation": "border-l-violet-400",
  };
  return map[slug] ?? "border-l-border";
}

export function SectorBadge({ slug, name, linked = true }: SectorBadgeProps) {
  const colorClasses = getSectorColorClasses(slug);
  const className = `inline-block rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:opacity-80 ${colorClasses}`;

  if (linked) {
    return (
      <Link href={`/secteurs/${slug}`} className={className}>
        {name}
      </Link>
    );
  }

  return <span className={className}>{name}</span>;
}
