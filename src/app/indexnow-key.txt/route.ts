import { getIndexNowKey } from "@/lib/indexnow";

/**
 * Fichier de vérification IndexNow : les moteurs lisent cette URL
 * (keyLocation) et vérifient que son contenu est égal à la clé envoyée.
 * Servi depuis l'env INDEXNOW_KEY (pas de fichier statique avec la clé en
 * dur dans le repo). 404 tant que la clé n'est pas configurée.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const key = getIndexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
