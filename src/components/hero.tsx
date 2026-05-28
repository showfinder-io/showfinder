"use client";

import { trackEvent } from "@/lib/analytics";

type HeroProps = {
  /** Total de salons indexés (récupéré côté serveur, ex: count de getSalons). */
  totalSalons: number;
};

/**
 * Hero V1 refondu — Agoris, mai 2026.
 * Composition éditoriale :
 *  - eyebrow mono uppercase ocre-dim ("Le forum des salons · Édition 2026")
 *  - titre Fraunces clamp 72→132px, max 12ch, point ocre final
 *  - sub Fraunces italic 22px, max 52ch, text-muted
 *  - search underline 2px prune (focus → ocre), arrow ocre à droite
 *  - hint mono "{N} salons indexés" avec N en Fraunces ocre
 *  - watermark : symbole 680px à droite (right:-80px), opacity 0.07
 *
 * Le form post sur /salons via la query `?search=...` pour réutiliser la liste
 * filtrée existante.
 */
export function Hero({ totalSalons }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-sable">
      {/* Watermark symbole — SVG inline EXACT selon brief V1 :
       *  6 cercles, tous en Prune #3B1F33, viewBox 100×100.
       *  680×680px positionné right:-80px, opacity 0.07, pointer-events none.
       *  Volontairement inline (pas via AgorisMark composant) pour garantir
       *  le rendu pixel-perfect du brief sans dépendance d'autres props. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-[0.07]"
        style={{ right: "-80px", width: "680px", height: "680px", zIndex: 0 }}
      >
        <circle cx="50" cy="28" r="5.5" fill="#3B1F33" />
        <circle cx="71" cy="43" r="5" fill="#3B1F33" />
        <circle cx="29" cy="43" r="5" fill="#3B1F33" />
        <circle cx="63" cy="68" r="5" fill="#3B1F33" />
        <circle cx="37" cy="68" r="5" fill="#3B1F33" />
        <circle cx="50" cy="51" r="3" fill="#3B1F33" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-24 pt-22 md:px-14 md:pb-24">
        <p
          className="font-mono uppercase text-[var(--color-warning)]"
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            marginBottom: "28px",
          }}
        >
          Le forum des salons · Édition 2026
        </p>

        <h1
          className="font-serif font-normal text-prune"
          style={{
            fontSize: "clamp(72px, 9vw, 132px)",
            lineHeight: "0.95",
            letterSpacing: "-0.022em",
            maxWidth: "12ch",
            fontVariationSettings: "'opsz' 144",
          }}
        >
          Là où les industries se retrouvent
          <em className="not-italic text-ocre">.</em>
        </h1>

        <p
          className="font-serif italic font-normal text-muted"
          style={{
            fontSize: "22px",
            lineHeight: "1.4",
            marginTop: "28px",
            maxWidth: "52ch",
            fontVariationSettings: "'opsz' 36",
          }}
        >
          L&apos;annuaire intelligent des salons professionnels en France&nbsp;: visitez les bons salons, organisez votre stand, développez votre business.
        </p>

        <form
          action="/salons"
          method="get"
          className="relative mt-14 max-w-[720px]"
          role="search"
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            const query = String(formData.get("search") ?? "").trim();
            if (query.length > 0) {
              trackEvent("search_submit", { query, source: "home" });
            }
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="ex. SantExpo, agroalimentaire, Lyon…"
            aria-label="Rechercher un salon, un secteur ou une ville"
            className="peer w-full border-0 border-b-2 border-prune bg-transparent py-3.5 pl-0 pr-14 font-serif italic font-normal text-prune outline-none placeholder:italic placeholder:text-muted/55 focus:border-ocre"
            style={{
              fontSize: "24px",
              fontVariationSettings: "'opsz' 36",
            }}
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent font-serif text-[28px] leading-none text-ocre opacity-35 transition-[opacity,transform] duration-200 hover:opacity-100 peer-focus:translate-x-1 peer-focus:opacity-100"
          >
            →
          </button>
        </form>

        <p
          className="font-mono uppercase text-muted/70"
          style={{
            fontSize: "11px",
            letterSpacing: "0.16em",
            marginTop: "14px",
          }}
        >
          <span
            className="font-serif text-ocre"
            style={{
              fontSize: "13px",
              letterSpacing: "-0.01em",
              fontStyle: "normal",
              marginRight: "2px",
            }}
          >
            {totalSalons}
          </span>{" "}
          salons indexés
        </p>
      </div>
    </section>
  );
}
