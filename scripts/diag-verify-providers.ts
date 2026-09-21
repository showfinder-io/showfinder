/**
 * Vérification des prestataires transmis par Nicolas le 2026-09-20
 * (scripts/seeds/prestataires-2026-09-20.json, sources LEADS France + Prestalians).
 * Même garde-fou que la règle #13 du CLAUDE.md : site officiel en 200 + nom présent
 * dans la page (ou dans le nom de domaine). Lecture seule, aucun accès DB.
 * Sortie : scripts/output/verify-providers-2026-09-20.csv
 *   ok      : 200 + nom trouvé
 *   a-revoir: 200 mais nom introuvable (site JS, nom commercial différent...)
 *   ko      : pas de site, erreur réseau ou statut != 200
 */
import { readFileSync, writeFileSync } from "node:fs";

type Row = { slug: string; company_name: string; website_url: string | null };

const rows: Row[] = JSON.parse(
  readFileSync("scripts/seeds/prestataires-2026-09-20.json", "utf-8")
);

const compact = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

async function check(row: Row) {
  if (!row.website_url) return { verdict: "ko", status: "", detail: "pas de site web" };
  try {
    const res = await fetch(row.website_url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
      },
    });
    if (res.status !== 200)
      return { verdict: "ko", status: String(res.status), detail: res.url };
    const html = compact(await res.text());
    const name = compact(row.company_name);
    const host = compact(new URL(res.url).hostname);
    const found = name.length >= 2 && (html.includes(name) || host.includes(name));
    return {
      verdict: found ? "ok" : "a-revoir",
      status: "200",
      detail: found ? res.url : `nom "${row.company_name}" introuvable sur ${res.url}`,
    };
  } catch (e) {
    return { verdict: "ko", status: "", detail: (e as Error).message };
  }
}

(async () => {
  const out = ["slug;company_name;website_url;verdict;status;detail"];
  const counts: Record<string, number> = {};
  // Lots de 8 pour ne pas saturer le réseau
  for (let i = 0; i < rows.length; i += 8) {
    const batch = rows.slice(i, i + 8);
    const results = await Promise.all(batch.map(check));
    results.forEach((r, j) => {
      const row = batch[j];
      counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
      if (r.verdict !== "ok") console.log(`  ${r.verdict.padEnd(8)} ${row.slug}: ${r.status} ${r.detail}`);
      out.push(
        [row.slug, row.company_name, row.website_url ?? "", r.verdict, r.status, r.detail.replace(/;/g, ",")].join(";")
      );
    });
  }
  writeFileSync("scripts/output/verify-providers-2026-09-20.csv", out.join("\n") + "\n");
  console.log(counts);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
