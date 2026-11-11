/**
 * Codes postaux des lieux (todo G4ter, 2026-10-10) : 50 lieux rattachés à des
 * salons FR publiés n'avaient pas de postal_code, donc le drawer prestataires
 * de ces fiches n'avait pas de préfiltre « près du salon ». Codes sourcés dans
 * handoff/g4ter/result.json : adresse déjà en base contrôlée par la Base
 * Adresse Nationale, ou adresse lue sur le site officiel du lieu (URL et
 * citation dans le fichier). CEDEX remplacés par le code géographique BAN.
 * L'adresse n'est écrite que si elle était vide en base.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-g4ter-postal-codes-apply.ts [--apply]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

type Row = { venue_slug: string; postal_code: string; address: string | null };

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const { venues } = JSON.parse(readFileSync(join(process.cwd(), "handoff/g4ter/result.json"), "utf8")) as { venues: Row[] };
  let done = 0;
  for (const v of venues) {
    if (!/^\d{5}$/.test(v.postal_code)) throw new Error(`${v.venue_slug}: code postal invalide "${v.postal_code}"`);
    const { data: live, error } = await sb.from("venues").select("id,postal_code,address").eq("slug", v.venue_slug).single();
    if (error) throw new Error(`${v.venue_slug}: ${error.message}`);
    if (live.postal_code === v.postal_code) { done++; continue; }
    if (live.postal_code) { console.log(`SKIP ${v.venue_slug}: code déjà renseigné (${live.postal_code})`); continue; }
    const patch: Record<string, string> = { postal_code: v.postal_code };
    if (!live.address && v.address) patch.address = v.address;
    console.log(`UPDATE ${v.venue_slug}: ${JSON.stringify(patch)}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("venues").update(patch as never).eq("id", live.id).is("postal_code", null);
      if (upErr) throw new Error(`${v.venue_slug}: ${upErr.message}`);
    }
    done++;
  }
  console.log(`\n${done}/${venues.length} lieux ${APPLY ? "à jour" : "applicables ou déjà à jour"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
