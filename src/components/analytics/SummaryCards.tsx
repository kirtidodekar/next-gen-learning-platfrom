"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Trophy, Flame } from "lucide-react";
import type { DashboardMetrics } from "@/types/analytics";

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Study Time",
      value: `${Math.floor(metrics.totalStudyTime / 60)}h ${metrics.totalStudyTime % 60}m`,
      icon: Clock,
      color: "from-violet/20 to-indigo/20",
      iconColor: "text-violet-300",
    },
    {
      title: "Active Courses",
      value: metrics.activeCourses.toString(),
      icon: BookOpen,
      color: "from-cyan/20 to-blue/20",
      iconColor: "text-cyan-300",
    },
    {
      title: "Completed",
      value: metrics.completedCourses.toString(),
      icon: Trophy,
      color: "from-emerald/20 to-green/20",
      iconColor: "text-emerald-300",
    },
    {
      title: "Current Streak",
      value: `${metrics.currentStreak} days`,
      subtitle: `Best: ${metrics.longestStreak} days`,
      icon: Flame,
      color: "from-orange/20 to-amber/20",
      iconColor: "text-orange-300",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl"
          >
            <div className="mb-3 sm:mb-4 flex items-start justify-between">
              <div className={`rounded-xl bg-gradient-to-br ${card.color} p-2.5 sm:p-3 ring-1 ring-white/10`}>
                <Icon className={`size-4 sm:size-5 ${card.iconColor}`} />
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{card.title}</h3>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold tracking-tight">{card.value}</p>
            {card.subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
