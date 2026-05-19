import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-sable">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-muted">
        <p>
          <span className="font-serif text-prune">{siteConfig.name}</span>
          {" · "}
          Le forum des salons
        </p>
        <p className="mt-2 text-xs">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits
          réservés.
        </p>
      </div>
    </footer>
  );
}
