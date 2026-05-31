import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your preferences and account.",
  openGraph: {
    title: "Settings — Next-Gen Learning",
    description: "Manage your preferences and account.",
  },
};

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Manage preferences">
      <div className="gradient-border rounded-2xl bg-card/80 p-6 shadow-card">
        <h2 className="text-base font-semibold">Coming soon</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Account, appearance, and notification settings will live here.
        </p>
      </div>
    </DashboardLayout>
  );
}
