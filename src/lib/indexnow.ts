/**
 * IndexNow : notification instantanée des moteurs partenaires (Bing, Yandex,
 * Ecosia, Yahoo via l'index Bing, Naver, Seznam) quand une URL est créée ou
 * mise à jour. Complément du Request Indexing GSC, sans quota quotidien.
 *
 * Protocole : POST https://api.indexnow.org/IndexNow avec la clé et la liste
 * d'URLs (max 10 000 par appel). La clé est vérifiée par les moteurs en
 * lisant `keyLocation` sur notre hôte (route src/app/indexnow-key.txt).
 *
 * Clé en dur, exception assumée à la règle "jamais de clé en dur" (décision
 * Julien 2026-10-02) : une clé IndexNow n'est pas un secret, le protocole
 * impose de la publier en clair à keyLocation pour prouver le contrôle du
 * domaine. Elle remplace INDEXNOW_KEY, qui n'a jamais pu être posée sur
 * Vercel (projet visible du seul compte propriétaire). Les échecs ne sont
 * jamais bloquants (la publication ne doit jamais échouer à cause d'IndexNow).
 */

const INDEXNOW_KEY = "55f138f0a93fb9f23df2ea0cd6c866d6";

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

/** Clé IndexNow (publique par conception, servie sur /indexnow-key.txt). */
export function getIndexNowKey(): string {
  return INDEXNOW_KEY;
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
