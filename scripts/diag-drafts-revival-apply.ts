/**
 * Réactivation des drafts sans MDX (2026-09-27) : les fiches repliées en
 * draft après l'assainissement du seed existent déjà en base, donc
 * diag-cohorte-trafic-apply.ts les saute ("existe déjà"). Ce script met à
 * jour la ligne draft existante avec un handoff validé par le process
 * writer + 2 reviewers + traduction (handoff/cohorte-trafic/<slug>.json).
 * Le handoff peut porter `draft_slug` quand le slug canonique diffère du
 * slug du draft (slug avec année, contraire à la convention) : la ligne est
 * alors renommée. Le statut reste 'draft' (règle CLAUDE.md #13) ; la
 * publication passe par diag-cohorte-trafic-apply.ts --publish.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-drafts-revival-apply.ts [--apply] slug1 slug2 ...
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/cohorte-trafic");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const CATEGORIES = ["salon_professionnel", "salon_grand_public", "congres", "autres"];
const REQUIRED = ["name", "start_date", "end_date", "city", "website_url", "editorial_mdx", "seo_title", "seo_description", "description", "editorial_mdx_en", "seo_title_en"];

async function ensureVenue(h: Record<string, unknown>): Promise<{ id: string; lat: number | null; lng: number | null }> {
  const venueSlug = h.venue_slug as string;
  const { data: v } = await sb.from("venues").select("id,lat,lng").eq("slug", venueSlug).maybeSingle();
  if (v) return { id: v.id as string, lat: (v.lat as number | null) ?? null, lng: (v.lng as number | null) ?? null };
  const vc = h.venue_create as Record<string, unknown> | undefined;
  if (!vc) throw new Error(`venue ${venueSlug} introuvable et pas de venue_create`);
  const lat = (vc.lat as number | undefined) ?? null;
  const lng = (vc.lng as number | undefined) ?? null;
  console.log(`  CREATE venue ${vc.slug} (${vc.name}, ${vc.city}, ${lat}/${lng})`);
  if (!APPLY) return { id: "dry-run-venue-id", lat, lng };
  const { data: nv, error } = await sb
    .from("venues")
    .insert({ slug: vc.slug, name: vc.name, city: vc.city, country: vc.country ?? "FR", address: vc.address ?? null, lat, lng } as never)
    .select("id")
    .single();
  if (error) throw new Error(`venue ${vc.slug}: ${error.message}`);
  return { id: nv.id as string, lat, lng };
}

async function main() {
  if (!slugs.length) throw new Error("aucun slug fourni");
  console.log(APPLY ? "=== APPLY (update draft) ===" : "=== DRY-RUN ===");

  for (const slug of slugs) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    if (h.slug !== slug) throw new Error(`${slug}: slug du handoff (${h.slug}) différent`);
    for (const k of REQUIRED) if (!h[k]) throw new Error(`${slug}: champ ${k} manquant ou vide dans le handoff`);
    if (h.category && !CATEGORIES.includes(h.category)) throw new Error(`${slug}: category "${h.category}" hors enum`);
    const draftSlug: string = h.draft_slug ?? slug;

    const { data: target } = await sb.from("salons").select("id,status,editorial_mdx").eq("slug", slug).maybeSingle();
    if (target && target.editorial_mdx) { console.log(`SKIP ${slug}: déjà appliqué (status ${target.status})`); continue; }
    const { data: draft, error: dErr } = await sb.from("salons").select("id,status,notes_internes").eq("slug", draftSlug).maybeSingle();
    if (dErr) throw new Error(`${draftSlug}: ${dErr.message}`);
    if (!draft) throw new Error(`${slug}: draft ${draftSlug} absent en base`);
    if (draft.status !== "draft") throw new Error(`${slug}: ${draftSlug} n'est pas en draft (${draft.status})`);
    if (draftSlug !== slug && target) throw new Error(`${slug}: slug cible déjà pris par une autre ligne`);

    const hasVenue = Boolean(h.venue_slug || h.venue_create);
    if (!hasVenue) console.log(`  WARN ${slug}: aucun venue (lieu non annoncé), venue null`);
    const venue = hasVenue ? await ensureVenue(h) : null;
    const alerts = (h.alerts ?? []) as string[];
    const note = alerts.length ? "Alertes réactivation draft 2026-09-27:\n- " + alerts.join("\n- ") : null;
    const row = {
      slug, name: h.name, edition_year: h.edition_year, edition_number: h.edition_number ?? null,
      start_date: h.start_date, end_date: h.end_date, dates_confirmed: h.dates_confirmed ?? false,
      city: h.city, venue: h.venue_name ?? null, venue_id: venue?.id ?? null,
      venue_lat: venue?.lat ?? null, venue_lng: venue?.lng ?? null,
      country: h.country ?? "FR", website_url: h.website_url,
      organizer_name: h.organizer_name ?? null, co_organizer_name: h.co_organizer_name ?? null,
      frequency: h.frequency ?? null,
      estimated_exhibitors: h.estimated_exhibitors ?? null, estimated_visitors: h.estimated_visitors ?? null,
      category: h.category ?? null, category_to_confirm: h.category_to_confirm === true, description: h.description,
      seo_title: h.seo_title, seo_description: h.seo_description, editorial_mdx: h.editorial_mdx,
      description_en: h.description_en ?? null, seo_title_en: h.seo_title_en ?? null,
      seo_description_en: h.seo_description_en ?? null, editorial_mdx_en: h.editorial_mdx_en ?? null,
      status: "draft",
      // On conserve l'historique des notes du draft d'origine
      notes_internes: [draft.notes_internes, note].filter(Boolean).join("\n\n") || null,
    };
    console.log(`UPDATE ${draftSlug}${draftSlug !== slug ? ` -> ${slug}` : ""} (draft): ${h.name} · ${h.start_date} · ${h.city} · secteurs ${JSON.stringify(h.sector_slugs)}`);
    if (!APPLY) continue;

    const { error } = await sb.from("salons").update(row as never).eq("id", draft.id);
    if (error) throw new Error(`${slug}: ${error.message}`);

    // Secteurs : remplacement complet (ceux du seed ne sont pas fiables)
    const { error: delErr } = await sb.from("salon_sectors").delete().eq("salon_id", draft.id);
    if (delErr) throw new Error(`${slug}: purge secteurs ${delErr.message}`);
    for (const secSlug of h.sector_slugs ?? []) {
      const { data: sec, error: secErr } = await sb.from("sectors").select("id").eq("slug", secSlug).single();
      if (secErr) throw new Error(`${slug}: secteur ${secSlug} introuvable`);
      const { error: linkErr } = await sb.from("salon_sectors").insert({ salon_id: draft.id, sector_id: sec.id } as never);
      if (linkErr) throw new Error(`${slug} x ${secSlug}: ${linkErr.message}`);
    }
    console.log(`  → mis à jour avec ${(h.sector_slugs ?? []).length} secteur(s)`);
  }
  console.log(`\n${APPLY ? "APPLIQUÉ" : "DRY-RUN terminé"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
