import { apiClient } from "@/lib/api/client";
import type {
  CreateJobPayload,
  Job,
  JobCreator,
  UpdateJobPayload,
} from "@/types/jobs";

interface JobDocument {
  _id: string;
  title: string;
  companyName: string;
  description: string;
  skills: string[];
  salary: number;
  experience: string;
  location: string;
  employmentType: Job["employmentType"];
  status: Job["status"];
  createdBy?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        role: string;
      };
  createdAt: string;
  updatedAt?: string;
}

function mapCreator(
  createdBy: JobDocument["createdBy"]
): JobCreator | undefined {
  if (!createdBy || typeof createdBy === "string") return undefined;
  return {
    id: String(createdBy._id),
    name: createdBy.name,
    email: createdBy.email,
    role: createdBy.role,
  };
}

export function mapJobFromApi(doc: JobDocument): Job {
  return {
    id: String(doc._id),
    title: doc.title,
    companyName: doc.companyName ?? "",
    description: doc.description,
    skills: doc.skills ?? [],
    salary: doc.salary,
    experience: doc.experience,
    location: doc.location,
    employmentType: doc.employmentType,
    status: doc.status,
    createdBy: mapCreator(doc.createdBy),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function fetchJobs(): Promise<Job[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    total: number;
    jobs: JobDocument[];
  }>("/jobs");

  if (!data.success) {
    throw new Error("Failed to load jobs");
  }

  return data.jobs.map(mapJobFromApi);
}

export async function fetchJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<{
    success: boolean;
    job: JobDocument;
  }>(`/jobs/${id}`);

  if (!data.success || !data.job) {
    throw new Error("Job not found");
  }

  return mapJobFromApi(data.job);
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    job: JobDocument;
  }>("/jobs/create", payload);

  if (!data.success) {
    throw new Error("Failed to create job");
  }

  return mapJobFromApi(data.job);
}

export async function updateJob(
  id: string,
  payload: UpdateJobPayload
): Promise<Job> {
  const { data } = await apiClient.put<{
    success: boolean;
    message: string;
    updatedJob: JobDocument;
  }>(`/jobs/${id}`, payload);

  if (!data.success) {
    throw new Error("Failed to update job");
  }

  return mapJobFromApi(data.updatedJob);
}

export async function deleteJob(id: string): Promise<void> {
  const { data } = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/jobs/${id}`);

  if (!data.success) {
    throw new Error("Failed to delete job");
  }
}

export async function closeJob(id: string): Promise<Job> {
  return updateJob(id, { status: "closed" });
}
