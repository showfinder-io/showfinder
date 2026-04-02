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
    <section className="mt-10">
      <Sheet onOpenChange={(open) => { if (open) loadProviders(); }}>
        <SheetTrigger className="w-full rounded-lg border border-accent/20 bg-accent/5 p-8 text-center transition-colors hover:bg-accent/10 cursor-pointer">
          <h2 className="font-serif text-xl font-bold tracking-tight">
            Organiser mon stand
          </h2>
          <p className="mt-2 text-sm text-muted">
            Trouvez les prestataires recommandés pour ce salon : standistes,
            traiteurs, photographes...
          </p>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">
              Prestataires pour {salonName}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {loading && (
              <p className="text-sm text-muted">Chargement...</p>
            )}

            {!loading && providers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted">
                  Pas encore de prestataires référencés pour ce salon.
                </p>
                <p className="mt-4 text-sm text-muted">
                  Vous êtes prestataire ?{" "}
                  <Link href="/contact" className="text-accent hover:text-accent-hover">
                    Contactez-nous
                  </Link>
                </p>
              </div>
            )}

            {!loading &&
              Object.entries(grouped).map(([category, catProviders]) => (
                <div key={category} className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                    {CATEGORY_LABELS[category] ?? category}
                  </h3>
                  <div className="space-y-3">
                    {catProviders.map((p) => {
                      const isPremium = p.subscription_tier === "premium";
                      return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between rounded-lg border p-3 transition-shadow hover:shadow-sm ${
                          isPremium ? "border-amber-200 bg-amber-50/30" : "border-border"
                        }`}
                      >
                        <Link
                          href={`/prestataires/${p.slug}`}
                          className="flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {p.company_name}
                            </span>
                            {p.is_verified && (
                              <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                            )}
                            {isPremium && (
                              <span className="inline-flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                Recommandé
                              </span>
                            )}
                            {!isPremium && p.is_featured && (
                              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                                Recommandé
                              </span>
                            )}
                          </div>
                          {p.city && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                              <MapPin className="h-3 w-3" />
                              {p.city}
                            </div>
                          )}
                        </Link>
                        <Link
                          href={`/prestataires/${p.slug}`}
                          className="ml-3 shrink-0 rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
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
