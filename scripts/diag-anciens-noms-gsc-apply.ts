/**
 * Passe "anciens noms" (2026-08-04) : 4 fiches ne captent pas les requêtes GSC
 * qui nomment l'ancien nom ou la marque historique du même événement (audit
 * baseline 2026-07-28, audits/gsc-baseline-2026-07-28/queries.csv) :
 *
 * - terres-de-jim : "concours de labour national 2026", "finale nationale de
 *   labour 2026" (16 impressions cumulées). Le MDX parle de la Finale Nationale
 *   de Labour mais jamais de "concours de labour", et la fiche n'a aucun
 *   seo_title/seo_description.
 * - santexpo-paris : "geront expo (paris)" (8 impressions). Le MDX cite
 *   "GerontHandicapExpo" collé, jamais le nom historique FHF "Géront
 *   Expo-Handicap Expo" (source : fhf.fr, weka.fr).
 * - sirha-bake-snack : "salon europain" (1 impression). "ex-Europain" est déjà
 *   dans description + MDX mais la fiche n'a aucun seo_title/seo_description.
 * - je-m-export-paris : "salon des entrepreneurs" (1 impression). Metas sans
 *   mention de l'ancien nom. Le slug est en outre une erreur de données (le
 *   salon est Go Entrepreneurs, ex-Salon des Entrepreneurs ; aucun événement
 *   "Je m'Exporte" n'existe, cf. MDX de la fiche) : renommé
 *   go-entrepreneurs-paris, avec 301 ajouté dans next.config.ts et destination
 *   corrigée dans redirects-slug-year.json (pas de chaîne de 301).
 *
 * Tous les faits ajoutés proviennent des MDX existants (process writer + 2
 * reviewers) ou de sources primaires citées ci-dessus. Garde-fous : verrou sur
 * les dates (fiche rollée => skip) ; "set" n'écrase jamais une valeur
 * existante différente ; "replace" exige la sous-chaîne exacte et détecte une
 * passe déjà appliquée. Dry-run par défaut ; --apply pour écrire. Idempotent.
 *
 * Usage : set -a && source .env.local && set +a && ./node_modules/.bin/tsx scripts/diag-anciens-noms-gsc-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

type Op =
  | { field: string; kind: "set"; value: string }
  | { field: string; kind: "replace"; from: string; to: string };

type Fiche = {
  start: string;
  end: string;
  /** Renommage de slug : appliqué en dernier, lookup fallback pour l'idempotence */
  renameTo?: string;
  ops: Op[];
};

