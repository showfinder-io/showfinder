// Génère un fichier .ics (iCalendar) à partir des données d'un salon.
// Le visiteur télécharge le fichier et l'importe dans Apple Calendar,
// Outlook, ou tout autre client compatible — sans OAuth ni compte.
// Cf. brief évolutions juin 2026 §3 "Ajouter à l'agenda".

import { NextResponse } from "next/server";
import { getSalonBySlug } from "@/lib/queries";
import { siteConfig } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Format date YYYY-MM-DD -> YYYYMMDD (iCal). */
function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

/** Ajoute 1 jour à une date ISO (DTEND exclusif pour les événements all-day). */
function addOneDay(isoDate: string): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Format UTC timestamp pour DTSTAMP : 20260601T143000Z. */
function nowIcsStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Échappe les caractères spéciaux iCal dans les strings (RFC 5545). */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const salon = await getSalonBySlug(slug);

  if (!salon || !salon.start_date) {
    return new NextResponse("Salon introuvable ou dates non confirmées", {
      status: 404,
    });
  }

  const url = `${siteConfig.url}/salons/${slug}`;
  const location = [salon.venue, salon.city].filter(Boolean).join(", ");
  const dtStart = toIcsDate(salon.start_date);
  const dtEnd = toIcsDate(addOneDay(salon.end_date ?? salon.start_date));

  const sectorLabel = salon.sectors?.[0]?.name ?? null;
  const descLines = [
    sectorLabel ? `Secteur : ${sectorLabel}` : null,
    salon.description ? salon.description.split(/[.!?]\s+/)[0] : null,
    `Fiche Agoris : ${url}`,
  ].filter(Boolean) as string[];

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Agoris//Salons//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug}@agoris.io`,
    `DTSTAMP:${nowIcsStamp()}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeIcs(`${salon.name}${salon.edition_year ? ` ${salon.edition_year}` : ""}`)}`,
    `DESCRIPTION:${escapeIcs(descLines.join("\n"))}`,
    location ? `LOCATION:${escapeIcs(location)}` : "",
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
