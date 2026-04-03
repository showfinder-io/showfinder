"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  target_type: string;
  target_id: string;
  target_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  created_at: string;
};

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  async function handleVerify(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_verified: true }),
    });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_verified: true } : r))
      );
    } else {
      alert("Erreur lors de la vérification.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet avis ? Cette action est irréversible.")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Avis</h1>

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted text-sm">Aucun avis.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Cible</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Titre</th>
                <th className="px-3 py-2">Extrait</th>
                <th className="px-3 py-2">Vérifié</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border/50 hover:bg-border/20">
                  <td className="px-3 py-2 font-medium">
                    <span className="text-xs text-muted">{review.target_type}</span>
                    <br />
                    {review.target_name ?? review.target_id.slice(0, 8)}
                  </td>
                  <td className="px-3 py-2">{review.rating}/5</td>
                  <td className="px-3 py-2">{review.title ?? "—"}</td>
                  <td className="px-3 py-2 max-w-xs truncate">
                    {review.body ? review.body.slice(0, 80) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.is_verified
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {review.is_verified ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    {!review.is_verified && (
                      <button
                        onClick={() => handleVerify(review.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Vérifier
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:underline text-sm"
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
