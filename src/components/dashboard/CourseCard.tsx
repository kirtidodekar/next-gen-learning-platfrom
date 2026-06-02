"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, Code, Brain, Palette, Cloud, Shield, Smartphone, Database, GitBranch, Gauge, Container, Share2, Bot, Eye, Users, FileCode, Layers, Atom } from "lucide-react";

interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
}

interface CourseCardProps {
  course: Course;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="size-6" />,
  Code: <Code className="size-6" />,
  Brain: <Brain className="size-6" />,
  Palette: <Palette className="size-6" />,
  Cloud: <Cloud className="size-6" />,
  Shield: <Shield className="size-6" />,
  Smartphone: <Smartphone className="size-6" />,
  Database: <Database className="size-6" />,
  GitBranch: <GitBranch className="size-6" />,
  Gauge: <Gauge className="size-6" />,
  Container: <Container className="size-6" />,
  Share2: <Share2 className="size-6" />,
  Robot: <Bot className="size-6" />,
  Eye: <Eye className="size-6" />,
  Users: <Users className="size-6" />,
  FileCode: <FileCode className="size-6" />,
  Layers: <Layers className="size-6" />,
  Atom: <Atom className="size-6" />,
};

const gradients = [
  "from-violet/20 to-indigo/20",
  "from-cyan/20 to-blue/20",
  "from-emerald/20 to-teal/20",
  "from-orange/20 to-amber/20",
  "from-pink/20 to-rose/20",
];

const badgeColors = [
  "bg-violet/20 text-violet-300",
  "bg-cyan/20 text-cyan-300",
  "bg-emerald/20 text-emerald-300",
  "bg-orange/20 text-orange-300",
  "bg-pink/20 text-pink-300",
];

export function CourseCard({ course, index }: CourseCardProps) {
  const gradientIndex = index % gradients.length;
  const icon = iconMap[course.icon_name] || <BookOpen className="size-6" />;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -8 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-violet/30 hover:shadow-2xl hover:shadow-violet/10"
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradientIndex]} opacity-0 transition-opacity group-hover:opacity-100`} />

      <section className="relative z-10 p-5">
        <header className="mb-4 flex items-start justify-between">
          <div className={`rounded-xl bg-gradient-to-br ${gradients[gradientIndex]} p-3 ring-1 ring-white/10`}>
            {icon}
          </div>

          <span className={`rounded-lg px-2 py-1 text-xs font-medium ${badgeColors[gradientIndex]}`}>
            {course.progress === 0 ? "Not Started" : course.progress < 30 ? "Beginner" : course.progress < 70 ? "Intermediate" : "Advanced"}
          </span>
        </header>

        <h3 className="mb-3 text-base font-semibold tracking-tight line-clamp-2 min-h-[2.5rem]">
          {course.title}
        </h3>

        {/* Progress section */}
        <footer className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{course.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
              />
            </div>
          </div>

          {/* Continue button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-xl bg-gradient-to-r from-violet to-indigo px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all ${
              course.progress === 0 ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            } hover:shadow-xl hover:shadow-violet/25`}
          >
            <span className="flex items-center justify-center gap-2">
              <Play className="size-4" />
              {course.progress === 0 ? "Start Course" : "Continue"}
            </span>
          </motion.button>
        </footer>
      </section>
    </motion.article>
  );
}
