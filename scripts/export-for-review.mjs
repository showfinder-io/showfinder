/**
 * Exporte des fiches MDX en .md "review-friendly" pour annotation Nicolas :
 * - retire le frontmatter
 * - convertit <HistoryTable .../> et <BudgetTable .../> en tableaux markdown
 * - convertit <DataMissing /> en texte
 * - préfixe d'un titre H1 lisible
 *
 * Usage : tsx scripts/export-for-review.mjs <outDir> <slug:Titre> [<slug:Titre> ...]
 */
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const outDir = args[0];
const specs = args.slice(1).map((a) => {
  const i = a.indexOf(":");
  return { slug: a.slice(0, i), title: a.slice(i + 1) };
});

fs.mkdirSync(outDir, { recursive: true });

function tableFromComponent(block) {
  const colsM = block.match(/columns=\{(\[[\s\S]*?\])\}/);
  const rowsM = block.match(/rows=\{(\[[\s\S]*?\])\}/);
  const srcM = block.match(/sources=\{?"([^"]*)"/);
  const warnM = block.match(/warning=\{?"([^"]*)"/);
  const footM = block.match(/footer=\{?"([^"]*)"/);
  if (!rowsM) return block;

  let out = "";
  if (warnM) out += `> ${warnM[1]}\n\n`;

  // BudgetTable : pas de columns, structure poste/low/high
  if (!colsM) {
    const rows = JSON.parse(rowsM[1]);
    const totalsM = block.match(/totals=\{(\[[\s\S]*?\])\}/);
    out += `| Poste | Fourchette basse | Fourchette haute |\n| --- | --- | --- |\n`;
    for (const r of rows) out += `| ${r.poste} | ${r.low} | ${r.high} |\n`;
    if (totalsM) for (const t of JSON.parse(totalsM[1])) out += `| **${t.label}** | **${t.low}** | **${t.high}** |\n`;
    if (footM) out += `\n*${footM[1]}*\n`;
    return out;
  }

  const cols = JSON.parse(colsM[1]);
  const rows = JSON.parse(rowsM[1]);
  out += `| ${cols.map((c) => c.label).join(" | ")} |\n`;
  out += `| ${cols.map(() => "---").join(" | ")} |\n`;
  for (const r of rows) {
    out += `| ${cols.map((c) => r[c.key] ?? "").join(" | ")} |\n`;
  }
  if (srcM) out += `\n*Sources : ${srcM[1]}*\n`;
  return out;
}

for (const { slug, title } of specs) {
  const src = path.join("content/salons", `${slug}.mdx`);
  if (!fs.existsSync(src)) {
    console.error(`SKIP ${slug} (introuvable)`);
    continue;
  }
  let body = fs.readFileSync(src, "utf-8").replace(/^---\n[\s\S]*?\n---\n/, "");
  // Composants → markdown
  body = body.replace(/<(HistoryTable|BudgetTable)[\s\S]*?\/>/g, (m) =>
    tableFromComponent(m)
  );
  body = body.replace(/<DataMissing\s*\/>/g, "_Donnée non disponible._");
  const md = `# ${title}\n\n_Fiche générée Agoris (non encore relue) — à annoter._\n\n${body.trim()}\n`;
  const out = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(out, md, "utf-8");
  console.log(`ok ${out}`);
}
