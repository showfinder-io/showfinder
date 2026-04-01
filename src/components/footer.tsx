import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits
          réservés.
        </p>
      </div>
    </footer>
  );
}
