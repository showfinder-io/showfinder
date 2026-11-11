// Test CTR 48 : tirage traités / témoins, reproductible (tri par sha256(page + graine)),
// stratifié selon que le salon a lieu pendant la fenêtre de mesure ou après.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const SEED = "ctr-test-48-2026-10-29";
const [baseFile, dbFile, outFile] = process.argv.slice(2);
const base = JSON.parse(readFileSync(baseFile, "utf-8"));
const db = JSON.parse(readFileSync(dbFile, "utf-8"));
const salons = Object.fromEntries(db.salons.map((s) => [s.slug, s]));

const strata = { pendant: [], apres: [] };
const excluded = [];
for (const r of base) {
  const m = r.page.match(/\/(en\/)?(salons|lieux)\/([^/]+)$/);
  const page = r.page.replace(/^https:\/\/www\.agoris\.io/, "");
  if (m[2] === "lieux") { excluded.push({ page, reason: "lieu, rendu au chantier CTR prestataires et lieux" }); continue; }
  const s = salons[m[3]];
  if (s.end_date < "2026-10-29") { excluded.push({ page, reason: `édition passée (${s.end_date})` }); continue; }
  strata[s.end_date <= "2026-12-10" ? "pendant" : "apres"].push({ page, slug: m[3], locale: m[1] ? "en" : "fr", end_date: s.end_date });
}
const h = (p) => createHash("sha256").update(p + SEED).digest("hex");
const out = { seed: SEED, treated: [], control: [], excluded };
for (const [name, list] of Object.entries(strata)) {
  list.sort((a, b) => h(a.page).localeCompare(h(b.page)));
  list.forEach((x, i) => (i < Math.ceil(list.length / 2) ? out.treated : out.control).push({ ...x, stratum: name }));
}
writeFileSync(outFile, JSON.stringify(out, null, 2));
const imp = Object.fromEntries(base.map((r) => [r.page.replace(/^https:\/\/www\.agoris\.io/, ""), r]));
for (const g of ["treated", "control"]) {
  const rows = out[g].map((x) => imp[x.page]);
  const i = rows.reduce((t, r) => t + r.impressions, 0), c = rows.reduce((t, r) => t + r.clicks, 0);
  console.log(`${g}: ${rows.length} pages, ${i} impr., ${c} clics, CTR ${((c / i) * 100).toFixed(2)} %`);
  console.log("  " + out[g].map((x) => x.page).join("\n  "));
}
