"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StarRating } from "@/components/star-rating";
import { Loader2, CheckCircle, LogIn } from "lucide-react";

type ReviewFormProps = {
  targetType: "salon" | "provider";
  targetId: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const ROLE_OPTIONS = [
  { value: "exposant", label: "Exposant" },
  { value: "visiteur", label: "Visiteur" },
  { value: "organisateur", label: "Organisateur" },
];

export function ReviewForm({ targetType, targetId }: ReviewFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!userId) {
    return (
      <div className="rounded-lg border border-border bg-white p-6 text-center">
        <LogIn className="mx-auto h-6 w-6 text-muted" />
        <p className="mt-2 text-sm text-muted">
          <Link
            href="/connexion"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Connectez-vous
          </Link>{" "}
          pour laisser un avis.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <p className="text-sm text-center text-muted">
          Merci pour votre avis ! Il a bien été enregistré.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !role) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          rating,
          role,
          title: title.trim() || null,
          body: body.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6"
    >
      <h3 className="font-serif text-lg font-bold">Laisser un avis</h3>

      {/* Note */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Note *</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Rôle */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-role" className="text-sm font-medium">
          Votre rôle *
        </label>
        <select
          id="review-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="" disabled>
            Sélectionner...
          </option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Titre */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Résumez votre expérience"
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Corps */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-body" className="text-sm font-medium">
          Votre avis
        </label>
        <textarea
          id="review-body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Partagez votre expérience en détail..."
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none resize-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || rating === 0 || !role}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi...
          </>
        ) : (
          "Publier mon avis"
        )}
      </button>
    </form>
  );
}
