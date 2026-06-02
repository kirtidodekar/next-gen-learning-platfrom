"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, BookOpen, Trophy, Star } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "course" | "achievement" | "reminder";
  read: boolean;
  timestamp: Date;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Course Update",
    message: "New lesson available in Advanced React Patterns",
    type: "course",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "2",
    title: "Achievement Unlocked",
    message: "Congratulations! You earned the Week Warrior badge",
    type: "achievement",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    title: "Study Reminder",
    message: "You're 10 minutes away from your daily goal",
    type: "reminder",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="size-4 text-violet-300" />;
      case "achievement":
        return <Trophy className="size-4 text-emerald-300" />;
      case "reminder":
        return <Star className="size-4 text-amber-300" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative grid place-items-center size-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-violet text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
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
              className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto mb-3 size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5 ${
                        !notification.read ? "bg-violet/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-white/5 p-2">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
                            aria-label="Mark as read"
                          >
                            <Check className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
