"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, Network, BrainCircuit, FolderKanban
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { name: "Home",    href: "/",          icon: LayoutDashboard },
  { name: "Tasks",   href: "/tasks",     icon: CheckSquare },
  { name: "DSA",     href: "/dsa",       icon: Network },
  { name: "AI/ML",   href: "/ai",        icon: BrainCircuit },
  { name: "Projects",href: "/projects",  icon: FolderKanban },
];

export function MobileNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-zinc-950 border-t border-zinc-800 safe-bottom">
      <div className="flex items-center justify-around px-1 py-2">
        {MOBILE_NAV.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-0"
            >
              <item.icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-600"
                )}
              />
              <span className={cn(
                "text-[10px] font-medium truncate transition-colors",
                isActive ? "text-indigo-400" : "text-zinc-600"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
