"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth";

type UserChipProps = {
  initials: string;
  displayName: string;
  email: string;
};

/**
 * User-chip du header — avatar initiales + nom + caret triangle.
 * Au clic : ouvre un mini-dropdown avec l'email + "Déconnexion".
 * Pattern visuel conforme au mockup Hero V1 (caret triangle CSS).
 */
export function UserChip({ initials, displayName, email }: UserChipProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          // ferme si le focus quitte le container (gérer le case clic sur menu)
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Compte ${displayName}`}
        className="flex items-center gap-2.5 rounded-3xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-prune/[0.06]"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-prune text-[12px] font-semibold tracking-[0.04em] text-sable"
        >
          {initials}
        </span>
        <span className="text-[13px] font-medium text-prune">{displayName}</span>
        <span
          aria-hidden="true"
          className="ml-0.5 mb-[3px] h-2 w-2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-muted"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-md border border-border bg-papier shadow-md"
        >
          <div className="px-4 py-3 text-xs text-muted">
            <p>Connecté en tant que</p>
            <p className="mt-0.5 truncate text-prune">{email}</p>
          </div>
          <div className="border-t border-border" />
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-prune transition-colors hover:bg-prune/5"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
