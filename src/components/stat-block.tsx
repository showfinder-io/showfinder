import { formatNumber } from "@/lib/format";

type StatBlockProps = {
  value: number | null;
  label: string;
};

export function StatBlock({ value, label }: StatBlockProps) {
  if (value === null || value === undefined) return null;

  return (
    <div className="text-center">
      <p className="font-serif text-3xl font-semibold tracking-tight text-prune sm:text-4xl">
        {formatNumber(value)}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}
