"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  salonsTotal: number;
  salonsPublished: number;
  salonsDraft: number;
  prestataires: number;
  venues: number;
  reportsPending: number;
  devisPending: number;
  avis: number;
  alertesActives: number;
};

const defaultStats: Stats = {
  salonsTotal: 0,
  salonsPublished: 0,
  salonsDraft: 0,
  prestataires: 0,
  venues: 0,
  reportsPending: 0,
  devisPending: 0,
  avis: 0,
  alertesActives: 0,
};

const cards: { key: keyof Stats; label: string; href: string }[] = [
  { key: "salonsTotal", label: "Salons (total)", href: "/admin/salons" },
  { key: "salonsPublished", label: "Salons publiés", href: "/admin/salons" },
  { key: "salonsDraft", label: "Salons brouillons", href: "/admin/salons" },
  { key: "prestataires", label: "Prestataires", href: "/admin/prestataires" },
  { key: "venues", label: "Venues", href: "/admin/venues" },
  { key: "reportsPending", label: "Signalements en attente", href: "/admin/reports" },
  { key: "devisPending", label: "Demandes de devis en attente", href: "/admin/devis" },
  { key: "avis", label: "Avis", href: "/admin/avis" },
  { key: "alertesActives", label: "Alertes actives", href: "/admin/alertes" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Tableau de bord</h1>

      {loading ? (
        <p className="text-muted text-sm">Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-lg border border-border bg-paper p-4 transition-colors hover:border-accent/50 hover:bg-accent/5"
            >
              <p className="text-3xl font-bold text-ink">{stats[card.key]}</p>
              <p className="mt-1 text-sm text-muted">{card.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
