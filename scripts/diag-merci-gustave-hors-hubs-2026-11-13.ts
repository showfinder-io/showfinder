/**
 * merci-gustave sorti des hubs standistes (décision Julien du 2026-11-13), même traitement que
 * pico-international-paris (point tranché 2 de tasks/relecture-agent-prestataires-2026-11-12.md).
 * Relecture : tasks/relecture-standistes-vague1/merci-gustave.md. Siège légal Merci Gustave Inc,
 * Laval (Québec), aucune entité française active au registre : la fiche ne peut pas compter parmi
 * les standistes « dont le siège est en France ».
 *  - category standiste -> autre (les hubs filtrent sur la catégorie) ;
 *  - email gustave@mercigustave.co (absent du site) -> contact@mercigustave.co (mentions légales).
 * La fiche reste en noindex. Dry-run par défaut, --apply pour écrire. Verrou sur les valeurs d'origine.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const CHANGES = {
  category: { from: "standiste", to: "autre" },
  email: { from: "gustave@mercigustave.co", to: "contact@mercigustave.co" },
};

async function main() {
  const { data: row, error } = await sb.from("providers").select("id,category,email,seo_indexable").eq("slug", "merci-gustave").single();
  if (error) throw error;
  const r = row as Record<string, unknown>;
  if (r.seo_indexable) throw new Error("fiche indexable : inattendu");
  const patch: Record<string, string> = {};
  for (const [k, { from, to }] of Object.entries(CHANGES)) {
    if (r[k] === to) continue;
    if (r[k] !== from) throw new Error(`verrou : ${k} = ${r[k]}, attendu ${from}`);
    patch[k] = to;
    console.log(`${k} : ${from} -> ${to}`);
  }
  if (!Object.keys(patch).length) return console.log("déjà appliqué");
  if (!APPLY) return console.log("DRY-RUN");
  const { error: e } = await sb.from("providers").update(patch as never).eq("id", r.id as string);
  if (e) throw e;
  console.log("ÉCRIT");
}

main().catch((e) => { console.error(e); process.exit(1); });
