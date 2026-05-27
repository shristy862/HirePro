import type { RecruiterDashboardData } from "@/types/dashboard";

export const RECRUITER_DASHBOARD_ROUTE = "/recruiter" as const;

export const RECRUITER_DASHBOARD_LINKS = {
  jobs: "/jobs",
  applications: "/applications",
} as const;

export const RECRUITER_STAT_DEFINITIONS = [
  {
    id: "openJobs",
    label: "Open jobs",
    getValue: (data: RecruiterDashboardData) => data.stats.openJobs,
  },
  {
    id: "totalApplications",
    label: "Total applications",
    getValue: (data: RecruiterDashboardData) => data.stats.totalApplications,
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    getValue: (data: RecruiterDashboardData) =>
      data.applicationStats.shortlisted,
  },
  {
    id: "pending",
    label: "Pending review",
    getValue: (data: RecruiterDashboardData) =>
      data.applicationStats.pending,
  },
] as const;

export const PIPELINE_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
] as const;
