"use client";

import { motion } from "framer-motion";

interface GoalRingProps {
  progress: number;
  goal: number;
}

export function GoalRing({ progress, goal }: GoalRingProps) {
  const percentage = Math.min((progress / goal) * 100, 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * percentage) / 100;

  return (
    <article className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        className="relative"
      >
        <svg width="100" height="100" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-2xl font-bold"
          >
            {Math.round(percentage)}%
          </motion.span>
          <span className="text-[10px] text-muted-foreground">of goal</span>
        </div>
      </motion.div>

      <p className="text-xs font-medium text-muted-foreground">
        {progress}/{goal} min
      </p>
    </article>
  );
}
