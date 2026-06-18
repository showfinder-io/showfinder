/** Cohorte 15 : vérif apply + dédup pcd-congress-paris (DELETE). --apply pour exécuter le DELETE. */
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");
const SLUGS = ["solar-solutions-international-amsterdam","playtime-paris","adf-pcd-paris","food-hotel-tech-paris","salon-bois-energie","elearning-expo-paris","sepag","cosmetagora-paris","hacking-health-strasbourg"];
async function main() {
  const { data } = await sb.from("salons").select("slug,status,editorial_mdx,edition_year,organizer_name").in("slug", SLUGS as never);
  console.log("=== Vérif apply (9 fiches) ===");
  for (const r of (data ?? []) as any[]) console.log(`${r.slug.padEnd(40)} status=${r.status} mdx=${r.editorial_mdx ? (r.editorial_mdx.length+"c") : "NULL"} ed=${r.edition_year} org=${r.organizer_name}`);
  console.log(`(${(data??[]).length}/9 trouvées, ${((data??[]) as any[]).filter(r=>r.editorial_mdx).length} avec editorial_mdx)`);
  const { data: dup } = await sb.from("salons").select("slug,id,status").eq("slug","pcd-congress-paris" as never);
  console.log("\n=== Dédup pcd-congress-paris ===");
  console.log("avant:", JSON.stringify(dup));
  if (APPLY && (dup??[]).length) {
    const { error } = await sb.from("salons").delete().eq("slug","pcd-congress-paris" as never);
    if (error) throw new Error(error.message);
    const { data: after } = await sb.from("salons").select("slug").eq("slug","pcd-congress-paris" as never);
    const { data: target } = await sb.from("salons").select("slug,editorial_mdx").eq("slug","adf-pcd-paris" as never);
    console.log("DELETE exécuté. pcd-congress restant:", (after??[]).length, "| cible adf-pcd-paris présente:", (target??[]).length, "mdx:", ((target??[])[0] as any)?.editorial_mdx?.length+"c");
  } else console.log(APPLY ? "rien à supprimer" : "(dry-run, ajouter --apply pour DELETE)");
}
main().catch((e)=>{console.error(e);process.exit(1);});
