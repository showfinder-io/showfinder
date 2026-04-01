import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSectors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tous les secteurs",
  description: `Parcourez les salons professionnels par secteur d'activité sur ${siteConfig.name}.`,
};

export default async function SecteursPage() {
  const sectors = await getSectors();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Secteurs d&apos;activité
      </h1>
      <p className="mt-2 text-muted">
        {sectors.length} secteur{sectors.length > 1 ? "s" : ""} répertorié
        {sectors.length > 1 ? "s" : ""}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector) => (
          <Link
            key={sector.id}
            href={`/secteurs/${sector.slug}`}
            className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-bold tracking-tight group-hover:text-accent transition-colors">
              {sector.name}
            </h2>
            {sector.description && (
              <p className="mt-2 text-sm text-muted line-clamp-3">
                {sector.description}
              </p>
            )}
            <span className="mt-4 inline-flex items-center text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
              Voir les salons &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
