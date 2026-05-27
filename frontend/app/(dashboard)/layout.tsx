"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileProvider } from "@/context/profile-context";
import { SavedJobsProvider } from "@/context/saved-jobs-context";
import { ApplicationsProvider } from "@/context/applications-context";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <ProfileProvider>
        <ApplicationsProvider>
          <SavedJobsProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </SavedJobsProvider>
        </ApplicationsProvider>
      </ProfileProvider>
    </RoleGuard>
  );
}
