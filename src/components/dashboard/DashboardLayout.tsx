"use client";

import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: Props) {
  return (
    <main className="relative min-h-dvh flex w-full bg-background text-foreground">
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grain opacity-[0.35]" />
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-[460px] rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <Sidebar />

      <section className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 backdrop-blur-xl px-4 md:px-8 h-16">
          <div className="flex flex-col leading-tight min-w-0">
            <h1 className="text-sm md:text-base font-semibold tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-[11px] md:text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <Search className="size-3.5" aria-hidden />
              <span>Search</span>
              <kbd className="ml-2 rounded bg-background/70 border border-border/70 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="grid place-items-center size-9 rounded-lg border border-border/70 bg-card/60 hover:bg-card transition-colors focus-ring"
            >
              <Bell className="size-4" aria-hidden />
            </button>
            <div
              aria-hidden
              className="grid place-items-center size-9 rounded-full bg-gradient-to-br from-violet to-cyan text-[11px] font-semibold text-primary-foreground ring-1 ring-border/70"
            >
              A
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10">
          {children}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
