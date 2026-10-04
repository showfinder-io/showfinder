/**
 * Liens croisés entre fiches salon (RR37), appliqués après publication d'une
 * cohorte (2026-10-03, cohorte sl3c). Lit <dir>/<slug>.json
 * ({ slug, editorial_mdx, editorial_mdx_en }) et met à jour les deux MDX de
 * la fiche publiée.
 *
 * Garde-fou principal : le seul changement admis est l'ajout ou le retrait
 * de liens /salons/<slug>. Une fois ces liens remplacés par leur texte, le
 * MDX proposé doit être identique, caractère pour caractère, au MDX en base.
 * Contrôles aussi : fiche publiée, cible de chaque lien /salons/ publiée et
 * différente de la fiche elle-même, MDX compilable, aucun tiret cadratin.
 * editorial_updated_at n'est pas touché (pas de refresh éditorial).
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-crosslinks-apply.ts <dir> [--apply] [slug ...]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const [dir, ...only] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!dir) throw new Error("usage : diag-crosslinks-apply.ts <dir> [--apply] [slug ...]");

const SALON_LINK = /\[([^\]]+)\]\((?:\/en)?\/salons\/([a-z0-9-]+)\)/g;
const unlink = (mdx: string) => mdx.replace(SALON_LINK, "$1");
const targets = (mdx: string) => [...mdx.matchAll(SALON_LINK)].map((m) => m[2]);

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const { compile } = await import("@mdx-js/mdx");
  const { data: pub, error: pubErr } = await sb.from("salons").select("slug").eq("status", "published");
  if (pubErr) throw pubErr;
  const published = new Set(pub!.map((r) => r.slug as string));

  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).filter((f) => !only.length || only.includes(f.replace(/\.json$/, "")));
  let ok = 0, unchanged = 0, failed = 0;
  for (const file of files) {
    const next = JSON.parse(readFileSync(join(dir, file), "utf8")) as { slug: string; editorial_mdx: string; editorial_mdx_en: string };
    const { data: row, error } = await sb.from("salons").select("id,status,editorial_mdx,editorial_mdx_en").eq("slug", next.slug).maybeSingle();
    if (error) throw error;
    const issues: string[] = [];
    if (!row) { console.log(`FAIL ${next.slug} : fiche introuvable`); failed++; continue; }
    if (row.status !== "published") issues.push(`statut ${row.status}`);
    const added: string[] = [];
    for (const [field, label] of [["editorial_mdx", "FR"], ["editorial_mdx_en", "EN"]] as const) {
      const before = (row[field] as string | null) ?? "";
      const after = next[field];
      if (!after) { issues.push(`${label} : MDX proposé vide`); continue; }
      if (unlink(after) !== unlink(before)) issues.push(`${label} : le texte change au-delà des liens /salons/`);
      if (after.includes("—")) issues.push(`${label} : tiret cadratin`);
      for (const t of targets(after)) {
        if (t === next.slug) issues.push(`${label} : lien vers la fiche elle-même`);
        else if (!published.has(t)) issues.push(`${label} : cible non publiée /salons/${t}`);
      }
      const prev = new Set(targets(before));
      for (const t of targets(after)) if (!prev.has(t)) added.push(`${label}:${t}`);
      try { await compile(after, { outputFormat: "function-body" }); } catch (e) { issues.push(`${label} : MDX non compilable (${(e as Error).message.slice(0, 80)})`); }
    }
    if (issues.length) { console.log(`FAIL ${next.slug} : ${issues.join(" ; ")}`); failed++; continue; }
    if (next.editorial_mdx === row.editorial_mdx && next.editorial_mdx_en === row.editorial_mdx_en) { console.log(`=    ${next.slug} : déjà à jour`); unchanged++; continue; }
    console.log(`OK   ${next.slug} : +${added.length} lien(s) ${[...new Set(added)].join(" ")}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update({ editorial_mdx: next.editorial_mdx, editorial_mdx_en: next.editorial_mdx_en } as never).eq("id", row.id);
      if (upErr) throw upErr;
    }
    ok++;
  }
  console.log(`\n${ok} à écrire${APPLY ? " (écrits)" : ""}, ${unchanged} déjà à jour, ${failed} en échec`);
  if (failed) process.exitCode = 1;
}

main();
