"use client";

import { useEffect, useState, useCallback } from "react";

type Quote = {
  id: string;
  company_name: string;
  email: string;
  provider_name: string | null;
  message: string;
  salon_name: string | null;
  status: string;
  created_at: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  contacted: { label: "Contacté", className: "bg-blue-100 text-blue-800" },
  closed: { label: "Clôturé", className: "bg-gray-100 text-gray-800" },
};

export default function AdminDevisPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/quotes");
    if (res.ok) {
      const data = await res.json();
      setQuotes(data.quotes);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Demandes de devis</h1>

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : quotes.length === 0 ? (
        <p className="text-muted text-sm">Aucune demande de devis.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Entreprise</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Prestataire</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const st = statusConfig[quote.status] ?? statusConfig.pending;
                return (
                  <tr key={quote.id} className="border-b border-border/50 hover:bg-border/20">
                    <td className="px-3 py-2 font-medium">{quote.company_name}</td>
                    <td className="px-3 py-2">{quote.email}</td>
                    <td className="px-3 py-2">{quote.provider_name ?? "—"}</td>
                    <td className="px-3 py-2 max-w-xs truncate">
                      {quote.message.slice(0, 80)}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(quote.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                      {quote.status === "pending" && (
                        <button
                          onClick={() => updateStatus(quote.id, "contacted")}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Contacté
                        </button>
                      )}
                      {(quote.status === "pending" || quote.status === "contacted") && (
                        <button
                          onClick={() => updateStatus(quote.id, "closed")}
                          className="text-gray-600 hover:underline text-sm"
                        >
                          Clôturer
                        </button>
                      )}
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
