"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UserChip } from "@/components/user-chip";
import { SignOutButton } from "@/components/sign-out-button";

/**
 * Récupère les initiales d'un utilisateur à partir de son email ou son nom.
 * "jane.doe@x.com" -> "JD" · "jzakoian@gmail.com" -> "JZ"
 */
function getInitials(email: string | undefined, fullName?: string | null): string {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (!email) return "·";
  const localPart = email.split("@")[0] ?? "";
  const split = localPart.split(/[._-]/).filter(Boolean);
  if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
  if (localPart.length >= 2) return (localPart[0] + localPart[1]).toUpperCase();
  return localPart.slice(0, 2).toUpperCase() || "·";
}

/**
 * Affiche un "display name" court à partir de l'email/nom.
 */
function getDisplayName(email: string | undefined, fullName?: string | null): string {
  if (fullName) return fullName;
  if (!email) return "Compte";
  const localPart = email.split("@")[0] ?? email;
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

type AccountState = { user: User | null; isAdmin: boolean; loaded: boolean };

/**
 * Session lue côté navigateur : le Header ne lit plus les cookies côté
 * serveur, sinon toutes les pages publiques passent en rendu dynamique
 * (incident quota CPU Vercel du 2026-11-02).
 */
function useAccount(): AccountState {
  const [state, setState] = useState<AccountState>({
    user: null,
    isAdmin: false,
    loaded: false,
  });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load(user: User | null) {
      let isAdmin = false;
      if (user) {
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        isAdmin = roleRow?.role === "admin" || roleRow?.role === "editor";
      }
      if (!cancelled) setState({ user, isAdmin, loaded: true });
    }

    supabase.auth.getUser().then(({ data: { user } }) => load(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

/** Zone compte du Header desktop : pill admin + user-chip, ou lien Connexion. */
export function HeaderAccount() {
  const t = useTranslations("nav");
  const { user, isAdmin, loaded } = useAccount();

  // Rien tant que la session n'est pas lue : évite un flash "Connexion".
  if (!loaded) return null;

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="text-sm text-muted transition-colors hover:text-prune"
      >
        {t("connexion")}
      </Link>
    );
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;

  return (
    <>
      {isAdmin && (
        <Link
          href="/admin"
          className="rounded-[3px] px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#C8801F] transition-colors hover:text-prune"
        >
          {t("admin")}
        </Link>
      )}
      <UserChip
        initials={getInitials(user.email, fullName)}
        displayName={getDisplayName(user.email, fullName)}
        email={user.email ?? ""}
      />
    </>
  );
}

/** Zone compte du menu mobile (ex-AuthButton serveur). */
export function MobileAccount() {
  const t = useTranslations("common");
  const { user, isAdmin, loaded } = useAccount();

  if (!loaded) return null;

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        {t("connexion")}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Admin
        </Link>
      )}
      <span className="text-sm text-muted">{user.email}</span>
      <SignOutButton />
    </div>
  );
}
