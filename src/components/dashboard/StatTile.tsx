"use client";

import { motion } from "framer-motion";
import { Clock, Trophy } from "lucide-react";
import { BentoItem } from "./BentoGrid";

export function StatTile() {
  return (
    <BentoItem className="lg:col-span-2 min-h-[180px]">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-indigo/15 via-violet/10 to-transparent"
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="grid place-items-center size-10 rounded-xl bg-background/60 backdrop-blur border border-border/70">
            <Trophy className="size-5 text-foreground" aria-hidden />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">This week</span>
        </div>
        <div className="flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight tabular-nums"
          >
            4h 32m
          </motion.span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden /> Focus time, +18% vs last week
          </span>
        </div>
      </div>
    </BentoItem>
  );
}
