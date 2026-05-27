import { apiClient } from "@/lib/api/client";
import {
  mapApplicationForCandidate,
  mapApplicationForRecruiter,
  type ApplicationDocument,
} from "@/lib/api/applications";
import { mapJobFromApi } from "@/lib/api/jobs";
import {
  mapSavedJob,
  type SavedJobDocument,
} from "@/lib/api/saved-jobs";
import type {
  CandidateDashboardData,
  RecruiterDashboardData,
} from "@/types/dashboard";

interface CandidateDashboardApiResponse {
  success: boolean;
  dashboardData: {
    totalApplications: number;
    savedJobs: number;
    applicationStats: CandidateDashboardData["applicationStats"];
    recentApplications: ApplicationDocument[];
    recommendedJobs: Parameters<typeof mapJobFromApi>[0][];
    savedJobsPreview: SavedJobDocument[];
    profileCompletion: number;
  };
  message?: string;
}

function mapDashboardResponse(
  raw: CandidateDashboardApiResponse["dashboardData"]
): CandidateDashboardData {
  return {
    totalApplications: raw.totalApplications,
    savedJobs: raw.savedJobs,
    applicationStats: raw.applicationStats,
    recentApplications: raw.recentApplications.map(
      mapApplicationForCandidate
    ),
    recommendedJobs: raw.recommendedJobs.map(mapJobFromApi),
    savedJobsPreview: raw.savedJobsPreview
      .map(mapSavedJob)
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    profileCompletion: raw.profileCompletion,
  };
}

interface RecruiterDashboardApiResponse {
  success: boolean;
  dashboardData: {
    stats: RecruiterDashboardData["stats"];
    applicationStats: RecruiterDashboardData["applicationStats"];
    pipeline: RecruiterDashboardData["pipeline"];
    applicationsTrend: RecruiterDashboardData["applicationsTrend"];
    recentApplications: ApplicationDocument[];
    openJobs: Parameters<typeof mapJobFromApi>[0][];
  };
  message?: string;
}

function mapRecruiterDashboardResponse(
  raw: RecruiterDashboardApiResponse["dashboardData"]
): RecruiterDashboardData {
  return {
    stats: raw.stats,
    applicationStats: raw.applicationStats,
    pipeline: raw.pipeline,
    applicationsTrend: raw.applicationsTrend,
    recentApplications: raw.recentApplications.map(
      mapApplicationForRecruiter
    ),
    openJobs: raw.openJobs.map(mapJobFromApi),
  };
}

export async function fetchRecruiterDashboard(): Promise<RecruiterDashboardData> {
  const { data } = await apiClient.get<RecruiterDashboardApiResponse>(
    "/dashboard/recruiter"
  );

  if (!data.success || !data.dashboardData) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return mapRecruiterDashboardResponse(data.dashboardData);
}

export async function fetchCandidateDashboard(): Promise<CandidateDashboardData> {
  const { data } = await apiClient.get<CandidateDashboardApiResponse>(
    "/dashboard/candidate"
  );

  if (!data.success || !data.dashboardData) {
    throw new Error(
      data.message || "Failed to load dashboard"
    );
  }

  return mapDashboardResponse(data.dashboardData);
}
