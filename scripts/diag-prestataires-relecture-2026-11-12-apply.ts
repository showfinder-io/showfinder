/**
 * Corrections issues de la relecture agent des fiches prestataires du 2026-11-12
 * (tasks/relecture-agent-prestataires-2026-11-12.md, en remplacement de la relecture
 * Nicolas, todo G14 ; décision Julien du 2026-11-12 de ne pas l'attendre).
 *
 * Sources (pages officielles et registre relus le 2026-11-12, registre =
 * recherche-entreprises.api.gouv.fr, même base que annuaire-entreprises.data.gouv.fr) :
 *
 * Catégorie et badge « Vérifié »
 *  - gl-events-venues-lyon : standiste -> autre, is_verified -> false. Gestionnaire de sites,
 *    un des trois pôles du groupe (Live, Exhibitions, Venues), https://gl-events.com ; registre
 *    SIREN 495014524 GL EVENTS VENUES, 59 quai Rambaud 69002 Lyon. Point tranché 3 du rapport.
 *  - mci-france-paris : is_verified -> false (point tranché 4), standiste -> autre (point commun
 *    aux hubs : la fiche la décrit comme « agence de communication et d'événementiel »,
 *    https://www.mci-group.com). Reste noindex.
 *  - pico-international-paris : standiste -> autre (point tranché 2 : aucune entité française
 *    identifiable, https://www.pico.com). Déjà is_verified=false, reste noindex.
 *
 * Adresses (city, postal_code, department)
 *  - dushow-paris : Roissy-en-France 95700 (95). Registre SIREN 529975674, ZAC du Moulin 18 rue
 *    du Meunier 95700 Roissy-en-France ; mentions légales https://www.dushow.com/mentions-legales.
 *  - videlio-paris : Gennevilliers 92230 (92). Registre SIREN 350093704, 141 avenue des
 *    Grésillons ; https://www.videlio.com/mentions-legales/.
 *  - alises : Chalifert 77144. Pied de page https://www.alises.fr/ et registre SIREN 388972358.
 *  - iboo-studio : Auray 56400 (56). https://iboostudio.com/ (pied de page, contact) et registre
 *    SIREN 444232508, 7 rue Georges Clémenceau 56400 Auray. Point tranché 5.
 *  - pech-up : Millery 69390. https://pechup.fr/mentions-legales/ (« Siège social ») et registre
 *    SIREN 884382367, 29 rue du Rave 69390 Millery. Point tranché 6 (P4 : le registre fait foi).
 *  - aktuel : 91127 (CEDEX affiché par le site) -> 91120, code géographique du registre
 *    (SIREN 444507586, 36 avenue du 1er Mai 91120 Palaiseau), même règle que G4ter.
 *  - axial-design : founded_year null -> 1986, registre SIREN 339173106 créé le 1986-09-22
 *    (amélioration facultative du rapport, P21).
 *
 * Contacts (règle : ne publier un téléphone ou un e-mail que si le site l'associe à ce
 * prestataire comme contact ; ils sortent dans le JSON-LD)
 *  - dushow-paris : 01 49 46 06 60 introuvable ; le site publie « Tel : +33 1 34 38 25 25 » sous
 *    l'adresse du siège de Roissy (https://www.dushow.com/). E-mail contact@dushow.com confirmé.
 *  - lenotre-paris : 01 45 02 21 21 et traiteur@lenotre.com introuvables sur lenotre.com
 *    (accueil, /contact, /entreprise/). Le seul numéro publié (01.30.81.47.48) est le service
 *    clients de la boutique en ligne : pas repris.
 *  - videlio-paris : 01 55 86 00 00 et events@videlio.com introuvables (accueil, mentions
 *    légales ; /contact en 404). Le numéro des mentions légales est celui de l'éditeur du site :
 *    pas repris faute d'être présenté comme un contact commercial.
 *  - iboo-studio : 01 34 30 99 93 (ancienne implantation du Val-d'Oise) et
 *    commercial@iboo-studio.com introuvables ; le site publie « Contactez-nous : 02 97 58 33 71 »
 *    (https://iboostudio.com/contact/). Aucune adresse e-mail publiée.
 *
 * Textes (description FR et description_en)
 *  - alphaexpo : retrait du siège de Gap (mention périmée du site : le RCS 489 034 454 qu'il cite
 *    est GROUPE DXF, siège 12 rue Lionel Terray 69740 Genas au registre) et de « membre du Leads »
 *    (P5, donnée déjà dans memberships). ISO 20121 gardé : « nos menuiseries sont certifiées
 *    Iso 20 121 », https://www.alphaexpo.fr/agence/.
 *  - lenotre-paris : « deux restaurants à Paris » -> « deux restaurants » (le second est au Stade
 *    de France, Saint-Denis, d'après le dossier figé du 2026-09-21, lenotre.com/espace-entreprise ;
 *    assumé, page non relisible en direct le 2026-11-12). Aucune phrase nouvelle.
 *  - design-location : la baseline du site (« Le spécialiste de la Location de Mobilier à Paris
 *    & Province », https://www.designlocation.fr/) n'est plus reprise en voix Agoris (P10, P11).
 *  - aktuel : second site « Cannes » situé à Grasse, https://www.aktuel.fr/ (« Cannes 61 route de
 *    la Marigarde 06131 GRASSE »).
 *
 * Slugs (convention de l'import du 2026-09-21 : slug = nom seul, sans ville ; le seed avait déjà
 * « magnum »). 301 FR et EN dans next.config.ts.
 *  - magnum-lyon -> magnum : Gonesse, https://www.magnum.fr/mentions-legales, SIREN 338378789.
 *  - expocom-paris -> expocom : Metz, pied de page https://www.expocom.fr, SIREN 440499671.
 *
 * Hubs standistes (provider_hubs)
 *  - Compteurs : les chiffres écrits en dur (66, 39, 10) deviennent le jeton %%NOMBRE%%,
 *    remplacé au rendu par le nombre de prestataires listés (src/lib/provider-hubs.ts).
 *  - « Stand traditionnel » : le hub national le définissait comme clé en main sur cloisons
 *    standardisées, le hub Paris comme synonyme du sur mesure. Aucune source ne tranche :
 *    définition neutre, le terme n'est plus défini nulle part (la meta peut le citer).
 *  - standistes-lyon : les metas ne disent plus « basés dans l'Ain et la Loire » (aucun
 *    prestataire n'y a son siège).
 *
 * Non appliqué, contredit le 2026-11-12 : aukare (retrait de Corum et April). Les pages
 * https://www.aukare-stand.com/portfolios/corum-lepargne-partimonia-12 (« Stand Corum L'Épargne
 * 24m² - Salon Patrimonia ») et /portfolios/april-jdc-courtage-18 (« Stand APRIL 3x18m² - Salon
 * JDC Courtage ») répondent 200 et figurent dans la liste des réalisations de /stands.
 *
 * Ordre de mise en prod : les renommages de slugs et les écritures de hubs (jeton) exigent le code
 * de la même PR. Le script vérifie que les 301 répondent en prod (AGORIS_PROD_URL, défaut
 * www.agoris.io) et saute ces deux blocs sinon (cf. mémoire vercel-redirect-lag : une 301 n'est
 * active qu'au déploiement suivant celui qui l'introduit).
 *
 * Verrou optimiste : chaque UPDATE est conditionné à l'ancienne valeur de chaque champ modifié.
 * Idempotent : un champ déjà à la valeur cible est sauté.
 * Usage : ./node_modules/.bin/tsx --env-file=.env.local scripts/diag-prestataires-relecture-2026-11-12-apply.ts [--apply]
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}
const sb = createClient(url, key);
const APPLY = process.argv.includes("--apply");
const PROD = process.env.AGORIS_PROD_URL ?? "https://www.agoris.io";
const TOKEN = "%%NOMBRE%%";

type Value = string | number | boolean | null;
type Kind = "catégorie" | "badge vérifié" | "adresse" | "contact" | "année" | "texte" | "slug" | "hub";
/** Valeur fixe (from -> to) ou remplacement d'un passage dans un texte (find -> replace). */
type Change =
  | { kind: Kind; field: string; from: Value; to: Value }
  | { kind: Kind; field: string; find: string; replace: string };

