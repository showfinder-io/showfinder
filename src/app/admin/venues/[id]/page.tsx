"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type VenueData = Record<string, unknown>;

function field(data: VenueData, key: string, fallback = ""): string {
  const v = data[key];
  if (v === null || v === undefined) return fallback;
  return String(v);
}

export default function AdminVenueEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/venues/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVenue(data.venue);
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

    // V6 gallery : JSON parsé depuis textarea
    let galleryParsed: unknown = [];
    const galleryRaw = String(form.get("gallery") ?? "").trim();
    if (galleryRaw) {
      try {
        galleryParsed = JSON.parse(galleryRaw);
      } catch {
        setError(
          "Galerie JSON invalide. Format attendu : [{ \"url\": \"...\", \"caption\": \"...\" }, ...]"
        );
        setSaving(false);
        return;
      }
    }

    const editorialMdx = String(form.get("editorial_mdx") ?? "");

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
      // V6 — fiches lieux enrichies
      halls_count: form.get("halls_count") ? Number(form.get("halls_count")) : null,
      editorial_mdx: editorialMdx || null,
      ...(editorialMdx && { editorial_updated_at: new Date().toISOString() }),
      gallery: galleryParsed,
    };

    try {
      const res = await fetch(`/api/admin/venues/${id}`, {
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
    if (!confirm("Supprimer cette venue ? Cette action est irréversible.")) return;
    const res = await fetch(`/api/admin/venues/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/venues");
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) return <p className="text-muted text-sm">Chargement...</p>;
  if (!venue) return <p className="text-red-600 text-sm">Venue introuvable.</p>;

  const d = venue;
  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const labelClass = "block text-sm font-medium text-ink";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Modifier la venue</h1>

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

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>
              Ville <span className="text-red-500">*</span>
            </label>
            <input name="city" required defaultValue={field(d, "city")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Code postal</label>
            <input name="postal_code" defaultValue={field(d, "postal_code")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pays</label>
            <input name="country" defaultValue={field(d, "country", "FR")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Adresse</label>
          <input name="address" defaultValue={field(d, "address")} className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Latitude</label>
            <input name="lat" type="number" step="any" defaultValue={field(d, "lat")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input name="lng" type="number" step="any" defaultValue={field(d, "lng")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Surface totale (m²)</label>
          <input name="total_surface_sqm" type="number" defaultValue={field(d, "total_surface_sqm")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Site web</label>
          <input name="website_url" type="url" defaultValue={field(d, "website_url")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>URL Google Maps</label>
          <input name="google_maps_url" type="url" defaultValue={field(d, "google_maps_url")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>URL photo</label>
          <input name="photo_url" type="url" defaultValue={field(d, "photo_url")} className={inputClass} />
        </div>

        {/* V6 — Fiches lieux enrichies */}
        <div className="border-t border-border pt-5">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Contenu éditorial V6
          </h2>
          <p className="mt-1 text-xs text-muted">
            Nombre de halls, MDX éditorial (description longue, accès, services,
            actualités), galerie photos. Affichage public sur la fiche lieu.
          </p>
        </div>

        <div>
          <label className={labelClass}>Nombre de halls</label>
          <input
            name="halls_count"
            type="number"
            defaultValue={field(d, "halls_count")}
            className={inputClass}
            placeholder="ex: 8"
          />
        </div>

        <div>
          <label className={labelClass}>
            Contenu éditorial (MDX)
            {d.editorial_updated_at ? (
              <span className="ml-2 text-xs font-normal text-muted">
                Maj :{" "}
                {new Date(d.editorial_updated_at as string).toLocaleDateString(
                  "fr-FR"
                )}
              </span>
            ) : null}
          </label>
          <p className="mt-1 text-xs text-muted">
            Format Markdown enrichi. Sections type : ## Description, ## Halls,
            ## Accès & transports, ## Services sur site, ## Actualités. Liens,
            listes, tableaux supportés.
          </p>
          <textarea
            name="editorial_mdx"
            rows={18}
            defaultValue={field(d, "editorial_mdx")}
            placeholder={`## Description\n\nLe parc des expositions...\n\n## Halls\n\n- Hall 1 : ...\n\n## Accès & transports\n\n- Métro 12 : Porte de Versailles\n...`}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div>
          <label className={labelClass}>Galerie photos (JSON)</label>
          <p className="mt-1 text-xs text-muted">
            Tableau JSON :{" "}
            <code className="rounded bg-ivoire px-1 text-[10px]">
              [{"{ "}&quot;url&quot;: &quot;...&quot;, &quot;caption&quot;: &quot;...&quot;{" }"}, ...]
            </code>
          </p>
          <textarea
            name="gallery"
            rows={4}
            defaultValue={
              Array.isArray(d.gallery) ? JSON.stringify(d.gallery, null, 2) : "[]"
            }
            placeholder='[{"url": "https://...", "caption": "Hall 7 niveau 3"}]'
            className={`${inputClass} font-mono text-xs`}
          />
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
          Supprimer cette venue
        </button>
      </div>
    </div>
  );
}
