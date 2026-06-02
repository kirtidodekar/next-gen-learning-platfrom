"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { GoalRing } from "./GoalRing";
import { StreakCounter } from "./StreakCounter";

interface HeroHeaderProps {
  userName: string;
  dailyGoal: number;
  dailyProgress: number;
  currentStreak: number;
}

const motivationalTexts = [
  "Keep pushing forward! 🚀",
  "You're on fire today! 🔥",
  "Every step counts! 💪",
  "Learning mode: activated! 🎯",
];

export function HeroHeader({ userName, dailyGoal, dailyProgress, currentStreak }: HeroHeaderProps) {
  const [motivationalIndex, setMotivationalIndex] = useState(0);

  useEffect(() => {
    // Generate random index only on client to avoid hydration mismatch
    setMotivationalIndex(Math.floor(Math.random() * motivationalTexts.length));
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/10 via-black/50 to-cyan/10 p-8 backdrop-blur-xl"
    >
      {/* Animated gradient overlay */}
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

      <section className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <article className="flex-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="size-5 text-violet-300" />
            <span className="text-xs font-medium uppercase tracking-wider text-violet-300">
              Daily Progress
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Welcome back, {userName} 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground"
          >
            {motivationalTexts[motivationalIndex]}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet to-indigo px-6 py-3 text-sm font-semibold text-white transition-shadow"
          >
            Continue Learning
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </article>

        <aside className="flex items-center gap-6">
          <GoalRing progress={dailyProgress} goal={dailyGoal} />
          <StreakCounter streak={currentStreak} />
        </aside>
      </section>
    </motion.header>
  );
}
