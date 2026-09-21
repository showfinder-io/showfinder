/**
 * Proximité sans géocodage : code postal -> département -> région, sur table statique
 * (découpage régional 2016, codes INSEE). Utilisé par le drawer « Organiser mon stand »
 * et par le listing /prestataires. Fonctions pures, partagées serveur et client.
 */

export type Region = { code: string; name: string };
export type Department = { code: string; name: string; region: string };

export const REGIONS: Region[] = [
  { code: "84", name: "Auvergne-Rhône-Alpes" },
  { code: "27", name: "Bourgogne-Franche-Comté" },
  { code: "53", name: "Bretagne" },
  { code: "24", name: "Centre-Val de Loire" },
  { code: "94", name: "Corse" },
  { code: "44", name: "Grand Est" },
  { code: "32", name: "Hauts-de-France" },
  { code: "11", name: "Île-de-France" },
  { code: "28", name: "Normandie" },
  { code: "75", name: "Nouvelle-Aquitaine" },
  { code: "76", name: "Occitanie" },
  { code: "52", name: "Pays de la Loire" },
  { code: "93", name: "Provence-Alpes-Côte d'Azur" },
  { code: "01", name: "Guadeloupe" },
  { code: "02", name: "Martinique" },
  { code: "03", name: "Guyane" },
  { code: "04", name: "La Réunion" },
  { code: "06", name: "Mayotte" },
];

// [code département, nom, code région]
const DEPARTMENT_ROWS: Array<[string, string, string]> = [
  ["01", "Ain", "84"], ["02", "Aisne", "32"], ["03", "Allier", "84"],
  ["04", "Alpes-de-Haute-Provence", "93"], ["05", "Hautes-Alpes", "93"], ["06", "Alpes-Maritimes", "93"],
  ["07", "Ardèche", "84"], ["08", "Ardennes", "44"], ["09", "Ariège", "76"],
  ["10", "Aube", "44"], ["11", "Aude", "76"], ["12", "Aveyron", "76"],
  ["13", "Bouches-du-Rhône", "93"], ["14", "Calvados", "28"], ["15", "Cantal", "84"],
  ["16", "Charente", "75"], ["17", "Charente-Maritime", "75"], ["18", "Cher", "24"],
  ["19", "Corrèze", "75"], ["2A", "Corse-du-Sud", "94"], ["2B", "Haute-Corse", "94"],
  ["21", "Côte-d'Or", "27"], ["22", "Côtes-d'Armor", "53"], ["23", "Creuse", "75"],
  ["24", "Dordogne", "75"], ["25", "Doubs", "27"], ["26", "Drôme", "84"],
  ["27", "Eure", "28"], ["28", "Eure-et-Loir", "24"], ["29", "Finistère", "53"],
  ["30", "Gard", "76"], ["31", "Haute-Garonne", "76"], ["32", "Gers", "76"],
  ["33", "Gironde", "75"], ["34", "Hérault", "76"], ["35", "Ille-et-Vilaine", "53"],
  ["36", "Indre", "24"], ["37", "Indre-et-Loire", "24"], ["38", "Isère", "84"],
  ["39", "Jura", "27"], ["40", "Landes", "75"], ["41", "Loir-et-Cher", "24"],
  ["42", "Loire", "84"], ["43", "Haute-Loire", "84"], ["44", "Loire-Atlantique", "52"],
  ["45", "Loiret", "24"], ["46", "Lot", "76"], ["47", "Lot-et-Garonne", "75"],
  ["48", "Lozère", "76"], ["49", "Maine-et-Loire", "52"], ["50", "Manche", "28"],
  ["51", "Marne", "44"], ["52", "Haute-Marne", "44"], ["53", "Mayenne", "52"],
  ["54", "Meurthe-et-Moselle", "44"], ["55", "Meuse", "44"], ["56", "Morbihan", "53"],
  ["57", "Moselle", "44"], ["58", "Nièvre", "27"], ["59", "Nord", "32"],
  ["60", "Oise", "32"], ["61", "Orne", "28"], ["62", "Pas-de-Calais", "32"],
  ["63", "Puy-de-Dôme", "84"], ["64", "Pyrénées-Atlantiques", "75"], ["65", "Hautes-Pyrénées", "76"],
  ["66", "Pyrénées-Orientales", "76"], ["67", "Bas-Rhin", "44"], ["68", "Haut-Rhin", "44"],
  ["69", "Rhône", "84"], ["70", "Haute-Saône", "27"], ["71", "Saône-et-Loire", "27"],
  ["72", "Sarthe", "52"], ["73", "Savoie", "84"], ["74", "Haute-Savoie", "84"],
  ["75", "Paris", "11"], ["76", "Seine-Maritime", "28"], ["77", "Seine-et-Marne", "11"],
  ["78", "Yvelines", "11"], ["79", "Deux-Sèvres", "75"], ["80", "Somme", "32"],
  ["81", "Tarn", "76"], ["82", "Tarn-et-Garonne", "76"], ["83", "Var", "93"],
  ["84", "Vaucluse", "93"], ["85", "Vendée", "52"], ["86", "Vienne", "75"],
  ["87", "Haute-Vienne", "75"], ["88", "Vosges", "44"], ["89", "Yonne", "27"],
  ["90", "Territoire de Belfort", "27"], ["91", "Essonne", "11"], ["92", "Hauts-de-Seine", "11"],
  ["93", "Seine-Saint-Denis", "11"], ["94", "Val-de-Marne", "11"], ["95", "Val-d'Oise", "11"],
  ["971", "Guadeloupe", "01"], ["972", "Martinique", "02"], ["973", "Guyane", "03"],
  ["974", "La Réunion", "04"], ["976", "Mayotte", "06"],
];

