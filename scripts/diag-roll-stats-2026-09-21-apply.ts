/**
 * Correction des Quick Stats (estimated_visitors, estimated_exhibitors) de trois
 * fiches dont le refresh éditorial du 2026-09-21 a montré que les valeurs en base
 * contredisaient le bilan officiel de l'organisateur. Ces champs s'affichent sur
 * la fiche : CLAUDE.md demande des chiffres vérifiables uniquement.
 *
 * Chaque valeur vient du bilan publié par l'organisateur, relu par un reviewer
 * indépendant (handoff/edito-roll-2027/review/). Verrou optimiste sur l'ancienne
 * valeur. Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-roll-stats-2026-09-21-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

type Fix = { slug: string; from: { visitors: number; exhibitors: number }; to: { visitors: number; exhibitors: number }; source: string; note: string };
const FIXES: Fix[] = [
  {
    slug: "playtime-paris",
    from: { visitors: 12000, exhibitors: 300 },
    to: { visitors: 3527, exhibitors: 260 },
    source: "https://www.iloveplaytime.com/wp-content/uploads/2026/08/S26-PARIS-REPORT-EN.pdf",
    note: "bilan officiel de la session d'été 2026 : 3 527 visiteurs de 71 pays, plus de 260 marques de 33 pays. Le chiffre de 12 000 n'a aucune source, même en cumulant Paris, New York et Los Angeles.",
  },
  {
    slug: "eurosatory-paris",
    from: { visitors: 57000, exhibitors: 1800 },
    to: { visitors: 59972, exhibitors: 2633 },
    source: "https://coges.cdn.mediactive-network.net/wp-content/uploads/2026/07/CP_Bilan_Eurosatory_2026_Juillet.pdf",
    note: "communiqué de bilan du COGES, 7 juillet 2026 : 59 972 visiteurs professionnels de 165 pays, 2 633 sociétés exposantes de 67 pays.",
  },
  {
    slug: "vivatech",
    from: { visitors: 180000, exhibitors: 14000 },
    to: { visitors: 200000, exhibitors: 4500 },
    source: "https://vivatech.com/media/press-releases/cp-bilan",
    note: "communiqué de clôture du 20 juin 2026 : 200 000 visiteurs, plus de 4 500 exposants. La valeur 14 000 était le nombre de startups (plus de 15 000 en 2026), pas d'exposants.",
  },
];

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  for (const f of FIXES) {
    const { data: s, error } = await sb.from("salons").select("estimated_visitors,estimated_exhibitors").eq("slug", f.slug).single();
    if (error) throw new Error(`${f.slug}: ${error.message}`);
    if (s.estimated_visitors === f.to.visitors && s.estimated_exhibitors === f.to.exhibitors) { console.log(`DÉJÀ APPLIQUÉ ${f.slug}`); continue; }
    if (s.estimated_visitors !== f.from.visitors || s.estimated_exhibitors !== f.from.exhibitors) {
      throw new Error(`${f.slug}: valeurs en base inattendues (${s.estimated_visitors} / ${s.estimated_exhibitors}), rien n'est écrit`);
    }
    console.log(`FIX ${f.slug} : visiteurs ${f.from.visitors} -> ${f.to.visitors} ; exposants ${f.from.exhibitors} -> ${f.to.exhibitors}\n      ${f.note}\n      ${f.source}`);
    if (APPLY) {
      const { data: rows, error: upErr } = await sb
        .from("salons")
        .update({ estimated_visitors: f.to.visitors, estimated_exhibitors: f.to.exhibitors } as never)
        .eq("slug", f.slug)
        .eq("estimated_visitors", f.from.visitors)
        .select("slug");
      if (upErr) throw new Error(`${f.slug}: ${upErr.message}`);
      if (!rows?.length) throw new Error(`${f.slug}: aucune ligne mise à jour (verrou optimiste)`);
    }
  }
  console.log(APPLY ? "\n=== APPLIQUÉ ===" : "\n=== DRY-RUN terminé ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
