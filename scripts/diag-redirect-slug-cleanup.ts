// Cleanup cohérence slugs / redirects : fiches publiées shadowées par un
// 301 de next.config.ts (audit 2026-06-11 soir, suite du cleanup Villepinte).
// Détection : scripts/diag-redirect-coherence.ts. Détail des décisions et
// sources officielles : tasks/todo.md section "Cohérence slugs / redirects".
//
// Corrections appliquées (idempotent, relançable sans effet de bord) :
// 1. sia-paris-2026 -> sia-paris-2027 : la fiche porte l'édition 2027
//    (27/02-07/03/2027, salon-agriculture.com). Redirect inversé dans
//    next.config.ts (l'ancien sia-paris-2027 -> sia-paris-2026 est retiré).
// 2. solutions-rh-paris-2026 -> solutions-rh-paris-2027 : même salon que
//    solutions-rh-2026 (Infopromotions), la fiche porte l'édition 2027
//    (9-10/06/2027, solutions-ressources-humaines.fr). Précédent jec-world.
// 3. who-s-next-paris-2026 : édition janvier 2026 passée, shadowée -> draft
//    (précédent maison-et-objet) + dates corrigées 17-19/01/2026
//    (wsn-events.com, la base disait 24-26/01 à tort).
// 4. innorobo-paris-2026 -> draft : salon autonome disparu (dernière édition
//    2018) ; seul "Innorobo by SIDO" existe (16-17/09/2026, sido-lyon.com).
// 5. sandwich-and-snack-show-2026 -> draft : rebrandé "Snack Show"
//    (sandwichshows.com 301 vers snackshow.com), doublon de marque.
// 6. solscope-lyon-2026 -> draft : pas d'édition 2026, salon biennal années
//    impaires (solscope.fr).
// 7. autonomy-paris-2026 -> draft : salon disparu (rebrandé Global
//    Decarbonization Expo, jamais tenu).
// 8. in-cosmetics-global-paris-2026 -> draft : l'édition 2027 est à
//    Barcelone (in-cosmetics.com), la fiche "Paris 2027" est fausse.
// 9. cfia-toulouse-2026 : end_date 23 -> 24/09/2026 (toulouse.cfiaexpo.com).
//    Le redirect erroné vers cfia-rennes-2027 est retiré de next.config.ts
//    (CFIA Toulouse est un salon distinct, biennal années paires).
// 10. heavent-cannes-2026 : dates 30-31/03/2027 -> 3-4/03/2027
//    (heavent-one-to-one-meetings.fr).
//
// Usage : npm exec -- tsx --env-file=.env.local scripts/diag-redirect-slug-cleanup.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Variables requises dans .env.local : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBySlug(
  slug: string,
  patch: Record<string, unknown>,
  onlyIf: Record<string, unknown>
): Promise<number> {
  let query = supabase.from("salons").update(patch).eq("slug", slug);
  for (const [key, value] of Object.entries(onlyIf)) {
    query = query.eq(key, value as never);
  }
  const { data, error } = await query.select("slug");
  if (error) throw new Error(`${slug} : ${error.message}`);
  return data?.length ?? 0;
}

type Step = { label: string; run: () => Promise<number> };

const steps: Step[] = [
  {
    label: "1. sia-paris-2026 -> sia-paris-2027 (édition 2027 confirmée)",
    run: () =>
      updateBySlug(
        "sia-paris-2026",
        { slug: "sia-paris-2027" },
        { edition_year: 2027 }
      ),
  },
  {
    label:
      "2. solutions-rh-paris-2026 -> solutions-rh-paris-2027 (édition 2027 confirmée)",
    run: () =>
      updateBySlug(
        "solutions-rh-paris-2026",
        { slug: "solutions-rh-paris-2027" },
        { edition_year: 2027 }
      ),
  },
  {
    label:
      "3. who-s-next-paris-2026 (édition janvier passée, shadowée) -> draft + dates 17-19/01",
    run: () =>
      updateBySlug(
        "who-s-next-paris-2026",
        { status: "draft", start_date: "2026-01-17", end_date: "2026-01-19" },
        { status: "published" }
      ),
  },
  {
    label: "4. innorobo-paris-2026 (salon disparu) -> draft",
    run: () =>
      updateBySlug(
        "innorobo-paris-2026",
        { status: "draft" },
        { status: "published" }
      ),
  },
  {
    label: "5. sandwich-and-snack-show-2026 (doublon de marque Snack Show) -> draft",
    run: () =>
      updateBySlug(
        "sandwich-and-snack-show-2026",
        { status: "draft" },
        { status: "published" }
      ),
  },
  {
    label: "6. solscope-lyon-2026 (pas d'édition 2026, biennal impair) -> draft",
    run: () =>
      updateBySlug(
        "solscope-lyon-2026",
        { status: "draft" },
        { status: "published" }
      ),
  },
  {
    label: "7. autonomy-paris-2026 (salon disparu) -> draft",
    run: () =>
      updateBySlug(
        "autonomy-paris-2026",
        { status: "draft" },
        { status: "published" }
      ),
  },
  {
    label:
      "8. in-cosmetics-global-paris-2026 (édition 2027 à Barcelone) -> draft",
    run: () =>
      updateBySlug(
        "in-cosmetics-global-paris-2026",
        { status: "draft" },
        { status: "published" }
      ),
  },
  {
    label: "9. cfia-toulouse-2026 : end_date 2026-09-23 -> 2026-09-24",
    run: () =>
      updateBySlug(
        "cfia-toulouse-2026",
        { end_date: "2026-09-24" },
        { end_date: "2026-09-23" }
      ),
  },
  {
    label: "10. heavent-cannes-2026 : dates -> 3-4/03/2027",
    run: () =>
      updateBySlug(
        "heavent-cannes-2026",
        { start_date: "2027-03-03", end_date: "2027-03-04" },
        { start_date: "2027-03-30" }
      ),
  },
];

async function main() {
  let total = 0;
  for (const step of steps) {
    const updated = await step.run();
    total += updated;
    console.log(`${step.label} : ${updated} ligne(s)`);
  }
  console.log(`\nTotal : ${total} ligne(s) modifiée(s).`);

  // Contrôle final : statut des fiches touchées
  const { data } = await supabase
    .from("salons")
    .select("slug, status, start_date, end_date")
    .in("slug", [
      "sia-paris-2027",
      "solutions-rh-paris-2027",
      "who-s-next-paris-2026",
      "innorobo-paris-2026",
      "sandwich-and-snack-show-2026",
      "solscope-lyon-2026",
      "autonomy-paris-2026",
      "in-cosmetics-global-paris-2026",
      "cfia-toulouse-2026",
      "heavent-cannes-2026",
    ])
    .order("slug");
  for (const s of data ?? []) {
    console.log(
      `  ${s.slug} : ${s.status}, ${s.start_date} -> ${s.end_date}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
