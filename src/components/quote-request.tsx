"use client";

import { useState } from "react";
import { Loader2, CheckCircle, FileText } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteRequest({ providerId, providerName }: { providerId: string; providerName: string }) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [salonName, setSalonName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !message.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          companyName: companyName.trim(),
          email: email.trim(),
          salonName: salonName.trim() || null,
          message: message.trim(),
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
      setTimeout(() => {
        setCompanyName("");
        setEmail("");
        setSalonName("");
        setMessage("");
        setStatus("idle");
      }, 200);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer" />
        }
      >
        <FileText className="h-4 w-4" />
        Demander un devis
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Demander un devis à {providerName}</SheetTitle>
          <SheetDescription>
            Décrivez votre besoin et le prestataire vous contactera sous 48h.
          </SheetDescription>
        </SheetHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-4 pb-6 pt-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <p className="text-sm text-center text-muted">
              Votre demande a été envoyée. Le prestataire vous contactera sous 48h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-6">
            {/* Nom entreprise */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-company" className="text-sm font-medium">
                Nom de votre entreprise
              </label>
              <input
                id="quote-company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Votre société"
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="quote-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@exemple.com"
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Salon concerné (optionnel) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-salon" className="text-sm font-medium">
                Salon concerné{" "}
                <span className="font-normal text-muted">(optionnel)</span>
              </label>
              <input
                id="quote-salon"
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                placeholder="Pour quel salon ?"
                className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-message" className="text-sm font-medium">
                Message / détails du besoin
              </label>
              <textarea
                id="quote-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Décrivez votre besoin : type de stand, surface, dates..."
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
              disabled={status === "submitting" || !companyName.trim() || !email.trim() || !message.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer la demande"
              )}
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
