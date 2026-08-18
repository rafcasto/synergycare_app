import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — SynergyCare admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-[420px]">
        <p className="t-h3" style={{ color: "var(--color-teal-700)" }}>
          SynergyCare
        </p>
        <h1 className="t-h2 mt-2 text-ink">Admin sign in</h1>
        <p className="t-body mt-2 text-gray-600">
          Manage the landing page and see who has registered.
        </p>

        <div
          className="mt-8 rounded-[16px] bg-white p-6"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <LoginForm />
        </div>

        <p className="t-small mt-6 text-gray-600">
          <a href="/" className="text-teal-700 underline-offset-2 hover:underline">
            ← Back to the landing page
          </a>
        </p>
      </div>
    </main>
  );
}
