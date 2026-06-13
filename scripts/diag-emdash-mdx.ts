// Détection des longs tirets dans le contenu éditorial MDX (audit 2026-06-13).
//
// Règle absolue du projet (CLAUDE.md) : jamais de long tiret dans le contenu
// destiné à l'utilisateur. Le remplacer par deux-points, virgule ou point.
// Origine de l'audit : cohorte 8, un reviewer a laissé passer des "9e — 2026"
// dans des HistoryTable au motif qu'ils étaient conformes au gabarit
// santexpo-paris. Ce gabarit (et probablement d'autres fiches) contient donc
// des longs tirets en base, dans la colonne editorial_mdx.
//
// Lecture seule, aucun write. Scanne editorial_mdx de salons, sectors, venues
// et liste les fiches contenant un — (U+2014, cadratin) ou – (U+2013, demi-cadratin),
// avec le contexte (slug + extrait autour de chaque occurrence).
//
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-emdash-mdx.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Variables requises dans .env.local : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Caractères ciblés : cadratin (em dash) et demi-cadratin (en dash).
const EM_DASH = "—"; // —
const EN_DASH = "–"; // –
const DASH_RE = /[—–]/g;

type TableConfig = { table: string; idField: string };

const TABLES: TableConfig[] = [
  { table: "salons", idField: "slug" },
  { table: "sectors", idField: "slug" },
  { table: "venues", idField: "slug" },
];

type Occurrence = {
  table: string;
  slug: string;
  name: string;
  emCount: number;
  enCount: number;
  contexts: string[];
};

// Extrait lisible autour de chaque tiret (40 caractères de part et d'autre),
// sur une seule ligne pour rester lisible dans la console.
function extractContexts(text: string): string[] {
  const contexts: string[] = [];
  let m: RegExpExecArray | null;
  DASH_RE.lastIndex = 0;
  while ((m = DASH_RE.exec(text)) !== null) {
    const i = m.index;
    const before = text.slice(Math.max(0, i - 40), i);
    const after = text.slice(i + 1, i + 41);
    const label = m[0] === EM_DASH ? "U+2014" : "U+2013";
    const snippet = (before + "[" + m[0] + "]" + after).replace(/\s+/g, " ").trim();
    contexts.push(`${label}  …${snippet}…`);
  }
  return contexts;
}

async function scanTable(config: TableConfig): Promise<Occurrence[]> {
  const { data, error } = await supabase
    .from(config.table)
    .select(`${config.idField}, name, editorial_mdx`);

  if (error || !data) {
    console.error(`  Erreur lecture ${config.table}: ${error?.message ?? "data null"}`);
    return [];
  }

  const occurrences: Occurrence[] = [];
  for (const row of data as unknown as Array<Record<string, unknown>>) {
    const mdx = row.editorial_mdx;
    if (typeof mdx !== "string" || mdx.length === 0) continue;
    const emCount = (mdx.match(/—/g) ?? []).length;
    const enCount = (mdx.match(/–/g) ?? []).length;
    if (emCount === 0 && enCount === 0) continue;
    occurrences.push({
      table: config.table,
      slug: String(row[config.idField] ?? "?"),
      name: String(row.name ?? "?"),
      emCount,
      enCount,
      contexts: extractContexts(mdx),
    });
  }
  return occurrences;
}

async function main() {
  const all: Occurrence[] = [];

  for (const config of TABLES) {
    console.log(`\n=== ${config.table} ===`);
    const occ = await scanTable(config);
    if (occ.length === 0) {
      console.log("  aucun long tiret");
      continue;
    }
    for (const o of occ) {
      console.log(
        `\n  [${o.slug}] ${o.name}  (— ×${o.emCount}, – ×${o.enCount})`
      );
      for (const c of o.contexts) {
        console.log(`    ${c}`);
      }
    }
    all.push(...occ);
  }

  const totalEm = all.reduce((s, o) => s + o.emCount, 0);
  const totalEn = all.reduce((s, o) => s + o.enCount, 0);
  console.log(
    `\n────────────────────────────────────────`
  );
  console.log(
    `Total : ${all.length} fiche(s) concernée(s), ${totalEm} cadratin(s) (—) + ${totalEn} demi-cadratin(s) (–)`
  );
  const byTable = all.reduce<Record<string, number>>((acc, o) => {
    acc[o.table] = (acc[o.table] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `Par table : ${Object.entries(byTable).map(([t, n]) => `${t} ${n}`).join(", ") || "aucune"}`
  );
}

main().catch((err) => {
  console.error("❌ Erreur:", err instanceof Error ? err.message : err);
  process.exit(1);
});
