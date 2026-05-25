type HistoryColumn = {
  /** Clé interne pour matcher avec les rows */
  key: string;
  /** Label affiché dans le header */
  label: string;
  /** Alignement de la colonne (default left) */
  align?: "left" | "right";
};

type HistoryTableProps = {
  /** Colonnes variables selon le salon (Vivatech a Startups, Batimat a Lieu) */
  columns: HistoryColumn[];
  rows: Record<string, string>[];
  sources?: string;
  /** Notes de bas de tableau (asterisques etc.) */
  notes?: string[];
};

/**
 * Tableau d'historique des éditions pour les fiches salon (Bloc 9 du modèle v3).
 * Colonnes flexibles : selon les salons on a Visiteurs/Exposants/Startups/Lieu/Pays/Tendance.
 */
export function HistoryTable({
  columns,
  rows,
  sources,
  notes,
}: HistoryTableProps) {
  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sable/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-b-0"
              >
                {columns.map((col) => {
                  const value = row[col.key] ?? "";
                  const isFirstCol = col === columns[0];
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === "right" ? "text-right" : ""
                      } ${
                        isFirstCol
                          ? "font-mono text-[12px] uppercase tracking-[0.12em] text-prune"
                          : "font-serif text-[16px] text-prune/85 tabular-nums"
                      }`}
                    >
                      {value || (
                        <span className="text-muted/60">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes && notes.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm italic text-muted">
          {notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}

      {sources && (
        <p className="mt-3 text-xs text-muted">
          <span className="font-mono uppercase tracking-[0.12em]">Sources</span>{" "}
          : {sources}
        </p>
      )}
    </div>
  );
}
