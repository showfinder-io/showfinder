"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ProviderData = Record<string, unknown>;

const CATEGORY_OPTIONS = [
  { value: "standiste", label: "Standiste" },
  { value: "traiteur", label: "Traiteur" },
  { value: "av_technique", label: "Audiovisuel" },
  { value: "photographe", label: "Photographe" },
  { value: "transport", label: "Transport" },
  { value: "hebergement", label: "Hébergement" },
  { value: "autre", label: "Autre" },
];

function field(data: ProviderData, key: string, fallback = ""): string {
  const v = data[key];
  if (v === null || v === undefined) return fallback;
  return String(v);
}

export default function AdminProviderEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/providers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider);
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
    const data: ProviderData = {
      company_name: form.get("company_name"),
      slug: form.get("slug"),
      category: form.get("category"),
      subscription_tier: form.get("subscription_tier") || "free",
      description: form.get("description") || null,
      city: form.get("city") || null,
      website_url: form.get("website_url") || null,
      phone: form.get("phone") || null,
      email: form.get("email") || null,
      logo_url: form.get("logo_url") || null,
      is_verified: form.get("is_verified") === "on",
    };

    try {
      const res = await fetch(`/api/admin/providers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Erreur lors de la sauvegarde");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Supprimer ce prestataire ? Cette action est irréversible."
      )
    )
      return;
    const res = await fetch(`/api/admin/providers/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/prestataires");
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) return <p className="text-muted text-sm">Chargement...</p>;
  if (!provider)
    return <p className="text-red-600 text-sm">Prestataire introuvable.</p>;

  const d = provider;
  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink";
  const isVerified = d.is_verified === true;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">
        Modifier le prestataire
      </h1>

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
              Nom de l&apos;entreprise <span className="text-red-500">*</span>
            </label>
            <input
              name="company_name"
              required
              defaultValue={field(d, "company_name")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              name="slug"
              required
              defaultValue={field(d, "slug")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              defaultValue={field(d, "category", "autre")}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Abonnement</label>
            <select
              name="subscription_tier"
              defaultValue={field(d, "subscription_tier", "free")}
              className={inputClass}
            >
              <option value="free">Gratuit</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={field(d, "description")}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Ville</label>
            <input name="city" defaultValue={field(d, "city")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Site web</label>
            <input
              name="website_url"
              type="url"
              defaultValue={field(d, "website_url")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              defaultValue={field(d, "email")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={field(d, "phone")}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>URL du logo</label>
          <input
            name="logo_url"
            type="url"
            defaultValue={field(d, "logo_url")}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_verified"
            name="is_verified"
            defaultChecked={isVerified}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          <label htmlFor="is_verified" className="text-sm">
            Prestataire vérifié
          </label>
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
          Supprimer ce prestataire
        </button>
      </div>
    </div>
  );
}
