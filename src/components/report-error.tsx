"use client";

import { useState } from "react";
import { Flag, Mail } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * Sheet "Signaler une erreur" simplifie en mailto direct le temps que
 * l'API /api/reports soit fiabilisee. On garde le bottom-sheet UX +
 * un subject mailto pre-rempli qui inclut le slug du salon pour
 * faciliter le tri cote support.
 */
export function ReportErrorSheet({
  salonSlug,
  open,
  onOpenChange,
}: {
  salonSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const subject = encodeURIComponent(
    `[Agoris] Signaler une erreur sur le salon: ${salonSlug}`
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-xl max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Signaler une erreur</SheetTitle>
          <SheetDescription>
            Aidez-nous a maintenir des informations fiables sur les salons.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <p className="text-sm leading-relaxed text-muted">
            Decrivez-nous l&apos;erreur (date, lieu, site web, description,
            chiffres, autre) ainsi que la bonne information. Nous verifierons
            et corrigerons la fiche dans les plus brefs delais.
          </p>
          <a
            href={`mailto:hello@agoris.io?subject=${subject}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Mail className="h-4 w-4" />
            Ecrire a hello@agoris.io
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Wrapper legacy : bouton trigger inline + sheet auto-geree. */
export function ReportError({ salonSlug }: { salonSlug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors cursor-pointer" />
          }
        >
          <Flag className="h-3.5 w-3.5" />
          Une information incorrecte ? Signaler une erreur
        </SheetTrigger>
      </Sheet>
      <ReportErrorSheet
        salonSlug={salonSlug}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
