import Link from "next/link";
import { formatDateRange, formatNumber } from "@/lib/format";
import { SectorBadge, getSectorBorderColor } from "@/components/sector-badge";
import type { SalonWithSectors } from "@/lib/queries";
import { MapPin, Calendar, Users } from "lucide-react";

type SalonCardProps = {
  salon: SalonWithSectors;
};

export function SalonCard({ salon }: SalonCardProps) {
  const isPast =
    !!salon.start_date &&
    new Date(salon.start_date) < new Date(new Date().toDateString());

  const borderColorClass =
    salon.sectors.length > 0
      ? getSectorBorderColor(salon.sectors[0].slug)
      : "border-l-border";

  return (
    <article
      className={`group rounded-lg border border-border border-l-2 ${borderColorClass} bg-white p-6 transition-shadow hover:shadow-md${isPast ? " opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-4">
        {/* Badge edition passee */}
        {isPast && (
          <span className="inline-block self-start rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
            Édition passée
          </span>
        )}

        {/* Nom + logo */}
        <div className="flex items-start gap-3">
          {salon.logo_url && (
            <img
              src={salon.logo_url}
              alt=""
              className="h-8 w-8 shrink-0 rounded"
            />
          )}
          <h3 className="font-serif text-lg font-bold tracking-tight">
            <Link
              href={`/salons/${salon.slug}`}
              className="hover:text-accent transition-colors"
            >
              {salon.name}
            </Link>
          </h3>
        </div>

        {/* Secteurs */}
        {salon.sectors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {salon.sectors.map((sector) => (
              <SectorBadge
                key={sector.id}
                slug={sector.slug}
                name={sector.name}
                linked={false}
              />
            ))}
          </div>
        )}

        {/* Triptyque : dates, lieu, exposants */}
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {salon.start_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDateRange(salon.start_date, salon.end_date)}</span>
            </div>
          )}
          {salon.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{salon.city}</span>
            </div>
          )}
          {salon.estimated_exhibitors && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{formatNumber(salon.estimated_exhibitors)} exposants</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/salons/${salon.slug}`}
          className="mt-2 inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Voir l&apos;essentiel &rarr;
        </Link>
      </div>
    </article>
  );
}
