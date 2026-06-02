import type { Metadata } from "next";
import { getCourses } from "@/lib/data/courses";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { BookOpen, Sparkles, Filter } from "lucide-react";

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
    <AuthGuard>
      <DashboardLayout title="Courses" subtitle={`${courses.length} active courses`}>
        <main className="space-y-6">
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-violet/10 via-black/50 to-cyan/10 p-5 sm:p-6 backdrop-blur-xl md:p-8">
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <article className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-violet-300" />
                <span className="text-xs font-medium uppercase tracking-wider text-violet-300">
                  Learning Library
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">
                Your Courses
              </h1>
              <p className="text-sm text-muted-foreground">
                Track progress and continue where you left off
              </p>
            </article>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xl transition-colors hover:bg-white/10"
            >
              <Filter className="size-4" />
              Filter
            </button>
          </div>
        </section>

        {/* Courses Grid */}
        <section aria-label="Course list">
          <article className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </article>
        </section>

        {/* Empty State */}
        {courses.length === 0 && (
          <section className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-20 text-center backdrop-blur-xl">
            <Sparkles className="mb-4 size-12 text-violet-300" />
            <h2 className="text-xl font-semibold">No courses yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start your learning journey today
            </p>
          </section>
        )}
        </main>
      </DashboardLayout>
    </AuthGuard>
  );
}
