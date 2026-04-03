"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Venue = {
  id: string;
  name: string;
  slug: string;
  city: string;
  total_surface_sqm: number | null;
  salon_count: number;
};

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/venues?${params}`);
    if (res.ok) {
      const data = await res.json();
      setVenues(data.venues);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchVenues, 300);
    return () => clearTimeout(timer);
  }, [fetchVenues]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer la venue "${name}" ? Cette action est irréversible.`)) return;
    const res = await fetch(`/api/admin/venues/${id}`, { method: "DELETE" });
    if (res.ok) {
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold">Venues</h1>
        <Link
          href="/admin/venues/nouveau"
          className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          + Ajouter une venue
        </Link>
      </div>

      <input
        type="text"
        placeholder="Rechercher une venue..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : venues.length === 0 ? (
        <p className="text-muted text-sm">Aucune venue trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Ville</th>
                <th className="px-3 py-2">Surface (m²)</th>
                <th className="px-3 py-2">Salons</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr key={venue.id} className="border-b border-border/50 hover:bg-border/20">
                  <td className="px-3 py-2 font-medium">{venue.name}</td>
                  <td className="px-3 py-2">{venue.city}</td>
                  <td className="px-3 py-2">
                    {venue.total_surface_sqm
                      ? venue.total_surface_sqm.toLocaleString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-3 py-2">{venue.salon_count}</td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/venues/${venue.id}`}
                      className="text-accent hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(venue.id, venue.name)}
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
