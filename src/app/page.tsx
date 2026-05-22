import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSalons, getSectors } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";
import { SectionTitle } from "@/components/section-title";
import { Hero } from "@/components/hero";

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
};

export default async function Home() {
  // 1 seul appel = 1 round-trip : on récupère les 6 prochains salons + le count total
  //    publiés (toutes éditions). Le count est utilisé dans le Hero ("196 salons indexés")
  //    et dans le CTA "Voir les N salons".
  // Note : getSalons retourne `total` = count(*) FILTRÉ par les conditions appliquées,
  // donc ici "published" + "upcoming". Pour avoir le total brut indexé (incluant les
  // éditions passées), on fait un appel séparé sans `upcoming`.
  const [
    { salons: upcomingSalons },
    { total: totalPublished },
    sectors,
  ] = await Promise.all([
    getSalons({ pageSize: 6, sort: "date", upcoming: true }),
    getSalons({ pageSize: 1, sort: "date" }),
    getSectors(),
  ]);

  return (
    <div>
      {/* HERO V1 refondu — éditorial, watermark symbole, search underline */}
      <Hero totalSalons={totalPublished} />

      {/* PROCHAINS SALONS */}
      <section className="border-b border-border bg-sable py-22 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle eyebrow="À l'agenda" size="xl">
              Prochains salons
            </SectionTitle>
            {/* CTA Fraunces italic souligné ocre — pattern "section-cta" du mockup */}
            <Link
              href="/salons"
              className="font-serif italic text-prune transition-colors hover:text-[var(--color-warning)]"
              style={{
                fontSize: "18px",
                borderBottom: "1px solid var(--color-ocre)",
                paddingBottom: "2px",
                lineHeight: "1.2",
              }}
            >
              Voir les{" "}
              <span
                className="not-italic font-serif text-ocre"
                style={{ fontStyle: "normal" }}
              >
                {totalPublished}
              </span>{" "}
              salons
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORER PAR SECTEUR */}
      <section className="border-b border-border bg-sable py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14">
          <SectionTitle eyebrow="Par filière" size="lg">
            Explorer par secteur
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-base text-muted">
            15 filières B2B couvertes, du BTP à la cosmétique. Chaque secteur regroupe les salons audités et classés par notre équipe éditoriale.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <SectorBadge
                key={sector.id}
                slug={sector.slug}
                name={sector.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI AGORIS — bloc Prune, numéros 01/02/03 en Ocre, padding généreux */}
      <section className="bg-prune py-[120px]">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle eyebrow="Pourquoi Agoris" size="xl" variant="on-prune">
            Un annuaire qui audite, classe et certifie
          </SectionTitle>
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            <Argument
              number="01"
              title="Curation, pas accumulation"
              body="On référence les salons B2B qui comptent vraiment pour votre filière, pas tous ceux qui existent."
            />
            <Argument
              number="02"
              title="Marketplace prestataires"
              body="Standistes, traiteurs, audiovisuel : un réseau de prestataires locaux rattaché à chaque salon."
            />
            <Argument
              number="03"
              title="Le bon salon, au bon moment"
              body="Calendrier mis à jour en continu et alertes par secteur pour ne rien manquer. Avis certifiés d'exposants et de visiteurs pour choisir en confiance."
            />
          </ol>
        </div>
      </section>
    </div>
  );
}

function Argument({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex flex-col">
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-ocre">
        {number}
        <span aria-hidden="true">.</span>
      </span>
      <h3 className="mt-4 font-serif text-[28px] font-normal leading-tight tracking-[-0.015em] text-papier">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-papier/75">{body}</p>
    </li>
  );
}
