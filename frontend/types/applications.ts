export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location?: string;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  reviewed: "Under review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};
