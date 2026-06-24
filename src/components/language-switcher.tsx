"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { I18N_EN_ENABLED } from "@/lib/i18n/config";
import type { AppLocale } from "@/i18n/routing";

/**
 * Selecteur de langue FR | EN, en haut a droite du header.
 *
 * - Bascule entre la locale courante et l'autre en CONSERVANT le chemin
 *   (usePathname/useRouter de next-intl gerent le prefixe /en automatiquement).
 * - MASQUE tant que le corpus EN n'est pas pret (flag I18N_EN_ENABLED = false).
 *   En Phase 0 le composant ne rend donc rien.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LanguageSwitcher");

  // Gate Phase 0 : pas de switcher tant que l'EN n'est pas active.
  if (!I18N_EN_ENABLED) {
    return null;
  }

  function switchTo(target: AppLocale) {
    if (target === locale) return;
    // Conserve le chemin courant, next-intl ajuste le prefixe de locale.
    router.replace(pathname, { locale: target });
  }

  const isFr = locale === "fr";

  return (
    <div
      className="flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
      role="group"
      aria-label={t("label")}
    >
      <button
        type="button"
        onClick={() => switchTo("fr")}
        aria-current={isFr ? "true" : undefined}
        aria-label={t("switchToFr")}
        className={
          isFr
            ? "text-prune"
            : "text-muted transition-colors hover:text-prune"
        }
      >
        {t("fr")}
      </button>
      <span aria-hidden="true" className="text-muted/50">
        |
      </span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-current={!isFr ? "true" : undefined}
        aria-label={t("switchToEn")}
        className={
          !isFr
            ? "text-prune"
            : "text-muted transition-colors hover:text-prune"
        }
      >
        {t("en")}
      </button>
    </div>
  );
}
