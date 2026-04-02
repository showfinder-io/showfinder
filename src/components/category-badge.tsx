import { PROVIDER_CATEGORY_LABELS } from "@/lib/queries";

type CategoryBadgeProps = {
  category: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  standiste: "bg-blue-50 text-blue-700 border-blue-200",
  traiteur: "bg-orange-50 text-orange-700 border-orange-200",
  av_technique: "bg-purple-50 text-purple-700 border-purple-200",
  photographe: "bg-pink-50 text-pink-700 border-pink-200",
  transport: "bg-amber-50 text-amber-700 border-amber-200",
  hebergement: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const DEFAULT_COLORS = "bg-white text-muted border-border";

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const label = PROVIDER_CATEGORY_LABELS[category] ?? category;
  const colorClasses = CATEGORY_COLORS[category] ?? DEFAULT_COLORS;

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${colorClasses}`}
    >
      {label}
    </span>
  );
}
