"use client";

import { ApplicationsTable } from "@/components/dashboard/applications-table";
import type { Application } from "@/types/applications";

interface RecruiterApplicationsViewProps {
  applications: Application[];
}

export function RecruiterApplicationsView({
  applications,
}: RecruiterApplicationsViewProps) {
  return (
    <ApplicationsTable applications={applications} variant="recruiter" />
  );
}