const PROVIDERS: Record<string, Change[]> = {
  "gl-events-venues-lyon": [
    { kind: "catégorie", field: "category", from: "standiste", to: "autre" },
    { kind: "badge vérifié", field: "is_verified", from: true, to: false },
  ],
  "mci-france-paris": [
    { kind: "catégorie", field: "category", from: "standiste", to: "autre" },
    { kind: "badge vérifié", field: "is_verified", from: true, to: false },
  ],
  "pico-international-paris": [{ kind: "catégorie", field: "category", from: "standiste", to: "autre" }],
  "dushow-paris": [
    { kind: "adresse", field: "city", from: "Paris", to: "Roissy-en-France" },
    { kind: "adresse", field: "postal_code", from: null, to: "95700" },
    { kind: "adresse", field: "department", from: "75", to: "95" },
    { kind: "contact", field: "phone", from: "01 49 46 06 60", to: "+33 1 34 38 25 25" },
  ],
  "videlio-paris": [
    { kind: "adresse", field: "city", from: "Paris", to: "Gennevilliers" },
    { kind: "adresse", field: "postal_code", from: null, to: "92230" },
    { kind: "adresse", field: "department", from: "75", to: "92" },
    { kind: "contact", field: "phone", from: "01 55 86 00 00", to: null },
    { kind: "contact", field: "email", from: "events@videlio.com", to: null },
  ],
  alises: [
    { kind: "adresse", field: "city", from: "Croissy-Beaubourg", to: "Chalifert" },
    { kind: "adresse", field: "postal_code", from: "77183", to: "77144" },
  ],
  "iboo-studio": [
    { kind: "adresse", field: "city", from: "Courdimanche", to: "Auray" },
    { kind: "adresse", field: "postal_code", from: "95800", to: "56400" },
    { kind: "adresse", field: "department", from: "95", to: "56" },
    { kind: "contact", field: "phone", from: "01 34 30 99 93", to: "02 97 58 33 71" },
    { kind: "contact", field: "email", from: "commercial@iboo-studio.com", to: null },
  ],
  "pech-up": [
    { kind: "adresse", field: "city", from: "Beauvallon", to: "Millery" },
    { kind: "adresse", field: "postal_code", from: "69700", to: "69390" },
  ],
  aktuel: [
    { kind: "adresse", field: "postal_code", from: "91127", to: "91120" },
    { kind: "texte", field: "description", find: "dispose d'un second site à Cannes.", replace: "dispose d'un second site dans les Alpes-Maritimes, à Grasse (agence de Cannes)." },
    { kind: "texte", field: "description_en", find: "has a second site in Cannes.", replace: "has a second site in the Alpes-Maritimes, in Grasse (Cannes branch)." },
  ],
  "axial-design": [{ kind: "année", field: "founded_year", from: null, to: 1986 }],
  "lenotre-paris": [
    { kind: "contact", field: "phone", from: "01 45 02 21 21", to: null },
    { kind: "contact", field: "email", from: "traiteur@lenotre.com", to: null },
    { kind: "texte", field: "description", find: "deux restaurants à Paris, dont Le Pré Catelan", replace: "deux restaurants, dont Le Pré Catelan" },
    { kind: "texte", field: "description_en", find: "two restaurants in Paris, including Le Pré Catelan", replace: "two restaurants, including Le Pré Catelan" },
  ],
  alphaexpo: [
    { kind: "texte", field: "description", find: "L'agence est basée à Genas (69740), près de Lyon, et son siège social est à Gap (05000).", replace: "L'agence est basée à Genas (69740), près de Lyon." },
    { kind: "texte", field: "description", find: "Alphaexpo est membre du Leads et ses menuiseries sont certifiées ISO 20121.", replace: "Les menuiseries d'Alphaexpo sont certifiées ISO 20121." },
    { kind: "texte", field: "description_en", find: "The agency is based in Genas (69740), near Lyon, and its registered office is in Gap (05000).", replace: "The agency is based in Genas (69740), near Lyon." },
    { kind: "texte", field: "description_en", find: "Alphaexpo is a member of Leads and its joinery is certified to ISO 20121.", replace: "Alphaexpo's joinery is certified to ISO 20121." },
  ],
  "design-location": [
    { kind: "texte", field: "description", find: "Design Location est le spécialiste de la location de mobilier à Paris et en province, basé à Goussainville et fondé en 2005.", replace: "Design Location est une entreprise de location de mobilier basée à Goussainville, fondée en 2005." },
    { kind: "texte", field: "description_en", find: "Design Location is a furniture rental specialist covering Paris and the French regions, based in Goussainville and founded in 2005.", replace: "Design Location is a furniture rental company based in Goussainville, founded in 2005." },
  ],
};

