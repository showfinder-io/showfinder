import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { MobileNav } from "@/components/mobile-nav";
import { AgorisMark } from "@/components/agoris-mark";
import { AuthButton } from "@/components/auth-button";
import { NavLinks } from "@/components/nav-links";
import { UserChip } from "@/components/user-chip";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/server";

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

/**
 * Header Hero V1 refondu — grid 3 colonnes (brand | nav-center | nav-right).
 * - brand : symbole 44px + wordmark Fraunces 30px (Agoris.)
 * - nav-center : 5 liens Inter 14px weight 500, underline ocre 2px sur active
 * - nav-right : admin-pill ocre uppercase mono (si admin/editor) + user-chip
 */
export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    isAdmin = roleRow?.role === "admin" || roleRow?.role === "editor";
  }

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    null;
  const initials = getInitials(user?.email, fullName);
  const displayName = getDisplayName(user?.email, fullName);

  const t = await getTranslations("nav");

  const NAV_LINKS = [
    { href: "/salons", label: t("salons") },
    { href: "/lieux", label: t("lieux") },
    { href: "/secteurs", label: t("secteurs") },
    { href: "/prestataires", label: t("prestataires") },
    { href: "/blog", label: t("blog") },
  ] as const;

  return (
    <header className="border-b border-border bg-sable">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-5 md:px-14">
        <Link
          href="/"
          className="flex items-center gap-3.5 transition-opacity hover:opacity-80"
          aria-label={t("homeAriaLabel")}
        >
          <AgorisMark className="h-11 w-11" />
          <span
            className="font-serif text-[30px] font-normal leading-none tracking-[-0.015em] text-prune"
            style={{ fontVariationSettings: "'opsz' 36" }}
          >
            {siteConfig.name}
            <em className="not-italic text-[1.1em] leading-none text-ocre">.</em>
          </span>
        </Link>

        <NavLinks links={NAV_LINKS} />

        <div className="flex items-center justify-end gap-4">
          <LanguageSwitcher />

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
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
                  initials={initials}
                  displayName={displayName}
                  email={user.email ?? ""}
                />
              </>
            ) : (
              <Link
                href="/connexion"
                className="text-sm text-muted transition-colors hover:text-prune"
              >
                {t("connexion")}
              </Link>
            )}
          </div>

          <MobileNav>
            <AuthButton />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
