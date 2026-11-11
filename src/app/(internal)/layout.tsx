import { setRequestLocale } from "next-intl/server";
import { RootDocument, rootMetadata } from "@/components/root-document";

// Layout racine des routes app-internes non localisées (admin, connexion,
// inscription, alertes) : toujours en FR, hors middleware next-intl. Le
// groupe (internal) ne change pas les URLs.
export const metadata = rootMetadata;

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("fr");
  return <RootDocument locale="fr">{children}</RootDocument>;
}
