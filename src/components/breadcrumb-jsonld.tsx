import { siteConfig } from "@/lib/config";
import { JsonLd } from "@/components/json-ld";

export type BreadcrumbItem = {
  /** Libellé affiché dans le fil d'Ariane (ex: "Salons"). */
  name: string;
  /**
   * Chemin relatif (commençant par `/`) ou URL absolue.
   * Si chemin relatif, il est préfixé par `siteConfig.url`.
   * Optionnel pour le dernier item (page courante) — Schema.org accepte un item
   * sans URL pour le dernier maillon, mais Google préfère qu'on l'inclue.
   */
  item?: string;
};

/**
 * Rend un JSON-LD `BreadcrumbList` (Schema.org) pour les pages détail.
 * Ne rend aucun markup visible — le breadcrumb visuel reste géré séparément.
 *
 * Convention : passe au moins 2 items (Accueil → ...). Le dernier item
 * représente la page courante.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, index) => {
      const position = index + 1;
      const url =
        it.item && it.item.startsWith("http")
          ? it.item
          : it.item
            ? `${siteConfig.url}${it.item}`
            : undefined;
      return {
        "@type": "ListItem",
        position,
        name: it.name,
        ...(url ? { item: url } : {}),
      };
    }),
  };
  return <JsonLd data={data} />;
}
