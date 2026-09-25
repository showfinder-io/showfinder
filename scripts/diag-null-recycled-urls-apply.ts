// Retire les website_url de 3 fiches draft dont le domaine mort a été recyclé en
// site de casino (constat 2026-09-25, scripts/diag-website-url-recycled.ts).
// Garde-fou : n'écrit que si la valeur actuelle est exactement celle constatée.
// Dry-run par défaut ; --apply pour écrire.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-null-recycled-urls-apply.ts [--apply]
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const TARGETS: Record<string, string> = {
  "mdd-expo-paris": "https://www.mdd-expo.com",
  "fatex-paris": "https://www.fatex.fr",
  "innorobo-paris-2026": "https://www.innorobo.com",
};
(async () => {
  for (const [slug, url] of Object.entries(TARGETS)) {
    const { data, error } = await sb.from("salons").select("status,website_url").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data || data.website_url !== url || data.status !== "draft") { console.log(`SKIP ${slug}: ${JSON.stringify(data)}`); continue; }
    console.log(`NULL ${slug} (${url})`);
    if (APPLY) {
      const { error: e } = await sb.from("salons").update({ website_url: null } as never).eq("slug", slug);
      if (e) throw e;
    }
  }
})();
