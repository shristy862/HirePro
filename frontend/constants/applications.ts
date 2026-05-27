import type { ApplicationStatus } from "@/types/applications";
import { APPLICATION_STATUS_LABELS } from "@/types/applications";

export const APPLICATIONS_ROUTE = "/applications" as const;

export function getApplicationDetailPath(applicationId: string): string {
  return `${APPLICATIONS_ROUTE}/${applicationId}`;
}

export const APPLICATION_STATUS_FILTER_OPTIONS: {
  label: string;
  value: ApplicationStatus;
}[] = (
  Object.entries(APPLICATION_STATUS_LABELS) as [
    ApplicationStatus,
    string,
  ][]
).map(([value, label]) => ({ label, value }));

export const APPLICATION_STATUS_UPDATE_OPTIONS =
  APPLICATION_STATUS_FILTER_OPTIONS;
