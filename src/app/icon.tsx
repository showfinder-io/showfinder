import { ImageResponse } from "next/og";

// Convention Next.js : icon.tsx génère /icon.png à la racine et insère
// <link rel="icon" type="image/png">. Fallback fiable pour Safari macOS qui
// gère mal les favicons SVG (cf. icon.svg parallèle). PNG 32×32, même design
// que apple-icon.tsx mais sans le fond Prune plein (rect arrondi 56×56
// comme icon.svg).

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export const dynamic = "force-static";

export default function Icon() {
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
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="56" height="56" rx="8" fill={PRUNE} />
          <circle cx="28" cy="8" r="5.5" fill={OCRE} />
          <circle cx="49" cy="23" r="5" fill={SABLE} />
          <circle cx="7" cy="23" r="5" fill={SABLE} />
          <circle cx="41" cy="48" r="5" fill={SABLE} />
          <circle cx="15" cy="48" r="5" fill={SABLE} />
          <circle cx="28" cy="31" r="3" fill={OCRE} />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
