/**
 * Application des correctifs de l'audit find-next-edition du 2026-06-13.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Bloc "sûr" uniquement (les rolls de dates des fiches à MDX éditorial sont
 * gardés pour une passe éditoriale dédiée) :
 *  1. sepem-douai : frequency annuel -> bisannuel (biennal confirmé)
 *  2. expobiogaz-bordeaux -> slug expobiogaz (Bordeaux n'a jamais été une
 *     édition ; data + MDX décrivent déjà Lyon 2026 correctement) + 301
 *  3. vinexpo-paris -> draft (doublon de wine-paris, même édition 2027) + 301
 *  4. 6 fiches "verifier" : alert_flag + note interne (review admin)
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-audit-fixes-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const STAMP = "[audit 2026-06-13]";

// slug -> note interne (édition suivante détectée, à traiter en passe éditoriale)
const FLAGS: Record<string, string> = {
  "sepem-douai": "Prochaine édition Douai : 25-27 janvier 2028 (biennal confirmé eventseye/officiel). Fréquence corrigée annuel->bisannuel.",
  "premiere-vision-paris": "Le scraper a détecté Première Vision New York (juil. 2026) : édition d'une AUTRE ville de la marque, pas la prochaine édition Paris. Ne pas rouler sur cette base.",
  "snack-show": "Prochaine édition : 24-26 mars 2027, Paris Porte de Versailles (Pavillon 7.3). À rouler en passe éditoriale.",
  "sitl": "Prochaine édition 2027 : changement de lieu Paris Nord Villepinte -> Paris Expo Porte de Versailles (Pavillon 1), 23-25 mars 2027 (confirmé sitl.eu). À rouler + maj venue_id en passe éditoriale.",
  "expobiogaz-bordeaux": "Salon itinérant. Prochaine édition : 2-3 juin 2027 à Reims Expo (confirmé expobiogaz.com). À rouler en passe éditoriale. Slug corrigé -> expobiogaz.",
  "preventica-paris": "Le scraper a détecté Preventica Rennes (juin 2026) : édition d'une AUTRE ville de la marque, pas la prochaine édition Paris. Pas de prochaine édition Paris confirmée.",
};

async function appendNote(slug: string, note: string) {
  const { data } = await sb.from("salons").select("notes_internes").eq("slug", slug).maybeSingle();
  if (!data) { console.log(`  (absent) ${slug}`); return; }
  const cur = (data as { notes_internes: string | null }).notes_internes ?? "";
  if (cur.includes(STAMP)) { console.log(`  (déjà flaggé) ${slug}`); return; }
  const next = (cur ? cur + "\n\n" : "") + `${STAMP} ${note}`;
  console.log(`  FLAG ${slug}: ${note.slice(0, 70)}...`);
  if (APPLY) {
    const { error } = await sb.from("salons").update({ alert_flag: true, notes_internes: next } as never).eq("slug", slug);
    if (error) throw new Error(`${slug}: ${error.message}`);
  }
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");

  // 1. sepem-douai : frequency
  console.log("\n-- 1. sepem-douai frequency -> bisannuel --");
  if (APPLY) {
    const { error } = await sb.from("salons").update({ frequency: "bisannuel" } as never).eq("slug", "sepem-douai");
    if (error) throw new Error("sepem-douai: " + error.message);
  }
  console.log("  OK");

  // 2. expobiogaz-bordeaux -> expobiogaz (slug)
  console.log("\n-- 2. expobiogaz-bordeaux -> expobiogaz --");
  const { data: ex } = await sb.from("salons").select("slug").eq("slug", "expobiogaz").maybeSingle();
  if (ex) { console.log("  expobiogaz existe déjà, skip rename"); }
  else if (APPLY) {
    const { error } = await sb.from("salons").update({ slug: "expobiogaz" } as never).eq("slug", "expobiogaz-bordeaux");
    if (error) throw new Error("expobiogaz: " + error.message);
    console.log("  renommé");
  } else console.log("  (dry-run) renommerait");

  // 3. vinexpo-paris -> draft (doublon wine-paris)
  console.log("\n-- 3. vinexpo-paris -> draft (doublon wine-paris) --");
  if (APPLY) {
    const { error } = await sb.from("salons").update({ status: "draft" } as never).eq("slug", "vinexpo-paris");
    if (error) throw new Error("vinexpo: " + error.message);
  }
  console.log("  OK");

  // 4. flags verifier (note : expobiogaz est désormais sous le slug 'expobiogaz')
  console.log("\n-- 4. flags verifier (alert_flag + notes) --");
  for (const [slug, note] of Object.entries(FLAGS)) {
    const target = slug === "expobiogaz-bordeaux" ? (ex ? "expobiogaz" : (APPLY ? "expobiogaz" : "expobiogaz-bordeaux")) : slug;
    await appendNote(target, note);
  }

  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
