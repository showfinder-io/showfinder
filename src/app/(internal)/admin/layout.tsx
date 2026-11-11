import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin-sidebar";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">{children}</div>
    </div>
  );
}
