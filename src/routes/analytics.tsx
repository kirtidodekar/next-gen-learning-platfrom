import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { StatTile } from "@/components/dashboard/StatTile";
import { BentoGrid } from "@/components/dashboard/BentoGrid";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Next-Gen Learning" },
      { name: "description", content: "Track learning activity and trends over time." },
      { property: "og:title", content: "Analytics — Next-Gen Learning" },
      { property: "og:description", content: "Track learning activity and trends over time." },
    ],
  }),
  component: () => (
    <DashboardLayout title="Analytics" subtitle="Your learning trends">
      <BentoGrid>
        <StatTile />
        <StatTile />
        <StatTile />
        <ActivityTile />
      </BentoGrid>
    </DashboardLayout>
  ),
});
