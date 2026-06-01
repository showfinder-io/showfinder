// Boutons "Ajouter à l'agenda" sur la fiche salon.
// Cf. brief évolutions juin 2026 §3.
//   - Google Calendar : URL pré-remplie vers calendar.google.com (pas de back-end)
//   - .ics : route /api/salons/[slug]/ics (compatible Apple Calendar, Outlook, etc.)

import { CalendarPlus, Download } from "lucide-react";
import { siteConfig } from "@/lib/config";

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

/** YYYY-MM-DD -> YYYYMMDD. */
function toCompactDate(iso: string): string {
  return iso.replace(/-/g, "");
}

/** Ajoute 1 jour à une date ISO (DTEND exclusif Google Calendar all-day). */
function addOneDay(iso: string): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function buildGoogleCalendarUrl({
  slug,
  name,
  editionYear,
  startDate,
  endDate,
  city,
  venue,
  sectorLabel,
  shortDescription,
}: Props): string | null {
  if (!startDate) return null;

  const url = `${siteConfig.url}/salons/${slug}`;
  const title = editionYear ? `${name} ${editionYear}` : name;
  const dates = `${toCompactDate(startDate)}/${toCompactDate(addOneDay(endDate ?? startDate))}`;
  const location = [venue, city].filter(Boolean).join(", ");

  const descLines = [
    sectorLabel ? `Secteur : ${sectorLabel}` : null,
    shortDescription ? shortDescription.split(/[.!?]\s+/)[0] : null,
    `Fiche Agoris : ${url}`,
  ].filter(Boolean) as string[];

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    location,
    details: descLines.join("\n"),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function AddToAgenda(props: Props) {
  if (!props.startDate) return null;

  const googleUrl = buildGoogleCalendarUrl(props);
  const icsUrl = `/api/salons/${props.slug}/ics`;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {googleUrl && (
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-prune/20 bg-ivoire px-4 py-2 text-sm font-medium text-prune transition-colors hover:border-prune/40 hover:bg-[#FBF7EA]"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Ajouter à Google Calendar
        </a>
      )}
      <a
        href={icsUrl}
        className="inline-flex items-center gap-2 rounded-md border border-prune/20 bg-ivoire px-4 py-2 text-sm font-medium text-prune transition-colors hover:border-prune/40 hover:bg-[#FBF7EA]"
        download
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Télécharger .ics (Apple Calendar, Outlook)
      </a>
    </div>
  );
}
