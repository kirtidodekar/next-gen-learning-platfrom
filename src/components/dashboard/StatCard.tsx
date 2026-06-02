"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  delay?: number;
}

export function StatCard({ title, value, change, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:border-violet/30 hover:bg-white/10"
    >
      {/* Animated border glow */}
      <motion.div
        initial={false}
        animate={{
          background: [
            "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
            "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      />

      <section className="relative z-10">
        <header className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-gradient-to-br from-violet/20 to-cyan/20 p-3 ring-1 ring-white/10">
            {icon}
          </div>

          {change !== undefined && (
            <div
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                change >= 0
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {change >= 0 ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </header>

        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      </section>
    </motion.article>
  );
}
