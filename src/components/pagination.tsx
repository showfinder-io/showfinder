import Link from "next/link";
import { getTranslations } from "next-intl/server";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
};

export async function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const t = await getTranslations("common.pagination");

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
          {t("previous")}
        </Link>
      )}
      <span className="px-4 py-2 text-sm text-muted">
        {t("page", { current: currentPage, total: totalPages })}
      </span>
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-white"
        >
          {t("next")}
        </Link>
      )}
    </nav>
  );
}
