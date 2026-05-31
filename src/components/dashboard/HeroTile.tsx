import { motion } from "framer-motion";
import { Flame, ArrowUpRight } from "lucide-react";
import { BentoItem } from "./BentoGrid";

export function HeroTile() {
  return (
    <BentoItem className="lg:col-span-4 lg:row-span-2 min-h-[260px]">
      {/* animated gradient backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-mesh opacity-90"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      {/* floating glow */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -right-16 size-72 rounded-full bg-violet/30 blur-3xl"
        animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-20 -left-10 size-64 rounded-full bg-cyan/25 blur-3xl"
        animate={{ y: [0, -14, 0], x: [0, 14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-6 md:p-8">
        <header className="flex flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/40 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground w-fit"
          >
            <span className="size-1.5 rounded-full bg-emerald" />
            Continuing where you left off
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 24 }}
            className="text-3xl md:text-5xl font-semibold tracking-tight"
          >
            Welcome back, <span className="bg-gradient-to-r from-violet via-indigo to-cyan bg-clip-text text-transparent">Alex</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-sm md:text-base text-muted-foreground max-w-md"
          >
            You're on a roll. Keep momentum with 25 minutes of focused practice today.
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/40 backdrop-blur px-3.5 py-2">
            <Flame className="size-4 text-orange-400" aria-hidden />
            <span className="text-sm font-medium">
              <span className="text-foreground">12 Day Streak</span>{" "}
              <span className="text-muted-foreground">· Learning streak</span>
            </span>
          </div>
          <button
            type="button"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:opacity-90 transition-opacity focus-ring"
          >
            Resume session
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </button>
        </motion.div>
      </div>
    </BentoItem>
  );
}
