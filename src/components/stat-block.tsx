import { formatNumber } from "@/lib/format";

type StatBlockProps = {
  value: number | null;
  label: string;
};

export function StatBlock({ value, label }: StatBlockProps) {
  if (value === null || value === undefined) return null;

  return (
    <div className="text-center">
      <p className="text-2xl font-semibold tracking-tight">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
