"use client";

import { useState } from "react";

type SalonData = Record<string, unknown>;

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "cancelled", label: "Annulé" },
  { value: "postponed", label: "Reporté" },
];

const FREQUENCY_OPTIONS = [
  { value: "", label: "— Non défini —" },
  { value: "annuel", label: "Annuel" },
  { value: "bisannuel", label: "Bisannuel" },
  { value: "ponctuel", label: "Ponctuel" },
];

function field(data: SalonData, key: string, fallback = ""): string {
  const v = data[key];
  if (v === null || v === undefined) return fallback;
  return String(v);
}

export function SalonForm({
  initialData,
  onSave,
}: {
  initialData?: SalonData;
  onSave: (data: SalonData) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const data: SalonData = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description") || null,
      city: form.get("city") || null,
      venue: form.get("venue") || null,
      country: form.get("country") || "FR",
      start_date: form.get("start_date") || null,
      end_date: form.get("end_date") || null,
      edition_year: form.get("edition_year") ? Number(form.get("edition_year")) : null,
      website_url: form.get("website_url") || null,
      organizer_name: form.get("organizer_name") || null,
      organizer_email: form.get("organizer_email") || null,
      frequency: form.get("frequency") || null,
      estimated_exhibitors: form.get("estimated_exhibitors") ? Number(form.get("estimated_exhibitors")) : null,
      estimated_visitors: form.get("estimated_visitors") ? Number(form.get("estimated_visitors")) : null,
      status: form.get("status") || "draft",
      is_premium: form.get("is_premium") === "on",
      is_locked: form.get("is_locked") === "on",
      logo_url: form.get("logo_url") || null,
      cover_image_url: form.get("cover_image_url") || null,
      seo_title: form.get("seo_title") || null,
      seo_description: form.get("seo_description") || null,
    };

    try {
      await onSave(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  const d = initialData ?? {};
  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink";

  return (
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

      {/* Nom + Slug */}
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

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={field(d, "description")}
          className={inputClass}
        />
      </div>

      {/* Lieu */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Ville</label>
          <input name="city" defaultValue={field(d, "city")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Lieu / Venue</label>
          <input name="venue" defaultValue={field(d, "venue")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input name="country" defaultValue={field(d, "country", "FR")} className={inputClass} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Date de début</label>
          <input name="start_date" type="date" defaultValue={field(d, "start_date")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date de fin</label>
          <input name="end_date" type="date" defaultValue={field(d, "end_date")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Année d'édition</label>
          <input name="edition_year" type="number" defaultValue={field(d, "edition_year")} className={inputClass} />
        </div>
      </div>

      {/* Organisateur */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Organisateur</label>
          <input name="organizer_name" defaultValue={field(d, "organizer_name")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email organisateur</label>
          <input name="organizer_email" type="email" defaultValue={field(d, "organizer_email")} className={inputClass} />
        </div>
      </div>

      {/* URL */}
      <div>
        <label className={labelClass}>Site web</label>
        <input name="website_url" type="url" defaultValue={field(d, "website_url")} className={inputClass} />
      </div>

      {/* Fréquence + estimations */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Fréquence</label>
          <select name="frequency" defaultValue={field(d, "frequency")} className={inputClass}>
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Exposants estimés</label>
          <input name="estimated_exhibitors" type="number" defaultValue={field(d, "estimated_exhibitors")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Visiteurs estimés</label>
          <input name="estimated_visitors" type="number" defaultValue={field(d, "estimated_visitors")} className={inputClass} />
        </div>
      </div>

      {/* Statut */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Statut</label>
          <select name="status" defaultValue={field(d, "status", "draft")} className={inputClass}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>URL du logo</label>
          <input name="logo_url" type="url" defaultValue={field(d, "logo_url")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>URL image de couverture</label>
          <input name="cover_image_url" type="url" defaultValue={field(d, "cover_image_url")} className={inputClass} />
        </div>
      </div>

      {/* SEO */}
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

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="is_premium"
            type="checkbox"
            defaultChecked={Boolean(d.is_premium)}
            className="rounded border-border"
          />
          Premium
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="is_locked"
            type="checkbox"
            defaultChecked={Boolean(d.is_locked)}
            className="rounded border-border"
          />
          Verrouillé (protégé)
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
