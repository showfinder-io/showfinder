"use client";

import { useState } from "react";
import { Bell, Loader2, CheckCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

type AlertSubscribeProps =
  | { type: "salon"; slug: string; label: string }
  | { type: "sector"; slug: string; label: string };

export function AlertSubscribe(props: AlertSubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          alertType: props.type,
          slug: props.slug,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const message =
    props.type === "salon"
      ? `Recevoir une alerte quand les dates de ${props.label} sont confirmées`
      : `Recevoir une alerte pour les nouveaux salons en ${props.label}`;

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
        <p className="text-sm text-green-800">
          Vous serez notifié par email.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Bell className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
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
          disabled={status === "submitting" || !email.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "M'alerter"
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
    </div>
  );
}
