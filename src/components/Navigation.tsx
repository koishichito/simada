"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const patterns = [
  { href: "/concierge", label: "Concierge-first", short: "1" },
  { href: "/board", label: "Request Board", short: "2" },
  { href: "/pipeline", label: "Pipeline OS", short: "3" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg text-gray-900">
            SIMADA
          </Link>
          <div className="flex gap-1">
            {patterns.map((p) => {
              const isActive = pathname.startsWith(p.href);
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">{p.label}</span>
                  <span className="sm:hidden">型{p.short}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
