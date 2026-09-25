/**
 * Passe CTR n°2 (2026-09-25), sélection par scripts/diag-ctr-pass2-select.ts.
 * Seules 2 fiches justifient une réécriture : tech-elevage (titre de 82 car.
 * tronqué avant les dates, CTR 2,1 % en pos 4,4) et energaia (fallback générique).
 * Textes composés uniquement depuis les champs DB vérifiés.
 * Garde-fous (repris de diag-ctr-pass-apply.ts) : verrou sur les dates, et
 * n'écrase un seo_title existant que s'il vaut exactement `prevTitle`.
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-ctr-pass2-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

type Entry = { start: string; end: string; prevTitle: string | null; seo_title: string; seo_description: string };

const ENTRIES: Record<string, Entry> = {
  "tech-elevage-la-roche-sur-yon": {
    start: "2026-11-24", end: "2026-11-26",
    prevTitle: "Tech'Elevage 2026 La Roche-sur-Yon : salon de l'élevage du grand Ouest",
    seo_title: "Tech'Elevage 2026 : dates (24-26 novembre), La Roche-sur-Yon",
    seo_description: "Tech'Elevage 2026, salon de l'élevage de ruminants du grand Ouest, du 24 au 26 novembre au Parc Expo des Oudairies, La Roche-sur-Yon. Plus de 200 exposants.",
  },
  "energaia-montpellier": {
    start: "2026-12-09", end: "2026-12-10",
    prevTitle: null,
    seo_title: "Energaia 2026 Montpellier : dates (9-10 décembre), exposants",
    seo_description: "Energaia 2026, salon des énergies renouvelables, les 9 et 10 décembre au Parc des Expositions de Montpellier. 551 exposants, 22 500 visiteurs. Infos pratiques.",
  },
};

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let updated = 0, skipped = 0;

  for (const [slug, e] of Object.entries(ENTRIES)) {
    const { data: row, error } = await sb
      .from("salons")
      .select("slug,start_date,end_date,seo_title")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (!row) { console.log(`SKIP ${slug}: fiche introuvable`); skipped++; continue; }

    if (row.start_date !== e.start || row.end_date !== e.end) {
      console.log(`SKIP ${slug}: dates DB (${row.start_date} → ${row.end_date}) != texte (${e.start} → ${e.end})`);
      skipped++; continue;
    }
    if (row.seo_title !== e.prevTitle && row.seo_title !== e.seo_title) {
      console.log(`SKIP ${slug}: seo_title modifié depuis la sélection ("${row.seo_title}"), pas d'écrasement`);
      skipped++; continue;
    }

    console.log(`UPDATE ${slug}: ${e.seo_title} (${e.seo_title.length} car.) | desc ${e.seo_description.length} car.`);
    if (APPLY) {
      const { error: upErr } = await sb
        .from("salons")
        .update({ seo_title: e.seo_title, seo_description: e.seo_description } as never)
        .eq("slug", slug);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
    updated++;
  }

  console.log(`\n${APPLY ? "APPLIQUÉ" : "DRY-RUN"} : ${updated} mises à jour, ${skipped} sautées`);
}

main().catch((e) => { console.error(e); process.exit(1); });
