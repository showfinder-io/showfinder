/**
 * Wrapper léger pour pousser des events custom dans GA4 via gtag.
 *
 * Le composant <GoogleAnalytics /> charge gtag.js + initialise window.gtag.
 * En dev (sans NEXT_PUBLIC_GA_MEASUREMENT_ID), gtag est undefined et on
 * no-op silencieusement — pas besoin d'envelopper chaque appel d'un try/catch.
 *
 * Convention de nommage : `snake_case` côté GA4 (recommandation Google).
 * Les events listés dans EVENTS sont volontairement fermés (un type union)
 * pour éviter qu'un dev tape `seach_submit` à côté de `search_submit` et
 * pollue les rapports avec une variante.
 */

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type AgorisEvent =
  // Découverte / recherche
  | "search_submit"
  | "filter_change"
  // Engagement contenu
  | "salon_outbound_click"
  | "venue_outbound_click"
  | "provider_drawer_open"
  // Conversion
  | "alert_subscribe"
  | "quote_request_submit"
  | "contact_form_submit"
  | "review_submit"
  // Auth
  | "signup_attempt"
  | "login_attempt";

export function trackEvent(
  event: AgorisEvent,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  // Strip undefined params (gtag les sérialise sinon en string "undefined").
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      )
    : undefined;
  window.gtag("event", event, cleanParams);
}
