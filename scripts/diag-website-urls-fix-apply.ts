// Corrige le website_url de 4 fiches publiées dont le site était injoignable
// (constat 2026-09-25, handoff/website-urls-2026-09-25.md). Chaque nouvelle URL a
// été vérifiée : HTTP 200 et nom du salon dans le <title>.
// Garde-fou : n'écrit que si la valeur actuelle est exactement l'ancienne URL.
// Dry-run par défaut ; --apply pour écrire.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-website-urls-fix-apply.ts [--apply]
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const FIXES: Record<string, [string, string]> = {
  "solutions-rh": ["https://www.salons-solutions-rh.com", "https://solutions-ressources-humaines.fr/"],
  "comic-con-france": ["https://www.comic-con-paris.com", "https://comiccon.fr/"],
  "egast-strasbourg": ["https://www.egast.com", "https://www.egast.eu/"],
  "euronaval-paris": ["https://www.euronaval.fr", "https://www.euronaval.com/"],
};
(async () => {
  for (const [slug, [from, to]] of Object.entries(FIXES)) {
    const { data, error } = await sb.from("salons").select("website_url").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (data?.website_url !== from) { console.log(`SKIP ${slug}: ${data?.website_url}`); continue; }
    console.log(`UPDATE ${slug}: ${from} → ${to}`);
    if (APPLY) { const { error: e } = await sb.from("salons").update({ website_url: to } as never).eq("slug", slug); if (e) throw e; }
  }
})();
