"use client";

import { useState } from "react";
import { Flag, Loader2, CheckCircle } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const FIELD_OPTIONS = [
  { value: "dates", label: "Dates" },
  { value: "lieu", label: "Lieu" },
  { value: "site_web", label: "Site web" },
  { value: "description", label: "Description" },
  { value: "chiffres", label: "Nombre d'exposants / visiteurs" },
  { value: "autre", label: "Autre" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function ReportError({ salonSlug }: { salonSlug: string }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState("");
  const [correction, setCorrection] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!field || !correction.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonSlug,
          field,
          correction: correction.trim(),
          email: email.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Réinitialiser le formulaire à la fermeture
      setTimeout(() => {
        setField("");
        setCorrection("");
        setEmail("");
        setStatus("idle");
      }, 200);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <button className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors cursor-pointer" />
        }
      >
        <Flag className="h-3.5 w-3.5" />
        Une information incorrecte ? Signaler une erreur
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Signaler une erreur</SheetTitle>
          <SheetDescription>
            Aidez-nous à maintenir des informations fiables sur les salons.
          </SheetDescription>
        </SheetHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-4 pb-6 pt-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <p className="text-sm text-center text-muted">
              Merci pour votre signalement ! Nous vérifierons cette information
              dans les plus brefs délais.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-6">
            {/* Champ concerné */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="report-field" className="text-sm font-medium">
                Quel champ est incorrect ?
              </label>
              <select
                id="report-field"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="" disabled>
                  Sélectionner...
                </option>
                {FIELD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Correction */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="report-correction" className="text-sm font-medium">
                Quelle est la bonne information ?
              </label>
              <textarea
                id="report-correction"
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                required
                rows={3}
                placeholder="Décrivez la correction à apporter..."
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none resize-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Email optionnel */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="report-email" className="text-sm font-medium">
                Votre email{" "}
                <span className="font-normal text-muted">(optionnel, pour être notifié de la correction)</span>
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting" || !field || !correction.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer le signalement"
              )}
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
