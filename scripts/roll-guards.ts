/**
 * Garde-fous déterministes du roll automatique (CLAUDE.md règle 13d).
 * Fonctions pures : aucun accès réseau ni base, testées par scripts/test-roll-guards.ts.
 * Un handoff roll-pret produit par la routine n'est appliqué en base que si
 * TOUS les garde-fous passent. Dans le doute, on rejette : le rejet est listé
 * dans tasks/roll-2027/journal.json et traité en session.
 */

export type HandoffEdition = {
  start_date: string | null;
  end_date: string | null;
  edition_year: number | null;
  city: string | null;
  venue: string | null;
};

export type Handoff = {
  slug: string;
  status: string;
  checked_at: string;
  current: HandoffEdition;
  next: HandoffEdition | null;
  source_url: string | null;
  quote: string | null;
  venue_changed: boolean;
  city_changed: boolean;
};

export type SalonRow = {
  slug: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  city: string | null;
  frequency: string | null;
};

// Écart maximal (jours) entre la fin de l'édition en base et le début de la suivante.
const MAX_GAP_DAYS: Record<string, number> = { semestriel: 270, annuel: 460, bisannuel: 830, triennal: 1200 };
const MAX_DURATION_DAYS = 16;
const AGGREGATORS = ["10times.com", "eventseye.com", "tradefairdates.com", "expodatabase", "salons-online.com", "nticket", "eventbrite"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;

const dayMs = 86_400_000;
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / dayMs);

/** Minuscules, sans accents, sans ponctuation, espaces réduits. */
export function normalizeText(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", rsquo: "'", lsquo: "'", ndash: "-", mdash: "-",
  eacute: "é", egrave: "è", ecirc: "ê", agrave: "à", acirc: "â", ocirc: "ô", ucirc: "û", ugrave: "ù", ccedil: "ç", icirc: "î", iuml: "ï", euml: "ë",
};

/** Texte visible approximatif d'une page HTML (scripts et styles retirés, entités décodées). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

/** La citation du handoff figure-t-elle dans la page relue ? */
export function quoteFoundInPage(html: string, quote: string): boolean {
  const q = normalizeText(quote);
  return q.length >= 12 && normalizeText(htmlToText(html)).includes(q);
}

const MONTHS: string[][] = [
  ["janvier", "january", "jan", "janv"], ["fevrier", "february", "feb", "fev", "fevr"], ["mars", "march", "mar"],
  ["avril", "april", "apr", "avr"], ["mai", "may"], ["juin", "june", "jun"], ["juillet", "july", "jul", "juil"],
  ["aout", "august", "aug"], ["septembre", "september", "sep", "sept"], ["octobre", "october", "oct"],
  ["novembre", "november", "nov"], ["decembre", "december", "dec"],
];

/**
 * La page relue annonce-t-elle elle-même les dates du handoff ? Indépendant de la
 * formulation de la citation (souvent composite). Deux preuves acceptées :
 * les dates ISO dans le HTML brut (balisage Schema.org Event), ou l'année avec le
 * jour de début, le jour de fin et le mois de fin dans une fenêtre courte du texte visible.
 */
export function pageCarriesDates(html: string, next: HandoffEdition): boolean {
  if (!next.start_date || !next.end_date) return false;
  if (html.includes(next.start_date) && html.includes(next.end_date)) return true;

  const text = normalizeText(htmlToText(html)).replace(/\b1er\b/g, "1");
  const year = next.start_date.slice(0, 4);
  const days = [next.start_date, next.end_date].map((iso) => Number(iso.slice(8, 10)));
  const monthIdx = Number(next.end_date.slice(5, 7)) - 1;
  const monthTokens = [...MONTHS[monthIdx], String(monthIdx + 1).padStart(2, "0")];
  for (let i = text.indexOf(year); i >= 0; i = text.indexOf(year, i + 1)) {
    const tokens = new Set(text.slice(Math.max(0, i - 90), i + year.length + 40).split(" "));
    const hasDay = (d: number) => tokens.has(String(d)) || tokens.has(String(d).padStart(2, "0"));
    if (days.every(hasDay) && monthTokens.some((m) => tokens.has(m))) return true;
  }
  return false;
}