const FICHES: Record<string, Fiche> = {
  "terres-de-jim": {
    start: "2026-09-11", end: "2026-09-13",
    ops: [
      {
        field: "seo_title", kind: "set",
        value: "Terres de Jim 2026 Metz : dates, Finale Nationale de Labour",
      },
      {
        field: "seo_description", kind: "set",
        value: "Les Terres de Jim 2026, du 11 au 13 septembre à Metz-Magny (Moselle), avec la Finale Nationale de Labour, le concours national de labour des Jeunes Agriculteurs. Entrée gratuite.",
      },
      {
        field: "description", kind: "replace",
        from: "démonstrations agricoles, culture et spectacles.",
        to: "démonstrations agricoles, culture et spectacles. Accueille la Finale Nationale de Labour, le concours national de labour.",
      },
      {
        field: "description_en", kind: "replace",
        from: "farming demonstrations, culture and live entertainment.",
        to: "farming demonstrations, culture and live entertainment. Hosts the Finale Nationale de Labour, France's national ploughing final.",
      },
      {
        field: "editorial_mdx", kind: "replace",
        from: "La **Finale Nationale de Labour** reste le cœur historique de l'événement",
        to: "La **Finale Nationale de Labour** (le concours de labour national) reste le cœur historique de l'événement",
      },
    ],
  },
  "santexpo-paris": {
    start: "2027-05-25", end: "2027-05-27",
    ops: [
      {
        field: "seo_description", kind: "replace",
        from: "HopitalExpo, GerontHandicapExpo, HIT réunis.",
        to: "HopitalExpo, GerontHandicapExpo (ex-Géront Expo), HIT réunis.",
      },
      {
        field: "seo_description_en", kind: "replace",
        from: "HopitalExpo, GerontHandicapExpo and HIT brought together.",
        to: "HopitalExpo, GerontHandicapExpo (formerly Géront Expo) and HIT brought together.",
      },
      {
        field: "editorial_mdx", kind: "replace",
        from: "**GerontHandicapExpo** (médico-social, grand âge, handicap, 1987)",
        to: "**GerontHandicapExpo**, ex-Géront Expo-Handicap Expo (médico-social, grand âge, handicap, 1987)",
      },
      {
        field: "editorial_mdx_en", kind: "replace",
        from: "**GerontHandicapExpo** (social care, ageing, disability, 1987)",
        to: "**GerontHandicapExpo**, formerly Géront Expo-Handicap Expo (social care, ageing, disability, 1987)",
      },
    ],
  },
  "sirha-bake-snack": {
    start: "2028-01-16", end: "2028-01-19",
    ops: [
      {
        field: "seo_title", kind: "set",
        value: "Sirha Bake & Snack 2028 (ex-Europain) : dates, infos, Paris",
      },
      {
        field: "seo_description", kind: "set",
        value: "Sirha Bake & Snack 2028, le salon boulangerie-pâtisserie-snacking anciennement Europain, du 16 au 19 janvier à Paris Expo Porte de Versailles. 534 exposants, 35 500 visiteurs en 2026.",
      },
    ],
  },
  "je-m-export-paris": {
    start: "2027-04-28", end: "2027-04-29",
    renameTo: "go-entrepreneurs-paris",
    ops: [
      {
        field: "seo_title", kind: "replace",
        from: "Go Entrepreneurs Paris 2027 : dates (28-29 avril), infos, accès",
        to: "Go Entrepreneurs Paris 2027 (ex-Salon des Entrepreneurs) : dates",
      },
      {
        field: "seo_description", kind: "replace",
        from: "Go Entrepreneurs 2027, le salon",
        to: "Go Entrepreneurs 2027 (ex-Salon des Entrepreneurs), le salon",
      },
      {
        field: "description", kind: "replace",
        from: "Le salon de l'entrepreneuriat et de la création d'entreprise.",
        to: "Le salon de l'entrepreneuriat et de la création d'entreprise, ex-Salon des Entrepreneurs (rebaptisé Go Entrepreneurs en 2021).",
      },
      {
        field: "description_en", kind: "replace",
        from: "The trade show for entrepreneurship and business creation.",
        to: "The trade show for entrepreneurship and business creation, formerly Salon des Entrepreneurs (renamed Go Entrepreneurs in 2021).",
      },
      // Nettoyage : la mention du slug interne n'a rien à faire dans un texte
      // public, et devient fausse après le renommage.
      {
        field: "editorial_mdx", kind: "replace",
        from: "(Nanterre, 92). Le slug historique « je-m-export-paris-2026 » est obsolète : ce salon est l'ex-**Salon des Entrepreneurs** (créé en 1993), rebaptisé **GO Entrepreneurs** en 2021. Aucune trace d'un événement actif « Je m'Exporte » rattaché à cette marque en 2026-2027.",
        to: "(Nanterre, 92). Ce salon est l'ex-**Salon des Entrepreneurs** (créé en 1993), rebaptisé **GO Entrepreneurs** en 2021.",
      },
      {
        field: "editorial_mdx_en", kind: "replace",
        from: '(Nanterre, 92). The legacy slug "je-m-export-paris-2026" is obsolete: this trade show is the former **Salon des Entrepreneurs** (created in 1993), renamed **GO Entrepreneurs** in 2021. There is no trace of an active "Je m\'Exporte" event attached to this brand in 2026-2027.',
        to: "(Nanterre, 92). This trade show is the former **Salon des Entrepreneurs** (created in 1993), renamed **GO Entrepreneurs** in 2021.",
      },
    ],
  },
};

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  let fields = 0, skips = 0;

  for (const [slug, fiche] of Object.entries(FICHES)) {
    // Lookup avec fallback sur le slug renommé (idempotence post-rename)
    let { data: row, error } = await sb.from("salons").select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`${slug}: ${error.message}`);
    if (!row && fiche.renameTo) {
      ({ data: row, error } = await sb.from("salons").select("*").eq("slug", fiche.renameTo).maybeSingle());
      if (error) throw new Error(`${fiche.renameTo}: ${error.message}`);
    }
    if (!row) { console.log(`SKIP ${slug}: fiche introuvable`); skips++; continue; }

    const r = row as unknown as Record<string, string | null>;
    if (r.start_date !== fiche.start || r.end_date !== fiche.end) {
      console.log(`SKIP ${slug}: dates DB (${r.start_date} → ${r.end_date}) != verrou (${fiche.start} → ${fiche.end}), fiche rollée`);
      skips++; continue;
    }

    const patch: Record<string, string> = {};
    for (const op of fiche.ops) {
      const cur = r[op.field];
      if (op.kind === "set") {
        if (cur && cur !== op.value) {
          console.log(`SKIP ${slug}.${op.field}: valeur existante différente, pas d'écrasement ("${cur.slice(0, 60)}")`);
          skips++; continue;
        }
        if (cur === op.value) continue; // déjà appliqué
        patch[op.field] = op.value;
      } else {
        if (cur == null) { console.log(`SKIP ${slug}.${op.field}: champ vide`); skips++; continue; }
        if (cur.includes(op.to)) continue; // déjà appliqué
        if (!cur.includes(op.from)) {
          console.log(`SKIP ${slug}.${op.field}: sous-chaîne introuvable ("${op.from.slice(0, 60)}…")`);
          skips++; continue;
        }
        patch[op.field] = cur.replace(op.from, op.to);
      }
    }

    if (fiche.renameTo && r.slug === slug) {
      const { data: clash } = await sb.from("salons").select("slug").eq("slug", fiche.renameTo).maybeSingle();
      if (clash) { console.log(`SKIP rename ${slug}: le slug ${fiche.renameTo} existe déjà`); skips++; }
      else patch.slug = fiche.renameTo;
    }

    const keys = Object.keys(patch);
    if (!keys.length) { console.log(`OK ${slug}: rien à faire (déjà appliqué)`); continue; }
    console.log(`UPDATE ${r.slug}: ${keys.join(", ")}${patch.slug ? ` (slug → ${patch.slug})` : ""}`);
    if (APPLY) {
      const { error: upErr } = await sb.from("salons").update(patch as never).eq("id", r.id as string);
      if (upErr) throw new Error(`${slug}: ${upErr.message}`);
    }
    fields += keys.length;
  }

  console.log(`\n${APPLY ? "APPLIQUÉ" : "DRY-RUN"} : ${fields} champs modifiés, ${skips} skips`);
}

main().catch((e) => { console.error(e); process.exit(1); });
