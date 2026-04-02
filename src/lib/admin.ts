import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Vérifie si l'utilisateur courant a le rôle admin ou editor.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return data?.role === "admin" || data?.role === "editor";
}

/**
 * Guard : redirige vers /connexion si l'utilisateur n'est pas admin.
 * À appeler dans les Server Components / layouts admin.
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/connexion");
  }
}
