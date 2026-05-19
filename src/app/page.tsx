import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSalons, getSectors } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";
import { SectionTitle } from "@/components/section-title";
import { Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
};

export default async function Home() {
  const [{ salons: upcomingSalons }, sectors] = await Promise.all([
    getSalons({ pageSize: 6, sort: "date", upcoming: true }),
    getSectors(),
  ]);

  return (
    <div>
      {/* HERO — Calm tech : fond sable, typo Fraunces large, search proéminente */}
      <section className="border-b border-border bg-sable">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:py-28">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Le forum des salons
          </p>
          <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.05] tracking-[-0.015em] text-prune md:text-6xl">
            Là où les industries
            <br />
            <span className="text-prune/70">se retrouvent</span>
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-prune/80 md:text-lg">
            {siteConfig.description}
          </p>

          {/* Barre de recherche */}
          <form action="/salons" className="mt-12">
            <div className="mx-auto flex max-w-xl items-stretch overflow-hidden rounded-lg border border-prune/20 bg-papier shadow-sm focus-within:border-prune/50 focus-within:shadow-md transition-all">
              <span className="flex shrink-0 items-center pl-4 text-muted">
                <Search className="h-4 w-4" aria-hidden="true" />
              </span>
              <input
                type="text"
                name="search"
                placeholder="Rechercher un salon, un secteur..."
                className="flex-1 bg-transparent px-3 py-4 text-sm text-prune outline-none placeholder:text-muted"
                aria-label="Rechercher un salon ou un secteur"
              />
              <button
                type="submit"
                className="shrink-0 bg-prune px-6 py-4 text-sm font-medium text-papier transition-opacity hover:opacity-90"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* PROCHAINS SALONS */}
      <section className="bg-sable py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="À l'agenda" size="lg">
              Prochains salons
            </SectionTitle>
            <Link
              href="/salons"
              className="inline-flex items-center gap-1 text-sm font-medium text-prune underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              Voir tous les salons
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORER PAR SECTEUR */}
      <section className="border-t border-border bg-sable py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
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
              title="Contenu éditorial expert"
              body="Guides sectoriels, comparatifs de lieux, benchmarks : nous publions ce que les annuaires data ne savent pas écrire."
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
        {number}<span aria-hidden="true">.</span>
      </span>
      <h3 className="mt-4 font-serif text-[28px] font-normal leading-tight tracking-[-0.015em] text-papier">
        {title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-papier/75">{body}</p>
    </li>
  );
}
