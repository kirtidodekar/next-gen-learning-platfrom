"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Trophy, LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { profile, user, signOut } = useAuth();

  const userName = profile?.full_name || user?.user_metadata?.full_name || "Learner";
  const userEmail = profile?.email || user?.email || "";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
    router.refresh();
  };

  const menuItems = [
    {
      icon: <User className="size-4" />,
      label: "Profile",
      action: () => router.push("/settings"),
    },
    {
      icon: <Trophy className="size-4" />,
      label: "Achievements",
      action: () => router.push("/analytics"),
    },
    {
      icon: <Settings className="size-4" />,
      label: "Settings",
      action: () => router.push("/settings"),
    },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 hover:bg-white/10 transition-colors"
        aria-label="Profile menu"
      >
        <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-xs font-semibold text-white overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="size-full object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl"
            >
              {/* Profile Header */}
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-lg font-semibold text-white overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className="size-full object-cover" />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground hover:bg-white/5 transition-colors"
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-white/10 p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
