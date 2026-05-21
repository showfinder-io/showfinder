import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const CANONICAL_HOST = "www.agoris.io";
const LEGACY_HOSTS = new Set(["showfinder-amber.vercel.app", "agoris.io"]);

export async function proxy(request: NextRequest) {
  // Redirige les hôtes legacy (URL Vercel preview de main + apex) vers le
  // domaine canonical pour éviter qu'un visiteur reste bloqué sur le preview
  // Vercel après login (cf. bug Nicolas 2026-05-19). 308 = permanent + méthode
  // préservée. Toutes les autres URL Vercel (previews de branches) restent
  // intactes — elles ne sont pas dans la liste.
  if (LEGACY_HOSTS.has(request.nextUrl.hostname)) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
