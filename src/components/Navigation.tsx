"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, GitBranch } from "lucide-react";

const patterns = [
  { href: "/concierge", label: "Concierge", icon: Sparkles },
  { href: "/board", label: "Board", icon: LayoutGrid },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-semibold text-sm text-gray-900 tracking-tight">SIMADA</span>
          </Link>
          <div className="flex gap-0.5">
            {patterns.map((p) => {
              const isActive = pathname.startsWith(p.href);
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="hidden sm:inline">{p.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
