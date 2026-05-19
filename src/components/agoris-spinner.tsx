import { AgorisMark } from "@/components/agoris-mark";

/**
 * Spinner Agoris — symbole qui tourne lentement (2.4s linear infinite).
 * Discipline : rotation lente et constante, jamais d'à-coup ; signature plutôt
 * que feedback agressif. Utilisé sur les états de chargement (load more, fetch).
 *
 * Le keyframe est défini inline (pas d'accès à globals.css depuis ce composant).
 */
export function AgorisSpinner({ size = 48 }: { size?: number }) {
  return (
    <span
      className="inline-block"
      style={{ width: size, height: size }}
      aria-label="Chargement en cours"
      role="status"
    >
      <style>{`@keyframes agoris-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <span
        style={{
          display: "inline-block",
          width: "100%",
          height: "100%",
          animation: "agoris-spin 2.4s linear infinite",
          transformOrigin: "50% 50%",
        }}
      >
        <AgorisMark className="h-full w-full" variant="duo" />
      </span>
    </span>
  );
}
