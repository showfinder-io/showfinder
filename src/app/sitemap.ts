import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllPosts } from "@/lib/blog";
import { getEditorialSectorSlugs } from "@/lib/sector-content";
import { getEditorialSalonSlugs } from "@/lib/salon-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Requetes en parallele
  const [salonsResult, sectorsResult, venuesResult] = await Promise.all([
    supabase
      .from("salons")
      .select("slug, updated_at")
      .eq("status", "published"),
    supabase.from("sectors").select("slug"),
    supabase
      .from("venues")
      .select("slug, description, address, total_surface_sqm"),
  ]);

  const allSalons = salonsResult.data ?? [];
  const allSectors = sectorsResult.data ?? [];
  const allVenues = venuesResult.data ?? [];

  // Un salon n'est indexable que s'il a un MDX éditorial. La description en
  // DB ne suffit pas. Coherent avec le robots conditionnel cote page.
  const editorialSalonSlugs = new Set(getEditorialSalonSlugs());
  const salons = allSalons.filter((s) => editorialSalonSlugs.has(s.slug));

  // Seuls les secteurs avec MDX éditorial sont indexables (les autres sont
  // en noindex,follow côté page). Cf. UX/SEO spec mai 2026.
  const editorialSectorSlugs = new Set(getEditorialSectorSlugs());
  const sectors = allSectors.filter((s) => editorialSectorSlugs.has(s.slug));

  // Un lieu n'est indexable que si la fiche est riche : description ≥ 80
  // chars + adresse + surface. Sinon coquille vide → hors sitemap.
  const venues = allVenues.filter((v) => {
    const descLen = (v.description ?? "").trim().length;
    const hasAddress = ((v.address ?? "").trim().length) > 0;
    const hasSurface = (v.total_surface_sqm ?? 0) > 0;
    return descLen >= 80 && hasAddress && hasSurface;
  });

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
    {
      url: `${siteConfig.url}/methodologie`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
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

  // Page index lieux
  entries.push({
    url: `${siteConfig.url}/lieux`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  });

  // Pages lieu
  for (const venue of venues) {
    entries.push({
      url: `${siteConfig.url}/lieux/${venue.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Prestataires : hors sitemap (toutes les pages sont en noindex,follow).
  // Le hub /prestataires est un listing sans contenu éditorial, idem.

  // Blog
  const posts = getAllPosts();

  entries.push({
    url: `${siteConfig.url}/blog`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  for (const post of posts) {
    entries.push({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.frontmatter.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
