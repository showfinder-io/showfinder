/**
 * Étape 0 du pipeline éditorial prestataires (tasks/regles-edito-prestataires-v1.md, P1-P2) :
 * constitue un dossier source figé par prestataire dans handoff/prestataires/dossiers/<slug>.json
 * (hors git). Les writers et reviewers travaillent sur ce dossier, le contrôle mécanique des
 * citations (diag-providers-lint.ts) aussi.
 *
 * Par prestataire : pages utiles du site officiel (accueil + à propos / prestations /
 * réalisations / mentions légales, 7 pages max), fiche LEADS France ou Prestalians si connue
 * (seed du 2026-09-20), et unité légale via l'API publique recherche-entreprises.api.gouv.fr.
 *
 * Lecture seule côté DB. curl plutôt que fetch : plusieurs sites ont une chaîne TLS que Node refuse.
 * Usage : tsx --env-file=.env.local scripts/diag-providers-dossiers.ts [--only slug1,slug2] [--force]
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";

const run = promisify(execFile);
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const OUT_DIR = "handoff/prestataires/dossiers";
const FORCE = process.argv.includes("--force");
const onlyArg = process.argv.indexOf("--only");
const ONLY = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

const MAX_PAGES = 7;
const MAX_CHARS_PER_PAGE = 7000;
const USEFUL_PATH =
  /(a-?propos|about|qui-sommes|agence|societe|entreprise|histoire|equipe|savoir-faire|metier|expertise|prestation|service|offre|solution|stand|realisation|reference|projet|portfolio|client|mentions|legal|rse|engagement|contact)/i;

type SeedRow = { slug: string; postal_code: string | null; source: string | null; source_url: string | null };
const seed: SeedRow[] = JSON.parse(readFileSync("scripts/seeds/prestataires-2026-09-20.json", "utf-8"));
// magnum du fichier = magnum-lyon en base (cf. diag-import-providers-apply.ts)
const seedBySlug = new Map(seed.map((r) => [r.slug === "magnum" ? "magnum-lyon" : r.slug, r]));

async function curl(url: string): Promise<{ status: number; finalUrl: string; body: string }> {
  try {
    const { stdout } = await run(
      "curl",
      ["-sS", "-L", "--compressed", "-m", "25", "-A",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "-H", "Accept-Language: fr-FR,fr;q=0.9", "-w", "\n__META__%{http_code} %{url_effective}", url],
      { maxBuffer: 20 * 1024 * 1024 }
    );
    const i = stdout.lastIndexOf("\n__META__");
    const [status, finalUrl] = stdout.slice(i + 9).split(" ");
    return { status: Number(status), finalUrl, body: stdout.slice(0, i) };
  } catch {
    return { status: 0, finalUrl: url, body: "" };
  }
}

const ENTITIES: Record<string, string> = {
  amp: "&", nbsp: " ", quot: '"', apos: "'", lt: "<", gt: ">", eacute: "é", egrave: "è", ecirc: "ê", agrave: "à",
  acirc: "â", ccedil: "ç", ugrave: "ù", ucirc: "û", ocirc: "ô", icirc: "î", iuml: "ï", euml: "ë", rsquo: "’",
  lsquo: "‘", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", hellip: "…", ndash: "–", mdash: "—", euro: "€", deg: "°",
  Eacute: "É", Egrave: "È", Agrave: "À", Ccedil: "Ç", oelig: "œ",
};

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|section|article|li|ul|ol|h[1-6]|tr|br|header|footer|nav)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => ENTITIES[n] ?? m)
    .replace(/[^\S\n]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function usefulLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const found = new Map<string, number>();
  for (const m of html.matchAll(/href="([^"#]+)"/g)) {
    let u: URL;
    try { u = new URL(m[1], base); } catch { continue; }
    if (u.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
    if (/\.(pdf|jpe?g|png|webp|svg|css|js|zip|mp4|ico|xml)$/i.test(u.pathname)) continue;
    if (u.pathname === "/" || !USEFUL_PATH.test(u.pathname)) continue;
    u.hash = ""; u.search = "";
    const depth = u.pathname.split("/").filter(Boolean).length;
    if (!found.has(u.href)) found.set(u.href, depth);
  }
  // Sites type Wix (/blank, /blank-1) : trop peu d'URLs parlantes, on prend les pages de premier niveau
  if (found.size < 3) {
    for (const m of html.matchAll(/href="([^"#]+)"/g)) {
      let u: URL;
      try { u = new URL(m[1], base); } catch { continue; }
      if (u.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
      if (/\.(pdf|jpe?g|png|webp|svg|css|js|zip|mp4|ico|xml)$/i.test(u.pathname)) continue;
      u.hash = ""; u.search = "";
      if (u.pathname.split("/").filter(Boolean).length === 1 && !found.has(u.href)) found.set(u.href, 1);
    }
  }
  // Pages de premier niveau d'abord (à propos, prestations), puis le détail
  return [...found.entries()].sort((a, b) => a[1] - b[1]).map(([href]) => href).slice(0, MAX_PAGES - 1);
}

const compact = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function legalUnit(name: string, postalCode: string | null, city: string | null) {
  // Filtre par département : le code postal du fichier est souvent un CEDEX ou la ville
  // voisine du siège (adEXPO : Reims dans le fichier, siège à Saint-Brice-Courcelles).
  const dept = postalCode ? postalCode.slice(0, 2) : null;
  const params = new URLSearchParams({ q: name, per_page: "5" });
  if (dept) params.set("departement", dept);
  const { status, body } = await curl(`https://recherche-entreprises.api.gouv.fr/search?${params}`);
  if (status !== 200) return { match: null, candidates: [], note: `API HTTP ${status}` };
  type Unit = { nom_complet: string; siren: string; date_creation: string | null; etat_administratif: string; activite_principale: string; siege: { code_postal: string | null; libelle_commune: string | null } };
  const results: Unit[] = JSON.parse(body).results ?? [];
  const candidates = results.map((r) => ({
    nom_complet: r.nom_complet, siren: r.siren, date_creation: r.date_creation, etat_administratif: r.etat_administratif,
    activite_principale: r.activite_principale, code_postal: r.siege?.code_postal ?? null, commune: r.siege?.libelle_commune ?? null,
  }));
  // Match strict : unité active + nom contenu (égalité exacte si nom très court, ex. A+B)
  // + même département, ou même commune si le fichier n'a pas de code postal.
  const n = compact(name);
  const sameName = (c: string) => (n.length >= 4 ? compact(c).includes(n) : compact(c.replace(/\(.*\)/, "")) === n);
  const match = candidates.find((c) =>
    c.etat_administratif === "A" && sameName(c.nom_complet) &&
    (dept ? (c.code_postal ?? "").startsWith(dept) : city ? compact(c.commune ?? "") === compact(city) : false)
  ) ?? null;
  return { match, candidates, note: match ? "match strict nom + département (identité à confirmer par le reviewer, P33)" : "aucun match strict : ne pas utiliser founded_year depuis l'API" };
}

(async () => {
  mkdirSync(OUT_DIR, { recursive: true });
  const { data: providers, error } = await sb.from("providers").select("slug,company_name,category,city,website_url,description").order("slug");
  if (error) throw error;
  const summary: string[] = [];
  for (const p of providers ?? []) {
    if (ONLY && !ONLY.has(p.slug)) continue;
    const file = `${OUT_DIR}/${p.slug}.json`;
    if (existsSync(file) && !FORCE) continue;
    const s = seedBySlug.get(p.slug);
    const pages: { url: string; status: number; text: string }[] = [];
    if (p.website_url) {
      const home = await curl(p.website_url);
      pages.push({ url: home.finalUrl, status: home.status, text: htmlToText(home.body).slice(0, MAX_CHARS_PER_PAGE) });
      if (home.status === 200) {
        for (const href of usefulLinks(home.body, home.finalUrl)) {
          const sub = await curl(href);
          if (sub.status === 200) pages.push({ url: sub.finalUrl, status: 200, text: htmlToText(sub.body).slice(0, MAX_CHARS_PER_PAGE) });
        }
      }
    }
    let directory: { source: string | null; url: string; status: number; text: string } | null = null;
    if (s?.source_url) {
      const d = await curl(s.source_url);
      directory = { source: s.source, url: s.source_url, status: d.status, text: htmlToText(d.body).slice(0, 5000) };
    }
    const legal = await legalUnit(p.company_name, s?.postal_code ?? null, p.city);
    const siteChars = pages.filter((x) => x.status === 200).reduce((n, x) => n + x.text.length, 0);
    const dossier = {
      slug: p.slug, company_name: p.company_name, category: p.category, city: p.city, postal_code: s?.postal_code ?? null,
      website_url: p.website_url, current_description: p.description, collected_at: new Date().toISOString(),
      site_pages: pages, directory, legal_unit: legal, site_chars: siteChars,
    };
    writeFileSync(file, JSON.stringify(dossier, null, 2));
    const line = `${p.slug}: ${pages.filter((x) => x.status === 200).length} pages, ${siteChars} car., annuaire ${directory ? directory.status : "-"}, unité légale ${legal.match ? legal.match.date_creation : "non trouvée"}`;
    console.log("  " + line);
    summary.push(line);
  }
  console.log(`${summary.length} dossiers écrits dans ${OUT_DIR}`);
})().catch((e) => { console.error(e); process.exit(1); });
