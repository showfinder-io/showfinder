import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSalons, getSectors } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Le forum des salons
          </p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-prune md:text-6xl">
            Le bon salon ne se trouve pas.
            <br />
            <span className="text-prune/70">Il se reconnaît.</span>
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

      {/* PROCHAINS SALONS — placé en premier après le hero (l'essentiel) */}
      <section className="bg-sable py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                À l&apos;agenda
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-prune md:text-4xl">
                Prochains salons
              </h2>
            </div>
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
      <section className="border-t border-border bg-sable py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Par filière
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-prune md:text-4xl">
            Explorer par secteur
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted">
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

      {/* POURQUOI AGORIS — bloc institutionnel Prune */}
      <section className="bg-prune py-16 text-papier md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocre">
            Pourquoi Agoris
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Un annuaire qui audite, classe et certifie.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <Argument
              title="Curation, pas accumulation"
              body="On référence les salons B2B qui comptent vraiment pour votre filière, pas tous ceux qui existent."
            />
            <Argument
              title="Marketplace prestataires"
              body="Standistes, traiteurs, audiovisuel : un réseau de prestataires locaux rattaché à chaque salon."
            />
            <Argument
              title="Contenu éditorial expert"
              body="Guides sectoriels, comparatifs de lieux, benchmarks : nous publions ce que les annuaires data ne savent pas écrire."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Argument({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-papier/75">{body}</p>
    </div>
  );
}
