import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function AnalyticsLoading() {
  return (
    <DashboardLayout title="Analytics Dashboard" subtitle="Loading analytics…">
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