/** La citation porte-t-elle l'année et les jours de début et de fin annoncés ? */
export function quoteCarriesDates(quote: string, next: HandoffEdition): boolean {
  if (!next.start_date || !next.end_date) return false;
  const tokens = new Set(normalizeText(quote).replace(/\b1er\b/g, "1").split(" "));
  const day = (iso: string) => String(Number(iso.slice(8, 10)));
  const padded = (iso: string) => iso.slice(8, 10);
  const hasDay = (iso: string) => tokens.has(day(iso)) || tokens.has(padded(iso));
  return tokens.has(next.start_date.slice(0, 4)) && hasDay(next.start_date) && hasDay(next.end_date);
}

/**
 * Garde-fous hors réseau. Retourne la liste des motifs de rejet (vide = passe).
 * `today` au format ISO, injecté pour la testabilité.
 */
export function checkHandoff(h: Handoff, salon: SalonRow | null, today: string): string[] {
  const reasons: string[] = [];
  if (h.status !== "roll-pret") return [`statut ${h.status}, seul roll-pret est applicable`];
  if (!salon) return ["fiche introuvable en base"];
  if (salon.status !== "published") reasons.push(`fiche en statut ${salon.status}`);

  const n = h.next;
  if (!n || !n.start_date || !n.end_date || !ISO.test(n.start_date) || !ISO.test(n.end_date)) {
    return [...reasons, "dates de la prochaine édition absentes ou mal formées"];
  }
  if (h.city_changed || h.venue_changed) reasons.push("changement de ville ou de lieu : arbitrage humain requis");
  if (n.city && salon.city && normalizeText(n.city) !== normalizeText(salon.city)) {
    reasons.push(`ville du handoff (${n.city}) différente de la fiche (${salon.city})`);
  }
  if (!salon.end_date || salon.end_date !== h.current.end_date) {
    reasons.push(`fiche modifiée depuis le handoff (end_date base ${salon.end_date}, handoff ${h.current.end_date})`);
  }
  if (salon.end_date && salon.end_date >= today) reasons.push("édition en base pas encore passée");
  if (n.end_date < n.start_date) reasons.push("date de fin antérieure à la date de début");
  if (daysBetween(n.start_date, n.end_date) + 1 > MAX_DURATION_DAYS) reasons.push(`durée supérieure à ${MAX_DURATION_DAYS} jours`);
  if (n.end_date < today) reasons.push("prochaine édition déjà passée");
  if (n.edition_year !== Number(n.start_date.slice(0, 4))) reasons.push("edition_year incohérent avec start_date");

  const maxGap = salon.frequency ? MAX_GAP_DAYS[salon.frequency] : undefined;
  if (!maxGap) reasons.push(`fréquence ${salon.frequency ?? "inconnue"} : pas de roll automatique`);
  else if (salon.end_date) {
    const gap = daysBetween(salon.end_date, n.start_date);
    if (gap <= 0) reasons.push("prochaine édition antérieure à l'édition en base");
    if (gap > maxGap) reasons.push(`écart de ${gap} jours incohérent avec la fréquence ${salon.frequency} (max ${maxGap})`);
  }

  if (!h.source_url || !/^https:\/\//.test(h.source_url)) reasons.push("source_url absente ou non https");
  else if (AGGREGATORS.some((a) => h.source_url!.includes(a))) reasons.push("source_url est un agrégateur, pas une source officielle");
  if (!h.quote) reasons.push("citation absente");
  else if (!quoteCarriesDates(h.quote, n)) reasons.push("la citation ne porte pas l'année et les jours annoncés");
  return reasons;
}
