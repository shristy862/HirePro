export type UserRole = "recruiter" | "candidate";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  title?: string;
}

export type {
  Job,
  JobStatus,
  EmploymentType,
  JobCreator,
  CreateJobPayload,
  UpdateJobPayload,
} from "@/types/jobs";

export type {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
} from "@/types/applications";

export type {
  CandidateDashboardData,
  CandidateApplicationStats,
  RecruiterDashboardData,
  RecruiterDashboardStats,
  PipelineStageCount,
} from "@/types/dashboard";

export interface DashboardStats {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  name: string;
  applications: number;
  interviews: number;
  hires: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
