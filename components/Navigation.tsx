"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSelector } from "./UserSelector";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/about", label: "サロンの紹介" },
    { href: "/", label: "コンテンツ" },
    { href: "/members", label: "メンバー管理" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900"
            >
              Nappy Salon
            </Link>
            <div className="flex space-x-4">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <UserSelector />
        </div>
      </div>
    </nav>
  );
}
