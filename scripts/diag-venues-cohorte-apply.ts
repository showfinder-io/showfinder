/**
 * Application cohorte fiches lieux (2026-06-13) : editorial_mdx + champs DB
 * (adresse, surface, halls, site, maps, coords, description) pour 10 venues,
 * depuis les handoffs. Dry-run par défaut ; --apply. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-venues-cohorte-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const HANDOFF = join(process.cwd(), "handoff/venues-cohorte");
const SLUGS = ["palais-des-festivals-cannes", "messe-munchen", "grimaldi-forum", "paris-la-defense-arena", "parc-expositions-montpellier", "grande-halle-villette", "palais-du-pharo", "palais-musique-congres-strasbourg", "cite-des-congres-nantes", "centre-des-congres-reims"];

// Champs venue acceptés depuis les db_updates des handoffs.
const FIELDS = new Set(["address", "postal_code", "total_surface_sqm", "halls_count", "website_url", "google_maps_url", "lat", "lng", "description", "city"]);
const INT = new Set(["total_surface_sqm", "halls_count"]);
const FLOAT = new Set(["lat", "lng"]);

function coerce(field: string, raw: unknown): unknown {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === "" || s.toLowerCase() === "null") return null;
  if (INT.has(field)) { const n = parseInt(s.replace(/[^\d-]/g, ""), 10); return Number.isNaN(n) ? null : n; }
  if (FLOAT.has(field)) { const n = parseFloat(s); return Number.isNaN(n) ? null : n; }
  return s;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const slug of SLUGS) {
    const h = JSON.parse(readFileSync(join(HANDOFF, `${slug}.json`), "utf8"));
    const patch: Record<string, unknown> = { editorial_mdx: h.mdx };
    for (const u of h.db_updates ?? []) if (FIELDS.has(u.field)) patch[u.field] = coerce(u.field, u.proposed);
    // garde-fou long tiret
    const em = (h.mdx ?? "").includes("—") || (h.mdx ?? "").includes("–");
    console.log(`${slug}: ${Object.keys(patch).filter((k) => k !== "editorial_mdx").join(", ")} | mdx ${String(h.mdx).length}c${em ? " ⚠️ LONG TIRET" : ""}`);
    if (APPLY) {
      const { error } = await sb.from("venues").update(patch as never).eq("slug", slug);
      if (error) throw new Error(`${slug}: ${error.message}`);
    }
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}
main().catch((e) => { console.error(e); process.exit(1); });
