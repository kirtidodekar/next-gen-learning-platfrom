import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function CoursesLoading() {
  return (
    <DashboardLayout title="Courses" subtitle="Loading courses…">
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
