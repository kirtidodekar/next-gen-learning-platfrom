"use server";

import { supabaseServer } from "@/integrations/supabase/server";
import type {
  DashboardMetrics,
  StudyTimeData,
  CourseProgressData,
  UserAchievement,
  AchievementType,
} from "@/types/analytics";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return {
      totalStudyTime: 0,
      activeCourses: 0,
      completedCourses: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Get total study time
  const { data: sessions } = await supabaseServer
    .from("study_sessions")
    .select("duration_minutes")
    .eq("user_id", user.id);

  const totalStudyTime = sessions?.reduce((sum: number, s: { duration_minutes: number }) => sum + s.duration_minutes, 0) || 0;

  // Get active courses (progress > 0 and < 100)
  const { data: activeCourses } = await supabaseServer
    .from("courses")
    .select("id")
    .gt("progress", 0)
    .lt("progress", 100);

  // Get completed courses (progress = 100)
  const { data: completedCourses } = await supabaseServer
    .from("courses")
    .select("id")
    .eq("progress", 100);

  // Calculate streaks from study sessions
  const { data: allSessions } = await supabaseServer
    .from("study_sessions")
    .select("started_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  let currentStreak = 0;
  let longestStreak = 0;

  if (allSessions && allSessions.length > 0) {
    const studyDays = new Set<string>();
    allSessions.forEach((session: { started_at: string }) => {
      const date = new Date(session.started_at).toISOString().split("T")[0];
      studyDays.add(date);
    });

    // Calculate current streak
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      if (studyDays.has(dateStr)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculate longest streak
    const sortedDays = Array.from(studyDays).sort();
    let tempStreak = 1;
    longestStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i - 1]);
      const currDate = new Date(sortedDays[i]);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
  }

  return {
    totalStudyTime,
    activeCourses: activeCourses?.length || 0,
    completedCourses: completedCourses?.length || 0,
    currentStreak,
    longestStreak,
  };
}

export async function getStudyTimeByDay(days: number = 30): Promise<StudyTimeData[]> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: sessions } = await supabaseServer
    .from("study_sessions")
    .select("started_at, duration_minutes")
    .eq("user_id", user.id)
    .gte("started_at", startDate.toISOString())
    .order("started_at", { ascending: true });

  if (!sessions || sessions.length === 0) return [];

  // Aggregate by day
  const dailyMap = new Map<string, number>();
  sessions.forEach((session: { started_at: string; duration_minutes: number }) => {
    const date = new Date(session.started_at).toISOString().split("T")[0];
    const current = dailyMap.get(date) || 0;
    dailyMap.set(date, current + session.duration_minutes);
  });

  // Fill in missing days with 0
  const result: StudyTimeData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const minutes = dailyMap.get(dateStr) || 0;

    result.push({
      date: dateStr,
      minutes,
      hours: Math.round((minutes / 60) * 100) / 100,
    });
  }

  return result;
}

export async function getCourseProgress(): Promise<CourseProgressData[]> {
  const { data: courses } = await supabaseServer.from("courses").select("progress");

  if (!courses || courses.length === 0) {
    return [
      { status: "Completed", count: 0, percentage: 0, color: "#10b981" },
      { status: "In Progress", count: 0, percentage: 0, color: "#8b5cf6" },
      { status: "Not Started", count: 0, percentage: 0, color: "#6b7280" },
    ];
  }

  const completed = courses.filter((c: { progress: number }) => c.progress === 100).length;
  const inProgress = courses.filter((c: { progress: number }) => c.progress > 0 && c.progress < 100).length;
  const notStarted = courses.filter((c: { progress: number }) => c.progress === 0).length;
  const total = courses.length;

  return [
    { status: "Completed", count: completed, percentage: Math.round((completed / total) * 100), color: "#10b981" },
    { status: "In Progress", count: inProgress, percentage: Math.round((inProgress / total) * 100), color: "#8b5cf6" },
    { status: "Not Started", count: notStarted, percentage: Math.round((notStarted / total) * 100), color: "#6b7280" },
  ];
}

export async function getUserAchievements(): Promise<UserAchievement[]> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) return [];

  const { data: achievements } = await supabaseServer
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_unlocked", true)
    .order("unlocked_at", { ascending: false });

  return achievements || [];
}

export async function unlockAchievement(achievementType: AchievementType): Promise<void> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) return;

  // Check if already unlocked
  const { data: existing } = await supabaseServer
    .from("user_achievements")
    .select("id")
    .eq("user_id", user.id)
    .eq("achievement_type", achievementType)
    .single();

  if (existing) return; // Already unlocked

  // Insert new achievement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseServer.from("user_achievements") as any).insert({
    user_id: user.id,
    achievement_type: achievementType,
    is_unlocked: true,
  });
}

export async function checkAndUnlockAchievements(): Promise<void> {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) return;

  // Check first lesson
  const { count: sessionCount } = await supabaseServer
    .from("study_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (sessionCount && sessionCount > 0) {
    await unlockAchievement("first_lesson");
  }

  // Check course completion
  const { count: completedCourses } = await supabaseServer
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("progress", 100);

  if (completedCourses && completedCourses > 0) {
    await unlockAchievement("course_completed");
  }

  // Streak achievements will be checked based on dashboard metrics
  const metrics = await getDashboardMetrics();
  if (metrics.currentStreak >= 7) {
    await unlockAchievement("streak_7_days");
  }
  if (metrics.currentStreak >= 30) {
    await unlockAchievement("streak_30_days");
  }
}
