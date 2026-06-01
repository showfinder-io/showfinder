"use client";

// Wrapper client de SalonVisual : mesure la largeur de son conteneur via
// ResizeObserver et passe les dimensions exactes au visuel SSR-rendered.
// Permet un calage pixel-perfect sans dépendance container queries (encore
// jeune en support navigateur).

import { useEffect, useRef, useState } from "react";
import { SalonVisual } from "./salon-visual";
import { sectorKeyFromDbSlug } from "@/lib/sector-palette";

type Props = {
  name: string;
  sectorLabel?: string;
  /** Slug DB du secteur principal (premier secteur du salon). */
  sectorDbSlug?: string;
  city?: string;
  dates?: string;
  edition?: string;
  /** Ratio largeur/hauteur. Défaut 2:1 (hero salon brief). */
  ratio?: number;
};

export function SalonVisualResponsive({
  name,
  sectorLabel,
  sectorDbSlug,
  city,
  dates,
  edition,
  ratio = 2,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setW(Math.floor(entry.contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const h = w > 0 ? Math.round(w / ratio) : 0;
  const sectorKey = sectorKeyFromDbSlug(sectorDbSlug);

  return (
    <div ref={ref} className="w-full" style={{ aspectRatio: `${ratio} / 1` }}>
      {w > 0 && (
        <SalonVisual
          name={name}
          sector={sectorLabel}
          sectorKey={sectorKey}
          city={city}
          dates={dates}
          edition={edition}
          width={w}
          height={h}
        />
      )}
    </div>
  );
}
