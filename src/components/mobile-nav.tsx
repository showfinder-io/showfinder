"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navLinks = [
  { href: "/salons", label: "Salons" },
  { href: "/prestataires", label: "Prestataires" },
  { href: "/lieux", label: "Lieux" },
  { href: "/blog", label: "Blog" },
];

export function MobileNav({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="md:hidden" />
        }
      >
        <Menu className="size-5" />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-paper">
        <SheetHeader>
          <SheetTitle className="font-serif text-lg font-bold tracking-tight">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map(({ href, label }) => (
            <SheetClose key={href} render={<Link href={href} />}>
              <span
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-accent/10 font-medium text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </span>
            </SheetClose>
          ))}
        </nav>
        {/* AuthButton (server component) passé en children */}
        {children && (
          <div className="mt-auto border-t border-border px-4 py-4">
            {children}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
