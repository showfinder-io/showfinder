"use client";

import { useState } from "react";
import { SalonCard } from "@/components/salon-card";
import type { SalonWithSectors } from "@/lib/queries";

type SalonListLoadMoreProps = {
  initialSalons: SalonWithSectors[];
  total: number;
  searchParams: Record<string, string>;
};

export function SalonListLoadMore({
  initialSalons,
  total,
  searchParams,
}: SalonListLoadMoreProps) {
  const [salons, setSalons] = useState(initialSalons);
  const [loading, setLoading] = useState(false);
  const hasMore = salons.length < total;

  async function loadMore() {
    setLoading(true);
    const nextPage = Math.floor(salons.length / 20) + 2;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));

    try {
      const res = await fetch(`/api/salons?${params.toString()}`);
      const data = await res.json();
      setSalons((prev) => [...prev, ...data.salons]);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg border border-border bg-white px-8 py-3 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Chargement..." : `Afficher plus de salons`}
          </button>
          <p className="mt-2 text-xs text-muted">
            {salons.length} sur {total} salons
          </p>
        </div>
      )}
    </>
  );
}