const SLUG_RENAMES: { from: string; to: string }[] = [
  { from: "magnum-lyon", to: "magnum" },
  { from: "expocom-paris", to: "expocom" },
];

const HUBS: Record<string, Change[]> = {
  standistes: [
    { kind: "hub", field: "editorial_mdx", find: " Le stand traditionnel, clé en main, s'appuie sur des cloisons et du mobilier standardisés.", replace: "" },
    { kind: "hub", field: "editorial_mdx", find: "Agoris référence 66 standistes dont le siège est en France.", replace: `Agoris référence ${TOKEN} standistes dont le siège est en France.` },
    { kind: "hub", field: "editorial_mdx_en", find: " The traditional, turnkey stand relies on standardised partitions and furniture.", replace: "" },
    { kind: "hub", field: "editorial_mdx_en", find: "Agoris lists 66 stand builders whose head office is in France.", replace: `Agoris lists ${TOKEN} stand builders whose head office is in France.` },
    { kind: "hub", field: "seo_description", find: "Agoris référence 66 standistes en France", replace: `Agoris référence ${TOKEN} standistes en France` },
    { kind: "hub", field: "seo_description_en", find: "Agoris lists 66 exhibition stand builders", replace: `Agoris lists ${TOKEN} exhibition stand builders` },
  ],
  "standistes-paris": [
    { kind: "hub", field: "editorial_mdx", find: "Le stand traditionnel, dit sur mesure, est dessiné", replace: "Le stand sur mesure est dessiné" },
    { kind: "hub", field: "editorial_mdx", find: "Agoris référence 39 standistes dont le siège est en Île-de-France.", replace: `Agoris référence ${TOKEN} standistes dont le siège est en Île-de-France.` },
    { kind: "hub", field: "editorial_mdx_en", find: "The traditional stand, known as bespoke, is designed", replace: "The bespoke stand is designed" },
    { kind: "hub", field: "editorial_mdx_en", find: "Agoris lists 39 stand builders whose head office is in Île-de-France.", replace: `Agoris lists ${TOKEN} stand builders whose head office is in Île-de-France.` },
    { kind: "hub", field: "seo_description_en", find: "39 exhibition stand builders", replace: `${TOKEN} exhibition stand builders` },
  ],
  "standistes-lyon": [
    { kind: "hub", field: "editorial_mdx", find: "Agoris référence 10 standistes basés dans cette zone", replace: `Agoris référence ${TOKEN} standistes basés dans cette zone` },
    { kind: "hub", field: "editorial_mdx_en", find: "Agoris lists 10 stand builders based in this area", replace: `Agoris lists ${TOKEN} stand builders based in this area` },
    { kind: "hub", field: "seo_title_en", find: "Exhibition stand builders in Lyon: 10 companies listed", replace: `Exhibition stand builders in Lyon: ${TOKEN} companies listed` },
    { kind: "hub", field: "seo_description", find: "Les standistes basés à Lyon, dans l'Ain, l'Isère et la Loire, et ce", replace: "Les standistes basés à Lyon et dans sa région, et ce" },
    { kind: "hub", field: "seo_description_en", find: "10 exhibition stand builders and contractors based in Lyon, the Ain, Isère and Loire, and", replace: `${TOKEN} exhibition stand builders and contractors based in Lyon and its region, and` },
  ],
};

