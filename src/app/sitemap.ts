import type { MetadataRoute } from "next";
import { siteConfig, CITY_INDEX_MIN_SALONS } from "@/lib/config";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllPosts } from "@/lib/blog";
import { getEditorialSectorSlugs } from "@/lib/sector-content";
import { getEditorialSalonSlugs } from "@/lib/salon-content";
import { slugifyCity } from "@/lib/format";
import { I18N_EN_ENABLED, HREFLANG_BY_LOCALE } from "@/lib/i18n/config";

/**
 * URL FR (racine, sans prefixe) pour un chemin donne.
 * `path` commence par "/" ou vaut "" pour la home.
 */
function frUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/**
 * URL EN (sous-chemin /en) pour un chemin donne.
 */
function enUrl(path: string): string {
  return `${siteConfig.url}/en${path}`;
}

/**
 * Construit une entree de sitemap avec hreflang reciproque (fr-FR / en-GB /
 * x-default). Tant que l'EN n'est pas active (I18N_EN_ENABLED = false), on
 * n'emet PAS d'alternates EN : exposer des URLs /en qui renvoient 404 nuirait
 * au SEO. L'architecture est prete pour basculer en une variable.
 *
 * @param path Chemin SANS domaine et SANS prefixe de locale ("" pour la home).
 */
function entry(
  path: string,
  opts: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number] {
  const base: MetadataRoute.Sitemap[number] = {
    url: frUrl(path) || siteConfig.url,
    ...opts,
  };

  if (!I18N_EN_ENABLED) {
    return base;
  }

  return {
    ...base,
    alternates: {
      languages: {
        [HREFLANG_BY_LOCALE.fr]: frUrl(path) || siteConfig.url,
        [HREFLANG_BY_LOCALE.en]: enUrl(path),
        "x-default": frUrl(path) || siteConfig.url,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Requetes en parallele
  const [salonsResult, sectorsResult, venuesResult] = await Promise.all([
    supabase
      .from("salons")
      .select("slug, updated_at, city")
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
  const editorialSalonSlugs = new Set(await getEditorialSalonSlugs());
  const salons = allSalons.filter((s) => editorialSalonSlugs.has(s.slug));

  // Seuls les secteurs avec MDX éditorial sont indexables (les autres sont
  // en noindex,follow côté page). Cf. UX/SEO spec mai 2026.
  const editorialSectorSlugs = new Set(await getEditorialSectorSlugs());
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
    entry("", { lastModified: now, changeFrequency: "daily", priority: 1 }),
    entry("/salons", {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    }),
    entry("/secteurs", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    entry("/methodologie", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  ];

  // Pages salon
  for (const salon of salons) {
    entries.push(
      entry(`/salons/${salon.slug}`, {
        lastModified: salon.updated_at ? new Date(salon.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  }

  // Pages secteur
  for (const sector of sectors) {
    entries.push(
      entry(`/secteurs/${sector.slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  }

  // Pages ville : seules les villes avec assez de salons publiés sont
  // indexables (cohérent avec le robots conditionnel de /villes/[slug]).
  const cityCounts = new Map<string, number>();
  for (const salon of allSalons) {
    const city = (salon as { city?: string | null }).city;
    if (!city) continue;
    cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
  }
  for (const [city, count] of cityCounts) {
    if (count < CITY_INDEX_MIN_SALONS) continue;
    entries.push(
      entry(`/villes/${slugifyCity(city)}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  }

  // Page index lieux
  entries.push(
    entry("/lieux", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // Pages lieu
  for (const venue of venues) {
    entries.push(
      entry(`/lieux/${venue.slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
  }

  // Prestataires : hors sitemap (toutes les pages sont en noindex,follow).
  // Le hub /prestataires est un listing sans contenu éditorial, idem.

  // Blog
  const posts = getAllPosts();

  entries.push(
    entry("/blog", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  for (const post of posts) {
    entries.push(
      entry(`/blog/${post.slug}`, {
        lastModified: new Date(post.frontmatter.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  }

  // Pages annexes indexables (contact + légal) : priorité basse mais
  // présentes dans le sitemap pour un signal d'exhaustivité propre.
  for (const path of ["/contact", "/mentions", "/confidentialite", "/cookies"]) {
    entries.push(
      entry(path, {
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
      })
    );
  }

  return entries;
}
