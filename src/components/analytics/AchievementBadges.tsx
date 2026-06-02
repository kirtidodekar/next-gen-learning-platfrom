"use client";

import { motion } from "framer-motion";
import { Star, Flame, Award, BookOpen, Lock } from "lucide-react";
import type { UserAchievement, AchievementType, AchievementDefinition } from "@/types/analytics";

interface AchievementBadgesProps {
  unlockedAchievements: UserAchievement[];
}

const ACHIEVEMENTS: Record<AchievementType, AchievementDefinition> = {
  first_lesson: {
    type: "first_lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "Star",
    color: "#fbbf24",
  },
  streak_7_days: {
    type: "streak_7_days",
    title: "Week Warrior",
    description: "Maintain a 7-day study streak",
    icon: "Flame",
    color: "#f97316",
  },
  streak_30_days: {
    type: "streak_30_days",
    title: "Monthly Master",
    description: "Maintain a 30-day study streak",
    icon: "Flame",
    color: "#ef4444",
  },
  course_completed: {
    type: "course_completed",
    title: "Course Champion",
    description: "Complete your first course",
    icon: "Award",
    color: "#10b981",
  },
};

const iconMap = {
  Star,
  Flame,
  Award,
  BookOpen,
};

export function AchievementBadges({ unlockedAchievements }: AchievementBadgesProps) {
  const unlockedTypes = new Set(unlockedAchievements.map((a) => a.achievement_type));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Achievements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {unlockedAchievements.length} of {Object.keys(ACHIEVEMENTS).length} unlocked
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.values(ACHIEVEMENTS).map((achievement, index) => {
          const isUnlocked = unlockedTypes.has(achievement.type);
          const Icon = iconMap[achievement.icon as keyof typeof iconMap];
          const unlockedData = unlockedAchievements.find(
            (a) => a.achievement_type === achievement.type
          );

          return (
            <motion.div
              key={achievement.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                isUnlocked
                  ? "border-white/20 bg-white/10"
                  : "border-white/5 bg-white/5 opacity-50"
              }`}
            >
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="absolute -right-4 -top-4 size-16 rounded-full blur-2xl"
                  style={{ backgroundColor: achievement.color + "40" }}
                />
              )}

              <div className="relative">
                <div
                  className={`mb-3 inline-flex rounded-lg p-2.5 ${
                    isUnlocked ? "ring-1 ring-white/10" : ""
                  }`}
                  style={{
                    backgroundColor: isUnlocked ? achievement.color + "20" : "rgba(255,255,255,0.05)",
                  }}
                >
                  {isUnlocked ? (
                    <Icon className="size-5" style={{ color: achievement.color }} />
                  ) : (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>

                <h3 className="text-sm font-semibold">{achievement.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>

                {isUnlocked && unlockedData && (
                  <p className="mt-2 text-xs font-medium" style={{ color: achievement.color }}>
                    Unlocked {new Date(unlockedData.unlocked_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
