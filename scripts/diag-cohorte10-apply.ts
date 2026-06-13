/**
 * Application cohorte 10 (2026-06-13) : publication 10 fiches vierges à venir.
 * editorial_mdx + seo + db_updates vétés. Dry-run par défaut ; --apply. Idempotent.
 *
 * Arbitrages Nicolas exclus : congres-hr frequency 'semestriel' (hors enum),
 * salon-copropriete category, gazelec edition_number, cloud-expo autonomie.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/cohorte-10-review");
const SLUGS = readdirSync(HANDOFF).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));

const FIELDS = new Set(["name", "start_date", "end_date", "edition_year", "edition_number", "frequency", "organizer_name", "co_organizer_name", "website_url", "estimated_visitors", "estimated_exhibitors", "city", "venue", "description"]);
const INT = new Set(["edition_year", "edition_number", "estimated_visitors", "estimated_exhibitors"]);
const FREQ = new Set(["annuel", "bisannuel", "triennal", "ponctuel"]);
const FREQ_MAP: Record<string, string> = { biennal: "bisannuel", biannuel: "bisannuel" };

function coerce(field: string, raw: unknown): unknown {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (field === "frequency") { s = s.toLowerCase().split(/[ (]/)[0]; s = FREQ_MAP[s] ?? s; return FREQ.has(s) ? s : undefined; }
  if (INT.has(field)) { const n = parseInt(s.replace(/[^\d]/g, ""), 10); return Number.isNaN(n) ? null : n; }
  return s;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of SLUGS) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    const patch: Record<string, unknown> = { editorial_mdx: h.mdx, seo_title: h.seo_title, seo_description: h.seo_description, status: "published" };
    const skipped: string[] = [];
    for (const u of h.db_updates ?? []) {
      if (!FIELDS.has(u.field)) continue;
      const v = coerce(u.field, u.proposed);
      if (v === undefined) { skipped.push(u.field + "(invalide)"); continue; }
      patch[u.field] = v;
    }
    console.log(`${slug}: ${Object.keys(patch).filter((k) => k !== "editorial_mdx").join(", ")}${skipped.length ? " | SKIP: " + skipped.join(",") : ""}`);
    if (APPLY) {
      const { error } = await sb.from("salons").update(patch as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
