"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, GraduationCap, LineChart, Settings, type LucideIcon } from "lucide-react";

interface Item { label: string; to: string; icon: LucideIcon }
const items: Item[] = [
  { label: "Home", to: "/", icon: LayoutDashboard },
  { label: "Courses", to: "/courses", icon: GraduationCap },
  { label: "Stats", to: "/analytics", icon: LineChart },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-border/60 bg-sidebar/80 backdrop-blur-xl shadow-card"
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
          return (
            <li key={it.to}>
              <Link
                href={it.to}
                className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground focus-ring rounded-2xl"
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
              >
                {active && (
                  <motion.span
                    layoutId="active-bottom-nav"
                    className="absolute inset-1 rounded-xl bg-gradient-to-r from-violet/25 to-indigo/15 ring-1 ring-violet/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`relative size-5 ${active ? "text-foreground" : ""}`} aria-hidden />
                <span className={`relative ${active ? "text-foreground font-medium" : ""}`}>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
