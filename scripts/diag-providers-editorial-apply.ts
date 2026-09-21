/**
 * Insertion en base des fiches prestataires produites par le pipeline writer / reviewers
 * (handoff/prestataires/out/<slug>.json, règles tasks/regles-edito-prestataires-v1.md).
 *
 * Garde-fous avant écriture, par fiche :
 *  - le contrôle mécanique passe (scripts/diag-providers-lint.ts, relancé ici) ;
 *  - aucune review (pass-1, pass-2) en verdict "bloquant" (identité non confirmée, P33) ;
 *  - une review pass-1 existe.
 * Une fiche "matiere_insuffisante" est écrite (texte court mais prouvé) sans jamais devenir indexable.
 *
 * seo_indexable : posé uniquement sur le lot test (--indexable-lot slug1,slug2,...), et seulement
 * si la fiche est status ok, >= 400 caractères et a un département. Le reste demeure en noindex
 * jusqu'à lecture des résultats GSC (décision Julien 2026-09-21 : test sur une vingtaine de fiches).
 *
 * department : code postal du fichier de Nicolas, sinon ville connue, sinon siège du registre.
 * company_name : graphie du site (display_name) seulement si elle ne change que la casse,
 * les espaces ou la ponctuation. Un vrai changement de nom reste une décision humaine.
 * Idempotent. Dry-run par défaut ; --apply.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const lotArg = process.argv.indexOf("--indexable-lot");
const INDEXABLE_LOT = new Set(lotArg > -1 ? process.argv[lotArg + 1].split(",") : []);
const BASE = "handoff/prestataires";

const CITY_DEPARTMENT: Record<string, string> = { Paris: "75", Lyon: "69", Metz: "57", Gonesse: "95" };
const compact = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");

type Out = {
  slug: string; status: string; display_name?: string; description_fr?: string; description_en?: string;
  specialties?: { label: string }[]; founded_year?: { value: number } | null;
  zone_intervention?: { value: string } | null; memberships?: string[];
};
const readJson = <T,>(file: string): T | null => (existsSync(file) ? (JSON.parse(readFileSync(file, "utf-8")) as T) : null);

(async () => {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let lintOutput = "";
  try { lintOutput = execFileSync("./node_modules/.bin/tsx", ["scripts/diag-providers-lint.ts"], { encoding: "utf-8" }); }
  catch (e) { lintOutput = (e as { stdout?: string }).stdout ?? ""; }
  const lintFailed = new Set([...lintOutput.matchAll(/^✗ (\S+)/gm)].map((m) => m[1]));

  const seed: { slug: string; postal_code: string | null }[] = JSON.parse(readFileSync("scripts/seeds/prestataires-2026-09-20.json", "utf-8"));
  const seedPostal = new Map(seed.map((r) => [r.slug === "magnum" ? "magnum-lyon" : r.slug, r.postal_code]));

  const counts = { written: 0, indexable: 0, skipped: 0, renamed: 0 };
  for (const file of readdirSync(`${BASE}/out`).filter((f) => f.endsWith(".json")).sort()) {
    const slug = file.slice(0, -5);
    const out = readJson<Out>(`${BASE}/out/${file}`)!;
    const dossier = readJson<{ city: string | null; legal_unit?: { match?: { code_postal?: string | null } | null } }>(`${BASE}/dossiers/${slug}.json`);
    const reviews = [readJson<{ verdict: string }>(`${BASE}/reviews/pass1/${slug}.json`), readJson<{ verdict: string }>(`${BASE}/reviews/pass2/${slug}.json`)];

    const reason = lintFailed.has(slug) ? "contrôle mécanique en échec"
      : !reviews[0] ? "pas de review pass-1"
      : reviews.some((r) => r?.verdict === "bloquant") ? "review bloquante (identité, P33)"
      : !out.description_fr?.trim() ? "description vide"
      : null;
    if (reason) { console.log(`  ${slug}: IGNORÉ (${reason})`); counts.skipped++; continue; }

    const { data: existing, error } = await sb.from("providers").select("company_name").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (!existing) { console.log(`  ${slug}: IGNORÉ (absent de la base)`); counts.skipped++; continue; }

    const postalCode = seedPostal.get(slug) ?? null;
    const department = postalCode?.slice(0, 2)
      ?? (dossier?.city ? CITY_DEPARTMENT[dossier.city] : undefined)
      ?? dossier?.legal_unit?.match?.code_postal?.slice(0, 2)
      ?? null;
    const description = out.description_fr!.trim();
    const indexable = INDEXABLE_LOT.has(slug) && out.status === "ok" && description.length >= 400 && department !== null;
    const rename = out.display_name && out.display_name !== existing.company_name && compact(out.display_name) === compact(existing.company_name);

    const patch = {
      description,
      description_en: out.description_en?.trim() || null,
      specialties: (out.specialties ?? []).map((s) => s.label),
      founded_year: out.founded_year?.value ?? null,
      zone_intervention: out.zone_intervention?.value ?? null,
      memberships: out.memberships ?? [],
      postal_code: postalCode,
      department,
      editorial_reviewed_at: new Date().toISOString(),
      seo_indexable: indexable,
      ...(rename ? { company_name: out.display_name } : {}),
    };
    console.log(`  ${slug}: ${description.length} car., dépt ${department ?? "?"}${indexable ? ", INDEXABLE" : ""}${rename ? `, nom "${existing.company_name}" -> "${out.display_name}"` : ""}${out.status !== "ok" ? `, ${out.status}` : ""}`);
    if (APPLY) {
      const { error: writeError } = await sb.from("providers").update(patch as never).eq("slug", slug);
      if (writeError) throw new Error(`${slug}: ${writeError.message}`);
    }
    counts.written++; if (indexable) counts.indexable++; if (rename) counts.renamed++;
  }
  const missing = [...INDEXABLE_LOT].filter((s) => !existsSync(`${BASE}/out/${s}.json`));
  if (missing.length) console.log(`  lot test sans sortie : ${missing.join(", ")}`);
  console.log(counts);
  console.log(APPLY ? "=== APPLIQUÉ ===" : "=== DRY-RUN terminé ===");
})().catch((e) => { console.error(e); process.exit(1); });
