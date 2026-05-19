import Link from "next/link";

type SalonPaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  /** Filtres actifs à conserver dans les URLs des pages voisines. */
  searchParams: Record<string, string>;
};

/**
 * Pagination SSR pour la liste des salons.
 *
 * Rend de vrais `<a href>` côté serveur pour que Googlebot puisse crawler
 * `/salons?page=2`, `/salons?page=3`, etc. Pas de JS client.
 *
 * Style éditorial Agoris : mono small caps, séparateur point médian, accent
 * ocre sur la page courante.
 */
export function SalonPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: SalonPaginationProps) {
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

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination des salons"
      className="mt-12 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.18em] text-prune/80"
    >
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          rel="prev"
          className="border-b border-prune/30 pb-0.5 transition-colors hover:border-prune hover:text-prune"
        >
          ← Précédent
        </Link>
      ) : (
        <span aria-hidden="true" className="text-prune/30">
          ← Précédent
        </span>
      )}

      <span className="text-prune/40" aria-hidden="true">
        ·
      </span>

      <span className="font-serif text-sm normal-case tracking-normal text-prune">
        Page{" "}
        <span className="text-ocre tabular-nums">{currentPage}</span> sur{" "}
        <span className="tabular-nums">{totalPages}</span>
      </span>

      <span className="text-prune/40" aria-hidden="true">
        ·
      </span>

      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          rel="next"
          className="border-b border-prune/30 pb-0.5 transition-colors hover:border-prune hover:text-prune"
        >
          Suivant →
        </Link>
      ) : (
        <span aria-hidden="true" className="text-prune/30">
          Suivant →
        </span>
      )}
    </nav>
  );
}
