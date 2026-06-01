// Palette sectorielle figée pour les visuels de marque (SalonVisual).
// 15 filières + défaut. Cf. brief visuels juin 2026.
// L'œil apprend : « bloc bleu nuit = Tech », « mauve = Santé »…

export const SECTOR_PALETTE = {
  agriculture: "#6B7548",
  agroalimentaire: "#8C7245",
  btp: "#6B6B62",
  cosmetique: "#A37880",
  decoration: "#8A6B4A",
  defense: "#3E4A3A",
  energie: "#4A6660",
  franchise: "#6B5340",
  industrie: "#4D5560",
  logistique: "#5E5448",
  mode: "#7D3E4A",
  rh: "#5C5879",
  sante: "#7A5C6B",
  tech: "#2E4A5C",
  tourisme: "#A8745A",
  default: "#5E4854",
} as const;

export type SectorKey = keyof typeof SECTOR_PALETTE;

/**
 * Mapping slug DB (avec suffixe explicite) → clé palette (slug court).
 * Les 3 secteurs sans suffixe (agriculture, agroalimentaire, industrie) sont
 * identité. Les 12 autres ont un mapping explicite.
 */
const DB_SLUG_TO_PALETTE_KEY: Record<string, SectorKey> = {
  agriculture: "agriculture",
  agroalimentaire: "agroalimentaire",
  "btp-construction": "btp",
  "cosmetique-beaute": "cosmetique",
  "decoration-habitat": "decoration",
  "defense-securite": "defense",
  "energie-environnement": "energie",
  "franchise-commerce": "franchise",
  industrie: "industrie",
  "logistique-transport": "logistique",
  "mode-textile": "mode",
  "rh-formation": "rh",
  "sante-pharma": "sante",
  "tech-numerique": "tech",
  "tourisme-hotellerie": "tourisme",
};

/** Résout la clé palette à partir d'un slug DB. `default` si inconnu. */
export function sectorKeyFromDbSlug(dbSlug: string | null | undefined): SectorKey {
  if (!dbSlug) return "default";
  return DB_SLUG_TO_PALETTE_KEY[dbSlug] ?? "default";
}

/** Résout la couleur hex à partir d'un slug DB. */
export function sectorColorFromDbSlug(dbSlug: string | null | undefined): string {
  return SECTOR_PALETTE[sectorKeyFromDbSlug(dbSlug)];
}
