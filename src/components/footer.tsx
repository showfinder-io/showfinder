import { siteConfig } from "@/lib/config";
import { AgorisMark } from "@/components/agoris-mark";

export function Footer() {
  return (
    <footer className="border-t border-border bg-sable">
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2">
          <AgorisMark className="h-5 w-5" />
          <span className="font-serif text-lg font-normal tracking-[-0.015em] text-prune">
            {siteConfig.name}
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">Le forum des salons</p>
        <p className="mt-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits
          réservés.
        </p>
      </div>
    </footer>
  );
}
