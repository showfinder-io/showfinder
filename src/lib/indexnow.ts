/**
 * IndexNow : notification instantanée des moteurs partenaires (Bing, Yandex,
 * Ecosia, Yahoo via l'index Bing, Naver, Seznam) quand une URL est créée ou
 * mise à jour. Complément du Request Indexing GSC, sans quota quotidien.
 *
 * Protocole : POST https://api.indexnow.org/IndexNow avec la clé et la liste
 * d'URLs (max 10 000 par appel). La clé est vérifiée par les moteurs en
 * lisant `keyLocation` sur notre hôte (route src/app/indexnow-key.txt).
 *
 * La clé vit dans INDEXNOW_KEY (variable d'environnement, jamais en dur).
 * Sans clé, `submitIndexNow` ne fait rien et le signale : aucun appel
 * réseau, aucune erreur bloquante (la publication ne doit jamais échouer à
 * cause d'IndexNow).
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const MAX_URLS_PER_CALL = 10_000;

export type IndexNowResult =
  | { status: "skipped"; reason: string }
  | { status: "ok"; httpStatus: number; submitted: number }
  | { status: "error"; httpStatus?: number; message: string };

/** URL publique du site (identique à siteConfig.url, sans dépendre de l'alias @/ pour rester importable depuis scripts/). */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://www.agoris.io").replace(/\/$/, "");
}

/** Clé IndexNow courante, ou null si non configurée. */
export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && key.length >= 8 ? key : null;
}

/** Construit les URLs FR + EN pour un chemin sans préfixe de locale ("/salons/sial-paris"). */
export function localizedUrls(path: string): string[] {
  const site = getSiteUrl();
  const normalized = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
  return [`${site}${normalized || "/"}`, `${site}/en${normalized}`];
}

/**
 * Soumet une liste d'URLs absolues à IndexNow. Les URLs hors de notre hôte
 * sont ignorées (le protocole les rejetterait). Idempotent côté moteurs.
 */
export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = getIndexNowKey();
  if (!key) return { status: "skipped", reason: "INDEXNOW_KEY absente" };

  const site = getSiteUrl();
  const host = new URL(site).host;
  const urlList = Array.from(new Set(urls)).filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
  if (urlList.length === 0) return { status: "skipped", reason: "aucune URL sur l'hôte " + host };
  if (urlList.length > MAX_URLS_PER_CALL) {
    return { status: "error", message: `${urlList.length} URLs > maximum ${MAX_URLS_PER_CALL} par appel` };
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${site}/indexnow-key.txt`,
        urlList,
      }),
    });
    // 200 = OK, 202 = accepté (clé vérifiée plus tard). Tout autre code = erreur.
    if (res.status === 200 || res.status === 202) {
      return { status: "ok", httpStatus: res.status, submitted: urlList.length };
    }
    const body = await res.text().catch(() => "");
    return { status: "error", httpStatus: res.status, message: body.slice(0, 300) || res.statusText };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : String(e) };
  }
}
