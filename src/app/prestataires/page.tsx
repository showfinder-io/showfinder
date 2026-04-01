import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import {
  getProviders,
  getProviderCities,
  PROVIDER_CATEGORY_LABELS,
} from "@/lib/queries";
import { ProviderCard } from "@/components/provider-card";

export const metadata: Metadata = {
  title: "Prestataires pour salons professionnels",
  description: `Trouvez les meilleurs prestataires pour votre salon professionnel sur ${siteConfig.name} : standistes, traiteurs, audiovisuel, photographes.`,
};

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function PrestatairesPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category ?? "";
  const city = params.city ?? "";

  const [providers, cities] = await Promise.all([
    getProviders({ category: category || undefined, city: city || undefined }),
    getProviderCities(),
  ]);

  const categories = Object.entries(PROVIDER_CATEGORY_LABELS);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Prestataires pour salons professionnels
      </h1>
      <p className="mt-2 text-muted">
        {providers.length} prestataire{providers.length > 1 ? "s" : ""}
      </p>

      {/* Filtres */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form action="/prestataires" className="flex flex-1 gap-4">
          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted outline-none focus:border-accent"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            name="city"
            defaultValue={city}
            className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted outline-none focus:border-accent"
          >
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
            Filtrer
          </button>
        </form>
      </div>

      {/* Résultats */}
      {providers.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted">
            Aucun prestataire ne correspond à vos critères.
          </p>
        </div>
      )}
    </div>
  );
}
