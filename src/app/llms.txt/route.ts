import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";
import { getEditorialSectorSlugs } from "@/lib/sector-content";
import { getEditorialSalonSlugs } from "@/lib/salon-content";
import { I18N_EN_ENABLED } from "@/lib/i18n/config";

/**
 * /llms.txt : carte du site lisible par les assistants IA (ChatGPT, Claude,
 * Perplexity...), format llmstxt.org. Même périmètre que le sitemap : seules
 * les pages indexables (fiches avec MDX éditorial, secteurs éditoriaux, blog).
 * Aucune donnée qui ne soit déjà publique sur le site. Régénéré chaque heure.
 */
export const revalidate = 3600;

function fmtDates(start: string | null, end: string | null): string {
  if (!start) return "";
  const s = start.slice(0, 10);
  const e = end ? end.slice(0, 10) : "";
  return e && e !== s ? `${s} au ${e}` : s;
}

export async function GET() {
  const supabase = createStaticClient();
  const site = siteConfig.url;
  const en = (path: string) => `${site}/en${path}`;

  const [salonsResult, sectorsResult] = await Promise.all([
    supabase
      .from("salons")
      .select("slug, name, start_date, end_date, city")
      .eq("status", "published")
      .order("start_date", { ascending: true }),
    supabase.from("sectors").select("slug, name").order("name"),
  ]);

  const editorialSalonSlugs = new Set(await getEditorialSalonSlugs());
  const editorialSectorSlugs = new Set(await getEditorialSectorSlugs());
  const salons = (salonsResult.data ?? []).filter((s) => editorialSalonSlugs.has(s.slug));
  const sectors = (sectorsResult.data ?? []).filter((s) => editorialSectorSlugs.has(s.slug));
  const posts = getAllPosts();

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Agoris audite, classe et certifie les salons professionnels B2B en France par filière : pour chaque salon, dates de la prochaine édition, lieu, nombre d'exposants et de visiteurs sourcés, coût d'un stand quand il est publié, conseils de préparation. Contenu rédigé et vérifié sur sources primaires (sites officiels, organisateurs). Site bilingue : français à la racine, anglais britannique sous /en.",
    "",
    "## Pages principales",
    "",
    `- [Tous les salons professionnels](${site}/salons)`,
    `- [Secteurs](${site}/secteurs)`,
    `- [Lieux d'exposition](${site}/lieux)`,
    `- [Méthodologie](${site}/methodologie)`,
    `- [Blog et guides exposants](${site}/blog)`,
  ];
  if (I18N_EN_ENABLED) {
    lines.push(`- [All trade shows in France (English)](${en("/salons")})`);
  }

  lines.push("", "## Secteurs", "");
  for (const s of sectors) {
    lines.push(`- [${s.name}](${site}/secteurs/${s.slug})`);
  }

  lines.push("", `## Fiches salons (${salons.length})`, "");
  for (const s of salons) {
    const meta = [fmtDates(s.start_date, s.end_date), s.city].filter(Boolean).join(", ");
    const enLink = I18N_EN_ENABLED ? ` ([EN](${en(`/salons/${s.slug}`)}))` : "";
    lines.push(`- [${s.name}](${site}/salons/${s.slug})${meta ? `: ${meta}` : ""}${enLink}`);
  }

  if (posts.length > 0) {
    lines.push("", "## Guides et articles", "");
    for (const p of posts) {
      lines.push(`- [${p.frontmatter.title}](${site}/blog/${p.slug})`);
    }
  }

  lines.push("", "## Optional", "", `- [Sitemap XML](${site}/sitemap.xml)`, `- [Contact](${site}/contact)`, "");

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
