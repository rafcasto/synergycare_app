"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, Image as ImageIcon, LogOut, Users } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/leads", label: "Registrations", icon: Users },
  { href: "/admin/content", label: "Page content", icon: FileText },
  { href: "/admin/media", label: "Images", icon: ImageIcon },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-300 bg-white">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href="/admin" className="t-h3" style={{ color: "var(--color-teal-700)" }}>
          SynergyCare
        </Link>

        <nav className="flex flex-wrap gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-[12px] px-3 py-2 text-[15px] transition-colors ${
                  active
                    ? "bg-teal-100 font-medium text-teal-700"
                    : "text-gray-600 hover:bg-sampaguita hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="t-small hidden text-gray-600 sm:inline">{email}</span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="t-small text-teal-700 underline-offset-2 hover:underline"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={signOut}
            className="t-small inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] px-3 text-gray-600 hover:bg-sampaguita hover:text-ink"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
