"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BentoItem } from "./BentoGrid";

const WEEKS = 14;
const DAYS = 7;

// Deterministic mock activity (Mulberry32)
function makeData(seed = 42): number[][] {
  let s = seed;
  const rand = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const data: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: number[] = [];
    for (let d = 0; d < DAYS; d++) {
      const r = rand();
      const v = r < 0.25 ? 0 : r < 0.55 ? 1 : r < 0.8 ? 2 : r < 0.94 ? 3 : 4;
      col.push(v);
    }
    data.push(col);
  }
  return data;
}

const levelClass = [
  "bg-foreground/[0.06]",
  "bg-emerald/25",
  "bg-emerald/45",
  "bg-emerald/70",
  "bg-emerald",
];

export function ActivityTile() {
  const data = useMemo(() => makeData(), []);
  const [hover, setHover] = useState<{ w: number; d: number; v: number } | null>(null);

  const total = useMemo(
    () => data.flat().reduce((a, b) => a + b, 0),
    [data],
  );

  return (
    <BentoItem className="lg:col-span-6 min-h-[220px]">
      <div className="relative z-10 flex h-full flex-col gap-4 p-5 md:p-6">
        <header className="flex items-end justify-between gap-3 flex-wrap">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold tracking-tight">Activity</h3>
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{total}</span> sessions in the last {WEEKS} weeks
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            {levelClass.map((c, i) => (
              <span key={i} className={`size-3 rounded-[3px] ${c}`} aria-hidden />
            ))}
            <span>More</span>
          </div>
        </header>

        <div
          className="relative overflow-x-auto pb-1"
          role="img"
          aria-label={`Activity heatmap, ${total} total sessions across the last ${WEEKS} weeks`}
        >
          <div
            className="grid grid-flow-col gap-1.5"
            style={{ gridTemplateRows: `repeat(${DAYS}, minmax(0, 1fr))` }}
          >
            {data.map((col, w) =>
              col.map((v, d) => (
                <motion.div
                  key={`${w}-${d}`}
                  className={`size-3.5 md:size-4 rounded-[4px] ${levelClass[v]} cursor-pointer`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: (w * DAYS + d) * 0.004,
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                  }}
                  whileHover={{ scale: 1.35 }}
                  onMouseEnter={() => setHover({ w, d, v })}
                  onMouseLeave={() => setHover(null)}
                />
              )),
            )}
          </div>

          {hover && (
            <motion.div
              key={`${hover.w}-${hover.d}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute -top-1 right-0 rounded-md border border-border/70 bg-background/90 backdrop-blur px-2 py-1 text-[11px] text-foreground shadow-card"
              role="status"
            >
              {hover.v} session{hover.v === 1 ? "" : "s"} · week {hover.w + 1}, day {hover.d + 1}
            </motion.div>
          )}
        </div>
      </div>
    </BentoItem>
  );
}
