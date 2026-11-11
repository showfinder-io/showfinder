"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SalonForm } from "@/components/admin-salon-form";

type SalonData = Record<string, unknown>;

export default function AdminSalonEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [salon, setSalon] = useState<SalonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/salons/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSalon(data.salon);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(data: SalonData) {
    const res = await fetch(`/api/admin/salons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce salon ? Cette action est irréversible.")) return;
    const res = await fetch(`/api/admin/salons/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/salons");
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) return <p className="text-muted text-sm">Chargement...</p>;
  if (!salon) return <p className="text-red-600 text-sm">Salon introuvable.</p>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Modifier le salon</h1>
      <SalonForm initialData={salon} onSave={handleSave} />
      <div className="mt-8 border-t border-border pt-6">
        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Supprimer ce salon
        </button>
      </div>
    </div>
  );
}
