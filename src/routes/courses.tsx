import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { coursesQueryOptions } from "@/lib/queries/courses";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { BentoGrid } from "@/components/dashboard/BentoGrid";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Next-Gen Learning" },
      { name: "description", content: "Browse your enrolled courses with live progress." },
      { property: "og:title", content: "Courses — Next-Gen Learning" },
      { property: "og:description", content: "Browse your enrolled courses with live progress." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQueryOptions),
  component: CoursesPage,
  errorComponent: ({ error }) => (
    <DashboardLayout title="Courses">
      <p role="alert" className="text-sm text-muted-foreground">Couldn't load courses: {error.message}</p>
    </DashboardLayout>
  ),
  notFoundComponent: () => <DashboardLayout title="Courses"><p>Not found.</p></DashboardLayout>,
});

function CoursesPage() {
  const { data: courses } = useSuspenseQuery(coursesQueryOptions);
  return (
    <DashboardLayout title="Courses" subtitle={`${courses.length} active courses`}>
      <BentoGrid>
        {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
      </BentoGrid>
    </DashboardLayout>
  );
}
