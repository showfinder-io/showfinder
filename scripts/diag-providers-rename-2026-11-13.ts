/**
 * Renommage des slugs dushow-paris -> dushow et videlio-paris -> videlio (2026-11-13), suite du
 * point 7 de tasks/relecture-agent-prestataires-2026-11-12.md : sièges à Roissy-en-France (95) et
 * Gennevilliers (92), slug « -paris » trompeur, même convention que magnum et expocom.
 * Ne renomme que si les 301 de next.config.ts répondent en prod (sinon l'ancienne URL resterait en
 * 200 vers une fiche introuvable sous le nouveau slug, puis 404). Dry-run par défaut, --apply.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const PROD = process.env.AGORIS_PROD_URL ?? "https://www.agoris.io";
const RENAMES = [
  { from: "dushow-paris", to: "dushow" },
  { from: "videlio-paris", to: "videlio" },
];

async function redirectLive(from: string, to: string): Promise<boolean> {
  let ok = true;
  for (const prefix of ["", "/en"]) {
    const res = await fetch(`${PROD}${prefix}/prestataires/${from}`, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    const loc = res.headers.get("location") ?? "";
    const live = [301, 308].includes(res.status) && loc.endsWith(`${prefix}/prestataires/${to}`);
    console.log(`  ${prefix}/prestataires/${from} : ${res.status} ${loc}${live ? "" : "  (301 pas encore active)"}`);
    ok &&= live;
  }
  return ok;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const { from, to } of RENAMES) {
    const { data: taken } = await sb.from("providers").select("id").eq("slug", to).maybeSingle();
    const { data: hub } = await sb.from("provider_hubs").select("id").eq("slug", to).maybeSingle();
    const { data: row } = await sb.from("providers").select("id").eq("slug", from).maybeSingle();
    if (!row && taken) { console.log(`${from} -> ${to} : déjà renommé`); continue; }
    if (!row) throw new Error(`${from} introuvable`);
    if (taken || hub) throw new Error(`${to} déjà pris`);
    if (!(await redirectLive(from, to))) { console.log(`${from} : SAUTÉ, 301 pas active`); continue; }
    console.log(`${from} -> ${to}`);
    if (!APPLY) continue;
    const { error } = await sb.from("providers").update({ slug: to } as never).eq("id", row.id).eq("slug", from);
    if (error) throw error;
    console.log("  écrit");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
