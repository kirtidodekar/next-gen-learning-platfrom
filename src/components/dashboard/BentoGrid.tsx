"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(140px,auto)] gap-4 md:gap-5"
    >
      {children}
    </motion.div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function BentoItem({ children, className = "", interactive = true }: BentoItemProps) {
  return (
    <motion.article
      variants={item}
      whileHover={interactive ? { scale: 1.015 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`gradient-border relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl shadow-card ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.article>
  );
}
