"use client";

// Admin salon form — V5 workflow éditorial (brief Nicolas juin 2026)
//
// - Lock par champ : icône cadenas à côté de chaque label. Le scraper
//   skipe les champs verrouillés (via locked_fields jsonb DB).
// - Workflow status : draft -> review -> published avec bouton transition.
// - Alert flag : drapeau prioritaire.
// - Métadonnées : last_human_check_at + last_ia_update_at affichés.
// - Notes internes : textarea admin-only non publiée.
// - V5.7 : pays dropdown ISO, venue dropdown depuis table venues, secteurs multi-select M:N.

import { useState, useEffect } from "react";
import { Lock, Unlock, Flag, CheckCircle, Bot, User } from "lucide-react";

type SalonData = Record<string, unknown>;

type VenueOption = { id: string; name: string; city: string; slug: string };
type SectorOption = { id: string; name: string; slug: string };

// Pays les plus courants d'abord, puis ordre alphabétique pour le reste
const COUNTRY_OPTIONS: { code: string; label: string }[] = [
  { code: "FR", label: "France" },
  { code: "DE", label: "Allemagne" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "ES", label: "Espagne" },
  { code: "IT", label: "Italie" },
  { code: "NL", label: "Pays-Bas" },
  { code: "LU", label: "Luxembourg" },
  { code: "AT", label: "Autriche" },
  { code: "PT", label: "Portugal" },
  { code: "PL", label: "Pologne" },
  { code: "SE", label: "Suède" },
  { code: "DK", label: "Danemark" },
  { code: "FI", label: "Finlande" },
  { code: "NO", label: "Norvège" },
  { code: "CZ", label: "République tchèque" },
  { code: "HU", label: "Hongrie" },
  { code: "RO", label: "Roumanie" },
  { code: "US", label: "États-Unis" },
  { code: "CA", label: "Canada" },
  { code: "JP", label: "Japon" },
  { code: "CN", label: "Chine" },
  { code: "AE", label: "Émirats arabes unis" },
  { code: "SG", label: "Singapour" },
  { code: "AU", label: "Australie" },
  { code: "BR", label: "Brésil" },
  { code: "IN", label: "Inde" },
  { code: "MX", label: "Mexique" },
  { code: "ZA", label: "Afrique du Sud" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Brouillon" },
  { value: "review", label: "En relecture" },
  { value: "published", label: "Publié" },
  { value: "cancelled", label: "Annulé" },
  { value: "postponed", label: "Reporté" },
];

const FREQUENCY_OPTIONS = [
  { value: "", label: "· Non défini" },
  { value: "annuel", label: "Annuel" },
  { value: "bisannuel", label: "Bisannuel" },
  { value: "ponctuel", label: "Ponctuel" },
];

function field(data: SalonData, key: string, fallback = ""): string {
  const v = data[key];
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "jamais";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Wrapper label + lock toggle. Click sur le cadenas → toggle dans lockedFields.
 */
function FieldLabel({
  fieldName,
  label,
  required,
  lockedFields,
  toggleLock,
}: {
  fieldName: string;
  label: string;
  required?: boolean;
  lockedFields: string[];
  toggleLock: (f: string) => void;
}) {
  const locked = lockedFields.includes(fieldName);
  return (
    <div className="flex items-center justify-between">
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => toggleLock(fieldName)}
        className={`group inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
          locked
            ? "text-accent hover:text-accent-hover"
            : "text-muted hover:text-ink"
        }`}
        title={
          locked
            ? "Champ verrouillé — le scraper ne touchera pas. Cliquer pour déverrouiller."
            : "Champ libre — le scraper peut enrichir. Cliquer pour verrouiller."
        }
        aria-label={locked ? "Déverrouiller" : "Verrouiller"}
      >
        {locked ? (
          <Lock className="h-3.5 w-3.5" />
        ) : (
          <Unlock className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
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
  const d = initialData ?? {};

  // État local pour les champs verrouillés (array de field names) + flag d'alerte.
  // Tout le reste passe par <input name=...> et FormData.
  const initialLocked = Array.isArray(d.locked_fields)
    ? (d.locked_fields as string[])
    : [];
  const [lockedFields, setLockedFields] = useState<string[]>(initialLocked);
  const [alertFlag, setAlertFlag] = useState<boolean>(Boolean(d.alert_flag));

  // Options pour les dropdowns venue et secteurs
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
  const [sectorOptions, setSectorOptions] = useState<SectorOption[]>([]);
  const [selectedSectorIds, setSelectedSectorIds] = useState<string[]>(
    Array.isArray(d.sector_ids) ? (d.sector_ids as string[]) : []
  );
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/salons/form-options")
      .then((r) => r.json())
      .then((data) => {
        setVenueOptions(data.venues ?? []);
        setSectorOptions(data.sectors ?? []);
        setOptionsLoaded(true);
      })
      .catch(() => setOptionsLoaded(true));
  }, []);

  function toggleSector(sectorId: string) {
    setSelectedSectorIds((prev) =>
      prev.includes(sectorId) ? prev.filter((id) => id !== sectorId) : [...prev, sectorId]
    );
  }

  function toggleLock(f: string) {
    setLockedFields((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    markHumanCheck = false
  ) {
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
      edition_year: form.get("edition_year")
        ? Number(form.get("edition_year"))
        : null,
      website_url: form.get("website_url") || null,
      organizer_name: form.get("organizer_name") || null,
      organizer_email: form.get("organizer_email") || null,
      frequency: form.get("frequency") || null,
      estimated_exhibitors: form.get("estimated_exhibitors")
        ? Number(form.get("estimated_exhibitors"))
        : null,
      estimated_visitors: form.get("estimated_visitors")
        ? Number(form.get("estimated_visitors"))
        : null,
      status: form.get("status") || "draft",
      is_premium: form.get("is_premium") === "on",
      is_locked: form.get("is_locked") === "on",
      is_agoris_certified: form.get("is_agoris_certified") === "on",
      logo_url: form.get("logo_url") || null,
      cover_image_url: form.get("cover_image_url") || null,
      seo_title: form.get("seo_title") || null,
      seo_description: form.get("seo_description") || null,
      // V5 workflow éditorial
      locked_fields: lockedFields,
      notes_internes: form.get("notes_internes") || null,
      alert_flag: alertFlag,
      // V5.7 secteurs M:N
      sector_ids: selectedSectorIds,
      ...(markHumanCheck && { last_human_check_at: new Date().toISOString() }),
      // V5.6 — MDX éditorial en DB
      editorial_mdx: form.get("editorial_mdx") || null,
      ...(form.get("editorial_mdx") && {
        editorial_updated_at: new Date().toISOString(),
      }),
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

  const inputClass =
    "mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const lockProps = { lockedFields, toggleLock };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="max-w-2xl space-y-5"
    >
      {/* ─── Workflow header ─── */}
      <section className="rounded-md border border-border bg-ivoire p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted">
              Statut éditorial
            </label>
            <select
              name="status"
              defaultValue={field(d, "status", "draft")}
              className={`${inputClass} mt-1`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setAlertFlag((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              alertFlag
                ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-border bg-white text-muted hover:bg-ivoire hover:text-ink"
            }`}
            title="Marqueur de priorité admin"
          >
            <Flag className={`h-4 w-4 ${alertFlag ? "fill-red-500" : ""}`} />
            {alertFlag ? "Fiche signalée" : "Signaler"}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <User className="h-3.5 w-3.5" />
            <span>
              Dernière vérification humaine :{" "}
              <span className="font-medium text-ink">
                {formatDateTime(d.last_human_check_at as string | null)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Bot className="h-3.5 w-3.5" />
            <span>
              Dernier sync IA :{" "}
              <span className="font-medium text-ink">
                {formatDateTime(d.last_ia_update_at as string | null)}
              </span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            const formEl = (e.target as HTMLElement).closest("form");
            if (formEl) {
              const fakeEvent = {
                preventDefault: () => {},
                currentTarget: formEl,
              } as unknown as React.FormEvent<HTMLFormElement>;
              handleSubmit(fakeEvent, true);
            }
          }}
          disabled={saving}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Marquer comme vérifié humainement maintenant
        </button>
      </section>

      {/* ─── Feedback ─── */}
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

      {/* ─── Nom + Slug ─── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel fieldName="name" label="Nom" required {...lockProps} />
          <input
            name="name"
            required
            defaultValue={field(d, "name")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="slug" label="Slug" required {...lockProps} />
          <input
            name="slug"
            required
            defaultValue={field(d, "slug")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Description ─── */}
      <div>
        <FieldLabel fieldName="description" label="Description" {...lockProps} />
        <textarea
          name="description"
          rows={4}
          defaultValue={field(d, "description")}
          className={inputClass}
        />
      </div>

      {/* ─── Lieu ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel fieldName="city" label="Ville" {...lockProps} />
          <input
            name="city"
            defaultValue={field(d, "city")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="venue" label="Lieu / Venue" {...lockProps} />
          {optionsLoaded && venueOptions.length > 0 ? (
            <select
              name="venue"
              defaultValue={field(d, "venue")}
              className={inputClass}
            >
              <option value="">· Aucun lieu sélectionné</option>
              {venueOptions.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}{v.city ? ` — ${v.city}` : ""}
                </option>
              ))}
              {/* Fallback : si la venue du salon n'est pas dans la liste, afficher l'option actuelle */}
              {field(d, "venue") &&
                !venueOptions.some((v) => v.name === field(d, "venue")) && (
                  <option value={field(d, "venue")}>
                    {field(d, "venue")} (valeur actuelle, non répertoriée)
                  </option>
                )}
            </select>
          ) : (
            <input
              name="venue"
              defaultValue={field(d, "venue")}
              placeholder={optionsLoaded ? "Saisie libre" : "Chargement..."}
              className={inputClass}
            />
          )}
        </div>
        <div>
          <FieldLabel fieldName="country" label="Pays" {...lockProps} />
          <select
            name="country"
            defaultValue={field(d, "country", "FR")}
            className={inputClass}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Dates ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel fieldName="start_date" label="Date de début" {...lockProps} />
          <input
            name="start_date"
            type="date"
            defaultValue={field(d, "start_date")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="end_date" label="Date de fin" {...lockProps} />
          <input
            name="end_date"
            type="date"
            defaultValue={field(d, "end_date")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="edition_year" label="Année d'édition" {...lockProps} />
          <input
            name="edition_year"
            type="number"
            defaultValue={field(d, "edition_year")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Organisateur ─── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel fieldName="organizer_name" label="Organisateur" {...lockProps} />
          <input
            name="organizer_name"
            defaultValue={field(d, "organizer_name")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="organizer_email" label="Email organisateur" {...lockProps} />
          <input
            name="organizer_email"
            type="email"
            defaultValue={field(d, "organizer_email")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Site web ─── */}
      <div>
        <FieldLabel fieldName="website_url" label="Site web" {...lockProps} />
        <input
          name="website_url"
          type="url"
          defaultValue={field(d, "website_url")}
          className={inputClass}
        />
      </div>

      {/* ─── Fréquence + estimations ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel fieldName="frequency" label="Fréquence" {...lockProps} />
          <select
            name="frequency"
            defaultValue={field(d, "frequency")}
            className={inputClass}
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel fieldName="estimated_exhibitors" label="Exposants estimés" {...lockProps} />
          <input
            name="estimated_exhibitors"
            type="number"
            defaultValue={field(d, "estimated_exhibitors")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="estimated_visitors" label="Visiteurs estimés" {...lockProps} />
          <input
            name="estimated_visitors"
            type="number"
            defaultValue={field(d, "estimated_visitors")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Images ─── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel fieldName="logo_url" label="URL du logo" {...lockProps} />
          <input
            name="logo_url"
            type="url"
            defaultValue={field(d, "logo_url")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="cover_image_url" label="URL image de couverture" {...lockProps} />
          <input
            name="cover_image_url"
            type="url"
            defaultValue={field(d, "cover_image_url")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── SEO ─── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel fieldName="seo_title" label="SEO Title" {...lockProps} />
          <input
            name="seo_title"
            defaultValue={field(d, "seo_title")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel fieldName="seo_description" label="SEO Description" {...lockProps} />
          <input
            name="seo_description"
            defaultValue={field(d, "seo_description")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Secteurs (M:N via salon_sectors) ─── */}
      <div>
        <label className="block text-sm font-medium text-ink">
          Secteurs{" "}
          <span className="text-xs text-muted">
            ({selectedSectorIds.length} sélectionné{selectedSectorIds.length > 1 ? "s" : ""})
          </span>
        </label>
        {optionsLoaded ? (
          sectorOptions.length > 0 ? (
            <div className="mt-1 grid grid-cols-2 gap-1.5 rounded-md border border-border bg-white p-3 sm:grid-cols-3">
              {sectorOptions.map((sector) => (
                <label
                  key={sector.id}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                    selectedSectorIds.includes(sector.id)
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-ink hover:bg-ivoire"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSectorIds.includes(sector.id)}
                    onChange={() => toggleSector(sector.id)}
                    className="rounded border-border"
                  />
                  {sector.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted">Aucun secteur disponible.</p>
          )
        ) : (
          <p className="mt-1 text-xs text-muted">Chargement des secteurs...</p>
        )}
      </div>

      {/* ─── Notes internes (admin-only, non publié) ─── */}
      <div>
        <label className="block text-sm font-medium text-ink">
          Notes internes <span className="text-xs text-muted">(non publiées)</span>
        </label>
        <textarea
          name="notes_internes"
          rows={3}
          defaultValue={field(d, "notes_internes")}
          placeholder="Arbitrages éditoriaux, informations en attente de confirmation, alertes..."
          className={inputClass}
        />
      </div>

      {/* ─── MDX éditorial (8-10 blocs : À retenir / Qui expose / Animations / Sur place / RSE / Historique) ─── */}
      <div>
        <FieldLabel
          fieldName="editorial_mdx"
          label="Contenu éditorial (MDX)"
          {...lockProps}
        />
        <p className="mt-1 text-xs text-muted">
          Article éditorial complet de la fiche (Agoris Certified). Format
          Markdown enrichi : <code className="rounded bg-ivoire px-1 text-[10px]">## Titre de bloc</code>, listes, liens, etc.
          {d.editorial_updated_at ? (
            <>
              {" "}Dernière modification :{" "}
              <span className="font-medium text-ink">
                {formatDateTime(d.editorial_updated_at as string)}
              </span>
            </>
          ) : null}
        </p>
        <textarea
          name="editorial_mdx"
          rows={18}
          defaultValue={field(d, "editorial_mdx")}
          placeholder="## À retenir&#10;&#10;- Premier point factuel verifiable...&#10;&#10;## Qui expose&#10;&#10;### Profil type&#10;..."
          className={`${inputClass} font-mono text-xs`}
        />
      </div>

      {/* ─── Checkboxes héritage ─── */}
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
          Verrouillage global (legacy)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="is_agoris_certified"
            type="checkbox"
            defaultChecked={Boolean(d.is_agoris_certified)}
            className="rounded border-border"
          />
          Agoris Certified
          <span className="text-xs text-muted">(badge public)</span>
        </label>
      </div>

      {/* ─── Submit ─── */}
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
