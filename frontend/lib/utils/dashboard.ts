import { CANDIDATE_STAT_DEFINITIONS } from "@/constants/candidate-dashboard";
import {
  PIPELINE_CHART_COLORS,
  RECRUITER_STAT_DEFINITIONS,
} from "@/constants/recruiter-dashboard";
import type {
  CandidateDashboardData,
  PipelineStageCount,
  RecruiterDashboardData,
} from "@/types/dashboard";
import type { ChartDataPoint, DashboardStats } from "@/types";
import type { ProfileCompletion } from "@/types/profile";
import { PROFILE_FIELD_KEYS } from "@/types/profile";

export function buildCandidateDashboardStats(
  data: CandidateDashboardData
): DashboardStats[] {
  return CANDIDATE_STAT_DEFINITIONS.map((definition) => ({
    label: definition.label,
    value: definition.getValue(data),
    change: 0,
    trend: "neutral" as const,
  }));
}

export function buildRecruiterDashboardStats(
  data: RecruiterDashboardData
): DashboardStats[] {
  return RECRUITER_STAT_DEFINITIONS.map((definition) => ({
    label: definition.label,
    value: definition.getValue(data),
    change: 0,
    trend: "neutral" as const,
  }));
}

export function buildPipelineChartData(
  pipeline: PipelineStageCount[]
): { stage: string; count: number; fill: string }[] {
  return pipeline.map((item, index) => ({
    ...item,
    fill:
      PIPELINE_CHART_COLORS[index % PIPELINE_CHART_COLORS.length] ??
      "var(--chart-1)",
  }));
}

export function toProfileCompletionFromPercentage(
  percentage: number
): ProfileCompletion {
  const fields = Object.fromEntries(
    PROFILE_FIELD_KEYS.map((key) => [key, false])
  ) as ProfileCompletion["fields"];

  return {
    percentage,
    isComplete: percentage >= 100,
    fields,
  };
}
