/**
 * Dossiers sources des pages hub prestataires (tasks/regles-edito-prestataires-v1.md, P24-P29) :
 * handoff/prestataires/hubs/dossiers/<slug>.json. Seuls faits admis dans un hub (P26) :
 * prestataires référencés dans la zone, lieux de la zone en base, salons publiés de la zone.
 * Les requêtes cibles viennent de la phase 0 (DataForSEO, 2026-09-21) : elles orientent le
 * vocabulaire, elles ne sont jamais citées dans le texte.
 *
 * À lancer APRÈS diag-providers-editorial-apply.ts --apply (le département des prestataires
 * vient de là). Lecture seule côté DB.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { HUBS } from "./provider-hubs-config";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const OUT_DIR = "handoff/prestataires/hubs/dossiers";


(async () => {
  mkdirSync(OUT_DIR, { recursive: true });
  const [{ data: providers }, { data: venues }, { data: salons }, { data: allHubSlugs }] = await Promise.all([
    sb.from("providers").select("slug,company_name,category,city,department,specialties,founded_year,zone_intervention,description"),
    sb.from("venues").select("slug,name,city,postal_code"),
    sb.from("salons").select("slug,name,city,start_date,end_date,venue").eq("status", "published").not("editorial_mdx", "is", null),
    sb.from("providers").select("slug"),
  ]);
  const providerSlugs = new Set((allHubSlugs ?? []).map((p) => p.slug));

  for (const hub of HUBS) {
    if (providerSlugs.has(hub.slug)) throw new Error(`Collision : ${hub.slug} est déjà un slug de prestataire`);
    const inZone = (dept: string | null) => hub.departments.length === 0 || (dept !== null && (hub.departments as readonly string[]).includes(dept));
    const hubProviders = (providers ?? []).filter((p) => p.category === hub.category && inZone(p.department));
    const zoneVenues = hub.departments.length === 0 ? [] : (venues ?? []).filter((v) => v.postal_code && inZone(v.postal_code.slice(0, 2)));
    const venueCities = new Set(zoneVenues.map((v) => v.city));
    const zoneSalons = (salons ?? []).filter((s) => s.city && venueCities.has(s.city));
    const dossier = {
      hub: { slug: hub.slug, category: hub.category, departments: hub.departments, zone_label: hub.zone_label },
      target_queries: hub.queries.map(([query, monthly_searches_fr]) => ({ query, monthly_searches_fr })),
      provider_count: hubProviders.length,
      providers: hubProviders.map((p) => ({ slug: p.slug, name: p.company_name, city: p.city, specialties: p.specialties, founded_year: p.founded_year, zone_intervention: p.zone_intervention })),
      venues_in_zone: zoneVenues.map((v) => ({ slug: v.slug, name: v.name, city: v.city, internal_link: `/lieux/${v.slug}` })),
      published_salons_in_zone: zoneSalons.map((s) => ({ slug: s.slug, name: s.name, city: s.city, start_date: s.start_date, internal_link: `/salons/${s.slug}` })),
      sibling_hubs: HUBS.filter((h) => h.slug !== hub.slug).map((h) => ({ slug: h.slug, internal_link: `/prestataires/${h.slug}` })),
    };
    writeFileSync(`${OUT_DIR}/${hub.slug}.json`, JSON.stringify(dossier, null, 2));
    console.log(`  ${hub.slug}: ${hubProviders.length} prestataires, ${zoneVenues.length} lieux, ${zoneSalons.length} salons publiés`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
