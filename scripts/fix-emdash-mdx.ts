// Correction des longs tirets dans le contenu éditorial MDX (cleanup 2026-06-13).
//
// Pendant de scripts/diag-emdash-mdx.ts. Règle absolue du projet (CLAUDE.md) :
// jamais de long tiret (— U+2014, – U+2013) dans le contenu utilisateur.
//
// Stratégie de remplacement, ordonnée et idempotente. Chaque catégorie de tiret
// reçoit la ponctuation adaptée "selon lisibilité" :
//
//  R1. Tiret COLLÉ (non entouré d'espaces) -> trait d'union "-".
//      Couvre les plages ("27–29", "9h–18h", "2009–2019", "30–45"), les noms
//      composés ("Ibos–Verdun", "Occitanie–Nouvelle-Aquitaine") et les valeurs
//      "vide" des tableaux (la cellule "—" devient "-").
//
//  R2. Em-dash ESPACÉ à l'intérieur d'une valeur JSON entre guillemets ->
//      deux-points " : ". Couvre les HistoryTable ("5e — 2026" -> "5e : 2026")
//      et les libellés de devis ("TOTAL ESTIMÉ — stand 9 m²" -> " : ").
//
//  R3. Em-dash ESPACÉ restant (donc en prose / markdown) -> virgule ", ".
//      Couvre les incises ("...Français** — lauréat 2025" -> "...Français**, lauréat")
//      et les libellés de liens ("[Wikipedia IT — Fiera di Bologna]" -> ", ").
//
//  R4. En-dash ESPACÉ restant -> trait d'union espacé " - ".
//      Couvre les sous-titres de concours ("Trophée X – Sélection Grand Est"),
//      les arrêts de transport ("Pôle Sud – Alpexpo") et les plages datées
//      ("décembre 2025 – septembre 2028").
//
// Idempotent : un second passage ne trouve plus aucun tiret à traiter, donc
// aucune écriture. Le script n'UPDATE que les fiches réellement modifiées.
//
// Dry-run par défaut (aucune écriture). Ajouter --apply pour écrire en base.
//
// Usage (preview) : ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-emdash-mdx.ts
// Usage (écriture): ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-emdash-mdx.ts --apply

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Variables requises dans .env.local : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = ["salons", "sectors", "venues"] as const;

// Transformation pure et idempotente d'un contenu MDX.
function fixDashes(input: string): string {
  let out = input;

  // R1. Tiret collé (non-espace de part et d'autre) -> trait d'union.
  // Lookbehind/lookahead pour ne pas consommer les voisins (gère "a–b–c").
  out = out.replace(/(?<=\S)[—–](?=\S)/g, "-");

  // R2. Em-dash espacé DANS une valeur JSON entre guillemets -> deux-points.
  out = out.replace(/"[^"\n]*"/g, (quoted) =>
    quoted.replace(/ — /g, " : ")
  );

  // R3. Em-dash espacé restant (prose / markdown) -> virgule.
  out = out.replace(/ — /g, ", ");

  // R4. En-dash espacé restant -> trait d'union espacé.
  out = out.replace(/ – /g, " - ");

  return out;
}

type Change = {
  table: string;
  slug: string;
  name: string;
  before: number;
  after: number;
  samples: string[];
};

// Extrait quelques segments modifiés (avant -> après) pour contrôle visuel.
function diffSamples(before: string, after: string, max = 4): string[] {
  const samples: string[] = [];
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  for (let i = 0; i < beforeLines.length && samples.length < max; i++) {
    if (beforeLines[i] !== afterLines[i] && /[—–]/.test(beforeLines[i])) {
      const trim = (s: string) =>
        s.replace(/\s+/g, " ").trim().slice(0, 110);
      samples.push(`      - ${trim(beforeLines[i])}`);
      samples.push(`      + ${trim(afterLines[i])}`);
    }
  }
  return samples;
}

async function main() {
  console.log(
    APPLY
      ? "Mode ÉCRITURE (--apply) : les fiches modifiées seront mises à jour.\n"
      : "Mode DRY-RUN (aucune écriture). Ajouter --apply pour écrire.\n"
  );

  const changes: Change[] = [];

  for (const table of TABLES) {
    const { data, error } = await supabase
      .from(table)
      .select("slug, name, editorial_mdx");
    if (error || !data) {
      console.error(`  Erreur lecture ${table}: ${error?.message ?? "data null"}`);
      continue;
    }

    for (const row of data as unknown as Array<Record<string, unknown>>) {
      const mdx = row.editorial_mdx;
      if (typeof mdx !== "string" || mdx.length === 0) continue;
      const before = (mdx.match(/[—–]/g) ?? []).length;
      if (before === 0) continue;

      const fixed = fixDashes(mdx);
      if (fixed === mdx) continue; // rien à changer (déjà propre)
      const after = (fixed.match(/[—–]/g) ?? []).length;

      const slug = String(row.slug ?? "?");
      changes.push({
        table,
        slug,
        name: String(row.name ?? "?"),
        before,
        after,
        samples: diffSamples(mdx, fixed),
      });

      if (APPLY) {
        const { error: upErr } = await supabase
          .from(table)
          .update({ editorial_mdx: fixed })
          .eq("slug", slug);
        if (upErr) {
          console.error(`  ❌ UPDATE ${table}/${slug}: ${upErr.message}`);
        }
      }
    }
  }

  for (const c of changes) {
    const tail =
      c.after > 0 ? `  ⚠️ ${c.after} tiret(s) restant(s) !` : "";
    console.log(
      `\n  [${c.table}/${c.slug}] ${c.name} : ${c.before} -> ${c.after}${tail}`
    );
    for (const s of c.samples) console.log(s);
  }

  const totalBefore = changes.reduce((s, c) => s + c.before, 0);
  const totalAfter = changes.reduce((s, c) => s + c.after, 0);
  console.log(`\n────────────────────────────────────────`);
  console.log(
    `${changes.length} fiche(s) ${APPLY ? "mise(s) à jour" : "à corriger"}, ` +
      `${totalBefore} tiret(s) traité(s), ${totalAfter} restant(s).`
  );
  if (!APPLY) {
    console.log(`\nDry-run terminé. Relancer avec --apply pour écrire en base.`);
  } else if (totalAfter > 0) {
    console.log(`\n⚠️ Des tirets subsistent : vérifier les patterns non couverts.`);
  } else {
    console.log(`\n✅ Écriture terminée, aucun tiret restant.`);
  }
}

main().catch((err) => {
  console.error("❌ Erreur:", err instanceof Error ? err.message : err);
  process.exit(1);
});
