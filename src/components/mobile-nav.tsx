"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config";
import { useState } from "react";

const NAV_HREFS = [
  "/salons",
  "/lieux",
  "/secteurs",
  "/prestataires",
  "/blog",
] as const;

type NavHref = (typeof NAV_HREFS)[number];

const NAV_KEYS: Record<NavHref, string> = {
  "/salons": "salons",
  "/lieux": "lieux",
  "/secteurs": "secteurs",
  "/prestataires": "prestataires",
  "/blog": "blog",
};

export function MobileNav({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="md:hidden" />
        }
      >
        <Menu className="size-5" />
        <span className="sr-only">{t("menuAriaLabel")}</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-paper">
        <SheetHeader>
          <SheetTitle className="font-serif text-lg font-bold tracking-tight">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_HREFS.map((href) => (
            <SheetClose key={href} render={<Link href={href} />}>
              <span
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-accent/10 font-medium text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {t(NAV_KEYS[href])}
              </span>
            </SheetClose>
          ))}
        </nav>
        {children && (
          <div className="mt-auto border-t border-border px-4 py-4">
            {children}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
