import Link from "next/link";

type SectorBadgeProps = {
  slug: string;
  name: string;
  linked?: boolean;
};

const SECTOR_COLORS: Record<string, string> = {
  agroalimentaire: "bg-emerald-50 text-emerald-700 border-emerald-200",
  agriculture: "bg-lime-50 text-lime-700 border-lime-200",
  "btp-construction": "bg-orange-50 text-orange-700 border-orange-200",
  "tech-numerique": "bg-blue-50 text-blue-700 border-blue-200",
  industrie: "bg-slate-100 text-slate-700 border-slate-200",
  "sante-pharma": "bg-rose-50 text-rose-700 border-rose-200",
  "mode-textile": "bg-purple-50 text-purple-700 border-purple-200",
  "tourisme-hotellerie": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "energie-environnement": "bg-teal-50 text-teal-700 border-teal-200",
  "defense-securite": "bg-zinc-100 text-zinc-700 border-zinc-300",
  "cosmetique-beaute": "bg-pink-50 text-pink-700 border-pink-200",
  "logistique-transport": "bg-amber-50 text-amber-700 border-amber-200",
  "decoration-habitat": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "franchise-commerce": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "rh-formation": "bg-violet-50 text-violet-700 border-violet-200",
};

const DEFAULT_COLORS = "bg-white text-muted border-border";

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
