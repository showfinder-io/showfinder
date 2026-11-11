import { notFound } from "next/navigation";

// Toute URL publique sans route déclenche la 404 localisée
// (src/app/[locale]/not-found.tsx), rendue dans le layout [locale] : sans
// layout racine global, la 404 par défaut de Next serait servie à la place.
export default function CatchAllPage() {
  notFound();
}
