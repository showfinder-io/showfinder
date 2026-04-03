"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Sector = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  salon_count: number;
};

export default function AdminSecteursPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSectors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/secteurs?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSectors(data.sectors);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchSectors, 300);
    return () => clearTimeout(timer);
  }, [fetchSectors]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer le secteur "${name}" ? Cette action est irréversible.`)) return;
    const res = await fetch(`/api/admin/secteurs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSectors((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold">Secteurs</h1>
        <Link
          href="/admin/secteurs/nouveau"
          className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          + Ajouter un secteur
        </Link>
      </div>

      <input
        type="text"
        placeholder="Rechercher un secteur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : sectors.length === 0 ? (
        <p className="text-muted text-sm">Aucun secteur trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Icône</th>
                <th className="px-3 py-2">Salons</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sector) => (
                <tr key={sector.id} className="border-b border-border/50 hover:bg-border/20">
                  <td className="px-3 py-2 font-medium">{sector.name}</td>
                  <td className="px-3 py-2 text-muted">{sector.slug}</td>
                  <td className="px-3 py-2">{sector.icon ?? "—"}</td>
                  <td className="px-3 py-2">{sector.salon_count}</td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/secteurs/${sector.id}`}
                      className="text-accent hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(sector.id, sector.name)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
