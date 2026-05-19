import Link from "next/link";
import { formatDateRange, formatNumber } from "@/lib/format";
import { SectorBadge } from "@/components/sector-badge";
import { AgorisVerifiedBadge } from "@/components/agoris-verified-badge";
import type { SalonWithSectors } from "@/lib/queries";

type SalonCardProps = {
  salon: SalonWithSectors;
};

/**
 * Carte salon "Clean Cut" — modèle épuré conforme au brief Agoris.
 * Composition : tag sectoriel + badge Verified (si applicable) + titre Fraunces + lieu
 * + triptyque vital Dates / Visiteurs / Exposants. Pas de CTA — toute la carte est cliquable.
 *
 * Note : `is_agoris_verified` est optionnel tant que la migration S5 n'est pas appliquée.
 */
export function SalonCard({ salon }: SalonCardProps) {
  const isPast =
    !!salon.start_date &&
    new Date(salon.start_date) < new Date(new Date().toDateString());
  const verified = salon.is_agoris_verified === true;
  const firstSector = salon.sectors[0];
  const extraSectorCount = Math.max(0, salon.sectors.length - 1);

  return (
    <article
      className={`group relative rounded-lg border border-border bg-papier transition-shadow hover:shadow-md ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <Link
        href={`/salons/${salon.slug}`}
        className="block p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-prune/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sable rounded-lg"
        aria-label={`${salon.name}${
          salon.edition_year ? ` ${salon.edition_year}` : ""
        }`}
      >
        {/* En-tête : tags + verified + édition passée */}
        <div className="flex flex-wrap items-center gap-2">
          {firstSector && (
            <SectorBadge
              slug={firstSector.slug}
              name={firstSector.name}
              linked={false}
            />
          )}
          {extraSectorCount > 0 && (
            <span className="text-xs text-muted" aria-label={`et ${extraSectorCount} autre secteur(s)`}>
              +{extraSectorCount}
            </span>
          )}
          {verified && <AgorisVerifiedBadge />}
          {isPast && (
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted">
              Édition passée
            </span>
          )}
        </div>

        {/* Titre + lieu */}
        <h3 className="mt-5 font-serif text-xl font-semibold leading-tight tracking-tight text-prune">
          {salon.name}
          {salon.edition_year && (
            <span className="text-muted"> · {salon.edition_year}</span>
          )}
        </h3>
        {(salon.venue || salon.city) && (
          <p className="mt-1 text-sm text-muted">
            {salon.venue && salon.city
              ? `${salon.venue}, ${salon.city}`
              : salon.venue ?? salon.city}
          </p>
        )}

        {/* Triptyque vital : Dates · Visiteurs · Exposants */}
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
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
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-base font-semibold text-prune">
        {value ?? <span className="text-muted">—</span>}
      </dd>
    </div>
  );
}
