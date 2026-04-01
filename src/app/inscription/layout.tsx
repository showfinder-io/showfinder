import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte pour découvrir et suivre les salons professionnels en France.",
};

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
