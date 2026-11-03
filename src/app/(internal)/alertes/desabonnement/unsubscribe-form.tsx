"use client";

import { useState } from "react";
import { Loader2, BellOff, Search } from "lucide-react";

type Alert = {
  id: string;
  alert_type: "salon" | "sector";
  salon_slug: string | null;
  sector_slug: string | null;
  created_at: string;
};

type Status = "idle" | "loading" | "loaded" | "error";

export function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(
        `/api/alerts/unsubscribe?email=${encodeURIComponent(email.trim())}`
      );
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setAlerts(data.alerts);
      setStatus("loaded");
    } catch {
      setStatus("error");
    }
  }

  async function handleUnsubscribe(alertId: string) {
    setUnsubscribing(alertId);
    try {
      const res = await fetch("/api/alerts/unsubscribe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, email: email.trim() }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch {
      // Silently fail, user can retry
    } finally {
      setUnsubscribing(null);
    }
  }

  function formatAlertLabel(alert: Alert): string {
    if (alert.alert_type === "salon" && alert.salon_slug) {
      return `Salon : ${alert.salon_slug}`;
    }
    if (alert.alert_type === "sector" && alert.sector_slug) {
      return `Secteur : ${alert.sector_slug}`;
    }
    return "Alerte";
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4" />
              Rechercher
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      {status === "loaded" && alerts.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Aucune alerte active pour cet email.
        </p>
      )}

      {status === "loaded" && alerts.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-muted">
            {alerts.length} alerte{alerts.length > 1 ? "s" : ""} active
            {alerts.length > 1 ? "s" : ""}
          </p>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {formatAlertLabel(alert)}
                </p>
                <p className="text-xs text-muted">
                  Créée le{" "}
                  {new Date(alert.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <button
                onClick={() => handleUnsubscribe(alert.id)}
                disabled={unsubscribing === alert.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
              >
                {unsubscribing === alert.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <BellOff className="h-3.5 w-3.5" />
                )}
                Se désabonner
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
