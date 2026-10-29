// Test CTR 48 : état en base des fiches du périmètre (dates, SEO actuel).
import { readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const base = JSON.parse(readFileSync(process.argv[2], "utf-8")) as { page: string }[];

async function main() {
  const salonSlugs = new Set<string>(), venueSlugs = new Set<string>();
  for (const b of base) {
    const m = b.page.match(/\/(salons|lieux)\/([^/?#]+)/)!;
    (m[1] === "salons" ? salonSlugs : venueSlugs).add(m[2]);
  }
  const { data: salons, error } = await sb
    .from("salons")
    .select("slug, name, edition_year, start_date, end_date, dates_confirmed, city, venue, frequency, status, estimated_exhibitors, estimated_visitors, seo_title, seo_description, seo_title_en, seo_description_en, editorial_mdx, editorial_mdx_en, website_url")
    .in("slug", [...salonSlugs]);
  if (error) throw error;
  const { data: venues, error: e2 } = await sb.from("venues").select("*").in("slug", [...venueSlugs]);
  if (e2) throw e2;
  const out = {
    salons: (salons ?? []).map(({ editorial_mdx, editorial_mdx_en, ...s }) => ({
      ...s, mdx_len: editorial_mdx?.length ?? 0, mdx_en_len: editorial_mdx_en?.length ?? 0,
    })),
    venues: (venues ?? []).map((v: Record<string, unknown>) => Object.fromEntries(Object.entries(v).filter(([k]) => !/mdx|description$|_en$/.test(k) || /seo/.test(k)))),
  };
  writeFileSync(process.argv[3], JSON.stringify(out, null, 2));
  for (const s of out.salons)
    console.log(`${s.slug}\t${s.status}\t${s.start_date}→${s.end_date}\t${s.dates_confirmed}\tT:${s.seo_title ?? "∅"}\tTen:${s.seo_title_en ?? "∅"}\tmdx:${s.mdx_len}/${s.mdx_en_len}`);
  for (const v of out.venues) console.log(`VENUE ${v.slug}\tT:${v.seo_title ?? "∅"}\tTen:${v.seo_title_en ?? "∅"}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
