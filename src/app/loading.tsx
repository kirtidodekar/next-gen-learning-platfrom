import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Loading your latest activity…">
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
