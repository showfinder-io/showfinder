"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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

// Les labels de catégorie sont maintenant gérés via next-intl (salon-detail.providers.categories).

type ProviderDrawerProps = {
  salonId: string;
  salonName: string;
  salonSlug?: string;
};

export function ProviderDrawer({ salonId, salonName, salonSlug }: ProviderDrawerProps) {
  const t = useTranslations("salon-detail.providers");
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
      <Sheet
        onOpenChange={(open) => {
          if (open) {
            loadProviders();
            trackEvent("provider_drawer_open", { salon_slug: salonSlug });
          }
        }}
      >
        <SheetTrigger className="group block w-full rounded-lg bg-prune p-8 text-left text-papier transition-opacity hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable md:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ocre px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-prune">
            {t("badgeLabel")}
          </span>
          <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-papier/75">
            {t("description", { salonName })}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ocre transition-transform group-hover:translate-x-1">
            {t("cta")}
            <span aria-hidden="true">→</span>
          </span>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto bg-sable text-prune sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl text-prune">
              {t("drawerTitle", { salonName })}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {loading && (
              <p className="text-sm text-muted">{t("loading")}</p>
            )}

            {!loading && providers.length === 0 && (
              <div className="rounded-lg border border-border bg-ivoire py-10 px-6 text-center">
                <p className="text-sm text-muted">
                  {t("empty")}
                </p>
                <p className="mt-4 text-sm text-prune">
                  {t("areYouProvider")}{" "}
                  <Link
                    href="/contact"
                    className="font-medium underline decoration-prune/30 underline-offset-2 hover:decoration-prune"
                  >
                    {t("contactUs")}
                  </Link>
                </p>
              </div>
            )}

            {!loading &&
              Object.entries(grouped).map(([category, catProviders]) => (
                <div key={category} className="mb-7">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {t(`categories.${category}` as Parameters<typeof t>[0]) ?? category}
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
                                  aria-label={t("verifiedAriaLabel")}
                                />
                              )}
                              {isPremium && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-ocre px-2 py-0.5 text-[10px] font-semibold text-prune">
                                  <Star className="h-2.5 w-2.5 fill-prune" />
                                  {t("recommended")}
                                </span>
                              )}
                              {!isPremium && p.is_featured && (
                                <span className="rounded-full border border-prune/20 px-2 py-0.5 text-[10px] font-medium text-prune">
                                  {t("recommended")}
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
                            {t("quote")}
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
