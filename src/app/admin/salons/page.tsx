"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Salon = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  is_locked: boolean;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  published: {
    label: "Publié",
    className: "bg-green-100 text-green-800",
  },
  draft: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-800",
  },
  cancelled: {
    label: "Annulé",
    className: "bg-red-100 text-red-800",
  },
  postponed: {
    label: "Reporté",
    className: "bg-orange-100 text-orange-800",
  },
};

export default function AdminSalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSalons = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/salons?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSalons(data.salons);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchSalons, 300);
    return () => clearTimeout(timer);
  }, [fetchSalons]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer le salon "${name}" ? Cette action est irréversible.`)) return;
    const res = await fetch(`/api/admin/salons/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSalons((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold">Salons</h1>
        <Link
          href="/admin/salons/nouveau"
          className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          + Ajouter un salon
        </Link>
      </div>

      <input
        type="text"
        placeholder="Rechercher un salon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : salons.length === 0 ? (
        <p className="text-muted text-sm">Aucun salon trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Ville</th>
                <th className="px-3 py-2">Dates</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Verrouillé</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salons.map((salon) => {
                const status = statusConfig[salon.status] ?? statusConfig.draft;
                return (
                  <tr key={salon.id} className="border-b border-border/50 hover:bg-border/20">
                    <td className="px-3 py-2 font-medium">{salon.name}</td>
                    <td className="px-3 py-2">{salon.city ?? "—"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {salon.start_date
                        ? new Date(salon.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                        : "—"}
                      {salon.end_date && (
                        <>
                          {" — "}
                          {new Date(salon.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">{salon.is_locked ? "Oui" : "Non"}</td>
                    <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                      <Link
                        href={`/admin/salons/${salon.id}`}
                        className="text-accent hover:underline"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(salon.id, salon.name)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
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
