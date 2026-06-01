// SalonVisual — fallback de marque quand un salon n'a pas de photo réelle.
// Approche B « Le bloc couleur » du brief visuels juin 2026.
// Server-component compatible (pas de hooks, styles inline). Ratio par
// défaut 2:1 paysage. Passer width/height en px pour calage pixel-perfect.

import { SECTOR_PALETTE, type SectorKey } from "@/lib/sector-palette";

const AG = {
  prune: "#3B1F33",
  pruneMuted: "#5E4854",
  ocre: "#E2A02E",
  sable: "#EEE7D4",
  ivoire: "#F7F2E6",
} as const;

const FONT_SERIF = "var(--font-fraunces), Georgia, serif";
const FONT_MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";
const FONT_SANS = "var(--font-inter), system-ui, sans-serif";

const PRESET = {
  hero: { ratio: 2 / 1 },
  wide: { ratio: 16 / 9 },
  square: { ratio: 1 },
  portrait: { ratio: 4 / 5 },
} as const;

type SalonVisualProps = {
  /** Nom du salon (obligatoire). */
  name: string;
  /** Label de filière affiché dans le bloc couleur (ex: "Santé & Pharma"). */
  sector?: string;
  /** Clé palette (résout la couleur du bloc). Override par `color` si fourni. */
  sectorKey?: SectorKey;
  /** Override hex direct (prioritaire sur sectorKey). */
  color?: string;
  /** Lieu (ex: "Paris Expo Porte de Versailles, Paris"). */
  city?: string;
  /** Dates formatées avec flèche → (ex: "2 → 3 juin 2026"). */
  dates?: string;
  /** Édition (ex: "Éd. 12ᵉ"). Optionnel. */
  edition?: string;
  format?: keyof typeof PRESET;
  width?: number;
  height?: number;
};

function AgorisMarkInline({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <circle cx="50" cy="28" r="5.5" fill={AG.ocre} />
      <circle cx="71" cy="43" r="5" fill={AG.prune} />
      <circle cx="29" cy="43" r="5" fill={AG.prune} />
      <circle cx="63" cy="68" r="5" fill={AG.prune} />
      <circle cx="37" cy="68" r="5" fill={AG.prune} />
      <circle cx="50" cy="51" r="3" fill={AG.ocre} />
    </svg>
  );
}

export function SalonVisual({
  name,
  sector,
  sectorKey,
  color,
  city,
  dates,
  edition,
  format = "hero",
  width,
  height,
}: SalonVisualProps) {
  const h = height ?? 440;
  const w = width ?? Math.round(h * (PRESET[format]?.ratio ?? 1));
  const k = h / 440;
  const isWide = w / h >= 1.3;

  const blockColor =
    color ?? (sectorKey ? SECTOR_PALETTE[sectorKey] : SECTOR_PALETTE.default);
  const dateLine = [dates, edition].filter(Boolean).join("  ·  ");

  return (
    <div
      style={{
        width: w,
        height: h,
        display: "flex",
        overflow: "hidden",
        background: AG.sable,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Colonne contenu */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: 34 * k,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AgorisMarkInline size={88 * k} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              fontSize: (isWide ? 64 : 52) * k,
              lineHeight: 0.98,
              letterSpacing: "-.02em",
              color: AG.prune,
              fontVariationSettings: "'opsz' 144",
              overflowWrap: "anywhere",
            }}
          >
            {name}
            <span style={{ color: AG.ocre }}>.</span>
          </div>

          {city && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12 * k,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: AG.pruneMuted,
                marginTop: 18 * k,
              }}
            >
              {city}
            </div>
          )}

          {dateLine && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11 * k,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: AG.prune,
                marginTop: 6 * k,
              }}
            >
              {dateLine}
            </div>
          )}
        </div>
      </div>

      {/* Bloc couleur filière */}
      <div
        style={{
          width: isWide ? "30%" : "34%",
          background: blockColor,
          flexShrink: 0,
          padding: `${34 * k}px ${22 * k}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
        }}
      >
        {sector && (
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              fontSize: 22 * k,
              lineHeight: 1.08,
              color: AG.ivoire,
              fontVariationSettings: "'opsz' 36",
              overflowWrap: "anywhere",
              maxWidth: "100%",
            }}
          >
            {sector}
          </span>
        )}
      </div>
    </div>
  );
}
