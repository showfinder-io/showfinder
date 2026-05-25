/**
 * Marqueur "Donnée non disponible pour cette édition." pour les fiches salon.
 * Honnête plutôt que cacher silencieusement une sous-section vide, cf.
 * methodologie : « si la donnée n'existe pas, elle ne s'affiche pas »
 * → ici, on dit explicitement qu'elle n'existe pas.
 */
export function DataMissing() {
  return (
    <p className="mt-3 text-sm italic text-muted/80">
      Donnée non disponible pour cette édition.
    </p>
  );
}
