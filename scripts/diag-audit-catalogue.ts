/**
 * Audit du set "prochains salons" (passe 1, bulk, Haiku) : pour chaque fiche
 * publiée à venir, fetch du site officiel + vérification de cohérence
 * existence/ville/dates. Lecture seule, sortie CSV.
 *
 * Verdicts : ok (correspondance claire) / suspect (doute, à escalader passe 2 Sonnet)
 * / phantom (la page contredit : autre ville, marque absorbée, salon disparu) /
 * fetch_failed (site inaccessible -> passe 2).
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-audit-catalogue.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const KEY = process.env.ANTHROPIC_API_KEY!;
const UA = "Mozilla/5.0 (compatible; Agoris/1.0; +https://agoris.io)";
const OUT = join(process.cwd(), "scripts/output");
mkdirSync(OUT, { recursive: true });

async function fetchPage(url: string): Promise<string | null> {
  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 12000);
    const res = await fetch(url, { signal: ac.signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" }, redirect: "follow" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const $ = cheerio.load(await res.text());
    const title = $("title").text().trim();
    const metaDesc = $('meta[name="description"]').attr("content") ?? "";
    const og = $('meta[property="og:title"]').attr("content") ?? "";
    $("script, style, noscript").remove();
    const body = $("body").text().replace(/\s+/g, " ").trim().slice(0, 2200);
    return `URL:${url}\nTITLE:${title}\nOG:${og}\nMETA:${metaDesc}\nBODY:${body}`;
  } catch { return null; }
}

const SYSTEM = `Tu vérifies l'IDENTITÉ et l'EXISTENCE d'un salon enregistré dans un annuaire (son édition enregistrée est PASSÉE, ce n'est pas un problème : ne juge pas la date). On te donne nom/ville enregistrés + le contenu de sa page officielle.
Réponds UNIQUEMENT en JSON : {"verdict":"ok|suspect|phantom","reason":"...","confidence":"high|medium|low"}.
- "ok" : un salon réel de ce nom existe bien, dans cette ville (édition récurrente).
- "suspect" : doute réel (ville divergente, marque peut-être absorbée/renommée/fusionnée, page ambiguë).
- "phantom" : la page contredit (autre marque, salon disparu/annulé/fusionné, mauvaise ville, aucune trace).
Au moindre doute sérieux sur l'existence ou la localisation, "suspect" plutôt que "ok".`;

type SalonRow = { slug: string; name: string; city: string; start_date: string; end_date: string; edition_year: number; website_url: string | null; editorial_mdx: string | null };
async function check(s: SalonRow): Promise<{ slug: string; verdict: string; reason: string; conf: string }> {
  if (!s.website_url) return { slug: s.slug, verdict: "fetch_failed", reason: "pas de website_url", conf: "low" };
  const page = await fetchPage(s.website_url);
  if (!page) return { slug: s.slug, verdict: "fetch_failed", reason: "fetch échoué (timeout/403/404)", conf: "low" };
  const userMsg = `Salon enregistré :\n- nom : ${s.name}\n- ville : ${s.city}\n- dates : ${s.start_date} -> ${s.end_date}\n- édition : ${s.edition_year}\n\nCONTENU PAGE OFFICIELLE :\n${page}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content: userMsg }] }),
  });
  if (!res.ok) return { slug: s.slug, verdict: "suspect", reason: `API ${res.status}`, conf: "low" };
  const j = await res.json();
  const txt = (j.content as Array<{ type: string; text?: string }> | undefined)?.find((c) => c.type === "text")?.text ?? "";
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) return { slug: s.slug, verdict: "suspect", reason: "parse JSON échoué", conf: "low" };
  try {
    const p = JSON.parse(m[0]);
    return { slug: s.slug, verdict: p.verdict ?? "suspect", reason: (p.reason ?? "").slice(0, 200), conf: p.confidence ?? "low" };
  } catch { return { slug: s.slug, verdict: "suspect", reason: "parse JSON échoué", conf: "low" }; }
}

async function pool<T, R>(items: T[], size: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []; let i = 0;
  async function worker() { while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); if (idx % 10 === 0) console.log(`  ${idx}/${items.length}`); } }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}

async function main() {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await sb.from("salons").select("slug,name,city,start_date,end_date,edition_year,website_url,editorial_mdx").eq("status", "published").lt("start_date", today).order("start_date");
  const rows = data ?? [];
  console.log(`${rows.length} fiches publiées à venir à auditer`);
  const results = await pool(rows, 6, check);
  const byV: Record<string, number> = {};
  for (const r of results) byV[r.verdict] = (byV[r.verdict] ?? 0) + 1;
  console.log("\nVerdicts :", JSON.stringify(byV));

  const mdxBySlug = new Map(rows.map((r) => [r.slug, Boolean(r.editorial_mdx)]));
  const header = "slug,verdict,confidence,has_mdx,reason\n";
  const csv = header + results.map((r) => [r.slug, r.verdict, r.conf, mdxBySlug.get(r.slug) ? "mdx" : "vide", `"${r.reason.replace(/"/g, "'")}"`].join(",")).join("\n");
  const path = join(OUT, `audit-catalogue-${today}.csv`);
  writeFileSync(path, csv);
  console.log("\nPHANTOM :", results.filter((r) => r.verdict === "phantom").map((r) => r.slug).join(", ") || "aucun");
  console.log("\nSUSPECT :", results.filter((r) => r.verdict === "suspect").map((r) => r.slug).join(", ") || "aucun");
  console.log(`\nCSV : ${path}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
