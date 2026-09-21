/**
 * Import des prestataires transmis par Nicolas le 2026-09-20
 * (scripts/seeds/prestataires-2026-09-20.json, sources LEADS France + Prestalians).
 *
 * Décision Julien 2026-09-21 : upsert par slug, les prestataires déjà en base et
 * leurs liens salon_providers sont conservés (pas de remplacement strict).
 *
 * Garde-fou (même esprit que la règle #13) : seuls les prestataires dont le site
 * répond en 200 avec le nom présent sont importés (scripts/diag-verify-providers.ts,
 * résultat dans scripts/output/verify-providers-2026-09-20.csv). Écarté :
 *  - bouvry-gilles : 404 "Site non trouvé" (2026-09-21), aucun autre site trouvé (LinkedIn seul)
 * Sites retrouvés par recherche web le 2026-09-21 et ajoutés au seed (absents ou morts dans
 * le fichier), chacun recoupé avec l'adresse du fichier :
 *  - agence-bosco : agence-bosco.fr (Le Rheu 35650 sur la page)
 *  - alris-communication : alris.com (La Ciotat 13600 sur la page)
 *  - la-p-tite-histoire : laptitehistoire.com (page contact : rue de l'Armorique 75015 Paris,
 *    téléphone repris de cette page)
 *  - l-as-decors : lasdecors.fr remplace lasdecors.com (mort), Méru 60110 sur la page
 * Confirmé à la main (fetch Node en échec, curl 200 + title "Atelier Design") : atelier-design.
 * Corrigé dans le seed : aliance-mobilier (.fr redirige vers aliance-mobilier.com).
 *
 * Magnum existe déjà sous le slug magnum-lyon (ville corrigée en Gonesse par la
 * migration 20260723000000) : on enrichit cette ligne, le slug ne change pas (URL pérenne).
 *
 * Insert : is_verified=false, subscription_tier=free. Ligne déjà en base : on ne
 * remplit que les champs vides (la description existante a sa traduction description_en,
 * l'écraser désynchroniserait FR et EN).
 * Prérequis : migration 20260921000000 (enum location_mobilier) appliquée.
 * Idempotent. Dry-run par défaut ; --apply.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const EXCLUDED = new Set(["bouvry-gilles"]);
const SLUG_ALIASES: Record<string, string> = { magnum: "magnum-lyon" };
const FIELDS = ["company_name", "category", "description", "city", "website_url", "email", "phone", "logo_url"] as const;

type SeedRow = { slug: string } & Record<(typeof FIELDS)[number], string | null>;

(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const seed: SeedRow[] = JSON.parse(readFileSync("scripts/seeds/prestataires-2026-09-20.json", "utf-8"));
  let inserted = 0, updated = 0, unchanged = 0;
  for (const row of seed) {
    if (EXCLUDED.has(row.slug)) { console.log(`  ${row.slug}: ÉCARTÉ`); continue; }
    const slug = SLUG_ALIASES[row.slug] ?? row.slug;
    const { data: existing, error: readError } = await sb.from("providers").select("*").eq("slug", slug).maybeSingle();
    if (readError) throw new Error(`${slug}: ${readError.message}`);

    if (!existing) {
      const payload = { slug, is_verified: false, subscription_tier: "free", ...Object.fromEntries(FIELDS.map((f) => [f, row[f]])) };
      console.log(`  ${slug}: INSERT (${row.category}, ${row.city})`);
      if (APPLY) {
        const { error } = await sb.from("providers").insert(payload as never);
        if (error) throw new Error(`${slug}: ${error.message}`);
      }
      inserted++;
      continue;
    }

    const patch: Record<string, string> = {};
    for (const f of FIELDS) {
      const next = row[f];
      if (next && !(existing as Record<string, unknown>)[f]) patch[f] = next;
    }
    if (Object.keys(patch).length === 0) { unchanged++; continue; }
    console.log(`  ${slug}: UPDATE ${Object.keys(patch).join(", ")}`);
    if (APPLY) {
      const { error } = await sb.from("providers").update(patch as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
    updated++;
  }
  console.log({ inserted, updated, unchanged, excluded: EXCLUDED.size });
  console.log(APPLY ? "=== APPLIQUÉ ===" : "=== DRY-RUN terminé ===");
})().catch((e) => { console.error(e); process.exit(1); });
