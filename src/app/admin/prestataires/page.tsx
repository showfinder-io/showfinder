"use client";

import { useEffect, useState, useCallback } from "react";
import { PROVIDER_CATEGORY_LABELS } from "@/lib/queries";

type Provider = {
  id: string;
  company_name: string;
  slug: string;
  category: string;
  city: string | null;
  subscription_tier: string;
  is_verified: boolean;
};

const tierConfig: Record<string, { label: string; className: string }> = {
  premium: {
    label: "Premium",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  free: {
    label: "Gratuit",
    className: "bg-gray-100 text-gray-700",
  },
};

export default function AdminPrestatairesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/providers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setProviders(data.providers);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchProviders, 300);
    return () => clearTimeout(timer);
  }, [fetchProviders]);

  async function toggleTier(id: string, currentTier: string) {
    const newTier = currentTier === "premium" ? "free" : "premium";
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_tier: newTier }),
    });
    if (res.ok) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, subscription_tier: newTier } : p
        )
      );
    }
  }

  async function toggleVerified(id: string, currentVerified: boolean) {
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_verified: !currentVerified }),
    });
    if (res.ok) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_verified: !currentVerified } : p
        )
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold">Prestataires</h1>
      </div>

      <input
        type="text"
        placeholder="Rechercher un prestataire..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : providers.length === 0 ? (
        <p className="text-muted text-sm">Aucun prestataire trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Catégorie</th>
                <th className="px-3 py-2">Ville</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2">Vérifié</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => {
                const tier =
                  tierConfig[provider.subscription_tier] ?? tierConfig.free;
                return (
                  <tr
                    key={provider.id}
                    className="border-b border-border/50 hover:bg-border/20"
                  >
                    <td className="px-3 py-2 font-medium">
                      {provider.company_name}
                    </td>
                    <td className="px-3 py-2">
                      {PROVIDER_CATEGORY_LABELS[provider.category] ??
                        provider.category}
                    </td>
                    <td className="px-3 py-2">{provider.city ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tier.className}`}
                      >
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {provider.is_verified ? "Oui" : "Non"}
                    </td>
                    <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleTier(provider.id, provider.subscription_tier)
                        }
                        className="text-amber-700 hover:underline"
                      >
                        {provider.subscription_tier === "premium"
                          ? "Passer Free"
                          : "Passer Premium"}
                      </button>
                      <button
                        onClick={() =>
                          toggleVerified(provider.id, provider.is_verified)
                        }
                        className="text-accent hover:underline"
                      >
                        {provider.is_verified ? "Retirer vérifié" : "Vérifier"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
