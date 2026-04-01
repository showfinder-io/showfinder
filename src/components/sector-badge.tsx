import Link from "next/link";

type SectorBadgeProps = {
  slug: string;
  name: string;
  linked?: boolean;
};

export function SectorBadge({ slug, name, linked = true }: SectorBadgeProps) {
  const className =
    "inline-block rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-ink";

  if (linked) {
    return (
      <Link href={`/secteurs/${slug}`} className={className}>
        {name}
      </Link>
    );
  }

  return <span className={className}>{name}</span>;
}
