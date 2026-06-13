/**
 * Backfill du champ salons.category par classification LLM (chantier catégorie
 * 2026-06-13). 4 valeurs : salon_professionnel / salon_grand_public / congres /
 * autres. category_to_confirm=true quand le modèle n'est pas sûr (review admin).
 *
 * Dry-run par défaut (affiche la distribution). --apply pour écrire.
 * N'écrase PAS une catégorie déjà posée à la main (skip si category non null),
 * sauf --force.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-backfill-categories.ts [--apply] [--force]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error("ANTHROPIC_API_KEY manquant"); process.exit(1); }
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const CATS = ["salon_professionnel", "salon_grand_public", "congres", "autres"];

const PROMPT = `Tu classes des salons et événements professionnels français dans une de ces 4 catégories :
- "salon_professionnel" : salon B2B réservé/orienté aux professionnels d'une filière (exposants et visiteurs pros). C'est la catégorie par défaut d'un annuaire de salons pros.
- "salon_grand_public" : ouvert au grand public (foires, salons habitat/déco/maison, tourisme/vacances, auto, chocolat, jeux vidéo grand public, etc.).
- "congres" : congrès scientifique, médical ou savant, structuré autour de sessions/communications (souvent avec une exposition adossée). Ex : congrès de radiologie, d'anesthésie, dentaire.
- "autres" : ne rentre clairement dans aucune des trois.

Pour CHAQUE entrée, réponds avec la catégorie la plus probable et un booléen "confident" (false si le nom/description ne permet pas de trancher nettement).
Réponds UNIQUEMENT par un tableau JSON : [{"slug":"...","category":"...","confident":true|false}]. Aucune autre sortie.

Entrées :
`;

async function classify(batch: { slug: string; name: string; description: string | null }[]) {
  const payload = batch.map((s) => ({ slug: s.slug, name: s.name, description: (s.description ?? "").slice(0, 280) }));
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": KEY!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: PROMPT + JSON.stringify(payload, null, 0) }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("réponse non parsable: " + text.slice(0, 200));
  return JSON.parse(m[0]) as { slug: string; category: string; confident: boolean }[];
}

async function main() {
  const { data, error } = await sb.from("salons").select("slug,name,description,category").eq("status", "published");
  if (error) throw error;
  let rows = data ?? [];
  if (!FORCE) rows = rows.filter((r) => r.category == null);
  console.log(`${(data ?? []).length} fiches publiées, ${rows.length} à classer${FORCE ? " (force)" : " (category null)"}`);

  const results: { slug: string; category: string; confident: boolean }[] = [];
  const SIZE = 40;
  for (let i = 0; i < rows.length; i += SIZE) {
    const batch = rows.slice(i, i + SIZE);
    const r = await classify(batch);
    results.push(...r);
    console.log(`  batch ${i / SIZE + 1}: ${r.length} classés`);
  }

  // Validation + distribution
  const dist: Record<string, number> = {};
  let toConfirm = 0;
  const invalid: string[] = [];
  for (const r of results) {
    if (!CATS.includes(r.category)) { invalid.push(`${r.slug}:${r.category}`); continue; }
    dist[r.category] = (dist[r.category] ?? 0) + 1;
    if (!r.confident) toConfirm++;
  }
  console.log("\nDistribution :", JSON.stringify(dist));
  console.log(`À confirmer (category_to_confirm=true) : ${toConfirm}`);
  if (invalid.length) console.log("Catégories invalides (ignorées) :", invalid.join(", "));
  console.log("\nGrand public proposés :", results.filter((r) => r.category === "salon_grand_public").map((r) => r.slug).join(", "));
  console.log("\nCongrès proposés :", results.filter((r) => r.category === "congres").map((r) => r.slug).join(", "));

  if (!APPLY) { console.log("\n=== DRY-RUN (ajouter --apply) ==="); return; }

  let n = 0;
  for (const r of results) {
    if (!CATS.includes(r.category)) continue;
    const { error: e } = await sb.from("salons")
      .update({ category: r.category as never, category_to_confirm: !r.confident } as never)
      .eq("slug", r.slug);
    if (e) throw new Error(`${r.slug}: ${e.message}`);
    n++;
  }
  console.log(`\n=== ${n} fiches mises à jour ===`);
}

main().catch((e) => { console.error(e); process.exit(1); });