const counts: Record<string, number> = {};
const bump = (k: string) => (counts[k] = (counts[k] ?? 0) + 1);
const problems: string[] = [];

/** Calcule le patch d'une ligne (champ -> { old, new }) ; null si état inattendu. */
function planRow(label: string, row: Record<string, Value>, changes: Change[]): Record<string, { old: Value; next: Value; kind: Kind }> {
  const patch: Record<string, { old: Value; next: Value; kind: Kind }> = {};
  for (const c of changes) {
    const current = (patch[c.field]?.next ?? row[c.field]) as Value;
    const old = row[c.field] as Value;
    if ("find" in c) {
      const text = String(current ?? "");
      if (text.includes(c.find)) {
        if (text.split(c.find).length !== 2) { problems.push(`${label}.${c.field} : passage présent plusieurs fois`); continue; }
        if (/[—–]/.test(c.replace)) { problems.push(`${label}.${c.field} : tiret long dans le remplacement`); continue; }
        patch[c.field] = { old, next: text.replace(c.find, c.replace), kind: c.kind };
      } else if (c.replace && text.includes(c.replace)) {
        console.log(`  ${label}.${c.field} : déjà corrigé`);
      } else if (!c.replace) {
        console.log(`  ${label}.${c.field} : passage absent, considéré comme déjà retiré`);
      } else {
        problems.push(`${label}.${c.field} : état inattendu, passage introuvable « ${c.find.slice(0, 60)} »`);
      }
    } else if (current === c.to) {
      console.log(`  ${label}.${c.field} : déjà à ${JSON.stringify(c.to)}`);
    } else if (current === c.from) {
      patch[c.field] = { old, next: c.to, kind: c.kind };
    } else {
      problems.push(`${label}.${c.field} : état inattendu ${JSON.stringify(current)} (attendu ${JSON.stringify(c.from)})`);
    }
  }
  return patch;
}

