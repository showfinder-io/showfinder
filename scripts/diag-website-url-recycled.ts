// Détecte les website_url de salons pointant vers un domaine mort recyclé
// (casino, paris en ligne, domaine à vendre, parking). Lecture seule.
// Origine : mdd-expo.com (fiche draft) servait un comparatif de casinos (2026-09-25).
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-website-url-recycled.ts
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SUSPECT = /casino|paris sportifs|sports betting|betting|poker en ligne|slot machine|machines à sous|domain (is )?for sale|domaine (est )?à vendre|buy this domain|this domain may be for sale|parked|sedoparking|hugedomains|dan\.com|afternic/i;
(async () => {
  const { data, error } = await sb.from("salons").select("slug,status,website_url").not("website_url", "is", null);
  if (error) throw error;
  const rows = data as { slug: string; status: string; website_url: string }[];
  const out: string[] = [];
  const queue = [...rows];
  const worker = async () => {
    for (let r = queue.shift(); r; r = queue.shift()) {
      try {
        const res = await fetch(r.website_url, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "User-Agent": "Mozilla/5.0" } });
        const html = (await res.text()).slice(0, 300000);
        const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim().slice(0, 80);
        const m = html.match(SUSPECT);
        if (m) out.push(`SUSPECT ${r.slug} [${r.status}] ${r.website_url} -> ${res.url} | "${title}" | motif: ${m[0]}`);
        else if (res.status >= 400) out.push(`HTTP ${res.status} ${r.slug} [${r.status}] ${r.website_url}`);
      } catch (e) {
        out.push(`ERREUR ${r.slug} [${r.status}] ${r.website_url} : ${(e as Error).message.slice(0, 60)}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(`${rows.length} URLs testées`);
  console.log(out.sort().join("\n"));
})();
