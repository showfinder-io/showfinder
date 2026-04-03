"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type VenueData = Record<string, unknown>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminVenueNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data: VenueData = {
      name: form.get("name"),
      slug: form.get("slug"),
      city: form.get("city"),
      address: form.get("address") || null,
      postal_code: form.get("postal_code") || null,
      country: form.get("country") || "FR",
      lat: form.get("lat") ? Number(form.get("lat")) : null,
      lng: form.get("lng") ? Number(form.get("lng")) : null,
      total_surface_sqm: form.get("total_surface_sqm") ? Number(form.get("total_surface_sqm")) : null,
      website_url: form.get("website_url") || null,
      description: form.get("description") || null,
      google_maps_url: form.get("google_maps_url") || null,
      photo_url: form.get("photo_url") || null,
    };

    try {
      const res = await fetch("/api/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      const result = await res.json();
      router.push(`/admin/venues/${result.venue.id}`);
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
      <h1 className="mb-6 font-serif text-2xl font-bold">Nouvelle venue</h1>

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

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>
              Ville <span className="text-red-500">*</span>
            </label>
            <input name="city" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Code postal</label>
            <input name="postal_code" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pays</label>
            <input name="country" defaultValue="FR" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Adresse</label>
          <input name="address" className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Latitude</label>
            <input name="lat" type="number" step="any" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input name="lng" type="number" step="any" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Surface totale (m²)</label>
          <input name="total_surface_sqm" type="number" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Site web</label>
          <input name="website_url" type="url" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>URL Google Maps</label>
          <input name="google_maps_url" type="url" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>URL photo</label>
          <input name="photo_url" type="url" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Création..." : "Créer la venue"}
        </button>
      </form>
    </div>
  );
}
