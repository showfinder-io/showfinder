"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  email: string;
  alert_type: string;
  salon_slug: string | null;
  sector_slug: string | null;
  is_active: boolean;
  created_at: string;
};

const alertTypeLabels: Record<string, string> = {
  new_salon: "Nouveau salon",
  date_change: "Changement de date",
  sector_update: "Mise à jour secteur",
};

export default function AdminAlertesPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      const res = await fetch("/api/admin/alertes");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts);
      }
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  const totalActive = alerts.filter((a) => a.is_active).length;
  const byType: Record<string, number> = {};
  for (const a of alerts) {
    byType[a.alert_type] = (byType[a.alert_type] ?? 0) + 1;
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Alertes</h1>

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="rounded-lg border border-border bg-paper px-4 py-3">
              <p className="text-2xl font-bold text-ink">{totalActive}</p>
              <p className="text-xs text-muted">Alertes actives</p>
            </div>
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="rounded-lg border border-border bg-paper px-4 py-3">
                <p className="text-2xl font-bold text-ink">{count}</p>
                <p className="text-xs text-muted">{alertTypeLabels[type] ?? type}</p>
              </div>
            ))}
          </div>

          {alerts.length === 0 ? (
            <p className="text-muted text-sm">Aucune alerte.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted">
                  <tr>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Salon / Secteur</th>
                    <th className="px-3 py-2">Active</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-border/50 hover:bg-border/20">
                      <td className="px-3 py-2">{alert.email}</td>
                      <td className="px-3 py-2">
                        {alertTypeLabels[alert.alert_type] ?? alert.alert_type}
                      </td>
                      <td className="px-3 py-2">
                        {alert.salon_slug ?? alert.sector_slug ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            alert.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {alert.is_active ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(alert.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
