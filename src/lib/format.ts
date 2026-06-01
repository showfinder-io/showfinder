// Formatage des dates et nombres pour l'affichage

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return dateFormatter.format(new Date(dateStr));
}

export function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  return shortDateFormatter.format(new Date(dateStr));
}

export function formatDateRange(
  startDate: string | null,
  endDate: string | null
): string {
  if (!startDate) return "Dates a confirmer";
  if (!endDate) return formatDate(startDate);

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Meme mois : "17 - 21 octobre 2026"
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} - ${formatDate(endDate)}`;
  }

  // Mois differents : "28 sept. - 1 oct. 2026"
  return `${formatDateShort(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Variante avec flèche → comme séparateur, pour les visuels de marque
 * (SalonVisual). Conserve la logique de compression mois/année.
 */
export function formatDateRangeArrow(
  startDate: string | null,
  endDate: string | null
): string {
  if (!startDate) return "Dates à confirmer";
  if (!endDate) return formatDate(startDate);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()} → ${formatDate(endDate)}`;
  }

  return `${formatDateShort(startDate)} → ${formatDate(endDate)}`;
}

/**
 * Convertit lat/lng en chaînes formatées style "48.8316° N" / "2.2877° E".
 * Pour la signature cartographique des visuels VenueVisual.
 */
export function formatGpsLat(lat: number | null): string | null {
  if (lat === null || lat === undefined) return null;
  const cardinal = lat >= 0 ? "N" : "S";
  return `${Math.abs(lat).toFixed(4)}° ${cardinal}`;
}

export function formatGpsLng(lng: number | null): string | null {
  if (lng === null || lng === undefined) return null;
  const cardinal = lng >= 0 ? "E" : "W";
  return `${Math.abs(lng).toFixed(4)}° ${cardinal}`;
}

export function formatNumber(n: number | null): string {
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("fr-FR").format(n);
}

// Transforme un nom de ville en slug URL
// "Bourg-lès-Valence" -> "bourg-les-valence"
export function slugifyCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()
    .replace(/\s+/g, "-") // espaces -> tirets
    .replace(/[^a-z0-9-]/g, "") // supprime les caracteres speciaux sauf tirets
    .replace(/-+/g, "-") // fusionne les tirets multiples
    .replace(/^-|-$/g, ""); // supprime les tirets en debut/fin
}
