/**
 * Application automatique des handoffs roll-pret de la routine agoris-roll-2027-watch
 * (CLAUDE.md règle 13d, todo volet E4). Lancé par .github/workflows/roll-apply.yml
 * après le merge d'une PR roll-2027, ou à la main.
 *
 * Portée STRICTE : start_date, end_date, edition_year. Jamais la ville, le lieu,
 * le MDX ni le SEO : le refresh éditorial passe par le process writer + reviewers
 * (file listée par --queue).
 *
 * Chaque handoff passe les garde-fous de scripts/roll-guards.ts, puis la page
 * source_url est relue : la citation ou les dates annoncées doivent y figurer.
 * Un rejet n'est pas une erreur : il est consigné dans tasks/roll-2027/journal.json.
 *
 * Dry-run par défaut ; --apply pour écrire. Idempotent.
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/roll-apply-handoffs.ts [--apply] [--queue]
 */
import { appendFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getIndexNowKey, localizedUrls, submitIndexNow } from "../src/lib/indexnow";
import { checkHandoff, MONTHS, normalizeText, pageCarriesDates, quoteFoundInPage, type Handoff, type SalonRow } from "./roll-guards";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (.env.local en local, secrets GitHub en CI).");
  process.exit(1);
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY = process.argv.includes("--apply");
const QUEUE = process.argv.includes("--queue");
const DIR = join(process.cwd(), "tasks/roll-2027");
const JOURNAL = join(DIR, "journal.json");

type JournalEntry = {
  outcome: "applied" | "rejected";
  at: string;
  from: { start_date: string | null; end_date: string | null };
  to: { start_date: string; end_date: string; edition_year: number } | null;
  source_url: string | null;
  reasons: string[];
};
type Journal = Record<string, JournalEntry>;

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AgorisRollCheck/1.0; +https://agoris.io)", "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" },
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/**
 * File éditoriale : fiches roulées dont le texte n'a pas suivi. Critère : le bloc
 * d'ouverture du MDX ("À retenir") ne porte pas la date de début de l'édition
 * courante (jour, mois, année), ou le seo_title porte encore une autre année. Compter les mentions de l'ancienne
 * année ne marche pas : une fiche rafraîchie cite légitimement le bilan passé.
 */
async function printQueue(journal: Journal) {
  const slugs = Object.keys(journal).filter((s) => journal[s].outcome === "applied");
  if (!slugs.length) return console.log("File édito vide : aucune fiche roulée au journal.");
  const { data, error } = await sb.from("salons").select("slug,edition_year,start_date,editorial_mdx,seo_title").in("slug", slugs);
  if (error) throw new Error(error.message);
  let stale = 0;
  for (const s of data ?? []) {
    const year = String(s.edition_year);
    const reasons: string[] = [];
    const opening = new Set(normalizeText(String(s.editorial_mdx ?? "").slice(0, 700)).replace(/\b1er\b/g, "1").split(" "));
    const start = String(s.start_date);
    const dated = opening.has(start.slice(0, 4)) && opening.has(String(Number(start.slice(8, 10)))) && MONTHS[Number(start.slice(5, 7)) - 1].some((m) => opening.has(m));
    if (!dated) reasons.push(`ouverture du MDX sans la date de début (${start})`);
    const titleYears: string[] = String(s.seo_title ?? "").match(/\b20\d{2}\b/g) ?? [];
    if (titleYears.length && !titleYears.includes(year)) reasons.push(`seo_title sur ${titleYears.join(", ")}`);
    if (reasons.length) {
      stale++;
      console.log(`À REFRESH ${s.slug} : ${reasons.join(" ; ")}`);
    }
  }
  console.log(`${stale} fiche(s) à rafraîchir sur ${slugs.length} roulée(s).`);
}

