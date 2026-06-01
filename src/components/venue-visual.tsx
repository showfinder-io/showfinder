// VenueVisual — fallback de marque quand un lieu n'a pas de photo réelle.
// Approche « Le point cartographique » du brief visuels juin 2026.
// Server-component compatible. Ratio paysage par défaut 21:9 (banner).
// Coordonnées GPS en ocre = signature du composant.

const AG = {
  prune: "#3B1F33",
  pruneMuted: "#5E4854",
  ocre: "#E2A02E",
  sable: "#EEE7D4",
  ivoire: "#F7F2E6",
  line: "rgba(59,31,51,.12)",
} as const;

const FONT_SERIF = "var(--font-fraunces), Georgia, serif";
const FONT_MONO = "var(--font-jetbrains-mono), ui-monospace, monospace";
const FONT_SANS = "var(--font-inter), system-ui, sans-serif";

const PRESET = {
  banner: { ratio: 21 / 9 },
  wide: { ratio: 16 / 9 },
  square: { ratio: 1 },
  portrait: { ratio: 4 / 5 },
} as const;

type VenueVisualProps = {
  /** Nom du lieu (obligatoire en mode complet, ignoré en mode compact). */
  name: string;
  /** Ville (eyebrow). Ignoré en mode compact. */
  city?: string;
  /** Surface. Ignoré en mode compact. */
  surface?: string;
  /** Texte salons hébergés. Ignoré en mode compact. */
  salons?: string;
  /** Latitude formatée (ex: "48.8316° N"). */
  lat?: string;
  /** Longitude formatée (ex: "2.2877° E"). */
  lon?: string;
  format?: keyof typeof PRESET;
  width?: number;
  height?: number;
  /**
   * Mode compact : pour les cards de grille où le nom/surface/salons sont déjà
   * affichés sous la card. N'affiche que AgorisMark + coords GPS, et réduit la
   * bande prune à 50% de la hauteur (centrée verticalement) pour éviter qu'elle
   * domine la composition.
   */
  compact?: boolean;
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

function joinDots(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join("  ·  ");
}

export function VenueVisual({
  name,
  city,
  surface,
  salons,
  lat,
  lon,
  format = "banner",
  width,
  height,
  compact = false,
}: VenueVisualProps) {
  const h = height ?? 440;
  const w = width ?? Math.round(h * (PRESET[format]?.ratio ?? 1));
  const k = h / 440;
  const isWide = w / h >= 1.3;

  const specLine = joinDots(surface, salons);
  const coordsLine = joinDots(lat, lon);

  // Mode compact : visuel court (1:3 ratio) au-dessus d'une card. Affiche
  // uniquement AgorisMark (plus grand) + coords GPS (taille proche du nom de
  // la card). La bande prune est ancrée en bas-droite (touche le bord
  // supérieur du bloc texte de la card) et occupe 100% de la hauteur du visuel.
  if (compact) {
    // En compact, le k brief de référence (440px de haut) ne fonctionne plus :
    // le visuel est court. On utilise une échelle dérivée de la HAUTEUR avec
    // un baseline de 140px pour scaler symbol + coords proprement.
    const kc = h / 140;
    return (
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          overflow: "hidden",
          background: AG.sable,
          fontFamily: FONT_SANS,
        }}
      >
        {/* Bande prune ancrée bas-droite, pleine hauteur du visuel : son bord
            inférieur coïncide avec le bord supérieur du bloc texte de la card. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "22%",
            background: AG.prune,
          }}
        />

        {/* Contenu : AgorisMark en haut-gauche, coords en bas-gauche */}
        <div
          style={{
            position: "relative",
            padding: 20 * kc,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <AgorisMarkInline size={96 * kc} />

          {coordsLine && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 22 * kc,
                letterSpacing: ".06em",
                color: AG.ocre,
                fontWeight: 500,
              }}
            >
              {coordsLine}
            </div>
          )}
        </div>
      </div>
    );
  }

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
              fontSize: (isWide ? 54 : 44) * k,
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

          {specLine && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12 * k,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: AG.pruneMuted,
                marginTop: 16 * k,
              }}
            >
              {specLine}
            </div>
          )}

          {city && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11 * k,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: AG.pruneMuted,
                marginTop: 8 * k,
              }}
            >
              {city}
            </div>
          )}
        </div>

        {coordsLine && (
          <div
            style={{
              borderTop: `1px solid ${AG.line}`,
              paddingTop: 14 * k,
              fontFamily: FONT_MONO,
              fontSize: 13 * k,
              letterSpacing: ".08em",
              color: AG.ocre,
              fontWeight: 500,
            }}
          >
            {coordsLine}
          </div>
        )}
      </div>

      {/* Bloc prune neutre (lieu = toutes filières) */}
      <div
        style={{
          width: isWide ? "30%" : "40%",
          background: AG.prune,
          flexShrink: 0,
        }}
      />
    </div>
  );
}
