/**
 * Chantier page 2 → page 1 : compte les liens internes entrants de chaque page FR
 * du sitemap de production (liens du contenu seulement : les liens présents sur
 * plus de la moitié des pages, menu et pied de page, sont écartés).
 * Écrit tasks/page2-page1/inlinks-<date>.json : { cible: [sources] }.
 *
 * Usage : ./node_modules/.bin/tsx scripts/diag-page2-page1-inlinks.ts [base]
 */
import { writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "https://www.agoris.io";
const norm = (href: string) => {
  const u = new URL(href, BASE);
  return u.pathname.replace(/\/$/, "") || "/";
};

async function main() {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => norm(m[1]))
    .filter((p) => !p.startsWith("/en"));
  console.log(`${pages.length} pages FR`);

  const outlinks = new Map<string, Set<string>>();
  const CONC = 8;
  for (let i = 0; i < pages.length; i += CONC) {
    await Promise.all(pages.slice(i, i + CONC).map(async (p) => {
      const res = await fetch(`${BASE}${p}`);
      if (!res.ok) return console.warn(`${p} ${res.status}`);
      const html = await res.text();
      const hrefs = [...html.matchAll(/<a[^>]+href="([^"#?]+)/g)]
        .map((m) => m[1])
        .filter((h) => h.startsWith("/") || h.startsWith(BASE))
        .map(norm)
        .filter((h) => h !== p && !h.startsWith("/en"));
      outlinks.set(p, new Set(hrefs));
    }));
  }

  // Liens de gabarit (menu, pied de page) : présents sur plus de la moitié des pages
  const freq = new Map<string, number>();
  for (const s of outlinks.values()) for (const h of s) freq.set(h, (freq.get(h) ?? 0) + 1);
  const boilerplate = new Set([...freq].filter(([, n]) => n > outlinks.size / 2).map(([h]) => h));

  const inlinks: Record<string, string[]> = {};
  for (const [src, s] of outlinks) for (const h of s) if (!boilerplate.has(h)) (inlinks[h] ??= []).push(src);
  const out = `tasks/page2-page1/inlinks-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(out, JSON.stringify({ base: BASE, pagesCrawled: outlinks.size, boilerplate: [...boilerplate], inlinks }, null, 1));
  console.log(`${outlinks.size} pages lues, ${boilerplate.size} liens de gabarit écartés → ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
