"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SectorData = Record<string, unknown>;

function field(data: SectorData, key: string, fallback = ""): string {
  const v = data[key];
  if (v === null || v === undefined) return fallback;
  return String(v);
}

export default function AdminSecteurEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sector, setSector] = useState<SectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/secteurs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSector(data.sector);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

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
      const res = await fetch(`/api/admin/secteurs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce secteur ? Cette action est irréversible.")) return;
    const res = await fetch(`/api/admin/secteurs/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/secteurs");
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) return <p className="text-muted text-sm">Chargement...</p>;
  if (!sector) return <p className="text-red-600 text-sm">Secteur introuvable.</p>;

  const d = sector;
  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Modifier le secteur</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Sauvegardé avec succès.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Nom <span className="text-red-500">*</span>
            </label>
            <input name="name" required defaultValue={field(d, "name")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input name="slug" required defaultValue={field(d, "slug")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={field(d, "description")}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Icône</label>
          <input name="icon" defaultValue={field(d, "icon")} className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input name="seo_title" defaultValue={field(d, "seo_title")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <input name="seo_description" defaultValue={field(d, "seo_description")} className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <div className="mt-8 border-t border-border pt-6">
        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Supprimer ce secteur
        </button>
      </div>
    </div>
  );
}
