import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        Connexion
      </Link>
    );
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  const isAdmin = roleRow?.role === "admin" || roleRow?.role === "editor";

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
