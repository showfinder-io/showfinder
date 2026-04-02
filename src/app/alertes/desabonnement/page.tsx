import type { Metadata } from "next";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Gérer mes alertes",
  description: "Gérez et désactivez vos alertes email.",
};

export default function DesabonnementPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
        Gérer mes alertes
      </h1>
      <p className="mt-2 text-sm text-muted">
        Entrez votre email pour consulter et gérer vos alertes actives.
      </p>

      <UnsubscribeForm />
    </div>
  );
}
