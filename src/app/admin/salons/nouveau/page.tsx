"use client";

import { useRouter } from "next/navigation";
import { SalonForm } from "@/components/admin-salon-form";

type SalonData = Record<string, unknown>;

export default function AdminSalonNewPage() {
  const router = useRouter();

  async function handleSave(data: SalonData) {
    const res = await fetch("/api/admin/salons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
    const result = await res.json();
    router.push(`/admin/salons/${result.salon.id}`);
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Nouveau salon</h1>
      <SalonForm onSave={handleSave} />
    </div>
  );
}
