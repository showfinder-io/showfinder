"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectorData = Record<string, unknown>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminSecteurNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data: SectorData = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description") || null,
      icon: form.get("icon") || null,
      seo_title: form.get("seo_title") || null,
      seo_description: form.get("seo_description") || null,
    };

    try {
      const res = await fetch("/api/admin/secteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      const result = await res.json();
      router.push(`/admin/secteurs/${result.sector.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Nouveau secteur</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              className={inputClass}
              onChange={(e) => setAutoSlug(slugify(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input name="slug" required defaultValue={autoSlug} key={autoSlug} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Icône</label>
          <input name="icon" className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input name="seo_title" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <input name="seo_description" className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Création..." : "Créer le secteur"}
        </button>
      </form>
    </div>
  );
}
