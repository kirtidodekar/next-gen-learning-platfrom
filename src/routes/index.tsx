import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { coursesQueryOptions } from "@/lib/queries/courses";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { StatTile } from "@/components/dashboard/StatTile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Next-Gen Learning" },
      { name: "description", content: "Your personalized learning dashboard with courses, streaks, and activity insights." },
      { property: "og:title", content: "Next-Gen Learning Dashboard" },
      { property: "og:description", content: "Premium learning platform with real-time progress tracking." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQueryOptions),
  component: DashboardPage,
  pendingComponent: PendingDashboard,
  errorComponent: DashboardError,
  notFoundComponent: () => (
    <DashboardLayout title="Not found"><p className="text-muted-foreground">Page not found.</p></DashboardLayout>
  ),
});

function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Continue learning where you left off">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}

function DashboardContent() {
  const { data: courses } = useSuspenseQuery(coursesQueryOptions);
  return (
    <BentoGrid>
      <HeroTile />
      <StatTile />
      {courses.map((course, i) => (
        <CourseCard key={course.id} course={course} index={i} />
      ))}
      <ActivityTile />
    </BentoGrid>
  );
}

function PendingDashboard() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Loading your latest activity…">
      <DashboardSkeleton />
    </DashboardLayout>
  );
}

function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <DashboardLayout title="Dashboard">
      <div role="alert" className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-semibold">Unable to load dashboard data.</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 focus-ring"
        >
          Try again
        </button>
      </div>
    </DashboardLayout>
  );
}
