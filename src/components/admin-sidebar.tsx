"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/salons", label: "Salons" },
  { href: "/admin/venues", label: "Venues" },
  { href: "/admin/secteurs", label: "Secteurs" },
  { href: "/admin/prestataires", label: "Prestataires" },
  { href: "/admin/reports", label: "Signalements" },
  { href: "/admin/avis", label: "Avis" },
  { href: "/admin/alertes", label: "Alertes" },
  { href: "/admin/devis", label: "Devis" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-paper p-4 lg:block">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
        Administration
      </h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-ink hover:bg-border/50"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
