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
