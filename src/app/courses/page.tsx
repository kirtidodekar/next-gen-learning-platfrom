import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getCourses } from "@/lib/data/courses";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { BentoGrid } from "@/components/dashboard/BentoGrid";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse your enrolled courses with live progress.",
  openGraph: {
    title: "Courses — Next-Gen Learning",
    description: "Browse your enrolled courses with live progress.",
  },
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <DashboardLayout title="Courses" subtitle={`${courses.length} active courses`}>
      <BentoGrid>
        {courses.map((c, i) => (
          <CourseCard key={c.id} course={c} index={i} />
        ))}
      </BentoGrid>
    </DashboardLayout>
  );
}
