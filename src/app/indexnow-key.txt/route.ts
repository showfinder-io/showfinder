import { getIndexNowKey } from "@/lib/indexnow";

/**
 * Fichier de vérification IndexNow : les moteurs lisent cette URL
 * (keyLocation) et vérifient que son contenu est égal à la clé envoyée.
 * Contenu : la clé publique de src/lib/indexnow.ts.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(getIndexNowKey(), {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
