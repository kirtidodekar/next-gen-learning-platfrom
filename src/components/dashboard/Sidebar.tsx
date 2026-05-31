import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  LineChart,
  Settings,
  Sparkles,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Courses", to: "/courses", icon: GraduationCap },
  { label: "Analytics", to: "/analytics", icon: LineChart },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 244 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="hidden md:flex sticky top-0 h-dvh flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl"
      aria-label="Primary"
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border/60">
        <div className="grid place-items-center size-9 rounded-xl bg-gradient-to-br from-violet to-indigo ring-glow">
          <Sparkles className="size-4 text-primary-foreground" aria-hidden />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">NextGen</span>
            <span className="text-[11px] text-muted-foreground">Learning OS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.to === "/"
              ? pathname === "/"
              : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors focus-ring"
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet/20 to-indigo/15 ring-1 ring-inset ring-violet/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={`relative size-4 shrink-0 ${active ? "text-foreground" : ""}`}
                    aria-hidden
                  />
                  {!collapsed && (
                    <span className={`relative ${active ? "text-foreground font-medium" : ""}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border/60">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center w-full gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors focus-ring"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="inline-flex"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </motion.span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
