import { apiClient } from "@/lib/api/client";
import type { Application, ApplicationStatus } from "@/types/applications";

export interface ApplicationDocument {
  _id: string;
  applicant?: string | { _id: string; name: string; email: string };
  job?:
    | string
    | {
        _id: string;
        title: string;
        companyName?: string;
        location?: string;
      };
  resume?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
}

function mapJobFields(job: ApplicationDocument["job"]) {
  if (!job || typeof job === "string") {
    return {
      jobId: typeof job === "string" ? job : "",
      jobTitle: "Unknown role",
      company: "—",
      location: undefined as string | undefined,
    };
  }
  return {
    jobId: String(job._id),
    jobTitle: job.title,
    company: job.companyName ?? "—",
    location: job.location,
  };
}

export function mapApplicationForCandidate(
  doc: ApplicationDocument
): Application {
  const jobFields = mapJobFields(doc.job);
  return {
    id: String(doc._id),
    ...jobFields,
    candidateName: "",
    candidateEmail: "",
    status: doc.status,
    appliedAt: doc.createdAt,
    resumeUrl: doc.resume,
    coverLetter: doc.coverLetter,
  };
}

export function mapApplicationForRecruiter(
  doc: ApplicationDocument
): Application {
  const jobFields = mapJobFields(doc.job);
  const applicant = doc.applicant;
  const applicantObj =
    applicant && typeof applicant !== "string" ? applicant : null;

  return {
    id: String(doc._id),
    ...jobFields,
    candidateName: applicantObj?.name ?? "Unknown",
    candidateEmail: applicantObj?.email ?? "",
    status: doc.status,
    appliedAt: doc.createdAt,
    resumeUrl: doc.resume,
    coverLetter: doc.coverLetter,
  };
}

/** Keep candidate/job fields when API returns unpopulated documents after status update */
export function mergeRecruiterApplication(
  previous: Application,
  updated: Application
): Application {
  return {
    ...previous,
    ...updated,
    candidateName:
      updated.candidateName !== "Unknown"
        ? updated.candidateName
        : previous.candidateName,
    candidateEmail: updated.candidateEmail || previous.candidateEmail,
    jobTitle:
      updated.jobTitle !== "Unknown role"
        ? updated.jobTitle
        : previous.jobTitle,
    company: updated.company !== "—" ? updated.company : previous.company,
    location: updated.location ?? previous.location,
    coverLetter: updated.coverLetter ?? previous.coverLetter,
    resumeUrl: updated.resumeUrl ?? previous.resumeUrl,
  };
}

export async function fetchMyApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    total: number;
    applications: ApplicationDocument[];
  }>("/applications/my-applications");

  if (!data.success) {
    throw new Error("Failed to load applications");
  }

  return data.applications.map(mapApplicationForCandidate);
}

export async function fetchRecruiterApplicationById(
  applicationId: string
): Promise<Application> {
  const { data } = await apiClient.get<{
    success: boolean;
    application: ApplicationDocument;
    message?: string;
  }>(`/applications/recruiter/${applicationId}`);

  if (!data.success || !data.application) {
    throw new Error(data.message || "Application not found");
  }

  return mapApplicationForRecruiter(data.application);
}

export async function fetchRecruiterApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    total: number;
    applications: ApplicationDocument[];
  }>("/applications/recruiter/all");

  if (!data.success) {
    throw new Error("Failed to load applications");
  }

  return data.applications.map(mapApplicationForRecruiter);
}

export async function fetchJobApplicants(
  jobId: string
): Promise<Application[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    total: number;
    applicants: ApplicationDocument[];
  }>(`/applications/job/${jobId}/applicants`);

  if (!data.success) {
    throw new Error("Failed to load applicants");
  }

  return data.applicants.map(mapApplicationForRecruiter);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> {
  const { data } = await apiClient.put<{
    success: boolean;
    message?: string;
    application: ApplicationDocument;
  }>(`/applications/status/${applicationId}`, { status });

  if (!data.success || !data.application) {
    throw new Error(data.message || "Failed to update application status");
  }

  return mapApplicationForRecruiter(data.application);
}

export async function applyToJob(
  jobId: string,
  payload: { coverLetter: string; resume?: string }
): Promise<void> {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
  }>(`/applications/apply/${jobId}`, payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to apply");
  }
}

export function filterApplications(
  applications: Application[],
  params?: { search?: string; status?: string }
): Application[] {
  let result = [...applications];

  if (params?.status && params.status !== "all") {
    result = result.filter((a) => a.status === params.status);
  }

  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    result = result.filter(
      (a) =>
        a.jobTitle.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.candidateName.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q)
    );
  }

  return result;
}
