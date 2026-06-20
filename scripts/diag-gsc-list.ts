/**
 * Génère tasks/gsc-request-indexing-2026-06-13.md : liste des salons + lieux
 * indexables modifiés aujourd'hui, priorisée et découpée en paquets de 10/jour
 * pour le Request Indexing GSC manuel. Lecture seule (écrit juste le .md).
 */
import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

(async () => {
  const today = "2026-06-19";
  // Tous les salons indexables : la migration slugs sans année (today) a changé
  // TOUTES les URLs, donc Google doit recrawler l'ensemble.
  const { data: sal } = await sb.from("salons")
    .select("slug,start_date,estimated_visitors")
    .eq("status", "published").not("editorial_mdx", "is", null);
  // Tous les lieux riches (indexables). Pas de trigger updated_at sur venues.
  const { data: ven } = await sb.from("venues").select("slug,description,address,total_surface_sqm");
  const venRich = (ven ?? []).filter((v: { description: string | null; address: string | null; total_surface_sqm: number | null }) =>
    (v.description ?? "").trim().length >= 80 && (v.address ?? "").trim() !== "" && (v.total_surface_sqm ?? 0) > 0);
  type S = { slug: string; start_date: string | null; estimated_visitors: number | null };
  const rows = (sal ?? []) as S[];
  const up = rows.filter((s) => s.start_date && s.start_date >= today).sort((a, b) => (a.start_date as string).localeCompare(b.start_date as string));
  const past = rows.filter((s) => !s.start_date || s.start_date < today).sort((a, b) => (b.estimated_visitors ?? 0) - (a.estimated_visitors ?? 0));
  const salUrls = [...up, ...past].map((s) => `https://www.agoris.io/salons/${s.slug}`);
  const venUrls = venRich.map((v: { slug: string }) => `https://www.agoris.io/lieux/${v.slug}`);
  const all = [...salUrls, ...venUrls];

  const lines = [
    "# Request Indexing GSC - referencements du 2026-06-19", "",
    `Total : ${all.length} URLs (${salUrls.length} salons + ${venUrls.length} lieux). Quota GSC ~10/jour.`,
    "Priorite : salons a venir d'abord (par date), puis passes (par visiteurs), puis lieux.",
    "Contexte : cohorte 17 publiee (4 fiches) - annuaire boucle, 100% des fiches publiees enrichies.",
    "Pousser en priorite les 4 fiches cohorte 17 (all4customer, open-energies, medi-nov, reeduca). Depuis le haut.", "",
  ];
  const start = new Date("2026-06-20T00:00:00Z");
  const jours = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  for (let i = 0; i < all.length; i += 10) {
    const d = new Date(start.getTime() + (i / 10) * 86400000);
    lines.push(`## Jour ${i / 10 + 1} (${jours[d.getUTCDay()]} ${d.toISOString().split("T")[0]})`);
    all.slice(i, i + 10).forEach((u, j) => lines.push(`${i + j + 1}. ${u}`));
    lines.push("");
  }
  writeFileSync("tasks/gsc-request-indexing-2026-06-19.md", lines.join("\n"));
  console.log(`OK : ${all.length} URLs (${salUrls.length} salons + ${venUrls.length} lieux), ${Math.ceil(all.length / 10)} jours.`);
})().catch((e) => { console.error(e); process.exit(1); });
