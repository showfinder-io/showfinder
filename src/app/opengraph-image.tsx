import { ImageResponse } from "next/og";

// Convention Next.js : opengraph-image.tsx à la racine génère l'OG par défaut
// utilisée pour la home et toute route qui n'override pas son propre OG.
// Variante par-salon prévue plus tard dans src/app/salons/[slug]/opengraph-image.tsx.

export const alt = "Agoris — l'annuaire intelligent des salons B2B";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export const dynamic = "force-static";

const OCRE = "#E2A02E";
const PRUNE = "#3B1F33";
const SABLE = "#EEE7D4";

export default async function OpengraphImage() {
  // Tentative de chargement de Fraunces depuis Google Fonts (woff direct).
  // Si le fetch échoue (réseau offline en build, par ex.), on bascule sur Georgia/serif.
  let frauncesData: ArrayBuffer | null = null;
  try {
    // Fichier woff statique exposé par Google Fonts pour Fraunces 400.
    const res = await fetch(
      "https://fonts.gstatic.com/s/fraunces/v37/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk.woff"
    );
    if (res.ok) {
      frauncesData = await res.arrayBuffer();
    }
  } catch {
    // Silence : on fallback sur Georgia.
    frauncesData = null;
  }

  const serifFamily = frauncesData ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: SABLE,
          padding: "72px 88px",
          fontFamily: serifFamily,
        }}
      >
        {/* TOP-LEFT : symbole + wordmark Agoris. */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg
            width={84}
            height={84}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="28" r="5.5" fill={OCRE} />
            <circle cx="71" cy="43" r="5" fill={PRUNE} />
            <circle cx="29" cy="43" r="5" fill={PRUNE} />
            <circle cx="63" cy="68" r="5" fill={PRUNE} />
            <circle cx="37" cy="68" r="5" fill={PRUNE} />
            <circle cx="50" cy="51" r="3" fill={OCRE} />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 56,
              color: PRUNE,
              letterSpacing: "-0.015em",
              lineHeight: 1,
              fontFamily: serifFamily,
            }}
          >
            Agoris
            <span style={{ color: OCRE, fontSize: 62, lineHeight: 1 }}>.</span>
          </div>
        </div>

        {/* CENTRE-BAS : titre éditorial 2 lignes */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              color: PRUNE,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontFamily: serifFamily,
            }}
          >
            <span>Là où les industries</span>
            <span style={{ display: "flex", alignItems: "baseline" }}>
              se retrouvent
              <span style={{ color: OCRE, fontSize: 96, lineHeight: 1 }}>
                .
              </span>
            </span>
          </div>
        </div>

        {/* BOTTOM-RIGHT : meta mono */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            color: PRUNE,
            opacity: 0.6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          L&apos;annuaire intelligent des salons B2B
        </div>
      </div>
    ),
    {
      ...size,
      fonts: frauncesData
        ? [
            {
              name: "Fraunces",
              data: frauncesData,
              style: "normal",
              weight: 400,
            },
          ]
        : undefined,
    }
  );
}
