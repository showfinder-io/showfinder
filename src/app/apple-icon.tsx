import { ImageResponse } from "next/og";

// Convention Next.js : apple-icon.tsx génère /apple-icon.png à la racine
// et insère automatiquement <link rel="apple-touch-icon" />.
// PNG 180×180, fond Prune plein (iOS arrondit les coins automatiquement).
// Brief Nicolas 2026-05-29 : app icon iOS sur fond Prune pour faire
// ressortir le symbole, cohérent avec favicon 16px+.

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// Statique : Next.js cache l'image au build, pas besoin de revalidate.
export const dynamic = "force-static";

export default function AppleIcon() {
  // Symbole scalé à 60% du canvas (108px sur 180px).
  const SYMBOL_SIZE = 108;
  const OCRE = "#E2A02E";
  const PRUNE = "#3B1F33";
  const SABLE = "#EEE7D4";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PRUNE,
        }}
      >
        <svg
          width={SYMBOL_SIZE}
          height={SYMBOL_SIZE}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sommet — Ocre */}
          <circle cx="50" cy="28" r="5.5" fill={OCRE} />
          {/* 4 points externes — Sable (inversion vs fond Prune) */}
          <circle cx="71" cy="43" r="5" fill={SABLE} />
          <circle cx="29" cy="43" r="5" fill={SABLE} />
          <circle cx="63" cy="68" r="5" fill={SABLE} />
          <circle cx="37" cy="68" r="5" fill={SABLE} />
          {/* Centre — Ocre */}
          <circle cx="50" cy="51" r="3" fill={OCRE} />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
