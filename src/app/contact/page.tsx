import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { ContactForm } from "./contact-form";
import { Mail, Building2, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: `Contactez-nous | ${siteConfig.name}`,
  description: `Contactez l'équipe ${siteConfig.name} : organisateurs de salons, prestataires ou demande générale.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Contactez-nous
      </h1>
      <p className="mt-3 text-muted">
        Une question, une suggestion ? Choisissez le canal adapté à votre
        situation.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {/* Organisateurs */}
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold">Organisateurs</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Vous organisez un salon ? Réclamez votre fiche ou passez Premium
            pour une visibilité maximale.
          </p>
          <a
            href="mailto:contact@showfinder.io"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Mail className="h-4 w-4" />
            contact@showfinder.io
          </a>
        </div>

        {/* Prestataires */}
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold">Prestataires</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Vous êtes prestataire ? Inscrivez-vous gratuitement ou découvrez
            l&apos;offre Premium pour toucher plus de clients.
          </p>
          <a
            href="mailto:prestataires@showfinder.io"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Mail className="h-4 w-4" />
            prestataires@showfinder.io
          </a>
        </div>
      </div>

      {/* Formulaire général */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          Demande générale
        </h2>
        <p className="mt-2 text-sm text-muted">
          Pour toute autre demande, utilisez le formulaire ci-dessous.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
