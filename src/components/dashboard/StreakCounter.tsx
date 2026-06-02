"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <article className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="relative rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 backdrop-blur-xl"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-xl"
        />

        <div className="relative flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame className="size-6 text-orange-400" />
          </motion.div>
          <span className="text-2xl font-bold text-orange-300">{streak}</span>
        </div>
      </motion.div>

      <p className="text-xs font-medium text-muted-foreground">day streak</p>
    </article>
  );
}