async function main() {
  const journal: Journal = (() => {
    try { return JSON.parse(readFileSync(JOURNAL, "utf8")); } catch { return {}; }
  })();
  if (QUEUE) return printQueue(journal);

  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const today = new Date().toISOString().slice(0, 10);
  const handoffs: Handoff[] = readdirSync(join(DIR, "handoffs"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(DIR, "handoffs", f), "utf8")))
    .filter((h: Handoff) => h.status === "roll-pret");

  const { data, error } = await sb.from("salons").select("slug,status,start_date,end_date,city,frequency").in("slug", handoffs.map((h) => h.slug));
  if (error) throw new Error(error.message);
  const bySlug = new Map((data as SalonRow[]).map((s) => [s.slug, s]));

  const applied: string[] = [];
  const rejected: string[] = [];
  for (const h of handoffs) {
    const salon = bySlug.get(h.slug) ?? null;
    if (salon && h.next && salon.start_date === h.next.start_date && salon.end_date === h.next.end_date) {
      console.log(`DÉJÀ APPLIQUÉ ${h.slug}`);
      continue;
    }
    const reasons = checkHandoff(h, salon, today);
    if (!reasons.length) {
      const html = await fetchPage(h.source_url!);
      if (!html) reasons.push("source_url injoignable à la relecture");
      else if (!quoteFoundInPage(html, h.quote!) && !pageCarriesDates(html, h.next!)) {
        reasons.push("ni la citation ni les dates annoncées ne figurent sur source_url à la relecture (page rendue en JavaScript ou contenu modifié)");
      }
    }

    const entry: JournalEntry = {
      outcome: reasons.length ? "rejected" : "applied",
      at: today,
      from: { start_date: salon?.start_date ?? null, end_date: salon?.end_date ?? null },
      to: reasons.length || !h.next ? null : { start_date: h.next.start_date!, end_date: h.next.end_date!, edition_year: h.next.edition_year! },
      source_url: h.source_url,
      reasons,
    };

    if (reasons.length) {
      console.log(`REJET ${h.slug} : ${reasons.join(" ; ")}`);
      rejected.push(h.slug);
    } else {
      console.log(`ROLL ${h.slug} : ${salon!.start_date}/${salon!.end_date} -> ${h.next!.start_date}/${h.next!.end_date}`);
      if (APPLY) {
        // Verrou optimiste : n'écrit que si la fiche porte encore l'édition lue par le handoff.
        const { data: rows, error: upErr } = await sb
          .from("salons")
          .update({ start_date: h.next!.start_date, end_date: h.next!.end_date, edition_year: h.next!.edition_year } as never)
          .eq("slug", h.slug)
          .eq("end_date", h.current.end_date!)
          .select("slug");
        if (upErr) throw new Error(`${h.slug}: ${upErr.message}`);
        if (!rows?.length) throw new Error(`${h.slug}: aucune ligne mise à jour (verrou optimiste)`);
      }
      applied.push(h.slug);
    }
    // Un rejet inchangé garde sa date d'origine : pas de commit de journal pour rien.
    const prev = journal[h.slug];
    const sameReject = prev?.outcome === "rejected" && entry.outcome === "rejected" && prev.reasons.join("|") === reasons.join("|");
    if (APPLY && !sameReject) journal[h.slug] = entry;
  }

  if (APPLY) {
    writeFileSync(JOURNAL, JSON.stringify(journal, null, 2) + "\n");
    if (applied.length && getIndexNowKey()) {
      const res = await submitIndexNow(applied.flatMap((s) => localizedUrls(`/salons/${s}`)));
      console.log("IndexNow :", JSON.stringify(res));
    }
  }

  const summary = [
    `### Roll 2027 : ${APPLY ? "application" : "dry-run"} du ${today}`,
    `- Roulées (${applied.length}) : ${applied.join(", ") || "aucune"}`,
    `- Rejetées (${rejected.length}) : ${rejected.join(", ") || "aucune"} (motifs dans tasks/roll-2027/journal.json)`,
  ].join("\n");
  console.log("\n" + summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
