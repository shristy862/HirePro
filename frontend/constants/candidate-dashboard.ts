import type { CandidateApplicationStats } from "@/types/dashboard";

export const CANDIDATE_DASHBOARD_ROUTE = "/candidate" as const;

export const CANDIDATE_DASHBOARD_LINKS = {
  applications: "/applications",
  savedJobs: "/saved-jobs",
  jobs: "/jobs",
  settings: "/settings",
} as const;

export const CANDIDATE_STAT_DEFINITIONS = [
  {
    id: "totalApplications",
    label: "Applications",
    getValue: (data: { totalApplications: number }) =>
      data.totalApplications,
  },
  {
    id: "savedJobs",
    label: "Saved jobs",
    getValue: (data: { savedJobs: number }) => data.savedJobs,
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    getValue: (data: { applicationStats: CandidateApplicationStats }) =>
      data.applicationStats.shortlisted,
  },
  {
    id: "underReview",
    label: "Under review",
    getValue: (data: { applicationStats: CandidateApplicationStats }) =>
      data.applicationStats.reviewed,
  },
] as const;
