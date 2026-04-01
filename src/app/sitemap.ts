import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { createStaticClient } from "@/lib/supabase/static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Requetes en parallele
  const [salonsResult, sectorsResult] = await Promise.all([
    supabase
      .from("salons")
      .select("slug, updated_at")
      .eq("status", "published"),
    supabase.from("sectors").select("slug"),
  ]);

  const salons = salonsResult.data ?? [];
  const sectors = sectorsResult.data ?? [];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/salons`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/secteurs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Pages salon
  for (const salon of salons) {
    entries.push({
      url: `${siteConfig.url}/salons/${salon.slug}`,
      lastModified: salon.updated_at ? new Date(salon.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Pages secteur
  for (const sector of sectors) {
    entries.push({
      url: `${siteConfig.url}/secteurs/${sector.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
