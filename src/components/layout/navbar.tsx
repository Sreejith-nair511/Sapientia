"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search, Menu, MoonIcon, SunIcon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { setTheme, theme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl px-4 shrink-0">
      {/* Left: hamburger (mobile) + search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-zinc-500 hover:text-zinc-200 lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>

        {/* Search — full on desktop, icon+expand on mobile */}
        <div className="hidden sm:flex relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
          <Input
            placeholder="Search topics, problems, resources..."
            className="w-full bg-zinc-900 border-zinc-800 text-zinc-400 pl-8 pr-3 h-8 text-sm rounded-lg focus-visible:ring-indigo-500/50 placeholder:text-zinc-600"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 text-[10px] text-zinc-600 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Mobile search toggle */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-0 h-14 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center gap-2 z-10 sm:hidden">
            <Search className="size-4 text-zinc-500 shrink-0" />
            <Input
              autoFocus
              placeholder="Search..."
              className="flex-1 bg-transparent border-0 text-zinc-300 text-sm focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => setSearchOpen(false)}>
              <X className="size-4 text-zinc-500" />
            </Button>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-zinc-500 hover:text-zinc-200 sm:hidden shrink-0"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4" />
        </Button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="size-9 text-zinc-500 hover:text-zinc-200 relative">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-indigo-400" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-zinc-500 hover:text-zinc-200"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <div className="ml-1">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
