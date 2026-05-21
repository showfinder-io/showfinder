import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/config";

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // On force le redirect sur le domaine canonical (siteConfig.url) plutôt
      // que window.location.origin : si le user déclenche OAuth depuis
      // showfinder-amber.vercel.app (URL Vercel preview), le callback revient
      // bien sur www.agoris.io.
      redirectTo: `${siteConfig.url}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
