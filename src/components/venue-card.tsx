import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { formatNumber } from "@/lib/format";
import type { VenueRow } from "@/lib/queries";

type VenueCardProps = {
  venue: VenueRow;
  /** Nombre de salons hébergés (calculé côté page). Optionnel. */
  salonCount?: number;
};

/**
 * Card lieu d'exposition — refonte V1 Agoris (mai 2026).
 * Pattern aligné sur SalonCard / ProviderCard pour cohérence visuelle :
 *  - top : photo (placeholder si absente) ratio 3/2
 *  - eyebrow mono "VILLE"
 *  - titre Fraunces 28px (nom du lieu)
 *  - stats grid : Surface · Salons hébergés (si salonCount fourni)
 *  - hover : fond ivoire chaud (#FBF7EA) + translateY(-2px) + arrow ocre bottom-right
 */
export async function VenueCard({ venue, salonCount }: VenueCardProps) {
  const t = await getTranslations("card.venue");

  return (
    <article className="group relative overflow-hidden rounded-lg bg-ivoire transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FBF7EA]">
      <Link
        href={`/lieux/${venue.slug}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable"
        aria-label={`${venue.name}, ${venue.city}`}
      >
        <div className="flex flex-1 flex-col gap-4 p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {venue.city}
          </p>

          <h3 className="font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.015em] text-prune">
            {venue.name}
          </h3>

          <dl
            className="mt-auto grid gap-4 border-t border-border pt-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <Stat
              label={t("statSurface")}
              value={
                venue.total_surface_sqm
                  ? `${formatNumber(venue.total_surface_sqm)} m²`
                  : null
              }
            />
            <Stat
              label={t("statSalons")}
              value={salonCount !== undefined ? String(salonCount) : null}
            />
          </dl>
        </div>
      </Link>

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
      <dd className="mt-1.5 font-serif text-[22px] font-normal leading-[1.1] tracking-[-0.01em] text-prune tabular-nums">
        {value ?? <span className="text-muted">·</span>}
      </dd>
    </div>
  );
}
