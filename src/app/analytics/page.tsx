import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { StudyTimeChart } from "@/components/analytics/StudyTimeChart";
import { CourseProgressChart } from "@/components/analytics/CourseProgressChart";
import { AchievementBadges } from "@/components/analytics/AchievementBadges";
import {
  getDashboardMetrics,
  getStudyTimeByDay,
  getCourseProgress,
  getUserAchievements,
  checkAndUnlockAchievements,
} from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Track your learning progress, study time, and achievements.",
  openGraph: {
    title: "Analytics Dashboard — NextGen Learning",
    description: "Track your learning progress, study time, and achievements.",
  },
};

export default async function AnalyticsPage() {
  // Fetch all data in parallel
  const [metrics, studyTimeData, courseProgress, achievements] = await Promise.all([
    getDashboardMetrics(),
    getStudyTimeByDay(30),
    getCourseProgress(),
    getUserAchievements(),
  ]);

  // Check and unlock achievements in background
  checkAndUnlockAchievements();

  return (
    <AuthGuard>
      <DashboardLayout title="Analytics Dashboard" subtitle="Track your learning progress">
        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards metrics={metrics} />

          {/* Charts */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <StudyTimeChart data={studyTimeData} />
            <CourseProgressChart data={courseProgress} />
          </div>

          {/* Achievements */}
          <AchievementBadges unlockedAchievements={achievements} />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
