// Cohorte P2 shortlist 2 (2026-09-25) : liste des liens internes autorisés pour les writers.
// Salons publiés, lieux (slug, nom, ville), secteurs. Lecture seule.
// Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-cohorte-p2-export-slugs.ts
import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
(async () => {
  const [s, v, sec] = await Promise.all([
    sb.from("salons").select("slug,name,city").eq("status", "published"),
    sb.from("venues").select("slug,name,city"),
    sb.from("sectors").select("slug,name"),
  ]);
  for (const r of [s, v, sec]) if (r.error) throw r.error;
  const fmt = (rows: Record<string, string>[]) => rows.map((r) => Object.values(r).join(" | ")).sort();
  writeFileSync("handoff/cohorte-trafic/published-slugs-2026-09-25.json", JSON.stringify({
    salons_publies: fmt(s.data as never), lieux: fmt(v.data as never), secteurs_valides: fmt(sec.data as never),
  }, null, 2));
  console.log(`${s.data!.length} salons, ${v.data!.length} lieux, ${sec.data!.length} secteurs`);
})();
