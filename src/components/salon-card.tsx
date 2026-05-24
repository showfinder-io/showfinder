import Link from "next/link";
import { formatDateRange, formatNumber } from "@/lib/format";
import { SectorBadge } from "@/components/sector-badge";
import { AgorisCertifiedBadge } from "@/components/agoris-certified-badge";
import type { SalonWithSectors } from "@/lib/queries";

type SalonCardProps = {
  salon: SalonWithSectors;
};

/**
 * Card salon — Hero V1 refondu (mai 2026).
 * Composition :
 *  - top : pill secteur (variant outline prune) + eyebrow mono "ANNÉE" (à droite)
 *  - titre Fraunces 32px + lieu Inter 14px (text-muted)
 *  - stats grid 2fr 1fr 1fr (Dates · Visiteurs · Exposants)
 *  - hover : fond ivoire chaud (#FBF7EA) + translateY(-2px) + arrow ocre bottom-right
 *
 * Pas de `edition_number` dans la DB pour le moment : l'eyebrow ne montre que l'année.
 */
export function SalonCard({ salon }: SalonCardProps) {
  const isPast =
    !!salon.start_date &&
    new Date(salon.start_date) < new Date(new Date().toDateString());
  const certified = salon.is_agoris_certified === true;
  const firstSector = salon.sectors[0];
  const extraSectorCount = Math.max(0, salon.sectors.length - 1);
  // Eyebrow date : édition année (n° d'édition pas dispo en DB pour le moment).
  const eyebrowRight = salon.edition_year
    ? `${salon.edition_year}`
    : isPast
      ? "Édition passée"
      : "";

  return (
    <article
      className={`group relative rounded-lg bg-ivoire transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FBF7EA] ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <Link
        href={`/salons/${salon.slug}`}
        className="flex h-full flex-col gap-5 rounded-lg p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable"
        aria-label={`${salon.name}${
          salon.edition_year ? ` ${salon.edition_year}` : ""
        }`}
      >
        {/* TOP : pill secteur outline + eyebrow mono droite */}
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {firstSector && (
              <SectorBadge
                slug={firstSector.slug}
                name={firstSector.name}
                linked={false}
                variant="outline"
              />
            )}
            {extraSectorCount > 0 && (
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                aria-label={`et ${extraSectorCount} autre secteur(s)`}
              >
                +{extraSectorCount}
              </span>
            )}
            {certified && <AgorisCertifiedBadge />}
          </div>
          {eyebrowRight && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {eyebrowRight}
            </span>
          )}
        </div>

        {/* Titre + lieu */}
        <div>
          <h3 className="font-serif text-[32px] font-normal leading-[1.05] tracking-[-0.015em] text-prune">
            {salon.name}
          </h3>
          {(salon.venue || salon.city) && (
            <p className="mt-2 text-sm leading-[1.4] text-muted">
              {salon.venue && salon.city
                ? `${salon.venue}, ${salon.city}`
                : (salon.venue ?? salon.city)}
            </p>
          )}
        </div>

        {/* Triptyque vital : grid asymétrique 2fr 1fr 1fr (Dates plus large). */}
        <dl
          className="mt-auto grid gap-4 border-t border-border pt-4"
          style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
        >
          <Stat
            label="Dates"
            value={
              salon.start_date
                ? formatDateRange(salon.start_date, salon.end_date)
                : null
            }
          />
          <Stat
            label="Visiteurs"
            value={
              salon.estimated_visitors
                ? formatNumber(salon.estimated_visitors)
                : null
            }
          />
          <Stat
            label="Exposants"
            value={
              salon.estimated_exhibitors
                ? formatNumber(salon.estimated_exhibitors)
                : null
            }
          />
        </dl>
      </Link>

      {/* Arrow ocre apparait au hover, bottom-right (hors du Link pour ne pas voler le click). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 right-7 -translate-x-1.5 font-serif text-xl text-ocre opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      >
        →
      </span>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd className="mt-1.5 font-serif text-[22px] font-normal leading-[1.1] tracking-[-0.01em] text-prune">
        {value ?? <span className="text-muted">·</span>}
      </dd>
    </div>
  );
}
