import { PROVIDER_CATEGORY_LABELS } from "@/lib/queries";

type CategoryBadgeProps = {
  category: string;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const label = PROVIDER_CATEGORY_LABELS[category] ?? category;

  return (
    <span className="inline-block rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted">
      {label}
    </span>
  );
}
