import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { StatTile } from "@/components/dashboard/StatTile";
import { BentoGrid } from "@/components/dashboard/BentoGrid";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track learning activity and trends over time.",
  openGraph: {
    title: "Analytics — Next-Gen Learning",
    description: "Track learning activity and trends over time.",
  },
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Your learning trends">
      <BentoGrid>
        <StatTile />
        <StatTile />
        <StatTile />
        <ActivityTile />
      </BentoGrid>
    </DashboardLayout>
  );
}
