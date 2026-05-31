import { motion } from "framer-motion";
import type { Course } from "@/types/course";
import { resolveIcon } from "./icon-map";
import { BentoItem } from "./BentoGrid";

const meshes = [
  "from-violet/25 via-violet/10 to-transparent",
  "from-indigo/25 via-indigo/10 to-transparent",
  "from-cyan/25 via-cyan/10 to-transparent",
  "from-emerald/25 via-emerald/10 to-transparent",
];

interface Props { course: Course; index: number }

export function CourseCard({ course, index }: Props) {
  const Icon = resolveIcon(course.icon_name);
  const mesh = meshes[index % meshes.length];

  return (
    <BentoItem className="lg:col-span-2 min-h-[180px]">
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${mesh} opacity-90`}
      />
      <div
        aria-hidden
        className="absolute -top-12 -right-12 size-40 rounded-full bg-foreground/[0.04] blur-2xl"
      />

      <div className="relative z-10 flex h-full flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="grid place-items-center size-10 rounded-xl bg-background/60 backdrop-blur border border-border/70">
            <Icon className="size-5 text-foreground" aria-hidden />
          </div>
          <span
            className="text-xs font-medium text-muted-foreground tabular-nums"
            aria-hidden
          >
            {course.progress}%
          </span>
        </header>

        <div className="mt-auto flex flex-col gap-2.5">
          <h3 className="text-base font-semibold tracking-tight leading-snug">
            {course.title}
          </h3>

          <div
            className="relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuenow={course.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet via-indigo to-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
                delay: 0.2 + index * 0.05,
              }}
            />
          </div>
        </div>
      </div>
    </BentoItem>
  );
}
