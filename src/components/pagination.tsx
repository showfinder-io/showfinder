import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
};

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  return (
    <nav className="flex items-center justify-center gap-2 pt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-white"
        >
          Précédent
        </Link>
      )}
      <span className="px-4 py-2 text-sm text-muted">
        Page {currentPage} sur {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-white"
        >
          Suivant
        </Link>
      )}
    </nav>
  );
}
