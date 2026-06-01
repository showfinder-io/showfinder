// V5.6 — One-shot : importer les ~113 MDX content/salons/*.mdx en DB
// dans la colonne editorial_mdx (+ editorial_updated_at depuis frontmatter).
//
// Substitutions appliquees a l'import :
//  - "## L'essentiel à retenir" → "## À retenir" (decision user : evite la
//    repetition avec la section "L'essentiel" du chapeau page salon).
//
// Le script est idempotent (UPDATE WHERE slug = ...). Apres validation,
// les fichiers MDX peuvent etre supprimes du repo.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const SALONS_DIR = path.join(process.cwd(), "content/salons");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/** Substitutions de normalisation appliquees au MDX a l'import. */
function normalizeMdx(content: string): string {
  return content
    // Decision user 2026-06-01 : eviter la repetition "L'essentiel" (chapeau)
    // / "L'essentiel a retenir" (1er bloc MDX). Renomme en "A retenir".
    .replace(/^## L'essentiel à retenir/gm, "## À retenir")
    .replace(/^## L'essentiel à retenir/gim, "## À retenir");
}

async function main() {
  if (!fs.existsSync(SALONS_DIR)) {
    console.error(`SALONS_DIR introuvable: ${SALONS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SALONS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  console.log(`Trouvé ${files.length} fichiers MDX a importer.\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filepath = path.join(SALONS_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const parsed = matter(raw);

    const editorial_mdx = normalizeMdx(parsed.content.trim());
    const updated_raw = parsed.data?.updated as string | undefined;
    const editorial_updated_at = updated_raw
      ? new Date(updated_raw).toISOString()
      : new Date().toISOString();

    const { data: existing } = await supabase
      .from("salons")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      console.log(`  ⚠️  ${slug} : pas de salon en DB (skipped)`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from("salons")
      .update({
        editorial_mdx,
        editorial_updated_at,
      } as never)
      .eq("id", existing.id);

    if (error) {
      console.log(`  ❌ ${slug} : ${error.message}`);
      errors++;
    } else {
      console.log(`  ✓ ${slug} (${editorial_mdx.length} chars)`);
      imported++;
    }
  }

  console.log("\n=== RAPPORT ===");
  console.log(`  Importés : ${imported}`);
  console.log(`  Skippés (pas en DB) : ${skipped}`);
  console.log(`  Erreurs : ${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
