/**
 * Report en base des corrections faites sur des handoffs de cohorte après
 * l'insertion de la fiche (2026-10-04, cohorte sl3c : un second cycle de
 * relectures a corrigé 29 fiches déjà publiées). Lit
 * handoff/cohorte-trafic/<slug>.json, compare champ par champ avec la ligne
 * salons existante (même correspondance que diag-cohorte-trafic-apply.ts) et
 * ne met à jour que les champs qui diffèrent, plus les secteurs et le lieu
 * s'ils ont changé. Le statut, le slug et editorial_updated_at ne sont pas
 * touchés. Un lieu absent est créé depuis venue_create, comme à l'insertion.
 *
 * Dry-run par défaut (liste des champs modifiés) ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-cohorte-sync-apply.ts [--apply] slug1 slug2 ...
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/cohorte-trafic");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const CATEGORIES = ["salon_professionnel", "salon_grand_public", "congres", "autres"];

// Champs repris tels quels du handoff (clé handoff = colonne salons).
const FIELDS = [
  "name", "edition_year", "edition_number", "start_date", "end_date", "dates_confirmed", "city", "country",
  "website_url", "organizer_name", "co_organizer_name", "frequency", "estimated_exhibitors", "estimated_visitors",
  "category", "category_to_confirm", "description", "seo_title", "seo_description", "editorial_mdx",
  "description_en", "seo_title_en", "seo_description_en", "editorial_mdx_en",
] as const;
const DEFAULTS: Record<string, unknown> = { country: "FR", dates_confirmed: false, category_to_confirm: false };

async function venueFor(h: Record<string, unknown>) {
  const { data: v, error } = await sb.from("venues").select("id,lat,lng").eq("slug", h.venue_slug as string).maybeSingle();
  if (error) throw error;
  if (v) return v as { id: string; lat: number | null; lng: number | null };
  const vc = h.venue_create as Record<string, unknown> | undefined;
  if (!vc || vc.slug !== h.venue_slug) throw new Error(`venue ${h.venue_slug} introuvable et pas de venue_create correspondant`);
  if (!APPLY) return { id: `(à créer : ${vc.slug})`, lat: (vc.lat as number) ?? null, lng: (vc.lng as number) ?? null };
  const { data: created, error: cErr } = await sb.from("venues")
    .insert({ slug: vc.slug, name: vc.name, city: vc.city, country: vc.country ?? "FR", address: vc.address ?? null, lat: vc.lat ?? null, lng: vc.lng ?? null } as never)
    .select("id,lat,lng").single();
  if (cErr) throw cErr;
  return created as { id: string; lat: number | null; lng: number | null };
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let changed = 0;
  for (const slug of slugs) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    if (h.slug !== slug) throw new Error(`${slug}: slug du handoff (${h.slug}) différent`);
    if (h.category && !CATEGORIES.includes(h.category)) throw new Error(`${slug}: category "${h.category}" hors enum`);
    const { data: row, error } = await sb.from("salons").select("*, venues(slug), salon_sectors(sectors(slug))").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!row) { console.log(`SKIP ${slug}: absente de la base (passer par diag-cohorte-trafic-apply.ts)`); continue; }

    const patch: Record<string, unknown> = {};
    for (const f of FIELDS) {
      const want = h[f] ?? DEFAULTS[f] ?? null;
      if (JSON.stringify(want) !== JSON.stringify(row[f] ?? null)) patch[f] = want;
    }
    if (h.venue_name !== undefined && (h.venue_name ?? null) !== row.venue) patch.venue = h.venue_name ?? null;
    const currentVenue = (row.venues as { slug: string } | null)?.slug ?? null;
    if ((h.venue_slug ?? null) !== currentVenue) {
      const v = h.venue_slug ? await venueFor(h) : null;
      Object.assign(patch, { venue_id: v?.id ?? null, venue_lat: v?.lat ?? null, venue_lng: v?.lng ?? null });
    }
    const wantSectors = [...(h.sector_slugs as string[])].sort();
    const haveSectors = ((row.salon_sectors ?? []) as { sectors: { slug: string } }[]).map((s) => s.sectors.slug).sort();
    const sectorsChanged = JSON.stringify(wantSectors) !== JSON.stringify(haveSectors);

    const keys = Object.keys(patch);
    if (!keys.length && !sectorsChanged) { console.log(`=    ${slug}`); continue; }
    changed++;
    console.log(`SYNC ${slug}: ${keys.join(", ")}${sectorsChanged ? `${keys.length ? ", " : ""}secteurs ${haveSectors.join("+")} -> ${wantSectors.join("+")}` : ""}`);
    if (!APPLY) continue;
    if (keys.length) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("id", row.id);
      if (upErr) throw upErr;
    }
    if (sectorsChanged) {
      const { error: delErr } = await sb.from("salon_sectors").delete().eq("salon_id", row.id);
      if (delErr) throw delErr;
      for (const secSlug of wantSectors) {
        const { data: sec, error: secErr } = await sb.from("sectors").select("id").eq("slug", secSlug).single();
        if (secErr) throw secErr;
        const { error: linkErr } = await sb.from("salon_sectors").insert({ salon_id: row.id, sector_id: sec.id } as never);
        if (linkErr) throw linkErr;
      }
    }
  }
  console.log(`\n${changed} fiche(s) ${APPLY ? "mises à jour" : "à mettre à jour"}`);
}

main();
