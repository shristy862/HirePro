import { apiClient } from "@/lib/api/client";
import { mapJobFromApi } from "@/lib/api/jobs";
import type { Job } from "@/types/jobs";

export interface SavedJobDocument {
  _id: string;
  user: string;
  job: Parameters<typeof mapJobFromApi>[0] | null;
  createdAt: string;
}

export interface SavedJobEntry {
  id: string;
  job: Job;
  savedAt: string;
}

export function mapSavedJob(
  doc: SavedJobDocument
): SavedJobEntry | null {
  if (!doc.job || typeof doc.job !== "object") return null;
  return {
    id: String(doc._id),
    job: mapJobFromApi(doc.job),
    savedAt: doc.createdAt,
  };
}

export async function fetchSavedJobs(): Promise<SavedJobEntry[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    total: number;
    savedJobs: SavedJobDocument[];
  }>("/saved-jobs");

  if (!data.success) {
    throw new Error("Failed to load saved jobs");
  }

  return data.savedJobs
    .map(mapSavedJob)
    .filter((entry): entry is SavedJobEntry => entry !== null);
}

export async function saveJobApi(jobId: string): Promise<void> {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
  }>(`/saved-jobs/${jobId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to save job");
  }
}

export async function unsaveJobApi(jobId: string): Promise<void> {
  const { data } = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/saved-jobs/${jobId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to remove saved job");
  }
}

export async function fetchSavedJobIds(): Promise<string[]> {
  const entries = await fetchSavedJobs();
  return entries.map((e) => e.job.id);
}
