import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSalons, getSectors } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SectorBadge } from "@/components/sector-badge";

export default async function Home() {
  const [{ salons: upcomingSalons }, sectors] = await Promise.all([
    getSalons({ pageSize: 6, sort: "date", upcoming: true }),
    getSectors(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-paper to-white py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Trouvez les salons professionnels qui comptent
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            {siteConfig.description}
          </p>

          {/* Barre de recherche */}
          <form action="/salons" className="mt-10">
            <div className="mx-auto flex max-w-lg gap-2">
              <input
                type="text"
                name="search"
                placeholder="Rechercher un salon, un secteur..."
                className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Secteurs */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Explorer par secteur
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
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

      {/* Salons a venir */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              Prochains salons
            </h2>
            <Link
              href="/salons"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Voir tous les salons &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
