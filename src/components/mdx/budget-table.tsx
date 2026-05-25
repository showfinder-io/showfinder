type BudgetRow = {
  poste: string;
  low: string;
  high: string;
};

type BudgetTotal = {
  label: string;
  low: string;
  high: string;
};

type BudgetTableProps = {
  /** Mention d'avertissement affichée au-dessus du tableau (sources, mise en garde) */
  warning?: string;
  rows: BudgetRow[];
  /** Une ou plusieurs lignes de total en bas, style emphase */
  totals?: BudgetTotal[];
  /** Texte de pied affiché sous le tableau (note de bas, conseil) */
  footer?: string;
};

/**
 * Tableau de budget exposant pour les fiches salon (Bloc 7 du modèle v3).
 * Structure stable, prête à être enrichie visuellement avec l'Agoris Score.
 */
export function BudgetTable({
  warning,
  rows,
  totals = [],
  footer,
}: BudgetTableProps) {
  return (
    <div className="mt-8">
      {warning && (
        <div className="mb-4 rounded-md border border-border bg-ivoire p-4 text-sm leading-relaxed text-prune/80">
          <span aria-hidden="true" className="mr-1.5">⚠</span>
          {warning}
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sable/40">
              <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Poste de dépense
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Fourchette basse
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Fourchette haute
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-b-0"
              >
                <td className="px-4 py-3 text-prune/85">{row.poste}</td>
                <td className="px-4 py-3 text-right font-serif text-[17px] text-prune tabular-nums">
                  {row.low}
                </td>
                <td className="px-4 py-3 text-right font-serif text-[17px] text-prune tabular-nums">
                  {row.high}
                </td>
              </tr>
            ))}
            {totals.map((total, i) => (
              <tr
                key={`total-${i}`}
                className="border-t-2 border-prune/20 bg-sable/30"
              >
                <td className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-prune">
                  {total.label}
                </td>
                <td className="px-4 py-3 text-right font-serif text-[19px] font-medium text-prune tabular-nums">
                  {total.low}
                </td>
                <td className="px-4 py-3 text-right font-serif text-[19px] font-medium text-prune tabular-nums">
                  {total.high}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footer && (
        <p className="mt-3 text-sm italic leading-relaxed text-muted">
          {footer}
        </p>
      )}
    </div>
  );
}
