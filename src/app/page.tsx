import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getCourses } from "@/lib/data/courses";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { StatTile } from "@/components/dashboard/StatTile";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your personalized learning dashboard with courses, streaks, and activity insights.",
  openGraph: {
    title: "Next-Gen Learning Dashboard",
    description: "Premium learning platform with real-time progress tracking.",
  },
};

export default async function DashboardPage() {
  const courses = await getCourses();

  return (
    <DashboardLayout title="Dashboard" subtitle="Continue learning where you left off">
      <BentoGrid>
        <HeroTile />
        <StatTile />
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
        <ActivityTile />
      </BentoGrid>
    </DashboardLayout>
  );
}
