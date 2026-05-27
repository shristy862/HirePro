import type { Application } from "@/types/applications";
import type { Job } from "@/types/jobs";
import type { ChartDataPoint } from "@/types";

export interface SavedJobPreview {
  id: string;
  job: Job;
  savedAt: string;
}

export interface CandidateApplicationStats {
  pending: number;
  reviewed: number;
  shortlisted: number;
  rejected: number;
}

export interface CandidateDashboardData {
  totalApplications: number;
  savedJobs: number;
  applicationStats: CandidateApplicationStats;
  recentApplications: Application[];
  recommendedJobs: Job[];
  savedJobsPreview: SavedJobPreview[];
  profileCompletion: number;
}

export interface RecruiterDashboardStats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
}

export interface PipelineStageCount {
  stage: string;
  count: number;
}

export interface RecruiterDashboardData {
  stats: RecruiterDashboardStats;
  applicationStats: CandidateApplicationStats;
  pipeline: PipelineStageCount[];
  applicationsTrend: ChartDataPoint[];
  recentApplications: Application[];
  openJobs: Job[];
}
