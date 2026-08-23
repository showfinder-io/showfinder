/**
 * Application de la cohorte trafic (2026-08-04) : insertion des fiches P1
 * validées par le process writer + 2 reviewers (handoffs JSON).
 * Chaque fiche est insérée en status='draft' (règle CLAUDE.md #13), la
 * publication est un UPDATE séparé après vérification (--publish).
 * Crée les venues manquants si le handoff porte un bloc venue_create.
 * Dry-run par défaut ; --apply pour écrire ; --publish pour passer en
 * published les slugs déjà insérés en draft. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && \
 *   ./node_modules/.bin/tsx scripts/diag-cohorte-trafic-apply.ts [--apply|--publish] slug1 slug2 ...
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const PUBLISH = process.argv.includes("--publish");
const HANDOFF = join(process.cwd(), "handoff/cohorte-trafic");
const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

async function ensureVenue(h: Record<string, unknown>): Promise<string> {
  const venueSlug = h.venue_slug as string;
  const { data: v } = await sb.from("venues").select("id").eq("slug", venueSlug).maybeSingle();
  if (v) return v.id as string;
  const vc = h.venue_create as Record<string, unknown> | undefined;
  if (!vc) throw new Error(`venue ${venueSlug} introuvable et pas de venue_create`);
  console.log(`  CREATE venue ${vc.slug} (${vc.name}, ${vc.city})`);
  if (!APPLY) return "dry-run-venue-id";
  const { data: nv, error } = await sb
    .from("venues")
    .insert({ slug: vc.slug, name: vc.name, city: vc.city, country: vc.country ?? "FR", address: vc.address ?? null } as never)
    .select("id")
    .single();
  if (error) throw new Error(`venue ${vc.slug}: ${error.message}`);
  return nv.id as string;
}

async function main() {
  if (!slugs.length) throw new Error("aucun slug fourni");
  console.log(PUBLISH ? "=== PUBLISH ===" : APPLY ? "=== APPLY (draft) ===" : "=== DRY-RUN ===");

  if (PUBLISH) {
    for (const slug of slugs) {
      const { data: row, error } = await sb.from("salons").select("status,editorial_mdx").eq("slug", slug).maybeSingle();
      if (error) throw new Error(`${slug}: ${error.message}`);
      if (!row) { console.log(`SKIP ${slug}: absent en base`); continue; }
      if (row.status === "published") { console.log(`OK ${slug}: déjà publié`); continue; }
      if (!row.editorial_mdx) { console.log(`SKIP ${slug}: pas de editorial_mdx, non publiable`); continue; }
      console.log(`PUBLISH ${slug}`);
      const { error: upErr } = await sb.from("salons").update({ status: "published" } as never).eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
    return;
  }

  for (const slug of slugs) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    if (h.slug !== slug) throw new Error(`${slug}: slug du handoff (${h.slug}) différent`);
    for (const k of ["name", "start_date", "end_date", "city", "website_url", "editorial_mdx", "seo_title", "seo_description", "description", "editorial_mdx_en", "seo_title_en"]) {
      if (!h[k]) throw new Error(`${slug}: champ ${k} manquant ou vide dans le handoff`);
    }
    // Enum DB salon_category (lot 4 : un writer avait écrit "salon_pro", insert refusé en plein lot)
    const CATEGORIES = ["salon_professionnel", "salon_grand_public", "congres", "autres"];
    if (h.category && !CATEGORIES.includes(h.category)) {
      throw new Error(`${slug}: category "${h.category}" hors enum (${CATEGORIES.join(", ")})`);
    }

    const { data: existing } = await sb.from("salons").select("id,status").eq("slug", slug).maybeSingle();
    if (existing) { console.log(`SKIP ${slug}: existe déjà (status ${existing.status})`); continue; }

    const venueId = await ensureVenue(h);
    const row = {
      slug, name: h.name, edition_year: h.edition_year, edition_number: h.edition_number ?? null,
      start_date: h.start_date, end_date: h.end_date, dates_confirmed: h.dates_confirmed ?? false,
      city: h.city, venue: h.venue_name, venue_id: venueId,
      venue_lat: h.venue_create?.lat ?? null, venue_lng: h.venue_create?.lng ?? null,
      country: h.country ?? "FR", website_url: h.website_url,
      organizer_name: h.organizer_name ?? null, co_organizer_name: h.co_organizer_name ?? null,
      frequency: h.frequency ?? null,
      estimated_exhibitors: h.estimated_exhibitors ?? null, estimated_visitors: h.estimated_visitors ?? null,
      category: h.category ?? null, description: h.description,
      seo_title: h.seo_title, seo_description: h.seo_description, editorial_mdx: h.editorial_mdx,
      description_en: h.description_en ?? null, seo_title_en: h.seo_title_en ?? null,
      seo_description_en: h.seo_description_en ?? null, editorial_mdx_en: h.editorial_mdx_en ?? null,
      status: "draft",
      notes_internes: (h.alerts ?? []).length ? "Alertes cohorte trafic 2026-08-04:\n- " + (h.alerts as string[]).join("\n- ") : null,
    };
    console.log(`INSERT ${slug} (draft): ${h.name} · ${h.start_date} · ${h.city} · secteurs ${JSON.stringify(h.sector_slugs)}`);
    if (!APPLY) continue;

    const { data: inserted, error } = await sb.from("salons").insert(row as never).select("id").single();
    if (error) throw new Error(`${slug}: ${error.message}`);

    for (const secSlug of h.sector_slugs ?? []) {
      const { data: sec, error: secErr } = await sb.from("sectors").select("id").eq("slug", secSlug).single();
      if (secErr) throw new Error(`${slug}: secteur ${secSlug} introuvable`);
      const { error: linkErr } = await sb.from("salon_sectors").insert({ salon_id: inserted.id, sector_id: sec.id } as never);
      if (linkErr) throw new Error(`${slug} x ${secSlug}: ${linkErr.message}`);
    }
    console.log(`  → inséré avec ${(h.sector_slugs ?? []).length} secteur(s)`);
  }
  console.log(`\n${APPLY ? "APPLIQUÉ" : "DRY-RUN terminé"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
