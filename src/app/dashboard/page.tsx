"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  Trophy,
  Flame,
  GraduationCap,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function DashboardContent() {
  const { profile, user } = useAuth();

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "Learner";
  const email = profile?.email || user?.email || "";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  const quickActions = [
    {
      label: "Continue Learning",
      description: "Pick up where you left off",
      icon: BookOpen,
      href: "/courses",
      color: "from-violet to-indigo",
      iconColor: "text-violet-300",
    },
    {
      label: "Browse Courses",
      description: "Discover new courses",
      icon: GraduationCap,
      href: "/courses",
      color: "from-cyan to-blue",
      iconColor: "text-cyan-300",
    },
    {
      label: "View Analytics",
      description: "Track your progress",
      icon: BarChart3,
      href: "/analytics",
      color: "from-emerald to-teal",
      iconColor: "text-emerald-300",
    },
    {
      label: "Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/settings",
      color: "from-orange to-amber",
      iconColor: "text-orange-300",
    },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Continue learning where you left off">
      <main className="space-y-8">
        {/* Welcome Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-violet/10 via-black/50 to-cyan/10 p-5 sm:p-8 backdrop-blur-xl"
        >
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
          <div className="relative z-10">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back, {fullName} 👋
            </h1>
            <p className="mb-6 text-muted-foreground">
              Ready to continue your learning journey?
            </p>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet to-indigo px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet/25"
            >
              Continue Learning
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>

        {/* User Info Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <User className="size-4 text-violet-300" />
              <span className="text-xs text-muted-foreground">Full Name</span>
            </div>
            <p className="text-lg font-semibold">{fullName}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <Mail className="size-4 text-cyan-300" />
              <span className="text-xs text-muted-foreground">Email</span>
            </div>
            <p className="truncate text-sm font-medium">{email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="size-4 text-emerald-300" />
              <span className="text-xs text-muted-foreground">Member Since</span>
            </div>
            <p className="text-lg font-semibold">{memberSince}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="size-4 text-orange-300" />
              <span className="text-xs text-muted-foreground">Current Streak</span>
            </div>
            <p className="text-lg font-semibold">7 days</p>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          aria-label="Statistics"
          className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
        >
          {[
            { title: "Total Study Time", value: "4h 5m", icon: Clock, color: "text-violet-300", change: 12 },
            { title: "Active Courses", value: "3", icon: BookOpen, color: "text-cyan-300" },
            { title: "Completed", value: "1", icon: Trophy, color: "text-emerald-300", change: 25 },
            { title: "Current Streak", value: "7 days", icon: Flame, color: "text-orange-300", change: 40 },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-lg bg-white/10 p-2 ${stat.color}`}>
                  <stat.icon className="size-4" />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-emerald-400">+{stat.change}%</span>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="group block rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${action.color} p-2.5`}>
                    <action.icon className="size-5 text-white" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Open</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
