"use client";

// Barre d'actions compacte (3 icônes) en haut de la fiche salon :
//   - Calendrier (dropdown : Google Calendar + .ics)
//   - Partage (Web Share API + fallback clipboard)
//   - 3-dots (Signaler une erreur)
// Reprend le pattern d'une concurrent identifié par le user (juin 2026).

import { useEffect, useRef, useState } from "react";
import {
  CalendarPlus,
  Share2,
  MoreVertical,
  Download,
  Flag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";
import { ReportErrorSheet } from "@/components/report-error";

type Props = {
  slug: string;
  name: string;
  editionYear?: number | null;
  startDate: string | null;
  endDate: string | null;
  city?: string | null;
  venue?: string | null;
  sectorLabel?: string | null;
  shortDescription?: string | null;
};

function toCompactDate(iso: string): string {
  return iso.replace(/-/g, "");
}

function addOneDay(iso: string): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function buildGoogleCalendarUrl(props: Props): string | null {
  if (!props.startDate) return null;
  const url = `${siteConfig.url}/salons/${props.slug}`;
  const title = props.editionYear ? `${props.name} ${props.editionYear}` : props.name;
  const dates = `${toCompactDate(props.startDate)}/${toCompactDate(
    addOneDay(props.endDate ?? props.startDate)
  )}`;
  const location = [props.venue, props.city].filter(Boolean).join(", ");
  const descLines = [
    props.sectorLabel ? `Secteur : ${props.sectorLabel}` : null,
    props.shortDescription ? props.shortDescription.split(/[.!?]\s+/)[0] : null,
    `Fiche Agoris : ${url}`,
  ].filter(Boolean) as string[];

  const params = new URLSearchParams({
    text: title,
    dates,
    location,
    details: descLines.join("\n"),
  });
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

/** Hook fermeture au clic extérieur. */
function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onClose: () => void
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

export function SalonActionsBar(props: Props) {
  const [calOpen, setCalOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  useClickOutside(calRef, () => setCalOpen(false));
  useClickOutside(moreRef, () => setMoreOpen(false));

  const googleUrl = buildGoogleCalendarUrl(props);
  const icsUrl = `/api/salons/${props.slug}/ics`;
  const fullUrl = `${siteConfig.url}/salons/${props.slug}`;

  async function handleShare() {
    if (typeof navigator === "undefined") return;
    const shareData = {
      title: props.editionYear
        ? `${props.name} ${props.editionYear}`
        : props.name,
      text: `${props.name} sur Agoris`,
      url: fullUrl,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
        toast.success("Lien copié dans le presse-papier");
      }
    } catch {
      // AbortError si l'user ferme le sheet share : on ne notifie pas.
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Calendrier */}
      {props.startDate && (
        <div ref={calRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setCalOpen((v) => !v);
              setMoreOpen(false);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-prune/15 bg-ivoire text-prune transition-colors hover:border-prune/30 hover:bg-[#FBF7EA]"
            aria-label="Ajouter à l'agenda"
            aria-expanded={calOpen}
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          </button>
          {calOpen && (
            <div className="absolute right-0 top-11 z-20 w-64 overflow-hidden rounded-md border border-border bg-white shadow-lg">
              {googleUrl && (
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 text-sm text-prune transition-colors hover:bg-ivoire"
                >
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <div>
                    <div className="font-medium">Google Calendar</div>
                    <div className="text-xs text-muted">Ouvrir un nouvel event pré-rempli</div>
                  </div>
                </a>
              )}
              <a
                href={icsUrl}
                onClick={() => setCalOpen(false)}
                className="flex items-start gap-3 border-t border-border px-4 py-3 text-sm text-prune transition-colors hover:bg-ivoire"
                download
              >
                <Download className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <div>
                  <div className="font-medium">Télécharger .ics</div>
                  <div className="text-xs text-muted">Apple Calendar, Outlook, autres</div>
                </div>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Partage */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-prune/15 bg-ivoire text-prune transition-colors hover:border-prune/30 hover:bg-[#FBF7EA]"
        aria-label="Partager"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* 3-dots — signalement */}
      <div ref={moreRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setMoreOpen((v) => !v);
            setCalOpen(false);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-prune/15 bg-ivoire text-prune transition-colors hover:border-prune/30 hover:bg-[#FBF7EA]"
          aria-label="Plus d'options"
          aria-expanded={moreOpen}
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        {moreOpen && (
          <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-md border border-border bg-white shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                setReportOpen(true);
              }}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-prune transition-colors hover:bg-ivoire"
            >
              <Flag className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <div>
                <div className="font-medium">Signaler une erreur</div>
                <div className="text-xs text-muted">Donnée incorrecte sur la fiche</div>
              </div>
            </button>
          </div>
        )}
      </div>

      <ReportErrorSheet
        salonSlug={props.slug}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </div>
  );
}
