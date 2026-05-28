import { createClient } from "@/lib/supabase/client";

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
      // window.location.origin : le middleware proxy.ts redirige déjà
      // showfinder-amber.vercel.app et apex agoris.io vers www.agoris.io
      // avant le clic Login, donc l'origin sera toujours le canonical.
      // Évite un mismatch redirect_to si NEXT_PUBLIC_APP_URL tombe sur le
      // fallback apex (cause du bug Google login 2026-05-28).
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