async function writeRow(table: "providers" | "provider_hubs", label: string, id: string, patch: Record<string, { old: Value; next: Value; kind: Kind }>, extra: Record<string, Value> = {}) {
  const fields = Object.keys(patch);
  if (fields.length === 0) return;
  for (const f of fields) {
    const { old, next, kind } = patch[f];
    bump(kind);
    const show = (v: Value) => (typeof v === "string" && v.length > 90 ? `${v.length} car.` : JSON.stringify(v));
    console.log(`  ${label}.${f} [${kind}] : ${show(old)} -> ${show(next)}`);
  }
  if (!APPLY) return;
  let q = sb.from(table).update({ ...Object.fromEntries(fields.map((f) => [f, patch[f].next])), ...extra } as never).eq("id", id);
  for (const f of fields) q = patch[f].old === null ? q.is(f, null) : q.eq(f, patch[f].old as string | number | boolean);
  const { data, error } = await q.select("id");
  if (error) throw new Error(`${label} : ${error.message}`);
  if (!data || data.length !== 1) throw new Error(`${label} : verrou optimiste, ligne modifiée entre lecture et écriture (0 ligne écrite)`);
}

/** Les 301 de next.config.ts répondent-elles en prod ? Preuve que le code de la PR est déployé. */
async function redirectsLive(): Promise<boolean> {
  let ok = true;
  for (const r of SLUG_RENAMES) {
    for (const prefix of ["", "/en"]) {
      const from = `${PROD}${prefix}/prestataires/${r.from}`;
      try {
        const res = await fetch(from, { redirect: "manual", signal: AbortSignal.timeout(15000) });
        const loc = res.headers.get("location") ?? "";
        const live = [301, 308].includes(res.status) && loc.endsWith(`${prefix}/prestataires/${r.to}`);
        console.log(`  ${from} : ${res.status} ${loc}${live ? "" : "  (301 pas encore active)"}`);
        ok &&= live;
      } catch (e) {
        console.log(`  ${from} : erreur ${(e as Error).message}`);
        ok = false;
      }
    }
  }
  return ok;
}

