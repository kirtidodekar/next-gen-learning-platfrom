import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Next-Gen Learning" },
      { name: "description", content: "Manage your preferences and account." },
      { property: "og:title", content: "Settings — Next-Gen Learning" },
      { property: "og:description", content: "Manage your preferences and account." },
    ],
  }),
  component: () => (
    <DashboardLayout title="Settings" subtitle="Manage preferences">
      <div className="gradient-border rounded-2xl bg-card/80 p-6 shadow-card">
        <h2 className="text-base font-semibold">Coming soon</h2>
        <p className="mt-1 text-sm text-muted-foreground">Account, appearance, and notification settings will live here.</p>
      </div>
    </DashboardLayout>
  ),
});
