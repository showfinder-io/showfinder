"use client";

// V5.3 — Sampling editorial 5 fiches aléatoires
// (brief Nicolas : "1x/semaine, 5 fiches tirées aléatoirement pour
// validation. Ne pas proposer la même fiche dans les 6 mois").
//
// Workflow :
//  1. Click "Tirer 5 fiches" → fetch /api/admin/sampling (5 random non
//     vérifiées depuis 6 mois)
//  2. Pour chaque fiche : aperçu + boutons "Validée" (set last_human_check_at)
//     + "Éditer" (lien vers /admin/salons/[id])
//  3. Après "Validée" : disparait du sample, reste éditable depuis salons list

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ExternalLink,
  Flag,
  Lock,
  RefreshCw,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";

type SampleSalon = {
  id: string;
  slug: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  city: string | null;
  venue: string | null;
  organizer_name: string | null;
  last_human_check_at: string | null;
  last_ia_update_at: string | null;
  alert_flag: boolean;
  locked_fields: string[];
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  review: "En relecture",
  published: "Publié",
  cancelled: "Annulé",
  postponed: "Reporté",
};

export default function SamplingPage() {
  const [sample, setSample] = useState<SampleSalon[]>([]);
  const [eligibleCount, setEligibleCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  const fetchSample = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sampling");
      if (res.ok) {
        const data = await res.json();
        setSample(data.sample);
        setEligibleCount(data.eligible_count);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSample();
  }, [fetchSample]);

  async function handleValidate(id: string) {
    setVerifying(id);
    try {
      const res = await fetch(`/api/admin/salons/${id}/human-check`, {
        method: "POST",
      });
      if (res.ok) {
        setSample((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setVerifying(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
          Sampling éditorial
        </h1>
        <p className="mt-2 text-sm text-muted">
          5 fiches tirées aléatoirement parmi celles qui n&apos;ont pas été
          vérifiées humainement depuis 6 mois (ou jamais).
        </p>
        {eligibleCount !== null && (
          <p className="mt-1 text-xs text-muted">
            <span className="font-medium text-ink">{eligibleCount}</span> fiche
            {eligibleCount > 1 ? "s" : ""} éligible{eligibleCount > 1 ? "s" : ""}{" "}
            au sampling.
          </p>
        )}
      </header>

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={fetchSample}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Tirage..." : "Tirer 5 fiches"}
        </button>
        {sample.length === 0 && !loading && (
          <span className="text-sm text-muted">
            Aucune fiche éligible. Bravo, tout est à jour.
          </span>
        )}
      </div>

      <div className="space-y-4">
        {sample.map((salon) => (
          <article
            key={salon.id}
            className="rounded-md border border-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-serif text-lg font-semibold text-ink">
                    {salon.name}
                  </h2>
                  {salon.alert_flag && (
                    <Flag className="h-4 w-4 fill-red-500 text-red-500" />
                  )}
                  {salon.locked_fields && salon.locked_fields.length > 0 && (
                    <span
                      className="inline-flex items-center gap-1 text-xs text-accent"
                      title={`${salon.locked_fields.length} champ(s) verrouillé(s)`}
                    >
                      <Lock className="h-3 w-3" />
                      {salon.locked_fields.length}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(salon.start_date)} → {formatDate(salon.end_date)}
                  </span>
                  {salon.venue && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {salon.venue}
                      {salon.city ? `, ${salon.city}` : ""}
                    </span>
                  )}
                  {salon.organizer_name && (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {salon.organizer_name}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-full border border-border bg-ivoire px-2 py-0.5 font-medium text-ink">
                    {STATUS_LABEL[salon.status] ?? salon.status}
                  </span>
                  <span className="text-muted">
                    Dernière vérif :{" "}
                    <span className="font-medium text-ink">
                      {salon.last_human_check_at
                        ? formatDate(salon.last_human_check_at)
                        : "jamais"}
                    </span>
                  </span>
                  <span className="text-muted">
                    Dernier IA :{" "}
                    <span className="font-medium text-ink">
                      {salon.last_ia_update_at
                        ? formatDate(salon.last_ia_update_at)
                        : "—"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <button
                  onClick={() => handleValidate(salon.id)}
                  disabled={verifying === salon.id}
                  className="inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {verifying === salon.id ? "..." : "Validée"}
                </button>
                <Link
                  href={`/admin/salons/${salon.id}`}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ivoire"
                >
                  <ExternalLink className="h-4 w-4" />
                  Éditer
                </Link>
                <Link
                  href={`/salons/${salon.slug}`}
                  target="_blank"
                  className="text-xs text-muted hover:text-ink"
                >
                  Voir en prod ↗
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
