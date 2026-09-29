"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Plus, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts/new", label: "New post", icon: Plus },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
      <div className="flex items-center gap-1.5">
        <FileText size={20} className="text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Blog Admin
        </span>
        <nav className="ml-6 flex gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/blog"
          target="_blank"
          className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          View blog ↗
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
