"use client";

import { useState } from "react";
import { FileText, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * Demande de devis prestataire simplifiee en mailto le temps que
 * l'API /api/quotes et la mise en relation backend soient fiabilisees.
 * Subject pre-rempli avec le nom du prestataire pour le tri.
 */
export function QuoteRequest({
  providerId: _providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [open, setOpen] = useState(false);
  const subject = encodeURIComponent(
    `[Agoris] Demande de devis: ${providerName}`
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer" />
        }
      >
        <FileText className="h-4 w-4" />
        Demander un devis
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-xl max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Demander un devis à {providerName}</SheetTitle>
          <SheetDescription>
            Décrivez votre besoin par email : nous vous mettons en relation
            avec le prestataire.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <p className="text-sm leading-relaxed text-muted">
            Indiquez votre société, votre email de contact, le salon concerné
            si applicable, et décrivez votre besoin (stand, services associés,
            volume, dates). Le prestataire recevra votre demande sous 48h.
          </p>
          <a
            href={`mailto:hello@agoris.io?subject=${subject}`}
            onClick={() => trackEvent("quote_request_submit", { provider_name: providerName })}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Mail className="h-4 w-4" />
            Écrire à hello@agoris.io
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
