import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "SynergyCare admin",
  robots: { index: false, follow: false },
};

// Admin pages always reflect the live database — never a cached snapshot.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage();

  return (
    <div className="min-h-screen">
      <AdminNav email={admin.email} />
      <main className="mx-auto w-full max-w-[1120px] px-5 py-10">{children}</main>
    </div>
  );
}
