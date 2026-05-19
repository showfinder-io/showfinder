"use client";

import { useState } from "react";
import { SalonCard } from "@/components/salon-card";
import { AgorisSpinner } from "@/components/agoris-spinner";
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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {salons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-prune bg-prune px-8 py-3 text-sm font-medium text-papier transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <AgorisSpinner size={18} />
                <span>Chargement…</span>
              </>
            ) : (
              "Afficher plus de salons"
            )}
          </button>
          <p className="text-xs text-muted">
            {salons.length} sur {total} salons
          </p>
        </div>
      )}
    </>
  );
}
