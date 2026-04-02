"use client";

import { useEffect, useState, useCallback } from "react";

type Report = {
  id: string;
  salon_slug: string;
  field: string;
  correction: string;
  reporter_email: string | null;
  status: string;
  created_at: string;
};

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  reviewed: { label: "Examiné", className: "bg-blue-100 text-blue-800" },
  applied: { label: "Appliqué", className: "bg-green-100 text-green-800" },
  dismissed: { label: "Rejeté", className: "bg-gray-100 text-gray-800" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/reports");
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Signalements</h1>

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : reports.length === 0 ? (
        <p className="text-muted text-sm">Aucun signalement.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Salon</th>
                <th className="px-3 py-2">Champ</th>
                <th className="px-3 py-2">Correction proposée</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const st = statusLabels[report.status] ?? statusLabels.pending;
                return (
                  <tr key={report.id} className="border-b border-border/50 hover:bg-border/20">
                    <td className="px-3 py-2 font-medium">{report.salon_slug}</td>
                    <td className="px-3 py-2">{report.field}</td>
                    <td className="px-3 py-2 max-w-xs truncate">{report.correction}</td>
                    <td className="px-3 py-2">{report.reporter_email ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(report.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(report.id, "applied")}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Appliquer
                          </button>
                          <button
                            onClick={() => updateStatus(report.id, "dismissed")}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Rejeter
                          </button>
                        </>
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
