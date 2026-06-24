import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de navigation conscients de la locale (Link, redirect, useRouter...).
 * A utiliser pour toute navigation interne qui doit conserver la locale
 * courante (ex : le selecteur de langue). Le reste du site peut continuer a
 * utiliser next/link tant que les chemins FR restent a la racine.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
