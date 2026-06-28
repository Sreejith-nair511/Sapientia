"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Code2, Network, Trophy, Cpu, Layers,
  BrainCircuit, FolderKanban, Briefcase, GraduationCap, Library,
  Settings, User, Activity, BarChart2, CheckSquare, X, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const navigation = [
  { section: "Overview", items: [
    { name: "Dashboard",    href: "/",           icon: LayoutDashboard },
    { name: "Task Manager", href: "/tasks",       icon: CheckSquare },
    { name: "Roadmaps",     href: "/roadmap",     icon: Map },
    { name: "Analytics",    href: "/analytics",   icon: BarChart2 },
  ]},
  { section: "Curriculum", items: [
    { name: "DSA",               href: "/dsa",          icon: Network },
    { name: "Programming",       href: "/programming",  icon: Terminal },
    { name: "Full Stack",        href: "/full-stack",   icon: Layers },
    { name: "AI & ML",           href: "/ai",           icon: BrainCircuit },
    { name: "Competitive Prog.", href: "/cp",           icon: Trophy },
    { name: "Core CS",           href: "/core-cs",      icon: Cpu },
  ]},
  { section: "Build & Ship", items: [
    { name: "Projects",    href: "/projects",    icon: FolderKanban },
    { name: "Placements",  href: "/placements",  icon: Briefcase },
    { name: "GATE",        href: "/gate",        icon: GraduationCap },
    { name: "Resources",   href: "/resources",   icon: Library },
  ]},
];

const secondaryNavigation = [
  { name: "Profile",   href: "/profile",   icon: User },
  { name: "Settings",  href: "/settings",  icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-950 border-r border-zinc-800">
      {/* Logo row */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Cpu className="size-4 text-white" />
          </div>
          <span className="text-zinc-100">EngOS</span>
        </Link>
        {/* Close button (mobile only) */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-500 hover:text-zinc-200 lg:hidden"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-5">
          {navigation.map(section => (
            <div key={section.section}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                {section.section}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                      )}
                    >
                      <item.icon className={cn("size-4 shrink-0", isActive ? "text-indigo-400" : "text-zinc-600")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Secondary nav */}
        <div className="mt-5">
          <p className="mb-1.5 px-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Personal</p>
          <div className="space-y-0.5 pb-4">
            {secondaryNavigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                  )}
                >
                  <item.icon className="size-4 shrink-0 text-zinc-600" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
