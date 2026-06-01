"use client";

// Wrapper client de VenueVisual : mesure la largeur de son conteneur et
// passe les dimensions exactes au visuel SSR. Cf. SalonVisualResponsive.

import { useEffect, useRef, useState } from "react";
import { VenueVisual } from "./venue-visual";

type Props = {
  name: string;
  city?: string;
  surface?: string;
  salons?: string;
  lat?: string;
  lon?: string;
  /** Ratio largeur/hauteur. Défaut 21/9 (banner brief). */
  ratio?: number;
};

export function VenueVisualResponsive({
  name,
  city,
  surface,
  salons,
  lat,
  lon,
  ratio = 21 / 9,
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

  return (
    <div ref={ref} className="w-full" style={{ aspectRatio: `${ratio}` }}>
      {w > 0 && (
        <VenueVisual
          name={name}
          city={city}
          surface={surface}
          salons={salons}
          lat={lat}
          lon={lon}
          width={w}
          height={h}
        />
      )}
    </div>
  );
}
