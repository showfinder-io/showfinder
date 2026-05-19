"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BadgeCheck, MapPin, Star } from "lucide-react";

type Provider = {
  id: string;
  slug: string;
  company_name: string;
  category: string;
  city: string | null;
  is_verified: boolean;
  is_featured: boolean;
  subscription_tier: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  standiste: "Standistes",
  traiteur: "Traiteurs",
  av_technique: "Audiovisuel",
  photographe: "Photographes",
  transport: "Transport",
  hebergement: "Hébergement",
  autre: "Autres",
};

type ProviderDrawerProps = {
  salonId: string;
  salonName: string;
};

export function ProviderDrawer({ salonId, salonName }: ProviderDrawerProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadProviders() {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/providers/by-salon/${salonId}`);
      const data = await res.json();
      setProviders(data);
    } catch {
      setProviders([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  // Grouper par catégorie, premium en premier dans chaque groupe
  const grouped = providers.reduce<Record<string, Provider[]>>((acc, p) => {
    const cat = p.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  // Trier premium en premier dans chaque catégorie
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => {
      if (a.subscription_tier === "premium" && b.subscription_tier !== "premium") return -1;
      if (a.subscription_tier !== "premium" && b.subscription_tier === "premium") return 1;
      return 0;
    });
  }

  return (
    <section className="mt-12">
      <Sheet onOpenChange={(open) => { if (open) loadProviders(); }}>
        <SheetTrigger className="group block w-full rounded-lg bg-prune p-8 text-left text-papier transition-opacity hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable md:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ocre px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-prune">
            Marketplace prestataires
          </span>
          <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Organiser mon stand
          </h2>
          <p className="mt-2 max-w-xl text-sm text-papier/75">
            Standistes, traiteurs, audiovisuel, photographes : trouvez les prestataires recommandés pour {salonName}.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ocre transition-transform group-hover:translate-x-1">
            Voir les prestataires
            <span aria-hidden="true">→</span>
          </span>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto bg-sable text-prune sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-prune">
              Prestataires pour {salonName}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {loading && (
              <p className="text-sm text-muted">Chargement…</p>
            )}

            {!loading && providers.length === 0 && (
              <div className="rounded-lg border border-border bg-ivoire py-10 px-6 text-center">
                <p className="text-sm text-muted">
                  Pas encore de prestataires référencés pour ce salon.
                </p>
                <p className="mt-4 text-sm text-prune">
                  Vous êtes prestataire ?{" "}
                  <Link
                    href="/contact"
                    className="font-medium underline decoration-prune/30 underline-offset-2 hover:decoration-prune"
                  >
                    Contactez-nous
                  </Link>
                </p>
              </div>
            )}

            {!loading &&
              Object.entries(grouped).map(([category, catProviders]) => (
                <div key={category} className="mb-7">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {CATEGORY_LABELS[category] ?? category}
                  </h3>
                  <div className="space-y-2.5">
                    {catProviders.map((p) => {
                      const isPremium = p.subscription_tier === "premium";
                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between rounded-lg border p-3 transition-shadow hover:shadow-sm ${
                            isPremium
                              ? "border-ocre/40 bg-ocre/10"
                              : "border-border bg-ivoire"
                          }`}
                        >
                          <Link
                            href={`/prestataires/${p.slug}`}
                            className="flex-1"
                          >
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-medium text-prune">
                                {p.company_name}
                              </span>
                              {p.is_verified && (
                                <BadgeCheck
                                  className="h-3.5 w-3.5 text-prune"
                                  aria-label="Prestataire vérifié"
                                />
                              )}
                              {isPremium && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-ocre px-2 py-0.5 text-[10px] font-semibold text-prune">
                                  <Star className="h-2.5 w-2.5 fill-prune" />
                                  Recommandé
                                </span>
                              )}
                              {!isPremium && p.is_featured && (
                                <span className="rounded-full border border-prune/20 px-2 py-0.5 text-[10px] font-medium text-prune">
                                  Recommandé
                                </span>
                              )}
                            </div>
                            {p.city && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                                <MapPin className="h-3 w-3" aria-hidden="true" />
                                {p.city}
                              </div>
                            )}
                          </Link>
                          <Link
                            href={`/prestataires/${p.slug}`}
                            className="ml-3 shrink-0 rounded-md border border-prune/30 px-2.5 py-1 text-xs font-medium text-prune transition-colors hover:bg-prune hover:text-papier"
                          >
                            Devis
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