export const DEPARTMENTS: Department[] = DEPARTMENT_ROWS.map(([code, name, region]) => ({ code, name, region }));

const DEPARTMENT_BY_CODE = new Map(DEPARTMENTS.map((d) => [d.code, d]));
const REGION_BY_CODE = new Map(REGIONS.map((r) => [r.code, r]));

export function getDepartment(code: string | null | undefined): Department | null {
  return (code && DEPARTMENT_BY_CODE.get(code.toUpperCase())) || null;
}

export function getRegion(code: string | null | undefined): Region | null {
  return (code && REGION_BY_CODE.get(code)) || null;
}

export function departmentsOfRegion(regionCode: string): string[] {
  return DEPARTMENTS.filter((d) => d.region === regionCode).map((d) => d.code);
}

/**
 * Département d'un code postal français. Corse : 200xx et 201xx = 2A, le reste de 20xxx = 2B.
 * Outre-mer : trois premiers chiffres. Null si le code n'est pas un code postal français connu
 * (Monaco, collectivités d'outre-mer hors table). Les rares communes dont le code postal
 * dépend d'un bureau distributeur du département voisin sont rattachées à ce voisin.
 */
export function departmentFromPostalCode(postalCode: string | null | undefined): string | null {
  const cp = (postalCode ?? "").replace(/\s/g, "");
  if (!/^\d{5}$/.test(cp)) return null;
  let code = cp.slice(0, 2);
  if (code === "20") code = Number(cp.slice(0, 3)) <= 201 ? "2A" : "2B";
  else if (code === "97" || code === "98") code = cp.slice(0, 3);
  return DEPARTMENT_BY_CODE.has(code) ? code : null;
}

/** Zone de proximité : toujours une région, avec le département quand on le connaît. */
export type Zone = { region: string; department: string | null; postalCode: string | null };

/**
 * Lit une zone depuis une saisie ou un paramètre d'URL : code postal (« 69003 »),
 * code département (« 69 », « 2A », « 974 ») ou région préfixée (« r84 »).
 */
export function parseZone(input: string | null | undefined): Zone | null {
  const value = (input ?? "").trim();
  if (!value) return null;
  const regionMatch = /^r(\d{2})$/i.exec(value);
  if (regionMatch) {
    return REGION_BY_CODE.has(regionMatch[1]) ? { region: regionMatch[1], department: null, postalCode: null } : null;
  }
  const postalCode = /^\d{5}$/.test(value.replace(/\s/g, "")) ? value.replace(/\s/g, "") : null;
  const department = postalCode ? departmentFromPostalCode(postalCode) : getDepartment(value)?.code ?? null;
  if (!department) return null;
  return { region: DEPARTMENT_BY_CODE.get(department)!.region, department, postalCode };
}

/**
 * Forme canonique d'une zone pour l'URL (?zone=), relue par parseZone. Le code postal saisi n'y
 * figure jamais : seul son département compte pour le filtre.
 */
export function zoneParam(zone: Zone): string {
  return zone.department ?? `r${zone.region}`;
}

/** Libellé court d'une zone : « Rhône (69) » ou « Auvergne-Rhône-Alpes ». Noms propres, non traduits. */
export function zoneLabel(zone: Zone): string {
  const department = getDepartment(zone.department);
  if (department) return `${department.name} (${department.code})`;
  return getRegion(zone.region)?.name ?? "";
}

/**
 * Découpe une liste selon la proximité à une zone : même département, reste de la région,
 * ailleurs. L'ordre d'entrée est conservé dans chaque groupe.
 */
export function splitByZone<T extends { department?: string | null }>(
  list: T[],
  zone: Zone
): { department: T[]; region: T[]; elsewhere: T[] } {
  const regionDepartments = new Set(departmentsOfRegion(zone.region));
  const out = { department: [] as T[], region: [] as T[], elsewhere: [] as T[] };
  for (const item of list) {
    const code = item.department ?? null;
    if (code !== null && code === zone.department) out.department.push(item);
    else if (code !== null && regionDepartments.has(code)) out.region.push(item);
    else out.elsewhere.push(item);
  }
  return out;
}

/** Nombre de prestataires montrés par catégorie dans le drawer, et pas de la rotation quotidienne. */
export const DAILY_ROTATION_STRIDE = 8;

/** Numéro du jour courant à Paris (jours depuis 1970). Change à minuit heure de Paris. */
export function parisDayIndex(now: Date = new Date()): number {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" })
    .format(now)
    .split("-")
    .map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * Rotation déterministe : pas d'aléatoire, l'ordre tourne chaque jour et reste identique pour
 * tous les visiteurs d'une même journée (compatible cache). La liste est d'abord triée par slug
 * pour que le résultat ne dépende pas de l'ordre d'arrivée. Au-delà de `stride` éléments, le
 * décalage avance de `stride` par jour : la première page se renouvelle entièrement chaque jour.
 * Les premium restent devant (aucun au 2026-09-21), chaque groupe tourne séparément.
 */
export function rotateDaily<T extends { slug: string; subscription_tier?: string }>(
  list: T[],
  dayIndex: number,
  stride: number = DAILY_ROTATION_STRIDE
): T[] {
  const rotate = (items: T[]): T[] => {
    const sorted = [...items].sort((a, b) => a.slug.localeCompare(b.slug));
    const n = sorted.length;
    if (n < 2) return sorted;
    const offset = (n <= stride ? dayIndex : dayIndex * stride) % n;
    return [...sorted.slice(offset), ...sorted.slice(0, offset)];
  };
  return [
    ...rotate(list.filter((p) => p.subscription_tier === "premium")),
    ...rotate(list.filter((p) => p.subscription_tier !== "premium")),
  ];
}