type HubRow = { id: string; slug: string; category: string; departments: string[] } & Record<string, Value>;

function hubCount(hub: HubRow, providers: Record<string, Value>[]): number {
  return providers.filter((p) => p.category === hub.category && (hub.departments.length === 0 || hub.departments.includes(p.department as string))).length;
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY-RUN ===");
  const { data: providers, error } = await sb.from("providers").select("*");
  if (error) throw error;
  const { data: hubs, error: hErr } = await sb.from("provider_hubs").select("*");
  if (hErr) throw hErr;
  const bySlug = new Map((providers as Record<string, Value>[]).map((p) => [p.slug as string, p]));

  // 1. Prestataires : catégorie, badge, adresses, contacts, textes
  console.log("\n# Prestataires");
  const plans: [string, Record<string, Value>, ReturnType<typeof planRow>][] = [];
  for (const [slug, changes] of Object.entries(PROVIDERS)) {
    const row = bySlug.get(slug);
    if (!row) { problems.push(`${slug} : absent de la base`); continue; }
    plans.push([slug, row, planRow(slug, row, changes)]);
  }

  // Effectifs des hubs avant / après les corrections de catégorie et de département
  const after = (providers as Record<string, Value>[]).map((p) => {
    const plan = plans.find(([s]) => s === p.slug)?.[2] ?? {};
    return { ...p, ...Object.fromEntries(Object.entries(plan).map(([f, v]) => [f, v.next])) };
  });
  console.log("\n# Effectifs des hubs (jeton %%NOMBRE%%), avant -> après");
  for (const h of hubs as HubRow[]) console.log(`  ${h.slug} : ${hubCount(h, providers as Record<string, Value>[])} -> ${hubCount(h, after)}`);

  // 2. Slugs : cible libre, pas de lien interne vers l'ancien slug
  console.log("\n# Slugs");
  const hubSlugs = new Set((hubs as HubRow[]).map((h) => h.slug));
  const renames: { id: string; from: string; to: string }[] = [];
  for (const r of SLUG_RENAMES) {
    const target = bySlug.get(r.to);
    const source = bySlug.get(r.from);
    if (target && !source) { console.log(`  ${r.from} -> ${r.to} : déjà renommé`); continue; }
    if (!source) { problems.push(`${r.from} : absent de la base`); continue; }
    if (target || hubSlugs.has(r.to)) { problems.push(`${r.to} : slug déjà pris`); continue; }
    renames.push({ id: source.id as string, ...r });
  }
  for (const r of SLUG_RENAMES) {
    const needle = `/prestataires/${r.from}`;
    for (const [table, cols] of [["salons", ["editorial_mdx", "editorial_mdx_en"]], ["provider_hubs", ["editorial_mdx", "editorial_mdx_en"]], ["providers", ["description", "description_en"]]] as const) {
      for (const col of cols) {
        const { data, error: lErr } = await sb.from(table).select("slug").ilike(col, `%${needle}%`);
        if (lErr) throw new Error(`${table}.${col} : ${lErr.message}`);
        for (const d of data ?? []) problems.push(`lien interne vers ${needle} dans ${table}.${col} (${(d as { slug: string }).slug}) : à réécrire`);
      }
    }
  }
  for (const r of renames) console.log(`  ${r.from} -> ${r.to}`);

  // 3. Hubs standistes
  console.log("\n# Hubs");
  const hubPlans: [HubRow, ReturnType<typeof planRow>][] = [];
  for (const [slug, changes] of Object.entries(HUBS)) {
    const hub = (hubs as HubRow[]).find((h) => h.slug === slug);
    if (!hub) { problems.push(`hub ${slug} absent`); continue; }
    const plan = planRow(`hub ${slug}`, hub, changes);
    // Les chiffres remplacés doivent être les effectifs actuels : sinon le texte avait déjà divergé.
    for (const c of changes) if ("find" in c && plan[c.field] && /\b(66|39|10)\b/.test(c.find)) {
      const n = Number(c.find.match(/\b(66|39|10)\b/)![1]);
      if (n !== hubCount(hub, providers as Record<string, Value>[])) problems.push(`hub ${slug} : le texte dit ${n}, la base en compte ${hubCount(hub, providers as Record<string, Value>[])}`);
    }
    for (const [f, v] of Object.entries(plan)) {
      const s = String(v.next);
      if (/[—–]/.test(s)) problems.push(`hub ${slug}.${f} : tiret long`);
      if (f.startsWith("editorial_mdx") && (s.includes("<") || /^\s*\|.*\|\s*$/m.test(s))) problems.push(`hub ${slug}.${f} : MDX hors contraintes`);
    }
    hubPlans.push([hub, plan]);
  }
  // Le MDX doit compiler une fois le jeton remplacé (même chaîne que compileMdxContentSafe)
  const { compile } = await import("@mdx-js/mdx");
  for (const [hub, plan] of hubPlans) {
    for (const f of ["editorial_mdx", "editorial_mdx_en"]) {
      if (!plan[f]) continue;
      try {
        await compile(String(plan[f].next).replaceAll(TOKEN, "1"), { outputFormat: "function-body" });
      } catch (e) {
        problems.push(`hub ${hub.slug}.${f} : MDX non compilable (${(e as Error).message.slice(0, 100)})`);
      }
    }
  }

  if (problems.length) {
    console.log(`\nREJET, rien n'est écrit :\n  - ${problems.join("\n  - ")}`);
    process.exit(1);
  }

  // Écritures
  console.log("\n# Écritures prestataires");
  for (const [slug, row, plan] of plans) await writeRow("providers", slug, row.id as string, plan);

  console.log("\n# Vérification des 301 en prod (prérequis slugs et hubs)");
  const live = await redirectsLive();
  if (!live && APPLY) console.log("  301 inactives : slugs et hubs NON écrits. Relancer --apply après le déploiement qui les active.");

  console.log("\n# Écritures slugs");
  for (const r of renames) {
    bump("slug");
    console.log(`  ${r.from}.slug [slug] : ${r.from} -> ${r.to}`);
    if (APPLY && live) {
      const { data, error: sErr } = await sb.from("providers").update({ slug: r.to }).eq("id", r.id).eq("slug", r.from).select("id");
      if (sErr) throw new Error(`${r.from} : ${sErr.message}`);
      if (!data || data.length !== 1) throw new Error(`${r.from} : verrou optimiste, 0 ligne écrite`);
    }
  }

  console.log("\n# Écritures hubs");
  for (const [hub, plan] of hubPlans) {
    if (APPLY && !live) continue;
    const touchesText = Object.keys(plan).some((f) => f.startsWith("editorial_mdx"));
    await writeRow("provider_hubs", `hub ${hub.slug}`, hub.id, plan, touchesText ? { editorial_updated_at: new Date().toISOString() } : {});
  }

  console.log(`\n# Résumé (${APPLY ? (live ? "appliqué" : "appliqué hors slugs et hubs") : "dry-run, rien d'écrit"})`);
  for (const [k, n] of Object.entries(counts)) console.log(`  ${k} : ${n}`);
  console.log(`  total : ${Object.values(counts).reduce((a, b) => a + b, 0)} champs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
