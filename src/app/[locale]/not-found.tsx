import type { Metadata } from "next";
import Link from "next/link";
import { AgorisMark } from "@/components/agoris-mark";
import { getSalons } from "@/lib/queries";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  // Compteur dynamique (même source que le Hero de la home) : ne dérive pas
  // quand des fiches sont publiées ou dépubliées.
  const { total } = await getSalons({ pageSize: 1, sort: "date" });
  const t = await getTranslations("not-found");

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      {/* Symbole en filigrane, derrière le texte */}
      <AgorisMark
        className="absolute h-[400px] w-[400px] opacity-10"
        ariaLabel=""
      />

      <div className="relative">
        <p className="font-serif text-[140px] font-normal leading-none tracking-[-0.02em] text-prune/40 md:text-[200px]">
          404
        </p>
        <h1 className="mt-6 font-serif text-3xl font-normal leading-tight tracking-[-0.015em] text-prune md:text-4xl">
          {t("heading")}
          <br />
          <span className="text-prune/70">
            {t("subheading", { total })}
          </span>
          <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
        </h1>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-prune underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
          >
            <span aria-hidden="true">→</span> {t("backHome")}
          </Link>
          <span className="hidden text-muted sm:inline" aria-hidden="true">
            |
          </span>
          <Link
            href="/salons"
            className="inline-flex items-center gap-2 font-medium text-prune underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
          >
            <span aria-hidden="true">→</span> {t("allShows")}
          </Link>
        </div>
      </div>
    </div>
  );
}
